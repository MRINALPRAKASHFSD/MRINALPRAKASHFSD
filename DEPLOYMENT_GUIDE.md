# Deployment Guide - Bihar Service Marketplace

## Overview

This guide provides step-by-step instructions for deploying the Bihar Service Marketplace platform across different environments (Development, Staging, Production).

---

## Infrastructure Architecture

### Cloud Provider: AWS (Amazon Web Services)

**Why AWS?**
- Reliable and scalable infrastructure
- Global reach with regional availability
- Comprehensive service offerings
- Strong security and compliance
- Cost-effective for startups

**Alternative**: Google Cloud Platform (GCP) - similar setup process

---

## Environment Setup

### 1. Development Environment

**Purpose**: Local development and testing

**Components:**
- Local Node.js server
- Local MongoDB instance
- Local Redis cache
- React Native development setup

**Setup Steps:**

```bash
# 1. Clone repository
git clone https://github.com/your-org/bihar-service-marketplace.git
cd bihar-service-marketplace

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with local configuration

# 4. Start MongoDB locally
mongod --dbpath /data/db

# 5. Start Redis locally
redis-server

# 6. Start backend server
npm run dev

# 7. Install mobile app dependencies (separate terminal)
cd ../mobile
npm install

# 8. Run mobile app
# For iOS
npm run ios

# For Android
npm run android
```

**Environment Variables (.env)**
```bash
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/bihar-services-dev
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-dev-secret-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d

# SMS Gateway (for OTP)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage
STORAGE_PROVIDER=local
UPLOAD_PATH=./uploads

# Logs
LOG_LEVEL=debug
```

---

### 2. Staging Environment

**Purpose**: Pre-production testing, QA validation

**Infrastructure:**

```
┌─────────────────────────────────────────────────┐
│              AWS Cloud (Staging)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐         ┌─────────────┐       │
│  │   Route 53  │────────▶│  CloudFront │       │
│  │     DNS     │         │     CDN     │       │
│  └─────────────┘         └──────┬──────┘       │
│                                 │               │
│                         ┌───────▼──────┐        │
│                         │    ALB       │        │
│                         │Load Balancer │        │
│                         └───────┬──────┘        │
│                                 │               │
│              ┌──────────────────┼─────────────┐ │
│              │                  │             │ │
│         ┌────▼────┐       ┌────▼────┐        │ │
│         │  ECS    │       │  ECS    │        │ │
│         │Task 1   │       │Task 2   │        │ │
│         │(API)    │       │(API)    │        │ │
│         └────┬────┘       └────┬────┘        │ │
│              │                  │             │ │
│              └──────────┬───────┘             │ │
│                         │                     │ │
│           ┌─────────────▼────────────┐        │ │
│           │   Amazon DocumentDB      │        │ │
│           │   (MongoDB Compatible)   │        │ │
│           └──────────────────────────┘        │ │
│                                               │ │
│           ┌──────────────────────────┐        │ │
│           │   ElastiCache (Redis)    │        │ │
│           └──────────────────────────┘        │ │
│                                               │ │
│           ┌──────────────────────────┐        │ │
│           │        S3 Bucket         │        │ │
│           │    (File Storage)        │        │ │
│           └──────────────────────────┘        │ │
└─────────────────────────────────────────────────┘
```

**Setup Steps:**

#### Step 1: AWS Account Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter: Access Key, Secret Key, Region (ap-south-1 for Mumbai)
```

#### Step 2: Create VPC and Network
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=bihar-services-staging-vpc}]'

# Create subnets (public and private)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone ap-south-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx
```

#### Step 3: Setup Database (DocumentDB)
```bash
# Create DocumentDB cluster
aws docdb create-db-cluster \
    --db-cluster-identifier bihar-services-staging \
    --engine docdb \
    --master-username admin \
    --master-user-password YourSecurePassword123 \
    --vpc-security-group-ids sg-xxx \
    --db-subnet-group-name bihar-services-subnet-group

# Create instance
aws docdb create-db-instance \
    --db-instance-identifier bihar-services-staging-instance \
    --db-instance-class db.t3.medium \
    --engine docdb \
    --db-cluster-identifier bihar-services-staging
```

#### Step 4: Setup Redis (ElastiCache)
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
    --cache-cluster-id bihar-services-staging-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --cache-subnet-group-name bihar-services-subnet-group
```

#### Step 5: Setup S3 Bucket
```bash
# Create S3 bucket
aws s3 mb s3://bihar-services-staging-uploads

# Set bucket policy for public read
aws s3api put-bucket-policy \
    --bucket bihar-services-staging-uploads \
    --policy file://s3-bucket-policy.json

# Enable CORS
aws s3api put-bucket-cors \
    --bucket bihar-services-staging-uploads \
    --cors-configuration file://s3-cors-config.json
```

#### Step 6: Setup ECS (Container Service)
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name bihar-services-staging

# Build and push Docker image
docker build -t bihar-services-api:staging .
docker tag bihar-services-api:staging <account-id>.dkr.ecr.ap-south-1.amazonaws.com/bihar-services-api:staging
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/bihar-services-api:staging

# Create task definition (JSON file)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
    --cluster bihar-services-staging \
    --service-name bihar-services-api \
    --task-definition bihar-services-api:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

#### Step 7: Setup Load Balancer
```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
    --name bihar-services-staging-alb \
    --subnets subnet-xxx subnet-yyy \
    --security-groups sg-xxx

# Create target group
aws elbv2 create-target-group \
    --name bihar-services-staging-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-xxx \
    --health-check-path /health

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:xxx \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:xxx
```

#### Step 8: Setup CloudFront (CDN)
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
    --origin-domain-name bihar-services-staging-alb-xxx.ap-south-1.elb.amazonaws.com \
    --default-root-object index.html
```

#### Step 9: Configure Environment Variables
```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
    --name bihar-services-staging-secrets \
    --secret-string file://secrets.json

# Update ECS task definition to use secrets
# Secrets are injected as environment variables at runtime
```

**Staging Environment Variables:**
```json
{
  "NODE_ENV": "staging",
  "PORT": "3000",
  "APP_URL": "https://staging-api.biharservices.com",
  
  "MONGODB_URI": "mongodb://admin:password@bihar-services-staging.cluster-xxx.docdb.amazonaws.com:27017/bihar-services?ssl=true",
  "REDIS_URL": "redis://bihar-services-staging-redis.xxx.cache.amazonaws.com:6379",
  
  "JWT_SECRET": "staging-jwt-secret-key-here",
  "JWT_EXPIRES_IN": "15m",
  "REFRESH_TOKEN_SECRET": "staging-refresh-secret-key",
  "REFRESH_TOKEN_EXPIRES_IN": "7d",
  
  "SMS_PROVIDER": "twilio",
  "TWILIO_ACCOUNT_SID": "staging-account-sid",
  "TWILIO_AUTH_TOKEN": "staging-auth-token",
  "TWILIO_PHONE_NUMBER": "+91XXXXXXXXXX",
  
  "STORAGE_PROVIDER": "s3",
  "AWS_S3_BUCKET": "bihar-services-staging-uploads",
  "AWS_REGION": "ap-south-1",
  
  "LOG_LEVEL": "info"
}
```

---

### 3. Production Environment

**Purpose**: Live production system serving real users

**Infrastructure:** Same as staging but with:
- **Higher capacity**: More ECS tasks, larger DB instances
- **Multi-AZ deployment**: High availability
- **Auto-scaling**: Based on load
- **Enhanced monitoring**: CloudWatch, New Relic
- **Backup**: Automated daily backups
- **CDN**: Global CloudFront distribution
- **SSL/TLS**: HTTPS with ACM certificate

**Additional Production Setup:**

#### Step 1: SSL Certificate
```bash
# Request certificate from ACM
aws acm request-certificate \
    --domain-name biharservices.com \
    --subject-alternative-names *.biharservices.com \
    --validation-method DNS

# Add CNAME records to Route 53 for validation
# Certificate will be automatically validated and issued
```

#### Step 2: Route 53 DNS
```bash
# Create hosted zone
aws route53 create-hosted-zone \
    --name biharservices.com \
    --caller-reference $(date +%s)

# Create A record for API
aws route53 change-resource-record-sets \
    --hosted-zone-id Z123456789ABC \
    --change-batch file://dns-record.json
```

#### Step 3: Auto-Scaling
```bash
# Create auto-scaling target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/bihar-services-production/bihar-services-api \
    --min-capacity 2 \
    --max-capacity 10

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
    --policy-name bihar-services-cpu-scaling \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/bihar-services-production/bihar-services-api \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

**Scaling Policy (scaling-policy.json):**
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleInCooldown": 300,
  "ScaleOutCooldown": 60
}
```

#### Step 4: Monitoring & Alerts
```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
    --dashboard-name bihar-services-production \
    --dashboard-body file://dashboard-config.json

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
    --alarm-name bihar-services-high-cpu \
    --alarm-description "Alert when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:ap-south-1:xxx:bihar-services-alerts
```

#### Step 5: Backup Strategy
```bash
# Enable automated backups for DocumentDB
aws docdb modify-db-cluster \
    --db-cluster-identifier bihar-services-production \
    --backup-retention-period 30 \
    --preferred-backup-window "03:00-04:00"

# Setup S3 versioning for uploaded files
aws s3api put-bucket-versioning \
    --bucket bihar-services-production-uploads \
    --versioning-configuration Status=Enabled

# Setup S3 lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
    --bucket bihar-services-production-uploads \
    --lifecycle-configuration file://s3-lifecycle.json
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main          # Production
      - staging       # Staging
      - develop       # Development

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: bihar-services-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster bihar-services-${{ github.ref_name }} \
            --service bihar-services-api \
            --force-new-deployment
      
      - name: Verify deployment
        run: |
          aws ecs wait services-stable \
            --cluster bihar-services-${{ github.ref_name }} \
            --services bihar-services-api
```

---

## Database Migration

### Migration Strategy

**Tools**: 
- `migrate-mongo` for MongoDB migrations
- Custom migration scripts

**Process:**

1. **Create Migration**
```bash
npm run migration:create add-categories-collection
```

2. **Migration File Structure**
```javascript
// migrations/20241029-add-categories-collection.js
module.exports = {
  async up(db, client) {
    // Create collection
    await db.createCollection('categories');
    
    // Create indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ phase: 1, isActive: 1 });
    
    // Insert initial data
    await db.collection('categories').insertMany([
      {
        name: 'Electrician Services',
        nameHindi: 'बिजली मिस्त्री सेवाएं',
        slug: 'electrician-services',
        phase: 'mvp',
        level: 0,
        isActive: true,
        createdAt: new Date()
      }
    ]);
  },

  async down(db, client) {
    // Rollback
    await db.collection('categories').drop();
  }
};
```

3. **Run Migration**
```bash
# Check migration status
npm run migration:status

# Run pending migrations
npm run migration:up

# Rollback last migration
npm run migration:down
```

---

## Monitoring & Maintenance

### Health Checks

**Endpoint**: `GET /health`

```javascript
{
  "status": "healthy",
  "timestamp": "2024-10-29T08:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "available"
  },
  "version": "1.0.0"
}
```

### Logging

**Tools**: 
- CloudWatch Logs
- ELK Stack (Elasticsearch, Logstash, Kibana)

**Log Levels**:
- ERROR: Critical issues requiring immediate attention
- WARN: Warning messages for potential issues
- INFO: General information about system operation
- DEBUG: Detailed debugging information (dev only)

**Log Format (JSON)**:
```json
{
  "timestamp": "2024-10-29T08:00:00.000Z",
  "level": "info",
  "message": "Booking created successfully",
  "context": {
    "userId": "64a1b2c3d4e5f6789",
    "bookingId": "64a1b2c3d4e5f6791",
    "action": "booking.create"
  },
  "requestId": "req-123456",
  "ip": "192.168.1.1"
}
```

### Alerts

**Critical Alerts** (Immediate action required):
- Service downtime (>1 minute)
- Database connection failure
- High error rate (>5%)
- Payment gateway failure

**Warning Alerts** (Requires monitoring):
- High CPU usage (>80%)
- High memory usage (>85%)
- Slow response times (>1 second)
- High disk usage (>85%)

**Alert Channels**:
- Email (for all alerts)
- SMS (for critical alerts)
- Slack/Discord (for team notifications)
- PagerDuty (for on-call rotation)

---

## Security Checklist

### Pre-Deployment Security

- [ ] All secrets stored in AWS Secrets Manager
- [ ] SSL/TLS certificates configured
- [ ] Security groups configured (least privilege)
- [ ] Database encryption at rest enabled
- [ ] Backup encryption enabled
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using ODM)
- [ ] XSS protection headers set
- [ ] CSRF tokens implemented
- [ ] Password hashing (bcrypt)
- [ ] JWT token expiration configured
- [ ] File upload restrictions (size, type)
- [ ] DDoS protection (AWS Shield)
- [ ] Regular security audits scheduled

---

## Rollback Procedure

### If deployment fails:

1. **Immediate Rollback**
```bash
# Get previous task definition
aws ecs describe-task-definition \
    --task-definition bihar-services-api \
    --query 'taskDefinition.revision'

# Update service to previous version
aws ecs update-service \
    --cluster bihar-services-production \
    --service bihar-services-api \
    --task-definition bihar-services-api:PREVIOUS_REVISION
```

2. **Database Rollback**
```bash
# Run down migration
npm run migration:down

# Restore from backup if needed
aws docdb restore-db-cluster-from-snapshot \
    --db-cluster-identifier bihar-services-production-restore \
    --snapshot-identifier bihar-services-snapshot-YYYYMMDD
```

3. **Notify Team**
- Post in Slack channel
- Update status page
- Inform stakeholders

---

## Disaster Recovery

### Backup Strategy

**Daily Backups**:
- Database: Automated snapshots at 3 AM IST
- File storage: S3 versioning + lifecycle policy
- Configuration: Version controlled in Git

**Retention**:
- Daily backups: 30 days
- Weekly backups: 90 days
- Monthly backups: 1 year

### Recovery Procedure

1. **Assess the situation**
2. **Activate disaster recovery plan**
3. **Restore from backups**
4. **Verify data integrity**
5. **Switch DNS to backup infrastructure**
6. **Communicate with users**
7. **Post-mortem analysis**

**RTO (Recovery Time Objective)**: 15 minutes
**RPO (Recovery Point Objective)**: 5 minutes

---

## Cost Optimization

### AWS Cost Management

**Monthly Estimates**:

**Staging Environment**: ~$200/month
- ECS Fargate: $50
- DocumentDB: $80
- ElastiCache: $20
- S3: $10
- Data transfer: $10
- CloudWatch: $10
- Other: $20

**Production Environment (Initial)**: ~$800/month
- ECS Fargate: $200
- DocumentDB: $300
- ElastiCache: $80
- S3: $50
- Data transfer: $70
- CloudWatch: $30
- Route 53: $10
- ACM: $0 (free)
- Other: $60

**Cost Optimization Tips**:
1. Use Reserved Instances for predictable workloads
2. Enable auto-scaling to reduce idle resources
3. Use S3 Intelligent-Tiering
4. Optimize Docker images (smaller size)
5. Enable CloudWatch Logs retention limits
6. Use AWS Cost Explorer for analysis
7. Set up billing alerts

---

## Performance Optimization

### Caching Strategy

**Redis Cache**:
- Session data: 15 minutes TTL
- Category data: 1 hour TTL
- Provider profiles: 30 minutes TTL
- Search results: 5 minutes TTL
- Featured providers: 10 minutes TTL

**CloudFront CDN**:
- Static assets: 1 year cache
- API responses (GET): 5 minutes cache
- Images: 30 days cache

### Database Optimization

**Indexes**: Create compound indexes for common queries
**Connection Pooling**: Limit connections (max 100)
**Query Optimization**: Use explain() to analyze slow queries
**Sharding**: Plan for horizontal sharding at 100GB+ data

---

## Checklist Before Going Live

### Technical
- [ ] All tests passing
- [ ] Load testing completed (10,000+ concurrent users)
- [ ] Security audit completed
- [ ] SSL certificate installed and verified
- [ ] Backup and restore tested
- [ ] Monitoring and alerts configured
- [ ] Error tracking (Sentry) setup
- [ ] CDN configured and tested
- [ ] Database indexes optimized
- [ ] API documentation published

### Business
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Refund/Cancellation policy defined
- [ ] Support channels established
- [ ] Payment gateway tested
- [ ] Commission structure configured
- [ ] Provider onboarding materials ready
- [ ] Customer support trained

### Legal & Compliance
- [ ] Business registered
- [ ] GST registration complete
- [ ] Data protection compliance
- [ ] Insurance coverage obtained
- [ ] Contracts with providers prepared
- [ ] Liability disclaimers added

---

## Support & Maintenance

### 24/7 Support Setup

**Support Channels**:
- Phone: +91-XXXXXXXXXX
- Email: support@biharservices.com
- In-app chat
- WhatsApp: +91-XXXXXXXXXX

**Support Tiers**:
- L1: Customer service (basic queries)
- L2: Technical support (technical issues)
- L3: Engineering team (critical bugs)

**On-Call Rotation**:
- Primary: Senior engineer
- Secondary: DevOps engineer
- Escalation: CTO

### Maintenance Windows

**Scheduled Maintenance**: 
- Day: Every Sunday
- Time: 2:00 AM - 4:00 AM IST
- Notification: 48 hours advance notice

**Emergency Maintenance**:
- As needed for critical issues
- Maximum downtime: 30 minutes

---

## Conclusion

This deployment guide ensures:
- ✅ **Reliable Infrastructure**: Multi-AZ, auto-scaling
- ✅ **Security**: Encrypted, secured, monitored
- ✅ **Scalability**: Handles growth automatically
- ✅ **Maintainability**: Easy updates and rollbacks
- ✅ **Cost-Effective**: Optimized resource usage
- ✅ **High Availability**: 99.9% uptime target

Follow this guide step-by-step for successful deployment of the Bihar Service Marketplace platform.

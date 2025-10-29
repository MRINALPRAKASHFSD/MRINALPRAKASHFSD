# User Flows & Journey Maps - Bihar Service Marketplace

## Overview

This document outlines the complete user journeys for both service providers and customers through the Bihar Service Marketplace platform, covering both MVP and Full Launch phases.

---

## Provider User Flows

### Flow 1: Provider Registration & Onboarding (MVP Phase)

**Entry Point**: App Download or Website Visit

#### Step 1: Registration
```
User opens app
    ↓
Selects "I'm a Service Provider"
    ↓
Enters phone number
    ↓
Receives OTP via SMS
    ↓
Enters OTP to verify
    ↓
Creates password
    ↓
Enters basic details:
    - Full name
    - Email (optional)
    - Profile photo
    ↓
Account created ✓
```

#### Step 2: Profile Setup
```
Welcome screen with onboarding tips
    ↓
Complete your profile:
    ↓
Select service category
    [MVP: Electrician Services only]
    ↓
Add professional details:
    - Years of experience
    - Brief bio
    - Skills and specializations
    ↓
Set service area:
    - Primary city (e.g., Patna)
    - Districts covered
    - Service radius (km)
    - Pin location on map
    ↓
Set availability schedule:
    - Day-wise timings
    - Off days
    - Break times
    ↓
Profile setup complete ✓
```

#### Step 3: Verification Process
```
Upload verification documents:
    ↓
ID Proof:
    - Select type (Aadhaar, PAN, Voter ID, DL)
    - Upload photo/scan
    - Enter ID number
    ↓
Address Proof:
    - Upload document
    ↓
Professional Certificates (optional):
    - ITI certificate
    - Trade certification
    - Experience letters
    ↓
Submit for verification
    ↓
Status: "Under Review"
    ↓
Admin reviews (24-48 hours)
    ↓
APPROVED → Status: "Verified" ✓
    or
REJECTED → Reason provided → Re-submit
```

#### Step 4: Create First Service Listing
```
Navigate to "My Services"
    ↓
Click "Add Service"
    ↓
Select service category:
    [MVP: Fan Repair, Wiring, Troubleshooting, Light Fixture]
    ↓
Enter service details:
    - Service title
    - Detailed description
    - What's included
    - What's excluded
    ↓
Set pricing:
    - Base price (₹)
    - Price per: hour / service / item
    - Mark as "Negotiable" (checkbox)
    - Estimated duration
    ↓
Upload images:
    - Before/after photos
    - Equipment photos
    - Work samples (up to 5 images)
    ↓
Preview service listing
    ↓
Publish listing
    ↓
Service goes live ✓
```

**Onboarding Complete!** Provider can now receive bookings.

---

### Flow 2: Receiving & Managing Bookings (MVP Phase)

#### Step 1: New Booking Notification
```
Customer books service
    ↓
Provider receives:
    - Push notification
    - SMS alert
    - In-app notification badge
    ↓
Provider opens app
    ↓
Views "New Booking Request"
```

#### Step 2: Review Booking Details
```
Booking Details Screen:
    ↓
Customer Information:
    - Name
    - Phone number (click to call)
    - Profile image
    ↓
Service Details:
    - Service type
    - Description of problem
    - Customer photos (if uploaded)
    - Quoted price
    ↓
Schedule:
    - Requested date
    - Requested time
    - Estimated duration
    ↓
Location:
    - Full address
    - Landmark
    - Pin on map
    - Distance from provider
    ↓
Action buttons:
    [Accept] [Reject] [Call Customer]
```

#### Step 3a: Accept Booking
```
Provider clicks "Accept"
    ↓
Confirm availability
    ↓
Add notes (optional):
    "Will reach by 10 AM sharp"
    ↓
Booking status → "Accepted"
    ↓
Customer receives notification
    ↓
Provider can now call customer for:
    - Price negotiation
    - Address confirmation
    - Schedule coordination
    ↓
Booking confirmed ✓
```

#### Step 3b: Reject Booking
```
Provider clicks "Reject"
    ↓
Select reason:
    - Not available on that date
    - Outside service area
    - Service not offered
    - Other (specify)
    ↓
Booking status → "Rejected"
    ↓
Customer receives notification
    ↓
Booking closed
```

#### Step 4: Day of Service
```
Booking day arrives
    ↓
Provider receives reminder:
    "Service scheduled today at 10:00 AM"
    ↓
Provider clicks "Start Service"
    ↓
Status → "In Progress"
    ↓
Provider completes work
    ↓
Provider clicks "Mark Complete"
    ↓
Confirm final price:
    - Original quote: ₹200
    - Negotiated price: ₹250
    - Reason for change (optional)
    ↓
Add completion notes:
    "Replaced capacitor. Fan working properly."
    ↓
Upload after-service photos (optional)
    ↓
Status → "Completed"
    ↓
Payment confirmation:
    [MVP: Cash received ✓]
    ↓
Booking complete ✓
```

---

### Flow 3: Premium Subscription (Full Launch Phase)

#### Step 1: Discover Premium
```
Provider dashboard shows:
    "Upgrade to Premium"
    ↓
Provider clicks to learn more
    ↓
Premium Benefits Screen:
    ✓ Featured listings (top of search)
    ✓ Unlimited service listings
    ✓ Advanced analytics
    ✓ Priority support
    ✓ Verified badge
    ✓ Ad-free experience
    ↓
Compare plans:
    
    FREE (Current):
        - Up to 5 listings
        - Standard visibility
        - Basic analytics
        - Email support
        - ₹0/month
    
    PREMIUM MONTHLY:
        - All premium features
        - ₹299/month
        - [Select Plan]
    
    PREMIUM YEARLY:
        - All premium features
        - ₹2,999/year (Save 17%)
        - [Select Plan] [RECOMMENDED]
```

#### Step 2: Subscribe
```
Provider selects plan
    ↓
Payment method:
    [UPI] [Bank Transfer] [Card]
    ↓
Enter payment details
    ↓
Review order:
    Premium Yearly: ₹2,999
    Tax (18%): ₹539.82
    Total: ₹3,538.82
    ↓
Confirm payment
    ↓
Payment processing...
    ↓
SUCCESS!
    ↓
Premium activated ✓
    ↓
Dashboard updates:
    - "Premium" badge on profile
    - Featured listings toggle available
    - Advanced analytics unlocked
```

---

## Customer User Flows

### Flow 1: Customer Registration (MVP Phase)

**Entry Point**: App Download or Website Visit

```
User opens app
    ↓
Selects "I need a service"
    ↓
Quick registration:
    - Phone number
    - OTP verification
    - Name
    - Password
    ↓
Account created ✓
    ↓
Optional: Add addresses
    - Home
    - Office
    - Other
    ↓
Onboarding complete
```

---

### Flow 2: Finding & Booking Service (MVP Phase)

#### Step 1: Service Discovery
```
Customer opens app
    ↓
Home Screen shows:
    - Search bar
    - Service categories
    - Featured providers
    - Recent bookings
    ↓
OPTION A: Browse by category
    Click "Electrician Services"
        ↓
    Subcategories:
        - Fan Repair & Cleaning
        - Electrical Wiring
        - Troubleshooting
        - Light Fixtures
        ↓
    Click "Fan Repair"
        ↓
    View all providers/services
    
OPTION B: Search directly
    Type "fan repair Patna"
        ↓
    Search results appear
```

#### Step 2: View Provider & Service
```
Service Listing Screen:
    ↓
Service Image Gallery
    ↓
Service Details:
    - Title: "Fan Repair and Maintenance"
    - Description
    - Base Price: ₹200
    - Duration: ~1 hour
    - Price negotiable: Yes
    - What's included
    ↓
Provider Profile Card:
    - Name: Ravi Kumar
    - Rating: 4.5 ★ (25 reviews) [Full Launch]
    - Experience: 10 years
    - Verified badge ✓
    - Location: Patna
    - Response time: ~1 hour
    ↓
Action Buttons:
    [View Full Profile] [Book Service]
```

#### Step 3: Book Service
```
Customer clicks "Book Service"
    ↓
Booking Form:
    ↓
Select Date:
    [Calendar picker]
    ↓
Select Time:
    [Time slots based on provider availability]
    ↓
Service Location:
    [Select from saved addresses]
        or
    [Add new address]
    ↓
Describe your problem:
    Text area: "Ceiling fan making noise and slow"
    ↓
Upload photos (optional):
    [Add photos]
    ↓
Review booking:
    - Service: Fan Repair
    - Provider: Ravi Kumar
    - Date: Nov 5, 2024
    - Time: 10:00 AM
    - Location: 123 Main St, Patna
    - Quoted Price: ₹200
    ↓
Submit booking request
    ↓
Booking submitted ✓
    ↓
Status: "Waiting for provider confirmation"
```

#### Step 4: Track Booking
```
Booking Tracking Screen:
    ↓
Status Timeline:
    ✓ Booking requested (Oct 29, 8:00 AM)
    ⏳ Waiting for confirmation
    ○ Service scheduled
    ○ Service completed
    ↓
Provider responds:
    ↓
ACCEPTED:
    ✓ Booking confirmed!
    ✓ Provider notes: "Will reach by 10 AM"
    ↓
    Contact Options:
        [Call Provider] [View Location]
    ↓
    Negotiation (via phone call):
        "Fan capacitor needs replacement"
        "Additional ₹50 for parts"
        Customer agrees
        Final price: ₹250
        
REJECTED:
    ✗ Booking declined
    ✗ Reason: Not available on that date
    ↓
    Options:
        [Find Another Provider]
        [Choose Different Date]
```

#### Step 5: Service Day
```
Day of service:
    ↓
Morning reminder:
    "Service scheduled today at 10:00 AM"
    ↓
Provider marks "In Progress"
    ↓
Customer receives notification
    ↓
Service completed
    ↓
Customer receives notification:
    "Service completed by Ravi Kumar"
    ↓
Customer reviews details:
    - Final price: ₹250
    - Completion notes
    - Photos
    ↓
Confirm & Pay:
    [MVP: Cash payment]
        "Did you pay ₹250 in cash?"
        [Yes, Paid] [No, Issue]
    ↓
[Full Launch: Digital payment]
    Payment method:
        [UPI] [Bank Transfer] [Cash]
    ↓
    If UPI selected:
        Amount: ₹250
        Enter UPI ID
        Confirm payment
        Payment successful ✓
    ↓
Booking complete ✓
```

---

### Flow 3: Rate & Review (Full Launch Phase)

```
24 hours after service completion:
    ↓
Notification:
    "How was your service with Ravi Kumar?"
    ↓
Customer clicks notification
    ↓
Review Screen:
    ↓
Rate overall experience:
    [1★] [2★] [3★] [4★] [5★]
    ↓
Rate specific aspects:
    Quality: [★★★★★]
    Punctuality: [★★★★★]
    Professionalism: [★★★★★]
    Value for Money: [★★★★☆]
    ↓
Write review (optional):
    "Excellent work! Very professional..."
    ↓
Upload photos (optional):
    [Add photos of completed work]
    ↓
Submit review
    ↓
Review posted ✓
    ↓
Provider receives notification
    ↓
Provider can respond:
    "Thank you for your kind words!"
```

---

### Flow 4: In-App Messaging (Full Launch Phase)

#### Initiate Chat
```
Customer viewing provider profile
    ↓
Clicks "Message Provider"
    ↓
Chat screen opens
    ↓
Provider shows as:
    [Online] or [Last seen: 2 hours ago]
    ↓
Customer types:
    "Hi, can you come tomorrow at 3 PM?"
    ↓
Send [→]
    ↓
Message delivered ✓
    ↓
Provider receives notification
    ↓
Provider online → sees message immediately
    [Typing...]
    ↓
Provider responds:
    "Yes, I'm available. What's the issue?"
    ↓
Real-time conversation continues...
```

#### Share Location
```
During chat:
    ↓
Customer clicks attachment icon
    ↓
Options:
    [📷 Photo] [📍 Location] [📄 File]
    ↓
Clicks [📍 Location]
    ↓
Map opens
    ↓
"Share my current location" ✓
    ↓
Location sent in chat
    ↓
Provider can view on map
    ↓
Provider: "Got it. I'll be there."
```

---

### Flow 5: Price Negotiation (Full Launch Phase)

#### Formal Negotiation Interface
```
After booking request:
    ↓
Provider reviews and sends quote:
    Original price: ₹200
    Additional work needed: ₹50
    Total quote: ₹250
    Reason: "Capacitor replacement required"
    ↓
[Send Quote]
    ↓
Customer receives notification
    ↓
Customer views quote:
    "Provider quoted ₹250 (₹50 more)"
    Reason displayed
    ↓
Customer options:
    [Accept Quote]
    [Counter Offer]
    [Decline & Cancel]
    ↓
Customer clicks [Counter Offer]
    ↓
Enter counter amount: ₹230
    Add message: "Can we do it for ₹230?"
    [Send Counter]
    ↓
Provider receives notification
    ↓
Provider options:
    [Accept Counter]
    [Send New Quote]
    [Decline]
    ↓
Provider accepts
    ↓
Final price locked: ₹230
    ↓
Both parties notified ✓
    ↓
Service scheduled
```

---

## Admin User Flows

### Flow 1: Provider Verification (MVP Phase)

```
Admin logs into admin panel
    ↓
Dashboard shows:
    "15 pending verifications"
    ↓
Navigate to "Pending Verifications"
    ↓
List of providers awaiting verification
    ↓
Click on provider: "Ravi Kumar"
    ↓
Verification Screen:
    ↓
Provider Details:
    - Name: Ravi Kumar
    - Phone: 9876543210
    - Category: Electrician
    - Experience: 10 years
    - Service Area: Patna
    ↓
Uploaded Documents:
    ID Proof:
        Type: Aadhaar Card
        Number: XXXX-XXXX-1234
        [View Document]
    ↓
    Address Proof:
        [View Document]
    ↓
    Certificates:
        ITI Certificate - Electrician
        [View Certificate]
    ↓
Verification Checklist:
    ☑ ID proof verified
    ☑ Address proof verified
    ☑ Phone number verified (OTP)
    ☑ Certificates authentic
    ☑ No criminal record (manual check)
    ↓
Admin Decision:
    [✓ Approve] [✗ Reject]
    ↓
Admin clicks [✓ Approve]
    ↓
Add verification notes:
    "All documents verified. ITI certified electrician."
    ↓
Confirm approval
    ↓
Provider status → "Verified"
    ↓
Provider receives notification:
    "Congratulations! Your profile is verified ✓"
    ↓
Verified badge added to provider profile
```

---

### Flow 2: Dispute Resolution (Full Launch Phase)

```
Customer raises dispute
    ↓
Admin receives notification
    ↓
Navigate to "Disputes"
    ↓
Open dispute case:
    ↓
Dispute Details:
    Booking ID: BH-2024-001234
    Customer: Amit Singh
    Provider: Ravi Kumar
    Service: Fan Repair
    Issue: "Work incomplete, fan still noisy"
    Raised: Nov 6, 2024
    Status: Open
    ↓
Evidence from Customer:
    - Photos of incomplete work
    - Description
    ↓
Provider Response:
    "Customer didn't pay for motor replacement"
    - Counter evidence
    ↓
Admin Analysis:
    - Review booking details
    - Check chat history
    - Review payment details
    - Verify claims
    ↓
Admin Decision:
    Partial refund: ₹100
    Reason: "Service partially completed"
    ↓
Resolution Actions:
    ☑ Refund ₹100 to customer
    ☑ Pay provider ₹150 (₹250 - ₹100)
    ☑ Send warning to provider
    ☑ Note on provider profile
    ↓
Process refund
    ↓
Notify both parties
    ↓
Dispute status → "Resolved"
    ↓
Case closed
```

---

## Edge Cases & Error Handling

### Provider Scenarios

#### Scenario 1: Provider Misses Booking
```
Scheduled time passes
    ↓
Customer reports "Provider didn't show up"
    ↓
System sends notification to provider
    ↓
Provider options:
    [I'm running late] [Emergency - reschedule] [Cancel]
    ↓
If no response in 30 minutes:
    ↓
Booking auto-cancelled
    ↓
Customer refunded (if paid)
    ↓
Provider rating affected
    ↓
Customer offered alternative providers
```

#### Scenario 2: Payment Dispute
```
Service completed
    ↓
Customer claims: "Provider asking more than agreed"
    ↓
System shows:
    Quoted: ₹200
    Negotiated: ₹250 (via chat logs)
    Provider claiming: ₹300
    ↓
Evidence review:
    - Chat history
    - Booking details
    - Photos
    ↓
Resolution:
    Enforce negotiated price: ₹250
    ↓
Customer pays ₹250
    ↓
Warning to provider
```

### Customer Scenarios

#### Scenario 1: Customer Not Home
```
Provider arrives at location
    ↓
Customer not available
    ↓
Provider tries calling (logged in system)
    ↓
No response
    ↓
Provider clicks "Customer unavailable"
    ↓
Uploads proof (photo at location)
    ↓
System marks as "Customer no-show"
    ↓
Customer charged cancellation fee (Full Launch)
    ↓
Provider compensated for travel
    ↓
Customer rating affected
```

#### Scenario 2: Unsatisfied with Service
```
Service completed
    ↓
Customer unhappy with quality
    ↓
Before payment:
    Customer clicks "Report Issue"
    ↓
    Issue form:
        - What's wrong?
        - Upload photos
        - Severity: [Minor] [Major]
    ↓
    System notifies provider
    ↓
    Provider offered chance to fix
    ↓
    If fixed: Payment proceeds
    If not: Dispute raised
    ↓
Admin mediation
```

---

## Success Metrics for User Flows

### Provider Metrics
- **Onboarding Completion**: >85% complete profile setup
- **Verification Time**: <48 hours average
- **Booking Response**: >90% respond within 2 hours
- **Acceptance Rate**: >75% bookings accepted
- **Completion Rate**: >90% accepted bookings completed
- **Premium Conversion**: >15% upgrade to premium (Full Launch)

### Customer Metrics
- **Registration to First Booking**: <10 minutes average
- **Booking Success Rate**: >85% bookings accepted
- **Rebooking Rate**: >40% book again within 30 days
- **Payment Success**: >95% payments complete (Full Launch)
- **Review Submission**: >60% leave reviews (Full Launch)

### Platform Metrics
- **Search to Booking**: <5 minutes average
- **Provider Response Time**: <1 hour average
- **Dispute Rate**: <5% of bookings
- **Resolution Time**: <48 hours for disputes
- **User Satisfaction**: >4.2/5.0 average

---

## Conclusion

These user flows ensure:
- ✅ **Intuitive Navigation**: Minimal steps to complete actions
- ✅ **Clear Communication**: Status updates at every step
- ✅ **Trust Building**: Verification, reviews, dispute resolution
- ✅ **Flexibility**: Multiple paths to achieve goals
- ✅ **Error Handling**: Graceful handling of edge cases

The flows are designed to minimize friction while maximizing trust and transparency for Bihar's local service marketplace.

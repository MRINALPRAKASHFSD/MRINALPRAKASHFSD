require("dotenv").config();

console.log("Client ID:", process.env.SPOTIFY_CLIENT_ID);

console.log(
  "Client Secret:",
  process.env.SPOTIFY_CLIENT_SECRET ? "✅ Loaded" : "❌ Missing"
);

console.log(
  "Refresh Token:",
  process.env.SPOTIFY_REFRESH_TOKEN ? "✅ Loaded" : "❌ Missing"
);
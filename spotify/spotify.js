require("dotenv").config();

const fs = require("fs");
const axios = require("axios");
const generateSVG = require("./generateSVG");
const Vibrant = require("node-vibrant");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

async function downloadCover(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream("spotify/cover.jpg");

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function getCurrentTrack() {
  const token = await getAccessToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true,
    }
  );

  if (response.status === 204 || !response.data.item) {
    console.log("⏸ Nothing is currently playing.");
    return;
  }

  const song = response.data.item;
  const progress = response.data.progress_ms;
  const duration = song.duration_ms;
  console.log("Progress:", progress);
  console.log("Duration:", duration);

  // Download album cover
  await downloadCover(song.album.images[0].url);

 const coverBase64 = fs
  .readFileSync("spotify/cover.jpg")
  .toString("base64");

const songData = {
  title: song.name,
  artist: song.artists.map((a) => a.name).join(", "),
  album: song.album.name,
  image: `data:image/jpeg;base64,${coverBase64}`,
  isPlaying: response.data.is_playing,

  progress,
  duration,
};
  // Generate SVG card
  generateSVG(songData);

  console.log("\n🎵 CURRENT SONG");
  console.log("--------------------------------");
  console.log("Title   :", songData.title);
  console.log("Artist  :", songData.artist);
  console.log("Album   :", songData.album);
  console.log("Playing :", songData.isPlaying);
  console.log("Cover   : spotify/cover.jpg");
  console.log("--------------------------------");
  console.log("✅ SVG Generated Successfully!");

  return songData;
}

getCurrentTrack().catch((err) => {
  console.error("❌ Error:");
  console.error(err.response?.data || err.message);
});
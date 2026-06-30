require("dotenv").config();

const fs = require("fs");
const axios = require("axios");
const generateSVG = require("../spotify/generateSVG");
const { Vibrant } = require("node-vibrant/node");

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

async function getTheme(imagePath) {

    const palette = await Vibrant.from(imagePath).getPalette();

    return {

        accent: palette.Vibrant?.hex || "#1DB954",

        dark: palette.DarkVibrant?.hex || "#0b0f18",

        light: palette.LightVibrant?.hex || "#ffffff",

        muted: palette.Muted?.hex || "#666666",

    };

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
  const theme = await getTheme("spotify/cover.jpg");

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
  theme,
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

module.exports = async (req, res) => {
  try {
    const songData = await getCurrentTrack();
    console.log("songData =", songData);

   const svg = generateSVG(songData);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=60");

    res.status(200).send(svg);
  } catch (err) {
    console.error(err);

    res.status(500).send("Spotify widget failed");
  }
};
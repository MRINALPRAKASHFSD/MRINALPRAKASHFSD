const fs = require("fs");

function generateSVG(song) {
  const {
  title,
  artist,
  album,
  image,
  isPlaying,
  progress,
  duration
} = song;

function truncate(text, max) {
  if (!text) return "";
  return text.length > max
    ? text.substring(0, max - 3) + "..."
    : text;
}

const displayTitle = truncate(title, 32);
const displayArtist = truncate(artist, 52);
const displayAlbum = truncate(album, 35);


  const statusText = isPlaying ? "LIVE" : "PAUSED";
  const statusColor = isPlaying ? "#1ED760" : "#f1c40f";
  const percent = progress / duration;

const progressWidth = 420;

const filled = progressWidth * percent;

function format(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}



  const svg = `
<svg width="900" height="280" xmlns="http://www.w3.org/2000/svg">

<defs>

<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
<animate

        attributeName="x1"

        values="0%;20%;0%"

        dur="12s"

        repeatCount="indefinite"/>

    <animate

        attributeName="x2"

        values="100%;80%;100%"

        dur="12s"

        repeatCount="indefinite"/>

    <animate

        attributeName="y1"

        values="0%;15%;0%"

        dur="12s"

        repeatCount="indefinite"/>

    <animate

        attributeName="y2"

        values="100%;85%;100%"

        dur="12s"

        repeatCount="indefinite"/>

<stop offset="0%" stop-color="#0b0f18"/>
<stop offset="60%" stop-color="#111827"/>
<stop offset="100%" stop-color="#071018"/>
</linearGradient>

<linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="rgba(29,185,84,0.4)"/>
<stop offset="100%" stop-color="rgba(29,185,84,0)"/>
</linearGradient>

<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
<feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="rgba(29,185,84,0.30)"/>
</filter>

<clipPath id="coverClip">
<rect x="30" y="30" width="180" height="180" rx="20"/>
</clipPath>

</defs>

<!-- Background -->

<rect
x="0"
y="0"
width="900"
height="240"
rx="30"
fill="url(#bgGrad)"
filter="url(#shadow)"
/>

<!-- Glow Border -->

<rect
x="2"
y="2"
width="896"
height="276"
rx="28"
fill="none"
stroke="url(#glow)"
stroke-width="2"
/>

<!-- Album Cover -->

<!-- Album Glow -->
<rect
x="25"
y="25"
width="190"
height="190"
rx="25"
fill="rgba(29,185,84,0.12)"
filter="url(#shadow)"
opacity="0.18">

    <animate
        attributeName="opacity"
        values="0.15;0.35;0.15"
        dur="2.5s"
        repeatCount="indefinite"/>

</rect>

<g>

<animateTransform
attributeName="transform"
type="translate"
values="0 0;0 -3;0 0"
dur="3s"
repeatCount="indefinite"/>

<image
href="${image}"
x="30"
y="30"
width="180"
height="180"
clip-path="url(#coverClip)"
filter="url(#shadow)"
/>

</g>

<!-- Right Content -->

<g transform="translate(240,35)">

<text
x="0"
y="0"
fill="#1ED760"
font-family="Inter,Arial"
font-size="18"
font-weight="700"
letter-spacing="2">
NOW PLAYING
</text>

<text
x="0"
y="42"
fill="#ffffff"
filter="url(#shadow)"
font-family="Inter,Arial"
font-size="32"
font-weight="800">
${displayTitle}
</text>

<text
x="0"
y="78"
fill="#b3b3b3"
font-family="Inter,Arial"
font-size="18">
${displayArtist}
</text>

<text
x="0"
y="108"
fill="#7f8c8d"
font-family="Inter,Arial"
font-size="16">
${displayAlbum}
</text>

<!-- Progress Bar -->

<line
x1="0"
y1="128"
x2="420"
y2="128"
stroke="#333"
stroke-width="7"
stroke-linecap="round"
/>

<line
x1="0"
y1="128"
x2="${filled}"
y2="128"
stroke="#1ED760"
stroke-width="7"
stroke-linecap="round"
/>

<circle
cx="${filled}"
cy="128"
r="6"
fill="white">

    <animate
        attributeName="r"
        values="6;8;6"
        dur="1.5s"
        repeatCount="indefinite"/>

</circle>

<text
x="0"
y="150"
fill="#888"
font-family="Inter,Arial"
font-size="14">
${format(progress)}
</text>

<text
x="420"
y="150"
text-anchor="end"
fill="#888"
font-family="Inter,Arial"
font-size="14">
${format(duration)}
</text>

<!-- Equalizer -->

<g transform="translate(310,182)">

<rect x="0" y="18" width="7" height="25" rx="3" fill="${statusColor}">
<animate attributeName="height" values="25;10;35;20;25" dur="1s" repeatCount="indefinite"/>
</rect>

<rect x="16" y="10" width="7" height="35" rx="3" fill="${statusColor}">
<animate attributeName="height" values="35;18;28;12;35" dur="0.9s" repeatCount="indefinite"/>
</rect>

<rect x="32" y="25" width="7" height="18" rx="3" fill="${statusColor}">
<animate attributeName="height" values="18;38;8;28;18" dur="1.1s" repeatCount="indefinite"/>
</rect>

<rect x="48" y="6" width="7" height="38" rx="3" fill="${statusColor}">
<animate attributeName="height" values="38;12;28;16;38" dur="0.8s" repeatCount="indefinite"/>
</rect>

<rect x="64" y="16" width="7" height="28" rx="3" fill="${statusColor}">
<animate attributeName="height" values="28;8;38;15;28" dur="1.2s" repeatCount="indefinite"/>
</rect>

<rect x="80" y="22" width="7" height="22" rx="3" fill="${statusColor}">
<animate attributeName="height" values="22;34;14;30;22" dur="0.95s" repeatCount="indefinite"/>
</rect>

</g>

<!-- Status -->

<g transform="translate(420,197)">

<circle
cx="10"
cy="0"
r="5"
fill="${statusColor}">

    <animate
        attributeName="opacity"
        values="1;0.3;1"
        dur="1.2s"
        repeatCount="indefinite"/>

    <animate
        attributeName="r"
        values="5;7;5"
        dur="1.2s"
        repeatCount="indefinite"/>

</circle>


<text
x="28"
y="5"
fill="${statusColor}"
font-family="Inter,Arial"
font-size="15"
font-weight="700">
${statusText}
</text>

</g>

</g>

</svg>
`;

  fs.writeFileSync("spotify/spotify.svg", svg);
}

module.exports = generateSVG;
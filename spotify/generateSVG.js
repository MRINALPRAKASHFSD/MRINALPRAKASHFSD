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
  const percent = Math.max(0, Math.min(1, progress / duration));

  const accent = song.theme?.accent || "#1DB954";
const dark   = song.theme?.dark   || "#0b0f18";
const light  = song.theme?.light  || "#ffffff";
const muted  = song.theme?.muted  || "#666666";
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

        dur="28s"

        repeatCount="indefinite"/>

    <animate

        attributeName="x2"

        values="100%;80%;100%"

        dur="28s"

        repeatCount="indefinite"/>

    <animate

        attributeName="y1"

        values="0%;15%;0%"

        dur="28s"

        repeatCount="indefinite"/>

    <animate

        attributeName="y2"

        values="100%;85%;100%"

        dur="28s"

        repeatCount="indefinite"/>

<stop offset="0%" stop-color="${dark}"/>
<stop offset="60%" stop-color="${accent}"/>
<stop offset="100%" stop-color="${dark}"/>
</linearGradient>

<linearGradient id="glow">
<stop offset="0%" stop-color="${accent}" stop-opacity="0.45"/>
<stop offset="100%" stop-color="${accent}" stop-opacity="0"/>

</linearGradient>

<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
<feDropShadow
    dx="0"
    dy="10"
    stdDeviation="24"
    flood-color="${accent}"
    flood-opacity="0.30"
/>
</filter>

<!-- Progress Knob Glow -->

<filter id="knobGlow" x="-100%" y="-100%" width="300%" height="300%">
    <feDropShadow
        dx="0"
        dy="0"
        stdDeviation="3"
        flood-color="${light}"
        flood-opacity="0.9"/>
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
stroke-opacity="0.35"
>
<animate
    attributeName="stroke-opacity"
    values="0.35;1;0.35"
    dur="3s"
    repeatCount="indefinite"/>

</rect>

<!-- Album Cover -->

<!-- Album Glow -->
<rect
x="25"
y="25"
width="190"
height="190"
rx="25"
fill="${accent}"
filter="url(#shadow)"
opacity="0.12">

    <animate
        attributeName="opacity"
        values="0.15;0.35;0.15"
        dur="2.5s"
        repeatCount="indefinite"/>

</rect>

<g>


${isPlaying ? `
<animateTransform
    attributeName="transform"
    type="rotate"
    from="0 120 120"
    to="360 120 120"
    dur="18s"
    repeatCount="indefinite"/>
` : ""}


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
fill="${light}"
filter="url(#shadow)"
font-family="Inter,Arial"
font-size="32"
font-weight="800">
${displayTitle}
</text>

<text
x="0"
y="78"
fill="${light}"
font-family="Inter,Arial"
font-size="18">
${displayArtist}
</text>

<text
x="0"
y="108"
fill="${muted}"
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
    stroke="${accent}"
    stroke-width="7"
    stroke-linecap="round">

    <animate
        attributeName="x2"
        from="${filled}"
        to="420"
        dur="${Math.max(0.1, (duration - progress) / 1000)}s"
        fill="freeze"/>
</line>

<circle
    cx="${filled}"
    cy="128"
    r="7"
    filter="url(#knobGlow)">

    <animate
        attributeName="cx"
        from="${filled}"
        to="420"
        dur="${Math.max(0.1, (duration - progress) / 1000)}s"
        fill="freeze"/>

</circle>



<text
x="436"
y="150"
text-anchor="end"
fill="${muted}"
font-family="Inter,Arial"
font-size="14">
${format(duration)}
</text>

<!-- Equalizer -->

<g transform="translate(310,182)">

<rect x="0" y="18" width="7" height="25" rx="3" fill="${statusColor}">
<animate attributeName="height" values="25;8;34;16;29;12;25" dur="1.13s" repeatCount="indefinite"/>
</rect>

<rect x="16" y="10" width="7" height="35" rx="3" fill="${statusColor}">
<animate attributeName="height" values="35;20;10;40;18;30;35" dur="0.87s" repeatCount="indefinite"/>
</rect>

<rect x="32" y="25" width="7" height="18" rx="3" fill="${statusColor}">
<animate attributeName="height" values="18;42;12;34;8;28;18" dur="1.29s" repeatCount="indefinite"/>
</rect>

<rect x="48" y="6" width="7" height="38" rx="3" fill="${statusColor}">
<animate attributeName="height" values="38;16;44;12;30;20;38" dur="0.94s" repeatCount="indefinite"/>
</rect>

<rect x="64" y="16" width="7" height="28" rx="3" fill="${statusColor}">
<animate attributeName="height" values="28;10;40;14;36;22;28" dur="1.41s" repeatCount="indefinite"/>
</rect>

<rect x="80" y="22" width="7" height="22" rx="3" fill="${statusColor}">
<animate attributeName="height" values="22;36;12;30;40;18;22" dur="1.02s" repeatCount="indefinite"/>
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
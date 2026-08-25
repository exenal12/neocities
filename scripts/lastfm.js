const USERNAME = "drenal1";
const API_KEY = "c313b179ed4458656126373df436252e";
const POLL_TIME = 60;
const URL = "https://ws.audioscrobbler.com/2.0/";

function normalizeTrack(rawTrack) {
  /* TRACK SHAPE AFTER NORMALIZING:
  {
    title: string,
    imgUrl: string,
    nowPlaying: boolean,
    album: string,
    artist: string,
    date: string
  }
  */

  // grab image of certain size from image array
  // sizes: small, medium, large, extralarge
  const imgUrl =
    rawTrack.image?.find((img) => img.size === "large")?.["#text"] || "";
  // "Now Playing" guard is redundant, but whatever
  return {
    title: rawTrack.name,
    imgUrl: imgUrl,
    nowPlaying: rawTrack["@attr"]?.nowplaying === "true",
    album: rawTrack.album["#text"],
    artist: rawTrack.artist["#text"],
    date: rawTrack.date?.["#text"] || "Now Playing",
  };
}

async function fetchAPI() {
  const widget = document.getElementById("lastfm-widget");
  let text = "";
  const params = new URLSearchParams({
    method: "user.getRecentTracks",
    user: USERNAME,
    api_key: API_KEY,
    limit: "3",
    format: "json",
  });

  const requestUrl = `${URL}?${params}`;

  const data = await fetch(requestUrl).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else return;
  });

  return data;
}

async function renderWidget() {
  const widget = document.getElementById("lastfm-widget");
  widget.innerHTML = "";
  const data = await fetchAPI();
  const raw = data.recenttracks.track;
  const tracks = raw.map(normalizeTrack);
  console.log("tracks: ", tracks);

  // build widget!
  tracks.forEach((track, index) => {
    widget.innerHTML += `Track ${index + 1}: ${track.title} by ${track.artist}<br>`;
  });
}
renderWidget();

const USERNAME = "drenal1";
const API_KEY = "c313b179ed4458656126373df436252e";
const POLL_TIME = 60;
const URL = "https://ws.audioscrobbler.com/2.0/";

function calculateTimestamp(unixTime) {
  if (unixTime === "Now Playing") return unixTime;

  const elapsed = Math.floor((Date.now() - unixTime * 1000) / 1000);

  if (elapsed < 60) return "Just now";

  const minutes = Math.floor(elapsed / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

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
    rawTrack.image?.find((img) => img.size === "medium")?.["#text"] || "";
  // "Now Playing" guard is redundant, but whatever
  return {
    title: rawTrack.name,
    imgUrl: imgUrl,
    nowPlaying: rawTrack["@attr"]?.nowplaying === "true",
    album: rawTrack.album?.["#text"] || "No album found",
    artist: rawTrack.artist?.["#text"] || "No artist found",
    timestamp: rawTrack.date?.uts || "Now Playing",
  };
}

async function fetchAPI() {
  const widget = document.getElementById("lastfm-widget");
  let text = "";
  const params = new URLSearchParams({
    method: "user.getRecentTracks",
    user: USERNAME,
    api_key: API_KEY,
    limit: "5",
    format: "json",
  });

  const requestUrl = `${URL}?${params}`;

  const data = await fetch(requestUrl).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else return "Error fetching LastFM data";
  });

  return data;
}

async function renderWidget() {
  // get widget + "components" inside
  const widget = document.getElementById("lastfm-widget");
  const status = widget.querySelector(".lastfm-status");
  const trackList = widget.querySelector(".lastfm-tracklist");
  const now = new Date();

  // set status and fetch data
  status.textContent = "Loading...";
  const data = await fetchAPI();
  if (data === "Error fetching LastFM data") {
    status.textContent = data;
    return;
  } else status.textContent = "";

  // successful; normalize and render
  const raw = data.recenttracks.track;
  const tracks = raw.map(normalizeTrack);
  for (const track of tracks) {
    // overall render item
    // each "item" is a new div with the classname "lastfm-track", for styling
    const item = document.createElement("div");
    item.classList.add("lastfm-track");

    // image
    const img = document.createElement("img");
    img.classList.add("lastfm-image");
    img.src = track.imgUrl;
    item.append(img);

    // wrapper div for track info
    const wrapper = document.createElement("div");
    wrapper.classList.add("lastfm-info");
    item.append(wrapper);

    // title
    const title = document.createElement("div");
    title.classList.add("lastfm-title");
    title.textContent = track.title;
    wrapper.append(title);

    // artist
    const artist = document.createElement("div");
    artist.classList.add("lastfm-artist");
    artist.textContent = track.artist;
    wrapper.append(artist);

    // timestamp/now playing
    const time = document.createElement("div");
    time.classList.add("lastfm-timestamp");
    time.textContent = calculateTimestamp(track.timestamp);
    wrapper.append(time);
    trackList.append(item);
  }
}
renderWidget();

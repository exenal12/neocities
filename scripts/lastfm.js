const USERNAME = "drenal1";
const API_KEY = "c313b179ed4458656126373df436252e";
const POLL_TIME = 60;
const URL = "http://ws.audioscrobbler.com/2.0/";

async function fetchAPI() {
  const params = new URLSearchParams({
    method: "user.getRecentTracks",
    user: USERNAME,
    api_key: API_KEY,
    limit: "3",
    format: "json",
  });

  const requestUrl = `${URL}?${params}`;

  const result = await fetch(requestUrl).then((res) => {
    if (res.status === 200) {
      // successful
    }
    console.log("results: ", res);
  });
}

fetchAPI();

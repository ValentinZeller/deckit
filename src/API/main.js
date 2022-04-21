import snoowrap from "snoowrap";

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36';
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
let scope = ['identity', 'read', 'history', 'vote', 'save', 'flair', 'privatemessages', 'subscribe' ];
let state = 'fe211bebc52eb3da9bef8db6e63104d3';

const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code');

export function login() {
  var authenticationUrl = snoowrap.getAuthUrl({
    clientId: clientId,
    scope: scope,
    redirectUri: redirectUrl,
    permanent: true,
    state: state
  });

  if (!token && !refreshToken) {
    window.location = authenticationUrl;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  r.revokeAccessToken();
  r.revokeRefreshToken();
  window.location.reload(false);
}

export let r = false;
if (urlParams.get('state') === state) {
  if (code && !token && !refreshToken) {
    snoowrap.fromAuthCode({
      code: code,
      grantType: 'authorization_code',
      redirectUri: redirectUrl,
      clientId: clientId,
      clientSecret: clientSecret,
      userAgent: userAgent
    }).then(r => {
      localStorage.setItem('token', r.access_token);
      localStorage.setItem('refreshToken', r.refresh_token);
      window.location = redirectUrl;
    })
  } 
}

if (token) {
  r = new snoowrap({
    userAgent: userAgent,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken
  });
  //r.getSubreddit("France").getLinkFlairTemplates().then(console.log);
}


export async function fetchSubredditFlair(subreddit) {
  if (r) {
    return await r.getSubreddit(subreddit).getLinkFlairTemplates();
  }
}

export async function fetchSubredditByFlair(subreddit, sorting, after, time, flair) {
  return await r.search({ query: `flair:${flair}` ,subreddit: subreddit, sort: sorting, after: after });
}

export async function fetchSubredditAPI(subreddit, sorting, after, time) {
  switch (sorting) {
    case 'hot':
      return await r.getHot(subreddit, {limit: 25, after: after, time: time});
    case 'new':
      return await r.getNew(subreddit, {limit: 25, after: after, time: time});
    case 'rising':
      return await r.getRising(subreddit, {limit: 25, after: after, time: time});
    case 'controversial':
      return await r.getControversial(subreddit, {limit: 25, after: after, time: time});
    case 'top':
      return await r.getTop(subreddit, {limit: 25, after: after, time: time});
    case 'gilded':
      return await r.getGilded(subreddit, {limit: 25, after: after, time: time});
    case 'random':
      return await r.getRandomSubmission(subreddit, {limit: 25, after: after, time: time});
    default:
      return await r.getHot(subreddit, {limit: 25, after: after, time: time});
  }
}

export async function aboutMe() {
  return await r.getMe();
}

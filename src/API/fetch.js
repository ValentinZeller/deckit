import { AbortManager } from "./AbortManager";

export let abortManager = new AbortManager();

export async function fetchAbout(url) {
    try {
        let response = await fetch(`https://www.reddit.com/r/${url}/about.json`)
        let data = await response.json();

        if (response.ok) {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(error);
        }
    }
}

export async function fetchSubreddit(url, sorting, after, time) {
    try {
        let response = await fetch(`https://www.reddit.com/r/${url}/${sorting}.json?after=${after}&limit=25&t=${time}&raw_json=1`)
        let data = await response.json();

        if (response.ok) {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(error);
        }
    }
}

export async function fetchPost(url, sorting) {
    try {
        let response = await fetch(`https://www.reddit.com${url}.json?limit=100&sort=${sorting}&raw_json=1`, { signal: abortManager.controller.signal })
        let data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(error);
        }
    }
}

export async function fetchComment(url) {
    try {
        let response = await fetch(`https://www.reddit.com/${url}.json?limit=100&raw_json=1`, { signal: abortManager.controller.signal })
        let data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(error);
        }
    }
}
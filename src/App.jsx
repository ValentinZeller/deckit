import './App.scss';
import Sidebar from './components/Sidebar';
import Subreddit from './components/Subreddit';
import Post from './components/Post';
import React from 'react';
import { useState, useEffect, createRef, useRef } from 'react';
import { fetchAbout, abortManager } from './API/fetch.js';

function App() {
  const cacheSubreddit = () => {
    const cacheSubs = JSON.parse(localStorage.getItem("subreddits"));
    if (cacheSubs) {
      cacheSubs.map(subreddit => {
        return subreddit;
      })
    }
    return cacheSubs;
  }

  const [subreddits, setSubreddits] = useState(cacheSubreddit);

  const [selectedSubreddit, setSelectedSubreddit] = useState();
  let cacheWidth = 25;
  if (localStorage.getItem("columnWidth")) {
    cacheWidth = localStorage.getItem("columnWidth");
  }
  let [columnWidth, setColumnWidth] = useState(cacheWidth);

  const [posts, setPosts] = useState([]);
  const subsRef = useRef([]);
  const mainRef = useRef();
  let [icons, setIcons] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function updateIcon(url) {
      const data = await fetchAbout(url);
      let src = "";
      if (data.icon_img !== '') {
        src = data.icon_img;
      } else if (data.community_icon !== '') {
        src = data.community_icon.split('?')[0];
      } else {
        src = process.env.PUBLIC_URL + "/favicon.png";
      }
      icons[url] = src;
      setIcons({ ...icons });
    }

    if (isMounted) {
      if (subreddits !== null && subreddits !== undefined && subreddits.length > 0) {
        subreddits.forEach(subreddit => {
          updateIcon(subreddit);
        })
      }
    }

    return () => { isMounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subreddits]);

  useEffect(() => {
    localStorage.setItem("columnWidth", columnWidth);
  }, [columnWidth])

  const add = (name) => {
    if (subreddits === null) {
      setSubreddits([name]);
    } else if (!subreddits.includes(name)) {
      setSubreddits([name, ...subreddits]);
    }
  }

  const showPost = (item, name) => {
    setPosts([item]);
    setSelectedSubreddit(name);
  }

  const hidePost = (name) => {
    abortManager.abort();
    setPosts([]);
    setSelectedSubreddit();
    setTimeout(() => {
      focusSubreddit(name);
    }, 10);
  }

  const isSelected = (name) => {
    if (selectedSubreddit !== null && selectedSubreddit !== undefined) {
      return selectedSubreddit !== name;
    } else {
      return false;
    }
  }

  const focusSubreddit = (name) => {
    subsRef.current.forEach(sub => {
      if (sub.current.id === name) {
        mainRef.current.scrollLeft = sub.current.offsetLeft - 90;
      }
    });
  }

  const handleTags = (tags) => {
    setSubreddits(tags);
    localStorage.setItem("subreddits", JSON.stringify(tags));
  }

  return (
    <div className="App h-screen overflow-y-hidden flex bg-white dark:bg-gray-800 dark:text-slate-300">
      <Sidebar
        clickFunction={add}
        tagFunction={handleTags}
        subreddits={subreddits}
        columnWidth={columnWidth}
        widthFunction={setColumnWidth}
      >
        {(subreddits && icons) ? subreddits.map((subreddit, index) => {
          return (
            <li key={index} className='h-10' onClick={() => focusSubreddit(subreddit)}>
              <img src={icons[subreddit]} alt={subreddit} className="w-12 hover:cursor-pointer" />
            </li>
          )
        }
        ) : null}
      </Sidebar>
      <div className="subs flex gap-0 overflow-x-auto overflow-y-hidden" ref={mainRef}>
        {subreddits ? subreddits.map(
          (item, i) => (
            <Subreddit
              key={i}
              ref={subsRef.current[i] ? subsRef.current[i] : subsRef.current[i] = createRef()}
              tabIndex={i}
              name={item}
              hideFunction={posts[0] ? () => hidePost(item) : null}
              clickPost={showPost}
              hidden={isSelected(item)}
              columnWidth={columnWidth}
              icon={icons[item]}
            />
          )
        ) : null}
        {posts ? posts.map(
          (item, i) => (
            <Post
              key={i}
              title={item.title}
              url={item.url}
              permalink={item.permalink}
              vote={item.ups}
              author={item.author}
              comments={item.num_comments}
              date={item.created_utc}
              likes={item.likes}
            />
          )
        ) : null}
      </div>
    </div>

  );
}

export default App;

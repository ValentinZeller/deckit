import './App.scss';
import Sidebar from './components/Sidebar.js';
import Subreddit from './components/Subreddit';
import Post from './components/Post';
import { useState, useEffect, createRef, useRef } from 'react';

function App() {

  const [subreddits, setSubreddits] = useState(
    JSON.parse(localStorage.getItem("subreddits"))
  );

  const [posts, setPosts] = useState([]);
  const subsRef = useRef([]);
  const mainRef = useRef();
  let [icons, setIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    localStorage.setItem("subreddits", JSON.stringify(subreddits));
  }, [subreddits]);

  useEffect(() => {
    if (subreddits !== null) {
      subreddits.forEach(subreddit => {
        fetchAbout(subreddit.name);
      })
    }
  }, []);

  async function fetchAbout(url) {
    await fetch(`https://www.reddit.com/r/${url}/about.json`)
    .then(function(response){
        return response.json();
    }).then(function(data){
      setIsLoading(false);
      let src = "";
      if (data.data.icon_img !== ''){
        src = data.data.icon_img;
      } else if (data.data.community_icon !== '') {
        src = data.data.community_icon.split('?')[0];
      } else {
        src = "r/" + url[0].toUpperCase();
      }
      setIcons(icons => [...icons, {src: src, name: url}]);
    }).catch(error => {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    });
  }  

  const add = (name) => {
    if (!subreddits.includes(name)) {
      setSubreddits([{name:name, hidden:false}, ...subreddits]);
    }
  }

  const remove = (name) => {
    setSubreddits(subreddits.filter(subreddit => subreddit.name !== name));
  }

  const showPost = (item, name) => {
    setPosts([item]);
    setSubreddits(subreddits.map(subreddit => {
      if (subreddit.name !== name) {
        return {name:subreddit.name,hidden:true};
      }
      return subreddit;
    }));
  }

  const hidePost = (name) => {
    setPosts([]);
    setSubreddits(subreddits.map(subreddit => {
      if (subreddit.name !== name) {
        return {name:subreddit.name,hidden:false};
      }
      return subreddit;
    }));

    setTimeout(() => {
      focusSubreddit(name);
    }, 100);
  }

  const focusSubreddit = (name) => {
    subsRef.current.forEach(sub => {
      if (sub.current.id === name) {
        mainRef.current.scrollLeft = sub.current.offsetLeft - 90;
      }
    });
  }

  return (
    <div className="App h-screen flex bg-white dark:bg-gray-800 dark:text-white">
      <Sidebar clickFunction={add} tagFunction={setSubreddits} subreddits={subreddits} >
        {subreddits ? subreddits.map((subreddit, index) => {
          let src = "";
          if (icons.length === subreddits.length) {
            src = icons.find(icon => icon.name === subreddit.name).src
          }
          return(
            <li key={index} className='h-10' onClick={() => focusSubreddit(subreddit.name)}>
              <img src={src} alt={subreddit.name} className="w-12 hover:cursor-pointer"/>
            </li>
          )}
        ) : null}
        {isError && <div>Error fetching data.</div>}
      </Sidebar>
      <div className="subs flex gap-0 overflow-x-auto overflow-y-hidden" ref={mainRef}>
        {subreddits ? subreddits.map(
          (item, i) => ( 
            <Subreddit 
              key={i}
              ref={subsRef.current[i] ? subsRef.current[i] : subsRef.current[i] = createRef()}
              tabIndex={i}
              name={item.name}
              //clickFunction={!posts[0] ? () => remove(item.name) : null}
              hideFunction={posts[0] ? () => hidePost(item.name) : null}  
              clickPost={showPost}
              hidden={item.hidden} />
            )
          ) : null}
        {posts ? posts.map(
          (item,i) => ( 
            <Post 
              key={i} 
              title={item.title} 
              url={item.url} 
              permalink={item.permalink} 
              vote={item.ups} 
              author={item.author} 
              comments={item.num_comments} 
              date={item.created_utc} /> 
              )
            ) : null}
      </div>
    </div>

  );
}

export default App;

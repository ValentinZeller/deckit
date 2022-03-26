import './Subreddit.scss';
import SortingButton from './SortingButton';
import { useState, useEffect, useRef, forwardRef } from 'react'
import PostHeader from './PostHeader';
import { XIcon, ArrowSmLeftIcon } from '@heroicons/react/solid';
import MyPopover from './MyPopover';

const Subreddit = forwardRef((props, ref) => {
    let [posts, setPosts] = useState([]);
    let [sorting, setSorting] = useState('hot');
    let [after, setAfter] = useState();
    let [time, setTime] = useState('day');
    let [flair, setFlair] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    let afterTemp = useRef();

    useEffect(() => {
        let isMounted = true;
        const fetchSubreddit = async () => await fetch(`https://www.reddit.com/r/${props.name}/${sorting}.json?after=${after}&limit=25&t=${time}&raw_json=1&f=flair_name:"${flair}"`)
        .then(response => response.json())
        .then(data => {
            if (isMounted) {
                setIsLoading(false);
                if (posts.length === 0 || after === undefined) {
                    setPosts(data.data.children.map(child => child.data));
                } else {
                    let arrMerge = posts.concat(data.data.children.map(child => child.data));
                    setPosts(arrMerge);
                }
                afterTemp.current = data.data.after;
            }
        }).catch(error => {
            setIsLoading(false);
            setIsError(true);
            console.log(error);
        });
        fetchSubreddit();

        return () => isMounted = false;
      }, [after, props.name, sorting, time, flair]);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    function handleSorting(sorting) {
        setSorting(sorting);
        setAfter(undefined);
        setPosts([]);
    }

    function handleTopSorting(time) {
        handleSorting('top');
        setTime(time);
    }

    function handleFlair(flair) {
        setFlair(flair);
        setAfter(undefined);
        setPosts([]);
    }

    function handleScroll(e) {
        let element = e.target
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            setAfter(afterTemp.current);
        }
    }

    return(
        <div id={props.name} tabIndex={props.tabIndex} ref={ref} onScroll={handleScroll} className={`subreddit h-screen overflow-y-scroll basis-1/4 flex-none ${props.hidden ? 'hidden' : null}`}>
            <div className="subreddit-header flex flex-row p-1 z-index-0 sticky top-0 bg-slate-900 items-center gap-1">
                <span>{props.name}</span>
                <SortingButton name="Hot" sortFunction={() => handleSorting('hot')}/>
                <SortingButton name="New" sortFunction={() => handleSorting('new')}/>
                <SortingButton name="Rising" sortFunction={() => handleSorting('rising')}/>
                <MyPopover name={'Top'}>
                    <SortingButton name="Now" sortFunction={() => handleTopSorting('hour')}/>
                    <SortingButton name="Today" sortFunction={() => handleTopSorting('day')}/>
                    <SortingButton name="This Week" sortFunction={() => handleTopSorting('week')}/>
                    <SortingButton name="This Month" sortFunction={() => handleTopSorting('month')}/>
                    <SortingButton name="This Year" sortFunction={() => handleTopSorting('year')}/>
                    <SortingButton name="All Time" sortFunction={() => handleTopSorting('all')}/>
                </MyPopover>
                {props.hideFunction ? <button onClick={props.hideFunction} className="w-8 bg-red-500 justify-self-end"><ArrowSmLeftIcon /></button> : <></>}
                {props.clickFunction ? <button onClick={props.clickFunction} className="w-8 bg-red-700 justify-self-end"><XIcon /></button> : <></>}
            </div>
            <div className="subreddit-body bg-slate-700 mb-4" >
                {posts && posts.map(
                    (item, i) => ( 
                        <PostHeader 
                            key={i} 
                            thumbnail={item.thumbnail} 
                            title={item.title} 
                            vote={item.ups} 
                            author={item.author} 
                            comments={item.num_comments} 
                            date={item.created_utc} 
                            clickPost={() => props.clickPost(item, props.name)} /> 
                ))}
                {isError && <div>Error fetching data.</div>}
            </div>
        </div>
    );
});

export default Subreddit;
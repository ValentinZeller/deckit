import './Subreddit.scss';
import SortingButton from './SortingButton';
import { useState, useEffect, useRef, forwardRef } from 'react'
import PostHeader from './PostHeader';
import { XIcon, ArrowSmLeftIcon } from '@heroicons/react/solid';
import MyPopover from './MyPopover';
import { fetchSubreddit } from '../API/fetch';

const Subreddit = forwardRef((props, ref) => {
    let [posts, setPosts] = useState([]);
    let [sorting, setSorting] = useState('hot');
    let [after, setAfter] = useState();
    let [time, setTime] = useState('day');
    let afterTemp = useRef();

    useEffect(() => {
        let isMounted = true;
        async function updateSubreddit() {
            const data = await fetchSubreddit(props.name, sorting, after, time);
            if (posts.length === 0 || after === undefined) {
                setPosts(data.children.map(child => child.data));
            } else {
                let arrMerge = posts.concat(data.children.map(child => child.data));
                setPosts(arrMerge);
            }
            afterTemp.current = data.after;
        }
        if (isMounted) {
            updateSubreddit();
        }

        return () => { isMounted = false }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [after, props.name, sorting, time]);

    function handleSorting(sorting) {
        setSorting(sorting);
        setAfter(undefined);
        setPosts([]);
    }

    function handleTopSorting(time) {
        handleSorting('top');
        setTime(time);
    }

    function handleScroll(e) {
        let element = e.target
        if ((element.scrollHeight - element.scrollTop - 20) <= element.clientHeight) {
            setAfter(afterTemp.current);
        }
    }

    function scrollTop(e) {
        e.target.parentElement.scrollTop = 0;
    }

    return(
        <div id={props.name} style={{flex: `0 0 ${props.columnWidth}%`}} tabIndex={props.tabIndex} ref={ref} onScroll={handleScroll} className={`subreddit h-screen overflow-y-scroll ${props.hidden ? 'hidden' : ''}`}>
            <div onClick={scrollTop} className="subreddit-header hover:cursor-pointer flex flex-row lg:p-1 z-10 sticky top-0 bg-slate-900 items-center lg:gap-1">
                { props.icon !== null ? <img src={props.icon} alt={props.name} className="h-6 w-6 lg:h-8 lg:w-8 rounded-full lg:mr-2" /> : <span>{props.name}</span>}
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
                {props.hideFunction ? <button onClick={props.hideFunction} className="w-8 bg-red-500"><ArrowSmLeftIcon /></button> : <></>}
                {props.clickFunction ? <button onClick={props.clickFunction} className="w-8 bg-red-700"><XIcon /></button> : <></>}
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
            </div>
        </div>
    );
});

export default Subreddit;
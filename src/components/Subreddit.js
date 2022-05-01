import './Subreddit.scss';
import SortingButton from './SortingButton';
import { useState, useEffect, useRef, forwardRef, Fragment } from 'react'
import PostHeader from './PostHeader';
import { XIcon, ArrowSmLeftIcon, ChevronDownIcon, MenuIcon } from '@heroicons/react/solid';
import MyPopover from './MyPopover';
import { fetchSubreddit } from '../API/fetch';
import { r, fetchSubredditAPI, fetchSubredditByFlair, fetchSubredditFlair } from '../API/main';
import { Tab } from '@headlessui/react'

const Subreddit = forwardRef((props, ref) => {
    let lastIndex = 2;
    if (r) {
        lastIndex = 3;
    }
    let cacheWidth = localStorage.getItem(`${props.name}_width`);
    if (!cacheWidth) {
        cacheWidth = props.columnWidth;
    }
    let [width,  setWidth] = useState(cacheWidth);
    const [selectedIndex, setSelectedIndex] = useState(lastIndex)
    
    let [posts, setPosts] = useState([]);
    let [sorting, setSorting] = useState('hot');
    let [after, setAfter] = useState();
    let [time, setTime] = useState('day');
    let [flair, setFlair] = useState();
    let [flairList, setFlairList] = useState([]);
    let afterTemp = useRef();

    useEffect(() => {
        let isMounted = true;
        async function updateSubreddit() {
            let data;
            if (r && r.ratelimitRemaining > 0 && r.ratelimitRemaining !== null) {
                if (flair !== undefined) {
                    data = await fetchSubredditByFlair(props.name, sorting, after, time, flair);
                } else {
                    data = await fetchSubredditAPI(props.name, sorting, after, time);
                }
                afterTemp.current = data._query.after;
                if (posts.length === 0 || after === undefined) {
                    setPosts(data.toJSON());
                } else {
                    let arrMerge = [...posts, ...data.toJSON()];
                    setPosts(arrMerge);
                }
            } else {
                data = await fetchSubreddit(props.name, sorting, after, time);
                afterTemp.current = data.after;
                if (posts.length === 0 || after === undefined) {
                    setPosts(data.children.map(child => child.data));
                } else {
                    let arrMerge = posts.concat(data.children.map(child => child.data));
                    setPosts(arrMerge);
                }
            }
            
            if (flairList) {
                let tempFlair = await fetchSubredditFlair(props.name);
                setFlairList(tempFlair);
            }
        }
        if (isMounted) {
            updateSubreddit();
        }

        return () => { isMounted = false }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [after, props.name, sorting, time, flair]);

    function handleSorting(sort) {
        if (sort !== sorting) {
            setAfter(undefined);
            setPosts([]);
            setSorting(sort);
        }
    }

    function handleTopSorting(times) {
        if (times !== time) {
            handleSorting('top');
            setTime(time);
        }
    }

    function handleScroll(e) {
        let element = e.target
        if ((element.scrollHeight - element.scrollTop - 20) <= element.clientHeight) {
            setAfter(afterTemp.current);
        }
    }

    function handleWidth(e) {
        let element = e.target;
        setWidth(element.value);
        localStorage.setItem(`${props.name}_width`, element.value);
    }

    function scrollTop() {
        ref.current.scrollTop = 0;
    }

    function handleTab(e) {
        if (e.target.attributes.class.value.includes("selected-tab")) {
            setSelectedIndex(lastIndex);
        }
    }

    return(
        <div id={props.name} onClick={scrollTop} style={{flex: `0 0 ${width}%`}} tabIndex={props.tabIndex} ref={ref} onScroll={handleScroll} className={`subreddit h-screen overflow-y-scroll ${props.hidden ? 'hidden' : ''}`}>
            <div className="subreddit-header hover:cursor-pointer  lg:p-1 z-10 sticky top-0 dark:bg-slate-900 items-center lg:gap-1">
                <div className='flex'>
                    {props.icon !== null ? <img src={props.icon} alt={props.name} className="h-6 w-6 lg:h-8 lg:w-8 inline-block rounded-full lg:mr-2" /> : null}
                    <span className='pr-2 pt-1'>{props.name}</span>
                    <Tab.Group onClick={handleTab} as="div" className="ml-auto mt-1" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                        <Tab.List className="tablist">
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button onClick={handleTab} className={selected ? 'selected-tab' : ''}>
                                    {sorting}<ChevronDownIcon className={`lg:w-6 inline ${selected ? "transform rotate-180 selected-tab" : ""}`}/>
                                </button>
                            )}
                            </Tab>
                            { r ? 
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button onClick={handleTab} className={selected ? 'selected-tab' : ''}>
                                    {flair ? flair : "flair"}<ChevronDownIcon className={`lg:w-6 inline ${selected ? "transform rotate-180 selected-tab" : ""}`}/>
                                </button>
                            )}
                            </Tab> : null }
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                <button onClick={handleTab} className={selected ? 'selected-tab' : ''}>
                                    <MenuIcon className={`lg:w-6 inline ${selected ? 'selected-tab' : ''}`}/>
                                </button>
                            )}
                            </Tab>
                            <Tab></Tab>
                        </Tab.List>
                        <Tab.Panels as="div" className="mt-1">
                            <Tab.Panel>
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
                            </Tab.Panel>
                            { r ?
                            <Tab.Panel>
                                <SortingButton name="None" sortFunction={() => setFlair(undefined)}/>
                                { flairList && flairList.map(
                                    (flairElm, index) => (
                                        <SortingButton key={index} name={flairElm.flair_text} sortFunction={() => setFlair(flairElm.flair_text)}/>
                                    )
                                )}
                            </Tab.Panel> : null }
                            <Tab.Panel>
                                <span>Width : </span><input type="number" name="width" id="width" value={width} onChange={handleWidth} min="1" max="100" className="w-12"/>
                            </Tab.Panel>
                            <Tab.Panel></Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                    {props.hideFunction ? <button onClick={props.hideFunction} className="w-8 bg-red-500 ml-1 place-self-start"><ArrowSmLeftIcon /></button> : <></>}
                    {props.clickFunction ? <button onClick={props.clickFunction} className="w-8 bg-red-700 ml-auto"><XIcon /></button> : <></>}
                </div>
            </div>
            <div className="subreddit-body dark:bg-slate-700 mb-4" >
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
                            clickPost={() => props.clickPost(item, props.name)}  
                        />
                    ) 
                )}
            </div>
        </div>
    );
});

export default Subreddit;
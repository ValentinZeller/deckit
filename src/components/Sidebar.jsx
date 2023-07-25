import SidebarSetting from './SidebarSetting';
import React from 'react';
import { Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import './Sidebar.scss';

import { useRef } from 'react';

function Sidebar(props) {
    const sidebarRef = useRef();

    function refreshPage() {
        window.location.reload(false);
    }

    let styleSidebarSubList;
    if (sidebarRef.current) {
        styleSidebarSubList = {
            maxHeight: "calc(100vh  - " + 50 * (sidebarRef.current.childElementCount - 1) + "px)"
        };
    }


    return (
        <div className="sidebar w-12 dark:bg-slate-900 h-screen">
            <ul ref={sidebarRef}>
                <li className='h-12'>
                    <button className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={refreshPage}><ArrowPathIcon /></button>
                </li>
                <SidebarSetting
                    name="setting"
                    icon={<Cog6ToothIcon />}
                    tagFunction={props.tagFunction}
                    subreddits={props.subreddits}
                    columnWidth={props.columnWidth}
                    widthFunction={props.widthFunction}
                />
                <ul className="sidebar-subreddit overflow-y-auto overflow-x-hidden" style={styleSidebarSubList}>
                    {props.children}
                </ul>
            </ul>
        </div>
    );
}

export default Sidebar;
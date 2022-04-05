import SidebarSetting from './SidebarSetting.js';
import SidebarSearch from './SidebarSearch.js';
import { SearchIcon } from '@heroicons/react/solid';
import { CogIcon } from '@heroicons/react/solid';
import { RefreshIcon } from '@heroicons/react/solid';
import './Sidebar.scss';

function Sidebar(props) {
    function refreshPage() {
        window.location.reload(false);
    }

    return(
        <div className="sidebar w-12 dark:bg-slate-900 h-screen">
            <ul>
                <li className='h-12'>
                    <button className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={refreshPage}><RefreshIcon /></button>
                </li>
                <SidebarSearch name="add" icon={<SearchIcon />} clickFunction={props.clickFunction} />
                <SidebarSetting name="setting" icon={<CogIcon />} tagFunction={props.tagFunction} subreddits={props.subreddits} columnWidth={props.columnWidth} widthFunction={props.widthFunction} />
                <ul className="sidebar-subreddit overflow-y-auto overflow-x-hidden">
                    {props.children}
                </ul>
            </ul>
        </div>
    );
}

export default Sidebar;
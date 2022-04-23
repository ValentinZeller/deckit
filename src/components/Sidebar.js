import SidebarSetting from './SidebarSetting.js';
import SidebarSearch from './SidebarSearch.js';
import { SearchIcon, CogIcon, RefreshIcon, LoginIcon, InformationCircleIcon } from '@heroicons/react/solid';
import './Sidebar.scss';
import { login, r } from '../API/main';
import SidebarUserInfo from './SidebarUserInfo.js';

function Sidebar(props) {
    function refreshPage() {
        window.location.reload(false);
    }

    function handleLogin() {
        login();
    }

    return(
        <div className="sidebar w-12 dark:bg-slate-900 h-screen">
            <ul>
                <li className='h-12'>
                    <button className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={refreshPage}><RefreshIcon /></button>
                </li>
                { r.refreshToken ? 
                <SidebarUserInfo 
                    name="userinfo" 
                    icon={<InformationCircleIcon/>} 
                />
                : 
                <li className='h-12'>
                    <button className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={handleLogin}><LoginIcon /></button>
                </li> }
                
                {/* <SidebarSearch name="add" icon={<SearchIcon />} clickFunction={props.clickFunction} /> */}
                <SidebarSetting 
                    name="setting" 
                    icon={<CogIcon />} 
                    tagFunction={props.tagFunction} 
                    subreddits={props.subreddits} 
                    columnWidth={props.columnWidth} 
                    widthFunction={props.widthFunction} 
                    subscriptionFunction={props.subscriptionFunction}
                    subscription={props.subscription}
                />
                <ul className="sidebar-subreddit overflow-y-auto overflow-x-hidden">
                    {props.children}
                </ul>
            </ul>
        </div>
    );
}

export default Sidebar;
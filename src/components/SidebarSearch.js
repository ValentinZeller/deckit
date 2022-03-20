import SidebarElement from './SidebarElement'
import { createRef } from 'react'

function SidebarSearch(props) {
    let searchRef = createRef("search");

    let sendData = () => {
        props.clickFunction(searchRef.current.value);
    }

    let onKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendData();
        }
    }

    return(
        <SidebarElement name={props.name} icon={props.icon}>
            <input autoFocus id="search" onKeyDown={(e) => onKeyDown(e)} placeholder="Subreddit Name" className="dark:bg-slate-900 pl-2" ref={searchRef} />
            <button onClick={sendData} className="w-8 hover:bg-slate-500">
                {props.icon}
            </button>
        </SidebarElement>
    );
}

export default SidebarSearch;
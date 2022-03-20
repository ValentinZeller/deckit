import { ArrowUpIcon } from "@heroicons/react/solid";

function displayDate(utc) {
    let date = new Date(0);
    if (utc) {
        date.setUTCSeconds(utc);
    }

    //Date display
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    
    return {day: day, month: month, year: year, hour: hour, minute: minute, second: second};
}

function PostDetail(props) {

    return(
        <div className="post-detail bg-slate-800 p-1">
        <span className="post-vote p-2">{props.vote} <ArrowUpIcon className="w-4 inline"/></span>
        <span className="post-author">- <a className="text-blue-500 hover:text-blue-300" href={`https://www.reddit.com/user/${props.author}`}>{props.author}</a></span>
        {props.comments ? <span className="post-commment"> - {props.comments} comments</span> : null }
        <div>
            <span className="post-date">
                {displayDate(props.date).day}/{displayDate(props.date).month}/{displayDate(props.date).year} - {displayDate(props.date).hour}:{displayDate(props.date).minute}:{displayDate(props.date).second}
            </span>
        </div>
    </div>
    );
}

export default PostDetail;
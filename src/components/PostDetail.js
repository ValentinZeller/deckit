import { ArrowUpIcon } from "@heroicons/react/solid";
import { displayDate } from "../utils/date";

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
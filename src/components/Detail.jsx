import { ArrowUpIcon } from "@heroicons/react/24/solid";
import React from 'react';
import { displayDate } from "../utils/date";
import "./Detail.scss";

function PostDetail(props) {
    return (
        <div className="post-detail bg-slate-800 p-1">
            {props.vote ?
                <span className="post-vote p-2">{props.vote} <ArrowUpIcon className="w-4 inline" /> -</span>
                : null}
            <span className="post-author"><a className="text-blue-500 hover:text-blue-300" href={`https://www.reddit.com/user/${props.author}`}>{props.author}</a></span>
            {props.comments ? <span className="post-commment"> - {props.comments} comments</span> : null}
            <div>
                <span className="post-date">
                    {displayDate(props.date, true)}
                </span>
            </div>
        </div>
    );
}

export default PostDetail;
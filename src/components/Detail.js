import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/solid";
import { useState } from 'react'
import { displayDate } from "../utils/date";
import { r } from "../API/main";
import "./Detail.scss";

function PostDetail(props) {
    let voteValue = 0;

    if ( r && r.ratelimitRemaining > 0 && r.ratelimitRemaining !== null ) {
        r.getSubmission(props.id).likes.then(
            likes => {
                switch (likes) {
                    case true:
                        voteValue = 1;
                        break;
                    case false:
                        voteValue = -1;
                        break;
                    default:
                        voteValue = 0;
                }
            }
        )
    }

    let [voteStore, setVoteStore] = useState(voteValue);

    function displayButtonVote() {
        if ( r ) {
            return <span>
                <button onClick={() => vote(1)} className={`hover:text-orange-700 ${voteStore === 1 ? "text-orange-500" : ""}`}>
                    <ArrowUpIcon className="w-4 inline"/>
                </button>
                <button onClick={() => vote(-1)} className={`hover:text-blue-700 ${voteStore === -1 ? "text-blue-500" : ""}`}>
                    <ArrowDownIcon className="w-4 inline"/>
                </button></span>;
        } else {
            return <ArrowUpIcon className="w-4 inline"/>
        }
    }

    function vote(voteSent) {
        if ( !r || r.ratelimitRemaining <= 0 || r.ratelimitRemaining === null ) {
            console.log("Not able to vote");
            return;
        }
        if ( voteStore !== voteSent ) {
            if (voteSent === 1) { 
                r.getSubmission(props.id).upvote();
            } else {
                r.getSubmission(props.id).downvote();
            }
            setVoteStore(voteSent);
        } else {
            r.getSubmission(props.id).unvote();
            setVoteStore(0);
        }
    }

    return(
        <div className="post-detail bg-slate-800 p-1">
            {props.vote ? 
                <span className="post-vote p-2">{props.vote+voteStore} {displayButtonVote()} -</span> 
                : null }
            <span className="post-author"><a className="text-blue-500 hover:text-blue-300" href={`https://www.reddit.com/user/${props.author}`}>{props.author}</a></span>
            {props.comments ? <span className="post-commment"> - {props.comments} comments</span> : null }
            <div>
                <span className="post-date">
                    {displayDate(props.date, true)}
                </span>
            </div>
        </div>
    );
}

export default PostDetail;
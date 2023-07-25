import './PostHeader.scss';
import React from 'react';
import PostDetail from './Detail';

function PostHeader(props) {

    function displayThumbnail() {
        switch (props.thumbnail) {
            case '':
            case 'spoiler':
            case 'self':
            case 'default':
            case 'nsfw':
                return <div className="thumbnail-placeholder"></div>;
            default:
                return <img className="post-thumbnail" src={props.thumbnail} alt="thumbnail" />;;
        }
    }

    return (
        props.thumbnail !== 'spoiler' || !props.hideSpoiler ?
            <div className="subreddit-post">
                <div onClick={props.clickPost} className="subreddit-post-header hover:bg-slate-500 hover:cursor-pointer flex flex-1 space-x-2 p-2">
                    <div className="subreddit-post-image inline-block">
                        {displayThumbnail()}
                    </div>
                    <span className="subreddit-post-title align-top">{props.title}</span>
                </div>
                <PostDetail
                    vote={props.vote}
                    author={props.author}
                    comments={props.comments}
                    date={props.date}
                    id={props.id}
                    likes={props.likes}
                />
            </div>
            : null
    );
}

export default PostHeader;
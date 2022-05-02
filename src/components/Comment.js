import './Comment.scss';
import { useState, useEffect } from 'react'
import PostDetail from "./Detail";
import Content from "./Content";
import { fetchComment } from "../API/fetch";
import { randomColor } from "../utils/color";

function Comment(props) {
    let [nestedComments] = useState(props.nestedComments);
    let [replies, setReplies] = useState();

    useEffect(() => {
        let isMounted = true;
        
        async function updateComment() {
            if (props.permalink !== undefined) {
                const data = await fetchComment(props.permalink);
                if (data) {
                    if (data[1].data.children[0].data.replies) {
                        setReplies(data[1].data.children[0].data.replies.data.children.map(child => child.data));
                    }
                }
            }
        }
        if (isMounted) {
            setReplies();
            updateComment();
        }
        
        return () => { isMounted = false }
    }, [props.permalink]);

    return(
        <div className={`comment ${nestedComments ? 'nested' : 'notnested' }`} style={{borderLeft: `1px solid ${randomColor()}`}}>
            <div className="comment-item mt-1 pb-1">
                <PostDetail vote={props.ups} author={props.author} date={props.date} />
                <div className="comment-item-body mt-2 pl-2">
                    <Content content={props.body}/>
                    {(replies) ? replies.map(
                        (child, index) => (
                            <Comment 
                                key={index}
                                id={child.id} 
                                permalink={child.permalink}
                                ups={child.ups} 
                                author={child.author} 
                                date={child.created_utc} 
                                body={child}
                                nestedComments={!nestedComments} />
                        )) : null}
                </div>
            </div>
        </div>
    );
}

export default Comment;
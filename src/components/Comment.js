import './Comment.scss';
import { useState, useEffect } from 'react'
import PostDetail from "./PostDetail";
import Content from "./Content";
import { fetchComment } from "../API/fetch";

function Comment(props) {
    let [nestedComments] = useState(props.nestedComments);
    let [replies, setReplies] = useState();

    const randomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        let isMounted = true;
        setReplies();
        
        async function updateComment() {
            if (props.permalink !== undefined) {
                const data = await fetchComment(props.permalink);
                if (data[1]) {
                    if (data[1].data.children[0].data.replies) {
                        setReplies(data[1].data.children[0].data.replies.data.children.map(child => child.data));
                    }
                }
            }
        }
        if (isMounted) {
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
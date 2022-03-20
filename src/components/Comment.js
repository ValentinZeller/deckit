import './Comment.scss';
import { useState, useEffect } from 'react'
import PostDetail from "./PostDetail";
import Content from "./Content";

function Comment(props) {
    let [nestedComments] = useState(props.nestedComments);

    let [replies, setReplies] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchComment() {
            if (props.permalink !== undefined) {
                await fetch(`https://www.reddit.com/${props.permalink}.json?&raw_json=1`)
                .then(response => response.json())
                .then(data => {
                    if (isMounted) {
                        setIsLoading(false);
                        if (data[1]) {
                            if (data[1].data.children[0].data.replies) {
                                setReplies(data[1].data.children[0].data.replies.data.children.map(child => child.data));
                            }
                        }
                    }
                }).catch(error => {
                    setIsLoading(false);
                    setIsError(true);
                    console.log(error);
                });
            }
        }
        fetchComment();

        return () => isMounted = false;
    }, [props.permalink]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return(
        <div className={`comment ${nestedComments ? 'nested' : 'notnested' }`}>
            <div className="comment-item mt-1 pb-1">
                <PostDetail vote={props.ups} author={props.author} date={props.date} />
                <div className="comment-item-body mt-2 pl-2">
                    <Content content={props.body}/>
                    {isError && <div>Error fetching data.</div>}
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
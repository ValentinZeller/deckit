import PostDetail from "./Detail";
import Comment from "./Comment";
import Content from "./Content";
import SortingButton from "./SortingButton";
import { useState, useEffect } from 'react'
import { fetchPost } from "../API/fetch";

const Post = (props => {
    let [post, setPost] = useState();
    let [comments, setComments] = useState();
    let [sorting, setSorting] = useState('confidence');
    
    useEffect(() => {
        setComments([]);
        setPost([]);

        async function updatePost() {
            const data = await fetchPost(props.permalink, sorting);
            if (data) {
                setPost(data[0].data.children[0].data);
                setComments(data[1].data.children.map(child => child.data));
            }
        }

        updatePost();
    }, [props.permalink, sorting]);

    return(
        <div className="post overflow-y-scroll overflow-x-hidden basis-3/4">
            <div className="post-header sticky top-0 bg-slate-900 p-2">
                <span className="post-title"><a target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-300" href={`https://www.reddit.com${props.permalink}`}>Link</a> : {props.title}</span>
            </div>
            <div className="post-content top-10">
                <div className={`post-body ${props.crosspost ? 'bg-slate-600' : 'bg-slate-700'} p-3`} >
                    <Content content={post}/>
                </div>
                <PostDetail vote={props.vote} author={props.author} comments={props.comments} date={props.date} />                
                { !props.crosspost ?
                    <div className="post-sorting bg-slate-800 p-2">
                        <span>Sort by : </span>
                        <SortingButton name="Best" sortFunction={() => setSorting('confidence')}/>
                        <SortingButton name="Top" sortFunction={() => setSorting('top')}/>
                        <SortingButton name="New" sortFunction={() => setSorting('new')}/>
                        <SortingButton name="Controversial" sortFunction={() => setSorting('controversial')}/>
                        <SortingButton name="Old" sortFunction={() => setSorting('old')}/>
                        <SortingButton name="Q&A" sortFunction={() => setSorting('qa')}/>
                    </div>
                : null}
            </div>
            <div className="post-comments bg-slate-700 pt-2">
                    {(comments && !props.crosspost) ? comments.map((comment, index) => (
                        <Comment 
                            key={index} 
                            id = {comment.id}
                            permalink = {comment.permalink}
                            vote={comment.ups} 
                            author={comment.author} 
                            date={comment.created_utc} 
                            body={comment}
                            nestedComments={false} />)
                        ) : null}
                </div>
        </div>
    );
});

export default Post;
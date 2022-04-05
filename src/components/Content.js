import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './Content.scss';
import ReactPlayer from 'react-player'
import ImageModal from './ImageModal';
import Post from './Post';

function Content(props) {
    let content;

    let data = props.content;
    
    if (data) {
        if (data.is_self) {
            // Text Post
            content = <ReactMarkdown children={data.selftext} remarkPlugins={[remarkGfm]} />;
        } else if (data.body) {
            // Comment
            content = <ReactMarkdown children={data.body} remarkPlugins={[remarkGfm]} />;
        } else {
            if (data.crosspost_parent_list) {
                // Crosspost
                //content = <Content content={data.crosspost_parent_list[0]} />;
                let crosspost = data.crosspost_parent_list[0];
                content = 
                    <Post 
                        permalink={crosspost.permalink} 
                        vote={crosspost.ups} 
                        author={crosspost.author}
                        comments={crosspost.num_comments}
                        date={crosspost.created_utc}
                        title={crosspost.title}
                        crosspost={true}
                    />;
            } else if (data.is_video || data.domain === "v.redd.it" || data.domain === "youtube.com" || data.domain === "youtu.be" || data.domain === "m.youtube.com") {
                // Video
                if (data.domain === "v.redd.it") {
                    // Reddit
                    content = <ReactPlayer url={data.media.reddit_video.dash_url} controls={true} />
                } else {
                    // Youtube
                    content = <ReactPlayer url={data.url} controls={true} />
                }
            } else if (data.is_gallery) {
                // Gallery
                let keys = data.gallery_data.items;
                content = keys.map((key, index) => {
                    let link;
                    if (data.media_metadata[keys[index].media_id].s.gif)    {
                        link = data.media_metadata[keys[index].media_id].s.gif;
                    } else {
                        link = data.media_metadata[keys[index].media_id].s.u.replace(/&amp;/g,'&');
                    }
                    return <ImageModal key={index} caption={keys[index].caption} url={link} title={data.title} gallery={true} />
                });
            } else if (data.post_hint === "image" || data.post_hint === "Image" || data.domain === "i.redd.it" || data.domain === "i.imgur.com") {
                // Image
                if (data.url.includes(".gifv")) {
                    data.url = data.url.slice(0, -1);
                }
                content = <ImageModal url={data.url} title={data.title} />;
            } else if ( props.domain === "twitter.com" || props.domain === 'gfycat.com') {
                // Embeded content
                content = <ReactMarkdown children={data.media.oembed.html} remarkPlugins={[remarkGfm]} />;
            } else {
                // Link Post
                content = <a href={data.url}>{data.url}</a>;
            }
        }
    }

    return(
        <span className='inline-block'>
            { data ? content : null }
        </span>
    );
}

export default Content;
import SortingButton from "./SortingButton";
import { useState, useEffect } from "react";

function FlairList(props) {
    const [flairs, setFlairs] = useState([]);

    useEffect(() => {
        const fetchFlairList = async (name) => {
            await fetch(`https://www.reddit.com/r/${name}/api/link_flair_v2.json?raw_json=1`)
                .then(response => response.json())
                .then(data => {
/*                     data.forEach(flair => {
                        setFlairs(flairs.concat(flair.text));
                    });*/
                    console.log(data);
                });
        }
        fetchFlairList(props.name);
    }, []);

    return(
        flairs ? flairs.map(flair => <SortingButton name={flair} sortFunction={() => props.sortFunction(flair)} />) : null
    );
}

export default FlairList;
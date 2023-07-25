import './SortingButton.scss'
import React from 'react';

function SortingButton(props) {
    return (
        <button onClick={props.sortFunction} className="sorting-button">{props.name}</button>
    );
}

export default SortingButton;
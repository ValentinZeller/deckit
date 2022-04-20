import './SortingButton.scss'

function SortingButton(props) {
    return(
        <button onClick={props.sortFunction} className="sorting-button">{props.name}</button>
    );
}

export default SortingButton;
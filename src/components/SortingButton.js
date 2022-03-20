function SortingButton(props) {

    return(
        <button onClick={props.sortFunction} className="bg-slate-700 hover:bg-slate-500 p-1 border rounded-md border-black">{props.name}</button>
    );
}

export default SortingButton;
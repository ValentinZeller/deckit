function SortingButton(props) {
    return(
        <button onClick={props.sortFunction} className="bg-slate-700 text-xs lg:text-sm hover:bg-slate-500 border lg:p-1 rounded-md border-black">{props.name}</button>
    );
}

export default SortingButton;
import { useState } from 'react'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { ChevronDownIcon } from '@heroicons/react/24/solid';


function MyPopover(props) {
    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement);

    return (
        <Popover className={"inline-block"}>
            <Popover.Button id={props.name} className="bg-slate-700 text-xs lg:text-sm lg:p-1 border rounded-md border-black" ref={setReferenceElement}>{props.name} <ChevronDownIcon className='lg:w-4 inline' /></Popover.Button>
            <Popover.Panel
                className="popover-panel z-20 dark:bg-slate-800 flex flex-col"
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
            >
                {props.children}
            </Popover.Panel>
        </Popover>
    );
}

export default MyPopover;
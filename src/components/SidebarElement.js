import './SidebarElement.scss';
import { useState } from 'react'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'


function SidebarElement(props) {
    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement,{
         placement:"right"})


    return(
        <li className="h-12">
            <Popover>
                <Popover.Button id={props.name} className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" ref={setReferenceElement}>{props.icon}</Popover.Button>

                { props.children ?   
                <Popover.Panel
                    className="popover-panel z-20 dark:bg-slate-800 flex"
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                    placement="right"
                >
                    {props.children}
                </Popover.Panel> : null}

            </Popover>
        </li>
    );
}

export default SidebarElement;
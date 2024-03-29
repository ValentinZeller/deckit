import { useState, useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import DragSort from '@yaireo/dragsort'
import '@yaireo/dragsort/dist/dragsort.css'
import '@yaireo/tagify/dist/tagify.css'
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';


//import Tags from './tagify/react.tagify'
import Tags from '@yaireo/tagify/dist/react.tagify'

function SidebarSetting(props) {
    let [isOpen, setIsOpen] = useState(false)
    const tagifyRefDragSort = useRef()

    // bind "DragSort" to Tagify's main element and tell
    // it that all the items with the below "selector" are "draggable".
    // This is done inside a `useMemo` hook to make sure it gets initialized
    // only when the ref updates with a value ("current")
    useEffect(() => {
        if (tagifyRefDragSort.current)
            new DragSort(tagifyRefDragSort.current.DOM.scope, {
                selector: '.tagify__tag',
                callbacks: {
                    dragEnd: onDragEnd
                }
            })
    }, [isOpen])

    function onDragEnd(elm) {
        tagifyRefDragSort.current.updateValueByDOMTags()
    }

    function onTagChange(e) {
        props.tagFunction(e.detail.tagify.value.map(tag => {
            return tag.value
        }))
    }

    function onWidthChange(e) {
        props.widthFunction(e.target.value);
    }

    function copyList() {
        navigator.clipboard.writeText(tagifyRefDragSort.current.value.map(item => item.value).join(','));
    }

    return (
        <li className='h-12'>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
                <div className="items-center justify-center p-5">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="relative bg-slate-700 text-white rounded max-w-5xl mx-auto p-4">
                        <Dialog.Title
                            as='h2'
                            className="text-4xl font-medium leading-6"
                        >
                            Setting
                            <button className="absolute top-2 right-2 m-2 w-8 bg-red-700" onClick={() => setIsOpen(false)}><XMarkIcon /></button>
                        </Dialog.Title>
                        <div className='mt-5'>
                            <Tags
                                tagifyRef={tagifyRefDragSort}
                                defaultValue={props.subreddits ? props.subreddits.map(subreddit => {
                                    return subreddit
                                }) : null}
                                onChange={onTagChange}
                            />
                            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => copyList()}>Copy the list</button>
                            <div className='widthField mt-2'>
                                <label>Column Width :</label>
                                <input type="range" className='ml-2 mr-2' min="0" max="100" onChange={(onWidthChange)} value={props.columnWidth} />
                                <output>{props.columnWidth}</output>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            <button id={props.name} className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={() => setIsOpen(true)} >{props.icon}</button>
        </li>
    );
}

export default SidebarSetting;
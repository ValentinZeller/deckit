import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import '@yaireo/tagify/dist/tagify.css'
import Content from './Content'
import { XIcon } from '@heroicons/react/solid'
import Detail from './Detail'

function InboxMessage(props) {
    let [isOpen, setIsOpen] = useState(false)

    return(
        <div className='inbox'>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-20 inset-0 overflow-y-auto">
                <div className="items-center justify-center p-5">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="relative bg-slate-800 text-white rounded max-w-5xl mx-auto p-4">
                        <Dialog.Title 
                                as='div'
                                className="text-lg font-medium pl-2"
                        >
                            {props.context !== "" ? <span className="text-sm"><a href={`https://www.reddit.com${props.context}`}>Link</a> : </span> : null}
                            {props.title}
                            <button className="absolute top-2 right-2 m-2 w-8 bg-red-700" onClick={() => setIsOpen(false)}><XIcon /></button>
                        </Dialog.Title>
                        <div className="items-center bg-slate-700">
                            <div className="">
                                <div className='pl-3 mt-2'>
                                    <Content content={props.content}/>
                                </div>
                                <Detail
                                    author={props.author}
                                    date={props.date}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            <div className='inbox-message' onClick={() => setIsOpen(true)}>
                <div className='inbox-message-header'>
                    <div className='inbox-message-header-title p-2 hover:cursor-pointer hover:bg-slate-500'>
                        {props.title}
                    </div>
                    <Detail
                        author={props.author}
                        date={props.date}
                    />
                </div>
            </div>
        </div>
    );
}

export default InboxMessage;
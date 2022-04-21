import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import '@yaireo/tagify/dist/tagify.css'
import { XIcon, LogoutIcon } from '@heroicons/react/solid';
import { r, aboutMe, logout } from '../API/main';
import { displayDate } from '../utils/date'
import InboxMessage from './InboxMessage';

function SidebarUserInfo(props) {
    let [isOpen, setIsOpen] = useState(false)
    let [user, setUser] = useState(null)
    let [inbox, setInbox] = useState(null)

    useEffect(() => {
        if (r) {
            aboutMe().then(user => {
                setUser(user)
            })
            r.getInbox().then(inbox => {
                setInbox(inbox)
            })
        }
    }, [])

    return(
        <li className='h-12'>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="items-center justify-center p-5">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative bg-slate-800 text-white rounded max-w-5xl mx-auto p-4">
                    <Dialog.Title 
                        as='h2'
                        className="text-4xl font-medium leading-6"
                    >
                        Profile
                        <button className="absolute top-2 right-12 m-2 w-8 bg-slate-600" onClick={logout}><LogoutIcon /></button>
                        <button className="absolute top-2 right-2 m-2 w-8 bg-red-700" onClick={() => setIsOpen(false)}><XIcon /></button>
                    </Dialog.Title>
                    <div className='mt-5 bg-slate-700'>
                    {user ?
                        <div className="flex items-center p-2">
                            <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={user.icon_img} alt="avatar" />
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-medium">
                                    {user.name}
                                </div>
                                <div className="text-sm">
                                    {user.link_karma} link karma
                                </div>
                                <div className="text-sm">
                                    {user.comment_karma} comment karma
                                </div>
                                <div className="text-sm">
                                    Created : {displayDate(user.created_utc,true)}
                                </div>
                            </div>
                        </div>
                    : null }
                    { inbox ?
                        <div className="mt-2">
                            <div className="text-2xl pl-2 bg-slate-800">
                                Inbox
                            </div>
                            {inbox.map((child,index) => {
                                return(
                                    <InboxMessage 
                                        key={index} 
                                        title={child.subject}
                                        content={child}
                                        date={child.created_utc}
                                        author={child.author.name}
                                        context={child.context}
                                    />
                                )
                            })}
                        </div>
                    : null }
                    </div>
                </div>
            </div>
        </Dialog>
        <button id={props.name} className="border rounded-md border-black dark:bg-slate-700 hover:bg-slate-500 w-12" onClick={() => setIsOpen(true)} >{props.icon}</button>
    </li>
    );
}

export default SidebarUserInfo;
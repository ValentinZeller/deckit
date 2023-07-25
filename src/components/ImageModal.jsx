import { useState } from 'react'
import React from 'react';
import { Dialog } from '@headlessui/react'

function ImageModal(props) {
    let [isOpen, setIsOpen] = useState(false)

    return (
        <span className="image-modal-element inline-block">
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-5">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="relative mx-auto">
                        <img src={props.url} alt={props.caption} />
                        <button className="h-0 w-0 overflow-hidden" />
                    </div>
                </div>
            </Dialog>
            <figure>
                <img src={props.url} alt={props.caption} className={`inline-block ${props.gallery ? "gallery-image" : "post-image"}`} onClick={() => setIsOpen(true)} />
                <figcaption className='inline-block text-sm text-center'>
                    {props.caption}
                </figcaption>
            </figure>
        </span>
    );
}

export default ImageModal;
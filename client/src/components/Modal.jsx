import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/24/outline';
import Placeholder from '../assets/profile/placeholder.jpg';

export default function Modal({ open, handleModal, handleUploadProfile, setImage }) {
    const cancelButtonRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Function to handle image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(file);
            setSelectedImage(imageUrl);
        }
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <form onSubmit={handleUploadProfile}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className='mt-5'>
                                            <div className="mx-auto">
                                                <div className="mx-auto px-5">
                                                    <div className='w-[250px] h-[250px] border-2 border-gray-400 rounded-full overflow-hidden mx-auto'>
                                                        <img src={selectedImage ? selectedImage : Placeholder} className='w-full h-full object-cover' alt="Selected" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mx-auto mt-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 ">
                                                <label htmlFor="camera" className='cursor-pointer'>
                                                    <CameraIcon className="h-6 w-6 text-black mx-auto" aria-hidden="true" />
                                                    <input
                                                        type="file"
                                                        id='camera'
                                                        className='hidden'
                                                        accept='image/*'
                                                        onChange={handleImageChange} // Handle image selection
                                                    />
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 lg:flex">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full lg:w-1/2 ms-1 order-2 justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 "
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 lg:mt-0 inline-flex order-1 me-1 w-full lg:w-1/2 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => handleModal()}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    );
}

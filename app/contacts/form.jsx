"use client";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Form_Contact ({ config, data, model, setModel }) {

    return (

        <Transition appear show={model} as={Fragment}>

            <Dialog as="div" open={model} onClose={() => setModel(false)} className="relative z-50">

                <div className="fixed inset-0 overflow-y-auto bg-[black]/60">

                    <div className="flex min-h-full items-center justify-center px-4 py-8 edit-item-info">

                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                           
                            <Dialog.Panel className="relative panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                
                                <button type="button" onClick={() => setModel(false)} className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600">
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>

                                </button>

                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    
                                    {config.text.contact} &nbsp; {data.id}

                                </div>

                                <form className="p-5 mt-2">

                                    <div className='flex justify-between lg:flex-row flex-col'>

                                        <div className='w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6'>
                                            <label htmlFor="name" className='text-[.95rem] tracking-wide'>{config.text.name}</label>
                                            <input id="name" type="text" value={data.name || ''} className="form-input mt-1 cursor-default" readOnly/>
                                        </div>

                                        <div className='w-full mb-6'>
                                            <label htmlFor="phone" className='text-[.95rem] tracking-wide'>{config.text.phone}</label>
                                            <input id="phone" type="text" value={data.phone} className="form-input mt-1 cursor-default" readOnly/>
                                        </div>

                                    </div>

                                    <div className='w-full mb-6'>
                                        <label htmlFor="email" className='text-[.95rem] tracking-wide'>{config.text.email}</label>
                                        <input id="email" type="text" value={data.email || ''} className="form-input mt-1 cursor-default" readOnly/>
                                    </div>

                                    <div className='flex justify-between lg:flex-row flex-col'>

                                        <div className='w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6'>
                                            <label htmlFor="country" className='text-[.95rem] tracking-wide'>{config.text.country}</label>
                                            <input id="country" type="text" value={data.country || ''} className="form-input mt-1 cursor-default" readOnly/>
                                        </div>

                                        <div className='w-full mb-6'>
                                            <label htmlFor="city" className='text-[.95rem] tracking-wide'>{config.text.city}</label>
                                            <input id="city" type="text" value={data.city} className="form-input mt-1 cursor-default" readOnly/>
                                        </div>

                                    </div>

                                    <div className='w-full mb-6'>
                                        <label htmlFor="content" className='text-[.95rem] tracking-wide'>{config.text.message}</label>
                                        <textarea id="content" rows="7" value={data.content} className="form-input mt-1 cursor-default resize-none" readOnly></textarea>
                                    </div>

                                    <div className="mt-5 mb-1 flex items-center justify-end">

                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModel(false)}>
                                            {config.text.close}
                                        </button>

                                    </div>

                                </form>

                            </Dialog.Panel>

                        </Transition.Child>

                    </div>

                </div>

            </Dialog>

        </Transition>

    );

};

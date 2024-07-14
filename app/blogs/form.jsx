"use client";
import { api, date, alert_msg, fix_date, print } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Files from "@/app/component/files";
import Quill from '@/app/component/quill';
import Loader from '@/app/component/loader';

export default function Form_Blog ({ id }) {
   
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [menu, setMenu] = useState('');
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(true);

    const default_item = async() => {

        setData({
            id: 0,
            title: '',
            slug: '',
            country: '',
            city: '',
            location: '',
            company: '',
            phone: '',
            description: '',
            content: '',
            notes: '',
            created_at: date('date'),
            updated_at: date('date'),
            views: 0,
            comments: 0,
            replies: 0,
            likes: 0,
            dislikes: 0,
            allow_comments: true,
            allow_likes: true,
            allow_dislikes: true,
            active: true,
        });

        setLoader(false);

    }
    const get_item = async() => {

        const response = await api(`blog/${id}`);
        if ( !response.blog?.id ) return router.replace('/blogs');
        setData(response.blog);
        setLoader(false);
        document.title = `${config.text.edit_blog} | ${response.blog.title || ''}`;

    }
    const save = async() => {

        let files = {};
        data.new_files?.forEach((file, index) => {
            files[`file_${index}`] = file.file;
            files[`file_${index}_type`] = file.type;
            files[`file_${index}_size`] = file.size;
            files[`file_${index}_name`] = file.name;
            files[`file_${index}_ext`] = file.ext;
        });
        let request_data = {
            ...data,
            ...files,
            files_length: data.new_files?.length || 0,
            deleted_files: JSON.stringify(data.deleted_files),
        };
        const response = await api(`blog/${id ? `${id}/update` : 'store'}`, request_data);
        return response;

    }
    const save_item = async() => {
        
        if ( !data.title ) return alert_msg(config.text.title_required, 'error');
        setLoader(true);
        const response = await save();

        if ( response.status === true ) {
            if ( id ) alert_msg(`${config.text.item} ( ${id} ) - ${config.text.updated_successfully}`);
            else alert_msg(config.text.new_item_added);
            return router.replace('/blogs')
        }
        else {
            alert_msg(config.text.alert_error, 'error');
            setLoader(false);
        }

    }
    const delete_item = async() => {

        if ( !confirm(config.text.ask_delete_item) ) return;

        setLoader(true);
        const response = await api(`blog/${id}/delete`);

        if ( response.status ) {
            alert_msg(`${config.text.item} ( ${id} ) ${config.text.deleted_successfully}`);
            return router.replace('/blogs');
        }
        else {
            alert_msg(config.text.alert_error, 'error');
            setLoader(false);
        }

    }
    const close_item = async() => {
        
        return router.replace('/blogs');

    }
    useEffect(() => {

        document.title = id ? config.text.edit_blog : config.text.add_blog;
        setMenu(localStorage.getItem('menu'));
        id ? get_item() : default_item();

    }, []);

    return (

        <div className='edit-item-info relative'>
            {
                loader ? <Loader bg/> :
                <div className="flex xl:flex-row flex-col gap-2.5">

                    <div className="flex flex-col flex-1 xl:w-[70%]">

                        <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6 no-select">

                            <Files data={data} setData={setData} multiple blog/>

                            <hr className="border-[#e0e6ed] dark:border-[#1b2e4b]"/>

                            <div className="mt-4 px-4">

                                <div className="flex justify-between lg:flex-row flex-col">

                                    <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-4 div-2">

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="title" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.title}</label>
                                            <input id="title" type="text" value={data.title || ''} onChange={(e) => setData({...data, title: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="city" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.city}</label>
                                            <input id="city" type="text" value={data.city || ''} onChange={(e) => setData({...data, city: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="company" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.company}</label>
                                            <input id="company" type="text" value={data.company || ''} onChange={(e) => setData({...data, company: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="created_at" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.create_date}</label>
                                            <input id="created_at" type="text" value={fix_date(data.created_at)} readOnly className="form-input flex-1 default"/>
                                        </div>

                                    </div>

                                    <div className="lg:w-1/2 w-full div-3">

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">{config.text.country}</label>
                                            <input id="country" type="text" value={data.country || ''} onChange={(e) => setData({...data, country: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="location" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">{config.text.location}</label>
                                            <input id="location" type="text" value={data.location || ''} onChange={(e) => setData({...data, location: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="phone" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">{config.text.phone}</label>
                                            <input id="phone" type="text" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="updated_at" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">{config.text.update_date}</label>
                                            <input id="updated_at" type="text" value={fix_date(data.updated_at)} readOnly className="form-input flex-1 default"/>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-6 mb-6"/>

                            <div className="mt-6 mb-4 px-4">
                                
                                <label className="mb-4">{config.text.description}</label>
                                
                                <textarea id="description" value={data.description || ''} onChange={(e) => setData({...data, description: e.target.value})} className="form-textarea min-h-[80px] no-resize" rows="5"></textarea>

                            </div>

                            <div className="mt-6 px-4">
                                
                                <label className="mb-4">{config.text.content}</label>
                                
                                <div className="editor">

                                    <Quill value={data.content || ''} className='ql-editor-small' onChange={(e) => setData({...data, content: e})}/>

                                </div>

                            </div>

                            <div className="mt-8 px-4">
                                
                                <label className="mb-4">{config.text.notes}</label>
                                
                                <textarea id="notes" value={data.notes || ''} onChange={(e) => setData({...data, notes: e.target.value})} className="form-textarea min-h-[80px] no-resize" rows="5"></textarea>

                            </div>

                        </div>

                    </div>

                    <div className={`xl:w-[30%] w-full xl:mt-0 mt-6 left-tab no-select ${menu === 'vertical' ? '' : 'space'}`}>

                        <div>

                            <div className="panel mb-5 pb-2">

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-1">

                                    <div>

                                        <label htmlFor="views" className="mb-3">{config.text.views}</label>

                                        <input id="views" type="number" value={data.views || 0} min="0" className="form-input default" readOnly/>

                                    </div>
                                
                                    <div>

                                        <label htmlFor="comments" className="mb-3">{config.text.comments}</label>

                                        <input id="comments" type="number" value={data.comments || 0} min="0" className="form-input default" readOnly/>

                                    </div>

                                </div>

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-6">

                                    <div>

                                        <label htmlFor="likes" className="mb-3">{config.text.likes}</label>

                                        <input id="likes" type="number" value={data.likes || 0} min="0" className="form-input default" readOnly/>

                                    </div>

                                    <div>

                                        <label htmlFor="dislikes" className="mb-3">{config.text.dislikes}</label>

                                        <input id="dislikes" type="number" value={data.dislikes || 0} min="0" className="form-input default" readOnly/>

                                    </div>

                                </div>

                                <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-6 mb-6"/>

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-2 mt-6">

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, allow_likes: !data.allow_likes})} checked={data.allow_likes || false} id="allow_likes" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="allow_likes" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.likes}</label>

                                    </div>

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, allow_dislikes: !data.allow_dislikes})} checked={data.allow_dislikes || false} id="allow_dislikes" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="allow_dislikes" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.dislikes}</label>

                                    </div>

                                </div>

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-2 mt-6">

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, allow_comments: !data.allow_comments})} checked={data.allow_comments || false} id="allow_comments" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="allow_comments" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.comments}</label>

                                    </div>

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, active: !data.active})} checked={data.active || false} id="active" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="active" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.active}</label>

                                    </div>

                                </div>

                            </div>

                            <div className="panel">

                                <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">

                                    <button type="button" className="pointer btn btn-success w-full gap-2" onClick={save_item}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                            <path d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22" stroke="currentColor" strokeWidth="1.5" />
                                            <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span>{config.text.save}</span>
                                    </button>
                                    <button type="button" className="pointer btn btn-warning w-full gap-2" onClick={close_item}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                            <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                                            <path opacity="0.5" d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>
                                        <span>{config.text.cancel}</span>
                                    </button>
                                    {
                                        id ?
                                        <button type="button" className="pointer btn btn-danger w-full gap-2" onClick={delete_item}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                                <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                            <span>{config.text.delete}</span>
                                        </button> : ''
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            }
        </div>

    );

};

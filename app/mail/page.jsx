"use client";
import { api, date, file_info, matching, alert_msg, print } from '@/public/script/public';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from "@/app/component/loader";
import Dropdown from '@/app/component/menu';
import Select from '@/app/component/select';
import Quill from '@/app/component/quill';

export default function Mail () {

    const config = useSelector((state) => state.config);
    const fileInput = useRef(null);
    const [tab, setTab] = useState(0);
    const [type, setType] = useState('inbox');
    const [inbox, setInbox] = useState([]);
    const [send, setSend] = useState([]);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState({});
    const [files, setFiles] = useState([]);
    const [mail, setMail] = useState({});
    const [search, setSearch] = useState('');
    const [ids, setIds] = useState([]);
    const [loader, setLoader] = useState(false);
    const [model, setModel] = useState(false);
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState({});

    const [pager, setPager] = useState({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });
    const sort_mails = ( items ) => {

        let importants_stars = items.filter(_ => _.important && _.star);
        let importants = items.filter(_ => _.important && !_.star);
        let stars = items.filter(_ => _.star && !_.important);
        let normals = items.filter(_ => !_.star && !_.important);
        let final = [...importants_stars, ...importants, ...stars, ...normals];
        return final;

    }
    const get_data = async() => {

        const response = await api('mail'); 

        let me = {
            id: config.user.id,
            email: config.user.email,
            image: config.user.image,
            name: `Me`,
            created_at: config.user.created_at,
            role: config.user.role,
            super: config.user.super,
            supervisor: config.user.supervisor,
        }

        setUsers([me, ...response.users || []])
        setInbox(sort_mails(response.inbox || []));
        setSend(sort_mails(response.send || []));

    }
    const searchMails = ( current, reset=true ) => {

        let _data_ = type === 'send' ? send : inbox;

        _data_ = _data_.filter((item) => 
            matching(`--${item.id}`, search) ||
            matching(item.title, search) ||
            matching(item.description, search) ||
            matching(item.content, search) ||
            matching(item.created_at, search) ||
            matching(date_time(item.created_at), search) ||
            matching(item.star ? 'star' : '', search) ||
            matching(item.important ? 'important' : '', search) ||
            matching(item.user?.name, search) ||
            matching(item.user?.email, search) ||
            matching(item.receiver?.name, search) ||
            matching(item.receiver?.email, search) ||
            matching(item.user?.online ? 'online' : 'offline', search)
        )

        let totalPages = Math.ceil(_data_.length / pager.pageSize);
        let currentPage = current || 1
        let startIndex = (currentPage - 1) * pager.pageSize;
        if ( reset ) { currentPage = 1; startIndex = 0; }
        let endIndex = Math.min(startIndex + pager.pageSize - 1, _data_.length - 1);

        setPager({...pager, currentPage: currentPage, totalPages: totalPages, startIndex: startIndex, endIndex: endIndex});
        setData(sort_mails(_data_.slice(startIndex, endIndex + 1)));
        setIds([]);

    };
    const date_time = ( date ) => {

        const displayDt = new Date(date);
        const currentDt = new Date();
        let final_date = ''

        if (displayDt.toDateString() === currentDt.toDateString()) {

            let hr = parseInt(date.split(' ')[1].split(':')[0]);
            let min = parseInt(date.split(' ')[1].split(':')[1]);
            let p = 'PM';
            if ( hr < 12 ) p = 'AM';
            if ( hr === 0 ) { hr = 12; }
        
            final_date = `${hr < 10 ? `0${hr}` : hr}:${min < 10 ? `0${min}` : min} ${p}`;

        }
        else if ( displayDt.getFullYear() === currentDt.getFullYear() ) {

            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            final_date = `${String(displayDt.getDate()).padStart(2, '0')} ${monthNames[displayDt.getMonth()]}`;

        }
        else {

            final_date = `${displayDt.getFullYear()}-${String(displayDt.getMonth() + 1).padStart(2, '0')}-${String(displayDt.getDate()).padStart(2, '0')}`;

        }

        return final_date;

    };
    const handle_file = ( e ) => {

        if ( !e.target.files.length ) return;

        Array.from(e.target.files).forEach((f) => {

            var fr = new FileReader();
            fr.readAsDataURL(f);

            fr.onload = () => {
               
                let name = file_info(f, 'name');
                let size = file_info(f, 'size');
                let type = file_info(f, 'type');
                let ext = file_info(f, 'ext');

                let _files_ = files || [];
                _files_.push({link: fr.result, file: f, name: name, type: type, size: size, ext: ext});
                setFiles(_files_);
                setMail({...mail, files: {}});
                setTimeout(_ => document.querySelector('.send-msg-form')?.scrollBy(0, 1000), 100);

            }

        });

        fileInput.current.value = '';

    }
    const handle_checkbox = (id, all) => {

        if ( ids.includes(id) ) setIds(ids.filter(_ => _ !== id));
        else setIds([...ids, id]);

        if ( all ) {
            if ( data.filter(_ => ids.includes(_.id)).length === data.length ) setIds([]);
            else setIds([...data.map(_ => _.id)]);
        }

    };
    const send_mail = async() => {

        if ( !mail.receiver?.id ) return alert_msg('Please select user to send a message !', 'error');
        
        let id = date();
        let sent_mail = {
            id: id,
            created_at: date(),
            sender: 'me',
            important: false,
            star: false,
            readen: false,
            content: mail.content,
            title: mail.title,
            description: mail.description,
            files: files,
            user: mail.receiver,
        }
        let send_mails = send;
        send_mails.unshift(sent_mail);
        setSend(sort_mails(send_mails));
        setData(sort_mails(send_mails));
        setType('send');
        setTab(0);
        setMail({});
        setFiles([]);
        alert_msg('Mail has been sent successfully !');

        let list_files = {};
        files.forEach((file, index) => {
            list_files[`file_${index}`] = file.file;
            list_files[`file_${index}_type`] = file.type;
            list_files[`file_${index}_size`] = file.size;
            list_files[`file_${index}_name`] = file.name;
            list_files[`file_${index}_ext`] = file.ext;
        });
        let request_data = {
            ...mail,
            ...list_files,
            files_length: files?.length,
            user_id: mail.receiver.id
        }
        const response = await api('mail/send', request_data);

        if ( response.mail?.id ) {
            let mails = send.map(_ => { _.id === id ? _ = {..._, id: response.mail.id, files: response.mail.files} : ''; return _; });
            setSend(sort_mails(mails));
            setData(sort_mails(mails));
            // socket?.send(JSON.stringify(response.mail));
        }

    }
    const actions = async( action, id ) => {

        if ( action === 'refresh' ) {
            
            setLoader(true);
            get_data();
            setLoader(false);

        }
        if ( action === 'delete' ) {
            
            if ( !ids.length ) return;
            if ( !confirm(`Are you sure to remove ${ids.length} mails ?`) ) return;

            let _data_ = type === 'send' ? send : inbox;
            _data_ = _data_.filter(_ => !ids.includes(_.id));
            type === 'send' ? setSend(_data_) : setInbox(_data_);

            alert_msg(` ( ${ids.length} ) Mails has been removed successfully !`);
            const response = await api('mail/delete', {ids: JSON.stringify(ids)});

        }
        if ( action === 'readen' ) {
            
            if ( !ids.length ) return;
            let _data_ = type === 'send' ? send : inbox;
            _data_ = _data_.map(_ => { ids.includes(_.id) ? _.readen = true : ''; return _ });
            type === 'send' ? setSend(_data_) : setInbox(_data_);

            alert_msg(` ( ${ids.length} ) Mails marked as readen successfully !`);
            const response = await api('mail/active', {ids: JSON.stringify(ids)});

        }
        if ( action === 'unread' ) {
            
            if ( !ids.length ) return;
            let _data_ = type === 'send' ? send : inbox;
            _data_ = _data_.map(_ => { ids.includes(_.id) ? _.readen = false : ''; return _ });
            type === 'send' ? setSend(_data_) : setInbox(_data_);

            alert_msg(` ( ${ids.length} ) Mails marked as unread successfully !`);
            const response = await api('mail/unactive', {ids: JSON.stringify(ids)});

        }
        if ( action === 'star' ) {
            
            let item = data.find(_ => _.id === id);
            item.star = !item.star;
            searchMails();
            const response = await api('mail/star', {ids: JSON.stringify([item.id])});

        }
        if ( action === 'important' ) {
            
            let item = data.find(_ => _.id === id);
            item.important = !item.important;
            searchMails();
            const response = await api('mail/important', {ids: JSON.stringify([item.id])});

        }
        if ( action === 'open' ) {
            
            let item = data.find(_ => _.id === id);
            setSelected(item);
            setTab(2);
            if ( item.readen || item.sender === 'me' ) return;
            item.readen = true;
            const response = await api('mail/active', {ids: JSON.stringify([item.id])});

        }

    }
    const on_message = ( mail ) => {

        setInbox(sort_mails([mail, ...inbox]));

    }
    useEffect(() => {

        searchMails();

    }, [selected, type, search, send, inbox]);
    useEffect(() => {

        document.title = "Mail box";
        get_data();
        // setSocket(new WebSocket(`ws://${host}/mail/${config.user.token}`));
        // socket.onmessage = (e) => on_message(JSON.parse(e.data));
        
    }, []);

    return (

        <div className="mailbox relative flex h-full gap-5 overflow-hidden">

            <div className="panel p-0 flex-1 h-full overflow-visible">

                {
                    tab === 1 ?
                    <div className="no-select h-full">

                        <div className="flex items-center py-4 px-6">

                            <button type="button" onClick={() => { setMail({}); setFiles([]); setTab(0) }} className="ltr:mr-4 rtl:ml-4 hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>

                            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">{config.text.message}</h4>

                        </div>

                        <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                        <div className="relative p-6 send-msg-form scroll-smooth overflow-auto">

                            <div className="flex justify-between items-center">

                                <input type="text" value={mail.receiver?.name || ''} onClick={() => setModel(true)} className="form-select flex-1 pointer" placeholder={config.text.select_user} readOnly/>

                                <input type="text" value={mail.title || ''} onChange={(e) => setMail({...mail, title: e.target.value})} className="form-input" placeholder="Title ..."/>

                            </div>

                            <div className="edit-item-info mt-6">

                                <Quill value={mail.content || ''} className='ql-editor-medium' onChange={(content, delta, source, editor) => setMail({...mail, content: content, description: editor.getText()})}/>

                            </div>
                            
                            <div className="flex items-center flex-wrap mt-10">

                                {
                                    files.map((file, index) =>
                                        <a key={index} href={file.link} download target='_blank' className="flex items-center ltr:mr-4 rtl:ml-4 mb-4 border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-md hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2.5 relative group">
                                            {
                                                file.type === 'image' ?
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                    <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                    <circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <path opacity="0.5" d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                : file.type === 'video' ?
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                    <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                    <circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <path opacity="0.5" d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>:
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                    <path d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z" fill="currentColor" />
                                                    <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            }
                                            <div className="ltr:ml-3 rtl:mr-3">
                                                <p className="text-xs text-primary font-semibold">{file.name || ''}</p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-600 text-left">{file.size || ''}</p>
                                            </div>
                                            <div className="bg-dark-light/40 z-[5] w-full h-full absolute ltr:left-0 rtl:right-0 top-0 rounded-md hidden group-hover:block"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 btn btn-primary hidden group-hover:block z-10">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                    <path opacity="0.5" d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </a>
                                    )
                                }

                                <button type="button" className="btn btn-primary" onClick={() => fileInput.current?.click()}>{config.text.select_file}</button>

                                <input type="file" ref={fileInput} onChange={handle_file} className="hidden" multiple/>

                            </div>

                            <div className="flex justify-end items-center ltr:ml-auto rtl:mr-auto mt-7 buttons">
                                <button type="button" onClick={() => { setMail({}); setFiles([]); setTab(0) }} className="btn btn-outline-danger ltr:mr-3 rtl:ml-3">{config.text.cancel}</button>
                                <button type="button" onClick={send_mail} className="btn btn-success send-btn">{config.text.send_mail}</button>
                            </div>

                            { loader && <Loader /> }

                            <Select model={model} setModel={setModel} data={users} onChange={(id) => setMail({...mail, receiver: users.find(_ => _.id === id)})}/>

                        </div>

                    </div>
                    : tab === 2 ?
                    <div className='relative selected-mail h-full'>

                        <div className="flex items-center justify-between p-4">

                            <div className="flex items-center max-w-[80%]">

                                <button type="button" onClick={() => setTab(0)} className="ltr:mr-4 rtl:ml-4 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </button>

                                <h4 className="text-base md:text-lg font-medium ltr:mr-2 rtl:ml-2 mail-title truncate mt-[-2px] default">
                                    {selected.title}
                                </h4>
                            
                                {
                                    selected.sender === 'me' ?
                                    <div className="badge bg-success hover:top-0 no-select mx-2">{config.text.send}</div> :
                                    <div className="badge bg-danger hover:top-0 no-select mx-2">{config.text.inbox}</div>
                                }

                            </div>

                        </div>

                        <div className="h-px border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>

                        <div className="p-4 relative overflow-auto mails-content">

                            <div className=" pt-2 flex flex-wrap default">

                                <div className="flex-shrink-0 layer-div ltr:mr-2 rtl:ml-2">

                                    <img 
                                        src={`${host}/${selected.user?.image}`} 
                                        onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                        onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                        className="h-12 w-12 rounded-full object-cover -mt-[2px]"
                                    />

                                </div>

                                <div className="px-2 flex-1">

                                    <div className="flex items-center -mt-[4px]">

                                        <div className="text-lg ltr:mr-4 rtl:ml-4 whitespace-nowrap">{selected.user?.id === config.user.id ? config.text.me : selected.user?.name || ''}</div>

                                        <div className="ltr:mr-4 rtl:ml-4">
                                            <div className="w-2 h-2 bg-success rounded-full"></div>
                                        </div>

                                        <div className="text-white-dark whitespace-nowrap">{date_time(selected.created_at)}</div>

                                    </div>

                                    <div className="text-white-dark flex items-center mt-[2px]">

                                        <div className="ltr:mr-1 rtl:ml-1">{selected.user?.email || ''}</div>

                                        <div className="dropdown">

                                            <Dropdown offset={[0, 5]} placement={`${config.dir === 'ltr' ? 'bottom-start' : 'bottom-end'}`} btnClassName="mt-[-1px] mx-[.3rem]"
                                                button={
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }>

                                                <ul className="sm:w-56" style={{ minWidth: '300px' }}>
                                                    <li>
                                                        <div className="flex items-start px-4 py-2">
                                                            <div className="text-white-dark ltr:mr-2 rtl:ml-2 w-1/6">{config.text.from}</div> :
                                                            <div className="flex-1 px-2">{selected.sender === 'me' ? config.text.me : selected.user?.email || ''}</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-start px-4 py-2">
                                                            <div className="text-white-dark ltr:mr-2 rtl:ml-2 w-1/6">{config.text.to}</div> :
                                                            <div className="flex-1 px-2">{selected.user?.id === config.user?.id || selected.sender !== 'me' ? config.text.me : selected.user?.email || ''}</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-start px-4 py-2">
                                                            <div className="text-white-dark ltr:mr-2 rtl:ml-2 w-1/6">{config.text.date}</div> :
                                                            <div className="flex-1 px-2">{selected.created_at.split(' ')[0]}</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-start px-4 py-2">
                                                            <div className="text-white-dark ltr:mr-2 rtl:ml-2 w-1/6">{config.text.title}</div> :
                                                            <div className="flex-1 px-2">{selected.title}</div>
                                                        </div>
                                                    </li>
                                                </ul>

                                            </Dropdown>

                                        </div>

                                    </div>

                                </div>

                                <div className="flex items-start mt-2 justify-between space-x-3 rtl:space-x-reverse w-[3.5rem]">

                                    <button type="button" onClick={(e) => { e.stopPropagation(); actions('star', selected.id); }} className={`enabled:hover:text-warning disabled:opacity-60 ${selected.star ? 'text-warning' : ''}`}>
                                        <svg className={selected.star ? 'fill-warning' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke="currentColor" strokeWidth="1.5" d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"/>
                                        </svg>
                                    </button>

                                    <button type="button" onClick={(e) => { e.stopPropagation(); actions('important', selected.id); }} className={`mt-[1px] enabled:hover:text-primary disabled:opacity-60 ${selected.important ? 'text-primary' : ''}`}>
                                        <svg className={`rotate-90 ${selected.important ? 'fill-primary' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke="currentColor" strokeWidth="1.5" d="M21 16.0909V11.0975C21 6.80891 21 4.6646 19.682 3.3323C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.3323C3 4.6646 3 6.80891 3 11.0975V16.0909C3 19.1875 3 20.7358 3.73411 21.4123C4.08421 21.735 4.52615 21.9377 4.99692 21.9915C5.98402 22.1045 7.13673 21.0849 9.44216 19.0458C10.4612 18.1445 10.9708 17.6938 11.5603 17.5751C11.8506 17.5166 12.1494 17.5166 12.4397 17.5751C13.0292 17.6938 13.5388 18.1445 14.5578 19.0458C16.8633 21.0849 18.016 22.1045 19.0031 21.9915C19.4739 21.9377 19.9158 21.735 20.2659 21.4123C21 20.7358 21 19.1875 21 16.0909Z"/>
                                        </svg>
                                    </button>

                                </div>

                            </div>

                            <div dangerouslySetInnerHTML={{ __html: selected.content }} className="mt-8 prose dark:prose-p:text-white prose-p:text-sm md:prose-p:text-sm max-w-full prose-img:inline-block prose-img:m-0 mail-description default"></div>
                            
                            {
                                selected.files?.length > 0 &&
                                <div className="mt-8 mail-attachments no-select">
                                    
                                    <div className="h-px border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>
                                    <div className="text-base mt-5">{config.text.attachements}</div>
                                    <div className="flex items-center flex-wrap mt-4">
                                        {
                                            selected.files.map((file, index) => 
                                                <a key={index} href={`${host}/M${file.id}`} download target='_blank' className="pointer flex items-center ltr:mr-4 rtl:ml-4 mb-4 border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-md hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2.5 relative group">
                                                    {
                                                        file.type === 'image' ?
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                            <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <path opacity="0.5" d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                        : file.type === 'video' ?
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                            <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <path opacity="0.5" d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>:
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                            <path d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z" fill="currentColor" />
                                                            <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    }
                                                    <div className="ltr:ml-3 rtl:mr-3">
                                                        <p className="text-xs text-primary font-semibold">{file.name || ''}</p>
                                                        <p className="text-[11px] text-gray-400 dark:text-gray-600 text-left">{file.size || ''}</p>
                                                    </div>
                                                    <div className="bg-dark-light/40 z-[5] w-full h-full absolute ltr:left-0 rtl:right-0 top-0 rounded-md hidden group-hover:block"></div>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 btn btn-primary hidden group-hover:block z-10">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                            <path opacity="0.5" d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </a>
                                            )
                                        }
                                    </div>

                                </div>
                            }

                        </div>

                    </div>:
                    <div className="flex flex-col h-full realtive">

                        <div className="flex justify-between items-center flex-wrap gap-4 p-4 no-select">

                            <div className="flex items-center w-full sm:w-auto">

                                <div className="ltr:mr-4 rtl:ml-4 flex items-center mail-tabs">

                                    <button type="button" onClick={() => setTab(1)} className="set-text btn text-white btn-outline-primary bg-primary w-full ltr:sm:mr-4 rtl:sm:ml-4">
                                        {config.text.new_message}
                                    </button>

                                    <div className="flex grow items-center sm:flex-none gap-4 ltr:sm:mr-4 rtl:sm:ml-4">

                                        <button type="button" onClick={() => { setSearch(''); setType('inbox'); }} className={`set-text no-shadow btn  flex ${type === 'inbox' ? 'btn-danger' : 'btn-outline-danger'}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden h-5 w-5 ltr:mr-2 rtl:ml-2">
                                                <path opacity="0.5" d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                            {config.text.inbox}
                                        </button>

                                        <button type="button" onClick={() => { setSearch(''); setType('send'); }} className={`set-text no-shadow btn flex ${type === 'send' ? 'btn-success' : 'btn-outline-success'}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden h-4 w-4 ltr:mr-2 rtl:ml-2">
                                                <path d="M17.4975 18.4851L20.6281 9.09373C21.8764 5.34874 22.5006 3.47624 21.5122 2.48782C20.5237 1.49939 18.6511 2.12356 14.906 3.37189L5.57477 6.48218C3.49295 7.1761 2.45203 7.52305 2.13608 8.28637C2.06182 8.46577 2.01692 8.65596 2.00311 8.84963C1.94433 9.67365 2.72018 10.4495 4.27188 12.0011L4.55451 12.2837C4.80921 12.5384 4.93655 12.6658 5.03282 12.8075C5.22269 13.0871 5.33046 13.4143 5.34393 13.7519C5.35076 13.9232 5.32403 14.1013 5.27057 14.4574C5.07488 15.7612 4.97703 16.4131 5.0923 16.9147C5.32205 17.9146 6.09599 18.6995 7.09257 18.9433C7.59255 19.0656 8.24576 18.977 9.5522 18.7997L9.62363 18.79C9.99191 18.74 10.1761 18.715 10.3529 18.7257C10.6738 18.745 10.9838 18.8496 11.251 19.0285C11.3981 19.1271 11.5295 19.2585 11.7923 19.5213L12.0436 19.7725C13.5539 21.2828 14.309 22.0379 15.1101 21.9985C15.3309 21.9877 15.5479 21.9365 15.7503 21.8474C16.4844 21.5244 16.8221 20.5113 17.4975 18.4851Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path opacity="0.5" d="M6 18L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                            {config.text.send}
                                        </button>

                                    </div>

                                </div>

                            </div>

                            <div className="flex justify-between items-center sm:w-auto w-full">

                                <div className="flex items-center mail-search">

                                    <div className="relative group mail-search">

                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={config.text.search} className="form-input peer"/>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="h-px border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>

                        <div className="flex flex-col md:flex-row xl:w-auto justify-between items-center px-4 pb-4 mail-actions no-select">

                            <div className="mt-4 flex items-center flex-1">

                                <input type="checkbox" checked={data.filter(_ => ids.includes(_.id)).length === data.length && data.length} onChange={() => handle_checkbox(0, true)} className="form-checkbox"/>

                                <div className="flex items-center mx-[1.5rem]">

                                    <ul className="flex grow items-center sm:flex-none gap-4 ltr:sm:mr-4 rtl:sm:ml-4">

                                        <li onClick={() => actions('refresh')}>
                                            <button type="button" className="hover:text-primary flex items-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path d="M12.0789 3V2.25V3ZM3.67981 11.3333H2.92981H3.67981ZM3.67981 13L3.15157 13.5324C3.44398 13.8225 3.91565 13.8225 4.20805 13.5324L3.67981 13ZM5.88787 11.8657C6.18191 11.574 6.18377 11.0991 5.89203 10.8051C5.60029 10.511 5.12542 10.5092 4.83138 10.8009L5.88787 11.8657ZM2.52824 10.8009C2.2342 10.5092 1.75933 10.511 1.46759 10.8051C1.17585 11.0991 1.17772 11.574 1.47176 11.8657L2.52824 10.8009ZM18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0001 7.42199 20.1103 6.96007 19.8934 6.60721L18.6156 7.39279ZM12.0789 2.25C7.03155 2.25 2.92981 6.3112 2.92981 11.3333H4.42981C4.42981 7.15072 7.84884 3.75 12.0789 3.75V2.25ZM2.92981 11.3333L2.92981 13H4.42981L4.42981 11.3333H2.92981ZM4.20805 13.5324L5.88787 11.8657L4.83138 10.8009L3.15157 12.4676L4.20805 13.5324ZM4.20805 12.4676L2.52824 10.8009L1.47176 11.8657L3.15157 13.5324L4.20805 12.4676ZM19.8934 6.60721C18.287 3.99427 15.3873 2.25 12.0789 2.25V3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279L19.8934 6.60721Z" fill="currentColor"></path>
                                                    <path opacity="0.5" d="M11.8825 21V21.75V21ZM20.3137 12.6667H21.0637H20.3137ZM20.3137 11L20.8409 10.4666C20.5487 10.1778 20.0786 10.1778 19.7864 10.4666L20.3137 11ZM18.1002 12.1333C17.8056 12.4244 17.8028 12.8993 18.094 13.1939C18.3852 13.4885 18.86 13.4913 19.1546 13.2001L18.1002 12.1333ZM21.4727 13.2001C21.7673 13.4913 22.2421 13.4885 22.5333 13.1939C22.8245 12.8993 22.8217 12.4244 22.5271 12.1332L21.4727 13.2001ZM5.31769 16.6061C5.10016 16.2536 4.63806 16.1442 4.28557 16.3618C3.93307 16.5793 3.82366 17.0414 4.0412 17.3939L5.31769 16.6061ZM11.8825 21.75C16.9448 21.75 21.0637 17.6915 21.0637 12.6667H19.5637C19.5637 16.8466 16.133 20.25 11.8825 20.25V21.75ZM21.0637 12.6667V11H19.5637V12.6667H21.0637ZM19.7864 10.4666L18.1002 12.1333L19.1546 13.2001L20.8409 11.5334L19.7864 10.4666ZM19.7864 11.5334L21.4727 13.2001L22.5271 12.1332L20.8409 10.4666L19.7864 11.5334ZM4.0412 17.3939C5.65381 20.007 8.56379 21.75 11.8825 21.75V20.25C9.09999 20.25 6.6656 18.7903 5.31769 16.6061L4.0412 17.3939Z" fill="currentColor"></path>
                                                </svg>
                                            </button>
                                        </li>
                                        <li onClick={() => actions('delete')}>
                                            <button type="button" className="hover:text-primary flex items-center mt-[-1.5px]">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                    <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                </svg>
                                            </button>
                                        </li>
                                        <li>
                                            <div className="dropdown">

                                                <Dropdown offset={[0, 5]} placement={`${config.dir === 'rtl' ? 'bottom-end' : 'bottom-start'}`} btnClassName="hover:text-primary flex items-center"
                                                    button={
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-90 opacity-70">
                                                            <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    }>

                                                    <ul className="ltr:-right-0 rtl:-left-0 whitespace-nowrap">
                                                        <li onClick={() => actions('readen')}>
                                                            <button type="button" className="w-full">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0">
                                                                    <path d="M20.082 3.01787L20.1081 3.76741L20.082 3.01787ZM16.5 3.48757L16.2849 2.76907V2.76907L16.5 3.48757ZM13.6738 4.80287L13.2982 4.15375L13.2982 4.15375L13.6738 4.80287ZM3.9824 3.07501L3.93639 3.8236L3.9824 3.07501ZM7 3.48757L7.19136 2.76239V2.76239L7 3.48757ZM10.2823 4.87558L9.93167 5.5386L10.2823 4.87558ZM13.6276 20.0694L13.9804 20.7312L13.6276 20.0694ZM17 18.6335L16.8086 17.9083H16.8086L17 18.6335ZM19.9851 18.2229L20.032 18.9715L19.9851 18.2229ZM10.3724 20.0694L10.0196 20.7312H10.0196L10.3724 20.0694ZM7 18.6335L7.19136 17.9083H7.19136L7 18.6335ZM4.01486 18.2229L3.96804 18.9715H3.96804L4.01486 18.2229ZM2.75 16.1437V4.99792H1.25V16.1437H2.75ZM22.75 16.1437V4.93332H21.25V16.1437H22.75ZM20.0559 2.26832C18.9175 2.30798 17.4296 2.42639 16.2849 2.76907L16.7151 4.20606C17.6643 3.92191 18.9892 3.80639 20.1081 3.76741L20.0559 2.26832ZM16.2849 2.76907C15.2899 3.06696 14.1706 3.6488 13.2982 4.15375L14.0495 5.452C14.9 4.95981 15.8949 4.45161 16.7151 4.20606L16.2849 2.76907ZM3.93639 3.8236C4.90238 3.88297 5.99643 3.99842 6.80864 4.21274L7.19136 2.76239C6.23055 2.50885 5.01517 2.38707 4.02841 2.32642L3.93639 3.8236ZM6.80864 4.21274C7.77076 4.46663 8.95486 5.02208 9.93167 5.5386L10.6328 4.21257C9.63736 3.68618 8.32766 3.06224 7.19136 2.76239L6.80864 4.21274ZM13.9804 20.7312C14.9714 20.2029 16.1988 19.6206 17.1914 19.3587L16.8086 17.9083C15.6383 18.2171 14.2827 18.8702 13.2748 19.4075L13.9804 20.7312ZM17.1914 19.3587C17.9943 19.1468 19.0732 19.0314 20.032 18.9715L19.9383 17.4744C18.9582 17.5357 17.7591 17.6575 16.8086 17.9083L17.1914 19.3587ZM10.7252 19.4075C9.71727 18.8702 8.3617 18.2171 7.19136 17.9083L6.80864 19.3587C7.8012 19.6206 9.0286 20.2029 10.0196 20.7312L10.7252 19.4075ZM7.19136 17.9083C6.24092 17.6575 5.04176 17.5357 4.06168 17.4744L3.96804 18.9715C4.9268 19.0314 6.00566 19.1468 6.80864 19.3587L7.19136 17.9083ZM21.25 16.1437C21.25 16.8295 20.6817 17.4279 19.9383 17.4744L20.032 18.9715C21.5062 18.8793 22.75 17.6799 22.75 16.1437H21.25ZM22.75 4.93332C22.75 3.47001 21.5847 2.21507 20.0559 2.26832L20.1081 3.76741C20.7229 3.746 21.25 4.25173 21.25 4.93332H22.75ZM1.25 16.1437C1.25 17.6799 2.49378 18.8793 3.96804 18.9715L4.06168 17.4744C3.31831 17.4279 2.75 16.8295 2.75 16.1437H1.25ZM13.2748 19.4075C12.4825 19.8299 11.5175 19.8299 10.7252 19.4075L10.0196 20.7312C11.2529 21.3886 12.7471 21.3886 13.9804 20.7312L13.2748 19.4075ZM13.2982 4.15375C12.4801 4.62721 11.4617 4.65083 10.6328 4.21257L9.93167 5.5386C11.2239 6.22189 12.791 6.18037 14.0495 5.452L13.2982 4.15375ZM2.75 4.99792C2.75 4.30074 3.30243 3.78463 3.93639 3.8236L4.02841 2.32642C2.47017 2.23065 1.25 3.49877 1.25 4.99792H2.75Z" fill="currentColor" />
                                                                    <path opacity="0.5" d="M12 5.854V20.9999" stroke="currentColor" strokeWidth="1.5" />
                                                                    <path opacity="0.5" d="M5 9L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M19 9L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M5 13L9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M19 13L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                                {config.text.mark_as_read}
                                                            </button>
                                                        </li>
                                                        <li onClick={() => actions('unread')}>
                                                            <button type="button" className="w-full">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0">
                                                                    <path d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z" stroke="currentColor" strokeWidth="1.5" />
                                                                    <path opacity="0.5" d="M6.12132 16.1022L5.92721 15.3778L6.12132 16.1022ZM3.27556 18.0294C3.16835 18.4295 3.40579 18.8408 3.80589 18.948C4.20599 19.0552 4.61724 18.8178 4.72444 18.4177L3.27556 18.0294ZM6.25 16C6.25 16.4142 6.58579 16.75 7 16.75C7.41421 16.75 7.75 16.4142 7.75 16H6.25ZM7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5H7.75ZM7.89778 16.75H19.8978V15.25H7.89778V16.75ZM7.89778 15.25C7.01609 15.25 6.42812 15.2436 5.92721 15.3778L6.31543 16.8267C6.57752 16.7564 6.91952 16.75 7.89778 16.75V15.25ZM5.92721 15.3778C4.63311 15.7245 3.62231 16.7353 3.27556 18.0294L4.72444 18.4177C4.9325 17.6412 5.53898 17.0347 6.31543 16.8267L5.92721 15.3778ZM7.75 16V2.5H6.25V16H7.75Z" fill="currentColor" />
                                                                </svg>
                                                                {config.text.mark_as_unread}
                                                            </button>
                                                        </li>
                                                        <li onClick={() => actions('delete')}>
                                                            <button type="button" className="w-full">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0">
                                                                    <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                                {config.text.delete}
                                                            </button>
                                                        </li>
                                                    </ul>

                                                </Dropdown>
                                                
                                            </div>
                                        </li>

                                    </ul>

                                </div>

                            </div>

                            <div className="mt-4 md:flex-auto flex-1">

                                <div className="flex items-center md:justify-end justify-center">

                                    <div className="ltr:mr-3 rtl:ml-3">
                                        {data.length ? pager.startIndex + 1 : 0} - {pager.endIndex + 1} of {data.length ? (type === 'send' ? send.length : inbox.length) : 0}
                                    </div>

                                    <button type="button" disabled={pager.currentPage === 1} onClick={() => { searchMails(pager.currentPage-1, false); }} className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 ltr:mr-3 rtl:ml-3 disabled:opacity-60 disabled:cursor-not-allowed">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:rotate-180">
                                            <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <button type="button" disabled={pager.currentPage === pager.totalPages || !data.length} onClick={() => { searchMails(pager.currentPage+1, false); }} className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 disabled:opacity-60 disabled:cursor-not-allowed">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:rotate-180">
                                            <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                </div>

                            </div>

                        </div>

                        <div className="h-px border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>
                        
                        <div className="relative table-responsive min-h-[420px] grow overflow-y-auto sm:min-h-[420px]">

                            {
                                data.length ?
                                <table className='table-hover'>
                                    <tbody>
                                        {
                                            data.map((item, index) =>
                                                <tr key={index} className="cursor-pointer" onClick={() => actions('open', item.id)}>
                                                    <td>
                                                        <div className="flex items-center whitespace-nowrap">

                                                            <div className="ltr:mr-3 rtl:ml-3">
                                                                <input type="checkbox" checked={ids.includes(item.id)} onChange={() => handle_checkbox(item.id)} onClick={(e) => e.stopPropagation()} className="form-checkbox"/>
                                                            </div>

                                                            <div className={`whitespace-nowrap font-semibold dark:text-gray-300 flex items-center mx-3`}>
                                                               
                                                                <div className="rounded-full w-max ltr:mr-3 rtl:ml-3">
                                                                  
                                                                    <img 
                                                                        src={`${host}/${item.user?.image}`} 
                                                                        onError={(e) => e.target.src = "/media/public/user_icon.png"}
                                                                        onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                                        className="h-7 w-7 rounded-full object-cover mail-image"
                                                                    />

                                                                </div>

                                                                <span className='font-medium text-white-dark max-w-[10rem] truncate'>
                                                                    {item.user?.id === config.user.id ? config.text.me : item.user?.name || ''}
                                                                </span>

                                                            </div>

                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="min-w-[300px] overflow-hidden font-medium text-white-dark line-clamp-1">

                                                            <span className={`${item.readen || item.sender === 'me' ? '' : 'font-semibold text-gray-800 dark:text-gray-300'}`}>

                                                                <span>{item.title || ''}</span> &minus;

                                                                <span>{item.description || ''}</span>

                                                            </span>
                                                            
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center whitespace-nowrap">
                                                            <div className="ltr:mr-3 rtl:ml-3">
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); actions('star', item.id); }} className={`flex items-center enabled:hover:text-warning disabled:opacity-60 ${item.star ? 'text-warning' : ''}`}>
                                                                    <svg className={item.star ? 'fill-warning' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path stroke="currentColor" strokeWidth="1.5" d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="ltr:mr-3 rtl:ml-3">
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); actions('important', item.id); }} className={`flex items-center enabled:hover:text-primary disabled:opacity-60 ${item.important ? 'text-primary' : ''}`}>
                                                                    <svg className={`rotate-90 ${item.important ? 'fill-primary' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path stroke="currentColor" strokeWidth="1.5" d="M21 16.0909V11.0975C21 6.80891 21 4.6646 19.682 3.3323C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.3323C3 4.6646 3 6.80891 3 11.0975V16.0909C3 19.1875 3 20.7358 3.73411 21.4123C4.08421 21.735 4.52615 21.9377 4.99692 21.9915C5.98402 22.1045 7.13673 21.0849 9.44216 19.0458C10.4612 18.1445 10.9708 17.6938 11.5603 17.5751C11.8506 17.5166 12.1494 17.5166 12.4397 17.5751C13.0292 17.6938 13.5388 18.1445 14.5578 19.0458C16.8633 21.0849 18.016 22.1045 19.0031 21.9915C19.4739 21.9377 19.9158 21.735 20.2659 21.4123C21 20.7358 21 19.1875 21 16.0909Z"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap font-medium ltr:text-right rtl:text-left">
                                                        {date_time(item.created_at)}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table> :
                                <div className="grid place-content-center min-h-[420px] h-full no-select empty-mails">
                                    {config.text.no_data}
                                </div>
                            }

                            { loader && <Loader  /> }

                        </div>

                    </div>
                }
                
            </div>

        </div>

    );

};

"use client";
import { toggle_animation, toggle_layout, toggle_menu, toggle_nav, toggle_dir, toggle_theme, toggle_setting, toggle_text } from '@/public/script/store';
import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { set_session } from '@/public/script/public';
import { English } from '@/public/script/langs/en';
import { Arabic } from '@/public/script/langs/ar';

export default function Setting () {

    const dispatch = useDispatch();
    const pathname = usePathname();
    const config = useSelector((state) => state.config);
    const [button, setButton] = useState(false);

    const go_top = () => {

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

    }
    const languages =  () => {

        let lang = localStorage.getItem('lang');
       
        if ( lang === 'ar' ) {
            dispatch(toggle_dir('rtl'));
            document.querySelector('html').classList.add('ar');
        }
        else {
            dispatch(toggle_dir('ltr'));
            document.querySelector('html').classList.remove('ar');
        }

        let data = English;

        if ( lang === 'ar' ) data = Arabic;
        dispatch(toggle_text(data));
        set_session('text', data);

    }
    useEffect(() => {

        languages();

    }, [config.lang, pathname]);
    useEffect(() => {

        window.addEventListener('scroll', function(){

            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) setButton(true);

            else setButton(false);

        });

    }, []);

    return (

        <Fragment>

            <div className='settings'>
                
                <div className={`${(config.setting && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`} onClick={() => dispatch(toggle_setting())}></div>

                <nav className={`${(config.setting && 'ltr:!right-0 rtl:!left-0') || ''} no-select fixed top-0 bottom-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}>
                    
                    <div className="h-full overflow-hidden">

                        <div className="flex justify-between items-center relative pb-4">

                            <button type='button' onClick={() => dispatch(toggle_setting())} className="close pointer absolute top-0 ltr:right-0 rtl:left-0 opacity-80 hover:opacity-100 dark:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <h4 className="mb-1 dark:text-white opacity-80 mt-[2px] tracking-wide text-[1rem]">{config.text.settings}</h4>

                        </div>

                        <div className="perfect-scrollbar h-[calc(100%_-_40px)] overflow-y-auto overflow-x-hidden">

                            <div className="mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.theme}</h5>

                                <div className="mt-5 grid grid-cols-3 gap-2">

                                    <button type="button" className={`${config.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggle_theme('light'))}>
                                       
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2">
                                            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"></circle>
                                            <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                      
                                        {config.text.light}

                                    </button>

                                    <button type="button" className={`${config.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggle_theme('dark'))}>
                                     
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2">
                                            <path fill="currentColor" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"></path>
                                        </svg>

                                        {config.text.dark}

                                    </button>

                                    <button type="button" className={`${config.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggle_theme('light'))}>
                                      
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2">
                                            <path opacity="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M7.142 18.9706C5.18539 18.8995 3.99998 18.6568 3.17157 17.8284C2 16.6569 2 14.7712 2 11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C22 5.34315 22 7.22876 22 11C22 14.7712 22 16.6569 20.8284 17.8284C20.0203 18.6366 18.8723 18.8873 17 18.965"/>
                                            <path stroke="currentColor" strokeWidth="1.5" d="M9.94955 16.0503C10.8806 15.1192 11.3461 14.6537 11.9209 14.6234C11.9735 14.6206 12.0261 14.6206 12.0787 14.6234C12.6535 14.6537 13.119 15.1192 14.0501 16.0503C16.0759 18.0761 17.0888 19.089 16.8053 19.963C16.7809 20.0381 16.7506 20.1112 16.7147 20.1815C16.2973 21 14.8648 21 11.9998 21C9.13482 21 7.70233 21 7.28489 20.1815C7.249 20.1112 7.21873 20.0381 7.19436 19.963C6.91078 19.089 7.92371 18.0761 9.94955 16.0503Z"/>
                                        </svg>

                                        {config.text.system}

                                    </button>

                                </div>

                            </div>

                            <div className="mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.navigation}</h5>

                                <div className="mt-5 grid grid-cols-3 gap-2">

                                    <button type="button" className={`${config.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggle_menu('horizontal'))}>
                                        {config.text.horizontal}
                                    </button>

                                    <button type="button" className={`${config.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggle_menu('vertical'))}>
                                        {config.text.vertical}
                                    </button>

                                    <button type="button" onClick={() => dispatch(toggle_menu('collapsible-vertical'))} className={`${config.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}>
                                        {config.text.collapsible}
                                    </button>

                                </div>

                            </div>

                            <div className="mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.layout}</h5>

                                <div className="mt-5 flex gap-2">

                                    <button type="button" onClick={() => dispatch(toggle_layout('boxed-layout'))} className={`${config.layout === 'boxed-layout' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`}>
                                        {config.text.box}
                                    </button>

                                    <button type="button" className={`${config.layout === 'full' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggle_layout('full'))}>
                                        {config.text.full}
                                    </button>

                                </div>

                            </div>

                            <div className="hidden mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.direction}</h5>

                                <div className="mt-5 flex gap-2">

                                    <button type="button" className={`${config.dir === 'ltr' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggle_dir('ltr'))}>
                                        {config.text.ltr}
                                    </button>

                                    <button type="button" className={`${config.dir === 'rtl' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggle_dir('rtl'))}>
                                        {config.text.rtl}
                                    </button>

                                </div>

                            </div>

                            <div className="mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.navbar_type}</h5>

                                <div className="mt-5 flex justify-between items-center gap-3 text-primary">

                                    <label className="mb-0 inline-flex pointer">
                                        <input type="radio" checked={config.nav === 'navbar-sticky'} value="navbar-sticky" className="form-radio" onChange={() => dispatch(toggle_nav('navbar-sticky'))}/>
                                        <span className='px-1'>{config.text.sticky}</span>
                                    </label>

                                    <label className="mb-0 inline-flex pointer">
                                        <input type="radio" checked={config.nav === 'navbar-floating'} value="navbar-floating" className="form-radio" onChange={() => dispatch(toggle_nav('navbar-floating'))}/>
                                        <span className='px-1'>{config.text.floating}</span>
                                    </label>

                                    <label className="mb-0 inline-flex pointer">
                                        <input type="radio" checked={config.nav === 'navbar-static'} value="navbar-static" className="form-radio" onChange={() => dispatch(toggle_nav('navbar-static'))}/>
                                        <span className='px-1'>{config.text.static}</span>
                                    </label>

                                </div>

                            </div>

                            <div className="mb-3 rounded-md border border-dashed border-white-light px-4 py-5 dark:border-[#1b2e4b]">

                                <h5 className="text-base leading-none dark:text-white">{config.text.animation}</h5>

                                <select className="mt-5 pointer form-select border-primary text-primary" value={config.animation} onChange={(e) => dispatch(toggle_animation(e.target.value))}>
                                    <option value=" ">{config.text.select_animation}</option>
                                    <option value="animate__fadeIn">{config.text.fade}</option>
                                    <option value="animate__fadeInDown">{config.text.fade_down}</option>
                                    <option value="animate__fadeInUp">{config.text.fade_up}</option>
                                    <option value="animate__fadeInLeft">{config.text.fade_left}</option>
                                    <option value="animate__fadeInRight">{config.text.fade_right}</option>
                                    <option value="animate__slideInDown">{config.text.slide_down}</option>
                                    <option value="animate__slideInLeft">{config.text.slide_left}</option>
                                    <option value="animate__slideInRight">{config.text.slide_right}</option>
                                    <option value="animate__zoomIn">{config.text.zoom_in}</option>
                                </select>

                            </div>

                        </div>

                    </div>
                    
                </nav>

            </div>

            <div className="fixed bottom-6 z-50 ltr:right-6 rtl:left-6">
                {
                    button &&
                    <button type="button" className="btn btn-outline-primary animate-pulse rounded-full bg-[#fafafa] p-2 dark:bg-[#060818] dark:hover:bg-primary" onClick={go_top}>
                    
                        <svg width="24" height="24" className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"></path>
                            <path fill="currentColor" d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"></path>
                        </svg>

                    </button>
                }
            </div>

        </Fragment>

    );

}

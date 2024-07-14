"use client";
import { toggle_dir, toggle_theme, toggle_lang, toggle_menu, toggle_layout, toggle_animation, toggle_nav, toggle_semidark, toggle_side, toggle_user, toggle_text } from '@/public/script/store';
import { api, date, get_session, print } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import Setting from './setting';
import Loader from './loader';
import Login from "@/app/auth/login/page";
import Lockscreen from "@/app/auth/lock/page";
import Error from "@/app/not-found";

export default function DefaultLayout ({ children }) {

    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [loader, setLoader] = useState(true);
    const [animation, setAnimation] = useState(config.animation);
    const [started, setStarted] = useState(false);
    const [auth, setAuth] = useState(false);
    const [logged, setLogged] = useState(false);

    const access_url = () => {

        let access = 
        (pathname.includes('/account') && !config.user.allow_account) || 
        (pathname.includes('/mail') && !config.user.allow_mails) || 
        (pathname.includes('/chat') && !config.user.allow_messages) || 
        (pathname.includes('/categories') && !config.user.allow_categories) || 
        (pathname.includes('/products') && !config.user.allow_products) ||
        (pathname.includes('/orders') && !config.user.allow_orders) ||
        (pathname.includes('/coupons') && !config.user.allow_coupons) ||
        (pathname.includes('/vendors') && !config.user.allow_vendors) ||
        (pathname.includes('/clients') && !config.user.allow_clients) ||
        (pathname.includes('/admins') && !config.user.supervisor) ||
        (pathname.includes('/settings') && !config.user.super) ||
        (pathname.includes('/reports') && !config.user.allow_reports) ? false : true;

        return access

    }
    const active_link = () => {

        document.querySelectorAll('.sidebar ul a, ul.horizontal-menu a, ul.horizontal-menu .nav-link').forEach(_ => _.classList.remove('active'));
        document.querySelector(`.sidebar ul a[href='${pathname}']`)?.classList.add('active');
        document.querySelector(`ul.horizontal-menu a[href='${pathname}']`)?.classList.add('active');
        document.querySelector(`ul.horizontal-menu a[href='${pathname}']`)?.closest('li.menu')?.querySelectorAll('.nav-link')[0]?.classList.add('active');
        document.querySelector(`.sidebar ul a[href='${pathname}']`)?.closest('li.menu')?.querySelectorAll('.nav-link')[0]?.classList.add('active');

    }
    useEffect(() => {

        active_link();
        setTimeout(() => { setLoader(false); active_link(); }, 500);
        dispatch(toggle_user(get_session('user')));

        if ( window.innerWidth < 1024 && config.side ) dispatch(toggle_side());
        if ( started ) { setAnimation(false); setTimeout(_ => setAnimation(config.animation)); }
        else setStarted(true);

        if ( !get_session('user')?.access_token ) return router.replace('/auth/login');
        if ( get_session('user')?.access_token && !get_session('user')?.logged ) return router.replace('/auth/lock');

    }, [pathname]);
    useEffect(() => {

        // setAuth(get_session('user')?.access_token ? true : false);
        setLogged((get_session('user')?.access_token && get_session('user')?.logged) ? true : false);
        dispatch(toggle_user(get_session('user')));

    }, [config.user.update]);
    useEffect(() => {

        dispatch(toggle_theme(localStorage.getItem('theme') || config.theme));
        dispatch(toggle_menu(localStorage.getItem('menu') || config.menu));
        dispatch(toggle_layout(localStorage.getItem('layout') || config.layout));
        dispatch(toggle_dir(localStorage.getItem('dir') || config.dir));
        dispatch(toggle_animation(localStorage.getItem('animation') || config.animation));
        dispatch(toggle_nav(localStorage.getItem('nav') || config.navbar));
        dispatch(toggle_semidark(localStorage.getItem('semidark') || config.semidark));
        dispatch(toggle_lang(localStorage.getItem('lang') || config.lang));
        setAnimation(config.animation);

    }, [dispatch, config.theme, config.menu, config.layout, config.dir, config.animation, config.nav, config.lang, config.semidark]);

    return (

        <div className={`${(config.side && 'toggle-sidebar') || ''} ${config.menu} ${config.layout} ${config.dir} main-section relative font-nunito text-sm font-normal antialiased`}>
           
            <div className="relative">

                { loader && <Loader fixed bg/> }
                
                <Setting />

                <div className={`${config.nav} main-container min-h-screen text-black dark:text-white-dark`}>

                    <Sidebar />

                    {
                        logged ?
                        <div className="main-content">

                            <Header />

                            {
                                animation &&
                                <div className={`${animation} animate__animated ${config.menu === 'horizontal' ? config.layout === 'full' ? 'p-6' : 'p-6 lg:px-0' : 'p-6'}`}>
                                    {/* { access_url() ? children : <Error /> } */} {children}
                                </div>
                            }
                            
                        </div> :
                        <div className="main-content">
                            {
                                loader ? '' :
                                <div className={`${animation} animate__animated px-6`}>
                                    { !auth && <Login /> }
                                </div>
                            }
                        </div>
                    }

                </div>

            </div>

        </div>

    );

};

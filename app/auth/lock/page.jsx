"use client";
import { api, alert_msg, set_session, get_session, date, print } from '@/public/script/public';
import Loader from '@/app/component/loader';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Lockscreen () {

    const router = useRouter();
    const pathname = usePathname();
    const input = useRef(null);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({});
    const config = useSelector((state) => state.config);
    const [auth, setAuth] = useState(true);

    const submit = async(e) => {

        e.preventDefault();
        setLoader(true);
        const response = await api('auth/unlock', {token: config.user.access_token, password: data.password});
        
        if ( response.data ) {
            set_session('user', {...response.data, logged: true, update: date()});
            if ( pathname === '/' ) router.replace('/account');
            else router.replace('/');
            alert_msg(config.text.access_successfully);
        }
        else if ( response.status === 'logout' ) {
            set_session('user', {update: date()});
            router.replace('/auth/login');
        }
        else {
            setLoader(false);
            alert_msg(config.text.error_password, 'error');
        }

    }
    useEffect(() => {

        if ( get_session('user')?.access_token && get_session('user')?.logged ) return router.replace('/');
        else setAuth(false);

        setTimeout(_ => input.current?.focus(), 100);
        document.title = `${config.text.lockscreen} | ${config.user.name || ''}`;

    }, []);

    return (

        <div className="flex items-center justify-center w-full h-[100vh] bg-[url('/media/public/map.svg')] bg-full bg-center dark:bg-[url('/media/public/map-dark.svg')]">
            {
                !auth &&
                <div className="panel w-full max-w-[420px] sm:w-[480px] no-select overflow-hidden">

                    <div className="mb-7 flex items-start">

                        <div className="ltr:mr-4 rtl:ml-4 layer-div mt-[3px]">

                            <img src={`${host}/U${config.user.id}`} className="h-12 w-12 rounded-full object-cover"/>

                        </div>

                        <div className="flex-1">

                            <h4 className="text-xl mb-1">{config.user.name || ''}</h4>

                            <p>{config.text.unlock_screen}</p>

                        </div>

                    </div>

                    <form className="space-y-5" onSubmit={submit}>

                        <div>
                            <label htmlFor="password" className='mb-3'>{config.text.password}</label>
                            <input id="password" type="password" ref={input} value={data.password || ''} onChange={(e) => setData({...data, password: e.target.value})} className="form-input" required autoComplete='off'/>
                        </div>

                        <button type="submit" className="btn btn-primary w-full">{config.text.unlock}</button>

                    </form>

                    <div className="relative my-6 mb-4 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                        
                        <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark dark:bg-black">
                            <span>{config.text.or}</span>
                        </div>

                    </div>

                    <p className="text-left my-2 rtl:text-right">
                        {config.text.forgot_password}
                        <Link href="tel:+201099188572" className="text-primary hover:underline ltr:ml-2 rtl:mr-2">{config.text.call_us}</Link>
                    </p>

                    { loader && <Loader /> }

                </div>
            }
        </div>

    );

};

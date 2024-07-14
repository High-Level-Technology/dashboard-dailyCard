"use client";
import { api,  matching, fix_date, fix_number, capitalize, print } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Reports () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);

    const fix_value = ( value ) => {

        value = value.split("_");
        if ( value.length === 1 ) value = capitalize(value[0]);
        if ( value.length === 2 ) value = `${capitalize(value[0])} ${capitalize(value[1])}`;
        if ( value.length === 3 ) value = `${capitalize(value[0])} ${capitalize(value[1])} ${capitalize(value[2])}`;
        return value

    }
    const columns = () => {
        
        return [
            {
                accessor: 'id', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>,
            },
            {
                accessor: 'user', sortable: true, title: 'user',
                render: ({ user, id }) => 
                    user.id ?
                    config.user.id === user.id ?
                    <div className="flex items-center font-semibold default">
                        <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${host}/U${user.id}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[10rem]">Me</div>
                    </div> :
                    <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                        onClick={() => router.push(user.link)}>
                        <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${host}/U${user.id}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[10rem]">{user.name}</div>
                    </div>
                    : <div className="font-semibold select-text">--</div>
                ,
            },
            {
                accessor: 'type', sortable: true, title: 'action',
                render: ({ type, id }) => <div className="font-semibold select-text default">{fix_value(type)}</div>,
            },
            {
                accessor: 'ip', sortable: true, title: 'ip',
                render: ({ ip, id }) => <div className="font-semibold select-text default truncate max-w-[10rem]">{ip}</div>,
            },
            {
                accessor: 'host', sortable: true, title: 'device',
                render: ({ host, id }) => <div className="font-semibold select-text default truncate max-w-[10rem]">{host}</div>,
            },
            {
                accessor: 'item', sortable: true, title: 'url',
                render: ({ item, id }) =>
                item.link ?
                    <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                        onClick={() => router.push(item.link)}>
                        <div className="font-semibold select-text truncate max-w-[12rem]">( {item.action_id} ) - {item.name}</div>
                    </div>
                : item.action_id ? <div className="font-semibold select-text">( {item.action_id} ) - ?</div>
                : <div className="font-semibold select-text">--</div> 
                ,
            },
            {
                accessor: 'amount', sortable: true, title: 'amount',
                render: ({ amount, id }) => 
                amount ?
                    <div className="font-semibold select-text default">{fix_number(amount)} RAS</div> :
                    <div className="font-semibold select-text default">--</div>,
            },
            {
                accessor: 'status', sortable: true, title: 'status',
                render: ({ status, id }) => 
                status === 1 ?
                    <span className='badge badge-outline-warning'>Pending</span>
                : status === 2 ?
                    <span className='badge badge-outline-warning'>Stopped</span>
                : status === 3 ?
                    <span className='badge badge-outline-danger'>Cancelled</span>
                : status === 4 ?
                    <span className='badge badge-outline-danger'>Cancelled</span>
                : 
                    <span className='font-semibold select-text default'>--</span>
                ,
            },
            {
                accessor: 'date', sortable: true, title: 'date',
                render: ({ date, id }) => <div className="font-semibold select-text default">{fix_date(date)}</div>,
            },
        ];

    }
    const get = async() => {

        const response = await api('report', {token: config.user.token});
        setData(response.data || []);

    }
    const delete_ = async( ids ) => {

        await api('report/delete', {ids: JSON.stringify(ids), token: config.user.token});

    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(`!${item.user?.id}`, query) ||
            matching(`!${item.action?.id}`, query) ||
            matching(item.user?.name, query) ||
            matching(item.action?.name, query) ||
            matching(item.amount, query) ||
            matching(`${item.amount} RAS`, query) ||
            matching(fix_number(item.amount), query) ||
            matching(`${fix_number(item.amount)} RAS`, query) ||
            matching(item.ip, query) ||
            matching(item.host, query) ||
            matching(item.type, query) ||
            matching(fix_value(item.type), query) ||
            matching(item.location, query) ||
            matching(item.secret, query) ||
            matching(item.user?.id === config.user.id ? 'me' : '', query) ||
            matching(item.paid ? 'paid' : 'no', query) ||
            matching(item.status === 1 ? 'pending' : item.status === 2 ? 'stopped' : item.status === 3 ? 'cancelled' : item.status === 4 ? 'confirmed' : '', query) ||
            matching(fix_date(item.date), query) || 
            matching(item.date, query)
        );

        return result;

    }
    useEffect(() => {

        document.title = config.text.all_reports;
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false}
            no_delete={!data.length || !config.user.super} no_search={!data.length} no_add={true} no_edit={true}
        />

    );

};

"use client";
import { api, matching, fix_date, capitalize, fix_number, print } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Activity ({ activity }) {

    const config = useSelector((state) => state.config);
    const [data, setData] = useState(activity || []);

    const fix_value = ( value ) => {

        value = value.split("_");
        if ( value.length === 1 ) value = capitalize(value[0]);
        if ( value.length === 2 ) value = `${capitalize(value[0])} ${capitalize(value[1])}`;
        return value

    }
    
    const columns = () => {
        
        return [
            {
                accessor: 'invoice', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>,
            },
            {
                accessor: 'type', sortable: true, title: 'action',
                render: ({ type, id }) => <div className="font-semibold select-text default">{fix_value(type)}</div>,
            },
            {
                accessor: 'ip', sortable: true, title: 'ip',
                render: ({ ip, id }) => <div className="font-semibold select-text default">{ip}</div>,
            },
            {
                accessor: 'host', sortable: true, title: 'device',
                render: ({ host, id }) => <div className="font-semibold select-text default">{host}</div>,
            },
            {
                accessor: 'amount', sortable: true, title: 'amount',
                render: ({ amount, id }) => <div className="font-semibold select-text default">{amount ? `${fix_number(amount)} RAS` : '-'}</div>,
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
                    <span className='badge badge-outline-success'>Confirmed</span>
                : <span className='font-semibold select-text default'>-</span>
            },
            {
                accessor: 'date', sortable: true, title: 'date',
                render: ({ date, id }) => <div className="font-semibold select-text default">{fix_date(date)}</div>,
            },
        ];

    }
    const delete_ = async( ids ) => {

        const response = await api('account/history/delete', {ids: JSON.stringify(ids), token: config.user.token});
        return response;
        
    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.type, query) ||
            matching(item.ip, query) ||
            matching(item.host, query) ||
            matching(item.amount, query) ||
            matching(item.status === 1 ? 'pending' : item.status === 2 ? 'stopped' : item.status === 3 ? 'cancelled' : item.status === 4 ? 'confirmed' : '', query) ||
            matching(item.date, query) ||
            matching(fix_date(item.date), query) 
        );

        return result;

    }
    useEffect(() => {
        
        document.title = config.text.account;

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false}
            no_delete={!data.length} no_search={!data.length} no_add={true} no_edit={true}
        />
        
    );

};

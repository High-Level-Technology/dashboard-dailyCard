"use client";
import { api,  matching, fix_date, print } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Vendors () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);

    const columns = () => {
        
        return [
            {
                accessor: 'invoice', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>,
            },
            {
                accessor: 'info', sortable: true, title: 'name',
                render: ({ info, id }) => (
                    <div className="flex items-center font-semibold">
                        <div className="h-7 w-7 rounded-full overflow-hidden layer-div ltr:mr-3 rtl:ml-3 -mt-[2px]">
                            <img 
                                src={`${host}/${info?.image}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text default truncate max-w-[15rem]">{info?.name}</div>
                    </div>
                ),
            },
            {
                accessor: 'phone', sortable: true, title: 'phone',
                render: ({ phone, id }) => <div className="font-semibold select-text default truncate max-w-[10rem]">{phone}</div>,
            },
            {
                accessor: 'email', sortable: true, title: 'email',
                render: ({ email, id }) => <div className="font-semibold select-text default truncate max-w-[15rem]">{email}</div>,
            },
            {
                accessor: 'active', sortable: true, title: 'status',
                render: ({ active, id }) => <span className={`badge badge-outline-${active ? 'success' : 'danger'}`}>
                    {active ? config.text.active : config.text.stopped}
                </span>,
            },
            {
                accessor: 'created_at', sortable: true, title: 'date',
                render: ({ created_at, id }) => <div className="font-semibold select-text default">{fix_date(created_at)}</div>,
            },
        ];

    }
    const get = async() => {

        const response = await api('vendor');
        setData(response.vendors || []);

    }
    const delete_ = async( ids ) => {

        const response = await api('vendor/delete', {ids: JSON.stringify(ids)});
        return response;
        
    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.name, query) ||
            matching(item.email, query) ||
            matching(item.phone, query) ||
            matching(item.country, query) ||
            matching(item.city, query) ||
            matching(item.active ? config.text.active : config.text.stopped, query) ||
            matching(item.created_at, query) ||
            matching(fix_date(item.created_at), query) 
        );

        return result;

    }
    useEffect(() => {

        document.title = config.text.all_vendors || '';
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false} btn_name="add_vendor"
            add={() => router.push(`/vendors/add`)} edit={(id) => router.push(`/vendors/edit/${id}`)} 
            no_delete={!data.length} no_search={!data.length} 
        />
        
    );

};

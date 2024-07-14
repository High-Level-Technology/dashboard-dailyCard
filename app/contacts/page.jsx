"use client";
import { api, matching, fix_date } from '@/public/script/public';
import Table from "@/app/component/table";
import Form from "./form";
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Contacts () {

    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);
    const [contact, setContact] = useState({});
    const [model, setModel] = useState(false);

    const columns = () => {
        
        return [
            {
                accessor: 'id', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>
            },
            {
                accessor: 'name', sortable: true, title: 'name',
                render: ({ name }) => <div className="font-semibold select-text truncate max-w-[12rem]">{name}</div>
            },
            {
                accessor: 'email', sortable: true, title: 'email',
                render: ({ email }) => <div className="font-semibold select-text truncate max-w-[15rem]">{email}</div>
            },
            {
                accessor: 'phone', sortable: true, title: 'phone',
                render: ({ phone }) => <div className="font-semibold select-text truncate max-w-[10rem]">{phone}</div>
            },
            {
                accessor: 'country', sortable: true, title: 'country',
                render: ({ country }) => <div className="font-semibold select-text truncate max-w-[10rem]">{country}</div>
            },
            {
                accessor: 'active', sortable: true, title: 'status',
                render: ({ active, id }) => <span className={`badge badge-outline-${active ? 'success' : 'danger'}`}>
                    {active ? config.text.active : config.text.stopped}
                </span>
            },
            {
                accessor: 'created_at', sortable: true, title: 'date',
                render: ({ created_at, id }) => <div className="font-semibold select-text default">{fix_date(created_at)}</div>
            },
        ];

    }
    const get = async() => {

        const response = await api('contact');
        setData(response.contacts || []);

    }
    const delete_ = async( ids ) => {

        setData(data.filter(_ => !ids.includes(_.id)));
        await api('contact/delete', {ids: JSON.stringify(ids)});

    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.name, query) ||
            matching(item.email, query) ||
            matching(item.phone, query) ||
            matching(item.address, query) ||
            matching(item.content, query) ||
            matching(item.country, query) ||
            matching(item.city, query) ||
            matching(item.created_at, query) ||
            matching(fix_date(item.created_at), query) ||
            matching(item.active ? config.text.active : config.text.stopped, query)
        );

        return result;

    }
    useEffect(() => {

        document.title = config.text.all_contacts;
        get();

    }, []);

    return (

        <Fragment>

            <Table 
                columns={columns} data={data} delete_={delete_} search={search} async_search={false} 
                no_delete={!data.length} no_search={!data.length} no_add={true}
                edit={(id) => { setContact(data.find((_ => _.id === id))); setModel(true); }} 
            />

            <Form config={config} data={contact} model={model} setModel={setModel}/>

        </Fragment>

    );

};

"use client";
import { api, fix_date, matching, fix_number } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Blogs () {

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
                accessor: 'info', sortable: true, title: 'title',
                render: ({ info, id }) => (
                    <div className="flex items-center font-semibold">
                        <div className="h-7 w-7 rounded-[.5rem] overflow-hidden layer-div ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${info.image}`} className="h-full w-full rounded-[.5rem] object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text default truncate max-w-[13rem]">{info?.title}</div>
                    </div>
                ),
            },
            {
                accessor: 'description', sortable: true, title: 'description',
                render: ({ description, id }) => <div className="font-semibold select-text default truncate max-w-[20rem]">{description}</div>,
            },
            {
                accessor: 'views', sortable: true, title: 'views',
                render: ({ views, id }) => <div className="font-semibold select-text default">{fix_number(views)}</div>,
            },
            {
                accessor: 'comments', sortable: true, title: 'comments',
                render: ({ comments, id }) => <div className="font-semibold select-text default">{fix_number(comments)}</div>,
            },
            {
                accessor: 'active', sortable: true, title: 'status',
                render: ({ active, id }) => 
                    <span className={`badge badge-outline-${active ? 'success' : 'danger'}`}>
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

        const response = await api('blog');
        setData(response.blogs || []);

    }
    const delete_ = async( ids ) => {

        const response = await api('blog/delete', {ids: JSON.stringify(ids)});
        return response;
        
    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.title, query) ||
            matching(item.description, query) ||
            matching(item.views, query) ||
            matching(item.comments, query) ||
            matching(fix_number(item.views), query) ||
            matching(fix_number(item.comments), query) ||
            matching(item.active ? config.text.active : config.text.stopped, query) ||
            matching(item.created_at, query) ||
            matching(fix_date(item.created_at), query)
        );

        return result;

    }
    useEffect(() => {

        document.title = config.text.all_blogs;
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false} btn_name="add_blog"
            add={() => router.push(`/blogs/add`)} edit={(id) => router.push(`/blogs/edit/${id}`)} 
            no_delete={!data.length} no_search={!data.length} 
        />

    );

};

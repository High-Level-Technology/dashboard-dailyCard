"use client";
import { api, date as dt, matching,  fix_date, alert_msg, print } from '@/public/script/public';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Table from "@/app/component/table";
import Form from "./form";

export default function Reviews () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [review, setReview] = useState({});
    const [model, setModel] = useState(false);
    const [loader, setLoader] = useState(false);

    const columns = () => {
        
        return [
            {
                accessor: 'id', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>
            },
            {
                accessor: 'product', sortable: true, title: 'product',
                render: ({ product, id }) =>
                    product?.id ?
                    <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                        onClick={() => router.push(`/products/edit/${product.id}`)}>
                        <div className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${host}/${product.image}`} className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[12rem]">{product.name}</div>
                    </div> : <div className="font-semibold select-text">--</div>
                ,
            },
            {
                accessor: 'user', sortable: true, title: 'client',
                render: ({ user, id }) => 
                    user?.id ?
                    <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                        onClick={() => router.push(`/clients/edit/${user.id}`)}>
                        <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3 -mt-[2px]">
                            <img 
                                src={`${host}/${user.image}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[12rem]">{user.name}</div>
                    </div> : <div className="font-semibold select-text">--</div>
                ,
            },
            {
                accessor: 'order', sortable: true, title: 'order_id',
                render: ({ order }) => <div className="font-semibold select-text default">{order?.id || '--'}</div>
            },
            {
                accessor: 'rate', sortable: true, title: 'rate',
                render: ({ rate }) => <div className="font-semibold select-text default">{rate}</div>
            },
            {
                accessor: 'active', sortable: true, title: 'status',
                render: ({ active, id }) => <span className={`badge badge-outline-${active ? 'success' : 'danger'}`}>
                    {active ? config.text.active : config.text.stopped}
                </span>
            },
            {
                accessor: 'created_at', sortable: true, title: 'date',
                render: ({ created_at, id }) => <div className="font-semibold select-text default">{fix_date(created_at || dt())}</div>
            },
        ];

    }
    const get = async() => {

        const response = await api('review');
        setData(response.reviews || []);
        setProducts(response.products || []);

    }
    const delete_ = async( ids ) => {

        setData(data.filter(_ => !ids.includes(_.id)));
        await api('review/delete', {ids: JSON.stringify(ids)});

    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.product?.name, query) ||
            matching(item.user?.name, query) ||
            matching(item.order?.id, query) ||
            matching(item.order?.secret_key, query) ||
            matching(item.content, query) ||
            matching(item.rate, query) ||
            matching(item.created_at, query) ||
            matching(fix_date(item.created_at), query) ||
            matching(item.active ? config.text.active : config.text.stopped, query)
        );

        return result;

    }
    const save_review = async() => {
        
        if ( !review.product.id ) return alert_msg(config.text.error_review, 'error');

        setLoader(true);
        const response = await api(`review/${review.id ? `${review.id}/update` : 'store'}`, review);
        setLoader(false);

        if ( !response.status ) return alert_msg(config.text.alert_error, 'error');

        if ( review.id ) {
            let new_data = data.map(_ => _.id === review.id ? review : _);
            setData([...new_data]);
            setModel(false);
            alert_msg(`${config.text.item} ( ${review.id} ) - ${config.text.updated_successfully}`);
        }
        else {
            let new_data = data;
            new_data.unshift({...review, id: response.review?.id || 0});
            setData([...new_data]);
            setModel(false);
            alert_msg(config.text.new_item_added);
        }

    }
    useEffect(() => {

        document.title = config.text.all_reviews;
        get();

    }, []);

    return (

        <Fragment>

            <Table 
                columns={columns} data={data} delete_={delete_} search={search} async_search={false} 
                no_delete={!data.length} no_search={!data.length} btn_name="add_review"
                add={() => { setReview({active: true}); setModel(true); setLoader(false); }} 
                edit={(id) => { setReview(data.find((_ => _.id === id))); setModel(true); setLoader(false); }} 
            />

            <Form 
                config={config} data={review} setData={setReview} save={save_review} products={products}
                model={model} setModel={setModel} loader={loader}
            />

        </Fragment>

    );

};

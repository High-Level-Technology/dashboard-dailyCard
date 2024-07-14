"use client";
import {
  api,
  matching,
  fix_date,
  fix_number,
  alert_msg,
  print,
  get_session,
} from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Orders() {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [data, setData] = useState([]);

  const columns = () => {
    return [
      {
        accessor: "id",
        sortable: true,
        title: "id",
        render: ({ id }) => (
          <div className="default select-text font-semibold">{id}</div>
        ),
      },
      {
        accessor: "user",
        sortable: true,
        title: "client",
        render: ({ user, id }) =>
          user?.id ? (
            <div
              className="pointer flex items-center font-semibold hover:text-primary hover:underline"
              onClick={() => router.push(`/clients/edit/${user.id}`)}
            >
              {/* <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3 -mt-[2px]">
                            <img 
                                src={`${user.avatar}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div> */}
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {user.name}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "product",
        sortable: true,
        title: "product",
        render: ({ product, id }) =>
          product?.id ? (
            <div
              className="pointer flex items-center font-semibold hover:text-primary hover:underline"
              onClick={() => router.push(`/products/edit/${product.id}`)}
            >
              {/* <div className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${product.image}`} className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                            />
                        </div> */}
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {product.name}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "price",
        sortable: true,
        title: "price",
        render: ({ price, id }) => (
          <div className="default select-text font-semibold">
            {fix_number(price, true)} {config.text.currency}
          </div>
        ),
      },
      {
        accessor: "quantity",
        sortable: true,
        title: "quantity",
        render: ({ quantity, id }) => (
          <span className={`default select-text font-semibold`}>
            {quantity ? quantity : "--"}
          </span>
        ),
      },
      {
        accessor: "status",
        sortable: true,
        title: "status",
        render: ({ status, id }) =>
          status === "pending" ? (
            <span className="badge badge-outline-warning">
              {config.text.pending}
            </span>
          ) : status === "success" ? (
            <span className="badge badge-outline-success">
              {config.text.success}
            </span>
          ) : status === "failed" ? (
            <span className="badge badge-outline-danger">
              {config.text.failed}
            </span>
          ) : (
            // : status === 'confirmed' ?
            //     <span className='badge badge-outline-success'>{config.text.confirmed}</span>
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "created_at",
        sortable: true,
        title: "date",
        render: ({ created_at, id }) => (
          <div className="default select-text font-semibold">
            {/*fix_time*/ fix_date(created_at)}
          </div>
        ),
      },
    ];
  };
  const get = async () => {
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // إضافة Content-Type
    };

    await fetch("https://dailycard.future-developers.cloud/api/admin/orders", {
      headers: headers,
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        if  (response.status === 'success') {
          setData(response.data.data || []);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };
 const delete_ = async (payload) => {
    try {
      const response = await fetch(
        `https://dailycard.future-developers.cloud/api/admin/orders/delete`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${get_session("user")?.access_token}`, // Use the token in the header
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
  
      const result = await response.json();
      alert_msg(`${config.text.deleted_successfully}`);
      return true; // Return true to indicate success
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return false; // Return false to indicate failure
    }
  };

  const search = (items, query) => {
    let result = items.filter(
      (item) =>
        matching(`--${item.id}`, query) ||
        matching(item.user?.name, query) ||
        matching(item.product?.name, query) ||
        matching(item.coupon_code, query) ||
        matching(item.secret_key, query) ||
        matching(item.price, query) ||
        matching(`${item.price} ${config.text.currency}`, query) ||
        matching(fix_number(item.price, true), query) ||
        matching(
          `${fix_number(item.price, true)} ${config.text.currency}`,
          query
        ) ||
        matching(
          item.active ? config.text.active : config.text.stopped,
          query
        ) ||
        matching(item.paid ? config.text.paid : config.text.not_paid, query) ||
        matching(config.text[item.status], query) ||
        matching(item.created_at, query) ||
        matching(fix_date(item.created_at), query)
    );

    return result;
  };
  useEffect(() => {
    document.title = config.text.all_orders;
    get();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      btn_name="add_order"
      add={() => router.push(`/orders/add`)}
      edit={(id) => router.push(`/orders/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}

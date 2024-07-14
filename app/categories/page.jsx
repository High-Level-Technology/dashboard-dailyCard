"use client";
import { api, matching, fix_date, get_session, alert_msg } from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Categories() {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [data, setData] = useState([]);

  const columns = () => {
    return [
      {
        accessor: "invoice",
        sortable: true,
        title: "id",
        render: ({ id }) => (
          <div className="default select-text font-semibold">{id}</div>
        ),
      },
      {
        accessor: "info",
        sortable: true,
        title: "name",
        render: ({ title, id, image }) => (
          <div className=" font-semibold">
            {/* <div className="layer-div h-7 w-7 overflow-hidden rounded-[.5rem] ltr:mr-3 rtl:ml-3">
              <img
                src={`${image}`}
                className="h-full w-full rounded-[.5rem] object-cover"
                onLoad={(e) =>
                  e.target.src.includes("_icon")
                    ? e.target.classList.add("empty")
                    : e.target.classList.remove("empty")
                }
                onError={(e) => (e.target.src = `/media/public/empty_icon.png`)}
              />
            </div> */}
            <div className="default max-w-[15rem] select-text truncate font-semibold">
              {title}
            </div>
          </div>
        ),
      },
      // {
      //     accessor: 'products', sortable: true, title: 'products',
      //     render: ({ products, id }) => <div className="font-semibold select-text default">{products}</div>,
      // },
      // {
      //   accessor: "allow_products",
      //   sortable: true,
      //   title: "allow_products",
      //   render: ({ allow_products, id }) => (
      //     <span
      //       className={`badge badge-outline-${
      //         allow_products ? "success" : "danger"
      //       }`}
      //     >
      //       {allow_products ? config.text.allow : config.text.denied}
      //     </span>
      //   ),
      // },
      {
        accessor: "active",
        sortable: true,
        title: "status",
        render: ({ active, id }) => (
          <span
            className={`badge badge-outline-${active ? "success" : "danger"}`}
          >
            {active ? config.text.active : config.text.stopped}
          </span>
        ),
      },
      {
        accessor: "created_at",
        sortable: true,
        title: "date",
        render: ({ created_at, id }) => (
          <div className="default select-text font-semibold">
            {fix_date(created_at)}
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

    await fetch(
      "https://dailycard.future-developers.cloud/api/admin/categories",
      {
        headers: headers,
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        setData(response.data);
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
        `https://dailycard.future-developers.cloud/api/admin/categories/delete`,
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
        matching(item.title, query) ||
        matching(item.products, query) ||
        matching(item.description, query) ||
        matching(
          item.active ? config.text.active : config.text.stopped,
          query
        ) ||
        matching(item.created_at, query) ||
        matching(fix_date(item.created_at), query)
    );

    return result;
  };
  useEffect(() => {
    document.title = config.text.all_categories || "";
    get();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      btn_name="add_category"
      add={() => router.push(`/categories/add`)}
      edit={(id) => router.push(`/categories/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}

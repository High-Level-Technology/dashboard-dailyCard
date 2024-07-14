"use client";
import {
  api,
  matching,
  fix_date,
  fix_number,
  print,
  get_session,
  alert_msg,
} from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Getaways() {
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
        accessor: "name",
        sortable: true,
        title: "name",
        render: ({ name, id, photo }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              <div className="-mt-[2px] h-7 w-7 overflow-hidden rounded-full ltr:mr-3 rtl:ml-3">
                <img
                  src={`${photo || ""}`}
                  className="h-full w-full rounded-full object-cover"
                  onLoad={(e) =>
                    e.target.src.includes("_icon")
                      ? e.target.classList.add("empty")
                      : e.target.classList.remove("empty")
                  }
                  onError={(e) =>
                    (e.target.src = `/media/public/user_icon.png`)
                  }
                />
              </div>
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {name}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "fee",
        sortable: true,
        title: "fee",
        render: ({ fee, id }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {fee}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "number",
        sortable: true,
        title: "number",
        render: ({ number, id }) => (
          <div className="default select-text font-semibold">{number}</div>
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

    await fetch(
      "https://dailycard.future-developers.cloud/api/admin/payment/gateways",
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
        if (response.status === "success") {
          setData(response.data || []);
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
        `https://dailycard.future-developers.cloud/api/admin/payment/gateways/delete`,
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
        matching(item.number, query) ||
        matching(item.name, query) ||
        matching(item.fee, query)
    );

    return result;
  };
  useEffect(() => {
    document.title = /*config.text.all_orders*/ "All Getaways";
    get();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      btn_name="add_geteways"
      add={() => router.push(`/geteways/add`)}
      edit={(id) => router.push(`/geteways/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}

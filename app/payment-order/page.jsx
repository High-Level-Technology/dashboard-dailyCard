"use client";
import React, { useState } from "react";
import Modal from "react-modal";
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
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Getaways() {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  
  const openModal = (src) => {
    setModalImage(src);
    setModalIsOpen(true);
  };
  Modal.setAppElement('body');
  
  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage("");
  };

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
        render: ({ user, id }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              {/* <div
                className="-mt-[2px] h-7 w-7 overflow-hidden rounded-full ltr:mr-3 rtl:ml-3"
                onClick={() => openModal(invoice || "")}
              >
                <img
                  src={`${invoice || ""}`}
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
              </div> */}
              <div
                className="max-w-[12rem] select-text truncate font-semibold"
                onClick={() => router.push(`clients/edit/${user?.id}`)}
              >
                {user?.name}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },


      {
        accessor: "invoice",
        sortable: true,
        title: "invoice",
        render: ({ id, invoice }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              <div
                className="-mt-[2px] h-7 w-7 overflow-hidden rounded-full ltr:mr-3 rtl:ml-3"
                onClick={() => openModal(invoice || "")}
              >
                <img
                  src={`${invoice || ""}`}
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
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },


      {
        accessor: "balance",
        sortable: true,
        title: "balance",
        render: ({ balance, id }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {balance}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "gateway",
        sortable: true,
        title: "gateway",
        render: ({ gateway, id }) =>
          id ? (
            <div className="pointer flex items-center font-semibold hover:text-primary hover:underline">
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {gateway?.name || "-"}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
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
          ) : status === "paid" ? (
            <span className="badge badge-outline-success">
              {config.text.paid}
            </span>
          ) : status === "reject" ? (
            <span className="badge badge-outline-danger">
              {config.text.reject}
            </span>
          ) : (
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

    await fetch(
      "https://dailycard.future-developers.cloud/api/admin/payment/orders",
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
        `https://dailycard.future-developers.cloud/api/admin/payment/orders/delete`,
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
        matching(item?.user?.name, query) ||
        matching(item.balance, query) ||
        matching(item.status, query) ||
        matching(item?.gateway?.name, query)
    );

    return result;
  };
  useEffect(() => {
    document.title = config.text.all_orders;
    get();
  }, []);

  return (
    <>
      <Table
        columns={columns}
        data={data}
        delete_={delete_}
        hide={true}
        search={search}
        async_search={false}
        btn_name="add_order"
        edit={(id) => router.push(`/payment-order/edit/${id}`)}
        no_delete={!data.length}
        no_search={!data.length}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 999,
          },
        }}
        contentLabel="Image Modal"
      >
        <img src={modalImage} className="max-h-full max-w-full" alt="Modal" />
        <button
          onClick={closeModal}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </Modal>
    </>
  );
}

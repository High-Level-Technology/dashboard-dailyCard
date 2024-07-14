"use client";
import {
  alert_msg,
  fix_date,
  fix_number,
  matching,
  get_session
} from "@/public/script/public";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SelectUsers({
  model,
  setModel,
  onChange,
  product,
  category,
  blog,
}) {
  const config = useSelector((state) => state.config);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  const show_users = async () => {
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // إضافة Content-Type
    };

    await fetch("https://dailycard.future-developers.cloud/api/admin/user/all", {
      method: "GET",
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        if (response.status === "success") {
            // console.log(response.data.data)
            setUsers(response.data.data);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };



  useEffect(() => {
    show_users();
  }, []);
  

  useEffect(() => {
    if (users.length > 0) {
      setData(users);
    }
  }, [users]);

  useEffect(() => {
    if (data.length > 0) {
      let result = data?.filter(
        (item) =>
          matching(`--${item.id}`, search) ||
          matching(item.name, search) ||
          matching(item.email, search) ||
          matching(fix_date(item.username), search) ||
          matching(item.phone, search) ||
          matching(
            item.role == 1 && item.super
              ? config.text.super_admin
              : item.role == 1 && item.supervisor
              ? config.text.supervisor
              : item.role == 1
              ? config.text.admin
              : item.role == 2
              ? config.text.owner
              : item.role == 3
              ? config.text.guest
              : "",
            search
          ) ||
          matching(
            item.online ? config.text.online : config.text.offline,
            search
          )
      );

      setItems(result || []);
    }
  }, [search]);
  useEffect(() => {
    setItems(data || []);
  }, [data]);
  useEffect(() => {
    if (!model) setSearch("");
  }, [model]);



  return (
    <Transition appear show={model} as={Fragment}>
      <Dialog
        as="div"
        open={model}
        onClose={() => setModel(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 overflow-y-auto bg-[black]/60">
          <div className="edit-item-info flex min-h-full items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel w-full max-w-[27rem] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={() => setModel(false)}
                  className="absolute top-[.85rem] text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <div className="no-select bg-[#fbfbfb] py-[.85rem] text-[1.05rem] font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                  {product
                    ? config.text.select_product
                    : category
                    ? config.text.select_category
                    : blog
                    ? config.text.select_blog
                    : config.text.select_user}
                </div>

                <div className="min-h-[20rem] p-5">
                  <div className="no-select relative mb-5">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={config.text.search}
                      className="peer form-input"
                    />
                  </div>

                  <div className="all-data no-select max-h-[30rem] overflow-auto pb-10">
                    {items.length ? (
                      items.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setModel(false);
                            onChange(item.id, item.name);
                          }}
                          className="pointer contact-item flex items-start border-t border-[#e0e6ed] hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10"
                          style={{ padding: ".6rem .5rem" }}
                        >
                      

                          <div className="max-w[80%] flex-1 font-semibold">
                            <h6 className="name text-[.9rem] text-base">
                              <p className="line-clamp-2 text-ellipsis">
                                {item.name}
                              </p>
                            </h6>


                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full">
                        <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>

                        <div className="no-select flex w-full items-center justify-center py-10">
                          <p className="text-[.8rem]">{config.text.no_data}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

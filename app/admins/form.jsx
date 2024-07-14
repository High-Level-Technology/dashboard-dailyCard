"use client";
import {
  alert_msg,
  api,
  date,
  fix_date,
  print,
  get_session,
  confirm_deletion,
} from "@/public/script/public";
import Files from "@/app/component/files";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/app/component/loader";

export default function Form_Admin({ id }) {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [menu, setMenu] = useState("");
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [dataPayment, setDataPayment] = useState({
    balance: "",
    details: "",
  });

  const default_item = async () => {
    setData({
      name: "",
      username: "",
      phone: "",
      email: "",
      confirm_password: "",
      password: "",
      country: "eg",
      city: "cairo",
      show_password: true,
      login_at: "",
      active: true,
    });

    setLoader(false);
  };
  const get_item = async () => {
    await fetch(
      `https://dailycard.future-developers.cloud/api/admin/user/show?user_id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${get_session("user")?.access_token}`, // استخدام التوكن في الهيدر
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        if (!response.data?.id) return router.replace("/admins");
        setData(response.data);
        setLoader(false);
        document.title = `${config.text.edit_admin} | ${
          response.data.name || ""
        }`;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const save_item = async () => {
    let dataCreate;
    const Id = id ? parseInt(id, 10) : null;
    // تحقق من قيمة URL وتحديد كائن dataCreate بناءً على ذلك
    if (Id) {
      dataCreate = {
        id: Id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        username: data.username,
        country: data.country,
        status: Number(data.status),
      };
    } else {
      dataCreate = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        username: data.username,
        country: data.country,
        role: "admin",
        status: Number(data.status),
      };
    }

    if (!data.name) return alert_msg(config.text.name_required, "error");
    if (!data.email) return alert_msg(config.text.email_required, "error");
    if (data.password !== data.password_confirmation) {
      return alert_msg(config.text.password_not_equal, "error");
    }
    setLoader(true);
    const url = id
      ? `https://dailycard.future-developers.cloud/api/admin/user/update`
      : "https://dailycard.future-developers.cloud/api/admin/user/create";
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(dataCreate),
        headers: headers,
      });

      const responseData = await response.json();

      if (response.ok) {
        alert_msg(config.text.new_item_added);
        return router.replace("/admins");
      } else if (responseData.errors) {
        if (responseData.errors.email) {
          alert_msg(config.text.email_exists, "error");
        } else {
          alert_msg(config.text.alert_error, "error");
        }
      } else {
        alert_msg(config.text.alert_error, "error");
      }
    } catch (error) {
      alert_msg(config.text.alert_error, "error");
    } finally {
      setLoader(false);
    }
  };

  const delete_item = async () => {
    const Id = {
      id: [id]
    }
  try {
      const response = await fetch(
        `https://dailycard.future-developers.cloud/api/admin/user/delete`,
        {
          method: "POST",
          body: JSON.stringify(Id),
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
      router.replace('/admins')
      setLoader(false)
      return true; // Return true to indicate success
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return false; // Return false to indicate failure
    }
  };

  const handleWithdrawal = async () => {
    if (!dataPayment.balance) return alert_msg("Balance Required", "error");
    if (!dataPayment.details) return alert_msg("Details Required", "error");
    if (id) {
      dataPayment.user_id = id;
    }
    try {
      const response = await api("admin/wallet/withdraw", dataPayment);
      if (response.status === "success") {
        alert_msg(response.message);
        setDataPayment({
          balance: "",
          details: "",
        });
      }
    } catch (error) {
      console.error("Error with Withdrawal:", error);
    }
  };

  const handleDeposit = async () => {
    if (!dataPayment.balance) return alert_msg("Balance Required", "error");
    if (!dataPayment.details) return alert_msg("Details Required", "error");
    if (id) {
      dataPayment.user_id = id;
    }
    try {
      const response = await api("admin/wallet/deposit", dataPayment);
      if (response.status === "success") {
        alert_msg(response.message);
        setDataPayment({
          balance: "",
          details: "",
        });
      }
    } catch (error) {
      console.error("Error with Withdrawal:", error);
    }
  };

  const close_item = async () => {
    return router.replace("/admins");
  };
  useEffect(() => {
    document.title = id ? config.text.edit_admin : config.text.add_admin;
    setMenu(localStorage.getItem("menu"));
    id ? get_item() : default_item();
  }, []);

  return (
    <div className="edit-item-info relative">
      {loader ? (
        <Loader bg />
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          <div className="flex flex-1 flex-col xl:w-[70%]">
            <div className="panel no-select flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
              <div className="px-4">
                <div className="flex flex-col justify-between lg:flex-row">
                  <div className="div-2 mb-4 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                    <Files data={data} setData={setData} user />
                  </div>

                  <div className="div-3 w-full lg:w-1/2">
                    <div className="flex items-center">
                      <label
                        htmlFor="name"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.full_name}
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={data?.name || ""}
                        onChange={(e) =>
                          setData({ ...data, name: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-4 flex items-center">
                      <label
                        htmlFor="name"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.name}
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={data?.username || ""}
                        onChange={(e) =>
                          setData({ ...data, username: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-4 flex items-center">
                      <label
                        htmlFor="phone"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.phone}
                      </label>
                      <input
                        id="phone"
                        type="text"
                        value={data?.phone || ""}
                        onChange={(e) =>
                          setData({ ...data, phone: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="mb-4 mt-4 flex items-center">
                      <label
                        htmlFor="email"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.email}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={data?.email || ""}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="relative mb-4 mt-4 flex items-center">
                      {data.show_password ? (
                        <div
                          className="toggle-password pointer flex ltr:right-[.5rem] rtl:left-[.5rem]"
                          onClick={() =>
                            setData({ ...data, show_password: false })
                          }
                        >
                          <span className="material-symbols-outlined icon">
                            visibility
                          </span>
                        </div>
                      ) : (
                        <div
                          className="toggle-password pointer flex ltr:right-[.5rem] rtl:left-[.5rem]"
                          onClick={() =>
                            setData({ ...data, show_password: true })
                          }
                        >
                          <span className="material-symbols-outlined icon">
                            visibility_off
                          </span>
                        </div>
                      )}
                      <label
                        htmlFor="password"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.password}
                      </label>
                      <input
                        id="password"
                        type={data?.show_password ? "text" : "password"}
                        value={data?.password || ""}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="relative mb-4 mt-4 flex items-center">
                      {data.show_password ? (
                        <div
                          className="toggle-password pointer flex ltr:right-[.5rem] rtl:left-[.5rem]"
                          onClick={() =>
                            setData({ ...data, show_password: false })
                          }
                        >
                          <span className="material-symbols-outlined icon">
                            visibility
                          </span>
                        </div>
                      ) : (
                        <div
                          className="toggle-password pointer flex ltr:right-[.5rem] rtl:left-[.5rem]"
                          onClick={() =>
                            setData({ ...data, show_password: true })
                          }
                        >
                          <span className="material-symbols-outlined icon">
                            visibility_off
                          </span>
                        </div>
                      )}
                      <label
                        htmlFor="password"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.confirm_password}
                      </label>
                      <input
                        id="password_confirmation"
                        type={data.show_password ? "text" : "password"}
                        value={data.password_confirmation || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            password_confirmation: e.target.value,
                          })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="mt-4 border-[#e0e6ed] dark:border-[#1b2e4b]" />

              <div className="mt-4 px-4">
                <div className="flex flex-col justify-between lg:flex-row">
                  <div className="div-2 mb-4 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                    <div className="mt-4 flex items-center">
                      <label
                        htmlFor="country"
                        className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2"
                      >
                        {config.text.country}
                      </label>
                      <select
                        id="country"
                        value={data?.country || ""}
                        onChange={(e) =>
                          setData({ ...data, country: e.target.value })
                        }
                        className="pointer form-select flex-1"
                      >
                        <option value="su">Saudi Arabian</option>
                        <option value="eg">Egypt</option>
                        <option value="us">United state</option>
                        <option value="it">Italian</option>
                      </select>
                    </div>
                    {/* 
                    <div className="mt-4 flex items-center">
                      <label
                        htmlFor="age"
                        className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2"
                      >
                        {config.text.age}
                      </label>
                      <input
                        id="age"
                        type="number"
                        min="0"
                        value={data?.age || ""}
                        onChange={(e) =>
                          setData({ ...data, age: e.target.value })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div> */}
                  </div>

                  {/* <div className="div-3 w-full lg:w-1/2">
                    <div className="mt-4 flex items-center">
                      <label
                        htmlFor="city"
                        className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                      >
                        {config.text.city}
                      </label>
                      <select
                        id="city"
                        value={data?.city}
                        onChange={(e) =>
                          setData({ ...data, city: e.target.value })
                        }
                        className="pointer form-select flex-1"
                      >
                        <option value="makkah">Makkah</option>
                        <option value="gadda">Gadda</option>
                        <option value="ryad">Ryiad</option>
                        <option value="cairo">Cairo</option>
                        <option value="benha">Benha</option>
                      </select>
                    </div>
                  </div> */}
                </div>
              </div>
              <hr
                className={` ${
                  id
                    ? "mb-6 mt-4 border-[#e0e6ed] dark:border-[#1b2e4b]"
                    : "hidden"
                }`}
              />
              {id && (
                <div className="flex flex-col justify-between px-4 lg:flex-row">
                  <div className="div-2 mb-4 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                    <div className="mt-10 flex items-center">
                      <label
                        htmlFor="balance"
                        className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2"
                      >
                        Balance
                      </label>
                      <input
                        id="balance"
                        type="number"
                        value={dataPayment?.balance || ""}
                        onChange={(e) =>
                          setDataPayment({
                            ...dataPayment,
                            balance: e.target.value,
                          })
                        }
                        className="form-input flex-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-10 flex items-center">
                      <label className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2">
                        {config.text.details}
                      </label>

                      <textarea
                        id="details"
                        value={dataPayment?.details || ""}
                        onChange={(e) =>
                          setDataPayment({
                            ...dataPayment,
                            details: e.target.value,
                          })
                        }
                        className="no-resize form-textarea min-h-[80px] flex-1"
                        rows="5"
                      ></textarea>
                    </div>

                    <div className="flex gap-8">
                      <button
                        type="button"
                        className="btn mt-8 border-primary tracking-wide shadow-none hover:bg-primary hover:text-white"
                        onClick={handleWithdrawal}
                      >
                        Withdrawal
                      </button>
                      {data?.id && (
                        <button
                          type="button"
                          className="btn mt-8 border-danger tracking-wide shadow-none hover:bg-danger hover:text-white"
                          onClick={handleDeposit}
                        >
                          Deposit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="px-4 pt-[.8rem]"> */}
              {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_messages: !data?.allow_messages || false,
                          })
                        }
                        checked={data?.allow_messages || false}
                        id="allow_messages"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_messages"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.chat}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({ ...data, allow_mails: !data.allow_mails })
                        }
                        checked={data?.allow_mails || false}
                        id="allow_mails"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_mails"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.mail}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_notifications: !data?.allow_notifications,
                          })
                        }
                        checked={data?.allow_notifications || false}
                        id="allow_notifications"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_notifications"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.notifications}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_categories: !data?.allow_categories || false,
                          })
                        }
                        checked={data?.allow_categories || false}
                        id="allow_categories"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_categories"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.categories}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_products: !data.allow_products,
                          })
                        }
                        checked={data?.allow_products || false}
                        id="allow_products"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_products"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.products}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_coupons: !data.allow_coupons,
                          })
                        }
                        checked={data.allow_coupons || false}
                        id="allow_coupons"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_coupons"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.coupons}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({ ...data, allow_orders: !data.allow_orders })
                        }
                        checked={data.allow_orders || false}
                        id="allow_orders"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_orders"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.orders}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({ ...data, allow_blogs: !data.allow_blogs })
                        }
                        checked={data.allow_blogs || false}
                        id="allow_blogs"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_blogs"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.blogs}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_contacts: !data.allow_contacts,
                          })
                        }
                        checked={data.allow_contacts || false}
                        id="allow_contacts"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_contacts"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.contacts}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_reports: !data.allow_reports,
                          })
                        }
                        checked={data.allow_reports || false}
                        id="allow_reports"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_reports"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.reports}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_clients: !data.allow_clients,
                          })
                        }
                        checked={data.allow_clients || false}
                        id="allow_clients"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_clients"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.clients}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_vendors: !data.allow_vendors,
                          })
                        }
                        checked={data.allow_vendors || false}
                        id="allow_vendors"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_vendors"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.vendors}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_reviews: !data.allow_reviews,
                          })
                        }
                        checked={data.allow_reviews || false}
                        id="allow_reviews"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_reviews"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.reviews}
                    </label>
                  </div>
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({
                            ...data,
                            allow_statistics: !data.allow_statistics,
                          })
                        }
                        checked={data.allow_statistics || false}
                        id="allow_statistics"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="allow_statistics"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.statistics}
                    </label>
                  </div>

                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({ ...data, supervisor: !data.supervisor })
                        }
                        checked={data.supervisor || false}
                        id="supervisor"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="supervisor"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.supervisor}
                    </label>
                  </div>
                </div> */}
              {/* </div> */}

              {/* <hr className="mb-6 mt-6 border-[#e0e6ed] dark:border-[#1b2e4b]" /> */}

              {/* <div className="mt-4 px-4">
                <label htmlFor="notes" className="mb-4">
                  {config.text.notes}
                </label>

                <textarea
                  id="notes"
                  value={data?.notes || ""}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  className="no-resize form-textarea min-h-[80px]"
                  rows="5"
                ></textarea>
              </div> */}
            </div>
          </div>

          <div
            className={`left-tab no-select mt-6 w-full xl:mt-0 xl:w-[30%] ${
              menu === "vertical" ? "" : "space"
            }`}
          >
            <div>
              <div className="panel mb-5 pb-2 pt-6">
                <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="created_at" className="mb-3">
                      {config.text.date}
                    </label>
                    <input
                      id="created_at"
                      type="text"
                      value={fix_date(data?.created_at || "")}
                      readOnly
                      className="default form-input flex-1"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="updated_at" className="mb-3">
                      {config.text.last_login}
                    </label>
                    <input
                      id="updated_at"
                      type="text"
                      value={fix_date(data?.updated_at) || "-"}
                      readOnly
                      className="default form-input flex-1"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <hr className="mb-6 mt-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />

                <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="check-input">
                    <label className="relative h-6 w-12">
                      <input
                        onChange={() =>
                          setData({ ...data, status: !data.status })
                        }
                        checked={data?.status || false}
                        id="active"
                        type="checkbox"
                        className="pointer peer absolute z-10 h-full w-full opacity-0"
                      />

                      <span
                        className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 
                                                before:h-4 before:w-4 before:rounded-full before:bg-white 
                                                before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark 
                                                dark:before:bg-white-dark dark:peer-checked:before:bg-white"
                      ></span>
                    </label>

                    <label
                      htmlFor="active"
                      className="pointer ltr:pl-3 rtl:pr-3"
                    >
                      {config.text.active}
                    </label>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                  <button
                    type="button"
                    className="pointer btn btn-success w-full gap-2"
                    onClick={save_item}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                    >
                      <path
                        d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        opacity="0.5"
                        d="M7 8H13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{config.text.save}</span>
                  </button>
                  <button
                    type="button"
                    className="pointer btn btn-warning w-full gap-2"
                    onClick={close_item}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                    >
                      <path
                        d="M12 7V13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <circle
                        cx="12"
                        cy="16"
                        r="1"
                        fill="currentColor"
                      ></circle>
                      <path
                        opacity="0.5"
                        d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                    <span>{config.text.cancel}</span>
                  </button>
                  {id ? (
                    <button
                      type="button"
                      className="pointer btn btn-danger w-full gap-2"
                      onClick={delete_item}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                      >
                        <path
                          opacity="0.5"
                          d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M20.5001 6H3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M9.5 11L10 16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M14.5 11L14 16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      <span>{config.text.delete}</span>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

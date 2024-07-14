"use client";
import { toggle_user } from "@/public/script/store";
import {
  api,
  alert_msg,
  file_info,
  date,
  fix_date,
  get_session,
  print,
} from "@/public/script/public";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/app/component/loader";
import Activity from "./activity";
export default function Account() {
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const input = useRef();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(config.user.user);
  const [activity, setActivity] = useState([]);
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState("");

  const get_data = async () => {
    try {
      // جلب التوكن
      const userSession = get_session("user");
      const accessToken = userSession?.access_token;
      // التحقق من وجود التوكن
      if (!accessToken) {
        throw new Error("Access token is missing!");
      }

      // جلب البيانات من السيرفر
      const response = await fetch(
        "https://dailycard.future-developers.cloud/api/user/show",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // استخدام التوكن في الهيدر
          },
        }
      );

      // التحقق من استجابة السيرفر
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      // تحويل استجابة السيرفر إلى JSON
      const user = await response.json();

      // إعداد البيانات المسترجعة
      let userData = {
        ...user.data,
        logged: true,
        update: date(),
        access_token: accessToken,
      };

      // تسجيل البيانات في وحدة التحكم

      // تحديث الحالة والواجهة
      setData(userData);
      dispatch(toggle_user(userData));
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const save_data = async (e) => {
    let dataCreate;

    dataCreate = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      username: data.username,
      country: data.country,
    };

    e.preventDefault();
    setLoader(true);
    const response = await api("admin/user/update", dataCreate);
    // console.log(response);
    setLoader(false);

    if (response.status === "success" && response.data) {
      alert_msg(config.text.account_successfully);
      let user = {
        ...response.data,
        logged: true,
        update: date(),
        access_token: config.user?.access_token,
      };
      setData(user);
      dispatch(toggle_user(user));
      setTab(0);
      document.title = `${config.text.account} | ${response.data.name || ""}`;
    } else if (response.status === "exists")
      alert_msg(config.text.email_exists, "error");
    else alert_msg(config.text.alert_error, "error");
  };

  const change_password = async (e) => {
    const dataPassword = {
      password: data.password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    };

    e.preventDefault();
    if (data.new_password !== data.new_password_confirmation)
      return alert_msg(config.text.password_not_equal, "error");
    // if (data.password === data.old_password)
    //   return alert_msg(config.text.password_not_match, "error");

    setLoader(true);

    await fetch(
      "https://dailycard.future-developers.cloud/api/user/update/password",
      {
        method: "POST",
        body: JSON.stringify(dataPassword),
        headers: {
          "Content-Type": "application/json",
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
        setLoader(false);
        if (response.status === "success") {
          alert_msg(config.text.password_successfully);
          //   setData({
          //     ...data,
          //     password: "",
          //     new_password: "",
          //     new_password_confirmation: "",
          //   });
          setTab(0);
        } else if (response.errors) {
          if (response.errors.password)
            alert_msg(config.text.password_not_equal, "error");
          if (response.errors.old_password)
            alert_msg(config.text.error_password_old, "error");
        } else alert_msg(config.text.alert_error, "error");
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const change_image = (e) => {
    let f = e.target.files[0];
    if (!f) return;
    var fr = new FileReader();
    fr.readAsDataURL(f);
    fr.onload = () => {
      let type = file_info(f, "type");
      if (type !== "image") return alert_msg(config.text.error_format, "error");
      setData({ ...data, avatar: f });
      setImage(fr.result);
      uploadImage(f); // Call the function to upload the image
    };
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    fetch("https://dailycard.future-developers.cloud/api/user/edit-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${get_session("user")?.access_token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('Success:', data);
        // Handle success - perhaps update the UI or show a success message
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error - perhaps show an error message to the user
      });
  };

  useEffect(() => {
    document.title = `${
      config.text.account || get_session("text")?.account
    } | ${get_session("user").name || ""}`;
    setData(get_session("user")?.user || {});
    setImage(
      `${get_session("user")?.user?.avatar || get_session("user")?.avatar}`
    );
    get_data();
  }, []);

  // console.log(data?.name)

  return (
    <div className="relative mt-[-.5rem] min-h-[30rem]">
      <ul className="no-select mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
        <li className="inline-block">
          <a
            onClick={() => setTab(0)}
            className={`set-text pointer flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
              tab === 0 && "!border-primary text-primary"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M4.97883 9.68508C2.99294 8.89073 2 8.49355 2 8C2 7.50645 2.99294 7.10927 4.97883 6.31492L7.7873 5.19153C9.77318 4.39718 10.7661 4 12 4C13.2339 4 14.2268 4.39718 16.2127 5.19153L19.0212 6.31492C21.0071 7.10927 22 7.50645 22 8C22 8.49355 21.0071 8.89073 19.0212 9.68508L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L4.97883 9.68508Z"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
              <path
                d="M22 12C22 12 21.0071 12.8907 19.0212 13.6851L16.2127 14.8085C14.2268 15.6028 13.2339 16 12 16C10.7661 16 9.77318 15.6028 7.7873 14.8085L4.97883 13.6851C2.99294 12.8907 2 12 2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
              <path
                d="M22 16C22 16 21.0071 16.8907 19.0212 17.6851L16.2127 18.8085C14.2268 19.6028 13.2339 20 12 20C10.7661 20 9.77318 19.6028 7.7873 18.8085L4.97883 17.6851C2.99294 16.8907 2 16 2 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </svg>
            <span>{config.text.details}</span>
          </a>
        </li>
        {/* <li className="inline-block">
          <a
            onClick={() => setTab(2)}
            className={`set-text pointer flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
              tab === 2 && "!border-primary text-primary"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[1px] h-4 w-4"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
              ></circle>
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              ></circle>
              <path
                opacity="0.5"
                d="M15 9L19 5"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
              <path
                opacity="0.5"
                d="M5 19L9 15"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
              <path
                opacity="0.5"
                d="M9 9L5 5"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
              <path
                opacity="0.5"
                d="M19 19L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
            </svg>
            <span>{config.text.activity_logs}</span>
          </a>
        </li> */}
        <li className="inline-block">
          <a
            onClick={() => setTab(1)}
            className={`set-text pointer flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
              tab === 1 && "!border-primary text-primary"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[.3px] h-4.5 w-4.5"
            >
              <path
                opacity="0.5"
                d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                fill="currentColor"
              ></path>
              <path
                d="M8 17C8.55228 17 9 16.5523 9 16C9 15.4477 8.55228 15 8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17Z"
                fill="currentColor"
              ></path>
              <path
                d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                fill="currentColor"
              ></path>
              <path
                d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
                fill="currentColor"
              ></path>
              <path
                d="M6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C17.8174 10.0089 18.3135 10.022 18.75 10.0546V8C18.75 4.27208 15.7279 1.25 12 1.25C8.27208 1.25 5.25 4.27208 5.25 8V10.0546C5.68651 10.022 6.18264 10.0089 6.75 10.0036V8Z"
                fill="currentColor"
              ></path>
            </svg>
            <span>{config.text.passwords}</span>
          </a>
        </li>
      </ul>

      <div className="relative w-full">
        {tab === 0 ? (
          <div className="profile flex flex-wrap items-start justify-between">
            <div className="panel w-[27%]">
              <h5 className="no-select mb-5 text-lg font-semibold">
                {config.text.profile}
              </h5>

              <div className="edit-item-info relative rounded-full">
                <img
                  src={image || "/media/public/user_icon.png"}
                  onError={(e) =>
                    (e.target.src = "/media/public/user_icon.png")
                  }
                  onLoad={(e) =>
                    e.target.src.includes("_icon")
                      ? e.target.classList.add("empty")
                      : e.target.classList.remove("empty")
                  }
                  className="banner-image rounded-full object-cover"
                />

                <div
                  className="add-img-btn pointer absolute flex rounded-full"
                  onClick={() => input.current?.click()}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      opacity="0.5"
                      d="M4 22H20"
                      stroke="#ddd"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M14.6296 2.92142L13.8881 3.66293L7.07106 10.4799C6.60933 10.9416 6.37846 11.1725 6.17992 11.4271C5.94571 11.7273 5.74491 12.0522 5.58107 12.396C5.44219 12.6874 5.33894 12.9972 5.13245 13.6167L4.25745 16.2417L4.04356 16.8833C3.94194 17.1882 4.02128 17.5243 4.2485 17.7515C4.47573 17.9787 4.81182 18.0581 5.11667 17.9564L5.75834 17.7426L8.38334 16.8675L8.3834 16.8675C9.00284 16.6611 9.31256 16.5578 9.60398 16.4189C9.94775 16.2551 10.2727 16.0543 10.5729 15.8201C10.8275 15.6215 11.0583 15.3907 11.5201 14.929L11.5201 14.9289L18.3371 8.11195L19.0786 7.37044C20.3071 6.14188 20.3071 4.14999 19.0786 2.92142C17.85 1.69286 15.8581 1.69286 14.6296 2.92142Z"
                      stroke="#ddd"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      opacity="0.5"
                      d="M13.8879 3.66406C13.8879 3.66406 13.9806 5.23976 15.3709 6.63008C16.7613 8.0204 18.337 8.11308 18.337 8.11308M5.75821 17.7437L4.25732 16.2428"
                      stroke="#ddd"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </div>

                <input
                  type="file"
                  ref={input}
                  onChange={change_image}
                  className="hidden"
                />
              </div>

              <p className="default text-center text-[1.3rem] tracking-wide">
                {config.user?.name || config.user?.user?.name || "notfound"}
              </p>

              <ul className="mb-[2.9rem] mt-6 flex flex-col space-y-4 font-semibold">
                <div className="mb-2 h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>

                <li className="default flex gap-5 pt-[.7rem]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white-dark"
                  >
                    <path
                      d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"
                      fill="currentColor"
                    ></path>
                    <path
                      opacity="0.5"
                      d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="text-[.95rem]">{config.user.email}</span>
                </li>
                <li className="default flex gap-5 pt-[.3rem]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white-dark"
                  >
                    <path
                      d="M16.1007 13.359L16.5562 12.9062C17.1858 12.2801 18.1672 12.1515 18.9728 12.5894L20.8833 13.628C22.1102 14.2949 22.3806 15.9295 21.4217 16.883L20.0011 18.2954C19.6399 18.6546 19.1917 18.9171 18.6763 18.9651M4.00289 5.74561C3.96765 5.12559 4.25823 4.56668 4.69185 4.13552L6.26145 2.57483C7.13596 1.70529 8.61028 1.83992 9.37326 2.85908L10.6342 4.54348C11.2507 5.36691 11.1841 6.49484 10.4775 7.19738L10.1907 7.48257"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      opacity="0.5"
                      d="M18.6763 18.9651C17.0469 19.117 13.0622 18.9492 8.8154 14.7266C4.81076 10.7447 4.09308 7.33182 4.00293 5.74561"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      opacity="0.5"
                      d="M16.1007 13.3589C16.1007 13.3589 15.0181 14.4353 12.0631 11.4971C9.10807 8.55886 10.1907 7.48242 10.1907 7.48242"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{config.user.phone || config.user?.user?.phone}</span>
                </li>

                <li className="default flex gap-5 pt-[.3rem]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white-dark"
                  >
                    <path
                      opacity="0.5"
                      d="M19.7165 20.3624C21.143 19.5846 22 18.5873 22 17.5C22 16.3475 21.0372 15.2961 19.4537 14.5C17.6226 13.5794 14.9617 13 12 13C9.03833 13 6.37738 13.5794 4.54631 14.5C2.96285 15.2961 2 16.3475 2 17.5C2 18.6525 2.96285 19.7039 4.54631 20.5C6.37738 21.4206 9.03833 22 12 22C15.1066 22 17.8823 21.3625 19.7165 20.3624Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>{fix_date(config.user?.created_at)}</span>
                </li>
              </ul>
            </div>

            <div className="panel w-[71.5%] lg:col-span-2 xl:col-span-3">
              <h5 className="no-select mb-7 text-lg font-semibold">
                {config.text.general_information}
              </h5>

              <form
                className="mb-2 grid flex-1 grid-cols-1 gap-6 pr-3 sm:grid-cols-2"
                onSubmit={save_data}
              >
                <div>
                  <label htmlFor="name" className="mb-3">
                    {config.text.full_name}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={data?.name || ""}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-3">
                    {config.text.phone}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={data?.phone || ""}
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-3">
                    {config.text.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data?.email || ""}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="country" className="mb-3">
                      {config.text.country}
                    </label>
                    <select
                      id="country"
                      value={data?.country || "su"}
                      onChange={(e) =>
                        setData({ ...data, country: e.target.value })
                      }
                      className="pointer form-select"
                    >
                      <option value="su">Saudi Arabian</option>
                      <option value="eg">Egypt</option>
                      <option value="us">United state</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>
                  {/* <div>
                    <label htmlFor="age" className="mb-3">
                      {config.text.age}
                    </label>
                    <input
                      id="age"
                      type="number"
                      min="0"
                      value={data?.age || 0}
                      onChange={(e) =>
                        setData({ ...data, age: e.target.value })
                      }
                      className="form-input"
                      autoComplete="off"
                    />
                  </div> */}
                  <div>
                    <label htmlFor="date" className="mb-3">
                      {config.text.login_date}
                    </label>
                    <input
                      id="date"
                      type="text"
                      value={fix_date(data?.login_at)}
                      readOnly
                      className="default form-input"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* <div>
                    <label htmlFor="city" className="mb-3">
                      {config.text.city}
                    </label>
                    <select
                      id="city"
                      value={data?.city || "makka"}
                      onChange={(e) =>
                        setData({ ...data, city: e.target.value })
                      }
                      className="pointer form-select"
                    >
                      <option value="makka">Makkah</option>
                      <option value="gadda">Gadda</option>
                      <option value="ryad">Ryiad</option>
                      <option value="benha">Benha</option>
                      <option value="cairo">Cairo</option>
                    </select>
                  </div> */}
                </div>
                {/* <div>
                  <label htmlFor="language" className="mb-3">
                    {config.text.language}
                  </label>
                  <select
                    id="language"
                    value={data?.language || "ar"}
                    onChange={(e) =>
                      setData({ ...data, language: e.target.value })
                    }
                    className="pointer form-select"
                  >
                    <option value="ar">Arabic</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="it">Italian</option>
                  </select>
                </div> */}

                <div className="flex justify-end sm:col-span-2">
                  <button
                    type="submit"
                    className="btn btn-primary h-[2.7rem] w-[10rem] text-[.9rem] tracking-wide"
                  >
                    {config.text.update}
                  </button>
                </div>
              </form>

              {loader && <Loader />}
            </div>
          </div>
        ) : tab === 1 ? (
          <div className="profile flex items-center justify-center">
            <div className="panel mt-7 w-[40rem] lg:col-span-2 xl:col-span-3">
              <h5 className="no-select mb-7 text-lg font-semibold">
                {config.text.change_password}
              </h5>

              <form
                className="mb-2 grid flex-1 grid-cols-1 gap-6 pb-2 pt-5 sm:grid-cols-2"
                onSubmit={change_password}
              >
                <div className="mb-2">
                  <label htmlFor="old_password" className="mb-3">
                    {config.text.old_password}
                  </label>
                  <input
                    id="old_password"
                    type="password"
                    // value={ ""}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="password" className="mb-3">
                    {config.text.new_password}
                  </label>
                  <input
                    id="password"
                    type="password"
                    // value={ ""}
                    onChange={(e) =>
                      setData({ ...data, new_password: e.target.value })
                    }
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="password_confirmation" className="mb-3">
                    {config.text.confirm_password}
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    // value={ ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mt-3 flex justify-end sm:col-span-2">
                  <button
                    type="submit"
                    className="btn btn-primary h-[2.7rem] w-[10rem] text-[.9rem] tracking-wide"
                  >
                    {config.text.submit}
                  </button>
                </div>
              </form>

              {loader && <Loader />}
            </div>
          </div>
        ) : (
          <Activity activity={activity} setActivity={setActivity} />
        )}
      </div>
    </div>
  );
}

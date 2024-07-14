"use client";
import { file_info, alert_msg, host, print } from "@/public/script/public";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Files({ data, setData, multiple, user, blog }) {
  const config = useSelector((state) => state.config);
  const inputFile = useRef(null);
  const [swiper, setSwiper] = useState(null);
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState("");

  const add_file = (e) => {
    if (!e.target.files.length) return;

    Array.from(e.target.files).forEach((f) => {
      var fr = new FileReader();
      fr.readAsDataURL(f);

      fr.onload = () => {
        let name = file_info(f, "name");
        let size = file_info(f, "size");
        let type = file_info(f, "type");
        let ext = file_info(f, "ext");
        if (type !== "image" && type !== "video")
          return alert_msg(config.text.error_format, "error");

        let _files_ = files;
        _files_.push([type, fr.result]);
        setFiles(_files_);
        setIndex(_files_.length);
        setTimeout(() => swiper.slideTo(_files_.length - 1), 100);

        let new_files = data.avatr || [];
        new_files.push({
          file: f,
          name: name,
          type: type,
          size: size,
          ext: ext,
        });
        setData({ ...data, avatar: new_files });
      };
    });

    inputFile.current.value = "";
  };
  const del_file = (index, id) => {
    let _files_ = files.slice(0, index).concat(files.slice(index + 1));
    setFiles(_files_);

    let _new_files_ = data.avatar
      .slice(0, index)
      .concat(data.new_files.slice(index + 1));
    setData({ ...data, avatar: _new_files_ });
    if (id) setData({ ...data, deleted_files: [...data.deleted_files, id] });
  };

  const change_image = (e) => {
    let f = e.target.files[0];
    if (!f) return;
    var fr = new FileReader();
    fr.readAsDataURL(f);

    fr.onload = () => {
      let type = file_info(f, "type");
      let ext = file_info(f, "ext");
      if (type !== "image") return alert_msg(config.text.error_format, "error");
      setImage(fr.result);
      setData({ ...data, avatar: f, ext: ext });
    };
  };

  const layout = () => {
    try {
      let width = document.querySelector(".image-banner").offsetWidth;
      document.querySelector(".swiper").style.maxWidth = `${width}px`;
    } catch (e) {}
  };
  useEffect(() => {
    if (multiple) {
      setData({ ...data, new_files: [], deleted_files: [] });
      if (blog)
        setFiles(
          data.files?.map((_) => [_[0], `${host}/B${_[1]}`, _[1]]) || []
        );
      else
        setFiles(
          data.files?.map((_) => [_[0], `${host}/P${_[1]}`, _[1]]) || []
        );
      setIndex(data.files?.length ? 1 : 0);
      setTimeout(layout, 500);
      window.addEventListener("click", function (e) {
        setTimeout(layout, 200);
      });
    } else {
      const imageUrl = data?.avatar || data?.image || data?.photo || "";
      setImage(imageUrl);
    }
  }, []);

  return (
    <Fragment>
      {multiple ? (
        <div className="mb-6 w-full px-4">
          <div className="over-hidden image-banner for-ar relative flex w-full shrink-0 items-center text-black dark:text-white">
            <Swiper
              modules={[Navigation]}
              navigation={true}
              onSwiper={setSwiper}
              onSlideChange={(e) => setIndex(e.realIndex + 1)}
            >
              {files.length ? (
                files.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item[0] === "image" ? (
                      <img
                        src={item[1]}
                        onError={(e) =>
                          (e.target.src = "/media/public/error_icon.png")
                        }
                      />
                    ) : (
                      <video src={item[1]} controls></video>
                    )}

                    <div className="actions absolute">
                      <a href={item[1]} download target="_blank">
                        <span className="material-symbols-outlined icon">
                          arrow_downward
                        </span>
                      </a>

                      <a
                        onClick={() =>
                          item.length > 2
                            ? del_file(index, item[2])
                            : del_file(index)
                        }
                      >
                        <span className="material-symbols-outlined icon">
                          close
                        </span>
                      </a>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img src="/media/public/error_icon.png" className="empty" />
                </SwiperSlide>
              )}
            </Swiper>
          </div>

          <div className="files-banner no-select mt-5 flex w-full flex-wrap items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                type="button"
                className="btn btn-primary add-img-btn"
                onClick={() => inputFile.current.click()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-5 ltr:mr-2 rtl:ml-2"
                >
                  <path
                    d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 16V3M12 3L16 7.375M12 3L8 7.375"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>

                <span>{config.text.upload_file}</span>
              </button>
            </div>

            <div className="banner-index">
              <span className="current-index">{files.length ? index : 0}</span>{" "}
              /<span className="count-sliders px-1">{files.length}</span>
              <span>{config.text.files}</span>
            </div>

            <input
              type="file"
              ref={inputFile}
              onChange={add_file}
              className="hidden"
              multiple
            />
          </div>
        </div>
      ) : (
        <div
          className={`over-hidden banner relative flex shrink-0 items-center text-black dark:text-white ${
            user ? "user-banner" : ""
          }`}
        >
          <div className="image layer-div">
            <img
              src={image}
              className="banner-image"
              onLoad={(e) =>
                e.target.src.includes("_icon")
                  ? e.target.classList.add("empty")
                  : e.target.classList.remove("empty")
              }
              onError={(e) =>
                (e.target.src = `/media/public/${
                  user ? "user" : "error"
                }_icon.png`)
              }
            />
          </div>

          <div
            className="edit-image add-img-btn pointer absolute flex"
            onClick={() => inputFile.current?.click()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
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

            <span className="mt-2">{config.text.edit}</span>
          </div>

          <input
            type="file"
            ref={inputFile}
            onChange={change_image}
            className="hidden"
          />
        </div>
      )}
    </Fragment>
  );
}

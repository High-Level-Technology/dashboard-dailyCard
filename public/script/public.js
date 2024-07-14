import CryptoJS from "./crypto";
import Swal from "sweetalert2";
export const api_host = "https://dailycard.future-developers.cloud";
export const host = "https://dailycard.future-developers.cloud/storage/profile";

export function sound(src, vol) {
  const audio = new Audio();
  audio.pause();
  audio.src = `/media/public/${src}.wav`;
  audio.volume = vol || 1;
  audio.play();
}
export function bootstrap() {
  const styling = (e) => {
    const px_rm = (_) => {
      if (
        !_.endsWith("px") &&
        !_.endsWith("rem") &&
        !_.endsWith("em") &&
        !_.endsWith("%")
      )
        _ += "px";
      return _;
    };
    const family = (_) => {
      _ = _.split("-").slice(1);
      if (_.length > 1) return _.join("-");
      _ = _[0];
      let font = "";
      if (_.includes("_")) {
        _.split("_").forEach((c) => {
          font += `${c} `;
        });
        font = font.slice(0, -1);
      } else font = _;
      return font;
    };
    const set_css = (classes, el) => {
      classes.split(" ").forEach((_) => {
        if (_.startsWith("l-"))
          el.style.cssText = `left: ${px_rm(_.split("-")[1])}; right: auto;`;
        if (_.startsWith("r-"))
          el.style.cssText = `right: ${px_rm(_.split("-")[1])}; left: auto;`;
        if (_.startsWith("t-"))
          el.style.cssText = `top: ${px_rm(_.split("-")[1])}; bottom: auto;`;
        if (_.startsWith("b-"))
          el.style.cssText = `bottom: ${px_rm(_.split("-")[1])}; top: auto;`;
        if (_.startsWith("pl-"))
          el.style.cssText = `padding-left: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("pr-"))
          el.style.cssText = `padding-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("plr-"))
          el.style.cssText = `padding-left: ${px_rm(
            _.split("-")[1]
          )}; padding-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("prl-"))
          el.style.cssText = `padding-left: ${px_rm(
            _.split("-")[1]
          )}; padding-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("pt-"))
          el.style.cssText = `padding-top: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("pb-"))
          el.style.cssText = `padding-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("ptb-"))
          el.style.cssText = `padding-top: ${px_rm(
            _.split("-")[1]
          )}; padding-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("pbt-"))
          el.style.cssText = `padding-top: ${px_rm(
            _.split("-")[1]
          )}; padding-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("p-"))
          el.style.cssText = `padding: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("ml-"))
          el.style.cssText = `margin-left: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mr-"))
          el.style.cssText = `margin-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mlr-"))
          el.style.cssText = `margin-left: ${px_rm(
            _.split("-")[1]
          )}; margin-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mrl-"))
          el.style.cssText = `margin-left: ${px_rm(
            _.split("-")[1]
          )}; margin-right: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mt-"))
          el.style.cssText = `margin-top: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mb-"))
          el.style.cssText = `margin-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mtb-"))
          el.style.cssText = `margin-top: ${px_rm(
            _.split("-")[1]
          )}; margin-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("mbt-"))
          el.style.cssText = `margin-top: ${px_rm(
            _.split("-")[1]
          )}; margin-bottom: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("m-"))
          el.style.cssText = `margin: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("w-"))
          el.style.cssText = `width: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("maxw-"))
          el.style.cssText = `max-width: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("minw-"))
          el.style.cssText = `min-width: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("h-"))
          el.style.cssText = `height: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("maxh-"))
          el.style.cssText = `max-height: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("minh-"))
          el.style.cssText = `min-height: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("size-"))
          el.style.cssText = `font-size: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("family-"))
          el.style.cssText = `font-family: ${family(_)}`;
        if (_.startsWith("radius-"))
          el.style.cssText = `border-radius: ${px_rm(_.split("-")[1])}`;
        if (_.startsWith("back-"))
          el.style.cssText = `background: ${_.split("-")[1]}`;
        if (_.startsWith("color-"))
          el.style.cssText = `color: ${_.split("-")[1]}`;
        if (_.startsWith("transition-"))
          el.style.cssText = `transition: all ${px_rm(_.split("-")[1])} linear`;
        if (_.startsWith("cursor-"))
          el.style.cssText = `cursor: ${_.split("-")[1]}`;
        if (_.startsWith("z-"))
          el.style.cssText = `z-index: ${_.split("-")[1]}`;
        if (_.startsWith("backdropFilter-"))
          el.style.cssText = `backdrop-filter: ${_.split("-")[1]}`;
      });
    };

    let data_child = e.getAttribute("data-child");
    let classes = e.getAttribute("class");
    if (classes) set_css(classes, e);
    if (data_child)
      Array.from(e.children).forEach((_) => set_css(data_child, _));
  };
  document.querySelectorAll("*").forEach(() => {
    styling(_);
  });
}
export function set_session(key, value, local = true) {
  value = value ? JSON.stringify(value) : "";
  value = CryptoJS.AES.encrypt(value, "Coding Master").toString();
  if (local) localStorage.setItem(key, value);
  else sessionStorage.setItem(key, value);
}
export function get_session(key, local = true) {
  let value = localStorage.getItem(key);
  if (!local) value = sessionStorage.getItem(key);
  if (!value) return value;
  value = CryptoJS.AES.decrypt(value, "Coding Master").toString(
    CryptoJS.enc.Utf8
  );
  return value ? JSON.parse(value) : value;
}
export function remove_session(key, local = true) {
  if (local) localStorage.removeItem(key);
  else sessionStorage.removeItem(key);
}
export function print(..._) {
  console.log(..._);
}
export function position(element, query) {
  if (query === "top") return element.offsetTop;

  if (query === "bottom") return window.outerHeight - element.offsetTop;

  if (query === "left") return element.offsetLeft;
  else if (query === "right") return window.outerWidth - element.offsetLeft;
  else return [element.offsetTop, element.offsetLeft];
}
export function cookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
}
export async function api(url, data, method) {
  url = url ? `${api_host}/api/${url}` : "";
  data = data ? data : { host: location.host };
  method = method ? method.toUpperCase() : "POST";

  async function _get_() {
    const response = await fetch(url);
    let res = await response.text();
    try {
      return JSON.parse(res);
    } catch (e) {
      return res;
    }
  }
  async function _other_(token) {
    let form = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) {
        form.append(key, data[key]);
      }
    });
    const response = await fetch(url, {
      method: method,
      body: form,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });
    let res = await response.text();
    try {
      return JSON.parse(res);
    } catch (e) {
      return res;
    }
  }

  if (method === "GET")
    try {
      return await _get_();
    } catch (e) {}
  try {
    return await _other_(get_session("user")?.access_token);
  } catch (e) {}

  return false;
}

export function query(query) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[query] ? params[query] : params;
}
export function date(query, _) {
  query = query ? query.toLowerCase().replace(/\s+/g, "") : "full";
  var cur_date = _ ? new Date(_.toString().trim()) : new Date();
  let Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let Days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let Mon_name = Months[cur_date.getMonth()];
  let Day_name = Days[cur_date.getDay()];
  let Week_day = cur_date.getDay();
  let years = cur_date.getFullYear();
  let months = cur_date.getMonth() + 1;
  let days = cur_date.getDate();
  let hours = cur_date.getHours();
  let hrs = cur_date.getHours();
  let minutes = cur_date.getMinutes();
  let seconds = cur_date.getSeconds();
  let p = cur_date.getHours() > 12 ? "PM" : "AM";

  hrs = hrs > 12 ? hrs - 12 : hrs;
  hrs = hrs === 0 ? 12 : hrs < 10 ? `0${hrs}` : `${hrs}`;
  years = years < 10 ? `0${years}` : `${years}`;
  months = months < 10 ? `0${months}` : `${months}`;
  days = days < 10 ? `0${days}` : `${days}`;
  hours = hours < 10 ? `0${hours}` : `${hours}`;
  minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (query === "y") return cur_date.getFullYear();
  else if (query === "m") return cur_date.getMonth() + 1;
  else if (query === "d") return cur_date.getDate();
  else if (query === "h") return cur_date.getHours();
  else if (query === "mi") return cur_date.getMinutes();
  else if (query === "s") return cur_date.getSeconds();
  else if ("years".includes(query)) return cur_date.getFullYear();
  else if ("months".includes(query)) return cur_date.getMonth() + 1;
  else if ("days".includes(query)) return cur_date.getDate();
  else if ("hours".includes(query)) return cur_date.getHours();
  else if ("minutes".includes(query)) return cur_date.getMinutes();
  else if ("seconds".includes(query)) return cur_date.getSeconds();
  else if ("weekdays".includes(query)) return cur_date.getDay();
  else if ("ps".includes(query)) return p;
  else if ("month_lists".includes(query)) return Months;
  else if ("mon_lists".includes(query)) return Months.map((_) => _.slice(0, 3));
  else if ("day_lists".includes(query)) return Days;
  else if ("d_lists".includes(query)) return Days.map((_) => _.slice(0, 3));
  else if ("day_names".includes(query)) return Day_name;
  else if ("d_names".includes(query)) return Day_name.slice(0, 3);
  else if ("month_names".includes(query)) return Mon_name;
  else if ("mon_names".includes(query)) return Mon_name.slice(0, 3);
  else if ("week_days".includes(query)) return Week_day;
  else if ("dates".includes(query)) return `${years}-${months}-${days}`;
  else if ("times".includes(query)) return `${hours}:${minutes}:${seconds}`;
  else if ("dts".includes(query))
    return `${years}-${months}-${days} ${hrs}:${minutes} ${p}`;
  else if ("datetimes".includes(query))
    return `${years}-${months}-${days} ${hrs}:${minutes}:${seconds} ${p}`;
  else if ("todays".includes(query))
    return `${Days[Week_day]}, ${Months[months - 1].slice(0, 3)} ${days.replace(
      /^0/,
      ""
    )}, ${years}`;
  return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`;
}
export function diff_date(start, end) {
  start = start ? new Date(start) : new Date();
  end = end ? new Date(end) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}
export function file_info(File, query) {
  query = query ? query.toLowerCase() : "";
  if (!File) return "";
  let Size = File["size"];
  let Real_Size = File["size"];
  let Name = File["name"].split(".").slice(0, -1).join(".");
  let Type = File["type"].split("/")[0];
  let Extention = File["name"].split(".").slice(-1)[0];
  let LastModifiedDate = File["lastModifiedDate"];

  if (!File["type"]) Extention = "";
  if (Size < 1000) Size = `${Size} Byte`;
  else if (Size >= 1000 && Size < 1000000)
    Size = `${(Size / 1000).toFixed(2)} KB`;
  else if (Size >= 1000000 && Size < 1000000000)
    Size = `${(Size / 1000000).toFixed(2)} MB`;
  else if (Size >= 1000000000 && Size < 1000000000000)
    Size = `${(Size / 1000000000).toFixed(2)} GB`;
  else Size = `${(Size / 1000000000000).toFixed(2)} TB`;

  Type = Type === "image" ? "image" : Type === "video" ? "video" : "file";
  Extention = Extention || "png";
  if (query === "size") return Size;
  else if (query === "real_size") return Real_Size;
  else if (query === "name") return Name;
  else if (query === "type") return Type;
  else if (query === "ext") return Extention;
  else if (query === "last_modify") return LastModifiedDate;
  return File;
}
export function image_ext(ext) {
  let list_ = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "apng",
    "ico",
    "avif",
    "jfif",
    "pjpeg",
    "pjp",
    "webp",
    "bmp",
    "eps",
  ];

  return list_.includes(ext.toString().toLowerCase()) ? ext : "png";
}
export function full_screen() {
  (document.fullScreenElement && null !== document.fullScreenElement) ||
  (!document.mozFullScreen && !document.webkitIsFullScreen)
    ? document.documentElement.requestFullScreen
      ? document.documentElement.requestFullScreen()
      : document.documentElement.mozRequestFullScreen
      ? document.documentElement.mozRequestFullScreen()
      : document.documentElement.webkitRequestFullScreen &&
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
    : document.cancelFullScreen
    ? document.cancelFullScreen()
    : document.mozCancelFullScreen
    ? document.mozCancelFullScreen()
    : document.webkitCancelFullScreen && document.webkitCancelFullScreen();
}
export function get(_) {
  return document.querySelector(_);
}
export function get_all(_) {
  return document.querySelectorAll(_);
}
export function check_hidden(_) {
  return document.querySelector(_).style.display === "none";
}
export function check_class(el, class_name, check_parent = true) {
  if (!el) return false;
  let same = false;

  class_name.split(" ").forEach((_) => {
    if (check_parent) {
      if (el.classList.contains(_) || el.closest(`.${_}`)) same = true;
    } else {
      if (el.classList.contains(_)) same = true;
    }
  });

  return same;
}
export function lower(str) {
  return str ? str.toString().toLowerCase() : "";
}
export function upper(str) {
  return str ? str.toString().toUpperCase() : "";
}
export function capitalize(str) {
  if (!str) return "";
  str = lower(str);
  return str.replace(str.slice(0, 1), upper(str.slice(0, 1)));
}
export function title(str) {
  if (!str) return "";
  str = lower(str);
  return str
    .split(" ")
    .map((_) => capitalize(_))
    .join(" ");
}
export function trim(str) {
  return str ? str.toString().trim() : "";
}
export function no_space(str) {
  return str ? str.toString().replace(/\s+/g, "") : "";
}
export function int(_) {
  return parseInt(_) || 0;
}
export function float(_) {
  return parseFloat(_) || 0.0;
}
export function round(num, _) {
  if (!_) return parseInt(num) || 0;

  return parseFloat(num).toFixed(_);
}
export function language() {
  let lang = navigator.language || navigator.userLanguage || "en";
  lang = lang.split("-")[0].toLowerCase();
  return lang;
}
export function filter_item(list, id) {
  let item = list?.filter((_) => _.id == id) || [];
  item = item.length ? item[0] : {};
  return item;
}
export function matching(val1, val2) {
  val1 = val1 ? val1.toString().toLowerCase().trim().replace(/\s+/g, "") : "";
  val2 = val2 ? val2.toString().toLowerCase().trim().replace(/\s+/g, "") : "";
  return `${val1}s`.includes(val2);
}
export function unique(list) {
  let list1 = [];
  list.forEach((_) => !list1.includes(_) && list1.push(_));
  return list1;
}
export function fix_number(num, float) {
  num = num || 0;
  num = num.toString().split(".");
  let decimal = num[1] || 0;
  let text = num[0].split("").reverse();
  let number = "";
  text.forEach((_, i) => {
    number += _;
    if ((i + 1) % 3 === 0 && i < text.length - 1) number += ",";
  });
  number = number.split("").reverse().join("");
  if (float)
    return `${number}.${decimal ? decimal.toString().slice(0, 2) : "00"}`;
  return `${number}${decimal ? `.${decimal.toString().slice(0, 2)}` : ""}`;
}
export function fix_time(dt) {
  let hours = parseInt(dt?.split(" ")[1]?.split(":")?.slice(0, 2)[0] || 0);
  let minutes = parseInt(dt?.split(" ")[1]?.split(":")?.slice(0, 2)[1] || 0);
  let p = "AM";

  if (hours > 10) {
    hours -= 12;
    p = "PM";
  }
  if (hours === 0) {
    hours = 12;
    p = "AM";
  }

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${p}`;
}
export function fix_date(dt, time) {
  let today = `${date("year")}-${date("month")}-${date("day")} 0:0:0`;
  let diff = new Date(today).getTime() - new Date(dt).getTime();

  if (diff <= 0) {
    if (time) return fix_time(dt);
    else return get_session("text")["today"];
  } else if (Math.floor(diff / 1000 / 60 / 60) < 24)
    return get_session("text")["yasterday"];
  else dt = dt?.split(" ")[0];
  return dt;
}

export function alert_msg(msg, type) {
  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: "no-select toast" },
  });

  toast.fire({
    icon: type || "success",
    title: msg || "",
  });
}

export function confirm_deletion(title, callback) {
  Swal.fire({
    title: `Are you sure to delete the ${title}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
      // alert_msg('تم حذف المستخدم بنجاح', 'success');
    } else {
      alert_msg("تم إلغاء الحذف", "info");
    }
  });
}

export function copy(text) {
  navigator.clipboard.writeText(text);
}

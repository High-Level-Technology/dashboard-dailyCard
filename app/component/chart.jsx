"use client";
import { fix_number, date, print, lower } from "@/public/script/public";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Dropdown from "@/app/component/menu";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Chart({
  statistics,
  frame,
  type,
  label,
  color,
  light,
  title,
  total,
  series,
  height,
  icon,
  onChange,
  summary,
}) {
  const config = useSelector((state) => state.config);
  const [mounted, setMounted] = useState(false);
  const [chart, setChart] = useState({});

  const area = {
    series: [
      {
        name: label,
        data: series
          ? series.filter((_) => _ > 0).length
            ? series
            : [1, 1, 1, 1, 1, 1, 1]
          : [1, 1, 1, 1, 1, 1, 1],
      },
    ],
    options: {
      chart: {
        type: "area",
        fontFamily: "Nunito, sans-serif",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: [
        color === "danger"
          ? "#e7515a"
          : color === "info"
          ? "#4361ee"
          : color === "warning"
          ? "#e2a03f"
          : color === "secondary"
          ? "#9e45ae"
          : color === "success" && light
          ? "#36d2a1"
          : "#00ab55",
      ],
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      yaxis: {
        min: 0,
        show: false,
      },
      grid: {
        padding: {
          top: series ? (series.filter((_) => _ > 0).length ? 110 : 170) : 170,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      fill: {
        opacity: 1,
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [100, 100],
        },
      },
      tooltip: {
        x: {
          show: false,
        },
      },
    },
  };
  const revenue = {
    series: statistics?.length
      ? statistics
      : [{ name: "", data: [0, 0, 0, 0, 0, 0, 0] }],
    options: {
      chart: {
        type: "area",
        fontFamily: "Nunito, sans-serif",
        zoom: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 2,
        lineCap: "square",
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: ["#00ab55", "#e2a03f", "#2196F3", "#E7515A"],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: "#1B55E2",
            strokeColor: "transparent",
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: "#E7515A",
            strokeColor: "transparent",
            size: 7,
          },
        ],
      },
      labels:
        frame === "daily"
          ? [
              ...date("d_list").slice(date("week_day") + 1),
              ...date("d_list").slice(0, date("week_day") + 1),
            ]
          : frame === "weekly"
          ? ["I", "II", "III", "IV", "V", "VI", "VII"]
          : frame === "monthly"
          ? [
              ...date("mon_list").slice(date("month")),
              ...date("mon_list").slice(0, date("month")),
            ]
          : [
              date("year") - 6,
              date("year") - 5,
              date("year") - 4,
              date("year") - 3,
              date("year") - 2,
              date("year") - 1,
              date("year"),
            ],
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: config.dir === "rtl" ? 2 : 0,
          offsetY: 5,
          style: {
            fontSize: "12px",
            cssClass: "apexcharts-xaxis-title",
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (value) => {
            // return value / 1000 + 'K';
            return parseFloat(value).toFixed(1);
          },
          offsetX: config.dir === "rtl" ? -30 : -10,
          offsetY: 0,
          style: {
            fontSize: "12px",
            cssClass: "apexcharts-yaxis-title",
          },
        },
        opposite: config.dir === "rtl" ? true : false,
      },
      grid: {
        borderColor: config.theme === "dark" ? "#191E3A" : "#E0E6ED",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 10,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "16px",
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: config.theme === "dark" ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: config.theme === "dark" ? [100, 100] : [45, 100],
        },
      },
    },
  };
  const category = {
    series: series || [1],
    options: {
      chart: {
        type: "donut",
        height: 460,
        fontFamily: "Nunito, sans-serif",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: config.theme === "dark" ? "#0e1726" : "#fff",
      },
      colors:
        config.theme === "dark"
          ? ["#5c1ac3", "#e2a03f", "#e7515a", "#e2a03f"]
          : ["#e2a03f", "#5c1ac3", "#e7515a"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "29px",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "26px",
                color: config.theme === "dark" ? "#bfc9d4" : undefined,
                offsetY: 16,
                formatter: (val) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: config.text.total,
                color: "#888ea8",
                fontSize: "29px",
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce(function (a, b) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: label || [""],
      states: {
        hover: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
      },
    },
  };
  useEffect(() => {
    setChart(
      type === "chart" ? revenue : type === "category" ? category : area
    );
  }, [config.theme]);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fragment>
      {mounted && (
        <Fragment>
          {type === "chart" ? (
            <div className="h-full w-full">
              <div className="no-select mb-5 flex items-center justify-between dark:text-white-light">
                <h5 className="text-lg font-semibold">{title}</h5>

                <div className="dropdown">
                  <Dropdown
                    offset={[0, 1]}
                    placement={`${
                      config.dir === "rtl" ? "bottom-start" : "bottom-end"
                    }`}
                    button={
                      <svg
                        className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="5"
                          cy="12"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          opacity="0.5"
                          cx="12"
                          cy="12"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="19"
                          cy="12"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    }
                  >
                    <ul>
                      <li onClick={() => onChange("daily")}>
                        <button type="button">{config.text.daily}</button>
                      </li>
                      <li onClick={() => onChange("weekly")}>
                        <button type="button">{config.text.weekly}</button>
                      </li>
                      <li onClick={() => onChange("monthly")}>
                        <button type="button">{config.text.monthly}</button>
                      </li>
                      <li onClick={() => onChange("yearly")}>
                        <button type="button">{config.text.yearly}</button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
              </div>

              <p className="default text-lg dark:text-white-light/90">
                {label}{" "}
                <span className="mx-2 text-primary ltr:ml-1 rtl:mr-1">
                  {fix_number(summary.balance - summary.profit).replace(
                    /.0+$/,
                    ""
                  )}{" "}
                  {config.text.currency}
                </span>
              </p>

              <div className="relative">
                <div className="rounded-lg bg-white dark:bg-black">
                  <ReactApexChart
                    series={chart.series}
                    options={chart.options}
                    type="area"
                    height={height || 370}
                    width={"100%"}
                  />
                </div>
              </div>
            </div>
          ) : type === "area" ? (
            <div className="panel h-full p-0">
              <div className="absolute flex w-full items-center justify-between p-5">
                <div className="relative">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg opacity-[.8] bg-${color}-light text-${color} dark:bg-${color} dark:text-${color}-light`}
                  >
                    {icon === "product" ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19"
                        />
                        <path
                          opacity="0.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
                        />
                        <path
                          opacity="0.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
                        />
                        <path
                          opacity="0.5"
                          d="M11 9H8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5"
                        />
                      </svg>
                    ) : icon === "order" ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19"
                        />
                        <path
                          opacity="0.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
                        />
                        <path
                          opacity="0.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
                        />
                        <path
                          opacity="0.5"
                          d="M11 9H8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5"
                        />
                      </svg>
                    ) : icon === "coupon" ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 
                                                    7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 
                                                    7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 
                                                    9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 
                                                    12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 
                                                    11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 
                                                    10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 
                                                    9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 
                                                    7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 
                                                    7.02251Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          d="M19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 
                                                    19 9Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 
                                                    20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 
                                                    18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 
                                                    17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 
                                                    15.1102 2.99206 14.5509L5.45575 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 
                                                    17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 
                                                    18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 
                                                    20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 
                                                    15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    ) : icon === "user" ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="6"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M18 9C19.6569 9 21 7.88071 21 6.5C21 5.11929 19.6569 4 18 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          opacity="0.5"
                          d="M6 9C4.34315 9 3 7.88071 3 6.5C3 5.11929 4.34315 4 6 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <ellipse
                          cx="12"
                          cy="17"
                          rx="6"
                          ry="4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M20 19C21.7542 18.6153 23 17.6411 23 16.5C23 15.3589 21.7542 14.3847 20 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          opacity="0.5"
                          d="M4 19C2.24575 18.6153 1 17.6411 1 16.5C1 15.3589 2.24575 14.3847 4 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : icon === "confirm" ? (
                      <svg
                        className="h-7 w-7"
                        viewBox="0 0 256 256"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        opacity=".8"
                      >
                        <g
                          className={`fill-success dark:fill-[#fff]`}
                          fillRule="nonzero"
                          stroke="none"
                          strokeWidth="1"
                          strokeLinecap="butt"
                          strokeLinejoin="miter"
                          strokeMiterlimit="10"
                          strokeDasharray=""
                          strokeDashoffset="0"
                          fontFamily="none"
                          fontWeight="none"
                          fontSize="none"
                          textAnchor="none"
                          style={{ mixBlendMode: "normal" }}
                        >
                          <g transform="scale(5.12,5.12)">
                            <path
                              d="M25,2c-12.69047,0 -23,10.30953 -23,23c0,12.69047 
                                                            10.30953,23 23,23c12.69047,0 23,-10.30953 23,-23c0,-12.69047 -10.30953,-23 -23,-23zM25,4c11.60953,0 
                                                            21,9.39047 21,21c0,11.60953 -9.39047,21 -21,21c-11.60953,0 -21,-9.39047 
                                                            -21,-21c0,-11.60953 9.39047,-21 21,-21zM34.98828,14.98828c-0.3299,0.0065 -0.63536,0.17531 
                                                            -0.81641,0.45117l-10.20117,15.03711l-7.29102,-6.76562c-0.26069,-0.25084 -0.63652,-0.34135 
                                                            -0.98281,-0.23667c-0.3463,0.10468 -0.60907,0.38821 -0.68715,0.74145c-0.07809,0.35324 
                                                            0.04068,0.72112 0.31059,0.96201l8.99609,8.34766l11.51172,-16.96484c0.2153,-0.3085 
                                                            0.23926,-0.71173 0.06201,-1.04356c-0.17725,-0.33183 -0.52573,-0.53612 -0.90186,-0.5287z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    ) : icon === "cancel" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        opacity=".8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.3116 12.6473L20.8293 10.7154C21.4335 8.46034 21.7356 7.3328 21.5081 6.35703C21.3285 5.58657 
                                                    20.9244 4.88668 20.347 4.34587C19.6157 3.66095 18.4881 3.35883 16.2331 2.75458C13.978 2.15033 12.8504 
                                                    1.84821 11.8747 2.07573C11.1042 2.25537 10.4043 2.65945 9.86351 3.23687C9.27709 3.86298 8.97128 4.77957 
                                                    8.51621 6.44561C8.43979 6.7254 8.35915 7.02633 8.27227 7.35057L8.27222 7.35077L7.75458 9.28263C7.15033 
                                                    11.5377 6.84821 12.6652 7.07573 13.641C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 
                                                    10.0957 16.6392 12.3508 17.2435L12.3508 17.2435C14.3834 17.7881 15.4999 18.0873 16.415 17.9744C16.5152 
                                                    17.9621 16.6129 17.9448 16.7092 17.9223C17.4796 17.7427 18.1795 17.3386 18.7203 16.7612C19.4052 16.0299 
                                                    19.7074 14.9024 20.3116 12.6473Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M16.415 17.9741C16.2065 18.6126 15.8399 19.1902 15.347 19.6519C14.6157 20.3368 
                                                    13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1495 6.87466 21.922C6.10421 21.7424 5.40432 
                                                    21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7151C2.15033 12.46 
                                                    1.84821 11.3325 2.07573 10.3567C2.25537 9.58627 2.65945 8.88638 3.23687 8.34557C3.96815 7.66065 5.09569 
                                                    7.35853 7.35077 6.75428C7.77741 6.63996 8.16368 6.53646 8.51621 6.44531"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>

                <h5 className="default text-2xl font-semibold dark:text-white-light ltr:text-right rtl:text-left">
                  {fix_number(total).replace(/.0+$/, "")}

                  <span className="block text-sm font-normal">{title}</span>
                </h5>
              </div>

              <div className="rounded-lg bg-transparent">
                <ReactApexChart
                  series={chart.series}
                  options={chart.options}
                  type="area"
                  height={height || 230}
                  width={"100%"}
                />
              </div>
            </div>
          ) : type === "summary" ? (
            <div className="panel h-full">
              <div className="no-select mb-5 flex items-center justify-between dark:text-white-light">
                <h5 className="text-lg font-semibold">{title}</h5>

                <div className="dropdown">
                  <svg
                    className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="5"
                      cy="12"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      opacity="0.5"
                      cx="12"
                      cy="12"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="19"
                      cy="12"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="default space-y-9">
                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                        />
                        <circle
                          opacity="0.5"
                          cx="8.60699"
                          cy="8.87891"
                          r="2"
                          transform="rotate(-45 8.60699 8.87891)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M11.5417 18.5L18.5208 11.5208"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>{config.text.profit}</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        {fix_number(summary.profit || 0).replace(/.0+$/, "")}{" "}
                        {config.text.currency}
                      </p>
                    </div>

                    <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-[#3cba92] to-[#0ba360]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M3.74157 18.5545C4.94119 20 7.17389 20 11.6393 20H12.3605C16.8259 20 19.0586 20 20.2582 18.5545M3.74157 18.5545C2.54194 17.1091 2.9534 14.9146 3.77633 10.5257C4.36155 7.40452 4.65416 5.84393 5.76506 4.92196M3.74157 18.5545C3.74156 18.5545 3.74157 18.5545 3.74157 18.5545ZM20.2582 18.5545C21.4578 17.1091 21.0464 14.9146 20.2235 10.5257C19.6382 7.40452 19.3456 5.84393 18.2347 4.92196M20.2582 18.5545C20.2582 18.5545 20.2582 18.5545 20.2582 18.5545ZM18.2347 4.92196C17.1238 4 15.5361 4 12.3605 4H11.6393C8.46374 4 6.87596 4 5.76506 4.92196M18.2347 4.92196C18.2347 4.92196 18.2347 4.92196 18.2347 4.92196ZM5.76506 4.92196C5.76506 4.92196 5.76506 4.92196 5.76506 4.92196Z"
                        />
                        <path
                          opacity="0.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M9.1709 8C9.58273 9.16519 10.694 10 12.0002 10C13.3064 10 14.4177 9.16519 14.8295 8"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>{config.text.income}</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        {fix_number(summary.income).replace(/.0+$/, "")}{" "}
                        {config.text.currency}
                      </p>
                    </div>

                    <div className="h-2 rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#7579ff] to-[#b224ef]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                        />
                        <path
                          opacity="0.5"
                          d="M10 16H6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          opacity="0.5"
                          d="M14 16H12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          opacity="0.5"
                          d="M2 10L22 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark">
                      <h6>{config.text.expenses}</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        {fix_number(summary.expenses).replace(/.0+$/, "")}{" "}
                        {config.text.currency}
                      </p>
                    </div>

                    <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                      <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-[#f09819] to-[#ff5858]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : type === "category" ? (
            <div className="panel h-full">
              <div className="mb-5 flex items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  {title}
                </h5>
              </div>

              <div className="rounded-lg bg-white dark:bg-black">
                <ReactApexChart
                  series={chart.series}
                  options={chart.options}
                  type="donut"
                  height={height || 370}
                  width={"100%"}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

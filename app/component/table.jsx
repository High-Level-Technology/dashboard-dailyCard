"use client";
import { alert_msg, lower, print, confirm_deletion } from "@/public/script/public";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import Loader from "@/app/component/loader";

export default function Table({
  columns,
  data,
  add,
  edit,
  delete_,
  search,
  async_search,
  no_search,
  no_add,
  no_edit,
  no_delete,
  btn_name,
  hide
}) {
  const config = useSelector((state) => state.config);
  const isDark =
    useSelector((state) => state.config.theme) === "dark" ? true : false;
  const isRtl =
    useSelector((state) => state.config.lang) === "ar" ? true : false;
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "",
    direction: "asc",
  });
  const [items, setItems] = useState([]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [loader, setLoader] = useState(false);

  const check_empty = (data_table) => {
    if (data_table.length)
      document.querySelector(".datatables").classList.remove("empty");
    else document.querySelector(".datatables").classList.add("empty");
  };

  

  const deleteRow = async (id) => {
    if (!selectedRecords.length && !id) return;
  
    let selectedRows = selectedRecords || [];
    if (id) selectedRows = [{ id: id }];
  
    const ids = selectedRows.map((_) => _.id);
  
     const payload =  {
      id: ids
    };
    confirm_deletion('user', async function() {
      setLoader(true);
  
      const deleteSuccess = await delete_(payload);
      if (deleteSuccess) {
        const result = items.filter((_) => !ids.includes(_.id));
        setRecords(result);
        setInitialRecords(result);
        setItems(result);
        setSelectedRecords([]);
        setQuery("");
        setPage(1);
        check_empty(result);
        // alert_msg(
        //   `${ids.length} ${config.text.items} ${config.text.deleted_successfully}`
        // );
      } else {
        alert_msg(config.text.alert_error, "error");
      }
  
      setLoader(false);
    });
  };
  


  
  const searchData = () => {
    let result = search(items, query);

    if (!async_search) {
      setInitialRecords(result);
      check_empty(result);
    }
  };
  useEffect(() => {
    setItems(data);
    setInitialRecords(sortBy(data, ""));
    check_empty(data);
  }, [data]);
  useEffect(() => {
    setPage(1);
  }, [pageSize]);
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);
  useEffect(() => {
    const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data2.reverse() : data2);
    setPage(1);
  }, [sortStatus]);

  return (
    <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
      <div className="invoice-table">
        <div className="mb-4.5 flex select-none flex-col gap-5 px-5 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
          {
                            !no_delete &&
                            <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>

                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"></path>
                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                    <path opacity="0.5" stroke="currentColor" strokeWidth="1.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"></path>
                                </svg>

                                <span className='font-thin tracking-wide'>{config.text.delete}</span>

                            </button>
                        }
            {!no_add && (
              <button
                type="button"
                className={`${hide ? 'hidden' : 'btn btn-primary gap-2'}`}
                onClick={() => add()}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>

                <span className="font-thin tracking-wide">
                  {config.text[btn_name] || config.text.add_new}
                </span>
              </button>
            )}
          </div>

          {!no_search && (
            <div className="ltr:ml-auto rtl:mr-auto">
              <input
                type="text"
                className="form-input w-auto"
                placeholder={config.text.search}
                value={query}
                style={{ width: "20rem" }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={(e) => {
                  async_search
                    ? e.key === "Enter" && searchData()
                    : searchData();
                }}
              />
            </div>
          )}
        </div>

        <div className="datatables pagination-padding">
          {loader ? (
            <div className="relative h-[20rem] w-full">
              <Loader />
            </div>
          ) : (
            <DataTable
              className={`${isDark} table-hover select-none whitespace-nowrap`}
              records={records}
              columns={[
                ...columns().map((_) => {
                  _.textAlignment = isRtl ? "right" : "left";
                  _.title = config.text[lower(_.title)] || "";
                  return _;
                }),
                {
                  accessor: "action",
                  sortable: false,
                  title: config.text.actions,
                  textAlignment: isRtl ? "right" : "left",
                  render: ({ id }) => (
                    <div className="mx-auto flex w-full items-center gap-3">
                      {!no_edit && (
                        <button
                          type="button"
                          onClick={() => edit(id)}
                          className="btn border-primary px-3 py-[5px] text-[.8rem] tracking-wide text-primary shadow-none hover:bg-primary hover:text-white"
                        >
                          {config.text.show}
                        </button>
                      )}
                      {!no_delete && (
                        <button
                          type="button"
                          onClick={() => deleteRow(id)}
                          className="btn border-danger px-3 py-[5px] text-[.8rem] tracking-wide text-danger shadow-none hover:bg-danger hover:text-white"
                        >
                          {config.text.delete}
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              highlightOnHover
              totalRecords={initialRecords.length}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              paginationText={({ from, to, totalRecords }) =>
                `${config.text.showing}  ${from} - ${to} ${config.text.of} ${totalRecords}`
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
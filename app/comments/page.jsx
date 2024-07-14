"use client";
import {
  api,
  date as dt,
  matching,
  fix_date,
  fix_number,
  alert_msg,
  print,
} from "@/public/script/public";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Table from "@/app/component/table";
import Form from "./form";

export default function Comments() {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [data, setData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comment, setComment] = useState({});
  const [model, setModel] = useState(false);
  const [loader, setLoader] = useState(false);

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
        accessor: "blog",
        sortable: true,
        title: "blog",
        render: ({ blog, id }) =>
          blog?.id ? (
            <div
              className="pointer flex items-center font-semibold hover:text-primary hover:underline"
              onClick={() => router.push(`/blogs/edit/${blog.id}`)}
            >
              <div className="h-7 w-7 overflow-hidden rounded-[.5rem] ltr:mr-3 rtl:ml-3">
                <img
                  src={`${host}/${blog.image}`}
                  className="h-7 w-7 overflow-hidden rounded-[.5rem] ltr:mr-3 rtl:ml-3"
                  onLoad={(e) =>
                    e.target.src.includes("_icon")
                      ? e.target.classList.add("empty")
                      : e.target.classList.remove("empty")
                  }
                  onError={(e) =>
                    (e.target.src = `/media/public/empty_icon.png`)
                  }
                />
              </div>
              <div className="max-w-[12rem] select-text truncate font-semibold">
                {blog.title}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "user",
        sortable: true,
        title: "client",
        render: ({ user, id }) =>
          user?.id ? (
            <div
              className="pointer flex items-center font-semibold hover:text-primary hover:underline"
              onClick={() => router.push(`/clients/edit/${user.id}`)}
            >
              <div className="-mt-[2px] h-7 w-7 overflow-hidden rounded-full ltr:mr-3 rtl:ml-3">
                <img
                  src={`${host}/${user.image}`}
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
                {user.name}
              </div>
            </div>
          ) : (
            <div className="select-text font-semibold">--</div>
          ),
      },
      {
        accessor: "replies",
        sortable: true,
        title: "replies",
        render: ({ replies }) => (
          <div className="default select-text font-semibold">
            {fix_number(replies)}
          </div>
        ),
      },
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
            {fix_date(created_at || dt())}
          </div>
        ),
      },
    ];
  };
  const get = async () => {
    const response = await api("comment");
    setData(response.comments || []);
    setBlogs(response.blogs || []);
  };
  const delete_ = async (ids) => {
    setData(data.filter((_) => !ids.includes(_.id)));
    await api("comment/delete", { ids: JSON.stringify(ids) });
  };
  const search = (items, query) => {
    let result = items.filter(
      (item) =>
        matching(`--${item.id}`, query) ||
        matching(item.blog?.title, query) ||
        matching(item.user?.name, query) ||
        matching(item.content, query) ||
        matching(item.replies, query) ||
        matching(fix_number(item.replies), query) ||
        matching(item.created_at, query) ||
        matching(fix_date(item.created_at), query) ||
        matching(item.active ? config.text.active : config.text.stopped, query)
    );

    return result;
  };
  const save_comment = async () => {
    if (!comment.blog.id) return alert_msg(config.text.error_review, "error");

    setLoader(true);
    const response = await api(
      `comment/${comment.id ? `${comment.id}/update` : "store"}`,
      comment
    );
    setLoader(false);

    if (!response.status) return alert_msg(config.text.alert_error, "error");

    if (comment.id) {
      let new_data = data.map((_) => (_.id === comment.id ? comment : _));
      setData([...new_data]);
      setModel(false);
      alert_msg(
        `${config.text.item} ( ${comment.id} ) - ${config.text.updated_successfully}`
      );
    } else {
      let new_data = data;
      new_data.unshift({ ...comment, id: response.comment?.id || 0 });
      setData([...new_data]);
      setModel(false);
      alert_msg(config.text.new_item_added);
    }
  };
  useEffect(() => {
    document.title = config.text.all_comments;
    get();
  }, []);

  return (
    <Fragment>
      <Table
        columns={columns}
        data={data}
        delete_={delete_}
        search={search}
        async_search={false}
        no_delete={!data.length}
        no_search={!data.length}
        btn_name="add_comment"
        add={() => {
          setComment({ active: true, allow_replies: true });
          setModel(true);
          setLoader(false);
        }}
        edit={(id) => {
          setComment(data.find((_) => _.id === id));
          setModel(true);
          setLoader(false);
        }}
      />

      <Form
        config={config}
        data={comment}
        setData={setComment}
        save={save_comment}
        blogs={blogs}
        model={model}
        setModel={setModel}
        loader={loader}
      />
    </Fragment>
  );
}

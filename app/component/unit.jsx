import { useEffect, useState } from "react";
import {
  api,
  alert_msg,
  get_session,
  confirm_deletion,
} from "@/public/script/public";
import { useSelector } from "react-redux";

export default function Unit({ id, units, get_item }) {
  const config = useSelector((state) => state.config);
  const [data, setData] = useState({});
  const [Loader, setLoader] = useState(false);

  const default_item = async () => {
    setData({
      product_id: id,
      title: "",
      price: "",
      real_price: 0,
      quantity: null,
      active: 1,
    });

    setLoader(false);
  };

  useEffect(() => {
    // Default data setting
    default_item();
  }, [id]);

  const delete_unit = async (unit) => {
    const dataId = {
      unit_id: [unit.id],
    };
    confirm_deletion("unit", async function () {
      setLoader(true);
      await fetch(
        `https://dailycard.future-developers.cloud/api/admin/units/delete`,
        {
          method: "POST",
          body: JSON.stringify(dataId),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${get_session("user")?.access_token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((response) => {
          alert_msg(
            `${config.text.item} ( ${unit.id} ) ${config.text.deleted_successfully}`
          );
          default_item();
          get_item();
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        })
        .finally(() => {
          setLoader(false);
        });
    });
  };

  const save = async () => {
    setLoader(true);
    const url = data?.id ? `admin/units/update` : "admin/units/create";

    let edit_data;
    if (data.id) {
      edit_data = {
        unit_id: data.id,
        title: data.title,
        price: data.price,
        real_price: data.real_price,
        active: Number(data.active),
        quantity: data.quantity || null,
      };
    } else {
      edit_data = {
        product_id: id,
        title: data.title,
        price: data.price,
        real_price: data.real_price,
        active: Number(data.active),
        quantity: data.quantity || null,
      };
    }

    const response = await api(url, edit_data);
    if (response.status === "success") {
      alert_msg("Units have been added");
      default_item();
      get_item();
    } else {
      alert_msg("Please update the product type to units", "error");
    }
    setLoader(false);
    return response;
  };

  const handleUnitChange = (e) => {
    const selectedUnitId = e.target.value;
    const selectedUnit = units?.find(
      (unit) => unit?.id === parseInt(selectedUnitId)
    );
    setData(selectedUnit);
  };

  const handleEdit = (unit) => {
    setData(unit);
  };

  return (
    <div className="edit-item-info relative">
      <p className="px-8 pt-6 text-xl font-semibold">
        {config.text.create_units}
      </p>
      <div className="flex flex-col gap-2.5 xl:flex-row">
        <div className="flex flex-1 flex-col xl:w-[70%]">
          {units?.length > 0 && (
            <div className="panel no-select flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
              <div className="overflow-x-auto px-8">
                <table className="min-w-full rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.id}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.title}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.price}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.real_price}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.quantity}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {config.text.status}
                      </th>
                      <th className="bg-[#1a2941] px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-[#121e32]">
                    {units?.map((unit, index) => (
                      <tr key={unit?.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {unit?.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {unit?.title}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {unit?.price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {unit?.real_price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {unit?.quantity || "-"}
                        </td>
                        <td className="whitespace-nowrap py-4">
                          {unit?.active ? "Active" : "Inactive"}
                        </td>
                        <td className="flex justify-end whitespace-nowrap py-4 text-sm font-medium">
                          <button
                            onClick={() => handleEdit(unit)}
                            className="btn ml-2 border-indigo-600 tracking-wide shadow-none hover:bg-indigo-700 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => delete_unit(unit)}
                            className="btn ml-2 border-red-700 tracking-wide shadow-none hover:bg-red-800 hover:text-white"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="div-2 mb-4 w-full px-6 py-3 lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
            <div className="mt-4 flex items-center">
              <label htmlFor="name" className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2">
                {config.text.title}
              </label>
              <input
                id="name"
                type="text"
                value={data?.title || ""}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="form-input flex-1"
                autoComplete="off"
                required
              />
            </div>

            <div className="mt-4 flex items-center">
              <label htmlFor="price" className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2">
                {config.text.price}
              </label>
              <input
                id="price"
                type="number"
                value={data?.price || ""}
                onChange={(e) => setData({ ...data, price: e.target.value })}
                className="form-input flex-1"
                autoComplete="off"
                required
              />
            </div>

            <div className="mt-4 flex items-center">
              <label
                htmlFor="real_price"
                className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2"
              >
                {config.text.real_price}
              </label>
              <input
                id="real_price"
                type="number"
                value={data?.real_price || ""}
                onChange={(e) =>
                  setData({ ...data, real_price: e.target.value })
                }
                className="form-input flex-1"
                autoComplete="off"
                required
              />
            </div>

            <div className="mt-4 flex items-center">
              <label
                htmlFor="quantity"
                className="mb-0 w-1/4 ltr:mr-2 rtl:ml-2"
              >
                {config.text.quantity}
              </label>
              <input
                id="quantity"
                type="number"
                value={data?.quantity || ""}
                onChange={(e) => setData({ ...data, quantity: e.target.value })}
                className="form-input flex-1"
                autoComplete="off"
                required
                placeholder="No quantity specified !"
              />
            </div>

            <div className="check-input pt-8">
              <label className="relative h-6 w-12">
                <input
                  onChange={() => setData({ ...data, active: !data?.active })}
                  checked={data?.active || false}
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

              <label htmlFor="active" className="pointer ltr:pl-3 rtl:pr-3">
                {config.text.active}
              </label>
            </div>

            <div className="flex gap-8">
              <button
                type="button"
                onClick={save}
                className="btn mt-8 border-primary tracking-wide shadow-none hover:bg-primary hover:text-white"
              >
                {data?.id ? config.text.update : config.text.create}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

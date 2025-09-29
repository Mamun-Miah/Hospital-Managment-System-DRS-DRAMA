"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
// import Swal from "sweetalert2";

interface Invoice {
  invoice_id: number;
  invoice_number: string;
  doctor_name: string;
  patient_name: string;
  mobile_number: string;
  prescribed_at: string;
  total_cost: number;
  paid_amount: number;
  next_appointment_date: string | null;
  due_amount: number;
  payment_type: "Full" | "Partial" | "Unpaid" | null;
}

const InvoiceList: React.FC = () => {
    const getphone_number = localStorage.getItem("wp_phone_number");

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // console.log("allTreatment", allTreatment);
  const [filteredInvoice, setFilteredInvoice] = useState<Invoice[]>(invoices);

  // search and pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredInvoice?.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentInvoice = filteredInvoice?.slice(startIndex, endIndex);
  const [filterType, setFilterType] = useState<
    "All" | "Full" | "Partial" | "Unpaid"
  >("All");

  useEffect(() => {
    const applyFilters = () => {
      let result: Invoice[] = invoices;

      // Apply search filter
      if (search) {
        result = result?.filter(
          (invoice) =>
            invoice.patient_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.invoice_number.toLowerCase().includes(search) ||
            invoice.mobile_number.includes(search)
        );
      }

      // Apply payment type filter
      if (filterType !== "All") {
        result = result?.filter((invoice) => {
          const actualPaymentType = invoice.payment_type || "Unpaid";
          return actualPaymentType === filterType;
        });
      }

      setFilteredInvoice(result);
      setCurrentPage(1);
    };

    applyFilters();
  }, [search, invoices, filterType]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

 useEffect(() => {
  const fetchInvoiceList = async () => {
    try {
      const token = sessionStorage.getItem("token"); // get token from sessionStorage

      const res = await fetch(`/api/user-dashboard/invoice?phone=${getphone_number}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // send token in header
        },
      });

      const data = await res.json();
      setInvoices(data.formattedinvoiceList);
      console.log("Fetched Invoices:", data.formattedinvoiceList);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  if (getphone_number) fetchInvoiceList(); // only fetch if phone exists
}, [getphone_number]);


  return (
    <>
      <div className=" p-5 mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Billing Records</h5>

        <ol className="flex items-center">
          <li className="inline-block">
            <Link href="/user/dashboard" className="flex items-end">
              <i className="material-symbols-outlined text-primary-500">home</i>
              Dashboard
            </Link>
          </li>
          <span className="material-symbols-outlined">chevron_right</span>
          <li className="">Billing Records</li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="flex justify-start">
            <select
              onChange={(e) =>
                setFilterType(
                  e.target.value as "Full" | "Partial" | "Unpaid" | "All"
                )
              }
              value={filterType}
              className="px-5 bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
            >
              <option value="All">Sort Payment Status</option>
              <option value="Full">Full</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Invoice Number
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor Name
                  </th>
                  {/* <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Treatment Name
                  </th> */}
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescribed Date
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Next Appointment Date
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Total Cost
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Paid Amount
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Due
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentInvoice?.length > 0 ? (
                  currentInvoice.map((treatment) => (
                    <tr key={treatment.invoice_id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.invoice_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.invoice_number}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.doctor_name}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {new Date(
                            treatment?.prescribed_at
                          ).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment?.next_appointment_date
                            ? new Date(
                                treatment?.next_appointment_date
                              ).toLocaleDateString()
                            : "--"}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="font-bold block text-xs text-gray-500 dark:text-gray-400">
                          {treatment.total_cost}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="font-bold block text-xs text-gray-500 dark:text-gray-400">
                          {treatment.paid_amount}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.due_amount}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span
                          className={`${
                            treatment.payment_type === "Full"
                              ? "bg-green-600"
                              : treatment.payment_type === "Partial"
                              ? "bg-yellow-600"
                              : "bg-red-500"
                          } px-2 py-1 rounded text-xs font-semibold text-gray-100`}
                        >
                          {treatment.payment_type === "Full"
                            ? "Paid"
                            : treatment.payment_type
                            ? treatment.payment_type
                            : "Unpaid"}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          {treatment.payment_type &&
                            treatment.payment_type !== "Unpaid" && (
                              <Link href={`view/${treatment.invoice_id}`}>
                                <button
                                  type="button"
                                  className="text-primary-500 leading-none custom-tooltip"
                                  // onClick={() => setOpen(true)}
                                >
                                  <i className="material-symbols-outlined !text-md">
                                    visibility
                                  </i>
                                </button>
                              </Link>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No billing records matches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pt-[12.5px] sm:flex sm:items-center justify-between">
              <p className="!mb-0 !text-xs">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </p>
              <ol className="mt-[10px] sm:mt-0 flex items-center">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === 1
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                    >
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                          currentPage === page
                            ? "border border-primary-500 bg-primary-500 text-white"
                            : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === totalPages
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;

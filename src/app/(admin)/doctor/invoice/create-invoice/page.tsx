/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";

// types
type OptionType = {
  label: string;
  value: string;
};
const patients = [
  { label: "John Doe", value: "john_doe" },
  { label: "Emily Johnson", value: "emily_johnson" },
  { label: "Michael Lee", value: "michael_lee" },
  { label: "Sophia Martinez", value: "sophia_martinez" },
  { label: "David Kim", value: "david_kim" },
  { label: "Anna White", value: "anna_white" },
  { label: "Chris Evans", value: "chris_evans" },
  { label: "Laura Green", value: "laura_green" },
  { label: "Nathan Scott", value: "nathan_scott" },
  { label: "Olivia Brown", value: "olivia_brown" },
];
const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (base: any, state: any) => ({
    ...base,
    height: "55px",
    borderRadius: "0.375rem",
    color: "black",
    backgroundColor: "white",
    borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
    paddingLeft: "17px",
    boxShadow: "none",
    outline: "none",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "black",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6b7280",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "white",
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#ede9fe"
      : state.isSelected
      ? "#7c3aed"
      : "white",
    color: state.isSelected ? "white" : "black",
    cursor: "pointer",
    padding: 10,
  }),
};
const CreateInvoice: React.FC = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    patient: "",
    doctorName: "John Doe",
    treatmentName: "Radio Therapy",
    treatmentCost: 200,
    treatmentSession: 1,
    treatmentDueSession: 2,
    totalDueAmount: 300,
    paidAmount: 200,
    paymentType: "full",
    paymentMethod: "bkash",
    paymentDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = (patient: string) => {
    setFormData((prev) => ({ ...prev, patient }));
  };

  useEffect(() => {
    // generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const timestamp = Date.now();
    const invoiceNumber = `INV-${year}-${timestamp}`;

    // current date
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${day}-${month}-${year}`;

    setFormData((prev) => ({ ...prev, invoiceNumber, paymentDate: today }));
  }, []);

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Create Invoice</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Doctor
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Create Invoice
          </li>
        </ol>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[25px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Invoice Number
                </label>
                <input
                  name="invoiceNumber"
                  type="text"
                  value={formData.invoiceNumber}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Patient
                </label>

                <Select
                  options={patients}
                  onChange={(patient) =>
                    handlePatientChange(patient?.label ?? "")
                  }
                  styles={customStyles}
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Name
                </label>
                <input
                  type="text"
                  value="Radio Therapy"
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Cost
                </label>
                <input
                  type="number"
                  value={formData.treatmentCost}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Session
                </label>
                <input
                  type="number"
                  value={formData.treatmentSession}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Due session
                </label>
                <input
                  type="number"
                  value={formData.treatmentDueSession}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Total Due Amount
                </label>
                <input
                  type="number"
                  value={formData.totalDueAmount}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Paid Amount
                </label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>

               <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Total Cost
                </label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border bg-gray-100 border-gray-200 dark:border-[#172036]  dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Type
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="full">Full</option>
                  <option value="partial">Partial</option>
                  <option value="due">Due</option>
                </select>
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="bkash">Bkash</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Date
                </label>
                <input
                  type="text"
                  value={formData.paymentDate}
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="trezo-card mt-[25px]">
            <div className="trezo-card-content">
              <button
                type="button"
                className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
                // onClick={() =>
                //   setFormData({
                //     treatmentID: "",
                //     treatmentName: "",
                //     totalCost: "",
                //     durationMonths: "",
                //   })
                // }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              >
                <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    add
                  </i>
                  {loading ? "Submitting..." : "Create Invoice"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateInvoice;

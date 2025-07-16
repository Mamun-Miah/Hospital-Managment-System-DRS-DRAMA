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

type Patient = {
    patient_name: string;
    [key: string]: any;
  };

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

  const [patients, setPatients] = useState<OptionType[]>([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [patientData, setPatientData] = useState<Patient[]>([]);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    patient_name: "",
    doctorName: "John Doe",
    totalCost:0,
    doctorFee:"",
    treatmentName: "Radio Therapy",
    treatmentCost: 200,
    treatmentSession: 1,
    treatmentDueSession: 2,
    totalDueAmount: 300,
    paidAmount: "",
    paymentType: "full",
    paymentMethod: "bkash",
    paymentDate: "",
  });

  

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



  const handlePatientChange = async (patient_name: string) => {
  const found = patientData.find((p) => p.patient_name === patient_name);

  if (!found) {
    alert("Patient not found");
    return;
  }
  // setPatientId(found.patient_id)
  const patient_id = found.patient_id;

  
  try {
    const res = await fetch(`/api/invoice/create-invoice/${patient_id}`);

    if (!res.ok) throw new Error("Failed to create invoice");

    const result = await res.json();
    console.log("Invoice created:", result);

    const treatmentName = result.getInvoiceData?.[0]?.items?.[0]?.treatment?.treatment_name || "";
    const doctorName = result.getInvoiceData?.[0]?.doctor?.doctor_name || "";
    const treatmentCost = result.getInvoiceData?.[0]?.items?.[0]?.treatment?.total_cost || "";
    const duration_months = result.getInvoiceData?.[0]?.items?.[0]?.treatment?.duration_months || "";
    const totalCost = result.getInvoiceData[0]?.total_cost || "";
    // console.log(paidAmount)

    setFormData((prev) => ({ ...prev, 
     treatmentName: treatmentName,
     doctorName:doctorName,
     treatmentCost:treatmentCost,
     treatmentSession:duration_months,
     totalCost:totalCost
     }));

  } catch (error) {
    console.error("Error creating invoice:", error);
  }
};


// console.log(selectedPatientId)

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

    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patient/patientlist");
        const data = await res.json();

        setPatientData(data)
        // extract patient_name
        const filteredPatients: OptionType[] = data.map((p: any) => ({
          value: p.patient_name.toLowerCase().replace(/\s+/g, "_"),
          label: p.patient_name,
        }));

      
        setPatients(filteredPatients);
        setFormData({
          invoiceNumber: invoiceNumber,
          patient_name: "",
          doctorName: "",
          doctorFee: "",
          treatmentName: "",
          totalCost:0,
          treatmentCost: 0,
          treatmentSession: 0,
          treatmentDueSession: 0,
          totalDueAmount: 0,
          paidAmount:"",
          paymentType: "",
          paymentMethod: "",
          paymentDate: today,
        })
        // console.log('Form Data', formData)
      } catch (error) {
        console.error("Error fetching patient list:", error);
      }
    };

    fetchPatients();
  }, []);


const handleCalculateDue = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { value } = e.target;
  const paid = Number(value);
  const due = formData.totalCost - paid;
  const treamentSession = Number(formData.treatmentSession);
    


  setFormData((prev) => ({
    ...prev,
    paidAmount: value,
    totalDueAmount: due >= 0 ? due : 0, // Prevent negative due
  }));
  };
  



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
                  onChange={(patient_name) =>
                    handlePatientChange(patient_name?.label ?? "")
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
                  value={formData.treatmentName}
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
                name="totalDueAmount"
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
                name="paidAmount"
                type="number"
                placeholder="Enter Paid Amount"
                onChange={handleCalculateDue}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>

               <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Total Cost
                </label>
                <input
                name="totalCost"
                  type="number"
                  value={formData.totalCost}
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

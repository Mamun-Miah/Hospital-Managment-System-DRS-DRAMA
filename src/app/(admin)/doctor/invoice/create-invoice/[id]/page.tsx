
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



const CreateInvoice: React.FC = () => {
const [formData, setFormData] = useState([])
const treatments = []
const totalTreatmentCost = []

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
            Create Invoice
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="sm:flex items-center justify-between">
          <div>
            <div>
              <Image
                src="/images/logo.png"
                alt="logo"
                className="mb-[10px] dark:hidden"
                width={120}
                height={30}
              />
              <Image
                src="/images/white-logo.svg"
                alt="logo"
                className="mb-[10px] hidden dark:block"
                width={120}
                height={30}
              />
            </div>
            <p className="md:text-md text-black dark:text-white mt-5">
              Invoice Number : 
            </p>
            <p className="md:text-md text-black dark:text-white">
              Invoice Date :
            </p>
          </div>

          <div className="mt-[20px] sm:mt-0">
            <div className="flex items-center gap-3 md:text-md mt-[5px] dark:text-white">
              <p className=" dark:text-white font-medium mt-4">Patient: Sako Vai</p>

              {/* <Select
                options={patients}
                onChange={(patient_name) =>
                  handlePatientChange(patient_name?.label ?? "")
                }
                styles={customStyles}
              /> */}
            </div>
            <p className="md:text-md mt-[5px]">
              Patient Id: 01
            </p>
            <p className="md:text-md mt-[5px]">
              Previous Session: 07 Nov, 2025
            </p>
            <p className="mb-[8px] dark:text-white text-md block">
              Next Session: 07 Dec, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Treatment Name
                </th>
                <th className="text-black dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Duration
                </th>
                <th className="text-black dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Treatment Cost
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-500 dark:text-white">
              {treatments.map((treatment, i) => (
                <tr key={i}>
                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.treatmentName}
                  </td>

                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.duration}
                  </td>
                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.treatmentCost} /=
                  </td>
                </tr>
              ))}
              <tr className="px-20">
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Treatment Cost: </td>
                <td className="p-3 pl-6">{totalTreatmentCost} /=</td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Doctor Fee: </td>
                <td className="p-3 pl-6">{doctorFee} /=</td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Previous Due: </td>
                <td className="p-3 pl-6">{previousDue} /=</td>
              </tr>
              <tr className="px-20">
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Cost: </td>
                <td className="p-3 pl-6"> {totalCost} /=</td>
              </tr>

              <tr className="mt-5 font-semibold text-black">
                <td className="p-3 pl-6 flex gap-3">
                  <div className="">
                    {/* <p className="mt-3 text-black dark:text-white font-medium text-sm">
                      Payment Type:
                    </p> */}
                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      className="h-[30px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    >
                      <option value="">Payment Type</option>
                      <option value="partial">Partial</option>
                      <option value="full">Full</option>
                      <option value="due">Due</option>
                    </select>
                  </div>
                  <div className="">
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="h-[30px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    >
                      <option value="">Payment Method</option>
                      <option value="bkash">Bkash</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </td>
                <td className="p-3 pl-6">
                  <p className="dark:text-white m-0 p-0 font-semibold text-black">
                    Paid Amount:
                  </p>
                </td>
                <td className="p-3 pl-6">
                  <input
                    type="number"
                    placeholder="Amount"
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="h-[30px] rounded-md text-black text-[14px] dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[10px] block outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 w-[100px]"
                  />
                </td>
              </tr>
              <tr className="px-20">
                <td className="border-b-1 border-gray-300"></td>
                <td className="border-b-1 border-gray-300"></td>
                <td className="border-b-1 border-gray-300"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Due: </td>
                <td className="p-3 pl-6">{totalCost - paidAmount} /= </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-10 flex items-center justify-end">
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
    </>
  );
};

export default CreateInvoice;

"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CreateInvoice: React.FC = () => {
  const [treatments, setTreatments] = useState([
    {
      treatmentId: 101,
      treatmentName: "Psychotherapy Counseling",
      treatmentCost: 9600,
      afterDiscount: 8000,
    },
    {
      treatmentId: 102,
      treatmentName: "Weight Loss Program",
      treatmentCost: 18000,
      afterDiscount: 16200,
    },
    {
      treatmentId: 103,
      treatmentName: "Cardiac Rehab",
      treatmentCost: 22000,
      afterDiscount: 22000,
    },
    {
      treatmentId: 104,
      treatmentName: "Acupuncture Therapy",
      treatmentCost: 5000,
      afterDiscount: 4500,
    },
  ]);

  const handleRemove = (id: number) => {
    setTreatments((prevs) => prevs.filter((item) => item.treatmentId !== id));
  };

  const totatTreatmentCost = treatments.reduce(
    (acc, item) => acc + item.afterDiscount,
    0
  );

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

            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] text-md last:mb-0">
                Invoice Number :{" "}
                <span className="text-black text-md dark:text-white">
                  inv-1245
                </span>
              </li>
              <li className="mb-[7px] text-md last:mb-0">
                <span>Invoice Date: </span>
                <span className="text-black dark:text-white">12/07/25</span>
              </li>
            </ul>
          </div>
          <h4>Bill</h4>
          <div className="mt-[20px] sm:mt-0">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] text-md last:mb-0">
                Patient ID:{" "}
                <span className="text-black text-md dark:text-white">007</span>
              </li>
              <li className="mb-[7px] text-md last:mb-0">
                Patient Name:{" "}
                <span className="text-black text-md dark:text-white">
                  Shakku Vai
                </span>
              </li>
              <li className="mb-[7px] text-md last:mb-0">
                <span>Previous Session: : </span>
                <span className="text-black dark:text-white">12/07/25</span>
              </li>
              <li className="mb-[7px] text-md last:mb-0">
                <span>Next Session: : </span>
                <span className="text-black dark:text-white">12/07/25</span>
              </li>
            </ul>
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
                  Treatment Cost
                </th>
                <th className="text-black dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Payable Cost
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-500 dark:text-white">
              {treatments.map((treatment) => (
                <tr key={treatment.treatmentId}>
                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.treatmentName}
                  </td>

                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.treatmentCost}/=
                  </td>
                  <td className="flex items-center justify-between ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    <span>{treatment.afterDiscount}</span>
                    <button
                      onClick={() => handleRemove(treatment.treatmentId)}
                      className="ml-5 text-red-500"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
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
                <td className="p-3 pl-6">{totatTreatmentCost} /=</td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Doctor Fee: </td>
                <td className="p-3 pl-6"> 347 /=</td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Previous Due: </td>
                <td className="p-3 pl-6">484 /=</td>
              </tr>
              <tr className="px-20">
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Cost: </td>
                <td className="p-3 pl-6"> 57354 /=</td>
              </tr>

              <tr className="mt-5 font-semibold text-black">
                <td className="p-3 pl-6 flex gap-3">
                  <div className="">
                    <select
                      name="paymentType"
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
                <td className="p-3 pl-6">3477 /= </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-10 flex items-center justify-end">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
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
                {/* {loading ? "Submitting..." : "Create Invoice"} */}
                Submit
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInvoice;

"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Treatment {
  treatment_name: string;
  treatment_cost: number;
  payable_treatment_amount: number;
}

interface Invoice {
  invoice_number: string;
  invoice_creation_date: string;
  patient_id: number;
  doctor_fee: number;
  due_amount: number;
  paid_amount: number;
  payment_type: string;
  payment_method: string;
  previous_due: number;
  next_session_date: string;
  previous_session_date: string;
  patient?: {
    patient_name: string;
  };
}

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  const totatTreatmentCost: number = treatments.reduce(
    (acc, item) => acc + item.payable_treatment_amount,
    0
  );

  const formattedDate = (isoDate?: string) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoice/view-eye-invoice/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { treatments, invoice } = data;
        setTreatments(treatments);
        setInvoice(invoice);
      });
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Invoice Details</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">
            <Link href="/dashboard/ecommerce/" className="inline-block relative ltr:pl-[22px]">
              <i className="material-symbols-outlined absolute ltr:left-0 top-1/2 -translate-y-1/2 text-primary-500">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">
            Invoice Details
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="sm:flex items-center justify-between">
          <div>
            <Image src="/images/logo.png" alt="logo" className="mb-[10px] dark:hidden" width={120} height={30} />
            <Image src="/images/white-logo.svg" alt="logo" className="mb-[10px] hidden dark:block" width={120} height={30} />

            <ul className="mb-[7px]">
              <li className="mb-[7px] text-md">Invoice Number: <span className="text-black dark:text-white">{invoice.invoice_number}</span></li>
              <li className="mb-[7px] text-md">Invoice Date: <span className="text-black dark:text-white">{formattedDate(invoice.invoice_creation_date)}</span></li>
            </ul>
          </div>

          <div className="mt-[20px] sm:mt-0">
            <ul className="mb-[7px]">
              <li className="mb-[7px] text-md">Patient ID: <span className="text-black dark:text-white">{invoice.patient_id}</span></li>
              <li className="mb-[7px] text-md">Patient Name: <span className="text-black dark:text-white">{invoice.patient?.patient_name}</span></li>
              {/* <li className="mb-[7px] text-md">Previous Session: <span className="text-black dark:text-white">{formattedDate(invoice.invoice_creation_date)}</span></li> */}
              <li className="mb-[7px] text-md">Next Session: <span className="text-black dark:text-white">{formattedDate(invoice.next_session_date)}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-gray-900 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Treatment Name
                </th>
                <th className="text-black dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Treatment Cost
                </th>
                <th className="text-black dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                  Payable Amount
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-500 dark:text-white">
              {treatments.map((treatment, i) => (
                <tr key={i}>
                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    {treatment.treatment_name}
                  </td>

                  <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    Tk. {treatment.treatment_cost}
                  </td>
                  <td className="flex items-center justify-between ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                    <span>Tk. {treatment.payable_treatment_amount}</span>
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
                <td className="p-3 pl-6">Tk. {totatTreatmentCost}</td>
              </tr>
              <tr className="mt-5  text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Doctor Fee: </td>
                <td className="p-3 pl-6">Tk. {invoice.doctor_fee}</td>
              </tr>
              <tr className="mt-5  text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Previous Due: </td>
                <td className="p-3 pl-6">Tk. {invoice.due_amount}</td>
              </tr>
              <tr className="px-20">
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
                <td className="border-b-1 border-gray-200"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Cost: </td>
                <td className="p-3 pl-6">
                  Tk.{" "}
                  {totatTreatmentCost +
                    invoice.doctor_fee +
                    invoice.previous_due}
                </td>
              </tr>

              <tr className="mt-5 font-semibold text-black">
                <td className="p-3 pl-6 flex gap-3">
                  <div className="text-sm">
                    Payment Type: <span className="font-medium">{invoice.payment_type}</span>
                  </div>
                  <div className="text-sm">
                    Pyament Method: <span className="font-medium">{invoice.payment_method}</span>
                  </div>
                </td>
                <td className="p-3 pl-6">
                  <p className="dark:text-white m-0 p-0 font-semibold text-black">
                    Paid Amount:
                  </p>
                </td>
                <td className="p-3 pl-6">Tk. {invoice.paid_amount}</td>
              </tr>
              <tr className="px-20">
                <td className="border-b-1 border-gray-300"></td>
                <td className="border-b-1 border-gray-300"></td>
                <td className="border-b-1 border-gray-300"></td>
              </tr>
              <tr className="mt-5 font-semibold text-black">
                <td className="p-3"></td>
                <td className="p-3 pl-6">Total Due: </td>
                <td className="p-3 pl-6">
                  Tk.{" "}
                  {totatTreatmentCost +
                    invoice.doctor_fee +
                    invoice.previous_due -
                    invoice.paid_amount}
                </td>
              </tr>
            </tbody>
          </table>

          {/* <div className="mt-10 flex items-center justify-end">
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
               
                Submit
              </span>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ViewInvoice;

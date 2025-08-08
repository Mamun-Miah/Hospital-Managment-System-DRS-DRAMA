/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";

type Treatment = {
  treatmentId: number;
  treatment_name: string;
  treatment_cost: number;
  payable_treatment_amount: number;
};

type Invoice = {
  invoice_id: number;
  invoice_number: string;
  invoice_creation_date: string;
  previous_session_date: string | null;
  next_session_date: string | null;
  doctor_fee: number;
  previous_due: number;
  paid_amount: number;
  payment_type: string;
  payment_method: string;
  patient_id: number;
  patient?: {
    patient_name: string;
  };
};

type PaymentInfo = {
  paid_amount: number;
  payment_method: string;
  payment_type: string;
};

const EditInvoice: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const { id } = useParams<{ id: string }>();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paid_amount: 0,
    payment_method: "",
    payment_type: "",
  });
  const [loading, setLoading] = useState(false);

  // Remove treatment by index
  const handleRemove = (index: number) => {
    setTreatments((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate total treatment cost
  const totalTreatmentCost = treatments.reduce(
    (acc, item) => acc + item.payable_treatment_amount,
    0
  );

  // Calculate total cost
  const totalCost =
    totalTreatmentCost + (invoice?.doctor_fee || 0) + (invoice?.previous_due || 0);

  // Calculate total due
  const totalDue = totalCost - paymentInfo.paid_amount;

  const formattedDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Handle input/select changes for payment info
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: name === "paid_amount" ? parseFloat(value) || 0 : value,
    }));
  };

  // Submit update
 const handleSubmit = async () => {
  if (!invoice) return;

  setLoading(true);
  try {
    const response = await fetch(`/api/invoice/create-invoice/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method: paymentInfo.payment_method,       // e.g. "Cash"
        payment_type: paymentInfo.payment_type,           // e.g. "Full"
        previous_due: invoice.previous_due,                // e.g. 0
        total_treatment_cost: totalTreatmentCost,          // e.g. 1500
        paid_amount: paymentInfo.paid_amount,              // e.g. 1500
        doctor_fee: invoice.doctor_fee,                     // e.g. 500
        due_amount: totalCost - paymentInfo.paid_amount,   // calculate due_amount properly
        treatment_ids: treatments.map((t) => t.treatmentId) // e.g. [1, 3, 4]
      }),
    });

    if (response.ok) {
      alert("Invoice updated successfully!");
    } else {
      alert("Failed to update invoice");
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    alert("Error updating invoice");
  } finally {
    setLoading(false);
  }
};


  // Fetch invoice & treatments on mount
  useEffect(() => {
  if (!id) return;

  fetch(`/api/invoice/view-invoice/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const { treatments: apiTreatments, invoice } = data;

      // Map API treatments to frontend Treatment type
      const treatments = apiTreatments.map((t: any) => ({
        treatmentId: t.treatment_id,
        treatment_name: t.treatment_name,
        treatment_cost: Number(t.treatment_cost),
        payable_treatment_amount: Number(t.payable_treatment_amount),
      }));

      setTreatments(treatments);
      setInvoice(invoice);
      setPaymentInfo({
        paid_amount: invoice.paid_amount ?? 0,
        payment_method: invoice.payment_method ?? "",
        payment_type: invoice.payment_type ?? "",
      });
    })
    .catch((error) => {
      console.error("Error fetching invoice:", error);
    });
}, [id]);

console.log(invoice)
console.log(treatments)
  if (!invoice) return <p>Loading...</p>;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Edit Invoice</h5>
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
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">
            Edit Invoice
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
              <li className="mb-[7px] text-md">
                Invoice Number :{" "}
                <span className="text-black text-md dark:text-white">
                  {invoice.invoice_number}
                </span>
              </li>
              <li className="mb-[7px] text-md">
                <span>Invoice Date: </span>
                <span className="text-black dark:text-white">
                  {formattedDate(invoice.invoice_creation_date)}
                </span>
              </li>
            </ul>
          </div>
          <h4>Bill</h4>
          <div className="mt-[20px] sm:mt-0">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] text-md">
                Patient ID:{" "}
                <span className="text-black text-md dark:text-white">
                  {invoice.patient_id}
                </span>
              </li>
              <li className="mb-[7px] text-md">
                Patient Name:{" "}
                <span className="text-black text-md dark:text-white">
                  {invoice.patient?.patient_name}
                </span>
              </li>
              <li className="mb-[7px] text-md">
                <span>Previous Session: </span>
                <span className="text-black dark:text-white">
                  {invoice?.previous_session_date
                    ? formattedDate(invoice.previous_session_date)
                    : "N/A"}
                </span>
              </li>
              <li className="mb-[7px] text-md">
                <span>Next Session: </span>
                <span className="text-black dark:text-white">
                  {invoice?.next_session_date
                    ? formattedDate(invoice.next_session_date)
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Treatments Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="text-gray-500 dark:text-gray-400 text-base font-normal text-left py-[14px] px-[20px] border-t border-b">
                  Treatment Name
                </th>
                <th className="text-gray-500 dark:text-gray-400 text-base font-normal text-left py-[14px] px-[20px] border-t border-b">
                  Treatment Cost
                </th>
                <th className="text-gray-500 dark:text-gray-400 text-base font-normal text-left py-[14px] px-[20px] border-t border-b">
                  Discounted Amount
                </th>
                <th className="text-gray-500 dark:text-gray-400 text-base font-normal text-left py-[14px] px-[20px] border-t border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-500 dark:text-white">
              {treatments.map((treatment, index) => (
                <tr key={index}>
                  <td className="px-[20px] py-[18px] font-semibold">
                    {treatment.treatment_name}
                  </td>
                  <td className="px-[20px] py-[18px] font-semibold">
                    {treatment.treatment_cost}
                  </td>
                  <td className="px-[20px] py-[18px] font-semibold">
                    {treatment.payable_treatment_amount}
                  </td>
                  <td className="px-[20px] py-[18px] font-semibold">
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove treatment"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </td>
                </tr>
              ))}

              {/* Separator */}
              <tr>
                <td colSpan={4} className="border-b"></td>
              </tr>

              {/* Totals Section */}
              <tr className="font-semibold text-black dark:text-white">
                <td></td>
                <td></td>
                <td className="text-right">Total Treatment Cost:</td>
                <td>{totalTreatmentCost.toFixed(2)} /=</td>
              </tr>
              <tr className="font-semibold text-black dark:text-white">
                <td></td>
                <td></td>
                <td className="text-right">Doctor Fee:</td>
                <td>{invoice.doctor_fee.toFixed(2)} /=</td>
              </tr>
              <tr className="font-semibold text-black dark:text-white">
                <td></td>
                <td></td>
                <td className="text-right">Previous Due:</td>
                <td>{invoice.previous_due.toFixed(2)} /=</td>
              </tr>

              {/* Total Cost */}
              <tr>
                <td colSpan={4} className="border-b"></td>
              </tr>
              <tr className="font-semibold text-black dark:text-white">
                <td></td>
                <td></td>
                <td className="text-right">Total Cost:</td>
                <td>{totalCost.toFixed(2)} /=</td>
              </tr>

              {/* Payment Section */}
              <tr className="font-semibold text-black dark:text-white">
                <td className="flex gap-3">
                  <select
                    value={paymentInfo.payment_type}
                    onChange={handleChange}
                    name="payment_type"
                    className="h-[40px] rounded-md border px-[17px]"
                  >
                    <option value="">Payment Type</option>
                    <option value="Partial">Partial</option>
                    <option value="Full">Full</option>
                    <option value="Due">Due</option>
                  </select>
                  <select
                    onChange={handleChange}
                    value={paymentInfo.payment_method}
                    name="payment_method"
                    className="h-[40px] rounded-md border px-[17px]"
                  >
                    <option value="">Payment Method</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Cash">Cash</option>
                  </select>
                </td>
                <td></td>
                <td className="text-right">Paid Amount:</td>
                <td>
                  <input
                    type="number"
                    name="paid_amount"
                    placeholder="Amount"
                    onChange={handleChange}
                    value={paymentInfo.paid_amount}
                    min={0}
                    max={totalCost}
                    step="0.01"
                    className="h-[40px] rounded-md border px-[10px] w-[120px]"
                  />
                </td>
              </tr>

              {/* Final Separator */}
              <tr>
                <td colSpan={4} className="border-b-2 pt-5"></td>
              </tr>

              {/* Total Due */}
              <tr className="font-bold text-lg text-black dark:text-white">
                <td></td>
                <td></td>
                <td className="text-right">Total Due:</td>
                <td className="text-green-600">{totalDue.toFixed(2)} /=</td>
              </tr>
            </tbody>
          </table>

          {/* Buttons */}
          <div className="mt-10 flex items-center justify-end gap-4">
            <button
              type="button"
              className="font-medium bg-gray-500 text-white px-[20px] py-[10px] rounded-md"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="font-medium bg-primary-500 text-white px-[20px] py-[10px] rounded-md disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInvoice;

"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import BarcodeComponent from "@/components/Doctor/BarCodeComponent";
import numberToWords from "@/components/Doctor/NumberToWords";

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
    date_of_birth: Date;
    address_line1: string;
    city: string;
    state_province: string;
    postal_code: string;
    gender: string;
    set_next_appoinmnet: Date;
    status: string;
    mobile_number: string;
  };
}

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const totatTreatmentCost: number = treatments.reduce(
    (acc, item) => acc + item.payable_treatment_amount,
    0
  );

  const calculateAge = (dateOfBirth?: Date): string => {
    if (!dateOfBirth) return "-";
    const now = new Date();
    const birthDate = new Date(dateOfBirth);
    const ageInMilliseconds = now.getTime() - birthDate.getTime();
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const remainingAfterYears = ageInMilliseconds % (1000 * 60 * 60 * 24 * 365.25);
    const ageInMonths = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44));
    const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);
    const ageInDays = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
    return `${ageInYears}Y ${ageInMonths}M ${ageInDays}D`;
  };

  const formattedDate = (dateInput?: string | Date | null): string => {
    if (!dateInput) return "-";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "-";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoice/view-invoice/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { treatments, invoice } = data;
        setTreatments(treatments);
        setInvoice(invoice);
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
      });
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      const element = invoiceRef.current;
      const opt = {
        margin: 0,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" as const },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const element = invoiceRef.current;
      const opt = {
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" as const },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          const pdfObject = pdf as { output: (type: string) => Blob };
          const blob = URL.createObjectURL(pdfObject.output("blob"));
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = blob;
          document.body.appendChild(iframe);
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        });
    }
  };

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

      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
        >
          Print
        </button>
      </div>

      <div style={{ display: "none" }}>
        {/* THIS IS THE UPDATED SECTION FOR THE PDF TEMPLATE */}
        <div ref={invoiceRef} className="bg-white">
          <style>
            {`
              .invoice-container {
                padding: 0.25in 1in 0.25in 1in;
                font-size: 10px;
                color: #000;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                min-height: 8.27in;
              }
              .invoice-header, .invoice-footer, .invoice-section {
                width: 100%;
              }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .justify-center { justify-content: center; }
              .items-center { align-items: center; }
              .mt-4 { margin-top: 1rem; }
              .w-1/3 { width: 33.3333%; }
              .border-t { border-top: 1px solid #000; }
              .info-grid {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 0 1rem;
              }
              .info-grid > dt { font-weight: bold; }
              .table-invoice { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              
              .table-invoice th {
                padding: 8px 4px 16px 4px;
                border-top: 1px solid #000; 
                border-bottom: 1px solid #000;
                
              }

              .table-invoice td { 
                padding: 4px 8px; 
              }
              
              .paid-stamp {
                border: 2px solid #000;
                color: #000;
                font-size: 1rem;
                font-weight: bold;
                display: flex;
                align-items: top;
                justify-content: center;
                width: 70px;
                height: 40px;
                opacity: 0.8;
                
              }
              .due-stamp {
                border: 2px solid #000;
                color: #000;
                font-size: 1rem;
                font-weight: bold;
                display: flex;
                align-items: top;
                justify-content: center;
                width: 70px;
                height: 40px;
                opacity: 0.8;
             
              }

                align-items: top;
                justify-content: center;
                width: 70px;
                height: 40px;
                opacity: 0.8;
                position: absolute;
                left: 1in;
                bottom: 2in;
              }
              .summary-table {
                width: 250px;
                margin-left: auto;
                font-size: 10px;
              }
              .summary-table td {
                padding: 2px 5px;
              }

              .summary-row-padded td {
                padding-top: 6px;
                padding-bottom: 6px;
              }
              .summary-row-paddedd td {
                padding-top: 8px;
                padding-bottom: 8px;
              }
            `}
          </style>
          <div className="invoice-container">
            {/* Header */}
            <div className="invoice-header text-center">
              <div className="flex justify-center">
                <Image src="/images/logo.png" alt="logo" width={120} height={40} />
              </div>
              <div className="text-xs">21 Shyamoli, Mirpur Road, Dhaka-1207 Bangladesh, Phone: 09666700100, Hotline: 10633</div>
            </div>

            {/* Barcodes and HN */}
            <div className="invoice-section mt-4">
              <div className="flex justify-between items-center">
                <BarcodeComponent value={invoice.invoice_number} width={1.5} height={25} />
                <div className="text-center mt-2">
                  <span className="font-bold text-lg">HN : {invoice.invoice_number}</span>
                </div>
                <BarcodeComponent value={invoice.invoice_number} width={1.5} height={25} />
              </div>
            </div>
            {/* rtes  */}
            {/* Patient and Invoice Info */}
            <div className="invoice-section mt-4 flex justify-between">
              {/* Left Column */}
              <div className="w-1/3">
                <dl className="info-grid">
                  <dt>Bill ID.</dt><dd>: {invoice.invoice_number}</dd>
                  <dt>Name</dt><dd>: {invoice.patient?.patient_name || 'N/A'}</dd>
                  <dt>Age</dt><dd>: {calculateAge(invoice.patient?.date_of_birth)}</dd>
                  <dt>Address</dt><dd>: {invoice.patient?.address_line1 || ''}, {invoice.patient?.city || ''}, {invoice.patient?.state_province || ''}, {invoice.patient?.postal_code || ''}</dd>
                </dl>
              </div>
              {/* Middle Column */}
              <div className="w-1/3">
                <dl className="info-grid">
                  <dt>Date</dt><dd>: {formattedDate(invoice.invoice_creation_date)}</dd>
                  <dt>Gender</dt><dd>: {invoice.patient?.gender || ''}</dd>
                </dl>
              </div>
              {/* Right Column  */}
              <div className="w-1/3">
                <dl className="info-grid">
                  <dt></dt><dd className="font-bold">ORIGINAL COPY</dd>
                  <dt>Patient Phone No.</dt><dd>: {invoice.patient?.mobile_number}</dd>
                  <dt>Next App. Date</dt><dd>: {formattedDate(invoice.patient?.set_next_appoinmnet)}</dd>
                  <dt>Payment Type</dt><dd>: {invoice.payment_type}</dd>
                  <dt>Payment Method</dt><dd>: {invoice.payment_method}</dd>
                </dl>
              </div>
            </div>

            {/* Main Content: Table and Summary */}
            <div className="invoice-section mt-2 flex-grow relative">
              <table className="table-invoice">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Service Name</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment, i) => (
                    <tr key={i}>
                      <td>{treatment.treatment_name}</td>
                      <td style={{ textAlign: 'right' }}>{treatment.payable_treatment_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Doctor Fee</td>
                    <td style={{ textAlign: 'right' }}>{invoice.doctor_fee.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>



              <div className="mt-4 flex justify-between items-end">
                <div>
                  {/* paid or due stamp  */}
                  {(totatTreatmentCost + invoice.doctor_fee + invoice.previous_due - invoice.paid_amount) === 0 ? (
                    <div className="paid-stamp">PAID</div>
                  ) : (
                    <div className="due-stamp">DUE</div>
                  )}
                  <p><span className="font-bold">In Word:</span> Taka - {numberToWords(invoice.paid_amount)} Only</p>
                  <p className="mt-2"><span className="font-bold">Prepared By:</span> DRS DERMA</p>
                </div>
                <div className="summary-table">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td>Total Treatment Cost:</td><td style={{ textAlign: 'right' }}>BDT. {totatTreatmentCost}</td></tr>
                      <tr><td>Previous Due:</td><td style={{ textAlign: 'right' }}>BDT. {invoice.previous_due}</td></tr>
                      <tr><td >Total Cost:</td><td style={{ textAlign: 'right' }}>BDT. {totatTreatmentCost + invoice.doctor_fee + invoice.previous_due}</td></tr>
                      <tr><td ></td><td style={{ textAlign: 'right' }}></td></tr>

                      <tr className="border-t summary-row-padded">
                        <td className="font-bold">Paid Amount:</td>
                        <td className="font-bold" style={{ textAlign: 'right' }}>BDT. {invoice.paid_amount}</td>
                      </tr>
                      <tr className="border-t summary-row-padded">
                        <td className="font-bold">Due Tk.</td>
                        <td className="font-bold" style={{ textAlign: 'right' }}>BDT. {totatTreatmentCost + invoice.doctor_fee + invoice.previous_due - invoice.paid_amount}</td>
                      </tr>

                      <tr><td colSpan={2} style={{ borderTop: "1px solid #000" }}></td></tr>
                      <tr><td colSpan={2} style={{ borderTop: "1px solid #000" }}></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-footer mt-auto pt-4 flex justify-between items-center">
              <div>
                <p className="font-bold" style={{ borderTop: '1px solid #000', paddingTop: '2px' }}>Billing Officer</p>
              </div>
              <div>
                <p className="text-xs">Software By: MSSL.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      {/* THIS IS THE ORIGINAL FRONTEND DISPLAY SECTION (UNCHANGED) */}
      <div>
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
                <tr className="mt-5 text-black">
                  <td className="p-3"></td>
                  <td className="p-3 pl-6">Doctor Fee: </td>
                  <td className="p-3 pl-6">Tk. {invoice.doctor_fee}</td>
                </tr>
                <tr className="mt-5 text-black">
                  <td className="p-3"></td>
                  <td className="p-3 pl-6">Previous Due: </td>
                  <td className="p-3 pl-6">Tk. {invoice.previous_due}</td>
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
                    Tk. {totatTreatmentCost + invoice.doctor_fee + invoice.previous_due}
                  </td>
                </tr>
                <tr className="mt-5 font-semibold text-black">
                  <td className="p-3 pl-6 flex gap-3">
                    <div className="text-sm">
                      Payment Type: <span className="font-medium">{invoice.payment_type}</span>
                    </div>
                    <div className="text-sm">
                      Payment Method: <span className="font-medium">{invoice.payment_method}</span>
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
                    Tk. {totatTreatmentCost + invoice.doctor_fee + invoice.previous_due - invoice.paid_amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewInvoice;
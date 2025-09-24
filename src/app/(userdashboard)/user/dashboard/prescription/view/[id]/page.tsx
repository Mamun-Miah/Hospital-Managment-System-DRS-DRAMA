"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRef, useCallback } from "react";
import html2pdf from "html2pdf.js";
import BarcodeComponent from "@/components/Doctor/BarCodeComponent";

export interface Prescription {
  prescription_id: number;
  prescribed_at: string;
  is_prescribed: "Yes" | "No";
  is_drs_derma: "Yes" | "No";
  total_cost: number;
  patient_id: number;
  doctor_id: number;
  patient: Patient;
  doctor: Doctor;
  doctor_discount_type: "Flat" | "Percentage" | "None" | null;
  doctor_discount_value: number | null;
  payable_doctor_amount: number | null;
  prescribed_doctor_name: string;
  advise: string | null;
  next_visit_date: string | null;
  items: PrescriptionItem[];
  treatmentItems: TreatmentItem[];
  on_examination_oe: string;
  relevant_findings_rf: string;
  drug_history_dh: string;
  chief_complaint_cc: string;
  prescribed_at_time?: string;
}

export interface Patient {
  patient_name: string;
  city: string;
  mobile_number: string;
  gender: "Male" | "Female" | "Other";
  age: string;
  blood_group: string;
  weight: string;
}

export interface Doctor {
  doctor_name: string;
  phone_number: string;
  specialization: string;
  designation: string;
}

export interface PrescriptionItem {
  item_id: number;

  dose_morning: string | null;
  dose_mid_day: string | null;
  dose_night: string | null;
  duration_days: number | null;
  medicine_name: string | null;
}

export interface TreatmentItem {
  id: number;
  discount_type: "Flat" | "Percentage" | "None";
  discount_value: number;
  payable_treatment_amount: number;
  treatment_name: string;
  duration_months: number;
  session_number: string;
  next_treatment_session_interval_date: string;
}

interface DownloadPDFButtonProps {
  prescriptionRef: React.MutableRefObject<HTMLDivElement | null>;
  prescriptionsData: Prescription | null;
}

function DownloadPDFButton({
  prescriptionRef,
  prescriptionsData,
}: DownloadPDFButtonProps) {
  const handleDownloadPDF = useCallback(() => {
    if (!prescriptionRef.current) return;

    const element = prescriptionRef.current;

    const patientName =
      prescriptionsData?.patient.patient_name || "prescription";
    const dateStr = prescriptionsData?.prescribed_at;
    // ? new Date(prescriptionsData.prescribed_at).toISOString().split("T")[0]
    // : new Date().toISOString().split("T")[0];
    const filename = `${patientName.replace(/\s+/g, "_")}_${dateStr}.pdf`;

    const opt = {
      margin: [0, 5, 0, 10], // mm
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] as never },
    };

    // Disable the button visually could be added here if desired
    try {
      html2pdf().set(opt).from(element).save();
    } catch (err: unknown) {
      console.error("PDF generation failed:", err);
    }
  }, [prescriptionRef, prescriptionsData]);

  return (
    <button
      type="button"
      onClick={handleDownloadPDF}
      className="font-medium inline-block transition-all rounded-md md:text-md py-[8px] px-[20px] md:px-[22px] bg-secondary-500 text-white hover:bg-secondary-400 mx-[8px]"
      aria-label="Download Prescription as PDF"
    >
      <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
        <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
          download
        </i>
        Download PDF
      </span>
    </button>
  );
}

export default function Page() {
  const [prescriptionsData, setPrescriptionsData] =
    useState<Prescription | null>(null);
  const prescriptionRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const prescriptionId = params?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = async () => {
    if (!prescriptionRef.current) return;

    const element = prescriptionRef.current;

    const patientName =
      prescriptionsData?.patient.patient_name || "prescription";
    const dateStr =
      prescriptionsData?.prescribed_at ||
      new Date().toISOString().split("T")[0];
    const filename = `${patientName.replace(/\s+/g, "_")}_${dateStr}.pdf`;

    const opt = {
      margin: [0, 5, 0, 10], // mm
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] as never },
    };

    try {
      const worker = html2pdf().set(opt).from(element);

      // Generate PDF and get Blob
      await worker.toPdf();
      const pdf = (await worker.get("pdf")) as {
        output: (type: string) => Blob;
      };
      const blob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Popup blocked. Please allow popups to print the prescription.");
        return;
      }

      printWindow.document.write(`
      <html>
        <head>
          <title>Print Prescription</title>
          <style>
            html, body { margin: 0; padding: 0; height: 100%; }
            iframe { border: none; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <iframe id="pdfFrame" src="${blobUrl}"></iframe>
          <script>
            const iframe = document.getElementById("pdfFrame");
            iframe.onload = function() {
              setTimeout(() => {
                try {
                  iframe.contentWindow.focus();
                  iframe.contentWindow.print();
                } catch (e) {
                  window.print();
                }
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    } catch (err) {
      console.error("Print PDF generation failed:", err);
      if (document.fonts) {
        document.fonts.ready.then(() => window.print());
      } else {
        window.print();
      }
    }
  };

  useEffect(() => {
    if (!prescriptionId) return;

    const fetchPrescriptionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/prescription/view-prescription/${prescriptionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch prescription");
        }
        const data = await response.json();

        setPrescriptionsData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [prescriptionId]);

  if (loading) return <p>Loading prescription...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!prescriptionsData || !prescriptionsData.patient) {
    return <div>Loading...</div>;
  }

  console.log("prescriptionsData", prescriptionsData);

  return (
    <>
      <div className="p-5 mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Prescriptions</h5>

        <div>
          <button
            type="button"
            onClick={handlePrint}
            // className="font-medium inline-block transition-all rounded-md md:text-md py-[8px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px]"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[8px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px]"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                print
              </i>
              Print
            </span>
          </button>
          <DownloadPDFButton
            prescriptionRef={prescriptionRef}
            prescriptionsData={prescriptionsData}
          />
        </div>
      </div>

      <div
        id="prescription-view"
        className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md"
      >
        <div className="trezo-card-content">
          <div className="sm:flex justify-between">
            <div className="mt-8">
              <h4 className="!mb-[7px] !text-[20px] !font-semibold">
                {prescriptionsData.is_drs_derma === "Yes"
                  ? "DRS DERMA"
                  : prescriptionsData?.doctor?.doctor_name}
              </h4>
              <span className="block md:text-md mt-[5px]">
                {prescriptionsData.is_drs_derma === "Yes"
                  ? ""
                  : prescriptionsData?.doctor?.designation}
              </span>
              <div className="sm:flex justify-between mt-[10px]">
                <ul className="mb-[7px] sm:mb-0">
                  <li className="mb-[7px] last:mb-0">
                    <span className="text-black dark:text-white">
                      {prescriptionsData?.doctor?.specialization ?? ""}
                    </span>
                  </li>
                  {/* <li className="mb-[7px] last:mb-0">
                        Degree:{" "}
                        <span className="text-black dark:text-white">{prescriptionsData?.doctor?.doctor_degree?? ""}</span>
                      </li>
                      <li className="mb-[7px] last:mb-0">
                        Address:{" "}
                        <span className="text-black dark:text-white">{prescriptionsData?.patient.city?? ""}</span>
                      </li>
                      <li className="mb-[7px] last:mb-0">
                        Mobile Number:{" "}
                        <span className="text-black dark:text-white">{prescriptionsData?.patient.mobile_number?? ""}</span>
                      </li> */}
                </ul>
              </div>
            </div>

            <div className="mt-[20px] sm:mt-0">
              <Image
                src="/images/logo.png"
                alt="logo"
                className="mb-[10px] dark:hidden"
                width={100}
                height={26}
              />
              <Image
                src="/images/white-logo.svg"
                alt="logo"
                className="mb-[10px] hidden dark:block"
                width={100}
                height={26}
              />

              <span className="block md:text-md mt-[5px]">
                Dhaka, Bangladesh
              </span>
              <span className="block md:text-md mt-[5px]">+880 1234567891</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] my-[20px]"></div>
          <span className="block font-semibold text-black dark:text-white text-[20px]">
            Patient Info:
          </span>

          <div className="sm:flex justify-between mt-[10px]">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                ID:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient_id ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Name:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.patient_name ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Address:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.city ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Mobile Number:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.mobile_number ?? ""}
                </span>
              </li>
            </ul>
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                Gender :{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.gender ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Age:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.age ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Blood Group:{" "}
                <span className="text-black dark:text-white">
                  {prescriptionsData?.patient.blood_group ?? ""}
                </span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Weight:
                <span className="text-black dark:text-white">
                  {" "}
                  {prescriptionsData?.patient.weight ?? ""} KG
                </span>
              </li>
            </ul>
            <div>
              <span className="block text-black dark:text-white font-semibold">
                Date: {prescriptionsData?.prescribed_at ?? ""}
              </span>
              <span className="block text-black dark:text-white font-semibold mt-3">
                Next Date: {prescriptionsData?.next_visit_date ?? ""}
              </span>
            </div>
          </div>
          <h4 className="mt-10 underline">R/X</h4>
          <span className="block mt-6 font-semibold text-black dark:text-white text-[20px]  mb-2">
            Treatments:
          </span>

          <div className="lg:w-4/5 md:-mx-[25px] px-2  ">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full  mb-12 border-collapse">
                <thead>
                  <tr className="bg-gray-50  dark:bg-[#15203c]">
                    <th className="text-left text-gray-600 dark:text-gray-300 py-3 px-4 border-b border-gray-200 dark:border-[#1f2a48]">
                      Treatment Name
                    </th>
                    <th className="text-left text-gray-600 dark:text-gray-300 py-3 px-4 border-b border-gray-200 dark:border-[#1f2a48]">
                      Session Number
                    </th>
                    <th className="text-left text-gray-600 dark:text-gray-300 py-3 px-4 border-b border-gray-200 dark:border-[#1f2a48]">
                      Next Session Interval
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm text-black dark:text-white">
                  {prescriptionsData.treatmentItems.map((treatment, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-[#1b253b] dark:even:bg-[#1e2a47]"
                    >
                      <td className="text-left py-2 px-4 border-b border-gray-100 dark:border-[#2a3a5b]">
                        {treatment.treatment_name}
                      </td>
                      <td className="text-left py-2 px-4 border-b border-gray-100 dark:border-[#2a3a5b]">
                        {treatment.session_number}
                      </td>
                      <td className="text-left py-2 px-4 border-b border-gray-100 dark:border-[#2a3a5b]">
                        {treatment.next_treatment_session_interval_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <span className="block font-semibold text-black dark:text-white text-[20px] mt-[0px] mb-2">
            Medicines:
          </span>

          <div className="-mx-[20px] md:-mx-[25px]">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Medicine Name
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Dosage
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Duration
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  {prescriptionsData.items
                    .filter((item) => item.medicine_name !== null) // Only render medicines
                    .map((item, index) => {
                      const dosageParts = [];
                      if (item.dose_morning)
                        dosageParts.push(`${item.dose_morning} Morning`);
                      if (item.dose_mid_day)
                        dosageParts.push(`${item.dose_mid_day} Midday`);
                      if (item.dose_night)
                        dosageParts.push(`${item.dose_night} Night`);
                      const dosage = dosageParts.join(" - ") || "N/A";

                      return (
                        <tr key={item.item_id}>
                          <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                            {index + 1}. {item.medicine_name}
                          </td>
                          <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                            {dosage}
                          </td>
                          <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                            {item.duration_days
                              ? `${item.duration_days} Days`
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] lg:mt-[32px]"></div>
          {/* C/C (Chief Complaint) */}
          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            <h5 className="">C/C (Chief Complaint)</h5>
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              {prescriptionsData?.chief_complaint_cc ?? ""}
            </li>
          </ul>

          {/* D/H (Drug History)     */}
          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            <h5>D/H (Drug History)</h5>
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              {prescriptionsData?.drug_history_dh ?? ""}
            </li>
          </ul>

          {/* R/F (Relevant Findings) */}
          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            <h5>R/F (Relevant Findings)</h5>
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              {prescriptionsData?.relevant_findings_rf ?? ""}
            </li>
          </ul>
          {/* O/E (On Examination) */}
          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            <h5>O/E (On Examination)</h5>
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              {prescriptionsData?.on_examination_oe ?? ""}
            </li>
          </ul>
          {/* advise given            */}
          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            <h5>Advice Given:</h5>
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              {prescriptionsData?.advise ?? ""}
            </li>
          </ul>

          {/* <div className="max-w-[255px] ltr:pr-[25px] rtl:pl-[25px] ltr:md:ml-auto rtl:md:mr-auto mt-[20px] md:mt-[25px]">
            <div className="text-center mb-[15px] md:mb-[20px] pb-[5px] border-b border-gray-100 dark:border-[#15203c]">
              <Image
                src="/images/signature.svg"
                className="inline-block dark:invert"
                alt="signature"
                width={77}
                height={38}
              />
            </div>

            <span className="block text-black dark:text-white font-semibold">
              {prescriptionsData?.doctor?.doctor_name ?? "N/A"}
            </span>

            <span className="block text-xs mt-[5px]">
              MBBS, MD, MS (Reg No: 321456)
            </span>
          </div> */}
        </div>
      </div>

      {/* prescription pdf starts here  */}
      <div className="pdf-only" style={{ display: "none" }}>
        <div
          id="prescription-pdf"
          ref={(el) => {
            prescriptionRef.current = el;
          }}
          className="bg-white text-black p-6 md:p-8 rounded-md shadow-sm"
          style={{
            display: "flex",
            flexDirection: "column",
            // A4 height in portrait mode is 297mm.
            // We use a value slightly less to account for margins.
            // This ensures the footer is pushed to the bottom of the page.
            minHeight: "287mm",
          }}
        >
          <div style={{ flex: "1 0 auto" }}>
            {/* Main Content */}
            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-start">
              {/* Doctor Info */}
              <div className="max-w-[70%]">
                <h2 className="text-lg font-bold">
                  {prescriptionsData?.doctor?.doctor_name}
                </h2>
                <p className="text-sm">
                  {prescriptionsData?.doctor?.designation}
                </p>
                <p className="text-sm">
                  {prescriptionsData?.doctor?.specialization}
                </p>
              </div>

              {/* Hospital Logo */}
              <div className="mt-4 mr-2 md:mt-0">
                <div>
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={120}
                    height={40}
                  />
                </div>

                <div className="text-sm">
                  Trusted Center for Skin,
                  <br /> Hair & Sexual Health{" "}
                </div>
              </div>
            </div>

            {/* Patient + Visit Info */}
            <div className="flex flex-col md:flex-row justify-between mt-6">
              {/* Left */}
              <div>
                <BarcodeComponent
                  value={`${prescriptionsData?.prescription_id}`}
                  width={3}
                  height={25}
                />
                <div>
                  <strong>Patient ID:</strong> {prescriptionsData?.patient_id}
                </div>
                <div>
                  <strong>Name:</strong>{" "}
                  {prescriptionsData?.patient.patient_name}
                </div>
                <div>
                  <strong>Age:</strong> {prescriptionsData?.patient.age}
                </div>
                <div>
                  <strong>Address:</strong> {prescriptionsData?.patient.city}
                </div>
              </div>

              {/* Right */}
              <div className="mt-4 md:mt-0">
                <BarcodeComponent
                  value={`${prescriptionsData?.prescription_id}`}
                  width={3}
                  height={25}
                />
                <div>
                  <strong>Prescription ID:</strong>{" "}
                  {prescriptionsData?.prescription_id}
                </div>
                <div>
                  <strong>Visit Date:</strong>{" "}
                  {prescriptionsData?.prescribed_at}
                </div>
                <div>
                  <strong>Visit Time:</strong>{" "}
                  {prescriptionsData?.prescribed_at_time}
                </div>
                <div>
                  <strong>Gender:</strong> {prescriptionsData?.patient.gender}
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Prescription Body */}
            <div className="flex flex-col md:flex-row relative min-h-[400px]">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 bg-white px-2 font-bold ml-6">
                Rx
              </div>

              {/* Left Column */}
              {/* <div className="flex-1 pr-4 border-r border-gray-300"> */}
              <div className="flex-1 pr-4 border-r border-gray-300 flex flex-col">
                <div className="flex-1">
                  {/* Chief Complaint */}
                  {prescriptionsData?.chief_complaint_cc && (
                    <>
                      <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
                        <h6>
                          <strong>C/C (Chief Complaint)</strong>
                        </h6>
                      </span>
                      <ul className="mt-[7px]">
                        <li className="relative ltr:pl-[15px]">
                          {prescriptionsData.chief_complaint_cc}
                        </li>
                      </ul>
                    </>
                  )}

                  {/* Drug History */}
                  {prescriptionsData?.drug_history_dh && (
                    <>
                      <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
                        <h6>
                          <strong>D/H (Drug History)</strong>
                        </h6>
                      </span>
                      <ul className="mt-[7px]">
                        <li className="relative ltr:pl-[15px]">
                          {prescriptionsData.drug_history_dh}
                        </li>
                      </ul>
                    </>
                  )}

                  {/* Relevant Findings */}
                  {prescriptionsData?.relevant_findings_rf && (
                    <>
                      <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
                        <h6>
                          <strong>R/F (Relevant Findings)</strong>
                        </h6>
                      </span>
                      <ul className="mt-[7px]">
                        <li className="relative ltr:pl-[15px]">
                          {prescriptionsData.relevant_findings_rf}
                        </li>
                      </ul>
                    </>
                  )}

                  {/* On Examination */}
                  {prescriptionsData?.on_examination_oe && (
                    <>
                      <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
                        <h6>
                          <strong>O/E (On Examination)</strong>
                        </h6>
                      </span>
                      <ul className="mt-[7px]">
                        <li className="relative ltr:pl-[15px]">
                          {prescriptionsData.on_examination_oe}
                        </li>
                      </ul>
                    </>
                  )}

                  {/* Advice */}
                  {prescriptionsData?.advise && (
                    <>
                      <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
                        <h6>
                          <strong>Advice Given:</strong>
                        </h6>
                      </span>
                      <ul className="mt-[7px]">
                        <li className="relative ltr:pl-[15px]">
                          {prescriptionsData.advise}
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <br />
              {/* <div className="flex-1 pl-4 mt-3"> */}
              <div className="flex-1 pl-4 mt-3 flex flex-col">
                <div className="flex-1">
                  <ul>
                    {prescriptionsData?.treatmentItems?.map((t, i) => (
                      <li key={i}>
                        • {t.treatment_name}({t.session_number}) - Next session:{" "}
                        {t.next_treatment_session_interval_date}
                      </li>
                    ))}
                  </ul>
                  {prescriptionsData.items.map((item, i) => (
                    <div key={i} className="flex">
                      • {item.medicine_name}, ({item.dose_morning || "0"}+
                      {item.dose_mid_day || "0"}+{item.dose_night || "0"}) -{" "}
                      {item.duration_days ? `${item.duration_days} days` : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            {/* Footer */}
            <div className="text-right">
              <div className="italic">Electronic Signature</div>
              <div className="font-bold">
                {prescriptionsData?.doctor?.doctor_name}
              </div>
            </div>
            <hr className="my-4 border-gray-300" />

            {/* Left Side - Footer Info */}
            <div className="text-center">
              <div className="font-bold">DRS DERMA</div>
              <div>
                7/A, Main Road, Mohammadia Housing Society, Mohammadpur, Dhaka,
                Bangladesh, 1207
              </div>
              <div>
                <span className="font-semibold">Phone:</span>
                <span>+880 1670 600067 | </span>
                <span className="font-semibold">Email:</span>
                <span>info@drsdermabd.com</span>
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-300">
              Software by: mapleitfirm.com
            </div>
            {/* Left Side - Footer Info ENDS*/}
          </div>
        </div>
      </div>
    </>
  );
}

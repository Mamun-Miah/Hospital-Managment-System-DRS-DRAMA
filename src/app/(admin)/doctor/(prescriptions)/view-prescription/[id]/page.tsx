// import Prescriptions from "@/components/Doctor/Prescriptions";
"use client";
import Image from "next/image";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "./PrescriptionPDF";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";



export interface Prescription {
  prescription_id: number;
  prescribed_at: string; // ISO date string, e.g., "2025-07-24"
  is_prescribed: "Yes" | "No";
  is_drs_derma: "Yes" | "No";
  total_cost: number;
  patient_id: number;
  doctor_id: number;
  patient: Patient;
  doctor: Doctor;
  items: PrescriptionItem[];
  treatmentItems: TreatmentItem[];
}

export interface Patient {
  patient_name: string;
  city: string;
  mobile_number: string;
  gender: "Male" | "Female" | "Other";
  age: string; // or number if age is numeric
  blood_group: string;
  weight: string; // or number if weight is numeric
}

export interface Doctor {
  doctor_name: string;
  phone_number: string;
  specialization: string;
}

export interface PrescriptionItem {
  item_id: number;
  prescribed_doctor_name: string;
  doctor_discount_type: "Flat" | "Percentage" | "None" | null;
  doctor_discount_value: number | null;
  payable_doctor_amount: number | null;
  advice: string | null;
  next_visit_date: string | null; // ISO date string or null
  dose_morning: string | null;
  dose_mid_day: string | null;
  dose_night: string | null;
  duration_days: number | null;
  is_prescribed: "Yes" | "No";
  medicine_name: string | null;
  advise:string | null;
}

export interface TreatmentItem {
  id: number;
  discount_type: "Flat" | "Percentage" | "None";
  discount_value: number;
  payable_treatment_amount: number;
  treatment_name: string;
  duration_months: number;
}



// const sampleData = {
//   medicines: [
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//     {
//       name: "Cap. Acetaminophen",
//       dosage: "1 Morning - 1 Midday - 1 Night",
//       duration: "10 Days",
      
//     },
//   ],
// };
export default function Page() {

const [prescriptionsData, setPrescriptionsData] = useState<Prescription | null>(null)
const [sampleData, setSampleData] = useState([])

const params = useParams();
const prescriptionId = params?.id;

  const handlePrint = async () => {
    const blob = await pdf(<PrescriptionPDF data={sampleData} />).toBlob();
    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL);
    printWindow?.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  };


  const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!prescriptionId) return;

  const fetchPrescriptionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/prescription/view-prescription/${prescriptionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prescription");
      }
      const data = await response.json();
      const sampleData = data.items[0];
      setSampleData(sampleData);
      console.log('sample DAta',sampleData)
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
  return <div>Loading...</div>; // or any loading state you want
}
console.log(prescriptionsData)

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Prescriptions</h5>

        <div>
          <button
            type="button"
            onClick={handlePrint}
            className="font-medium inline-block transition-all rounded-md md:text-md py-[8px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px]"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                print
              </i>
              Print
            </span>
          </button>

          <PDFDownloadLink
            document={<PrescriptionPDF data={sampleData} />}
            fileName="prescription.pdf"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[8px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px]"
          >
            {({ loading }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    download
                  </i>
                  Download
                </span>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      <div
        id="prescription"
        className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md"
      >
        <div className="trezo-card-content">
          <div className="sm:flex justify-between">
            <div className="mt-8">
              <h4 className="!mb-[7px] !text-[20px] !font-semibold">
                {prescriptionsData?.doctor?.doctor_name ?? "N/A"}
              </h4>
              <span className="block md:text-md mt-[5px]">
                {prescriptionsData?.doctor?.specialization ?? "MBBS, Medicine"}
              </span>
              <span className="block md:text-md mt-[5px] text-black dark:text-white">
               {prescriptionsData?.doctor?.phone_number ?? ""}
              </span>
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
            Patient:
          </span>

          <div className="sm:flex justify-between mt-[10px]">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                ID: <span className="text-black dark:text-white">{prescriptionsData?.patient_id?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Name:{" "}
                <span className="text-black dark:text-white">{prescriptionsData?.patient.patient_name?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Address:{" "}
                <span className="text-black dark:text-white">{prescriptionsData?.patient.city?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Mobile Number:{" "}
                <span className="text-black dark:text-white">{prescriptionsData?.patient.mobile_number?? ""}</span>
              </li>
            </ul>
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                Gender :{" "}
                <span className="text-black dark:text-white">{prescriptionsData?.patient.gender?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Age: <span className="text-black dark:text-white">{prescriptionsData?.patient.age?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Blood Group:{" "}
                <span className="text-black dark:text-white">{prescriptionsData?.patient.blood_group?? ""}</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Weight:
                <span className="text-black dark:text-white"> {prescriptionsData?.patient.weight?? ""} KG</span>
              </li>
            </ul>
            <div>
              <span className="block text-black dark:text-white font-semibold">
                Date: {prescriptionsData?.prescribed_at?? ""}
              </span>
              <span className="block text-black dark:text-white font-semibold mt-3">
                Next Date: {prescriptionsData?.items[0].next_visit_date?? ""}
              </span>
            </div>
          </div>

          <span className="block mt-16 font-semibold text-black dark:text-white text-[20px]  mb-3">
            Treatments:
          </span>

          <div className="lg:w-4/5 ] md:-mx-[25px] px-2  ">
            <div className="table-responsive overflow-x-auto">
            <table className="w-full  mb-12 border-collapse">
                  <thead>
                    <tr className="bg-gray-50  dark:bg-[#15203c]">
                      <th className="text-left text-gray-600 dark:text-gray-300 py-3 px-4 border-b border-gray-200 dark:border-[#1f2a48]">
                        Treatment Name
                      </th>
                      <th className="text-left text-gray-600 dark:text-gray-300 py-3 px-4 border-b border-gray-200 dark:border-[#1f2a48]">
                        Duration
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-black dark:text-white">
                    {prescriptionsData.treatmentItems.map((treatment, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-[#1b253b] dark:even:bg-[#1e2a47]">
                        <td className="text-left py-2 px-4 border-b border-gray-100 dark:border-[#2a3a5b]">
                          {treatment.treatment_name}
                        </td>
                        <td className="text-left py-2 px-4 border-b border-gray-100 dark:border-[#2a3a5b]">
                          {treatment.duration_months} Months
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


            </div>
          </div>
          <span className="block font-semibold text-black dark:text-white text-[20px] mt-[10px] mb-2">
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
                      if (item.dose_morning) dosageParts.push(`${item.dose_morning} Morning`);
                      if (item.dose_mid_day) dosageParts.push(`${item.dose_mid_day} Midday`);
                      if (item.dose_night) dosageParts.push(`${item.dose_night} Night`);
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
                            {item.duration_days ? `${item.duration_days} Days` : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>

              </table>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] lg:mt-[32px]"></div>

          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            Advice Given:
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              <span className="w-[7px] h-[7px] bg-gray-400 dark:bg-gray-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 rounded-full"></span>
               {prescriptionsData.items[0]?.advise || ""}
            </li>
          </ul>

          <div className="max-w-[255px] ltr:pr-[25px] rtl:pl-[25px] ltr:md:ml-auto rtl:md:mr-auto mt-[20px] md:mt-[25px]">
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
          </div>
        </div>
      </div>
    </>
  );
}

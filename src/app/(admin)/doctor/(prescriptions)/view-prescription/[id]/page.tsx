// import Prescriptions from "@/components/Doctor/Prescriptions";
"use client";
import Image from "next/image";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "./PrescriptionPDF";

const sampleData = {
  medicines: [
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
    {
      name: "Cap. Acetaminophen",
      dosage: "1 Morning - 1 Midday - 1 Night",
      duration: "10 Days",
      
    },
  ],
};
export default function Page() {
  const handlePrint = async () => {
    const blob = await pdf(<PrescriptionPDF data={sampleData} />).toBlob();
    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL);
    printWindow?.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  };

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
            <div>
              <h4 className="!mb-[7px] !text-[20px] !font-semibold">
                Dr. Walter White
              </h4>
              <span className="block md:text-md mt-[5px]">
                MBBS, MD, MS (Reg No: 321456)
              </span>
              <span className="block md:text-md mt-[5px] text-black dark:text-white">
                Mobile No: +321 4567 5643
              </span>
            </div>

            <div className="mt-[20px] sm:mt-0">
              {/* <Image
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
              /> */}

              <h3>DRS DERMA</h3>
              <span className="block md:text-md mt-[5px]">
                S. Arrowhead Court Branford9
              </span>
              <span className="block md:text-md mt-[5px]">+1 444 266 5599</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] my-[20px]"></div>

          <span className="block font-semibold text-black dark:text-white text-[20px]">
            Patient:
          </span>

          <div className="sm:flex justify-between mt-[10px]">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                ID: <span className="text-black dark:text-white">321456</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Name:{" "}
                <span className="text-black dark:text-white">Jane Ronan</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Address:{" "}
                <span className="text-black dark:text-white">Bradford, UK</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Mobile Number:{" "}
                <span className="text-black dark:text-white">+8801723847</span>
              </li>
            </ul>
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                Gender :{" "}
                <span className="text-black dark:text-white">Male</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Age: <span className="text-black dark:text-white">24</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Blood Group:{" "}
                <span className="text-black dark:text-white">O+</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Weight:
                <span className="text-black dark:text-white">55 kg</span>
              </li>
            </ul>
            <div>
              <span className="block text-black dark:text-white font-semibold">
                Date: 07 November, 2025
              </span>
              <span className="block text-black dark:text-white font-semibold mt-3">
                Next Date: 07 November, 2025
              </span>
            </div>
          </div>

          <span className="block font-semibold text-black dark:text-white text-[20px] mt-[20px] mb-3">
            Treatments:
          </span>

          <div className="lg:w-3/5 -mx-[20px] md:-mx-[25px] px-2">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className=" text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c] max-w-1/3">
                      Treatment Name
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="min-w-[170px] text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Duration
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top  whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      Chemotherapy
                    </td>
                    <td className="whitespace-nowrap px-[20px]"></td>
                    <td className="ltr:text-left rtl:text-right align-top  whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      6 Months
                    </td>
                  </tr>
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      Chemotherapy
                    </td>
                    <td className="whitespace-nowrap px-[20px]"></td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      6 Months
                    </td>
                  </tr>
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      Chemotherapy
                    </td>
                    <td className="whitespace-nowrap px-[20px]"></td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      6 Months
                    </td>
                  </tr>
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
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1. Tab. Ibuprofen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Night
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                    </td>
                  </tr>

                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      2. Cap. Acetaminophen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Midday - 1 Night
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                    </td>
                  </tr>
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      3. Cap. Acetaminophen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Midday - 1 Night
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                    </td>
                  </tr>
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      4. Cap. Acetaminophen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Midday - 1 Night
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                    </td>
                  </tr>
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      5. Cap. Acetaminophen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Midday - 1 Night
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                    </td>
                  </tr>
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
              Avoid oily and spicy food.
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
              Dr. Walter White
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

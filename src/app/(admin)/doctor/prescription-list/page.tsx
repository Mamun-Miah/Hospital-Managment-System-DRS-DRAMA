"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Prescription {
  prescriptionId: number;
  patientId: number;
  patientName: string;
  prescriptionDate: string;
  doctorName: string;
  diagnosis: string;
  numberOfMedicines: number;
}
const InvoiceList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      prescriptionId: 1001,
      patientId: 9001,
      patientName: "Jane Ronan",
      prescriptionDate: "2025-07-23",
      doctorName: "Dr. Walter White",
      diagnosis: "Chemotherapy",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1002,
      patientId: 9002,
      patientName: "Liam Carter",
      prescriptionDate: "2025-07-22",
      doctorName: "Dr. Amelia Hart",
      diagnosis: "Migraine",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1003,
      patientId: 9003,
      patientName: "Sofia Malik",
      prescriptionDate: "2025-07-21",
      doctorName: "Dr. Ethan Wood",
      diagnosis: "Diabetes Type II",
      numberOfMedicines: 4,
    },
    {
      prescriptionId: 1004,
      patientId: 9004,
      patientName: "Noah Sheikh",
      prescriptionDate: "2025-07-20",
      doctorName: "Dr. Olivia Bennett",
      diagnosis: "Asthma",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1005,
      patientId: 9005,
      patientName: "Emily Rhodes",
      prescriptionDate: "2025-07-19",
      doctorName: "Dr. Henry Brooks",
      diagnosis: "Hypertension",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1006,
      patientId: 9006,
      patientName: "Aiden Patel",
      prescriptionDate: "2025-07-18",
      doctorName: "Dr. Rachel Green",
      diagnosis: "Back Pain",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1007,
      patientId: 9007,
      patientName: "Chloe Morgan",
      prescriptionDate: "2025-07-17",
      doctorName: "Dr. Adam Khan",
      diagnosis: "Thyroid",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1008,
      patientId: 9008,
      patientName: "Ethan Clarke",
      prescriptionDate: "2025-07-16",
      doctorName: "Dr. Zoe Carter",
      diagnosis: "Flu",
      numberOfMedicines: 1,
    },
    {
      prescriptionId: 1009,
      patientId: 9009,
      patientName: "Maya Sen",
      prescriptionDate: "2025-07-15",
      doctorName: "Dr. Lucas Shaw",
      diagnosis: "Pneumonia",
      numberOfMedicines: 4,
    },
    {
      prescriptionId: 1010,
      patientId: 9010,
      patientName: "Benjamin Scott",
      prescriptionDate: "2025-07-14",
      doctorName: "Dr. Emma Field",
      diagnosis: "Arthritis",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1011,
      patientId: 9011,
      patientName: "Aria Fernandez",
      prescriptionDate: "2025-07-13",
      doctorName: "Dr. Daniel Lee",
      diagnosis: "Eczema",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1012,
      patientId: 9012,
      patientName: "Logan Thomas",
      prescriptionDate: "2025-07-12",
      doctorName: "Dr. Grace Kim",
      diagnosis: "Tonsillitis",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1013,
      patientId: 9013,
      patientName: "Isla Rehman",
      prescriptionDate: "2025-07-11",
      doctorName: "Dr. Oliver James",
      diagnosis: "Fever",
      numberOfMedicines: 1,
    },
    {
      prescriptionId: 1014,
      patientId: 9014,
      patientName: "Nathan Evans",
      prescriptionDate: "2025-07-10",
      doctorName: "Dr. Hazel Moore",
      diagnosis: "Sinus Infection",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1015,
      patientId: 9015,
      patientName: "Leah Kapoor",
      prescriptionDate: "2025-07-09",
      doctorName: "Dr. Ryan Ford",
      diagnosis: "PCOS",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1016,
      patientId: 9016,
      patientName: "Owen Hill",
      prescriptionDate: "2025-07-08",
      doctorName: "Dr. Layla Stone",
      diagnosis: "Insomnia",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1017,
      patientId: 9017,
      patientName: "Zara Ahmed",
      prescriptionDate: "2025-07-07",
      doctorName: "Dr. Samuel Wright",
      diagnosis: "Anxiety",
      numberOfMedicines: 1,
    },
    {
      prescriptionId: 1018,
      patientId: 9018,
      patientName: "Lucas West",
      prescriptionDate: "2025-07-06",
      doctorName: "Dr. Ivy Walsh",
      diagnosis: "Acne",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1019,
      patientId: 9019,
      patientName: "Ella Brown",
      prescriptionDate: "2025-07-05",
      doctorName: "Dr. Nathan Singh",
      diagnosis: "Ear Infection",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1020,
      patientId: 9020,
      patientName: "Mason Lee",
      prescriptionDate: "2025-07-04",
      doctorName: "Dr. Aisha Noor",
      diagnosis: "Vertigo",
      numberOfMedicines: 1,
    },
    {
      prescriptionId: 1021,
      patientId: 9021,
      patientName: "Grace Wilson",
      prescriptionDate: "2025-07-03",
      doctorName: "Dr. Caleb Ahmed",
      diagnosis: "Menstrual Pain",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1022,
      patientId: 9022,
      patientName: "Jack Mitchell",
      prescriptionDate: "2025-07-02",
      doctorName: "Dr. Nora Blake",
      diagnosis: "GERD",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1023,
      patientId: 9023,
      patientName: "Mila Green",
      prescriptionDate: "2025-07-01",
      doctorName: "Dr. Leo Grant",
      diagnosis: "Vitamin D Deficiency",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1024,
      patientId: 9024,
      patientName: "Daniel Young",
      prescriptionDate: "2025-06-30",
      doctorName: "Dr. Ruby Lane",
      diagnosis: "Allergy",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1025,
      patientId: 9025,
      patientName: "Hannah Das",
      prescriptionDate: "2025-06-29",
      doctorName: "Dr. Ethan Hale",
      diagnosis: "Kidney Stones",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1026,
      patientId: 9026,
      patientName: "Alex Rivera",
      prescriptionDate: "2025-06-28",
      doctorName: "Dr. Priya Sharma",
      diagnosis: "Ulcer",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1027,
      patientId: 9027,
      patientName: "Ava Roy",
      prescriptionDate: "2025-06-27",
      doctorName: "Dr. Owen Reid",
      diagnosis: "Constipation",
      numberOfMedicines: 1,
    },
    {
      prescriptionId: 1028,
      patientId: 9028,
      patientName: "Jayden Kapoor",
      prescriptionDate: "2025-06-26",
      doctorName: "Dr. Lily Carter",
      diagnosis: "Cold & Cough",
      numberOfMedicines: 2,
    },
    {
      prescriptionId: 1029,
      patientId: 9029,
      patientName: "Sophia Ali",
      prescriptionDate: "2025-06-25",
      doctorName: "Dr. Marcus Flynn",
      diagnosis: "High Cholesterol",
      numberOfMedicines: 3,
    },
    {
      prescriptionId: 1030,
      patientId: 9030,
      patientName: "Ryan Hudson",
      prescriptionDate: "2025-06-24",
      doctorName: "Dr. Meera Bhat",
      diagnosis: "Allergic Rhinitis",
      numberOfMedicines: 2,
    },
  ]);

  // console.log("allTreatment", allTreatment);
  const [filteredPrescriptions, setFilteredPrescriptions] =
    useState<Prescription[]>(prescriptions);

  // search and pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredPrescriptions.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPrescriptions = filteredPrescriptions.slice(
    startIndex,
    endIndex
  );

  const handleSort = (e) => {
    const order = e.target.value;
    console.log(order);
    const sortedPrescriptins = currentPrescriptions.sort((a, b) => {
      const dateA = new Date(a.prescriptionDate);
      const dateB = new Date(b.prescriptionDate).getTime();
      if (order === "ascending") {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    setFilteredPrescriptions(sortedPrescriptins);
    console.log(sortedPrescriptins);
  };
  useEffect(() => {
    const result: Prescription[] = prescriptions.filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(search.toLowerCase()) ||
        prescription.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        prescription.prescriptionId.toString().includes(search)  ||
        prescription.patientId.toString().includes(search)
    );
    // console.log(result);
    setFilteredPrescriptions(result);
    setCurrentPage(1);
  }, [search, prescriptions]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (prescriptions.length <= 0) {
    return;
  }

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Prescriptin List</h5>

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
            Treatment List
          </li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="sm:w-[500px] flex items-center gap-5">
              <div className="relative ">
                <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                  <i className="material-symbols-outlined !text-[20px]">
                    search
                  </i>
                </label>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <select
                  onChange={handleSort}
                  className="px-5 bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                >
                  <option value="">--Sort by date--</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescription ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescription Date
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor&apos; Name
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentPrescriptions.length > 0 ? (
                  currentPrescriptions.map((treatment) => (
                    <tr key={treatment.doctorName}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.prescriptionId}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patientId}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patientName}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.prescriptionDate}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.doctorName}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                            // onClick={() => setOpen(true)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
                          <Link href="/doctor/edit-invoice">
                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No prescriptions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pt-[12.5px] sm:flex sm:items-center justify-between">
              <p className="!mb-0 !text-xs">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </p>
              <ol className="mt-[10px] sm:mt-0 flex items-center">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === 1
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                    >
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                          currentPage === page
                            ? "border border-primary-500 bg-primary-500 text-white"
                            : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === totalPages
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;

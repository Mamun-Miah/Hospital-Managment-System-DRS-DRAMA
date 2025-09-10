"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Prescription {
  prescription_id: number;
  patient_id: number;
  patient_name: string;
  prescribed_at: number;
  doctor_name: string;
  mobile_number: number;
}
const InvoiceList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [morePrescriptions, setMorePrescriptions] = useState<Prescription[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const prescriptionList = async () => {
      try {
        const response = await fetch("/api/prescription/prescriptionlist");
        if (!response.ok) {
          throw new Error("Failed to fetch treatments");
        }
        const data = await response.json();

        setPrescriptions(data.prescriptionlist);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    };

    prescriptionList();
  }, []);
  // console.log(prescriptions)

  // console.log("allTreatment", allTreatment);
  const [filteredPrescriptions, setFilteredPrescriptions] =
    useState<Prescription[]>(prescriptions);
  // console.log('FilterPrescription',filteredPrescriptions)
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

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    // console.log(order);
    const sortedPrescriptins = currentPrescriptions.sort((a, b) => {

      if (order === "ascending") {
        return a.prescription_id - b.prescription_id;
      }
      return b.prescription_id - a.prescription_id;
    });

    setFilteredPrescriptions(sortedPrescriptins);
    // console.log(sortedPrescriptins);
  };
  useEffect(() => {
    const result: Prescription[] = prescriptions.filter(
      (prescription) =>
        prescription.patient_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        prescription.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
        prescription.prescription_id.toString().includes(search) ||
        prescription.mobile_number.toString().includes(search) ||
        prescription.prescribed_at.toString().includes(search) ||
        prescription.patient_id.toString().includes(search)
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

  const handleView = (id: number) => {
    const fetchPatient = async () => {
      const res = await fetch(
        `/api/prescription/prescription-by-patient-id/${id}`
      );
      const newPres = await res.json();
      setMorePrescriptions(newPres.prescriptions);
      console.log(newPres.prescriptions);
    };
    setIsOpen(true);

    fetchPatient();
  };
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Prescription List</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/"
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
            Prescription List
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
                  placeholder="Patient name, ID, Mobile Number, Date or Doctor name"
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
                  <option value="">Sort by Prescription ID</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        <div className="trezo-card-content relative">
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
                    Mobile Number
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescribed Date
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
                    <tr key={treatment.prescription_id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.prescription_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_name}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.mobile_number}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.prescribed_at}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.doctor_name}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          <Link
                            href={`/doctor/view-prescription/${treatment.prescription_id}`}
                          >
                            <button
                              type="button"
                              className="text-primary-500 leading-none custom-tooltip"
                              // onClick={() => setOpen(true)}
                            >
                              <i className="material-symbols-outlined !text-md">
                                visibility
                              </i>
                            </button>
                          </Link>
                          {/* <Link
                            href={`/doctor/edit-prescription/${treatment.prescription_id}`}
                          >
                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>
                          </Link> */}
                          <button
                            onClick={() => handleView(treatment.patient_id)}
                          >
                            <span className="material-symbols-outlined !text-md">
                              history
                            </span>
                          </button>
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
        {/* modal open here */}
        {isOpen && morePrescriptions && (
          <div className="fixed inset-0  z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="bg-white p-10 rounded-lg shadow-lg w-8xl relative ">
              <button
                className="absolute top-[-2px] right-[10px] text-4xl text-red-500 hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
              {/* <h2 className="text-2xl font-bold mb-2">Patient Details</h2> */}

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
                      Mobile Number
                    </th>
                    <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                      Prescribed Date
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
                  {morePrescriptions.length > 0 ? (
                    morePrescriptions?.map((treatment) => (
                      <tr key={treatment.prescription_id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-primary-500">
                            {treatment.prescription_id}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-primary-500">
                            {treatment.patient_id}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-primary-500">
                            {treatment.patient_name}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-primary-500">
                            {treatment.mobile_number}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {treatment.prescribed_at}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {treatment.doctor_name}
                          </span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <div className="flex items-center gap-[9px]">
                            <Link
                              href={`/doctor/view-prescription/${treatment.prescription_id}`}
                            >
                              <button
                                type="button"
                                className="text-primary-500 leading-none custom-tooltip"
                                // onClick={() => setOpen(true)}
                              >
                                <i className="material-symbols-outlined !text-md">
                                  visibility
                                </i>
                              </button>
                            </Link>
                            {/* <Link
                              href={`/doctor/edit-prescription/${treatment.prescription_id}`}
                            >
                              <button
                                type="button"
                                className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                              >
                                <i className="material-symbols-outlined !text-md">
                                  edit
                                </i>
                              </button>
                            </Link> */}
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
            </div>
          </div>
          // view modal
        )}
        {/* modal close here */}
      </div>
    </>
  );
};

export default InvoiceList;

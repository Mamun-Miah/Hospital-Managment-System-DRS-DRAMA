"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";

// import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface Patient {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  date: string;
  address: string;
  treatmentName: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const RequestedAppointment: React.FC = () => {
  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const delta = 2; // show 2 pages before & after current
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) {
      range.unshift("...");
    }
    if (range[0] !== 1) {
      range.unshift(1);
    }

    if (
      typeof range[range.length - 1] === "number" &&
      range[range.length - 1] !== totalPages
    ) {
      range.push(totalPages);
    }

    if (range[range.length - 1] !== totalPages) {
      range.push(totalPages);
    }

    return range;
  };

  const { data: session } = useSession();
  // const addPatient = session?.user.permissions.includes("add-patient");
  const deletePatient = session?.user.permissions.includes("delete-patient");

  //modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  //end modal state
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "deactivate"
  >("all");

  useEffect(() => {
    setLoading(true);
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/appointment-request/get-appointment");
        const data = await res.json();
        const appointments = data.appointments;
        if (Array.isArray(appointments)) {
          const dataWithCheck = appointments.map((patient: Patient) => ({
            ...patient,
            checked: false,
          }));
          setAllPatients(dataWithCheck);
        } else {
          console.error("Invalid data format:", appointments);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const results = allPatients.filter(
      (patient) =>
        (filterStatus === "all" ? true : patient.status === filterStatus) && // status filter
        (patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredPatients(results);
    setCurrentPage(1); // reset to first page
  }, [searchTerm, filterStatus, allPatients]);

  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(
              `/api/appointment-request/delete-request/${id}`,
              {
                method: "DELETE",
              }
            );
            const data = await res.json();
            if (data.success === true) {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Patient Has been successfully deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
            }
            if (res.ok) {
              setAllPatients((prev) =>
                prev.filter((patient) => patient.id !== id)
              );
              setFilteredPatients((prev) =>
                prev.filter((patient) => patient.id !== id)
              );
            } else {
              console.error("Failed to delete patient");
            }
          } catch (error) {
            console.error("Error deleting patient:", error);
          }
        }
      });
  };

  //view patient details in modal
  const handleViewClick = async (data: Patient) => {
    setSelectedPatient(data);
    setIsOpen(true);
  };

  const handleChange = async (patient_id: number, newStatus: string) => {
    try {
      const res = await fetch("/api/appointment-request/edit-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patient_id, status: newStatus }),
      });
      // console.log(newStatus)
      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();

      Swal.fire({
        icon: "success",
        title: `Status ${newStatus} successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });

      if (newStatus === "CONFIRMED") {
        setAllPatients((prev) =>
          prev.filter((patient) => patient.id !== patient_id)
        );
      }
      // Update the status in the state without removing the patient
      setAllPatients((prev) =>
        prev.map((patient) =>
          patient.id === patient_id
            ? { ...patient, status: newStatus }
            : patient
        )
      );

      console.log("Updated:", data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>

        <style jsx>{`
          .spinner-container {
            display: flex;
            min-height: 1vh;
            justify-content: center;
            align-items: center;
            height: 70vh; /* full screen */
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3; /* light gray */
            border-top: 5px solid #54499d; /* green */
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Appointment Request</h5>

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
            Appointment Request
          </li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="trezo-card-subtitle flex  mt-[15px] sm:mt-0">
            <div className="mr-5">
              <select
                name="status"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "deactivate"
                  )
                }
                className="h-[37px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="all">Sort Status</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    <div className="flex items-center gap-[10px]">
                      <div className="form-check relative top-[1.2px]"></div>
                      Patient ID
                    </div>
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Name
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Email
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Phone No.
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Treatment
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Appointment Date
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Appoinment Status
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          <span className="block ms-5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {patient.id}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          <span className="font-semibold inline-block">
                            {patient.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.email}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.phoneNumber}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.treatmentName}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {
                            patient.date &&
                              new Date(patient.date)
                                .toLocaleDateString("en-GB") // This gives you DD/MM/YYYY
                                .replace(/\//g, "-") // Replace slashes with dashes
                          }
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <select
                          name="status"
                          defaultValue={patient?.status}
                          onChange={(event) =>
                            handleChange(patient.id, event.target.value)
                          }
                          className="h-[20px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirm</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                            onClick={() => handleViewClick(patient)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
                          {/* </Link> */}

                          {/* Delete button */}
                          {deletePatient && (
                            <button
                              type="button"
                              className="text-danger-500 leading-none custom-tooltip"
                              onClick={() => handleDelete(patient.id)}
                            >
                              <i className="material-symbols-outlined !text-md">
                                delete
                              </i>
                            </button>
                          )}
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
                      No patients found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-[12.5px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-xs">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} results
            </p>
            <ol className="mt-[10px] sm:mt-0 flex items-center">
              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === 1
                      ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {getPageNumbers(currentPage, totalPages).map((page, idx) => (
                <li key={idx} className="inline-block mx-[2px]">
                  {page === "..." ? (
                    <span className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md text-gray-400 cursor-default">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(Number(page))}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                        currentPage === page
                          ? "border border-primary-500 bg-primary-500 text-white"
                          : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === totalPages
                      ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
      {/* view modal */}
      {isOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
          <div
            className="bg-white h-[90vh] p-6 rounded-lg shadow-lg w-full max-w-xl relative overflow-y-auto"
            style={{ maxHeight: "90vh" }} // limit modal height
          >
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <h3 className="text-lg text-center font-bold pb-8">
              Patient Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> {selectedPatient?.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPatient?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedPatient?.phoneNumber}
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    {selectedPatient?.dateOfBirth &&
                      new Date(
                        selectedPatient.dateOfBirth
                      ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatient?.gender}
                  </p>
                  <p>
                    <strong>
                      Appointment Date:{" "}
                      {selectedPatient?.date &&
                        new Date(selectedPatient.date).toLocaleDateString()}
                    </strong>
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedPatient?.address}
                  </p>
                  <p>
                    <strong>Treatment Name:</strong>{" "}
                    {selectedPatient?.treatmentName}
                  </p>
                  <p>
                    <strong>Note:</strong> {selectedPatient?.notes}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedPatient?.status}
                  </p>
                  <p>
                    <strong>Created At:</strong> {selectedPatient?.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestedAppointment;

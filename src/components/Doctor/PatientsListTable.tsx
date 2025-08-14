"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";


// import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";


type WeightHistoryEntry = {
  id: number;
  weight: string;
  recorded_at: string; // or Date if parsed
  patient_id: number;
};
interface Patient {
  patient_id: number;
  patient_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  gender: string;
   age:string;
    blood_group:string;
    weight:string;
  address_line1: string;
  set_next_appoinmnet: string;
  city: string;
  state_province: string;
  postal_code: string;
  emergency_contact_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  checked?: boolean;
  note?:string;
  weightHistory:WeightHistoryEntry[];
  marital_status?:string;
  image_url?: string; // Optional field for patient image URL 
}

const PatientsListTable: React.FC = () => {

  //modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//end modal state
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


 const [filterStatus, setFilterStatus] = useState<"all" | "active" | "deactivate">("all");





  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patient/patientlist");
        const data = await res.json();

        if (Array.isArray(data)) {
          const dataWithCheck = data.map((patient: Patient) => ({ ...patient, checked: false }));
          setAllPatients(dataWithCheck);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
  const results = allPatients
    .filter(patient =>
      (filterStatus === "all" ? true : patient.status === filterStatus) && // status filter
      (patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mobile_number.toLowerCase().includes(searchTerm.toLowerCase()))
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
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: true
        });
     
        swalWithBootstrapButtons.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true
        }).then (async(result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
  
              title: "Deleted!",
              text: "Patient Has been successfully deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
    try {
      const res = await fetch(`/api/patient/deletepatient/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAllPatients((prev) => prev.filter((patient) => patient.patient_id !== id));
        setFilteredPatients((prev) => prev.filter((patient) => patient.patient_id !== id));
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
const handleViewClick = async (id: number) => {
  try {
    const res = await fetch(`/api/patient/viewpatient/${id}`); // Adjust path based on your route
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    setSelectedPatient(data);
    setIsOpen(true);
  } catch (error) {
    console.error("Error fetching patient:", error);
  }
};

const handleChange = async (patient_id: number, newStatus: string) => {
  try {
    const res = await fetch("/api/patient/edit-patient-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id, status: newStatus }),
    });
// console.log(newStatus)
    if (!res.ok) throw new Error("Failed to update status");

    const data = await res.json();

    Swal.fire({
      icon: "success",
      title: `Status ${newStatus} successfully!`,
      showConfirmButton: false,
      timer: 1500
    });
console.log('all patieetn',allPatients)
    // Update the status in the state without removing the patient
    setAllPatients((prev) =>
      prev.map((patient) =>
        patient.patient_id === patient_id
          ? { ...patient, status: newStatus }
          : patient
      )
    );

    console.log("Updated:", data);
  } catch (error) {
    console.error(error);
  }
};



  return (
    <>
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
                  onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "deactivate")}
                  className="h-[37px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="all">Sort Status</option>
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
            </div>
             
            <Link
              href="/doctor/add-patient"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Patient
              </span>
            </Link>

            
          </div>
         
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    <div className="flex items-center gap-[10px]">
                      <div className="form-check relative top-[1.2px]">
                        {/* <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={
                            filteredPatients.length > 0 &&
                            filteredPatients.every((p) => p.checked)
                          }
                          onChange={handleSelectAll}
                        /> */}
                      </div>
                      Patient ID
                    </div>
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Name
                  </th>
                  {/* <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Email
                  </th> */}
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Phone No.
                  </th>
                 
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Last Visit
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Scheduled Next Visit
                  </th>
                  {/* <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Due Amount
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Paid Amount
                  </th> */}

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Gender
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
                    <tr key={patient.patient_id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          {/* <div className="form-check relative top-[1.2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={patient.checked || false}
                              onChange={() => handleCheckboxChange(patient.patient_id)}
                            />
                          </div> */}
                          <span className="block ms-5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {patient.patient_id}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          
                          <span className="font-semibold inline-block">
                            {patient.patient_name}
                          </span>
                        </div>
                      </td>
                      {/* <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {patient.patient_name}
                        </span>
                      </td> */}
                      {/* <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient?.email}
                        </span>
                      </td> */}
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.mobile_number}
                        </span>
                      </td>
                      
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                         {patient?.created_at && (
                            new Date(patient.created_at)
                              .toLocaleDateString('en-GB') // This gives you DD/MM/YYYY
                              .replace(/\//g, '-')         // Replace slashes with dashes
                          )}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                         {patient?.set_next_appoinmnet && (
                            new Date(patient.set_next_appoinmnet)
                              .toLocaleDateString('en-GB') // This gives you DD/MM/YYYY
                              .replace(/\//g, '-')         // Replace slashes with dashes
                          )}
                        </span>
                      </td>
                      {/* <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                         ---
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                         ---
                        </span>
                      </td> */}
                      
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient?.gender}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    
               
                <select
                  name="status"
                  value={patient?.status}
                  onChange={(e) => handleChange(patient.patient_id, e.target.value)}
                  className="h-[20px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
            
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          {/* View button */}
                          {/* <Link href={`view-patient/${patient.patient_id}`}> */}
                            <button
                              type="button"
                              className="text-primary-500 leading-none custom-tooltip"
                              onClick={() => handleViewClick(patient.patient_id)}
                              
                            >
                              <i className="material-symbols-outlined !text-md">visibility</i>
                            </button>
                          {/* </Link> */}

                            <Link href={`/doctor/patient-history/list/see-patient-history/${patient.patient_id}`}>
                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            >
                              <span className="material-symbols-outlined !text-md">
                              history
                            </span>
                              
                            </button>
                          </Link>
                          {/* Edit button */}
                          <Link href={`edit-patient/${patient.patient_id}`}>
                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            >
                              <i className="material-symbols-outlined !text-md">edit</i>
                            </button>
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            className="text-danger-500 leading-none custom-tooltip"
                            onClick={() => handleDelete(patient.patient_id)}
                          >
                            <i className="material-symbols-outlined !text-md">delete</i>
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
{/* view modal */}
  {isOpen && selectedPatient && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative overflow-y-auto"
      style={{ maxHeight: "90vh" }} // limit modal height
    >
      <button
        className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>

      <h3 className="text-lg text-center font-bold pb-8">Patient Details</h3>

      <Link href={`/doctor/patient-history/list/see-patient-history/${selectedPatient.patient_id}`}>
        <button
          type="button"
          className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-blue-900 text-white hover:bg-green-700"
        >
          View Patient History
        </button>
      </Link>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-4">
          <div>
            <p><strong>Name:</strong> {selectedPatient?.patient_name}</p>
            <p><strong>Email:</strong> {selectedPatient?.email}</p>
            <p><strong>Phone:</strong> {selectedPatient?.mobile_number}</p>
            <p><strong>Emergency Contact:</strong> {selectedPatient?.emergency_contact_phone}</p>
            <p><strong>DOB:</strong> {selectedPatient?.date_of_birth && new Date(selectedPatient.date_of_birth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {selectedPatient?.gender}</p>
            <p><strong>Age:</strong> {selectedPatient?.age}</p>
            <p><strong>Marital Status:</strong> {selectedPatient?.marital_status}</p>
            <p><strong>Note:</strong> {selectedPatient?.note}</p>
          </div>

          <div>
            <p><strong>Blood Group:</strong> {selectedPatient?.blood_group}</p>
            <p><strong>Weight:</strong> {selectedPatient?.weight}</p>
            <p><strong>State:</strong> {selectedPatient?.state_province}</p>
            <p><strong>Postal Code:</strong> {selectedPatient?.postal_code}</p>
            <p><strong>Last Visit:</strong> {selectedPatient?.created_at && new Date(selectedPatient.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
            <p><strong>Scheduled Next Visit:</strong> {selectedPatient?.set_next_appoinmnet && new Date(selectedPatient.set_next_appoinmnet).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
            <p><strong>Status:</strong> {selectedPatient?.status}</p>

            {/* Weight History Section */}
            <div className="mt-4">
              <h5 className="font-semibold mb-2">Weight History</h5>
              {selectedPatient?.weightHistory?.length > 0 ? (
                <ol
                  className="list-inside max-h-48 overflow-auto"
                  style={{ listStyleType: "decimal" }}
                >
                  {selectedPatient.weightHistory.map((entry) => (
                    <li key={entry.id}>
                      <span>{new Date(entry.recorded_at).toLocaleDateString('en-GB')}:</span>{' '}
                      <span>{entry.weight} kg</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No weight history available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}






    </>
  );
};

export default PatientsListTable;

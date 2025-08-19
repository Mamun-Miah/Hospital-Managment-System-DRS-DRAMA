"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react"


interface Doctor {
  doctor_id: number;
  doctor_image: string;
  doctor_name: string;
  specialization: string;
  email: string;
  phone_number: string;
  address_line1: string;
  city: string;
  doctor_fee: string;
  state_province: string;
  postal_code: string;
  status: string;
}

const DoctorListTable: React.FC = () => {


  const { data: session } = useSession()
  const addDoctor = session?.user.permissions.includes("add-doctor")

  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctor/doctor-list");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data: Doctor[] = await response.json();
        setAllDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);




  const handleDeleteDoctor = async (doctor_id: number) => {

    //Sweet Alert for confirmation
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({

          title: "Deleted!",
          text: "Doctor Has been successfully deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        //Sweet Alert for confirmation ends here
        try {
          const response = await fetch(`/api/doctor/delete-doctor/${doctor_id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete doctor");
          }

          // Remove the deleted doctor from the state
          setAllDoctors((prevDoctors) =>
            prevDoctors.filter((doctor) => doctor.doctor_id !== doctor_id)
          );
        } catch (error) {
          console.error("Error deleting doctor:", error);
        }
      }
    });

  }

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <h3>Doctor List</h3>
          {addDoctor &&(
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/doctor/add-doctor"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Doctor
              </span>
            </Link>
          </div>
          )}
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Email
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Phone No.
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Specialization
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor Fee
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    City
                  </th>
                  {/* <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    State
                  </th> */}
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {allDoctors.length > 0 ? (
                  allDoctors.map((doctor) => (
                    <tr key={doctor.doctor_id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          <div className="rounded-full w-[35px]">
                            <Image
                              src={doctor.doctor_image || "/uploads/default.avif"}
                              width={35}
                              height={35}
                              className="inline-block rounded-full"
                              alt={doctor.doctor_name}
                            />
                          </div>
                          <span className="font-semibold inline-block">
                            {doctor.doctor_name}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {doctor.email}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.phone_number}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.doctor_fee}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.city}
                        </span>
                      </td>
                      {/* <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.state_province}
                        </span>
                      </td> */}
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {doctor.status}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        {addDoctor && (
                        <div className="flex items-center gap-[9px]">
                          {/* <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                            // onClick={() => setOpen(true)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button> */}

                          <Link
                            // src\app\(admin)\doctor\(doctors)\doctor-profile\[id]\page.tsx
                            // href={`doctor-profile/${doctor.doctor_id}`}
                            href={`/doctor/view-doctor-profile/${doctor.doctor_id}`}

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

                          <Link href={`/doctor/edit-doctor/${doctor.doctor_id}`}>

                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"

                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>
                          </Link>

                          <button
                            type="button"
                            className="text-danger-500 leading-none custom-tooltip"
                            onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No Doctors found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorListTable;

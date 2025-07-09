"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Medicine {
  medicine_id: string;
  name: string;
  quantity: string;
}

const MedicineList:React.FC = () => {
  const [allMedicine, setAllMedicine] = useState<Medicine[]>([ ]);
// console.log("allTreatment", allTreatment);


useEffect(() => {
 const fetchTreatments = async () => {
    try {
      const response = await fetch("/api/medicine/medicinelist");
      if (!response.ok) {
        throw new Error("Failed to fetch treatments");
      }
      const data = await response.json();
      setAllMedicine(data.Getmedicine);


        } catch (error) {
        console.error("Error fetching treatments:", error);
        }
    }

    fetchTreatments();
},[]);
 console.log(allMedicine)
 
  //   if (allMedicine.length <= 0) {
  //   return;
   
  // }


  const handleDelete = async (medicine_id: string) => {
    if (confirm("Are you sure you want to delete this Medicine?")) {
    try {
      const response = await fetch(`/api/medicine/delete-medicine/${medicine_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete treatment");
      }
      const data = await response.json();
      setAllMedicine((prev) =>
        prev.filter((medicine) => medicine.medicine_id !== medicine_id)
      );
      console.log(data.message);
    } catch (error) {
      console.error("Error deleting treatment:", error);
    } 
}
}

  
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
            <h3>Medicine List</h3>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            
            <Link
              href="/doctor/medicine/add-medicine"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Medicine
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
                    Medicine ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Medicine Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Quantity
                  </th>
                  
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {allMedicine.length > 0 ? (
                  allMedicine.map((medicine) => (
                    <tr key={medicine.medicine_id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {medicine.medicine_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {medicine.name}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {medicine.quantity}
                        </span>
                      </td>
                      

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          {/* <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button> */}

                          <Link href={`/doctor/medicine/edit-medicine/${medicine.medicine_id}`}>
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
                            onClick={() => handleDelete(medicine.medicine_id)}
                            
                            className="text-danger-500 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
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
                      No Medicine Found
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

export default MedicineList;

"use client";

import React, { useState } from "react";

const AddMedicineComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    medicineName: "",
    // quantity: "",
    brandName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
    setLoading(true)
    setError("") 
    
    try {
      // const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/medicine/add-medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log(formData)
 
       const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add patient");
      }

      alert("Medicine added successfully!");
      
      setFormData({
        medicineName: "",
        brandName: "",
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.')
      console.error(error)
    } finally {
      setLoading(false)
    }



  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
            
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Medicine Name
              </label>
              <input
                name="medicineName"
                type="text"
                placeholder="Medicine Name"
                value={formData.medicineName}
                onChange={handleChange}
                required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Brand Name
              </label>
              <input
                name="brandName"
                type="text"
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            

            
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="trezo-card mt-[25px]">
          <div className="trezo-card-content">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
              onClick={() =>
                setFormData({
                  medicineName: "",
                  brandName: "",
                })
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  add
                </i>
                {loading ? "Submitting..." : "Confirm"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMedicineComponent;

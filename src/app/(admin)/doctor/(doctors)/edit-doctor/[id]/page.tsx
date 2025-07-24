'use client';
import React, { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditDoctor() {
  const params = useParams();
   const doctorIds = params?.id;
  //  console.log("Fetched doctor ID:", doctorIds);
   const [formData, setFormData] = useState({
           doctorName: "",
           phone_number: "",
           emailAddress: "",
           specialization: "",
           address: "",
           city: "",
           stateProvince: "",
           doctorFee: "", 
           status: "",
           postal_code: "",
           doctor_image: "",
       });
   
     const [selectedImages, setSelectedImages] = useState<File[]>([]);
     const [error, setError] = useState("");
     const [loading, setLoading] = useState(false);


     useEffect(() => {
  const getDoctorData = async () => {
    try {
      const response = await fetch(`/api/doctor/view-doctor/${doctorIds}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctor data");
      }

      const data = await response.json();
      console.log("Fetched doctor data:", data);

      setFormData({
        doctorName: data.doctor_name || "",
        phone_number: data.phone_number || "",
        emailAddress: data.email || "",
        specialization: data.specialization || "",
        address: data.address_line1 || "",
        city: data.city || "",
        stateProvince: data.state_province || "",
       doctorFee: data.doctor_fee || "", 
        status: data.status || "",
        postal_code: data.postal_code || "",
        doctor_image: data.doctor_image || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setLoading(false);
    }
  };

  getDoctorData();
}, [doctorIds]);
   
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const filesArray = Array.from(event.target.files);
    setSelectedImages(filesArray);
  }
};

const handleRemoveImage = (index: number) => {
  setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
};
   





     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setError("");
       setLoading(true);
   
       let imageUrl = "";
   
       try {
         if (selectedImages.length > 0) {
           const formDataImg = new FormData();
           formDataImg.append("image", selectedImages[0]);
   
           const uploadRes = await fetch("/api/uploadimage", {
             method: "POST",
             body: formDataImg,
           });
   
           const uploadData = await uploadRes.json();
   
           if (uploadRes.ok) {
             imageUrl = uploadData.imageUrl;
           } else {
             throw new Error("Image upload failed");
           }
         }
   
         const patientData = {
           ...formData,
           doctor_image: imageUrl,
         };
   
         const response = await fetch(`/api/doctor/edit-doctor/${doctorIds}`, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(patientData),
         });
   
         const data = await response.json();
   
         if (!response.ok) {
           throw new Error(data.error || "Failed to add patient");
         }
   
         alert("Patient added successfully!");
         setFormData({
           doctorName: "",
            phone_number: "",
            emailAddress: "",
            specialization: "",
            address: "",
            city: "",
            stateProvince: "",
            status: "",
            doctorFee: "", // Optional field for doctor's visit fee
            postal_code: "",
            doctor_image: "",
         });
         setSelectedImages([]);
       } catch (err) {
         setError(
           err instanceof Error ? err.message : "An unexpected error occurred"
         );
       } finally {
         setLoading(false);
       }
     };
   
    


  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Edit Doctor</h5>

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
          Edit Doctor
          </li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Doctor Name *
                    </label>
                    <input
                      name="doctorName"
                      type="text"
                      placeholder="Enter Patient Name"
                      value={formData.doctorName}
                      onChange={handleChange}
                      required
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Mobile Number *
                    </label>
                    <input
                      name="phone_number"
                      type="number"
                      placeholder="Enter Mobile Number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Email Address
                    </label>
                    <input
                      name="emailAddress"
                      type="email"
                      placeholder="Enter Email Address"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedic-Surgeon">Orthopedic Surgeon</option>
                      <option value="Endocrinologist">Endocrinologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                      <option value="Nephrologist">Nephrologist</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Address
                    </label>
                    <input
                      name="address"
                      type="text"
                      placeholder="Enter Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      City
                    </label>
                    <input
                      name="city"
                      type="text"
                      placeholder="Enter City"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      State
                    </label>
                    <input
                      name="stateProvince"
                      type="text"
                      placeholder="Enter State/Province"
                      value={formData.stateProvince}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Postal Code
                    </label>
                    <input
                      name="postal_code"
                      type="number"
                      placeholder="Enter State/Province"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Doctor Fee
                    </label>
                    <input
                      name="doctorFee"
                      type="number"
                      placeholder="Enter Doctor Fee"
                      value={formData.doctorFee}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
      
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Select Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                  </div>
                </div>
              </div>
      
              {/* image */}
              <div className="sm:col-span-2 mt-[20px]">
                <label className="mb-[1px] text-black dark:text-white font-medium block">
                  Add Image
                </label>
                <div id="fileUploader">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                    <div className="flex items-center justify-center">
                      <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                        <i className="ri-upload-2-line"></i>
                      </div>
                      <p className="leading-[1.5]">
                        <strong className="text-black dark:text-white">
                          Click to upload
                        </strong>
                        <br /> your file here
                      </p>
                    </div>
      
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      accept="image/*"
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
      
                  {/* Image Previews */}
                  <div className="mt-[10px] flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-[50px] h-[50px]">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="product-preview"
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
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
                        doctorName: "",
                      phone_number: "",
                      emailAddress: "",
                      specialization: "",
                      address: "",
                      city: "",
                      stateProvince: "",
                      status: "",
                      doctorFee: "", // Reset doctor fee
                      postal_code: "",
                      doctor_image: "",
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
                          {loading ? "Submitting..." : "Add Doctor"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
    </>
  );
}

"use client";

import React, { useState } from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AddPatientForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    mobileNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    address: "",
    age:"",
    blood_group:"",
    weight: "",
    city: "",
    stateProvince: "",
    setNextAppoinmnets:"",
    postalCode: "",
    emergencyContactNumber: "",
    gender: "",
    status: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     const filesArray = Array.from(event.target.files);
  //     setSelectedImages(filesArray);
  //   }
  // };


  const handleAgeCalculation = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  
  const birthDate = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;  
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
    age: age.toString(),
  }));
};



  // const handleRemoveImage = (index: number) => {
  //   setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let imageUrl = "";

    try {
      if (selectedImages.length > 0) {
        const formDataImg = new FormData();
        formDataImg.append("image", selectedImages[0]);

        const uploadRes = await fetch("/api/patient/uploadimage", {
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
        image_url: imageUrl,
      };

      const response = await fetch("/api/patient/addpatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add patient");
      }

      Swal.fire({
          icon: "success",
          title: "Patient added successfully!",
          showConfirmButton: false,
          timer: 1500
      });
      router.push('/doctor/patients-list/');

      setFormData({
        patientName: "",
        mobileNumber: "",
        emailAddress: "",
        dateOfBirth: "",
         age:"",
        blood_group:"",
        weight: "",
        address: "",
        city: "",
        stateProvince: "",
        setNextAppoinmnets:"",
        postalCode: "",
        emergencyContactNumber: "",
        gender: "",
        status: "",
      });
      setSelectedImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
console.log(formData);
  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient Name <span className="text-danger-800">*</span>
              </label>
              <input
                name="patientName"
                type="text"
                placeholder="Enter Patient Name"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Mobile Number <span className="text-danger-800">*</span>
              </label>
              <input
                name="mobileNumber"
                type="text"
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber}
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
                Date Of Birth
              </label>
              <input
                name="dateOfBirth"
                type="date"
                placeholder="Enter DOB"
                value={formData.dateOfBirth}
                onChange={handleAgeCalculation}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Age <span className="text-danger-800">*</span>
              </label>
              <input
                name="age"
                type="number"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleChange}
                required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
           

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Weight (KG)
              </label>
              <input
                name="weight"
                type="number"
                placeholder="Enter Weight (KG)"
                value={formData.weight}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Select Gender <span className="text-danger-800">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                required
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Gender </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                name="postalCode"
                type="text"
                placeholder="Enter Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Emergency Contact Number
              </label>
              <input
                name="emergencyContactNumber"
                type="text"
                placeholder="Enter Emergency Contact"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Set Appoinmnet Date
              </label>
              <input
                name="setNextAppoinmnets"
                type="date"
                placeholder="Enter Next Appoinment"
                value={formData.setNextAppoinmnets}
                onChange={handleChange}
                // required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
               Appoinment Status
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
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>
          </div>
        </div>

{/* image */}
        {/* <div className="sm:col-span-2 mt-[20px]">
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
              </div> */}





        {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="trezo-card mt-[25px]">
            <div className="trezo-card-content">
                      <button
                type="button"
                className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
                onClick={() => {
                  router.push("/doctor/patients-list/");
                }}
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
                {loading ? "Submitting..." : "Add Patient"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPatientForm;
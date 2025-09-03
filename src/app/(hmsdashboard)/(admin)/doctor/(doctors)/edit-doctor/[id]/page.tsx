'use client';
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Swal from 'sweetalert2';

interface EducationalInfo {
  name: string;
  institution: string;
  from_date: string;
  to_date: string;
}

interface AwardInfo {
  name: string;
  institution: string;
  from_date: string;
  to_date: string;
}

interface CertificationInfo {
  name: string;
  institution: string;
  from_date: string;
  to_date: string;
}

export default function EditDoctor() {
  const router = useRouter();
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
    designation: "",
    doctorFee: "",
    status: "",
    postal_code: "",
    short_bio: "",
    license_number: "",
    blood_group: "",
    gender: "",
    yrs_of_experience: "",
    date_of_birth: "",
    doctor_image: "",
  });


  const [educationalInfo, setEducationalInfo] = useState<EducationalInfo[]>([
    { name: "", institution: "", from_date: "", to_date: "" },
  ]);

  const [awardsInfo, setAwardsInfo] = useState<AwardInfo[]>([
    { name: "", institution: "", from_date: "", to_date: "" },
  ]);

  // // CertificationInfo
  const [certificationInfo, setCertificationInfo] = useState<CertificationInfo[]>([
    { name: "", institution: "", from_date: "", to_date: "" },
  ]);


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
          designation: data.designation || "",
          doctorFee: data.doctor_fee || "",
          status: data.status || "",
          postal_code: data.postal_code || "",
          short_bio: data.short_bio || "",
          license_number: data.license_number || "",
          blood_group: data.blood_group || "",
          gender: data.gender || "",
          yrs_of_experience: data.yrs_of_experience || "",
          // date_of_birth: data.date_of_birth || "",
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : "",

          doctor_image: data.doctor_image || "",

        });
        /// Check if data.educationalInfo exists and has items. If not, default to an empty entry.
        const formattedEducation = (data.educationalInfo || []).map((edu: EducationalInfo) => ({
          ...edu,
          from_date: edu.from_date ? new Date(edu.from_date).toISOString().split('T')[0] : "",
          to_date: edu.to_date ? new Date(edu.to_date).toISOString().split('T')[0] : "",
        }));
        setEducationalInfo(formattedEducation.length > 0 ? formattedEducation : [{ name: "", institution: "", from_date: "", to_date: "" }]);


        // Awards Info:
        // Check if data.awards exists and has items. If not, default to an empty entry.
        const formattedAwards = (data.awards || []).map((award: AwardInfo) => ({
          ...award,
          from_date: award.from_date ? new Date(award.from_date).toISOString().split('T')[0] : "",
          to_date: award.to_date ? new Date(award.to_date).toISOString().split('T')[0] : "",
        }));
        setAwardsInfo(formattedAwards.length > 0 ? formattedAwards : [{ name: "", institution: "", from_date: "", to_date: "" }]);


        // Certification Info:
        // Check if data.certifications exists and has items. If not, default to an empty entry.
        const formattedCertifications = (data.certifications || []).map((cert: CertificationInfo) => ({
          ...cert,
          from_date: cert.from_date ? new Date(cert.from_date).toISOString().split('T')[0] : "",
          to_date: cert.to_date ? new Date(cert.to_date).toISOString().split('T')[0] : "",
        }));
        setCertificationInfo(formattedCertifications.length > 0 ? formattedCertifications : [{ name: "", institution: "", from_date: "", to_date: "" }]);

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

  // Handler for changes in educational fields
  const handleChangeEducation = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...educationalInfo];
    list[index] = { ...list[index], [name]: value };
    setEducationalInfo(list);
  };

  // Handler to add a new educational entry
  const handleAddEducation = () => {
    setEducationalInfo([...educationalInfo, { name: "", institution: "", from_date: "", to_date: "" }]);
  };

  // Handler to remove an educational entry
  const handleRemoveEducation = (index: number) => {
    const list = [...educationalInfo];
    list.splice(index, 1);
    setEducationalInfo(list);
  };


  const handleChangeAwards = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...awardsInfo];
    list[index] = { ...list[index], [name]: value };
    setAwardsInfo(list);
  };

  // Handler to add a new award entry
  const handleAddAward = () => {
    setAwardsInfo([...awardsInfo, { name: "", institution: "", from_date: "", to_date: "" }]);
  };

  // Handler to remove an award entry
  const handleRemoveAward = (index: number) => {
    const list = [...awardsInfo];
    list.splice(index, 1);
    setAwardsInfo(list);
  };


  const handleChangeCertification = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...certificationInfo];
    list[index] = { ...list[index], [name]: value };
    setCertificationInfo(list);
  };

  // Handler to add a new certification entry
  const handleAddCertification = () => {
    setCertificationInfo([...certificationInfo, { name: "", institution: "", from_date: "", to_date: "" }]);
  };

  // Handler to remove an certification entry
  const handleRemoveCertification = (index: number) => {
    const list = [...certificationInfo];
    list.splice(index, 1);
    setCertificationInfo(list);
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
        educationalInfo,
        awardsInfo,
        certificationInfo,
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

      Swal.fire({

        icon: "success",
        title: "Doctor Updated successfully!",
        showConfirmButton: false,
        timer: 1500
      });
      router.push('/doctor/doctor-list/');
      setFormData({
        doctorName: "",
        phone_number: "",
        emailAddress: "",
        specialization: "",
        address: "",
        city: "",
        stateProvince: "",
        designation: "",
        status: "",
        doctorFee: "", // Optional field for doctor's visit fee
        postal_code: "",
        short_bio: "",
        license_number: "",
        blood_group: "",
        gender: "",
        yrs_of_experience: "",
        date_of_birth: "",
        doctor_image: "",
      });
      // console.log(formData);
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
                  Doctor Name <span className="text-danger-800">*</span>
                </label>
                <input
                  name="doctorName"
                  type="text"
                  placeholder="Enter Doctor Name"
                  value={formData.doctorName}
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
                  Designation
                </label>
                <input
                  name="designation"
                  type="text"
                  placeholder="Enter Designation"
                  value={formData.designation}
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
                  Short Bio
                </label>
                <input
                  name="short_bio"
                  type="text"
                  placeholder="Enter Doctor's Bio"
                  value={formData.short_bio}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Date Of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  placeholder="Enter DOB"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  License Number
                </label>
                <input
                  name="license_number"
                  type="text"
                  placeholder="Enter Doctor's License Number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Years of Experience
                </label>
                <input
                  name="yrs_of_experience"
                  type="number"
                  placeholder="Enter Doctor's YOE"
                  value={formData.yrs_of_experience}
                  onChange={handleChange}
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
                  required
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
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>

                </select>
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Doctor Visit Fee <span className="text-danger-800">*</span>
                </label>
                <input
                  name="doctorFee"
                  type="number"
                  placeholder="Enter Doctor Fee"
                  value={formData.doctorFee}
                  onChange={handleChange}
                  required
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


            {/* Doctor Educational Info Starts Here*/}
            <h4 className="mt-16">Educational Information</h4>
            {educationalInfo.map((education, i) => (
              <div key={i} className="mb-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] md:gap-[25px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Degree Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="e.g., MBBS, MD"
                      value={education.name}
                      onChange={(e) => handleChangeEducation(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Institution
                    </label>
                    <input
                      name="institution"
                      type="text"
                      placeholder="e.g., Harvard Medical School"
                      value={education.institution}
                      onChange={(e) => handleChangeEducation(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      From Date
                    </label>
                    <input
                      name="from_date"
                      type="date"
                      value={education.from_date}
                      onChange={(e) => handleChangeEducation(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      To Date
                    </label>
                    <input
                      name="to_date"
                      type="date"
                      value={education.to_date}
                      onChange={(e) => handleChangeEducation(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  {educationalInfo.length > 1 && (
                    <button
                      onClick={() => handleRemoveEducation(i)}
                      type="button"
                      className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-danger-500 text-white hover:bg-danger-400"
                    >
                      Remove Entry
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="">
              <button
                onClick={handleAddEducation}
                type="button"
                className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-primary-500 text-white hover:bg-primary-400"
              >
                Add Educational Entry
              </button>
            </div>
            {/* Doctor Educational Info Ends Here*/}


            <hr className="my-8" />

            {/* Doctor Awards and Recognition Info Starts Here*/}
            <h4 className="mt-16">Awards and Recognition</h4>
            {awardsInfo.map((award, i) => (
              <div key={i} className="mb-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] md:gap-[25px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Award Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="e.g., Physician of the Year"
                      value={award.name}
                      onChange={(e) => handleChangeAwards(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Awarded By (Institution)
                    </label>
                    <input
                      name="institution"
                      type="text"
                      placeholder="e.g., American Medical Association"
                      value={award.institution}
                      onChange={(e) => handleChangeAwards(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      From Date
                    </label>
                    <input
                      name="from_date"
                      type="date"
                      value={award.from_date}
                      onChange={(e) => handleChangeAwards(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      To Date
                    </label>
                    <input
                      name="to_date"
                      type="date"
                      value={award.to_date}
                      onChange={(e) => handleChangeAwards(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  {awardsInfo.length > 1 && (
                    <button
                      onClick={() => handleRemoveAward(i)}
                      type="button"
                      className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-danger-500 text-white hover:bg-danger-400"
                    >
                      Remove Entry
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="">
              <button
                onClick={handleAddAward}
                type="button"
                className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-primary-500 text-white hover:bg-primary-400"
              >
                Add Award Entry
              </button>
            </div>
            {/* Doctor Awards and Recognition Info Ends Here*/}



            <hr className="my-8" />

            {/* Doctor Certification Info Starts Here*/}
            <h4 className="mt-16">Certifications</h4>
            {certificationInfo.map((award, i) => (
              <div key={i} className="mb-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] md:gap-[25px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Certification Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="e.g., Best Hair Transplant Surgeon"
                      value={award.name}
                      onChange={(e) => handleChangeCertification(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Awarded By (Institution)
                    </label>
                    <input
                      name="institution"
                      type="text"
                      placeholder="e.g., BD Medical Association"
                      value={award.institution}
                      onChange={(e) => handleChangeCertification(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      From Date
                    </label>
                    <input
                      name="from_date"
                      type="date"
                      value={award.from_date}
                      onChange={(e) => handleChangeCertification(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      To Date
                    </label>
                    <input
                      name="to_date"
                      type="date"
                      value={award.to_date}
                      onChange={(e) => handleChangeCertification(i, e)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  {certificationInfo.length > 1 && (
                    <button
                      onClick={() => handleRemoveCertification(i)}
                      type="button"
                      className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-danger-500 text-white hover:bg-danger-400"
                    >
                      Remove Entry
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="">
              <button
                onClick={handleAddCertification}
                type="button"
                className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-primary-500 text-white hover:bg-primary-400"
              >
                Add Certification Entry
              </button>
            </div>
            {/* Doctor Certification Info Ends Here*/}
















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
                    designation: "",
                    status: "",
                    doctorFee: "", // Reset doctor fee
                    postal_code: "",
                    short_bio: "",
                    license_number: "",
                    blood_group: "",
                    gender: "",
                    yrs_of_experience: "",
                    date_of_birth: "",
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
                  {loading ? "Submitting..." : "Update Doctor"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

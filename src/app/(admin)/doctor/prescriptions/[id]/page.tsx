/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Image from "next/image";
import { useParams } from "next/navigation";
// import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";

interface FormData {
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  doctor_fee: number;
  treatment_name: string;
  treatmentAmount: number;
  treatmentDuration: number;
  discountType: string;
  discountAmount: number;
  medicine_name: string;
  advise: string;
  mobile_number: number;
  gender: string;
  age: number;
  city: string;
  weight: string;
  blood_group: string;
}

interface Dosage {
  time: string;
  amount: number;
}

interface Medicine {
  name: string;
  duration: number;
  dosages: Dosage[];
}

interface Doctor {
  doctor_name: string;
  doctor_fee: number | string;
  // add other fields if needed
}

type OptionType = {
  value: string;
  label: string;
};
// Searchable dropdown styles
const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (base: any, state: any) => ({
    ...base,
    height: "55px",
    borderRadius: "0.375rem",
    color: "black",
    backgroundColor: "white",
    borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
    paddingLeft: "17px",
    boxShadow: "none",
    outline: "none",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "black",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6b7280",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "white",
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#ede9fe"
      : state.isSelected
      ? "#7c3aed"
      : "white",
    color: state.isSelected ? "white" : "black",
    cursor: "pointer",
    padding: 10,
  }),
};

//Export Component
const AddAppointment: React.FC = () => {
  const [options, setOptions] = useState<OptionType[]>([]);
  // const [nextDate, setNextDate] = useState(new Date());
  const { id } = useParams<{ id: string }>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [treatmentList, setTreatmentList] = useState<
    { treatment_name: string; [key: string]: any }[]
  >([]);

  const [formData, setFormData] = useState<FormData>({
    patient_id: "",
    patient_name: "",
    doctor_name: "",
    doctor_fee: 0,
    treatment_name: "",
    treatmentAmount: 0,
    treatmentDuration: 0,
    discountType: "",
    discountAmount: 0,
    medicine_name: "",
    mobile_number: 0,
    advise: "",
    gender: "",
    age: 0,
    city: "",
    weight: "",
    blood_group: "",
  });

  const [treatments, setTreatments] = useState([
    {
      name: "Select Treatment",
      treatmentCost: 1,
      duration: 1,
      discountType: "",
      discountAmount: 0,
    },
  ]);

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "Select Medicine",
      duration: 1,
      dosages: [
        { time: "Morning", amount: 0 },
        { time: "Mid Day", amount: 0 },
        { time: "Night", amount: 0 },
      ],
    },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPrescribedData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/appoinments/appoinments-data/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch appoinments data");
        }
        const result = await res.json();
        const data = result.data;
        //get medicines value
        const medicines = data.medicines;

        const formattedOptions: OptionType[] = medicines.map(
          (medicine: any) => ({
            value: medicine.name.toLowerCase().replace(/\s+/g, "_"),
            label: medicine.name,
          })
        );

        setOptions(formattedOptions);
        //End get medicines value

        // console.log('Patient data:', id, data)
        if (data) {
          setDoctors(data.doctors);
          setTreatmentList(data.treatments);
          // setMedicinesdata(data.medicines);

          setFormData({
            patient_id: data.patient.patient_id,
            patient_name: data.patient.patient_name,
            doctor_name: data.doctors.doctor_name,
            doctor_fee: parseInt(data.doctors.doctor_fee),
            treatment_name:
              data.treatments.length > 0
                ? data.treatments[0].treatment_name
                : "",
            mobile_number: data.patient.mobile_number,
            treatmentAmount: parseFloat(data.treatments.total_cost),
            treatmentDuration: data.treatments.duration_months,
            discountType: "",
            discountAmount: 0,
            medicine_name:
              data.medicines.length > 0 ? data.medicines[0].name : "",
            advise: "",
            gender: data.patient.gender,
            age: data.patient.age,
            city: data.patient.city,
            weight: data.patient.weight,
            blood_group: data.patient.blood_group,
          });
          // console.log("Form Data", setFormData)
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getPrescribedData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const prescribedData = { ...formData, medicines: [...medicines] };
      console.log("Sending:", prescribedData);

      const res = await fetch("/api/appoinments/save-appoinments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescribedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      console.log("Prescription created:", result.prescription);
      alert("Prescription saved successfully!");

      // Optionally reset form
      // setFormData(initialFormState);
      // setMedicines([]);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      if (e.target.checked) {
        console.log("Checked:", e.target.value);
      } else {
        console.log("Unchecked:", e.target.value);
      }
    }


    if (name === "treatment_name") {
      const selectedTreatment = treatmentList.find(
        (doc) => doc.treatment_name === value
      );

      setFormData((prev) => ({
        ...prev,
        treatment_name: value,
        treatmentAmount: Number(selectedTreatment?.total_cost) || 0,
        treatmentDuration: Number(selectedTreatment?.duration_months) || 0,
      }));
    } else if (name === "doctor_name") {
      const selectedDoctor = doctors.find((doc) => doc.doctor_name === value);

      setFormData((prev) => ({
        ...prev,
        doctor_name: value,
        doctor_fee: Number(selectedDoctor?.doctor_fee) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleAddTreatments = () => {
    setTreatments([
      ...treatments,
      {
        name: "Select Treatment",
        treatmentCost: 1,
        duration: 1,
        discountType: "",
        discountAmount: 0,
      },
    ]);
  };

  // const hanldeChangeTreatment = (
  //   name: string,
  //   index: number,
  //   value: string | number
  // ) => {
  //   // setTreatments((prev) => {
  //   //   const updated = [...prev];
  //   //   updated[index] = {
  //   //     ...updated[index],
  //   //     [name]: value,
  //   //   };
  //   // });
  // };

  const handleRemoveTreatment = (index: number) => {
    setTreatments((prev) => prev.filter((_, i) => index !== i));
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        duration: 1,
        dosages: [
          { time: "Morning", amount: 0 },
          { time: "Mid Day", amount: 0 },
          { time: "Night", amount: 0 },
        ],
      },
    ]);
  };

  const handleMedicineChange = (
    medIndex: number,
    key: "name" | "duration",
    value: string | number
  ) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[medIndex] = {
        ...updated[medIndex],
        [key]: value,
      };
      return updated;
    });
  };

  const handleDosageChange = <K extends keyof Dosage>(
    medIndex: number,
    doseIndex: number,
    field: K,
    value: Dosage[K]
  ) => {
    const updated = [...medicines];
    updated[medIndex].dosages[doseIndex][field] = value;
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();

  const finalDate = `${day}/${month}/${year}`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div>
            <div className="sm:flex justify-between">
              <div className="mt-[20px] sm:mt-0">
                {/* <Image
                  src="/images/logo.png"
                  alt="logo"
                  className="mb-[10px] dark:hidden"
                  width={100}
                  height={26}
                />
                <Image
                  src="/images/white-logo.svg"
                  alt="logo"
                  className="mb-[10px] hidden dark:block"
                  width={100}
                  height={26}
                /> */}
                <h3>DRS DERMA</h3>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] my-[20px] md:my-[23px]"></div>

            {/* Patient Info */}
            <h5>Patient Info</h5>
            <div className="sm:flex justify-between mt-[20px]">
              <ul className="mb-[7px] sm:mb-0">
                <li className="mb-[7px] text-md last:mb-0">
                  ID: <span className="text-black text-md dark:text-white"> {formData.patient_id}</span>
                </li>
                <li className="mb-[7px] last:mb-0 flex items-center gap-3">
                  <span>Name: </span>
                   <span className="text-black dark:text-white">
                      {formData.patient_name}
                   </span>
                    
                </li>

                <li className="mb-[7px] last:mb-0">
                  Mobile Number:{" "}
                  <span className="text-black dark:text-white">
                    {formData.mobile_number}
                  </span>
                </li>
                <li className="mb-[7px] last:mb-0">
                  Address:{" "}
                  <span className="text-black dark:text-white">
                    {formData.city}
                  </span>
                </li>
              </ul>
              <ul className="mb-[7px] sm:mb-0">
                <li className="mb-[7px] last:mb-0">
                  Gender :{" "}
                  <span className="text-black dark:text-white"> {formData.gender}</span>
                </li>
                <li className="mb-[7px] last:mb-0">
                  Age: <span className="text-black dark:text-white"> {formData.age}</span>
                </li>
                <li className="mb-[7px] last:mb-0">
                  Blood Group:{" "}
                  <span className="text-black dark:text-white"> {formData.blood_group}</span>
                </li>
                <li className="mb-[7px] last:mb-0">
                  Weight (KG):
                  <span className="text-black dark:text-white">  {formData.weight}</span>
                </li>
              </ul>
              <div>
                <span className="block text-black dark:text-white">
                  <span className="font-semibold"> Date: </span> {finalDate}
                </span>
                <span className="flex items-center gap-3 text-black dark:text-white mt-3">
                  <span className="font-semibold"> Next Appointment:</span>
                  <input
                    className="h-[30px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-1/2 outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    type="date"
                  
                  />
                </span>
              </div>
            </div>

            <span className="block font-semibold text-black dark:text-white text-[20px] mt-[20px] mb-8 md:mt-[30px] lg:mt-[40px] xl:mt-[50px]">
             
            </span>
          </div>

          {/* Select Doctor */}
          {/* <h5 className="pb-5 mt-5">Prescritption</h5> */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[25px]">
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Doctor Name
              </label>

              <select
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor, doctor_id) => (
                  <option key={doctor_id} value={doctor.doctor_name}>
                    {doctor.doctor_name}
                  </option>
                ))}
              </select>
              <div>
                <input
                  type="checkbox"
                  // value={patient.patient_id}
                    onChange={handleChange}
                  className="form-checkbox mt-2 h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                /> Show DRS DERMA in Prescription
              </div>
                              
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Doctor Fees
              </label>
              <input
                name="doctorFees"
                type="number"
                value={formData.doctor_fee > 1 ? `${formData.doctor_fee}` : "0"}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Discount Type
              </label>
              <select
                name="discountType"
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Option</option>
                <option value="Percentage">Percentage</option>
                <option value="Flat Rate">Flat Rate</option>
                <option value="No Discount">No Discount</option>
              </select>
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Discount Amount
              </label>
              <input
                name="discountAmount"
                type="number"
                onChange={handleChange}
                placeholder="Dicount Amount"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 show-spinner"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Payable Doctor Fees 
              </label>
              <input
                name="doctor_fee"
                type="number"
                value={formData.doctor_fee > 0 ? `${formData.doctor_fee}` : ""}
                onChange={handleChange}
                placeholder="Dicount Amount"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 show-spinner"
              />
            </div>
          </div>
        </div>

        {/* Treatments */}
        <h4 className="mt-16">Treatments</h4>
        {treatments.map((_singleTreatment, i) => (
          <div className="mb-10 mt-8" key={i}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[25px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment List
                </label>
                <select
                  name="treatment_name"
                  onChange={
                    handleChange
                  }
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="">Select Treatment</option>
                  {treatmentList.map((treatment, treatment_name) => (
                    <option
                      key={treatment_name}
                      value={treatment.treatment_name}
                    >
                      {treatment.treatment_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Amount
                </label>
                <input
                  name="treatmentAmount"
                  type="number"
                  
                  value={
                    formData.treatmentAmount > 1
                      ? `${formData.treatmentAmount}`
                      : "0"
                  }
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Treatment Duration
                </label>
                <input
                  type="text"
                  value={
                    formData.treatmentDuration > 1
                      ? `${formData.treatmentDuration}`
                      : "0 Month"
                  }
                  disabled
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  // onChange={(e) =>
                  //   hanldeChangeTreatment("discountType", i, e.target.value)
                  // }
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="">Select Option</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Flat Rate">Flat Rate</option>
                  <option value="No Discount">No Discount</option>
                </select>
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Discount Amount
                </label>
                <input
                  name="discountAmount"
                  type="number"
                  // onChange={(e) =>
                  //   hanldeChangeTreatment("discountAmount", i, e.target.value)
                  // }
                  placeholder="Dicount Amount"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 show-spinner"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payable Treatment Cost
                </label>
                <input
                  name="treatmentAmount"
                  onChange={handleChange}
                  type="number"
                  value={
                    formData.treatmentAmount > 0
                      ? `${formData.treatmentAmount}`
                      : ""
                  }
                  
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036]  dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <button
                  onClick={() => handleRemoveTreatment(i)}
                  type="button"
                  className="font-medium mt-2 inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-danger-500 text-white hover:bg-primary-400"
                >
                  <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                    <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                      remove
                    </i>
                    Remove Treatment
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-5">
          <button
            onClick={handleAddTreatments}
            type="button"
            className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-blue-500 text-white hover:bg-primary-400"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                add
              </i>
              Add More Treatments
            </span>
          </button>
        </div>
        <h4 className="mt-16">Medicines</h4>
        {medicines.map((medicine, index) => (
          <div className="flex justify-between gap-8 mt-8" key={index}>
            <div className="w-1/3">
              <label htmlFor="">Medicine Name</label>

              <Select
                options={options}
                value={{ label: medicine.name, value: medicine.name }}
                onChange={(option) =>
                  handleMedicineChange(index, "name", option?.label ?? "")
                }
                styles={customStyles}
              />
              <button
                onClick={() => handleRemoveMedicine(index)}
                type="button"
                className="font-medium mt-5 inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-danger-500 text-white hover:bg-primary-400"
              >
                <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    remove 
                  </i>
                  Remove Medicine
                </span>
              </button>
            </div>

            <div className="w-1/3">
              <label htmlFor="dosages">Dosages</label>

              {medicine?.dosages?.map((dosage, doseIndex) => (
                <div
                  key={`${index}${doseIndex}`}
                  className="flex gap-5 mb-5 items-center justify-between  h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <span>{dosage?.time}</span>
                  <span>-</span>
                  <input
                    type="number"
                    value={dosage?.amount}
                    className="border-0 outline-none justify-self-end max-w-[50px] show-spinner"
                    onChange={(e) =>
                      handleDosageChange(
                        index,
                        doseIndex,
                        "amount",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              ))}
            </div>
            <div className="w-1/3">
              <div>
                <label htmlFor="duration">Days</label>
                <input
                  type="number"
                  value={medicine.duration}
                  onChange={(e) =>
                    handleMedicineChange(
                      index,
                      "duration",
                      Number(e.target.value)
                    )
                  }
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 show-spinner"
                />
              </div>
              {/* <div className="flex gap-5 mt-5 items-center justify-between  h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500">
                <label htmlFor="total">Total</label>
                <span>-</span>
                <input
                  type="number"
                  value={calculateTotal(medicine.dosages, medicine.duration)}
                  disabled
                  className="justify-self-end max-w-[40px]"
                />
              </div> */}
            </div>
          </div>
        ))}
        <div className="trezo-card mt-[25px]">
          <button
            onClick={handleAddMedicine}
            type="button"
            className="font-medium inline-block transition-all rounded-md text-sm py-[8px] px-[14px] bg-primary-500 text-white hover:bg-primary-400"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                add
              </i>
              Add More Medicine
            </span>
          </button>
        </div>
        <div className="my-8 last:mb-0">
          <label className="mb-[12px] font-medium block">Advise</label>
          <textarea
            name="advise"
            value={formData.advise}
            onChange={handleChange}
            className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
            placeholder="Write advise"
          ></textarea>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="trezo-card mt-[25px]">
          <div className="trezo-card-content">
            <p className="font-bold">Total Payable Amount: $4483</p>
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
              onClick={() =>
                setFormData({
                  patient_id: formData.patient_id,
                  patient_name: formData.patient_name,
                  doctor_name: "",
                  doctor_fee: formData.doctor_fee,
                  treatment_name: "",
                  treatmentAmount: formData.treatmentAmount,
                  treatmentDuration: formData.treatmentDuration,
                  discountType: "",
                  discountAmount: 0,
                  medicine_name: "",
                  advise: "",
                  gender: "",
                  mobile_number:0,
                  age: 0,
                  city: "",
                  weight: "",
                  blood_group: "",
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
                {loading ? "Submitting..." : "Add Appointment"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddAppointment;

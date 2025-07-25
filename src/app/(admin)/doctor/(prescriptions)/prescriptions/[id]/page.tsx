/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from 'next/navigation';
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
  treatmentAmount2: string;
  treatmentCost:string;
  treatmentDuration: number;
  payableDoctorFee:number;
  doctorDiscountType: string, 
  doctorDiscountAmount: number,
  medicine_name: string;
  advise: string;
  mobile_number: number;
  gender: string;
  age: number;
  city: string;
  weight: string;
  blood_group: string;
  is_drs_derma: string;
  next_appoinment: string;
}

interface Dosage {
  time: string;
  amount: string;
}

interface Medicine {
  name: string;
  duration: string;
  dosages: Dosage[];
}

interface Doctor {
  doctor_name: string;
  doctor_fee: number | string;
  
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
//Get Id from Params
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [clearedFields, setClearedFields] = useState<{ [key: string]: boolean }>({});
  
//Set Form Data
  const [formData, setFormData] = useState<FormData>({
    patient_id: "",
    patient_name: "",
    doctor_name: "",
    doctor_fee: 0,
    treatment_name: "",
    treatmentAmount2: "",
    treatmentDuration: 0,
    treatmentCost:"",
    payableDoctorFee: 0, 
    doctorDiscountType: "", 
    doctorDiscountAmount: 0, 
    medicine_name: "",
    mobile_number: 0,
    advise: "",
    gender: "",
    age: 0,
    city: "",
    weight: "",
    blood_group: "",
    is_drs_derma:"No",
    next_appoinment: "",
  });
//Set Doctor Data
  const [doctors, setDoctors] = useState<Doctor[]>([]);



 //Set Treatments List 
  const [treatmentList, setTreatmentList] = useState<
    { treatment_name: string; [key: string]: any }[]
  >([]);
  const [treatments, setTreatments] = useState([
    {
      treatment_name: "Select Treatment",
      duration: 0,
      discountType: "",
      discountAmount: "",
      treatmentAmount2:"",
      treatmentCost:""
    },
  ]);

//Set Medicine List 
  const [options, setOptions] = useState<OptionType[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "Select Medicine",
      duration: "",
      dosages: [
        { time: "Morning", amount: "" },
        { time: "Mid Day", amount: "" },
        { time: "Night", amount: "" },
      ],
    },
  ]);

//Set Error 
  const [error, setError] = useState("");
//Set Loading State
  const [loading, setLoading] = useState(false);


//fetch Appointments Data from Api & set Medicine to the SetOptions & Set Doctor List & TreatmentList
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
              ? data.treatments.treatment_name
              : "",
          mobile_number: data.patient.mobile_number,
          treatmentAmount2: data.treatments.total_cost,
          treatmentCost:"",
          treatmentDuration: data.treatments.duration_months,
          
          payableDoctorFee: 0, 
          doctorDiscountType: "", 
          doctorDiscountAmount: 0, 
          medicine_name:
            data.medicines.length > 0 ? data.medicines.name : "",
          advise: "",
          gender: data.patient.gender,
          age: data.patient.age,
          city: data.patient.city,
          weight: data.patient.weight,
          blood_group: data.patient.blood_group,
          is_drs_derma: "",
          next_appoinment:""
        });
      
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getPrescribedData();
}, [id]);


//Submit Prescription Data to the API
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const prescribedData = { ...formData, medicines: [...medicines], treatments:[...treatments] };
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
    // alert("Prescription saved successfully!");
    router.push('/doctor/appointment/');
    
  } catch (err: any) {
    console.error("Submission error:", err);
    setError(err.message || "Failed to submit");
  } finally {
    setLoading(false);
  }
};



//Handle Submit Data
const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  


  const { name, value } = e.target;


if(name === "nextdate"){
  setFormData((prev) => ({
      ...prev,
      next_appoinment: value,
     
    }));

    return;
}

  //  Handle checkbox
  if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
    const isChecked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: isChecked ? "Yes" : "No", 
    }));
   
    return; 
  }
  


// Handle doctor discount type or amount change
if (name === "doctorDiscountType" || name === "doctorDiscountAmount") {
  setFormData((prev) => {
    const doctor_fee = prev.doctor_fee;
    const discountType =
      name === "doctorDiscountType" ? value : prev.doctorDiscountType;
    const discountAmount = Number(
      name === "doctorDiscountAmount" ? value : prev.doctorDiscountAmount
    );

    let payable = doctor_fee;

    if (discountType === "Percentage") {
      payable = doctor_fee - (doctor_fee * discountAmount) / 100;
    } else if (discountType === "Flat Rate") {
      payable = doctor_fee - discountAmount;
    }

    return {
      ...prev,
      [name]: value,
      payableDoctorFee: payable < 0 ? 0 : Number(payable.toFixed(2)),
    };
  });
  return;
}



  if (name === "doctor_name") {
    const selectedDoctor = doctors.find((doc) => doc.doctor_name === value);

    setFormData((prev) => ({
      ...prev,
      doctor_name: value,
      doctor_fee: Number(selectedDoctor?.doctor_fee) || 0,
    }));

    return;
  }

  

  // Handle all other inputs
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleAddTreatments = () => {

    setTreatments([
      ...treatments,
      {
        treatment_name: "Select Treatment",
        duration: 1,
        discountType: "",
        discountAmount: "",
        treatmentAmount2:"",
        treatmentCost:"",
      },
    ]);
  };

const handleChangeTreatment = (
  name: string,
  index: number,
  value: string | number
) => {
  setTreatments((prev) => {
    const updated = [...prev];
    const current = updated[index];
    let newData = { ...current, [name]: value };

    // Handle treatment selection
    if (name === "treatment_name") {
      const selected = treatmentList.find(
        (item) => item.treatment_name === value
      );

      newData = {
        ...newData,
        treatment_name: value.toString(),
        treatmentAmount2: selected ? selected.total_cost : "",
        duration: selected ? Number(selected.duration_months) : 0,
      };
    }

    // Handle discount logic
    if (name === "discountType" || name === "discountAmount") {
      const treatmentAmount2 = Number(
        name === "discountType"
          ? current.treatmentAmount2
          : newData.treatmentAmount2 ?? current.treatmentAmount2
      );

      const discountType =
        name === "discountType"
          ? value
          : current.discountType;

      const discountAmount = Number(
        name === "discountAmount"
          ? value
          : current.discountAmount
      );

      let finalAmount = treatmentAmount2;

      if (discountType === "Percentage") {
        finalAmount = treatmentAmount2 - (treatmentAmount2 * discountAmount) / 100;
      } else if (discountType === "Flat Rate") {
        finalAmount = treatmentAmount2 - discountAmount;
      }

      newData = {
        ...newData,
        treatmentCost: finalAmount < 0 ? "" : Math.round(finalAmount).toString(), // Remove `.toFixed(2)` to avoid trailing .00
      };
    }

    updated[index] = newData;
    return updated;
  });
};




  const handleRemoveTreatment = (index: number) => {
    setTreatments((prev) => prev.filter((_, i) => index !== i));
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "Select Medicine",
        duration: "",
        dosages: [
          { time: "Morning", amount: "" },
          { time: "Mid Day", amount: "" },
          { time: "Night", amount: "" },
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



  const handleMouseEnter = (fieldName: string) => {
  if (!clearedFields[fieldName]) {
    setFormData((prev) => ({ ...prev, [fieldName]: "" })); 
    setClearedFields((prev) => ({ ...prev, [fieldName]: true }));
  }
};

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');  
  const finalDate = `${day}/${month}/${year}`;

console.log(formData)
console.log(medicines)
console.log(treatments)

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
                    name="nextdate"
                    onChange={handleChange}
                  
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
                   name="is_drs_derma"
                  checked={formData.is_drs_derma === "Yes"}
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
                name="doctorDiscountType"
                 value={formData.doctorDiscountType}
                 required
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
                name="doctorDiscountAmount"
                type="number"
                value={formData.doctorDiscountAmount}
                onClick={() => handleMouseEnter("doctorDiscountAmount")}
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
                 name="payableDoctorFee"
                  type="number"
                  value={formData.payableDoctorFee}
                  onClick={() => handleMouseEnter("payableDoctorFee")}
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
                  value={treatments[i].treatment_name}
                  onChange={(e) =>
                    handleChangeTreatment("treatment_name", i, e.target.value)
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
                    value={treatments[i].treatmentAmount2}
                    onChange={(e) =>
                      handleChangeTreatment("treatmentAmount", i, e.target.value)
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
                    value={`${treatments[i].duration} Month`}
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
                  value={treatments[i].discountType}
                  onChange={(e) =>
                    handleChangeTreatment("discountType", i, e.target.value)
                  }
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
                    value={treatments[i].discountAmount}
                    
                    onChange={(e) =>
                      handleChangeTreatment("discountAmount", i, e.target.value)
                    }
                    onClick={() => handleMouseEnter("discountAmount")}
                  placeholder="Dicount Amount"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 show-spinner"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payable Treatment Cost
                </label>
                <input
                  name="treatmentCost"
                  onChange={e =>
                    handleChangeTreatment(
                      "treatmentCost",
                      i,
                      e.target.value
                    )
                  }
                  type="number"
                  placeholder='Payable Treatment Cost'
                  value={
                    treatments[i].treatmentCost
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
                    placeholder='0'
                    onChange={(e) =>
                      handleDosageChange(
                        index,
                        doseIndex,
                        "amount",
                        e.target.value
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
                      e.target.value
                    )
                  }
                  placeholder='0'
                  onClick={() => handleMouseEnter("duration")}
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
                  treatmentAmount2: formData.treatmentAmount2,
                  treatmentCost:"",
                  treatmentDuration: formData.treatmentDuration,
                  payableDoctorFee: 0, 
                  doctorDiscountType: "", 
                  doctorDiscountAmount: 0, 
                  medicine_name: "",
                  advise: "",
                  gender: "",
                  mobile_number:0,
                  age: 0,
                  city: "",
                  weight: "",
                  blood_group: "",
                  is_drs_derma:"",
                  next_appoinment:""
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

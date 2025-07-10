/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
// import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";

// Types
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
  const { id } = useParams<{ id: string }>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [treatments, setTreatments] = useState<{ treatment_name: string; [key: string]: any }[]>([]);



  // console.log('patient id:', id)

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
          advise: "",
  });
// const [medicinesdata, setMedicinesdata] = useState([])
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



  useEffect(() =>{
    async function getPrescribedData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/appoinments/appoinments-data/${id}`,
          
        )
        if (!res.ok){
          throw new Error("Failed to fetch appoinments data");
        }
        const result = await res.json()
        const data = result.data;
//get medicines value
        const medicines = data.medicines;

        const formattedOptions: OptionType[] = medicines.map((medicine: any) => ({
          value: medicine.name.toLowerCase().replace(/\s+/g, "_"),
          label: medicine.name,
        }));

        setOptions(formattedOptions);
//End get medicines value


        // console.log('Patient data:', id, data)
        if (data) {
            setDoctors(data.doctors);
          setTreatments(data.treatments);
          // setMedicinesdata(data.medicines);

          
        setFormData({
            patient_id: data.patient.patient_id,
            patient_name: data.patient.patient_name,
            doctor_name: data.doctors.length > 0 ? data.doctors[0].doctor_name : "",
            doctor_fee: data.doctors.length > 0 ? parseFloat(data.doctors[0].doctor_fee) : 0,
            treatment_name: data.treatments.length > 0 ? data.treatments[0].treatment_name : "",
            treatmentAmount: data.treatments.length > 0 ? parseFloat(data.treatments[0].total_cost) : 0,
            treatmentDuration: data.treatments.length > 0 ? data.treatments[0].duration_months : 0,
            discountType: "",
            discountAmount: 0,
            medicine_name: data.medicines.length > 0 ? data.medicines[0].name : "",
            advise: "",
          });
          // console.log("Form Data", setFormData)
        setLoading(false)
      } 
    } catch(error) {
      console.log(error)
    }
  }
    getPrescribedData()
  },[id])




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = { ...formData, medicines: [...medicines] };
    console.log(data);
  };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === "treatment_name") {
    const selectedTreatment = treatments.find((doc) => doc.treatment_name === value);

    setFormData((prev) => ({
      ...prev,
      treatment_name: value,
      treatmentAmount: Number(selectedTreatment?.total_cost) || 0,
      treatmentDuration: Number(selectedTreatment?.duration_months) || 0
    }))};

  if (name === "doctor_name") {
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

  // Calculate total dosage
  // const calculateTotal = (dosages: Dosage[], duration: number): number => {
  //   const dailyTotal = dosages.reduce((sum, dose) => sum + dose.amount, 0);
  //   return dailyTotal * duration;



  

  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <h3 className="pb-5">Prescribed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[25px]">
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient ID:
              </label>
              <input
                name="patient_id"
                type="text"
                disabled
                value={formData.patient_id}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient Name
              </label>
              <input
                name="patient_name"
                type="text"
                value={formData.patient_name}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
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
                <option value="">Select Treatment</option>
                {doctors.map((doctor, doctor_id) => (
                  <option key={doctor_id} value={doctor.doctor_name}>
                    {doctor.doctor_name}
                  </option>
                ))}
              </select>


            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Treatment List
              </label>
              <select
                name="treatment_name"
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Treatment</option>
                 {treatments.map((treatment, treatment_name) => (
                  <option key={treatment_name} value={treatment.treatment_name}>
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
                value={formData.treatmentAmount}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Doctor Fees
              </label>
              <input
                name="doctorFees"
                type="number"
                value={formData.doctor_fee}
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
                Treatment Duration
              </label>
              <input
                type="text"
                value={
                  formData.treatmentDuration +
                  (formData.treatmentDuration > 1 ? " Months" : " Month")
                }
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <h5 className="mt-5">Prescriptions</h5>
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
            placeholder="Write adives"
          ></textarea>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="trezo-card mt-[25px]">
          <div className="trezo-card-content">
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

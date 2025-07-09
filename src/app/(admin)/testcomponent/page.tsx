/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";

// Types
interface FormData {
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorFees: number;
  treatmentAmount: number;
  treatmentDuration: number;
  discountType: string;
  discountAmount: number;
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

// Searchable dropdown options
const options = [
  { value: "paracetamol", label: "Paracetamol" },
  { value: "ibuprofen", label: "Ibuprofen" },
  { value: "amoxicillin", label: "Amoxicillin" },
  { value: "cetirizine", label: "Cetirizine" },
  { value: "metformin", label: "Metformin" },
  { value: "atorvastatin", label: "Atorvastatin" },
  { value: "omeprazole", label: "Omeprazole" },
  { value: "azithromycin", label: "Azithromycin" },
  { value: "salbutamol", label: "Salbutamol" },
  { value: "loratadine", label: "Loratadine" },
  { value: "diclofenac", label: "Diclofenac" },
  { value: "ranitidine", label: "Ranitidine" },
  { value: "aspirin", label: "Aspirin" },
  { value: "prednisone", label: "Prednisone" },
  { value: "clindamycin", label: "Clindamycin" },
  { value: "hydrochlorothiazide", label: "Hydrochlorothiazide" },
  { value: "losartan", label: "Losartan" },
  { value: "furosemide", label: "Furosemide" },
  { value: "warfarin", label: "Warfarin" },
  { value: "alprazolam", label: "Alprazolam" },
  { value: "diazepam", label: "Diazepam" },
  { value: "levothyroxine", label: "Levothyroxine" },
  { value: "insulin", label: "Insulin" },
  { value: "nifedipine", label: "Nifedipine" },
  { value: "ciprofloxacin", label: "Ciprofloxacin" },
];
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

const AddAppointment: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    patientId: "P23798237",
    patientName: "Arizona Namsur",
    doctorName: "Dr. Sanzu",
    doctorFees: 1000,
    treatmentAmount: 1000,
    treatmentDuration: 1,
    discountType: "",
    discountAmount: 0,
    advise: "",
  });

  const [medicines, setMedicines] = useState<Medicine[]>([
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = { ...formData, medicines: [...medicines] };
    console.log(data);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        duration: 1,
        dosages: [
          { time: "Morning", amount: 0 },
          { time: "Mif of The Day", amount: 0 },
          { time: "Night", amount: 0 },
        ],
      },
    ]);
  };

  const handleMedicineChange = <K extends keyof Medicine>(
    medIndex: number,
    fieldName: K,
    value: Medicine[K]
  ) => {
    const update = [...medicines];
    update[medIndex][fieldName] = value;
    setMedicines(update);
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
  // };

  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[25px]">
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient ID:
              </label>
              <input
                name="patientId"
                type="text"
                disabled
                value={formData.patientId}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient Name
              </label>
              <input
                name="patientName"
                type="text"
                value={formData.patientName}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Doctor Name
              </label>
              <input
                name="doctorName"
                type="text"
                value={formData.doctorName}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Treatment List
              </label>
              <select
                name="treatmentList"
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Treatment</option>
                <option value="Microreddling with PRP">
                  Microreddling with PRP
                </option>
                <option value="Hair PRP">Hair PRP</option>
                <option value="Chemical Peeling Face">
                  Chemical Peeling Face
                </option>
              </select>
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Doctor Fees
              </label>
              <input
                name="doctorFees"
                type="number"
                value={formData.doctorFees}
                disabled
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
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
                  patientId: "P23798237",
                  patientName: "Arizona Namsur",
                  doctorName: "Dr. Sanzu",
                  doctorFees: 1000,
                  treatmentAmount: 1000,
                  treatmentDuration: 0,
                  discountType: "",
                  discountAmount: 0,
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

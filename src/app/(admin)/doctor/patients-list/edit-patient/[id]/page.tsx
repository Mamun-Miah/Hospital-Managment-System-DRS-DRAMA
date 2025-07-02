"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Patient {
  patient_id: number;
  patient_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  gender: string;
  address_line1: string;
  city: string;
  state_province: string;
  postal_code: string;
  emergency_contact_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ViewPatientDetails: React.FC = () => {
  const params = useParams();
  const patientId = params?.id;
  const [formData, setFormData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const res = await fetch(`/api/patient/viewpatient/${patientId}`);
        if (!res.ok) throw new Error("Failed to fetch patient details");
        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/patient/editpatient/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      alert("Patient updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!formData) return <p>No patient found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Patient</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Patient Name
                </label>
                <input
                  name="patient_name"
                  type="text"
                  placeholder="Name"
                  value={formData?.patient_name}
                  onChange={handleChange}
                  required
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Mobile Number
                </label>
                <input
                  name="mobile_number"
                  type="text"
                  placeholder="Mobile"
                  value={formData?.mobile_number}
                  onChange={handleChange}
                  required
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData?.email || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  value={formData?.date_of_birth?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData?.gender || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="">Select Gender</option>
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
                  name="address_line1"
                  type="text"
                  placeholder="Address"
                  value={formData?.address_line1 || ""}
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
                  placeholder="City"
                  value={formData?.city || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  State
                </label>
                <input
                  name="state_province"
                  type="text"
                  placeholder="State"
                  value={formData?.state_province || ""}
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
                  type="text"
                  placeholder="Postal Code"
                  value={formData?.postal_code || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Emergency Contact
                </label>
                <input
                  name="emergency_contact_phone"
                  type="text"
                  placeholder="Emergency Contact"
                  value={formData?.emergency_contact_phone || ""}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Status
                </label>
                <select
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="trezo-card mt-[25px]">
            <div className="trezo-card-content">
              <button
                type="submit"
                className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              >
                {submitting ? "Updating..." : "Update Patient"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewPatientDetails;

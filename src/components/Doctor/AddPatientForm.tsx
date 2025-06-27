"use client";

import React, { useState } from "react";

const AddPatientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    mobileNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    address: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    emergencyContactNumber: "",
    gender: "",
    status: "",
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
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to add patient");
        return;
      }

      alert("Patient added successfully!");
      setFormData({
        patientName: "",
        mobileNumber: "",
        emailAddress: "",
        dateOfBirth: "",
        address: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        emergencyContactNumber: "",
        gender: "",
        status: "",
      });
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-6 p-6 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input
            name="patientName"
            type="text"
            placeholder="Enter Patient Name(required)"
            value={formData.patientName}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="mobileNumber"
            type="text"
            placeholder="Enter Mobile Number(required)"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="emailAddress"
            type="email"
            placeholder="Enter Email Address"
            value={formData.emailAddress}
            onChange={handleChange}
            className="input"
          />

          <input
            name="dateOfBirth"
            type="date"
            placeholder="Enter DOB"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="input"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="address"
            type="text"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
            className="input"
          />

          <input
            name="city"
            type="text"
            placeholder="Enter City"
            value={formData.city}
            onChange={handleChange}
            className="input"
          />

          <input
            name="stateProvince"
            type="text"
            placeholder="Enter State/Province"
            value={formData.stateProvince}
            onChange={handleChange}
            className="input"
          />

          <input
            name="postalCode"
            type="text"
            placeholder="Enter Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className="input"
          />

          <input
            name="emergencyContactNumber"
            type="text"
            placeholder="Enter Emergency Contact"
            value={formData.emergencyContactNumber}
            onChange={handleChange}
            className="input"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-5 py-2 rounded-md"
            onClick={() =>
              setFormData({
                patientName: "",
                mobileNumber: "",
                emailAddress: "",
                dateOfBirth: "",
                address: "",
                city: "",
                stateProvince: "",
                postalCode: "",
                emergencyContactNumber: "",
                gender: "",
                status: "",
              })
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-500"
          >
            {loading ? "Submitting..." : "Add Patient"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPatientForm;

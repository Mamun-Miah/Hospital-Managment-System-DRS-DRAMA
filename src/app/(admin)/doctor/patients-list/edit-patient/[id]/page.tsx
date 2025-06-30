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
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Patient</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          name="patient_name"
          type="text"
          placeholder="Name"
          value={formData.patient_name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="mobile_number"
          type="text"
          placeholder="Mobile"
          value={formData.mobile_number}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="input"
        />
        <input
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth?.slice(0, 10) || ""}
          onChange={handleChange}
          className="input"
        />
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="address_line1"
          type="text"
          placeholder="Address"
          value={formData.address_line1 || ""}
          onChange={handleChange}
          className="input"
        />
        <input
          name="city"
          type="text"
          placeholder="City"
          value={formData.city || ""}
          onChange={handleChange}
          className="input"
        />
        <input
          name="state_province"
          type="text"
          placeholder="State"
          value={formData.state_province || ""}
          onChange={handleChange}
          className="input"
        />
        <input
          name="postal_code"
          type="text"
          placeholder="Postal Code"
          value={formData.postal_code || ""}
          onChange={handleChange}
          className="input"
        />
        <input
          name="emergency_contact_phone"
          type="text"
          placeholder="Emergency Contact"
          value={formData.emergency_contact_phone || ""}
          onChange={handleChange}
          className="input"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
        >
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Deactivated">Deactivated</option>
        </select>

        <button
          type="submit"
          className="bg-primary-500 text-white rounded px-4 py-2 mt-2"
        >
          {submitting ? "Updating..." : "Update Patient"}
        </button>
      </form>
    </div>
  );
};

export default ViewPatientDetails;

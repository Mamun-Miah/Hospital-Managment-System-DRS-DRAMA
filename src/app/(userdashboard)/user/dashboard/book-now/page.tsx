/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function BookAppointment() {
  const [treatments, setTreatments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    date: "",
    address: "",
    treatmentName: "",
    notes: "",
  });

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  // Load treatments
  useEffect(() => {
    fetch("http://localhost:3000/api/treatment/treatment-list/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.treatments) {
          setTreatments(data.treatments.map((t: any) => t.treatment_name));
        }
      })
      .catch(() => console.error("Failed to load treatments"));
  }, []);

  // Pre-fill form from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const phone = localStorage.getItem("wp_phone_number") || "";
      const email = localStorage.getItem("wp_user_email") || "";
      const username = localStorage.getItem("wp_user_username") || "";

      setFormData((prev) => ({
        ...prev,
        fullName: username,
        email: email,
        phoneNumber: phone,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResponse("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/appointment-request/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setResponse("Appointment booked successfully!");
        setFormData((prev) => ({
          ...prev,
          dateOfBirth: "",
          gender: "",
          date: "",
          address: "",
          treatmentName: "",
          notes: "",
        }));
      } else {
        setError(data.error || "Failed to book appointment.");
      }
    } catch {
      setError("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-center text-2xl font-semibold text-indigo-600 mb-6">
        Book an Appointment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={formData.fullName ? true : false}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={formData.email ? true : false}
              placeholder="Enter your email"
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={formData.phoneNumber ? true : false}
              placeholder="Enter your phone number"
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Date of Birth (Optional)</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Gender (Optional)</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Appointment Date */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Select Appointment Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Address (Optional)</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={1}
            placeholder="Write your address"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
        </div>

        {/* Treatment */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">
            Select Treatment (Optional)
          </label>
          <select
            name="treatmentName"
            value={formData.treatmentName}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Choose a treatment</option>
            {treatments.map((t, idx) => (
              <option key={idx} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Note (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Write your note"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
        </div>
        {response && <p className="text-green-600 mt-2">{response}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#5503D9] text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Book Appointment
        </button>

        {/* Messages */}
        
      </form>
    </div>
  );
}
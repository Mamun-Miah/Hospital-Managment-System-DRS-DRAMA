/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { User, Mail, Lock, UserCheck, Eye, EyeOff } from "lucide-react"
import Swal from "sweetalert2"
interface Role {
  id: number;
  name: string;
}

export default function StaffInformationPage() {
const [allRoleName, setAllRoleName] = useState<Role[]>([]);


  useEffect(() => {
      const fetchRoleName = async () => {
        try {
          const response = await fetch("/api/role-permission/get-role-permission/");
          if (!response.ok) {
            throw new Error("Failed to fetch Role Name");
          }
          const data = await response.json();
          setAllRoleName(data);
        // console.log(data)
        } catch (error) {
          console.error("Error fetching staff:", error);
        }
      };
  
      fetchRoleName();
    }, []);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const res = await fetch("/api/all-staff/create-user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    console.log(data)

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Staff added successfully!",
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed to add Staff",
        text: data.error || "Something went wrong",
        showConfirmButton: true
      })
    }
  } catch (error: any) {
    console.error("Request failed:", error)
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Something went wrong",
      showConfirmButton: true
    })
  }
}
// console.log(formData)
  return (
    <div className=" bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Staff Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <User className="w-4 h-4" /> Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[70%] right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4" /> Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
                {allRoleName
                .filter((r) => r.name !== "Super Admin") // exclude Super Admin
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
              ))}

            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

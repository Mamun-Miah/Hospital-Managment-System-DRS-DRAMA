"use client"

import type React from "react"
import { useState } from "react"
import Swal from 'sweetalert2';

import {
  UserPlus,
  Users,
  User,
  Pill,
  Stethoscope,
  Calendar,
  FileText,
  // PenTool,
  // Eye,
  // History,
  Receipt,
  CalendarDays,
  Activity,
} from "lucide-react"

interface Permission {
  permission_id: string
  id:string
  name: string
  icon: React.ReactNode
  checked: boolean
}

export default function RoleManagementForm() {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([
    { permission_id: "add-doctor",id:"20", name: "Add/Edit/Delete Doctor", icon: <UserPlus className="h-4 w-4" />, checked: false },
    // { permission_id: "list-doctor", name: "List Doctor", icon: <Users className="h-4 w-4" />, checked: false },
    { permission_id: "add-patient",id:"21", name: "Add/Edit Patient", icon: <User className="h-4 w-4" />, checked: false },
    { permission_id: "delete-patient",id:"22", name: "Delete Patient", icon: <Users className="h-4 w-4" />, checked: false },
    { permission_id: "add-medicine",id:"23", name: "Add/Edit/Delete Medicine", icon: <Pill className="h-4 w-4" />, checked: false },
    // { permission_id: "list-medicine", name: "List Medicine", icon: <Pill className="h-4 w-4" />, checked: false },
    { permission_id: "add-treatment",id:"24", name: "Add/Edit/Delete Treatment", icon: <Stethoscope className="h-4 w-4" />, checked: false },
    // { permission_id: "list-treatment", name: "List Treatment", icon: <Stethoscope className="h-4 w-4" />, checked: false },
    { permission_id: "todays-appointment",id:"25", name: "Today's Appointment", icon: <Calendar className="h-4 w-4" />, checked: false },
    { permission_id: "prescription-list",id:"26", name: "Prescription List", icon: <FileText className="h-4 w-4" />, checked: false },
    // { permission_id: "create-prescription", name: "Create Prescription", icon: <PenTool className="h-4 w-4" />, checked: false },
    // { permission_id: "prescription-details", name: "Prescription Details", icon: <Eye className="h-4 w-4" />, checked: false },
    // { permission_id: "prescription-history", name: "Prescription History", icon: <History className="h-4 w-4" />, checked: false },
    { permission_id: "invoice", name: "Invoice",id:"27", icon: <Receipt className="h-4 w-4" />, checked: false },
    // { permission_id: "invoice-details", name: "Invoice Details", icon: <Eye className="h-4 w-4" />, checked: false },
    // { permission_id: "create-invoice", name: "Create Invoice", icon: <PenTool className="h-4 w-4" />, checked: false },
    { permission_id: "next-appointment",id:"28", name: "Next Appointment", icon: <CalendarDays className="h-4 w-4" />, checked: false },
    { permission_id: "patient-history",id:"29", name: "Patient History", icon: <Activity className="h-4 w-4" />, checked: false },
  ])

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((permission) => (permission.id === permissionId ? { ...permission, checked } : permission)),
    )
  }

  const handleSave = async() => {
    const selectedPermissions = permissions.filter((p) => p.checked)

    const permissionsId = selectedPermissions.map((p) =>  p.id);

    // console.log('selected',selectedPermissions)
    // console.log("Saving role:", {
    //   name: roleName,
    //   permissions: selectedPermissions.map((p) =>  p.permission_id),
    // })
    const addNewRole = await fetch(`/api/role-permission/add-new-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name: roleName,
          permissionId:permissionsId}),
      });
      const result = await addNewRole.json();
      Swal.fire({
      
              icon: "success",
              title: "Role added successfully!",
              showConfirmButton: false,
              timer: 1500
            });
      console.log('new role id',result, permissionsId)
    // alert(`Role "${roleName}" saved with ${permissionsId} permissions!`)
  }
// console.log(permissions)
  return (
    <div className="space-y-6">
      {/* Role Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Role Information</h2>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-2">
            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="role-name"
              type="text"
              placeholder="Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">HMS Permissions</h2>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* <div className="bg-gray-50 px-4 py-2 rounded-md">
              <h3 className="text-sm font-medium text-gray-700">Hospital Managment</h3>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={permission.checked}
                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="text-gray-500">{permission.icon}</div>
                    <label htmlFor={permission.id} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                      {permission.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!roleName.trim()}
          className="px-8 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Save Role
        </button>
      </div>
    </div>
  )
}

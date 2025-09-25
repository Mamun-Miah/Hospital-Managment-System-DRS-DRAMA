"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

import {
  UserPlus,
  Users,
  User,
  Pill,
  Stethoscope,
  Calendar,
  FileText,
  Receipt,
  CalendarDays,
  Activity,
  Settings,
  UserCheck,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Permission {
  permission_id: string
  id: string
  name: string
  icon: React.ReactNode
  checked: boolean
  isParent?: boolean
  parentId?: string
}

interface RoleName {
  id: string
  name: string
}

export default function RoleManagementForm() {
  const router = useRouter()
  const [allRoleName, setAllRoleName] = useState<RoleName[]>([])
  const [roleName, setRoleName] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([
    // Role Management Permissions
    {
      permission_id: "create-role",
      id: "30",
      name: "Role",
      icon: <Settings className="h-4 w-4" />,
      checked: false,
      isParent: true,
    },
    {
      permission_id: "edit-role",
      id: "31",
      name: "Edit Role",
      icon: <Settings className="h-4 w-4" />,
      checked: false,
      parentId: "30",
    },
    {
      permission_id: "delete-role",
      id: "32",
      name: "Delete Role",
      icon: <Settings className="h-4 w-4" />,
      checked: false,
      parentId: "30",
    },
    {
      permission_id: "add-new-role",
      id: "33",
      name: "Add New Role",
      icon: <Settings className="h-4 w-4" />,
      checked: false,
      parentId: "30",
    },

    // Staff Management Permissions
    {
      permission_id: "all-staff",
      id: "34",
      name: "All Staff",
      icon: <Users className="h-4 w-4" />,
      checked: false,
      isParent: true,
    },
    {
      permission_id: "edit-staff",
      id: "35",
      name: "Edit Staff",
      icon: <UserCheck className="h-4 w-4" />,
      checked: false,
      parentId: "34",
    },
    {
      permission_id: "delete-staff",
      id: "36",
      name: "Delete Staff",
      icon: <UserCheck className="h-4 w-4" />,
      checked: false,
      parentId: "34",
    },
    {
      permission_id: "add-new-staff",
      id: "37",
      name: "Add New Staff",
      icon: <UserCheck className="h-4 w-4" />,
      checked: false,
      parentId: "34",
    },
    {
      permission_id: "appoinment-request",
      id: "38",
      name: "Appoinment Request",
      icon: <UserCheck className="h-4 w-4" />,
      checked: false,
    },

    // Existing HMS Permissions
    {
      permission_id: "add-doctor",
      id: "20",
      name: "Add/Edit/Delete Doctor",
      icon: <UserPlus className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "add-patient",
      id: "21",
      name: "Add/Edit Patient",
      icon: <User className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "delete-patient",
      id: "22",
      name: "Delete Patient",
      icon: <Users className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "add-medicine",
      id: "23",
      name: "Add/Edit/Delete Medicine",
      icon: <Pill className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "add-treatment",
      id: "24",
      name: "Add/Edit/Delete Treatment",
      icon: <Stethoscope className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "todays-appointment",
      id: "25",
      name: "Today's Appointment",
      icon: <Calendar className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "prescription-list",
      id: "26",
      name: "Prescription List",
      icon: <FileText className="h-4 w-4" />,
      checked: false,
    },
    { permission_id: "invoice", id: "27", name: "Invoice", icon: <Receipt className="h-4 w-4" />, checked: false },
    {
      permission_id: "next-appointment",
      id: "28",
      name: "Next Appointment",
      icon: <CalendarDays className="h-4 w-4" />,
      checked: false,
    },
    {
      permission_id: "patient-history",
      id: "29",
      name: "Patient History",
      icon: <Activity className="h-4 w-4" />,
      checked: false,
    },
  ])

  const isPermissionDisabled = (permission: Permission) => {
    if (!permission.parentId) return false
    const parentPermission = permissions.find((p) => p.id === permission.parentId)
    return !parentPermission?.checked
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions((prev) => {
      const updatedPermissions = prev.map((permission) => {
        if (permission.id === permissionId) {
          return { ...permission, checked }
        }
        // console.log(permission)
        return permission
        
      })
      

      const changedPermission = prev.find((p) => p.id === permissionId)
      if (changedPermission?.isParent && !checked) {
        return updatedPermissions.map((permission) => {
          if (permission.parentId === permissionId) {
            return { ...permission, checked: false }
          }
          return permission
        })
      }

      return updatedPermissions
    })
  }

  useEffect(() => {
    const fetchMedines = async () => {
      try {
        const response = await fetch("/api/role-permission/get-role-permission/")
        if (!response.ok) {
          throw new Error("Failed to fetch Role Name")
        }
        const data = await response.json()
        setAllRoleName(data)
      } catch (error) {
        console.error("Error fetching staff:", error)
      }
    }

    fetchMedines()
  }, [])

  const handleSave = async () => {
    const selectedPermissions = permissions.filter((p) => p.checked)
    const permissionsId = selectedPermissions.map((p) => p.id)

    if (roleName.toLocaleLowerCase() === "super admin") {
      return Swal.fire({
        icon: "error",
        title: "Can't Create Super Admin Role",
        text: "Select another Role Name",
        showConfirmButton: false,
        timer: 1500,
      })
    }

    const rolesname = allRoleName.map((p) => p.name.toLowerCase())

    if (rolesname.includes(roleName.trim().toLowerCase())) {
      return Swal.fire({
        icon: "error",
        title: "Role Name already exists!",
        text: "Can't create duplicate role",
        showConfirmButton: false,
        timer: 1500,
      })
    }

    const addNewRole = await fetch(`/api/role-permission/add-new-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: roleName, permissionId: permissionsId }),
    })
    const result = await addNewRole.json()

    Swal.fire({
      icon: "success",
      title: "Role added successfully!",
      showConfirmButton: false,
      timer: 1500,
    })
    router.push("/staff-permissions/")
    console.log("new role id", result, permissionsId)
  }

  const rolePermissions = permissions.filter((p) => p.permission_id.includes("role"))
  const staffPermissions = permissions.filter((p) => p.permission_id.includes("staff"))
  const hmsPermissions = permissions.filter(
    (p) => !p.permission_id.includes("role") && !p.permission_id.includes("staff"),
  )
  console.log(rolePermissions)

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
          <div className="space-y-6">
            <div>
              <div className="bg-gray-50 px-4 py-2 rounded-md mb-4">
                <h5 className="text-sm font-medium text-gray-700">Role Management</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg transition-colors ${
                      isPermissionDisabled(permission) ? "bg-gray-100 opacity-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={permission.checked}
                      disabled={isPermissionDisabled(permission)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="text-gray-500">{permission.icon}</div>
                      <label
                        htmlFor={permission.id}
                        className={`text-sm font-medium cursor-pointer flex-1 ${
                          isPermissionDisabled(permission) ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {permission.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 px-4 py-2 rounded-md mb-4">
                <h5 className="text-sm font-medium text-gray-700">Staff Management</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg transition-colors ${
                      isPermissionDisabled(permission) ? "bg-gray-100 opacity-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={permission.checked}
                      disabled={isPermissionDisabled(permission)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="text-gray-500">{permission.icon}</div>
                      <label
                        htmlFor={permission.id}
                        className={`text-sm font-medium cursor-pointer flex-1 ${
                          isPermissionDisabled(permission) ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {permission.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 px-4 py-2 rounded-md mb-4">
                <h5 className="text-sm font-medium text-gray-700">Hospital Management</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hmsPermissions.map((permission) => (
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
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                      >
                        {permission.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!roleName.trim() || !permissions.some((p) => p.checked)}
          className="px-8 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Save Role
        </button>
      </div>
    </div>
  )
}

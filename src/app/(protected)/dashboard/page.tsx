"use client"

import OverallVisitors from "@/components/Dashboard/Hospital/OverallVisitors";
import Welcome from "@/components/Dashboard/Hospital/Welcome";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useEffect } from "react"

export default function Page() {
  const {
    totalCost,
    totalDue,
    todaysAppointments,
    nextAppointment,
    totalNextAppointments,
    completedAppointments,
    loading,
    fetchDashboardData,
  } = useDashboardStore()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )

  return (
    <div className="space-y-10 p-6">
      <Welcome />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <OverallVisitors
          icon="event_upcoming"
          iconBg="#60208F"
          bgColor="#F9F0FF"
          name="Next Appointment"
          value={nextAppointment}
        />

        <OverallVisitors
          icon="calendar_clock"
          bgColor="#FFF1E6"
          iconBg="#FFAE5E"
          name="Today's Appointments"
          value={todaysAppointments}
        />

        <OverallVisitors
          icon="calendar_add_on"
          bgColor="#D3F3FF"
          iconBg="#4BCCFF"
          name="Total Next Appointments"
          value={totalNextAppointments}
        />

        <OverallVisitors
          icon="request_quote"
          bgColor="#DAFFF2"
          iconBg="#00C47F"
          name="Total Cost"
          value={`Tk. ${totalCost}`}
        />

        <OverallVisitors icon="wallet" iconBg="#00868A" bgColor="#E2FEFF" name="Total Due" value={`Tk. ${totalDue}`} />

        <OverallVisitors
          icon="check_circle"
          iconBg="#EA4335"
          bgColor="#FFEBE9"
          name="Completed Appointments"
          value={completedAppointments}
        />
      </div>
    </div>
  )
}

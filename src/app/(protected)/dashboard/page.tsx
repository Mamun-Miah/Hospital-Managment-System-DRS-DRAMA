"use client";
// import BedOccupancyRate from "@/components/Dashboard/Hospital/BedOccupancyRate";
// import CriticalPatients from "@/components/Dashboard/Hospital/CriticalPatients";
// import EmergencyRoomVisits from "@/components/Dashboard/Hospital/EmergencyRoomVisits";
// import HospitalEarnings from "@/components/Dashboard/Hospital/HospitalEarnings";
import OverallVisitors from "@/components/Dashboard/Hospital/OverallVisitors";
// import PatientAdmissionsDischarges from "@/components/Dashboard/Hospital/PatientAdmissionsDischarges";
// import PatientAppointments from "@/components/Dashboard/Hospital/PatientAppointments";
// import PatientByAge from "@/components/Dashboard/Hospital/PatientByAge";
// import PatientsLast7Days from "@/components/Dashboard/Hospital/PatientsLast7Days";
// import ScheduleAppointment from "@/components/Dashboard/Hospital/ScheduleAppointment";
import Welcome from "@/components/Dashboard/Hospital/Welcome";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useEffect } from "react";

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
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-12">
          <Welcome />

          <div className="sm:grid sm:grid-cols-3 gap-[25px]">
            <div>
              <OverallVisitors
                icon="event_upcoming"
                iconBg="#60208F"
                bgColor="#F9F0FF"
                name="Next Appoinment"
                value={nextAppointment}
              />
            </div>
            <div>
              {/* <PatientsLast7Days /> */}
              <OverallVisitors
                icon="calendar_clock"
                bgColor="#FFF1E6"
                iconBg="#FFAE5E"
                name="Today's Appoinments"
                value={todaysAppointments}
              />
            </div>
            <div>
              {/* <PatientsLast7Days /> */}
              <OverallVisitors
                icon="calendar_add_on"
                bgColor="#D3F3FF"
                iconBg="#4BCCFF"
                name="Total Next Appoinment"
                value={totalNextAppointments}
              />
            </div>
            {/* total cost */}
            <div>
              <OverallVisitors
                icon="request_quote"
                bgColor="#DAFFF2"
                iconBg="#00C47F"
                name="Total Cost"
                value={`Tk. ${totalCost}`}
              />
            </div>
            <div>
              {/* <PatientsLast7Days /> */}
              <OverallVisitors
                icon="wallet"
                iconBg="#00868A"
                bgColor="#E2FEFF"
                name="Total DUE"
                value={`Tk. ${totalDue}`}
              />
            </div>

            <div>
              {/* <PatientsLast7Days /> */}
              <OverallVisitors
                icon="check_circle"
                iconBg="#EA4335"
                bgColor="#FFEBE9"
                name="Completed Appoinment  "
                value={completedAppointments}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* <PatientAdmissionsDischarges /> */}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">{/* <EmergencyRoomVisits /> */}</div>

        <div className="lg:col-span-3">
          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-1">{/* <CriticalPatients /> */}</div>

            <div className="lg:col-span-2">{/* <BedOccupancyRate /> */}</div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">{/* <PatientAppointments /> */}</div>

        <div className="lg:col-span-1">{/* <ScheduleAppointment /> */}</div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">{/* <PatientByAge /> */}</div>

        <div className="lg:col-span-2">{/* <HospitalEarnings /> */}</div>
      </div>
    </>
  );
}

'use client';
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
import {useDashboardStore} from "../../stores/useDashboardStore";
import { useEffect } from 'react';

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

  if (loading) return <p>Loading...</p>
  return (
    <>
      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-12">
          <Welcome />

          <div className="sm:grid sm:grid-cols-3 gap-[25px]">
            <div>
              <OverallVisitors name = "Total Cost" value={totalCost}/>
            </div>
            <div>
              {/* <PatientsLast7Days /> */}
               <OverallVisitors name = "Total DUE" value={totalDue}/>
            </div>
             <div>
              {/* <PatientsLast7Days /> */}
               <OverallVisitors name = "Today's Appoinments" value={todaysAppointments}/>
            </div>
            <div>
              <OverallVisitors name = "Next Appoinment" value={nextAppointment}/>
            </div>
            <div>
              {/* <PatientsLast7Days /> */}
               <OverallVisitors name = "Completed Appoinment  " value={completedAppointments}/>
            </div>
             <div>
              {/* <PatientsLast7Days /> */}
               <OverallVisitors name = "Total Next Appoinment" value={totalNextAppointments}/>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* <PatientAdmissionsDischarges /> */}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          {/* <EmergencyRoomVisits /> */}
        </div>

        <div className="lg:col-span-3">
          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-1">
              {/* <CriticalPatients /> */}
            </div>

            <div className="lg:col-span-2">
              {/* <BedOccupancyRate /> */}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          {/* <PatientAppointments /> */}
        </div>

        <div className="lg:col-span-1">
          {/* <ScheduleAppointment /> */}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          {/* <PatientByAge /> */}
        </div>

        <div className="lg:col-span-2">
          {/* <HospitalEarnings /> */}
        </div>
      </div>
    </>
  );
}

import { create } from "zustand"

export interface DashboardState {
  totalCost: number
  totalDue: number
  todaysAppointments: number
  totalNextAppointments:number
  nextAppointment: number
  completedAppointments: number
  loading: boolean
  fetchDashboardData: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalCost: 0,
  totalDue: 0,
  todaysAppointments: 0,
  nextAppointment: 0,
  totalNextAppointments:0,
  completedAppointments: 0,
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true })
    try {
      const res = await fetch("/api/dashboard")
      const data = await res.json()

      set({
        totalCost: data.totalCost,
        totalDue: data.totalDue,
        todaysAppointments: data.todaysAppointments,
        nextAppointment: data.nextAppointment,
        totalNextAppointments: data.totalNextAppointments,
        completedAppointments: data.completedAppointments,
        loading: false,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      set({ loading: false })
    }
  },
}))

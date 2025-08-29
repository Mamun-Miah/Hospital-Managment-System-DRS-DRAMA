import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


function getUTCDayRange(date: Date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0))
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
  return { start, end }
}

export async function GET() {
  try {
    // Today UTC range
    const { start: startOfDay, end: endOfDay } = getUTCDayRange(new Date())

    // Tomorrow UTC range
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    const { start: startOfTomorrow, end: endOfTomorrow } = getUTCDayRange(tomorrow)

    // 1. Total treatment cost
    const totalTreatmentCost = await prisma.invoice.aggregate({
      _sum: { total_treatment_cost: true },
    })

    // 2. Total due amount
    const totalDue = await prisma.invoice.aggregate({
      _sum: { due_amount: true },
    })

    // 3. Today's appointments
    const todaysAppointments = await prisma.patient.count({
      where: {
        set_next_appoinmnet: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // 4. Tomorrow’s appointments
    const nextAppointment = await prisma.patient.count({
      where: {
        set_next_appoinmnet: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
      },
    })

    // 5. All upcoming appointments (future dates only)
    const totalNextAppointments = await prisma.patient.count({
      where: {
        set_next_appoinmnet: {
          gt: new Date(), // after "now"
        },
      },
    })

    // 6. Completed appointments
    const completedAppointments = await prisma.prescription.count({
      where: { is_prescribed: "Yes" },
    })

    return NextResponse.json({
      totalCost: totalTreatmentCost._sum.total_treatment_cost || 0,
      totalDue: totalDue._sum.due_amount || 0,
      todaysAppointments,
      nextAppointment,
      totalNextAppointments,
      completedAppointments,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}

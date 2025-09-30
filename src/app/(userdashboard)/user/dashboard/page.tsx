"use client";
import Image from "next/image";
// import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
  const getPhone = localStorage.getItem("wp_phone_number");
  const storedUsername = localStorage.getItem("wp_user_username");
  const [appointment, setAppointment] = useState({
    treatmentName: "",
    date: null,
    status: " ",
  });

  const [invoice, setInvoice] = useState({ paid_amount: 0, due_amount: 0 });
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/user-dashboard/my-appointment?phone=${getPhone}`);
      const data = await res.json();

      setAppointment(data?.appointment || null);
      setInvoice(data.invoice || {}); 
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
    }
  };

  if (getPhone) {
    fetchData();
  }
}, [getPhone]);


  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <>
    <div className="p-5">
      <div className="trezo-card  bg-cover bg-no-repeat bg-center mb-[25px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-[20px] md:p-[25px] rounded-md relative z-[1] md:h-[250] h-[270px] overflow-hidden">
        <div className="trezo-card-content">
          <div className="sm:grid sm:grid-cols-5 justify-center items-center flex gap-[25px]">
            <div className="sm:col-span-3">
              <p className="!text-[20px] !mb-[2px] !text-white md:mt-0 mt-4">
                <span className="text-orange-100 md:text-3xl text-2xl -tracking-tighter">
                  Hi, {storedUsername}
                </span>
              </p>

              <p className="text-orange-100 md:text-2xl text-xl font-medium md:leading-normal !leading-[30px]">
                {" "}
                Welcome to DRS DERMA.
              </p>
              <p className="text-blue-200 text-lg md:leading-normal !leading-[30px]">
                We’re here to make your care simple and stress-free.
              </p>
            </div>

            <div className="md:inline hidden sm:col-span-2">
              <div className="text-center mt-[20px] sm:mt-0">
                <Image
                  src="/images/female-doctor.png"
                  className="inline-block"
                  alt="female-doctor"
                  width={152}
                  height={173}
                />
              </div>
            </div>
          </div>
        </div>

        <Image
          src="/images/vector1.png"
          className="absolute ltr:right-0 rtl:left-0 -z-[1] top-0"
          alt="vector-image"
          width={130}
          height={89}
        />
        <Image
          src="/images/vector2.png"
          className="absolute ltr:right-0 rtl:left-0 -z-[1] bottom-0"
          alt="vector-image"
          width={130}
          height={84}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-6 mt-8">
        {/* Appointment Card */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100  flex flex-col justify-between">
          <div>
            <div className="h-full">
              <h2 className="text-xl font-semibold text-gray-800">
                Appointment Request
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex justify-between">
                <span> Treatment Name:</span>{" "}
                <span>{appointment?.treatmentName || "Not Selected"}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1 flex justify-between">
                <span> Appointment Date:</span>{" "}
                <span> {formatDate(appointment?.date)}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1 flex justify-between">
                <span>Appointment Status: </span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium  ${
                    appointment?.status === "REJECTED"
                      ? "bg-red-300 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {appointment?.status ==="Active"? "Confirmed":appointment?.status || "Not Booked"}
                </span>
              </p>
            </div>
          </div>
          {/* <div className="mt-4 text-gray-700">
            <p className="font-medium">Notes:</p>
            <p>Follow-up required for lab results</p>
          </div> */}
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
              Reschedule
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto">
              Cancel
            </button>
          </div> */}
        </div>
        {/* Payment Summary */}
        <div className="bg-green-50 shadow rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Summary
            </h3>
            <p className="flex justify-between mt-4">
              <span>Total Paid:</span>
              <span className="font-bold text-green-700">
                {invoice?.paid_amount || 0}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Due:</span>
              <span className="font-bold text-red-600">
                {" "}
                {invoice?.due_amount || 0}
              </span>
            </p>
          </div>
          {/* <Link
            href="/user/dashboard/billing-records/"
            className="mt-6 w-full py-2 bg-[#605dff] text-white rounded-lg text-center"
          >
            View Invoices
          </Link> */}
        </div>
        {/* Health Tips */}
        {/* <div className="bg-yellow-50 shadow rounded-2xl p-6 border flex flex-col justify-between md:col-span-2 lg:col-span-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Health Tip</h3>
            <p className="text-gray-700 mt-2">
              Remember to drink at least 8 glasses of water daily. Staying
              hydrated improves overall health and energy.
            </p>
          </div>
        </div> */}
      </div>
      </div>
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Invoice {
  SL: number;
  invoiceNumber: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  treatmentName: string;
  treatmentCost: number;
  session: number;
  status: string;
}
const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      SL: 1,
      invoiceNumber: "INV-1001",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Smith",
      appointmentDate: "2025-07-01",
      treatmentName: "Root Canal",
      treatmentCost: 250,
      session: 1,
      status: "Paid",
    },
    {
      SL: 2,
      invoiceNumber: "INV-1002",
      patientName: "Emily Johnson",
      doctorName: "Dr. Robert Brown",
      appointmentDate: "2025-07-02",
      treatmentName: "Tooth Extraction",
      treatmentCost: 150,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 3,
      invoiceNumber: "INV-1003",
      patientName: "Michael Lee",
      doctorName: "Dr. Angela Davis",
      appointmentDate: "2025-07-03",
      treatmentName: "Teeth Whitening",
      treatmentCost: 200,
      session: 2,
      status: "Paid",
    },
    {
      SL: 4,
      invoiceNumber: "INV-1004",
      patientName: "Sophia Martinez",
      doctorName: "Dr. James Wilson",
      appointmentDate: "2025-07-04",
      treatmentName: "Dental Implant",
      treatmentCost: 1200,
      session: 3,
      status: "Failed",
    },
    {
      SL: 5,
      invoiceNumber: "INV-1005",
      patientName: "David Kim",
      doctorName: "Dr. Lisa Wong",
      appointmentDate: "2025-07-05",
      treatmentName: "Braces Installation",
      treatmentCost: 800,
      session: 1,
      status: "Paid",
    },
    {
      SL: 6,
      invoiceNumber: "INV-1006",
      patientName: "Anna White",
      doctorName: "Dr. Henry Clark",
      appointmentDate: "2025-07-06",
      treatmentName: "Veneers",
      treatmentCost: 500,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 7,
      invoiceNumber: "INV-1007",
      patientName: "Chris Evans",
      doctorName: "Dr. Nina Patel",
      appointmentDate: "2025-07-07",
      treatmentName: "Deep Cleaning",
      treatmentCost: 180,
      session: 1,
      status: "Failed",
    },
    {
      SL: 8,
      invoiceNumber: "INV-1008",
      patientName: "Laura Green",
      doctorName: "Dr. Edward King",
      appointmentDate: "2025-07-08",
      treatmentName: "Braces Adjustment",
      treatmentCost: 300,
      session: 1,
      status: "Paid",
    },
    {
      SL: 9,
      invoiceNumber: "INV-1009",
      patientName: "Nathan Scott",
      doctorName: "Dr. Rachel Lee",
      appointmentDate: "2025-07-09",
      treatmentName: "Crown Fitting",
      treatmentCost: 650,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 10,
      invoiceNumber: "INV-1010",
      patientName: "Olivia Brown",
      doctorName: "Dr. Victor Hugo",
      appointmentDate: "2025-07-10",
      treatmentName: "Gum Surgery",
      treatmentCost: 700,
      session: 2,
      status: "Paid",
    },
    {
      SL: 11,
      invoiceNumber: "INV-1011",
      patientName: "Daniel Adams",
      doctorName: "Dr. Susan Young",
      appointmentDate: "2025-07-11",
      treatmentName: "Tooth Filling",
      treatmentCost: 120,
      session: 1,
      status: "Failed",
    },
    {
      SL: 12,
      invoiceNumber: "INV-1012",
      patientName: "Ella Turner",
      doctorName: "Dr. Jack Allen",
      appointmentDate: "2025-07-12",
      treatmentName: "Wisdom Tooth Removal",
      treatmentCost: 400,
      session: 1,
      status: "Paid",
    },
    {
      SL: 13,
      invoiceNumber: "INV-1013",
      patientName: "Liam Walker",
      doctorName: "Dr. Monica Reyes",
      appointmentDate: "2025-07-13",
      treatmentName: "Mouth Guard",
      treatmentCost: 180,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 14,
      invoiceNumber: "INV-1014",
      patientName: "Grace Hill",
      doctorName: "Dr. Kevin Brooks",
      appointmentDate: "2025-07-14",
      treatmentName: "Gum Treatment",
      treatmentCost: 250,
      session: 2,
      status: "Paid",
    },
    {
      SL: 15,
      invoiceNumber: "INV-1015",
      patientName: "Jacob Hall",
      doctorName: "Dr. Amanda Carter",
      appointmentDate: "2025-07-15",
      treatmentName: "Orthodontics",
      treatmentCost: 900,
      session: 3,
      status: "Unpaid",
    },
    {
      SL: 16,
      invoiceNumber: "INV-1016",
      patientName: "Sophie Allen",
      doctorName: "Dr. Brian Lewis",
      appointmentDate: "2025-07-16",
      treatmentName: "Dental Checkup",
      treatmentCost: 100,
      session: 1,
      status: "Paid",
    },
    {
      SL: 17,
      invoiceNumber: "INV-1017",
      patientName: "Luke Bennett",
      doctorName: "Dr. Karen Morgan",
      appointmentDate: "2025-07-17",
      treatmentName: "Scaling",
      treatmentCost: 160,
      session: 1,
      status: "Failed",
    },
    {
      SL: 18,
      invoiceNumber: "INV-1018",
      patientName: "Mia Carter",
      doctorName: "Dr. Steve Murphy",
      appointmentDate: "2025-07-18",
      treatmentName: "Tooth Bonding",
      treatmentCost: 230,
      session: 1,
      status: "Paid",
    },
    {
      SL: 19,
      invoiceNumber: "INV-1019",
      patientName: "Noah Cox",
      doctorName: "Dr. Rachel Lee",
      appointmentDate: "2025-07-19",
      treatmentName: "Retainers",
      treatmentCost: 210,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 20,
      invoiceNumber: "INV-1020",
      patientName: "Ava Diaz",
      doctorName: "Dr. Henry Clark",
      appointmentDate: "2025-07-20",
      treatmentName: "Teeth Polishing",
      treatmentCost: 90,
      session: 1,
      status: "Paid",
    },
    {
      SL: 21,
      invoiceNumber: "INV-1021",
      patientName: "Ethan Evans",
      doctorName: "Dr. Sarah Smith",
      appointmentDate: "2025-07-21",
      treatmentName: "Fluoride Treatment",
      treatmentCost: 75,
      session: 1,
      status: "Paid",
    },
    {
      SL: 22,
      invoiceNumber: "INV-1022",
      patientName: "Isabella Foster",
      doctorName: "Dr. Robert Brown",
      appointmentDate: "2025-07-22",
      treatmentName: "Smile Design",
      treatmentCost: 950,
      session: 2,
      status: "Failed",
    },
    {
      SL: 23,
      invoiceNumber: "INV-1023",
      patientName: "Logan Garcia",
      doctorName: "Dr. Angela Davis",
      appointmentDate: "2025-07-23",
      treatmentName: "Teeth Alignment",
      treatmentCost: 1100,
      session: 3,
      status: "Unpaid",
    },
    {
      SL: 24,
      invoiceNumber: "INV-1024",
      patientName: "Chloe Harris",
      doctorName: "Dr. Lisa Wong",
      appointmentDate: "2025-07-24",
      treatmentName: "Cavity Filling",
      treatmentCost: 140,
      session: 1,
      status: "Paid",
    },
    {
      SL: 25,
      invoiceNumber: "INV-1025",
      patientName: "Jayden Hill",
      doctorName: "Dr. James Wilson",
      appointmentDate: "2025-07-25",
      treatmentName: "Oral Surgery",
      treatmentCost: 1300,
      session: 2,
      status: "Failed",
    },
    {
      SL: 26,
      invoiceNumber: "INV-1026",
      patientName: "Zoe Jenkins",
      doctorName: "Dr. Nina Patel",
      appointmentDate: "2025-07-26",
      treatmentName: "Gum Reshaping",
      treatmentCost: 400,
      session: 1,
      status: "Unpaid",
    },
    {
      SL: 27,
      invoiceNumber: "INV-1027",
      patientName: "Matthew Kelly",
      doctorName: "Dr. Victor Hugo",
      appointmentDate: "2025-07-27",
      treatmentName: "Dental Sealants",
      treatmentCost: 110,
      session: 1,
      status: "Paid",
    },
    {
      SL: 28,
      invoiceNumber: "INV-1028",
      patientName: "Lily Lopez",
      doctorName: "Dr. Rachel Lee",
      appointmentDate: "2025-07-28",
      treatmentName: "Smile Correction",
      treatmentCost: 850,
      session: 2,
      status: "Unpaid",
    },
    {
      SL: 29,
      invoiceNumber: "INV-1029",
      patientName: "Samuel Miller",
      doctorName: "Dr. Kevin Brooks",
      appointmentDate: "2025-07-29",
      treatmentName: "Jaw Alignment",
      treatmentCost: 1350,
      session: 3,
      status: "Failed",
    },
    {
      SL: 30,
      invoiceNumber: "INV-1030",
      patientName: "Victoria Nelson",
      doctorName: "Dr. Amanda Carter",
      appointmentDate: "2025-07-30",
      treatmentName: "Teeth Contouring",
      treatmentCost: 310,
      session: 1,
      status: "Paid",
    },
  ]);

  // console.log("allTreatment", allTreatment);
  const [filteredInvoice, setFilteredInvoice] = useState<Invoice[]>(invoices);

  // search and pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredInvoice.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentInvoice = filteredInvoice.slice(startIndex, endIndex);

  //   useEffect(() => {
  //     const fetchTreatments = async () => {
  //       try {
  //         const response = await fetch("/api/treatment/treatment-list");
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch treatments");
  //         }
  //         const data = await response.json();
  //         setAllTreatment(data.treatments);
  //       } catch (error) {
  //         console.error("Error fetching treatments:", error);
  //       }
  //     };

  //     fetchTreatments();
  //   }, []);

  useEffect(() => {
    const result: Invoice[] = invoices.filter(
      (invoice) =>
        invoice.patientName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.treatmentName.toLowerCase().includes(search.toLowerCase())
    );
    // console.log(result);
    setFilteredInvoice(result);
    setCurrentPage(1);
  }, [search, invoices]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (invoices.length <= 0) {
    return;
  }

  //   const handleDelete = async (treatmentId: string) => {
  //     if (confirm("Are you sure you want to delete this treatment?")) {
  //       try {
  //         const response = await fetch(
  //           `/api/treatment/delete-treatment/${treatmentId}`,
  //           {
  //             method: "DELETE",
  //           }
  //         );
  //         if (!response.ok) {
  //           throw new Error("Failed to delete treatment");
  //         }
  //         const data = await response.json();
  //         setInvoices((prev) =>
  //           prev.filter((treatment) => treatment.treatment_id !== treatmentId)
  //         );
  //         console.log(data.message);
  //       } catch (error) {
  //         console.error("Error deleting treatment:", error);
  //       }
  //     }
  //   };

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Invoice List</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Doctor
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Treatment List
          </li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/doctor/invoice/create-invoice"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create New Invoice
              </span>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    SL
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Invoice Number
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Appointment Date
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Treatment Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Treatment Cost
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Session
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>

                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentInvoice.length > 0 ? (
                  currentInvoice.map((treatment) => (
                    <tr key={treatment.SL}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.SL}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.invoiceNumber}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.patientName}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.doctorName}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.appointmentDate}{" "}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.treatmentName}{" "}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="font-bold block text-xs text-gray-500 dark:text-gray-400">
                          ${treatment.treatmentCost}{" "}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.session}{" "}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span
                          className={`${
                            treatment.status.toLowerCase() === "paid"
                              ? "bg-green-600"
                              : treatment.status.toLowerCase() === "unpaid"
                              ? "bg-yellow-600"
                              : "bg-red-500"
                          } px-2 py-1 rounded text-xs font-semibold text-gray-100`}
                        >
                          {treatment.status}{" "}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                            // onClick={() => setOpen(true)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
                          <Link href="/doctor/edit-invoice">
                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>
                          </Link>

                          <button
                            type="button"
                            // onClick={() =>
                            //   handleDelete(treatment.treatmentName)
                            // }
                            className="text-danger-500 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No Invoice matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pt-[12.5px] sm:flex sm:items-center justify-between">
              <p className="!mb-0 !text-xs">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </p>
              <ol className="mt-[10px] sm:mt-0 flex items-center">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === 1
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                    >
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                          currentPage === page
                            ? "border border-primary-500 bg-primary-500 text-white"
                            : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === totalPages
                        ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;

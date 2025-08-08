/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import html2pdf from "html2pdf.js";

interface Prescription {
  prescription_id: number ;
  patient_id: number;
  patient_name: string;

  patient_mobile_number: string | null;
  patient_email: string | null;
  
  prescribed_at: Date;
  prescribed_doctor_name: string; 
  next_visit_date: Date | null; 
}


const NextAppointmentList: React.FC = () => {
  const appointmentListRef = useRef<HTMLDivElement | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [morePrescriptions, setMorePrescriptions] = useState<Prescription[]>(
    []
  );
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  // Helper function to format Date objects to YYYY-MM-DD string for display
  const formatDateToYYYYMMDD = (date: Date | null): string => {
    if (!date) return "N/A";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleDownloadPDF = async () => {
  if (!appointmentListRef.current) return;
  const element = appointmentListRef.current;
  const filename = `Next_Appointment_List_${new Date().toISOString().split("T")[0]}.pdf`;

  // Clone so UI isn't mutated and we can inject PDF-only heading
  const clone = element.cloneNode(true) as HTMLElement;

  // --- Remove the "Actions" column from the cloned table ---
  // Remove the header cell
  clone.querySelectorAll("th").forEach((th) => {
    if (th.textContent?.trim().toLowerCase().includes("actions")) {
      th.remove();
    }
    if (th.textContent?.trim().toLowerCase().includes("Prescription Date")) {
      th.remove();
    }
    
  });
    clone.querySelectorAll("td").forEach((td) => {
    (td as HTMLElement).style.fontSize = "2px"; 
  });
  // Remove any whitespace-nowrap classes or similar that might prevent wrapping
clone.querySelectorAll("th, td").forEach((cell) => {
  cell.classList.remove("whitespace-nowrap");
  // Remove all Tailwind px-*, py-*, pl-*, pr-*, pt-*, pb-* classes
  cell.className = cell.className
    .split(" ")
    .filter(
      (cls) =>
        !/^px-\[.*\]$/.test(cls) &&
        !/^py-\[.*\]$/.test(cls) &&
        !/^pl-\[.*\]$/.test(cls) &&
        !/^pr-\[.*\]$/.test(cls) &&
        !/^pt-\[.*\]$/.test(cls) &&
        !/^pb-\[.*\]$/.test(cls)
    )
    .join(" ");
  // As a fallback: ensure wrapping via inline style too
  (cell as HTMLElement).style.whiteSpace = "normal";
  (cell as HTMLElement).style.wordBreak = "break-word";
  // (cell as HTMLElement).style.fontSize = "12px"; 
  (cell as HTMLElement).style.padding = "4px 6px";
});
  // Set font size for all td elements
clone.querySelectorAll("td").forEach((cell) => {
  (cell as HTMLElement).style.fontSize = "9px";
  // (cell as HTMLElement).style.padding = "2px 3px";
});

// Set font size for all span elements inside td
clone.querySelectorAll("td span").forEach((span) => {
  (span as HTMLElement).style.fontSize = "9px";
  // (span as HTMLElement).style.fontWeight = "400";
});

  // // Change "Patient ID" header to "P. ID" in the cloned table
  // clone.querySelectorAll("th").forEach((th) => {
  //   if (th.textContent?.trim() === "Prescription ID") {
  //     th.textContent = "P. ID";
  //   }
  //   if (th.textContent?.trim() === "Patient Name") {
  //     th.textContent = "Name";
  //   }
  //   if (th.textContent?.trim() === "Mobile Number") {
  //     th.textContent = "Phone";
  //   }
  //   if (th.textContent?.trim() === "Patient Email") {
  //     th.textContent = "Email";
  //   }
  //   // if (th.textContent?.trim() === "Prescription Date") {
  //   //   th.textContent = "P. Date";
  //   // }
    
  // });



  // Remove the corresponding last cell of each row (assumes actions is last)
  clone.querySelectorAll("tbody tr").forEach((tr) => {
    const cells = Array.from(tr.children);
    if (cells.length > 0) {
      // Optionally verify it's the actions cell by heuristics, but here we just drop last
      cells[cells.length - 1].remove();
    }
  });
  // Also adjust the "no data" row colspan if present
  clone.querySelectorAll('tbody tr td[colspan]').forEach((td) => {
    const colspan = parseInt(td.getAttribute("colspan") || "0", 10);
    if (colspan > 1) {
      // subtract 1 because we removed Actions column
      td.setAttribute("colspan", String(Math.max(1, colspan - 1)));
    }
  });
  // --- Prep clone for full-width capture ---
 // Make any overflow wrapper expand so html2canvas sees all columns
  clone.querySelectorAll(".table-responsive, .overflow-x-auto").forEach((el: Element) => {
    (el as HTMLElement).style.overflow = "visible";
  });

  // Remove any whitespace-nowrap classes or similar that might prevent wrapping
  clone.querySelectorAll("th, td").forEach((cell) => {
    cell.classList.remove("whitespace-nowrap");
    // As a fallback: ensure wrapping via inline style too
    (cell as HTMLElement).style.whiteSpace = "normal";
    (cell as HTMLElement).style.wordBreak = "break-word";
  });
//   clone.querySelectorAll("td").forEach((cell) => {
//   (cell as HTMLElement).style.fontSize = "4px";
// });

const heading = document.createElement("h2");
heading.textContent = "Next Appointment List";
heading.style.marginBottom = "8px";
heading.style.fontSize = "16px";
heading.style.fontWeight = "600";

// Create a flex row for date and legend
const headerRow = document.createElement("div");
headerRow.style.display = "flex";
headerRow.style.justifyContent = "space-between";
headerRow.style.alignItems = "center";
headerRow.style.marginBottom = "12px";
headerRow.style.fontSize = "12px";

// Date Selected
const dateLine = document.createElement("span");
dateLine.textContent = `Date Selected: ${selectedDate ? selectedDate : "Next Day"}`;

// Legend
const legend = document.createElement("span");
legend.textContent = "Legend: P. = Prescription";

// Add both to the row
headerRow.appendChild(dateLine);
// headerRow.appendChild(legend);

const headerWrapper = document.createElement("div");
headerWrapper.appendChild(heading);
headerWrapper.appendChild(headerRow);
clone.prepend(headerWrapper);

  clone.classList.add("pdf-export");

  const wrapper = document.createElement("div");
  wrapper.appendChild(clone);
  wrapper.style.position = "fixed";
  wrapper.style.top = "-9999px";
  document.body.appendChild(wrapper);

  const opt = {
  margin: [8, 25, 8, 25],
  filename,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: {
    scale: 1.6, // you can tweak between 1.4–2 for clarity vs fit
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: clone.scrollWidth + 100, // a bit of padding
  },
  jsPDF: { unit: "mm", format: "a4", orientation: "landscape" as const },
  pagebreak: { mode: ["avoid-all", "css", "legacy"] as any },
  };


  try {
    if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }

    await html2pdf()
      .set(opt)
      .from(clone)
      .save();
  } catch (err) {
    console.error("PDF generation failed:", err);
  } finally {
    document.body.removeChild(wrapper);
  }
};


  useEffect(() => {
  const fetchNextAppointments = async () => {
    try {
      let apiUrl = "/api/next-appoinment";
      if (selectedDate) {
        apiUrl += `?date=${selectedDate}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch next appointments");
      }

      const data = await response.json();

      const prescriptionData = data.prescriptions || [];
      const nextAppointmentData = data.nextAppointments || [];

      // Format prescriptions
      const formattedPrescriptions = prescriptionData.map((item: any) => ({
        ...item,
        prescribed_at: new Date(item.prescribed_at),
        next_visit_date: item.next_visit_date
          ? new Date(item.next_visit_date)
          : null,
      }));

      // Format next appointments
      const formattedAppointments = nextAppointmentData.map((item: any) => ({
        ...item,
        set_next_appoinmnet: new Date(item.set_next_appoinmnet),
      }));

      // Combine both arrays into one
      const combinedData = [...formattedPrescriptions, ...formattedAppointments];

      setPrescriptions(combinedData);
    } catch (error) {
      console.error("Error fetching next appointments:", error);
    }
  };

  fetchNextAppointments();
}, [selectedDate]);

    useEffect(() => {
    setFilteredPrescriptions(prescriptions);
  }, [prescriptions]);

  console.log(selectedDate);
  const [filteredPrescriptions, setFilteredPrescriptions] =
    useState<Prescription[]>(prescriptions);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredPrescriptions.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPrescriptions = filteredPrescriptions.slice(
    startIndex,
    endIndex
  );


const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const type = e.target.value;
  if (type === "new") {
    // Show only new patients (no prescription_id)
    setFilteredPrescriptions(prescriptions.filter(p => !p.prescription_id));
  } else if (type === "old") {
    // Show only old patients (has prescription_id)
    setFilteredPrescriptions(prescriptions.filter(p => !!p.prescription_id));
  } else {
    // Show all
    setFilteredPrescriptions(prescriptions);
  }
};

  useEffect(() => {
    const result: Prescription[] = prescriptions.filter(
      (prescription) =>
        prescription.patient_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        // Check if prescribed_doctor_name exists before calling toLowerCase
        (prescription.prescribed_doctor_name &&
          prescription.prescribed_doctor_name
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        prescription.prescription_id.toString().includes(search) ||
        (prescription.patient_mobile_number &&
          prescription.patient_mobile_number.toString().includes(search)) ||
        (prescription.patient_email &&
          prescription.patient_email.toLowerCase().includes(search.toLowerCase())) ||
        // Include date fields in search
        (prescription.prescribed_at &&
          formatDateToYYYYMMDD(prescription.prescribed_at).includes(search)) ||
        (prescription.next_visit_date &&
          formatDateToYYYYMMDD(prescription.next_visit_date).includes(search)) ||
        prescription.patient_id.toString().includes(search),
    );
    // console.log(result);
    setFilteredPrescriptions(result);
    setCurrentPage(1);
  }, [search, prescriptions]);


  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const handleView = async (id: number) => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(
          `/api/prescription/prescription-by-patient-id/${id}`,
        );
        const newPres = await res.json();
        // Assume this API returns similar structure, adapt as necessary
        const formattedMorePrescriptions = newPres.prescriptions.map(
          (prescription: any) => ({
            ...prescription,
            prescribed_at: new Date(prescription.prescribed_at),
            next_visit_date: prescription.next_visit_date
              ? new Date(prescription.next_visit_date)
              : null,
            patient_mobile_number: prescription.mobile_number, 
            prescribed_doctor_name: prescription.doctor_name, 
            patient_email: prescription.email, 
          }),
        );
        setMorePrescriptions(formattedMorePrescriptions);
        console.log(morePrescriptions);
      } catch (error) {
        console.error("Error fetching patient prescriptions:", error);
      }
    };
    // setIsOpen(true);
    fetchPatient();
  };


  console.log(prescriptions)
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Next Appointment List</h5>

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
            Next Appointment List
          </li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="sm:w-[500px] flex items-center gap-5">
              <div className="relative ">
                <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                  <i className="material-symbols-outlined !text-[20px]">
                    search
                  </i>
                </label>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex justify-start">
                      <select
                        onChange={handleSort}
                        className="px-5 bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                      >
                        <option value="">Sort by Patient Type</option>
                        <option value="new">New</option>
                        <option value="old">Old</option>
                      </select>

              </div>
              <div className="flex justify-start">
                  {/* <label htmlFor="NextPrescriptionDate">Select Next Appointment Date</label> */}
                <input
                  name="nextAppointmentDate" // Changed name for clarity
                  type="date"
                  placeholder="Select Date"
                  value={selectedDate} // Controlled component value
                  onChange={(e) => setSelectedDate(e.target.value)} // Update state on change
                  className="px-5 bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                />
                </div>
            </form>
          </div>

              <div className="flex justify-end-safe">
         
                    <div>
                      <label htmlFor="">Download Next Appointment List </label>
                        <button
                              type="button"
                              onClick={handleDownloadPDF}
                              className="font-small inline-block transition-all rounded-md md:text-md py-[4px] px-[10px] md:px-[12px] bg-secondary-500 text-white hover:bg-secondary-400 mx-[4px]"
                              aria-label="Download Prescription as PDF"
                            >

                              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                                  download
                                </i>
                                PDF 
                              </span>
                        </button>
                    </div>
              </div>
        </div>

        

        <div className="trezo-card-content relative" ref={appointmentListRef}>
          {/* PDF Header with selected date */}
          <div className="pdf-only-heading" style={{ display: "none" }}>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 18, textAlign: "center" }}>
              Next Appointment List
            </h2>
          </div>
          <div className="pdf-only-heading" style={{ display: "none" }}>
            <span className="font-semibold text-base">
              Date Selected: {selectedDate ? selectedDate : "Next Day"}
            </span>
          </div>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescription ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Name
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Mobile Number
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient Email
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Prescription Date
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Next Appointment  
                  </th>   
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Doctor&apos;s Name 
                  </th>   
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentPrescriptions.length > 0 ? (
                  currentPrescriptions.map((treatment) => (
                    <tr key={`row-${treatment.prescription_id || `appt-${treatment.patient_id}`}`}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.prescription_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_id}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_name}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_mobile_number}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {treatment.patient_email}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {formatDateToYYYYMMDD(treatment.prescribed_at)}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                             {formatDateToYYYYMMDD(treatment.next_visit_date)}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {treatment.prescribed_doctor_name}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
     
                          <button
                            onClick={() => handleView(treatment.patient_id)}
                          >
                            <span className="material-symbols-outlined !text-md">
                              sms
                            </span>
                          </button>
                          <button
                            onClick={() => handleView(treatment.patient_id)}
                          >
                            <span className="material-symbols-outlined !text-md">
                              email
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No prescriptions available
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

export default NextAppointmentList;


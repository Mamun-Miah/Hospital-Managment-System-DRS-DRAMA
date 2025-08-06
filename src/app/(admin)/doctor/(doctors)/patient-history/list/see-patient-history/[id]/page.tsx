
// // src\app\(admin)\doctor\(doctors)\patient-history\list\see-patient-history\[id]\page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// // Re-defining the interfaces to ensure they are consistent
// interface PatientInfo {
//   patient_id: number;
//   patient_name: string;
//   email: string;
//   mobile_number: string;
//   gender: string;
//   age: string;
//   blood_group: string;
//   weight: string;
//   emergency_contact_phone: string;
//   image_url?: string;
// }

// interface PrescriptionItem {
//   item_id: number;
//   medicine_name: string;
//   dose_morning: string;
//   dose_mid_day: string;
//   dose_night: string;
//   duration_days: number;
// }

// interface TreatmentItem {
//   treatment_name: string;
//   duration_months: number;
//   payable_treatment_amount: number;
//   discount_type: string;
//   discount_value: number;
// }

// interface Prescription {
//   prescription_id: number;
//   prescribed_at: string;
//   total_cost: number;
//   prescribed_doctor_name: string;
//   doctor_image_url?: string;
//   advise: string;
//   next_visit_date: string;
//   medicine_items: PrescriptionItem[];
//   treatment_items: TreatmentItem[];
// }

// interface PatientHistoryResponse {
//   patient: PatientInfo;
//   prescriptions: Prescription[];
// }

// // Interface for the timeline event structure
// interface TimelineEvent {
//   time: string;
//   title: string;
//   description: string;
//   author: string;
//   color: string; // Tailwind CSS class for background color
//   participants: string[]; // URLs for participant images
//   extraParticipants?: number;
// }

// export default function Page() {
//   const { id } = useParams<{ id: string }>();
//   const [data, setData] = useState<PatientHistoryResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(`/api/doctor/view-patient-history/${id}`);
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         const result = await res.json();

//         // Map API response to the PatientHistoryResponse interface
//         setData({
//           patient: {
//             patient_id: result.patient_id,
//             patient_name: result.patient_name,
//             email: result.email || "", // Ensure these fields exist or provide defaults
//             mobile_number: result.mobile_number || "",
//             gender: result.gender || "",
//             age: result.age || "",
//             blood_group: result.blood_group || "",
//             weight: result.weight || "",
//             emergency_contact_phone: result.emergency_contact_phone || "",
//             image_url: result.image_url,
//           },
//           prescriptions: result.prescriptions.map((p: {
//             prescription_id: number;
//             prescribed_at: string;
//             total_cost: number;
//             doctor_name?: string;
//             doctor_image?: string;
//             advise: string;
//             next_visit_date?: string;
//             medicines: {
//               item_id: number;
//               medicine_name: string;
//               dose_morning: string;
//               dose_mid_day: string;
//               dose_night: string;
//               duration_days: number;
//             }[];
//             treatments: {
//               treatment_name: string;
//               duration_months?: number;
//               payable_amount: number;
//               discount_type: string;
//               discount_value: number;
//             }[];
//           }) => ({
//             prescription_id: p.prescription_id,
//             prescribed_at: p.prescribed_at,
//             total_cost: p.total_cost,
//             prescribed_doctor_name: p.doctor_name || "Unknown Doctor",
//             doctor_image_url: p.doctor_image || "/uploads/default.avif",
//             advise: p.advise,
//             next_visit_date: p.next_visit_date || new Date().toISOString().split("T")[0],
//             medicine_items: p.medicines.map((m: {
//               item_id: number;
//               medicine_name: string;
//               dose_morning: string;
//               dose_mid_day: string;
//               dose_night: string;
//               duration_days: number;
//             }) => ({
//                 item_id: m.item_id,
//                 medicine_name: m.medicine_name,
//                 dose_morning: m.dose_morning,
//                 dose_mid_day: m.dose_mid_day,
//                 dose_night: m.dose_night,
//                 duration_days: m.duration_days,
//             })),
//             treatment_items: p.treatments.map((t: {
//               treatment_name: string;
//               duration_months?: number;
//               payable_amount: number;
//               discount_type: string;
//               discount_value: number;
//             }) => ({
//                 treatment_name: t.treatment_name,
//                 duration_months: t.duration_months || 0,
//                 payable_treatment_amount: t.payable_amount,
//                 discount_type: t.discount_type,
//                 discount_value: t.discount_value,
//             })),
//           })),
//         });
//       } catch (error) {
//         console.error("Error fetching patient history:", error);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, [id]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!data || !data.patient) return <div className="p-6">No patient data found or an error occurred.</div>;

//   const { patient, prescriptions } = data;

//   // Function to format date and time for timeline
//   const formatTimelineTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     };
//     // Example: "Tuesday, July 30, 2025 at 05:30 PM"
//     return date.toLocaleString('en-US', options);
//   };

//   // Function to generate a random color from a predefined set
//   const getRandomColor = (): string => {
//     const colors = ["bg-success-500", "bg-orange-500", "bg-purple-500", "bg-secondary-500", "bg-blue-500", "bg-red-500"];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   // Transform prescriptions into timeline events
//   const timelineEvents: TimelineEvent[] = prescriptions.map((p) => {
//     let description = p.advise;
//     if (p.medicine_items.length > 0) {
//       description += ` Prescribed Medicines: ${p.medicine_items.map(m => m.medicine_name).join(', ')}.`;
//     }
//     if (p.treatment_items.length > 0) {
//       description += ` Recommended Treatments: ${p.treatment_items.map(t => t.treatment_name).join(', ')}.`;
//     }

//     // You might want to get actual doctor images or default placeholders here
//     // For now, using a placeholder if you don't have doctor images in your data
//     // const doctorImage = "/images/users/default_doctor_avatar.png";
//     const doctorImage = p.doctor_image_url || "/uploads/default.avif";

//     return {
//       time: formatTimelineTime(p.prescribed_at),
//       title: `Visit with Dr. ${p.prescribed_doctor_name}`,
//       description: description,
//       author: p.prescribed_doctor_name,
//       color: getRandomColor(), // Assign a random color
//       // If you want to show other staff involved, you'd pull that data from your API
//       participants: [doctorImage], // Ex  ample: showing the doctor as a participant
//       extraParticipants: p.total_cost > 0 ? 1 : undefined, // Example: showing total cost as extra
//     };
//   });

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold mb-4">Medical History for {patient.patient_name}</h2> 
//       {/* <h6 className="text-2xl font-bold mb-4">Gender: <span> {patient.gender} </span> Age:  <span> {patient.age} </span> </h6>  */}

//       <div className="flex items-center space-x-6 mb-4">
//         {patient.gender && (
//           <h6 className="text-2xl font-bold">Gender: <span className="font-normal text-s"> {patient.gender} </span></h6>
//         )}
//         {patient.age && (
//           <h6 className="text-2xl font-bold">Age: <span className="font-normal text-s"> {patient.age} </span></h6>
//         )}
//         {patient.email && (
//           <h6 className="text-2xl font-bold">Email: <span className="font-normal text-s"> {patient.email} </span></h6>
//         )}
//         {patient.mobile_number && (
//           <h6 className="text-2xl font-bold">Mobile: <span className="font-normal text-s"> {patient.mobile_number} </span></h6>
//         )}
//         {patient.blood_group && (
//           <h6 className="text-2xl font-bold">Blood Group: <span className="font-normal text-s"> {patient.blood_group} </span></h6>
//         )}
//         {patient.weight && (
//           <h6 className="text-2xl font-bold">Weight: <span className="font-normal text-s"> {patient.weight} </span></h6>
//         )}
//         {patient.emergency_contact_phone && (
//           <h6 className="text-2xl font-bold">Emergency Number: <span className="font-normal text-s"> {patient.emergency_contact_phone} </span></h6>
//         )}
//       </div>
          
      

//       {/* Patient Information Card */}
//       {/* <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
//         <div className="trezo-card-header mb-[20px] md:mb-[25px]">
//           <h5 className="!mb-0">Patient Details</h5>
//         </div>
//         <div className="trezo-card-content">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="mb-4">
//               <Image
//                 src={patient.image_url || "/uploads/default.avif"}
//                 width={100}
//                 height={100}
//                 className="rounded-full object-cover"
//                 alt="patient image"
//               />
//             </div>
//             <div>
//               <p><strong>Patient ID:</strong> {patient.patient_id}</p>
//               <p><strong>Name:</strong> {patient.patient_name}</p>
//               <p><strong>Email:</strong> {patient.email}</p>
//               <p><strong>Phone:</strong> {patient.mobile_number}</p>
//               <p><strong>Gender:</strong> {patient.gender}</p>
//               <p><strong>Age:</strong> {patient.age}</p>
//               <p><strong>Blood Group:</strong> {patient.blood_group}</p>
//               <p><strong>Weight:</strong> {patient.weight}</p>
//               <p><strong>Emergency Contact:</strong> {patient.emergency_contact_phone}</p>
//             </div>
//           </div>
//         </div>
//       </div> */}

 

//       {/* Medical History Timeline */}
//       <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
//         <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
//           <h5 className="!mb-0">Medical History Timeline</h5>
//         </div>

//         <div className="trezo-card-content pt-[10px] pb-[25px]">
//           <div className="relative">
//             <span className="block absolute top-0 bottom-0 ltr:left-[6px] rtl:right-[6px] ltr:md:left-[150px] rtl:md:right-[150px] mt-[5px] ltr:border-l rtl:border-r border-dashed border-gray-100 dark:border-[#172036]"></span>
//             {timelineEvents.length > 0 ? (
//               timelineEvents.map((event, index) => (
//                 <div
//                   key={index}
//                   className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[180px] rtl:md:pr-[180px] mb-[25px] last:mb-0"
//                 >
//                   <span
//                     className={`block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[144px] rtl:md:right-[144px] w-[12px] h-[12px] rounded-full ${event.color}`}
//                   ></span>
//                   <span className="md:absolute md:top-0 ltr:md:left-0 rtl:md:right-0 text-sm block mb-[10px] md:mb-0 w-[120px] ltr:md:text-right rtl:md:text-left">
//                     {event.time}
//                   </span>
//                   <span className="mb-[8px] block text-black dark:text-white font-medium">
//                     {event.title}
//                   </span>
//                   <p className="md:max-w-[770px] text-sm leading-[1.7] mb-[12px]">
//                     {event.description}

//                     {/* Prescitpion detals
//                     {event.prescribed_at} */}
//                   </p>
//                   {event.participants.length > 0 && (
//                     <div className="flex items-center mb-[12px]">
//                       {event.participants.map((user, idx) => (
//                         <div
//                           key={idx}
//                           className="w-[40px] h-[40px] rounded-full ltr:-mr-[12px] rtl:-ml-[12px] border-[2px] border-[#ECEEF2] dark:border-[#172036]"
//                         >
//                           <Image
//                             alt="participant-image"
//                             className="rounded-full"
//                             src={user}
//                             width={40}
//                             height={40}
//                           />
//                         </div>
//                       ))}
//                       {event.extraParticipants && (
//                         <div className="w-[40px] h-[40px] text-xs rounded-full border-[2px] border-white bg-primary-500 text-white font-medium flex items-center justify-center">
//                           +{event.extraParticipants}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <span className="block text-sm">
//                     By: <span className="text-primary-500">{event.author}</span>
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-4 text-gray-500 dark:text-gray-400">
//                 No medical history available for this patient.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// interface PatientInfo {
//   patient_id: number;
//   patient_name: string;
//   email: string;
//   mobile_number: string;
//   gender: string;
//   age: string;
//   blood_group: string;
//   weight: string;
//   emergency_contact_phone: string;
//   image_url?: string;
// }

// interface PrescriptionItem {
//   item_id: number;
//   medicine_name: string;
//   dose_morning: string;
//   dose_mid_day: string;
//   dose_night: string;
//   duration_days: number;
// }

// interface TreatmentItem {
//   treatment_name: string;
//   duration_months: number;
//   payable_treatment_amount: number;
//   discount_type: string;
//   discount_value: number;
// }

// interface PaymentItem {
//   payment_id: number;
//   paid_at: string;
//   amount: number;
//   payment_method: string;
//   collected_by: string;
// }

// interface AppointmentItem {
//   appointment_id: number;
//   booked_at: string;
//   appointment_date: string;
//   department: string;
//   doctor_name: string;
// }

// interface Prescription {
//   prescription_id: number;
//   prescribed_at: string;
//   total_cost: number;
//   prescribed_doctor_name: string;
//   doctor_image_url?: string;
//   advise: string;
//   next_visit_date: string;
//   medicine_items: PrescriptionItem[];
//   treatment_items: TreatmentItem[];
// }

// interface PatientHistoryResponse {
//   patient: PatientInfo;
//   prescriptions: Prescription[];
//   payments?: PaymentItem[];
//   appointments?: AppointmentItem[];
// }

// interface TimelineEvent {
//   time: string;
//   title: string;
//   description: string;
//   author: string;
//   color: string;
//   participants: string[];
//   extraParticipants?: number;
// }

// export default function Page() {
//   const { id } = useParams<{ id: string }>();
//   const [data, setData] = useState<PatientHistoryResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(`/api/doctor/view-patient-history/${id}`);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const result = await res.json();

//         // The API now returns a structured object, so we can set the state directly.
//         setData({
//           patient: result.patient,
//           prescriptions: result.prescriptions.map((p: any) => ({
//             prescription_id: p.prescription_id,
//             prescribed_at: p.prescribed_at,
//             total_cost: p.total_cost,
//             // These keys now match the API response
//             prescribed_doctor_name: p.prescribed_doctor_name, 
//             doctor_image_url: p.doctor_image_url, 
//             advise: p.advise,
//             next_visit_date: p.next_visit_date || new Date().toISOString(),
//             // `medicine_items` and `treatment_items` are already correctly named
//             medicine_items: p.medicine_items,
//             treatment_items: p.treatment_items,
//           })),
//           payments: result.payments || [],
//           appointments: result.appointments || [],
//         });
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [id]);


//   const formatTimelineTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getRandomColor = (): string => {
//     const colors = [
//       "bg-success-500",
//       "bg-orange-500",
//       "bg-purple-500",
//       "bg-secondary-500",
//       "bg-blue-500",
//       "bg-red-500",
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!data || !data.patient) return <div className="p-6">No data available.</div>;

//   const timelineEvents: TimelineEvent[] = [];

//   data.prescriptions.forEach((p) => {
//     timelineEvents.push({
//       time: formatTimelineTime(p.prescribed_at),
//       title: `Prescription by Dr. ${p.prescribed_doctor_name}`,
//       description: `${p.advise}. Medicines: ${p.medicine_items
//         .map((m) => m.medicine_name)
//         .join(", ")}. Treatments: ${p.treatment_items
//         .map((t) => t.treatment_name)
//         .join(", ")}`,
//       author: p.prescribed_doctor_name,
//       color: getRandomColor(),
//       participants: [p.doctor_image_url || "/uploads/default.avif"],
//       extraParticipants: p.total_cost ? 1 : undefined,
//     });
//   });

//   data.payments?.forEach((p) => {
//     timelineEvents.push({
//       time: formatTimelineTime(p.paid_at),
//       title: `Payment of ৳${p.amount}`,
//       description: `Paid via ${p.payment_method}. Collected by ${p.collected_by}.`,
//       author: p.collected_by,
//       color: "bg-green-600",
//       participants: [],
//     });
//   });

//   data.appointments?.forEach((a) => {
//     timelineEvents.push({
//       time: formatTimelineTime(a.booked_at),
//       title: `Appointment with Dr. ${a.doctor_name}`,
//       description: `Department: ${a.department}. Scheduled on ${formatTimelineTime(
//         a.appointment_date
//       )}`,
//       author: a.doctor_name,
//       color: "bg-yellow-500",
//       participants: [],
//     });
//   });

//   timelineEvents.sort(
//     (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold mb-4">
//         Medical History Timeline for {data.patient.patient_name}
//       </h2>

//       <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
//         <div className="trezo-card-header mb-[25px] flex items-center justify-between">
//           <h5 className="!mb-0">Timeline</h5>
//         </div>
//         <div className="trezo-card-content pt-[10px] pb-[25px]">
//           <div className="relative">
//             <span className="block absolute top-0 bottom-0 left-[6px] md:left-[150px] mt-[5px] border-l border-dashed border-gray-100 dark:border-[#172036]"></span>
//             {timelineEvents.length > 0 ? (
//               timelineEvents.map((event, index) => (
//                 <div
//                   key={index}
//                   className="relative pl-[25px] md:pl-[180px] mb-[25px] last:mb-0"
//                 >
//                   <span
//                     className={`block absolute top-[3px] left-0 md:left-[144px] w-[12px] h-[12px] rounded-full ${event.color}`}
//                   ></span>
//                   <span className="md:absolute md:top-0 md:left-0 text-sm block mb-[10px] md:mb-0 w-[120px] text-right">
//                     {event.time}
//                   </span>
//                   <span className="mb-[8px] block text-black dark:text-white font-medium">
//                     {event.title}
//                   </span>
//                   <p className="md:max-w-[770px] text-sm leading-[1.7] mb-[12px]">
//                     {event.description}
//                   </p>
//                   {event.participants.length > 0 && (
//                     <div className="flex items-center mb-[12px]">
//                       {event.participants.map((user, idx) => (
//                         <div
//                           key={idx}
//                           className="w-[40px] h-[40px] rounded-full -mr-[12px] border-2 border-white"
//                         >
//                           <Image
//                             src={user}
//                             alt="participant"
//                             width={40}
//                             height={40}
//                             className="rounded-full"
//                           />
//                         </div>
//                       ))}
//                       {event.extraParticipants && (
//                         <div className="w-[40px] h-[40px] text-xs rounded-full border-2 border-white bg-primary-500 text-white font-medium flex items-center justify-center">
//                           +{event.extraParticipants}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <span className="block text-sm">
//                     By:{" "}
//                     <span className="text-primary-500">{event.author}</span>
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-4 text-gray-500 dark:text-gray-400">
//                 No history available.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// interface PatientInfo {
//   patient_id: number;
//   patient_name: string;
//   email: string;
//   mobile_number: string;
//   gender: string;
//   age: string;
//   blood_group: string;
//   weight: string;
//   emergency_contact_phone: string;
//   image_url?: string;
// }

// interface PrescriptionItem {
//   item_id: number;
//   medicine_name: string;
//   dose_morning: string;
//   dose_mid_day: string;
//   dose_night: string;
//   duration_days: number;
// }

// interface TreatmentItem {
//   treatment_name: string;
//   duration_months: number;
//   payable_treatment_amount: number;
//   discount_type: string;
//   discount_value: number;
// }

// interface PaymentItem {
//   payment_id: number;
//   paid_at: string;
//   amount: number;
//   payment_method: string;
//   collected_by: string;
// }

// interface AppointmentItem {
//   appointment_id: number;
//   booked_at: string;
//   appointment_date: string;
//   department: string;
//   doctor_name: string;
// }

// interface Prescription {
//   prescription_id: number;
//   prescribed_at: string;
//   total_cost: number;
//   prescribed_doctor_name: string;
//   doctor_image_url?: string;
//   advise: string;
//   next_visit_date: string;
//   medicine_items: PrescriptionItem[];
//   treatment_items: TreatmentItem[];
// }

// interface PatientHistoryResponse {
//   patient: PatientInfo;
//   prescriptions: Prescription[];
//   payments?: PaymentItem[];
//   appointments?: AppointmentItem[];
// }

// interface TimelineEvent {
//   time: string;
//   title: string;
//   description: string;
//   author: string;
//   color: string;
//   participants: string[];
//   extraParticipants?: number;
// }

// export default function Page() {
//   const { id } = useParams<{ id: string }>();
//   const [data, setData] = useState<PatientHistoryResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(`/api/doctor/view-patient-history/${id}`);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const result = await res.json();
//         if (result){
//             setData({
//               patient: result.patient,
//               prescriptions: result.prescriptions,
//               payments: result.payments || [],
//               appointments: result.appointments || [],
//             });

//         }
        

//       } catch (error) {
//         console.error("Fetch error:", error);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [id]);

//   const formatTimelineTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getRandomColor = (): string => {
//     const colors = [
//       "bg-success-500",
//       "bg-orange-500",
//       "bg-purple-500",
//       "bg-secondary-500",
//       "bg-blue-500",
//       "bg-red-500",
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!data || !data.patient) return <div className="p-6">No data available.</div>;

//   const timelineEvents: TimelineEvent[] = [];

//   data.prescriptions.forEach((p) => {
//     // Prescription Event
//     timelineEvents.push({
//       time: formatTimelineTime(p.prescribed_at),
//       title: `Prescription by Dr. ${p.prescribed_doctor_name}`,
//       description: `Advise: ${p.advise}. Total cost: ৳${p.total_cost || 0}.`,
//       author: p.prescribed_doctor_name,
//       color: getRandomColor(),
//       participants: [p.doctor_image_url || "/uploads/default.avif"],
//     });

//     // Medicine Events
//     p.medicine_items.forEach((item) => {
//       timelineEvents.push({
//         time: formatTimelineTime(p.prescribed_at),
//         title: `Medicine: ${item.medicine_name}`,
//         description: `Dosage: M-${item.dose_morning || '0'}, A-${item.dose_mid_day || '0'}, N-${item.dose_night || '0'}. Duration: ${item.duration_days} days.`,
//         author: p.prescribed_doctor_name,
//         color: 'bg-info-500',
//         participants: [],
//       });
//     });

//     // Treatment Events
//     p.treatment_items.forEach((item) => {
//       timelineEvents.push({
//         time: formatTimelineTime(p.prescribed_at),
//         title: `Treatment: ${item.treatment_name}`,
//         description: `Duration: ${item.duration_months} months. Fee: ৳${item.payable_treatment_amount}. Discount: ${item.discount_value}${item.discount_type === 'Percentage' ? '%' : ''}.`,
//         author: p.prescribed_doctor_name,
//         color: 'bg-purple-500',
//         participants: [],
//       });
//     });
    
//     // Appointment Event (if applicable)
//     if (p.next_visit_date) {
//       timelineEvents.push({
//         time: formatTimelineTime(p.next_visit_date),
//         title: `Appointment with Dr. ${p.prescribed_doctor_name}`,
//         description: `Scheduled for next visit.`,
//         author: p.prescribed_doctor_name,
//         color: "bg-yellow-500",
//         participants: [],
//       });
//     }
//   });

//   data.payments?.forEach((p) => {
//     timelineEvents.push({
//       time: p.paid_at ? formatTimelineTime(p.paid_at) : 'N/A',
//       title: `Payment of ৳${p.amount}`,
//       description: `Paid via ${p.payment_method}. Collected by ${p.collected_by}.`,
//       author: p.collected_by,
//       color: "bg-green-600",
//       participants: [],
//     });
//   });

//   timelineEvents.sort(
//     (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold mb-4">
//         Medical History Timeline for {data.patient.patient_name}
//       </h2>

//       <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
//         <div className="trezo-card-header mb-[25px] flex items-center justify-between">
//           <h5 className="!mb-0">Timeline</h5>
//         </div>
//         <div className="trezo-card-content pt-[10px] pb-[25px]">
//           <div className="relative">
//             <span className="block absolute top-0 bottom-0 left-[6px] md:left-[150px] mt-[5px] border-l border-dashed border-gray-100 dark:border-[#172036]"></span>
//             {timelineEvents.length > 0 ? (
//               timelineEvents.map((event, index) => (
//                 <div
//                   key={index}
//                   className="relative pl-[25px] md:pl-[180px] mb-[25px] last:mb-0"
//                 >
//                   <span
//                     className={`block absolute top-[3px] left-0 md:left-[144px] w-[12px] h-[12px] rounded-full ${event.color}`}
//                   ></span>
//                   <span className="md:absolute md:top-0 md:left-0 text-sm block mb-[10px] md:mb-0 w-[120px] text-right">
//                     {event.time}
//                   </span>
//                   <span className="mb-[8px] block text-black dark:text-white font-medium">
//                     {event.title}
//                   </span>
//                   <p className="md:max-w-[770px] text-sm leading-[1.7] mb-[12px]">
//                     {event.description}
//                   </p>
//                   {event.participants.length > 0 && (
//                     <div className="flex items-center mb-[12px]">
//                       {event.participants.map((user, idx) => (
//                         <div
//                           key={idx}
//                           className="w-[40px] h-[40px] rounded-full -mr-[12px] border-2 border-white"
//                         >
//                           <Image
//                             src={user}
//                             alt="participant"
//                             width={40}
//                             height={40}
//                             className="rounded-full"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <span className="block text-sm">
//                     By:{" "}
//                     <span className="text-primary-500">{event.author}</span>
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-4 text-gray-500 dark:text-gray-400">
//                 No history available.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface PatientInfo {
  patient_id: number;
  patient_name: string;
  email: string;
  mobile_number: string;
  gender: string;
  age: string;
  blood_group: string;
  weight: string;
  emergency_contact_phone: string;
  image_url?: string;
}

interface PrescriptionItem {
  item_id: number;
  medicine_name: string;
  dose_morning: string;
  dose_mid_day: string;
  dose_night: string;
  duration_days: number;
}

interface TreatmentItem {
  treatment_name: string;
  duration_months?: number;
  payable_treatment_amount: number;
  discount_type: string;
  discount_value: number;
}

interface PaymentItem {
  payment_id: number;
  paid_at: string;
  amount: number;
  payment_method: string;
  collected_by: string;
}

interface Prescription {
  prescription_id: number;
  prescribed_at: string;
  total_cost: number;
  prescribed_doctor_name: string;
  doctor_image_url?: string;
  advise: string;
  next_visit_date: string;
  medicine_items: PrescriptionItem[];
  treatment_items: TreatmentItem[];
}

interface PatientHistoryResponse {
  patient: PatientInfo;
  prescriptions: Prescription[];
  payments?: PaymentItem[];
}

interface GroupedEvent {
  date: string;
  formattedDate: string;
  events: {
    title: string;
    description: string;
    author: string;
    color: string;
    participants: string[];
  }[];
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PatientHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/doctor/view-patient-history/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        if (result) {
          setData({
            patient: result.patient,
            prescriptions: result.prescriptions,
            payments: result.payments || [],
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const getDateKey = (dateStr: string) => new Date(dateStr).toISOString().split("T")[0];

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getRandomColor = (): string => {
    const colors = [
      "bg-success-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-secondary-500",
      "bg-blue-500",
      "bg-red-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data || !data.patient) return <div className="p-6">No data available.</div>;

  const groupedTimeline: { [key: string]: GroupedEvent } = {};

  data.prescriptions.forEach((p) => {
    const dateKey = getDateKey(p.prescribed_at);
    const doctor = p.prescribed_doctor_name;
    const doctorImage = p.doctor_image_url || "/uploads/default.avif";

    if (!groupedTimeline[dateKey]) {
      groupedTimeline[dateKey] = {
        date: dateKey,
        formattedDate: formatDate(p.prescribed_at),
        events: [],
      };
    }

    groupedTimeline[dateKey].events.push({
      title: `Prescription by Dr. ${doctor}`,
      description: `Advise: ${p.advise}. Total cost: ৳${p.total_cost}.`,
      author: doctor,
      color: getRandomColor(),
      participants: [doctorImage],
    });

    p.medicine_items.forEach((m) => {
      groupedTimeline[dateKey].events.push({
        title: `Medicine: ${m.medicine_name}`,
        description: `Dosage: M-${m.dose_morning}, A-${m.dose_mid_day}, N-${m.dose_night}. Duration: ${m.duration_days} days.`,
        author: doctor,
        color: "bg-info-500",
        participants: [],
      });
    });

    p.treatment_items.forEach((t) => {
      groupedTimeline[dateKey].events.push({
        title: `Treatment: ${t.treatment_name}`,
        description: `Fee: ৳${t.payable_treatment_amount}. Discount: ${t.discount_value}${t.discount_type === "Percentage" ? "%" : ""}.`,
        author: doctor,
        color: "bg-purple-500",
        participants: [],
      });
    });

    if (p.next_visit_date) {
      const nextVisitKey = getDateKey(p.next_visit_date);
      if (!groupedTimeline[nextVisitKey]) {
        groupedTimeline[nextVisitKey] = {
          date: nextVisitKey,
          formattedDate: formatDate(p.next_visit_date),
          events: [],
        };
      }
      groupedTimeline[nextVisitKey].events.push({
        title: `Appointment with Dr. ${doctor}`,
        description: `Scheduled for next visit.`,
        author: doctor,
        color: "bg-yellow-500",
        participants: [],
      });
    }
  });

  data.payments?.forEach((p) => {
    const dateKey = getDateKey(p.paid_at);
    if (!groupedTimeline[dateKey]) {
      groupedTimeline[dateKey] = {
        date: dateKey,
        formattedDate: formatDate(p.paid_at),
        events: [],
      };
    }
    groupedTimeline[dateKey].events.push({
      title: `Payment of ৳${p.amount}`,
      description: `Paid via ${p.payment_method}. Collected by ${p.collected_by}.`,
      author: p.collected_by,
      color: "bg-green-600",
      participants: [],
    });
  });

  const sortedGroupedTimeline = Object.values(groupedTimeline).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        Medical History Timeline for {data.patient.patient_name}
      </h2>

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[25px] flex items-center justify-between">
          <h5 className="!mb-0">Timeline</h5>
        </div>
        <div className="trezo-card-content pt-[10px] pb-[25px]">
          <div className="relative">
            <span className="block absolute top-0 bottom-0 left-[6px] md:left-[150px] mt-[5px] border-l border-dashed border-gray-100 dark:border-[#172036]"></span>

            {sortedGroupedTimeline.length > 0 ? (
              sortedGroupedTimeline.map((group, index) => (
                <div key={index} className="relative pl-[25px] md:pl-[180px] mb-[40px]">
                  <span className="md:absolute md:top-0 md:left-0 text-sm block mb-[10px] md:mb-0 w-[120px] text-right font-semibold text-blue-600 dark:text-blue-300">
                    {group.formattedDate}
                  </span>
                  {group.events.map((event, idx) => (
                    <div key={idx} className="mb-[25px]">
                      <span
                        className={`block w-[12px] h-[12px] rounded-full ${event.color} mb-[5px]`}
                      ></span>
                      <span className="mb-[8px] block text-black dark:text-white font-medium">
                        {event.title}
                      </span>
                      <p className="text-sm leading-[1.7] mb-[12px]">
                        {event.description}
                      </p>
                      {event.participants.length > 0 && (
                        <div className="flex items-center mb-[12px]">
                          {event.participants.map((user, id) => (
                            <div
                              key={id}
                              className="w-[40px] h-[40px] rounded-full -mr-[12px] border-2 border-white"
                            >
                              <Image
                                src={user}
                                alt="participant"
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="block text-sm">
                        By:{" "}
                        <span className="text-primary-500">{event.author}</span>
                      </span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No history available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

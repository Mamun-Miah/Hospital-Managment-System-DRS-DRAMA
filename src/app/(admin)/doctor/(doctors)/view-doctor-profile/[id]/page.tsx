import DoctorBio from '@/components/Doctor/DoctorBio';
import { PrismaClient } from '@prisma/client';
import Image from "next/image";
// import DoctorBio from '@/components/doctor/DoctorBio';

export default async function DoctorProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const prisma = new PrismaClient();

    const doctorId = parseInt(id, 10);


    // Fetch doctor from DB
    const doctor = await prisma.doctor.findUnique({
        where: { doctor_id: doctorId },
    });

    if (!doctor) {
        return <div>Doctor not found</div>;
    }

    return (
        <div className="p-6 space-y-6">

            {/* Doctor Header */}
            <div className="bg-white rounded-xl shadow p-6 flex justify-between">
                <div className="flex gap-4">
                    {/* <Image
                        src="/doctor.jpg"
                        alt="Doctor"
                        width={100}
                        height={100}
                        className="rounded-lg"
                    /> */}
                    <div>
                        <h2 className="text-xl font-semibold">{doctor.doctor_name}</h2>
                        <p className="text-gray-500">MBBS, MD, Cardiology</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">{doctor.specialization}</span>
                            <span className="text-gray-600">🏥 DRS Derma Medical Clinic</span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">Available</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">Consultation Charge</p>
                    <h3 className="text-2xl font-bold"> ৳{doctor.doctor_fee?.toNumber() ?? "N/A"}{' '} <span className="text-sm font-normal">/ appointment</span></h3>
                    {/* <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Book Appointment
                    </button> */}
                </div>
            </div>

            {/* Availability */}
            {/* <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Availability</h3>
                <div className="flex gap-4 border-b pb-2 mb-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                        <button key={day} className="pb-2 border-b-2 border-blue-600">{day}</button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {["11:30 AM - 12:30 PM", "12:30 PM - 1:30 PM", "02:30 PM - 03:30 PM"].map((slot) => (
                        <span key={slot} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">{slot}</span>
                    ))}
                </div>
            </div> */}

            {/* Short Bio */}


            {/* <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-2">Short Bio</h3>
                <p className="text-gray-600">
                    Dr. John Smith has been practicing family medicine for over 10 years...
                    <button className="text-blue-600 ml-2">See More</button>

                </p>
            </div> */}

            {/* <DoctorBio bio={doctor.email || "Bio not available"} /> */}

            {/* Education */}
            {/* <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Education Information</h3>
                <ul className="space-y-4">
                    <li>
                        <p className="font-medium">Boston Medicine Institution - MD</p>
                        <p className="text-gray-500 text-sm">25 May 1990 - 29 Jan 1992</p>
                    </li>
                    <li>
                        <p className="font-medium">Harvard Medical School, Boston - MBBS</p>
                        <p className="text-gray-500 text-sm">25 May 1985 - 29 Jan 1990</p>
                    </li>
                </ul>
            </div> */}

            {/* Awards */}
            {/* <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Awards & Recognition</h3>
                <p><strong>🏆 Top Doctor Award (2023):</strong> Recognized by U.S. News...</p>
                <p><strong>🏆 Patient Choice Award (2022):</strong> Awarded by Vitals.com...</p>
            </div> */}

            {/* Certifications */}
            {/* <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Certifications</h3>
                <p><strong>📜 ABFM, 2015:</strong> Demonstrates mastery...</p>
                <p><strong>📜 American Heart Association, 2024:</strong> Certification in CPR...</p>
            </div> */}


            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* <div className="bg-white rounded-xl shadow p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"></div> */}

                {/* Left Column: Bio, Education, etc. */}
                <div className="space-y-6">
                    {/* Short Bio */}
                    {/* <div className="bg-white rounded-xl shadow p-6"> */}
                    <DoctorBio bio={doctor.email || "Bio not available"} />
                    {/* </div> */}

                    {/* Education Information */}
                    {/* Education */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold mb-4">Education Information</h3>
                        <ul className="space-y-4">
                            <li>
                                <p className="font-medium">Boston Medicine Institution - MD</p>
                                <p className="text-gray-500 text-sm">25 May 1990 - 29 Jan 1992</p>
                            </li>
                            <li>
                                <p className="font-medium">Harvard Medical School, Boston - MBBS</p>
                                <p className="text-gray-500 text-sm">25 May 1985 - 29 Jan 1990</p>
                            </li>
                        </ul>
                    </div>





                </div>

                {/* Right Column: About Section */}
                {/* <div className="bg-white border border-gray-200 rounded-xl shadow p-6"> */}
                <div className="bg-white rounded-xl shadow p-6 w-full h-auto overflow-hidden">
                    <h3 className="font-semibold text-lg mb-8">About</h3>
                    <ul className="space-y-5 text-gray-700">
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400">
                                <Image
                                    src="/images/file.png"
                                    alt="logo-icon"
                                    width={15}
                                    height={15}
                                /></span>
                            <span>Medical Licence Number: <strong>MLS66658998</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"> <Image
                                src="/images/book-user.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Phone Number: <strong>{doctor.phone_number}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/mail.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Email Address: <strong>{doctor.email}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/map-pin-house.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Location: <strong>{doctor.address_line1}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/calendar.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>DOB: <strong>{doctor.phone_number}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/heart-pulse.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Blood Group: <strong>O+ve</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/briefcase-business.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Year of Experience: <strong>15+ Years</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/gender.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Gender: <strong>Male</strong></span>
                        </li>
                    </ul>
                </div>
            </div>


            {/* Awards */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Awards & Recognition</h3>
                <p><strong>• Top Doctor Award (2023):</strong> Recognized by U.S. News...</p>
                <p><strong>• Patient Choice Award (2022):</strong> Awarded by Vitals.com...</p>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Certifications</h3>
                <p><strong>• ABFM, 2015:</strong> Demonstrates mastery...</p>
                <p><strong>• American Heart Association, 2024:</strong> Certification in CPR...</p>
            </div>



        </div>



    );
}

import DoctorBio from '@/components/Doctor/DoctorBio';
import { PrismaClient } from '@prisma/client';
import Image from "next/image";

// Helper function to format dates
const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};


export default async function DoctorProfilePage({ params }: { params:Promise <{ id: string }> }) {
    const  id  = (await params).id;
    const doctorId = parseInt(id);

    const prisma = new PrismaClient();

   



    const doctor = await prisma.doctor.findUnique({
        where: { doctor_id: doctorId },
        select: {
            doctor_name: true,
            specialization: true,
            email: true,
            phone_number: true,
            address_line1: true,
            city: true,
            designation: true,
            state_province: true,
            doctor_fee: true,
            status: true,
            short_bio: true,
            blood_group: true,
            yrs_of_experience: true,
            license_number: true,
            gender: true,
            date_of_birth: true,
            educationalInfo: true,
            awards: true,
            certifications: true,
        }
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
                        <p className="text-gray-500">{doctor.designation}, {doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">{doctor.specialization}</span>
                            <span className="text-gray-600">🏥 DRS Derma Medical Clinic</span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">{doctor.status}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">Consultation Charge</p>
                    <h3 className="text-2xl font-bold"> ৳{doctor.doctor_fee?.toNumber() ?? "N/A"}{' '} <span className="text-sm font-normal">/ appointment</span></h3>
                </div>
            </div>


            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* <div className="bg-white rounded-xl shadow p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"></div> */}

                {/* Left Column: Bio, Education, etc. */}
                <div className="space-y-6">
                    {/* Short Bio */}
                    {/* <div className="bg-white rounded-xl shadow p-6"> */}
                    <DoctorBio bio={doctor.short_bio || "Bio not available"} />
                    {/* </div> */}

                    {/* Education Information */}

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold mb-4">Education Information</h3>
                        <ul className="space-y-4">
                            {doctor.educationalInfo.length > 0 ? (
                                doctor.educationalInfo.map((edu) => (
                                    <li key={edu.id}>
                                        <p className="font-medium">{edu.institution} - {edu.name} <span className="text-gray-300 text-sm">{formatDate(edu.from_date)} - {formatDate(edu.to_date)}</span></p>

                                    </li>
                                ))
                            ) : (
                                <li>
                                    <p className="text-gray-500">No educational information available.</p>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                {/* Right Column: About Section */}
                {/* <div className="bg-white border border-gray-200 rounded-xl shadow p-6"> */}
                <div className="bg-white rounded-xl shadow p-6 w-full h-auto overflow-hidden">
                    <h3 className="font-semibold text-lg mb-16">About</h3>
                    <br />
                    <ul className="space-y-7 text-gray-700">
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400">
                                <Image
                                    src="/images/file.png"
                                    alt="logo-icon"
                                    width={15}
                                    height={15}
                                /></span>
                            <span>Medical Licence Number: <strong>{doctor.license_number || "N/A"}</strong></span>
                        </li>
                        <li className="flex items-center gap-3 overflow-hidden">
                            <span className="text-gray-400"> <Image
                                src="/images/book-user.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Phone Number: <strong>{doctor.phone_number || "N/A"}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/mail.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Email Address: <strong>{doctor.email || "N/A"}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/map-pin-house.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Location: <strong>{`${doctor.address_line1 || ""}, ${doctor.city || ""}, ${doctor.state_province || ""}`}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/calendar.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>DOB: <strong>{formatDate(doctor.date_of_birth)}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/heart-pulse.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>

                            <span>Blood Group: <strong>{doctor.blood_group || "N/A"}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/briefcase-business.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Year of Experience: <strong>{doctor.yrs_of_experience ? `${doctor.yrs_of_experience}+ Years` : "N/A"}</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-gray-400"><Image
                                src="/images/gender.png"
                                alt="logo-icon"
                                width={15}
                                height={15}
                            /></span>
                            <span>Gender: <strong>{doctor.gender || "N/A"}</strong></span>
                        </li>
                    </ul>
                </div>
            </div>


            {/* Awards */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Awards & Recognition</h3>
                <ul className="space-y-4">
                    {doctor.awards.length > 0 ? (
                        doctor.awards.map((award) => (
                            <li key={award.id}>
                                <p className="font-medium"><strong>• {award.name}</strong>: <span className="text-gray-500 text-sm">{award.institution} ({formatDate(award.from_date)} - {formatDate(award.to_date)})</span></p>

                            </li>
                        ))
                    ) : (
                        <li>
                            <p className="text-gray-500">No awards or recognition available.</p>
                        </li>
                    )}
                </ul>
            </div>


            {/* Certifications */}

            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Certifications</h3>
                <ul className="space-y-4">
                    {doctor.certifications.length > 0 ? (
                        doctor.certifications.map((cert) => (
                            <li key={cert.id}>
                                <p className="font-medium"><strong>• {cert.name}</strong>: <span className="text-gray-500 text-sm">{cert.institution} ({formatDate(cert.from_date)} - {formatDate(cert.to_date)})</span></p>

                            </li>
                        ))
                    ) : (
                        <li>
                            <p className="text-gray-500">No awards or recognition available.</p>
                        </li>
                    )}
                </ul>
            </div>


        </div>

    );
}

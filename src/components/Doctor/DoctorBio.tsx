'use client';
import { useState } from 'react';

export default function DoctorBio({ bio }: { bio: string }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => setExpanded(!expanded);

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full h-auto overflow-hidden">
            <h3 className="font-semibold mb-2">Short Bio</h3>
            <p className="text-gray-600 break-words">
                {expanded ? bio : `${bio.slice(0, 80)}...`}
                <button
                    onClick={toggleExpanded}
                    className="text-blue-600 ml-2 underline"
                >
                    {expanded ? "See Less" : "See More"}
                </button>
            </p>
        </div>
    );
}

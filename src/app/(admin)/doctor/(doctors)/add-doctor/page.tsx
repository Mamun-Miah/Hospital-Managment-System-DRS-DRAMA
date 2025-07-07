 
'use client';
import AddDoctor from "@/components/Doctor/AddDoctorComponent";
import Link from "next/link";

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'



export default function Page() {
  const { data: session, status } = useSession()
  console.log('Session from doctor:', session, 'Status:', status) 
 

  if (status === 'loading') return <div>Loading...</div>

  if (!session) return redirect('/authentication/sign-in/')

  const role = session.user?.role;

  if (role !== 'admin') {
    return redirect('/dashboard/ecommerce/');
  }
  
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Add Doctor</h5>

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
          Add Doctor
          </li>
        </ol>
      </div>

      <AddDoctor />
    </>
  );
}

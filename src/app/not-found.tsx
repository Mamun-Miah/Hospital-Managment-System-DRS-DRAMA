"use client";

import Image from "next/image";
import Link from "next/link";

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function NotFound() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  if (!session) return redirect('/authentication/sign-in/')
  return (
    <>
      <div className="bg-white dark:bg-[#0a0e19] py-[30px] h-screen overflow-x-hidden mb-[25px]">
        <div className="w-full h-full table">
          <div className="table-cell align-middle">
            <div className="mx-auto max-w-[960px] text-center">
              <Image
                src="/images/error.png"
                className="inline-block"
                alt="error-image"
                width={400}
                height={400}
              />
              <h4 className="!text-[19px] md:!text-[21px] !mt-[25px] md:!mt-[33px] !mb-[13px]">
                Looks like we did not find this page, please try again later.
              </h4>
              <p>
                But no worries! Our team is looking ever where while you wait
                safely.
              </p>
              <Link
                href="/"
                className="inline-block font-medium rounded-md md:text-md mt-[2px] md:mt-[10px] py-[12px] px-[25px] text-white bg-primary-500 transition-all hover:bg-primary-400"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

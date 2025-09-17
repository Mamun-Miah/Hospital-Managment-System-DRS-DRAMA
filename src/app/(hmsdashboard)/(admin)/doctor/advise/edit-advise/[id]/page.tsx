"use client";
import Link from "next/link";
// import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
export default function EditAdvise() {
  const router = useRouter();
  const [advise, setAdvise] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const hanldleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advise) {
      return;
    }

    setLoading(true);
    try {
      const updateAdvise = await fetch(`/api/advise/edit-advise/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advise: advise }),
      });
      const result = await updateAdvise.json();
      if (!updateAdvise.ok) throw new Error(result.error || "Update failed");
      console.log(result);

      Swal.fire({
        icon: "success",
        title: "Advise updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/doctor/advise/");
      setAdvise("");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error while updating!",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/advise/view-advice/${id}`)
      .then((res) => res.json())
      .then((data) => setAdvise(data.advice));
  }, [id]);

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Edit Advise</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/"
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
            Edit Advise
          </li>
        </ol>
      </div>

      <form onSubmit={hanldleSubmit}>
        <div className="w-[480px] mx-auto trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Advise <span className="text-danger-800">*</span>
                </label>
                <textarea
                  name="advise"
                  value={advise}
                  onChange={(e) => setAdvise(e.target.value)}
                  className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Write your advise"
                ></textarea>
              </div>
            </div>
          </div>

          {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}

          <div className="trezo-card mt-[25px]">
            <div className="trezo-card-content">
              <button
                type="button"
                className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
                onClick={() => router.push("/doctor/advise")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              >
                <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    add
                  </i>
                  {loading ? "Submitting..." : "Update Advice"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

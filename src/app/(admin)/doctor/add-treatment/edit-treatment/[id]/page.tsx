 
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";





export default function Page(
) {

   const { id } = useParams<{ id: string }>();
    console.log(id)


    const [formData, setFormData] = useState({
        treatment_name: "",
        total_cost: "",
        duration_months: "",
    });
    
    
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreatment() {
      try {
        const res = await fetch(`/api/treatment/view-treatment/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Treatment not found");
          router.push("/404"); // redirect to not found page
          return;
        }

        const data = await res.json();

        if (data) {
          setFormData({
            treatment_name: data.treatment_name || "",
            total_cost: data.total_cost.toString() || "",
            duration_months: data.duration_months.toString() || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch treatment:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }

    fetchTreatment();
  }, [id]);
    

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };






  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Add Treatment</h5>

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
          Add Patient
          </li>
        </ol>
      </div>

      <form>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
            {/* <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Treatment Name
              </label>
              <input
                name="patientName"
                type="text"
                placeholder="Enter Treatment ID"
                value={formData.treatmentID}
                onChange={handleChange}
                required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div> */}
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Treatment Name
              </label>
              <input
                name="treatment_name"
                type="text"
                placeholder="Treatment Name"
                value={formData.treatment_name}
                onChange={handleChange}
                required
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Total Cost
              </label>
              <input
                name="total_cost"
                type="number"
                placeholder="Total Treatment Cost"
                value={formData.total_cost}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>
            

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Treatment Duration
              </label>
              <select
                name="duration_months"
                value={formData.duration_months}
                onChange={handleChange}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              >
                <option value="">Select Duration</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
                <option value="7">7 Months</option>
                <option value="8">8 Months</option>
                <option value="9">9 Months</option>
                <option value="10">10 Months</option>
                <option value="11">11 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}

        <div className="trezo-card mt-[25px]">
          <div className="trezo-card-content">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
              onClick={() =>
                setFormData({
                  treatment_name: "",
                  total_cost: "",
                  duration_months: "",
                })
              }
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
                {loading ? "Submitting..." : "Confirm"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}

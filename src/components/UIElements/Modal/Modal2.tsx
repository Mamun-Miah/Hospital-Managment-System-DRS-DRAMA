"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

const Modal2: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);



  return (
    <>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                  <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                    <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                      <div className="trezo-card-title">
                        <h5 className="!mb-0">Patient Details</h5>
                      </div>
                      <div className="trezo-card-subtitle">
                        <button
                          type="button"
                          className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                          onClick={() => setOpen(false)}
                        >
                          <i className="ri-close-fill"></i>
                        </button>
                      </div>
                    </div>

                    <div className="trezo-card-content">
                      <div>
                        <h4 className="text-xl font-semibold">
                          Personal Information:
                        </h4>
                        <p className="leading-none mb-0 pb-0">
                          <span className="font-bold">Name:</span> Johhna Loren
                        </p>
                        <p className="leading-none">
                          <span className="font-bold">Mobile Number:</span>{" "}
                          +882397238238
                        </p>

                        <p className="leading-none  mb-0">
                          <span className="font-bold">Email:</span>{" "}
                          example@gmail.com
                        </p>
                        <p className="leading-none mb-0">
                          <span className="font-bold">Date of Birth:</span>{" "}
                          12/02/25
                        </p>
                        <p className="leading-none mb-0">
                          <span className="font-bold">Gender</span>: Female
                        </p>
                      </div>
                      <div className="mt-5">
                        <h4 className="text-xl font-semibold">
                          Address Information:
                        </h4>

                        <p>
                          <span className="font-bold">Address:</span> Shah
                          Makhtu Avenue
                        </p>
                        <p className="font-bold">
                          <span>City:</span> Dhaka
                        </p>
                        <p>
                          <span className="font-bold">State Province:</span>{" "}
                          example@gmail.com
                        </p>
                        <p>
                          <span className="font-bold">Postal Code:</span> 1232
                        </p>
                      </div>
                      <div className="mt-5">
                        <h4 className="text-xl font-semibold">
                          Emergency & Status:
                        </h4>

                        <p className="font-bold">
                          <span>Emergency Contact Numebr:</span> +882379237
                        </p>
                        <p>
                          <span className="font-bold">Status:</span>{" "}
                          <span className="text-green-600">Active</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </>
  )
}

export default Modal2;
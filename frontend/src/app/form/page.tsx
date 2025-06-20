"use client";

import { useState } from "react";
import { DatePicker } from "@mantine/dates"; // Optional, you can replace with native input[type="date"]

export default function CreateJobModal() {
  const [opened, setOpened] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const handleSalaryChange = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const cleaned = val.replace(/\D/g, "");
    setter(cleaned);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpened(true)}
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
      >
        Create Job
      </button>

      {/* Modal */}
      {opened && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 text-black flex items-center justify-center">
          <div className="bg-white w-[848px] h-[779px] rounded-2xl shadow-lg p-8 overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setOpened(false)}
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              &times;
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 font-satoshi">
              Create Job Opening
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="Full Stack Developer"
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Amazon, Microsoft, Swiggy"
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <select className="w-full border border-black rounded-lg h-[58px] px-4">
                    <option value="">Choose Preferred Location</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block font-semibold mb-1">Job Type</label>
                  <select className="w-full border border-black rounded-lg h-[58px] px-4">
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">
                    Salary Range
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Min ₹"
                      value={salaryMin}
                      onChange={(e) =>
                        handleSalaryChange(e.target.value, setSalaryMin)
                      }
                      className="w-full border border-black rounded-lg h-[58px] px-4"
                    />
                    <input
                      type="text"
                      placeholder="Max ₹"
                      value={salaryMax}
                      onChange={(e) =>
                        handleSalaryChange(e.target.value, setSalaryMax)
                      }
                      className="w-full border border-black rounded-lg h-[58px] px-4"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block font-semibold mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  />

                  {/* If no Mantine: Use below */}
                  {/* <input
                    type="date"
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  /> */}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block font-semibold mb-1">
                  Job Description
                </label>
                <textarea
                  placeholder="Describe the job role"
                  rows={4}
                  className="w-full border border-black rounded-lg p-4"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="border border-gray-400 px-6 py-2 rounded-md hover:bg-gray-100"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

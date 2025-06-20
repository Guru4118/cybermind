"use client";

import {
  Image,
  Card,
  Text,
  Badge,
  Group,
  Avatar,
  List,
  Button,
} from "@mantine/core";

import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconCurrencyRupee,
} from "@tabler/icons-react"; // Import icons

import { IconUserPlus, IconBuilding, IconCoins } from "@tabler/icons-react"; //
import { useEffect } from "react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { timeAgo } from "../../utils/timeFormatter";
import { Slider } from "@mantine/core";
import { RangeSlider } from "@mantine/core";
import { ChevronsDown,ChevronsRight } from "lucide-react";


export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string | null>(null);
  //const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [salaryRange, setSalaryRange] = useState([0, 100000]);

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

  const minSalary = 0;
  const maxSalary = 200000;
  const step = 1000;
  const logos = ["/amazon.png", "/tesla.png", "/swiggy.png"];

  //const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 80000]);

  type Job = {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    experience: string;
    salaryMin: number;
    salaryMax: number;
    minMonth: number;
    maxMonth: number;
    description: string;
    requirements: string;
    responsibilities: string;
    applicationDeadline: string;
    postedAt: string;
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), salaryRange[1] - step);
    setSalaryRange([value, salaryRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), salaryRange[0] + step);
    setSalaryRange([salaryRange[0], value]);
  };
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3001/jobs");
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation = location
      ? job.location.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchesJobType = jobType
      ? job.type.toLowerCase() === jobType.toLowerCase()
      : true;
    const matchesSalary =
      job.maxMonth >= salaryRange[0] && job.minMonth <= salaryRange[1];

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });
  // width: 613;
  // height: 48;
  // left: 68px;

  ///form

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    deadline: "",
    description: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 38);

    const salaryMin = Number(formData.salaryMin);
    console.log(formData.company);

    const normalizedCompany = formData.company.trim().toLowerCase();
    const knownCompanies = ["amazon", "swiggy", "tesla", "cybermind"];
    console.log(normalizedCompany);
    console.log(knownCompanies)
    

    const logo = knownCompanies.includes(normalizedCompany)
      ? `/${normalizedCompany}.png`
      : "/cybermind.png";

      console.log(logo);

    let experience = "";
    if (salaryMin < 300000) {
      experience = "0-1 yr Exp";
    } else if (salaryMin >= 300000 && salaryMin < 500000) {
      experience = "1-3 yr Exp";
    } else if (salaryMin >= 500000 && salaryMin < 800000) {
      experience = "2-5 yr Exp";
    } else if (salaryMin >= 800000 && salaryMin < 1000000) {
      experience = "5-6 yr Exp";
    } else {
      experience = "7-8 yr Exp";
    }
    const payload = {
      title: formData.title,
      company: formData.company,
      logo:logo, // fallback// or a default logo URL
      location: formData.location,
      type: formData.type,
      experience, // <- dynamic based on salaryMin
      salaryMin,
      salaryMax: Number(formData.salaryMax),
      minMonth: salaryMin / 12,
      maxMonth: Number(formData.salaryMax) / 12,
      description: formData.description,
      requirements: "To be updated",
      responsibilities: "To be updated",
      applicationDeadline: formData.deadline
        ? new Date(formData.deadline).toISOString().split("T")[0]
        : defaultDeadline.toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:3001/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to post job");

      alert("Job posted successfully!");
      // Optionally reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "",
        salaryMin: "",
        salaryMax: "",
        deadline: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error posting job.");
    }
  };

  return (
    <div className="mx-16 px-8 bg-[#ffffff] ">
      <div className=" ">
        {/* Navbar - Kept as is, assuming it's part of the overall page but not the focus of the design change */}
        <div>
          <nav className="w-[890px] h-[80px] mt-[21px] ml-[230px] rounded-[122px] border border-gray-200 bg-white flex items-center justify-between px-8 shadow-[0px_0px_20px_0px_#7F7F7F26] ">
            <Image
              src="/image.png"
              alt="Logo"
              width={45}
              height={44.6}
              radius="md"
            />
            <div className="flex gap-10  text-black  font-satoshi  font-semibold text-base">
              <a href="http://localhost:3000/" className="hover:text-blue-600">
                Home
              </a>
              <a href="http://localhost:3000/" className="hover:text-blue-600">
                Find Jobs
              </a>
              <a href="http://localhost:3000/" className="hover:text-blue-600">
                Find Talents
              </a>
              <a href="http://localhost:3000/about" className="hover:text-blue-600">
                About Us
              </a>
              <a href="#" className="hover:text-blue-600">
                Testimonials
              </a>
            </div>
            <button
              onClick={() => setOpened(true)}
              className="w-[153px] h-[38px] rounded-[30px] gap-[10px] px-6 py-2 text-white bg-gradient-to-b from-[#A128FF] to-[#6100AD] hover:opacity-90 transition"
            >
              Create Jobs
            </button>
          </nav>
        </div>

        {/* Filter UI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5 text-black items-end shadow-[0_8px_10px_-6px_rgba(0,0,0,0.3)] rounded-lg p-4 bg-white">
          {/* Job Title Search */}
          <div className="w-full relative">
            <IconSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              id="job-title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Job Title, Role"
              className="w-full border-r-1 border-gray-400 p-2 pl-10 h-14 "
            />
          </div>

          {/* Location Dropdown */}
          <div className="w-full relative">
            <IconMapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-14  border-r-1 border-gray-400  p-2 pl-10    text-gray-500 appearance-none"
            >
              <option value="" disabled hidden>
                Preferred Location
              </option>
              <option value="remote" className="text-black">
                Remote
              </option>
              <option value="chennai" className="text-black">
                Chennai
              </option>
              <option value="kochi" className="text-black">
                Kochi
              </option>
              <option value="delhi" className="text-black">
                Delhi
              </option>
              <option value="noida" className="text-black">
                Noida
              </option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mr-3"
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L8 8L15 1"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Job Type Dropdown */}
          <div className="w-full relative">
            <IconBriefcase
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={jobType || ""}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full h-14 border-r-1 border-gray-400  p-2 pl-10  text-gray-500 appearance-none"
            >
              <option value="" disabled hidden>
                Job type
              </option>
              <option value="full-time" className="text-black">
                Full-time
              </option>
              <option value="part-time" className="text-black">
                Part-time
              </option>
              <option value="internship" className="text-black">
                Internship
              </option>
              <option value="contract" className="text-black">
                Contract
              </option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mr-3"
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L8 8L15 1"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between mb-1 flex-col">
            <div className="flex flex-row justify-between gap-10">
              <label className="block font-medium text-gray-700">
                Salary Per Month
              </label>
              <div className="flex items-center text-sm font-medium">
                <span className="text-gray-700">
                  ${(salaryRange[0] / 1000).toFixed(0)}k
                </span>
                <span className="mx-1 text-gray-400">-</span>
                <span className="text-gray-700">
                  ${(salaryRange[1] / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
            {/* Slider Container */}
            <div className="relative h-6 w-full mt-1">
              {/* Track */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-md transform -translate-y-1/2" />

              {/* Highlighted Range */}
              <div
                className="absolute top-1/2 h-1 bg-black rounded-md transform -translate-y-1/2"
                style={{
                  left: `${(salaryRange[0] / maxSalary) * 100}%`,
                  width: `${
                    ((salaryRange[1] - salaryRange[0]) / maxSalary) * 100
                  }%`,
                }}
              />

              {/* Range Inputs */}
              <input
                type="range"
                min={minSalary}
                max={maxSalary}
                step={step}
                value={salaryRange[0]}
                onChange={handleMinChange}
                className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none"
                style={{ zIndex: 30 }}
              />
              <input
                type="range"
                min={minSalary}
                max={maxSalary}
                step={step}
                value={salaryRange[1]}
                onChange={handleMaxChange}
                className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none"
                style={{ zIndex: 40 }}
              />

              {/* Custom Thumb Style */}
              <style>
                {`
      input[type=range]::-webkit-slider-thumb {
        appearance: none;
        pointer-events: auto;
        height: 15px;
        width: 15px;
        border-radius: 9999px;
        background-color: white;

        border: 6px solid black;
        cursor: pointer;
        margin-top: px;
      }

      input[type=range]::-moz-range-thumb {
        pointer-events: auto;
        height: 20px;
        width: 20px;
        border-radius: 9999px;
        background-color: black;
        border: 2px solid white;
        cursor: pointer;
      }
    `}
              </style>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] mt-10 text-black px-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            shadow="sm" // Mantine shadow for depth
            padding="0" // Remove Mantine's default padding for full Tailwind control
            radius="md" // Mantine's radius, but overridden by Tailwind's rounded-xl
            // Card specific styling
            className="relative w-[316px] h-[360px] rounded-[12px] shadow-[0px_0px_14px_0px_#D3D3D326]" // Exact width, height, and border-radius
          >
            {/* Logo */}
            <div className="absolute top-[16px] left-[16px] w-[83.46428680419922px] h-[82px] rounded-[13.18px] shadow-[0px_0px_10.25px_0px_#94949440] border border-white flex items-center justify-center overflow-hidden">
              {" "}
              {/* */}
              <Avatar
                src={job.logo || "/image.png"}
                size="xl"
                radius="md"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Time Ago Badge */}
            <div className="absolute top-[16px] left-[222px] w-[75px] h-[33px] rounded-[10px] px-[10px] py-[7px] flex items-center justify-center bg-[#E0F2FE] text-[#1D4ED8] gap-[10px]">
              {" "}
              {/* */}
              <Badge
                variant="light"
                color="blue"
                className="text-xs font-semibold p-0 bg-transparent"
              >
                {" "}
                {/* */}
                {timeAgo(job.postedAt)}{" "}
              </Badge>
            </div>

            {/* Job Title/Rolename */}
            <Text
              fw={700} // font-weight: 700
              size="lg" // Mantine size, but overridden by Tailwind
              className="absolute w-[190px] h-[27px] top-[117px] left-[16px] font-['Satoshi_Variable'] text-[20px] leading-[100%] tracking-normal text-black text-left" //
            >
              {job.title}
            </Text>

            {/* Experience, Mode, Package Group */}
            <Group
              gap="xs" // Mantine gap, overridden by Tailwind's gap-4
              className="absolute w-[273.08px] h-[22px] top-[160px] left-[16px] gap-[16px] flex items-center text-gray-700" // Added flex items-center for horizontal alignment, set text-gray-700
            >
              <Text size="sm" className="flex items-center">
                <IconUserPlus size={16} className="mr-0 text-gray-700" />{" "}
                {job.experience} {/* Replaced icon, set color */}
              </Text>
              <Text size="sm" className="flex items-center">
                <IconBuilding size={16} className="mr-1 text-gray-700" />{" "}
                {job.location} {/* Replaced icon, set color */}
              </Text>
              <Text size="sm" className="flex items-center">
                <IconCoins size={16} className="mr-1 text-gray-700" />{" "}
                {(job.salaryMin / 100000).toFixed(0)} LPA
                {/* Replaced icon, set color */}
              </Text>
            </Group>

            {/* Job Description (jd) List */}
            <List
              size="sm"
              spacing="xs"
              unstyled // Corrected prop name
              // Adjusted 'left' to 16px to align with other elements, removed specific width to let content determine it within constraints
              className="absolute top-[202px] w-[300px] h-[76px] left-[9px] font-['Satoshi_Variable'] font-normal text-[14px] leading-[100%] tracking-normal text-gray-700 overflow-hidden pr-4" //
              // style={{ width: 'calc(100% - 32px)' }} // Calculate width based on card width minus left/right padding (16px * 2)
            >
              {job.description.split(",").map((item, i) => (
                <List.Item key={i} className="flex items-start">
                  <div className="flex">
                    <span className="inline-block w-1 h-1 bg-gray-700 rounded-full mr-2 mt-[0.35rem]"></span>
                    <Text className="flex-1">{item.trim()}</Text>
                  </div>
                </List.Item>
              ))}
            </List>

            {/* Apply Now Button */}
            <Button
              fullWidth
              color="blue"
              radius="md" // Mantine radius, overridden by Tailwind
              className="absolute w-[284px] h-[46px] top-[298px] left-[16px] rounded-[10px] border border-gray-200 bg-[#00BFFF] hover:bg-[#009FD4] text-white flex items-center justify-center p-[12px_10px] text-base font-semibold" // Updated background color, added border, exact dimensions, padding, font-weight
            >
              Apply Now
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {opened && (
        <div className="fixed inset-0 z-50 bg-black/50  text-black flex items-center justify-center">
          <div className="bg-white w-[848px] h-[779px] rounded-2xl shadow-2xl p-8  relative">
            {/* Close Button */}
            <button
              onClick={() => setOpened(false)}
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              &times;
            </button>

            {/* Header */}
            <div  className="flex justify-center">
              <h2 className="text-2xl font-bold mb-6 font-satoshi">
              Create Job Opening
            </h2>

            </div>
            <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Amazon, Microsoft, Swiggy"
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  >
                    <option value="">Choose Preferred Location</option>
                    <option value="Remote">Remote</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Noida">Noida</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block font-semibold mb-1">Job Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-black rounded-lg h-[58px] px-4"
                  >
                    <option value="" >Select Job Type</option>
                    <option value="Full-time" >Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">
                    Salary Range
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="salaryMin"
                      placeholder="Min ₹"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      className="w-full border border-black rounded-lg h-[58px] px-4"
                    />
                    <input
                      type="text"
                      name="salaryMax"
                      placeholder="Max ₹"
                      value={formData.salaryMax}
                      onChange={handleChange}
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
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
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
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please share a description to let the candidate know more about the job role"
                  rows={5}
                  className="w-full border border-black rounded-lg p-4"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="border border-gray-400 px-6 py-2 rounded-md hover:bg-gray-100"
                >
                  <span className="flex"> Save Draft <span className="ml-2 pt-0.5"><ChevronsDown size={18} /></span></span>
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                  <span className="flex"> Publish <span className="ml-2 pt-0.5"><ChevronsRight size={18} /></span></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

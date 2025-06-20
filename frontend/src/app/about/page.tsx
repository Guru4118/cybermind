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
import { timeAgo } from "../../../utils/timeFormatter";
import { Slider } from "@mantine/core";
import { RangeSlider } from "@mantine/core";
import { ChevronsDown,ChevronsRight } from "lucide-react";

import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string | null>(null);
  //const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);
  const [jobs, setJobs] = useState<Job[]>([]);
  

  const [loading, setLoading] = useState(true);
  const [salaryRange, setSalaryRange] = useState([50000, 80000]);

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
        const response = await fetch("https://cybermind-vppn.onrender.com/jobs");
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
      const res = await fetch("https://cybermind-vppn.onrender.com/jobs", {
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
    <div className=" ">
      <div className="mx-16 px-8 bg-[#ffffff] ">
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
        </div>
        {/* HERO SECTION */}
      <motion.div className="m-10 ml-23">
        <motion.div className="flex p-20 pt-10">
          <img
            src="/images/ss (4).jpg"
            className="w-fit h-100 drop-shadow-amber-300 drop-shadow-xl rounded hover:scale-120"
            alt="office"
          />
          <p className="absolute text-white text-6xl mt-18 ml-28 font-bold">FIND JOBS</p>
          <img
            src="/images/person.png"
            className="w-fit h-100 absolute hover:opacity-0"
            alt="overlay"
          />
          <div className="bg-black/20 ml-20 w-272 p-6 flex justify-center gap-3">
            <div>
              <p className="text-3xl font-bold text-black mb-4">
                Start your career journey
              </p>
              <button className="border-2 border-gray-50 px-4 py-1.5 text-white font-medium hover:cursor-pointer bg-black rounded hover:scale-105">
                <a href="http://localhost:3000/">Explore Jobs</a>
              </button>
            </div>
            <p className="text-lg text-gray-800 font-medium mb-4">
              Discover thousands of job opportunities across top industries and companies. <br />
              Apply now and take the next step in your career.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 120 }}
          animate={{ x: 0, y: -320 }}
          className="flex absolute"
        >
          <img
            src="/images/ss (3).jpg"
            className="w-fit h-100 drop-shadow-amber-300 drop-shadow-xl rounded"
            alt="jobs"
          />
        </motion.div>

        <motion.div
          initial={{ x: 220 }}
          animate={{ x: 480, y: -220 }}
          className="flex absolute"
        >
          <img
            src="/images/ss (5).jpg"
            className="w-fit h-100 drop-shadow-amber-300 drop-shadow-xl rounded"
            alt="career"
          />
          <p className="absolute text-white text-6xl mt-38 ml-10 font-bold">
            Your Dream Job Awaits
          </p>
          <img
            src="/images/oerson2.png"
            className="w-fit h-100 absolute hover:scale-0"
            alt="overlay2"
          />
        </motion.div>
      </motion.div>

      <div className="min-h-screen flex">
        <div className="grid grid-cols-2 ml-30">
          <div className="bg-white w-xl">
            <motion.div>
              <p className="italic text-gray-600 mt-50 text-2xl">
                "Apply confidently. Grow professionally. <br />
                The right opportunity is just a click away. <br />
                Let’s shape your future together."
              </p>
              <div className="flex">
                <img
                  src="/images/sky.jpg"
                  className="h-110 mt-10 drop-shadow-xl rounded"
                  alt="job board"
                />
                <div>
                  <p className="ml-10 mt-30 text-gray-600 text-4xl">
                    Discover top job opportunities
                  </p>
                  <button className="border-2 mt-5 border-gray-50 px-5 ml-20 h-10 text-white font-medium hover:cursor-pointer bg-black rounded hover:scale-105">
                    <a href="http://localhost:3000/">Search Now</a>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="bg-amber-300 w-lg">
            <p className="text-white mt-50 font-bold text-3xl p-4">
              Get hired by the best companies in the world. <br />
              From startups to Fortune 500, find the perfect job match. <br />
              Build your future with confidence.
            </p>
            <img src="/images/thera.png" alt="company" />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="mt-32 px-10 md:px-24 py-10 bg-gray-50 border-t border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Why Use Our Job Platform?
        </h2>
        <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Intro Section */}
      <div
        className="mt-8 flex flex-col justify-center items-center pl-2 md:pl-20 md:pt-20 m-4 max-w-3xl"
        data-aos="zoom-in"
      >
        <h3 className="font-extrabold flex items-start justify-start pr-140 pb-5">
          {/* Optional Title Here */}
        </h3>

        <p className="md:text-xl font-medium text-black">
          Discover your next career move with our all-in-one job finding platform.
          Whether you're a fresher or a seasoned professional — we connect talent
          with opportunities across industries. Built for ease, designed to empower.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 md:grid-rows-3 max-w-6xl mx-auto p-4 gap-3 text-gray-800 mt-20 mb-30">
        {/* Main Product Overview */}
        <motion.div
          className="bg-white rounded-2xl row-span-2 col-span-1 border p-6 shadow-2xl"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-bold mb-2">CareerConnect Pro</h2>
          <p className="font-semibold leading-relaxed">
            Unlock a world of job opportunities tailored just for you. CareerConnect Pro 
            is your smart career companion that offers personalized job matches, resume 
            tools, and insights to help you land your dream role — whether you're just starting 
            or aiming higher.
          </p>
        </motion.div>

        {/* Display Feature */}
        <motion.div
          className="bg-gray-200 rounded-xl row-span-1 border col-span-1 p-4 shadow"
          data-aos="zoom-out"
        >
          <h3 className="text-lg font-bold mb-1">Intelligent Job Matching</h3>
          <p className="leading-relaxed">
            Our AI-powered algorithm analyzes your profile and preferences to
            recommend the most relevant job listings — cutting through the noise
            so you only see the roles that truly match your goals.
          </p>
        </motion.div>

        {/* Battery Life */}
        <motion.div
          className="bg-gray-200 rounded-xl row-span-1 border col-span-1 p-4 shadow"
          data-aos="zoom-out"
        >
          <h3 className="text-lg font-bold mb-1">Resume Builder & Templates</h3>
          <p className="leading-relaxed">
            Create professional resumes in minutes using our built-in resume builder.
            Choose from modern templates, auto-fill details from your profile, and
            export instantly — optimized for ATS and recruiters.
          </p>
        </motion.div>

        {/* Health Monitoring */}
        <motion.div
          className="bg-gray-200 border rounded-xl row-span-1 col-span-1 p-4 shadow"
          data-aos="zoom-in"
        >
          <h3 className="text-lg font-bold mb-1">Career Insights & Trends</h3>
          <p className="leading-relaxed">
            Stay ahead with real-time analytics on job market trends, in-demand skills,
            and industry salaries. Our dashboard equips you with the data to make
            confident career decisions.
          </p>
        </motion.div>

        {/* Fitness & GPS */}
        <motion.div
          className="bg-violet-500 text-white border rounded-xl row-span-2 col-span-1 p-6 shadow-2xl"
          data-aos="zoom-out"
        >
          <h3 className="text-lg font-bold mb-2">Smart Filters & Alerts</h3>
          <p className="leading-relaxed">
            Narrow down your search with filters for job type, location, salary range,
            and experience. Enable real-time alerts so you're instantly notified when a
            matching opportunity goes live — never miss your chance.
          </p>
        </motion.div>

        {/* Smart Assistant */}
        <motion.div
          className="bg-gray-200 rounded-xl row-span-1 col-span-1 p-4 border shadow"
          data-aos="zoom-in"
        >
          <h3 className="text-lg font-bold mb-1">In-App Interview Practice</h3>
          <p className="leading-relaxed">
            Practice mock interviews with AI-driven questions based on your resume
            and job type. Get instant feedback on responses, tone, and confidence level —
            helping you prepare and perform at your best.
          </p>
        </motion.div>

        {/* Durability */}
        <motion.div
          className="bg-gray-200 rounded-xl row-span-1 border col-span-1 p-4 shadow"
          data-aos="zoom-out"
        >
          <h3 className="text-lg font-bold mb-1">Reliable & Secure Platform</h3>
          <p className="leading-relaxed">
            Built with industry-standard security, encrypted data storage, and privacy-first
            policies — ensuring your profile, activity, and applications are protected at all times.
          </p>
        </motion.div>
      </div>
      
    </div>
    
      </div>
        {/* Filter UI */}
        
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

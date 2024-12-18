/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { auth } from "../../../firebase";
import { IoArrowBack } from "react-icons/io5";
import composeImg from '../../../assets/compose.svg';

export default function ComposePage({paymentStatus}) {
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [senderEmail, setSenderEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the authenticated user's email
    const fetchAuthEmail = () => {
      if (auth.currentUser) {
        setSenderEmail(auth.currentUser.email);
      }
    };

    fetchAuthEmail();

    // Fetch countries and industries
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        // Extract unique countries
        const uniqueCountries = [...new Set(data.map((user) => user.user.country))];
        setCountries(uniqueCountries);

        // Extract unique industries
        const uniqueIndustries = [...new Set(data.map((user) => user.user.industry))];
        setIndustries(uniqueIndustries);
      });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (message) => {
    const messageWithSender = { ...message, senderEmail };

    if (paymentStatus === true) {
      fetch("https://y-five-ashen.vercel.app/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageWithSender),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.insertedId) {
            alert("Message sent successfully.");
            reset();
          }
        })
        .catch((error) => console.error("Error sending message:", error));
    }
    else{
      alert("Please make a payment to send the message.");
      navigate("/payment")
    }
  };

  return (
    <div className="flex justify-center items-center mt-7 mb-10 lg:mb-0">
      <div className="lg:w-1/2 hidden lg:flex items-center">
        <img
          src={composeImg}
          alt="Login Banner"
          className="w-full max-w-lg h-auto object-contain"
        />
      </div>
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Compose Message</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1/2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Select Country <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  {...register("country")}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500" required
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="w-1/2">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Select Industry <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="industry"
                  {...register("industry")}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 " required
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-sm text-red-600 mt-1">{errors.industry.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="subject"
                {...register("subject")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500" required
              />
              {errors.subject && (
                <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                rows="5"
                {...register("message")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500" required
              ></textarea>
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => reset()}
              className="text-3xl text-blue-500 hover:text-blue-600"
            >
              <Link to="/inbox"><IoArrowBack /></Link>
            </button>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

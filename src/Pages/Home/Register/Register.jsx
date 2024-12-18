import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase";
import axios from "axios";
import registerImg from '../../../assets/register.svg';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data.sort((a, b) => {
          const nameA = a.name.common.toUpperCase();
          const nameB = b.name.common.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      const userData = {
        username,
        email,
        country,
        industry,
      };

      fetch('https://y-five-ashen.vercel.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.insertedId) {
            alert("User created successfully.")
          }
        })
      navigate("/inbox");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col-reverse gap-10 lg:flex-row items-center justify-evenly pt-7 mb-10 lg:mb-0">
      <div className="lg:w-1/2 w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg px-8 py-3 my-5">
        <form className=" space-y-3"
          onSubmit={handleRegister}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Register Now</h2>

          <div>
            <label htmlFor="username" className="block font-medium mb-1">Username <span className="text-red-500">*</span></label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="md:w-1/2">
              <label htmlFor="country" className="block font-medium mb-1">Country <span className="text-red-500">*</span></label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.cca3} value={country.name.common}>
                    {country.name.common}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block font-medium mb-1">Industry <span className="text-red-500">*</span></label>
              <input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Enter your industry"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="md:w-1/2">
              <label htmlFor="password" className="block font-medium mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 text-xl"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="lg:w-1/3 hidden lg:flex items-center">
        <img
          src={registerImg}
          alt="Login Banner"
          className="w-full max-w-lg h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Register;

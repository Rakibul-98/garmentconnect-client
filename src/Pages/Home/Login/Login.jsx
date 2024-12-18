/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import loginImg from '../../../assets/login.svg';

const Login = ({ setUser }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
  } = useForm();

  const from = location.state?.from?.pathname || '/inbox';

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('Logged in:', userCredential.user);
      setUser(userCredential.user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col-reverse gap-10 lg:flex-row items-center justify-center pt-7 mb-10 lg:mb-0">
      <div className="lg:w-1/2 hidden lg:flex items-center">
        <img
          src={loginImg}
          alt="Login Banner"
          className="w-full max-w-lg h-auto object-contain"
        />
      </div>

      <div className="lg:w-1/2 w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              User email ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('email')} required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('password')} required
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-sm text-blue-600"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            
          </div>

          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-600">
              Forgot password?
            </Link>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="text-blue-600">
                Create a free account
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white text-lg font-medium py-2 rounded-md hover:bg-green-600 transition"
          >
            Log-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


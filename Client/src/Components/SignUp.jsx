import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Panel */}
        <div className="space-y-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center">
            ← Back to Home
          </Link>
          <h2 className="text-3xl font-bold">
            Join <span className="text-teal-600">WanderWise</span> Today
          </h2>
          <p className="text-gray-600">Sign up to start planning your next adventure</p>
          <div className="bg-gray-100 p-6 rounded-xl shadow-sm w-full max-w-sm">
            <h3 className="text-md font-semibold mb-4 text-gray-800">Benefits of joining WanderWise:</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center">
                ✅ Personalized Travel Experience
              </li>
              <li className="flex items-center">
                ✅ AI-Powered Travel Companion
              </li>
              <li className="flex items-center">
                ✅ Budget-Friendly Travel
              </li>
              <li className="flex items-center">
                ✅ Discover Like Never Before
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex flex-col items-center space-y-1 mb-6">
            <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              W
            </div>
            <h2 className="text-lg font-semibold">WanderWise</h2>
            <p className="text-gray-600 text-sm">Create Your Account</p>
          </div>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition duration-200"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

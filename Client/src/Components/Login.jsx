import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="absolute top-4 left-4 text-sm text-teal-600">
        <Link to="/">← Back to Home</Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="mb-6 text-2xl font-semibold flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
            W
          </div>
          WanderWise
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 w-80">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Welcome Back</h2>

          <form>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-200"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-instance";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true);
    
    try {
      const response: any = await api.post('/api/auth/register', { 
        name,
        email,
        password
      });
      
      console.log('Register response:', response);
      
      // Store token from response
      if (response?.token) {
        api.setToken(response.token);
        // Redirect to dashboard or configuration page
        router.push("/configuration");
      } else {
        setError("Registration failed: No token received from server.");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      // Parse error message from response
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero section */}
      <div className="flex-1 bg-blue-600 p-12 flex flex-col text-white">
        <div className="flex items-center gap-3 mb-24">
          <Image 
            src="/hero.svg" 
            alt="Hero" 
            width={200} 
            height={200} 
            className="mx-auto"
          />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-semibold">AmYcA</h1>
          <span className="text-lg opacity-80">Voice over Gen AI</span>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <span className="text-xl opacity-80">AI-powered call generation platform</span>
          <h1 className="text-xl font-medium mb-8">
            Create your account and get started in minutes.
          </h1>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 bg-gradient p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-8">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                style={{marginTop:"10px"}}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


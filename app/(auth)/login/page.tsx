"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-instance";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response: any = await api.post('/api/auth/login', { 
        email: userId, 
        password 
      });
      
      console.log('Login response:', response);
      
      // Store token from response
      if (response?.token) {
        api.setToken(response.token);
        // Redirect to dashboard
        router.push("/agentsConnect");
      } else {
        setError("Login failed: No token received from server.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Parse error message from response
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
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
            Setup your contact centre in less than 10 minutes.
          </h1>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-gradient p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-8">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember Me
                </label>
              </div>

              <button style={{marginTop:"10px"}}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In 
              </button>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </form>

            {/* <div className="mt-6">
              <div className="text-center text-sm text-gray-600 mb-4">
                OR Sign in with
              </div>
              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Image src="/google.png" alt="Google" width={20} height={20} />
                  <span>Google</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Image src="/facebook.png" alt="Facebook" width={20} height={20} />
                  <span>Facebook</span>
                </button>
              </div>
            </div> */}

            <div className="mt-8 text-center text-sm text-gray-600">
              Not Registered?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Create Account here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

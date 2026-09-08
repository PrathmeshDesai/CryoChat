import React from 'react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  
  const [showPassword , setShowPassword] = useState(false);
  
  const [formData , setFormData] = useState({
    fullName : "",
    email : "",
    password : ""
  });

  const { signup , isSigningUp } = useAuthStore();

  const validateForm = () => {

    if( !formData.fullName.trim() ) {
      toast.error("Please enter your full name");
      return false;
    }

    if( !formData.email.trim() ) {
      toast.error("Please enter your email");
      return false;
    }

    if( !/\S+@\S+\.\S+/.test(formData.email) ) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if( !formData.password.trim() ) {
      toast.error("Please enter a password");
      return false;
    }

    if( formData.password.length < 6 ){
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2' >
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary z-10" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 z-10 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-base-content opacity-70" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 z-10 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-base-content opacity-70" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 z-10 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-base-content opacity-70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 z-10 flex items-center text-base-content opacity-70 hover:opacity-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResponsiveLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);

        if (isLogin) {
          // ✅ login success
          localStorage.setItem("auth", "true");
          navigate("/dashboard");
        } else {
          // ✅ signup success
          alert("Account created successfully!");
          setIsLogin(true);
        }
      }, 1500);
    }
  };

  // toggle login/signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left side */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6">
              Welcome to Our Platform
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust our secure and intuitive
              platform for their daily needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-blue-100">
                <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center text-blue-100">
                <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                <span>Easy account management</span>
              </div>
              <div className="flex items-center text-blue-100">
                <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-sm mx-auto sm:max-w-md">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {isLogin
                  ? "Welcome back! Please sign in to continue."
                  : "Join us today and get started in minutes."}
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit}>
                  {/* Full Name (Sign Up Only) */}
                  {!isLogin && (
                    <div className="mb-4 sm:mb-6">
                      <label
                        htmlFor="fullName"
                        className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`block w-full pl-11 sm:pl-13 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors.fullName
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300 focus:bg-white"
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="mb-4 sm:mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-11 sm:pl-13 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 ${
                          errors.email
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 focus:bg-white"
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4 sm:mb-6">
                    <label
                      htmlFor="password"
                      className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full pl-11 sm:pl-13 pr-12 sm:pr-14 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 ${
                          errors.password
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 focus:bg-white"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:bg-gray-50 rounded-r-xl sm:rounded-r-2xl transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {!isLogin && (
                    <div className="mb-4 sm:mb-6">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`block w-full pl-11 sm:pl-13 pr-12 sm:pr-14 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors.confirmPassword
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300 focus:bg-white"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:bg-gray-50 rounded-r-xl sm:rounded-r-2xl transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 font-semibold text-blue-600 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-2"
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

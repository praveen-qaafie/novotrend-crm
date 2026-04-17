import { useLocation, useNavigate } from "react-router-dom";
import LoginImage from "../../assets/img/AuthUserPage.webp";
import { useState } from "react";
import { FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import api from "../../utils/axiosInstance";
import { AUTH_API } from "../../utils/constants";

const ResetPassword = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // Password regex:
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { newPassword: "", confirmPassword: "" };

    if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long, include one uppercase, one number, and one special character.";
      isValid = false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleresetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      password: passwords.newPassword,
      confirmpassword: passwords.confirmPassword,
      token: token,
    };

    try {
      setLoading(true);
      await api.post(`${AUTH_API.RESET_PASSWORD}`, payload);
      navigate("/login");
    } catch (error) {
      console.error("Reset failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="md:w-1/2 w-full h-64 md:h-auto hidden lg:block bg-blue-600 relative">
        <div className="h-full w-full">
          <img
            src={LoginImage}
            alt="Auth Visual"
            className="w-full h-full object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md  p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-3">
              <FaLock size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Enter your new password to secure your account
            </p>
          </div>
          <form onSubmit={handleresetPassword} className="space-y-5">
            <div className="relative">
              <span className="absolute left-3 top-3 text-blue-600">
                <MdPassword size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className={`w-full pl-10 pr-10 py-2 border  focus:ring-2 focus:outline-none ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-blue-600">
                <FaKey size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-10 py-2 border focus:ring-2 focus:outline-none ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                <FaLock />
              )}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-6">
            For security reasons, make sure your password is at least 8
            characters long and includes numbers & symbols.
          </p>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;

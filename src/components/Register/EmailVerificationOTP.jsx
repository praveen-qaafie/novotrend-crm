import { useState, useEffect, useRef } from "react";
import { useUserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import LoginImage from "../../assets/img/AuthUserPage.jpg";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { AUTH_API, USER_API } from "../../utils/constants";

const OTP_LENGTH = 6;

const EmailVerificationOTP = () => {
  const { toastOptions, initUserAfterRegister, clearCache } = useUserContext();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const inputRefs = useRef([]);

  const navigate = useNavigate();
  // Redirect verified/logged-in users away from this page
  useEffect(() => {
    if (localStorage.getItem("UserLogedIn")) {
      navigate("/dashboard");
    } else if (!localStorage.getItem("userToken")) {
      toast.error(
        "Session expired or invalid access. Please register again.",
        toastOptions,
      );
      navigate("/register");
    }
  }, [navigate, toastOptions]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < inputRefs.length - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (paste.length) {
      const newOtp = [...otp];
      paste.split("").forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);

      // Move focus to last filled input
      const lastIndex = paste.length - 1;
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }

      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit OTP", toastOptions);
      setIsLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Session expired. Please register again.", toastOptions);
        setIsLoading(false);
        return;
      }
      clearCache();

      const response = await api.post(`${USER_API.REGISTER_OTP_VERIFY}`, {
        otp: otpValue,
      });
      const responseData = response?.data?.data;
      if (responseData?.status === 200) {
        await initUserAfterRegister();
        toast.success(responseData.result || "OTP Verified!", toastOptions);
        localStorage.setItem("UserLogedIn", true);
        localStorage.setItem(
          "UserInfo",
          JSON.stringify(responseData?.response),
        );
        localStorage.setItem(
          "userToken",
          responseData?.response?.token || token,
        );
        setOtp(["", "", "", "", "", ""]);
        navigate("/dashboard");
      } else {
        toast.error(
          responseData?.result || "Invalid OTP. Please try again.",
          toastOptions,
        );
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await api.post(`${AUTH_API.SEND_OTP_REG}`, {
        token: token,
      });
      if (response?.data?.data.status === 200) {
        toast.success("OTP resent to your email.", toastOptions);
        setOtpMessage(response?.data?.data?.result);
      } else {
        toast.error(
          response?.data?.message || "Failed to resend OTP.",
          toastOptions,
        );
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong, try again.",
        toastOptions,
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
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
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Email Verification
            </h2>
            <p className="text-center text-gray-500 mb-8">
              A verification code has been sent to your email
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#414651] mb-2 block">
                Verification code
              </label>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-10 h-10 text-center text-2xl border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition"
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition text-lg mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Submit"}
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={handleResend}
              className="text-blue-600 text-sm hover:underline disabled:opacity-50"
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
            {otpMessage && (
              <span
                style={{ color: "green", display: "block", marginTop: "8px" }}
              >
                {otpMessage}
              </span>
            )}
          </div>
          <div className="text-center mt-4">
            <p>
              If you never requested verification, you can safely ignore this
              email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationOTP;

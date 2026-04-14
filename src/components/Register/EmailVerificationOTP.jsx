import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import api from "../../utils/axiosInstance";
import { AUTH_API, USER_API } from "../../utils/constants";
import LoginImage from "../../assets/img/AuthUserPage.jpg";

const OTP_LENGTH = 6;

const EmailVerificationOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toastOptions, clearCache } = useUserContext();

  // get token
  const token = location.state?.token;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const inputRefs = useRef([]);

  // Auto focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Guard
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired verification access.", toastOptions);
      navigate("/register");
    }
  }, [token, navigate, toastOptions]);

  // OTP change
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move next
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace handling
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Paste support
  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (paste) {
      const newOtp = paste.split("");
      while (newOtp.length < OTP_LENGTH) newOtp.push("");
      setOtp(newOtp);

      inputRefs.current[paste.length - 1]?.focus();
      e.preventDefault();
    }
  };

  // Check OTP complete
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpComplete) {
      toast.error("Please enter complete OTP", toastOptions);
      return;
    }
    setIsLoading(true);
    try {
      clearCache();

      const response = await api.post(`${USER_API.REGISTER_OTP_VERIFY}`, {
        otp: otp.join(""),
        token,
      });

      const responseData = response?.data?.data;

      if (responseData?.status === 200) {
        localStorage.setItem("userToken", token);

        toast.success(
          "Email verified successfully! Redirecting to login...",
          toastOptions,
        );

        const timer = setTimeout(() => {
          navigate("/login");
        }, 2500);

        return () => clearTimeout(timer);
      } else {
        toast.error(
          responseData?.result || "Invalid OTP. Please try again.",
          toastOptions,
        );
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResendLoading(true);

    try {
      const response = await api.post(`${AUTH_API.SEND_OTP_REG}`, {
        token,
      });

      if (response?.data?.data?.status === 200) {
        toast.success("OTP resent", toastOptions);
        setOtpMessage(response?.data?.data?.result);
      } else {
        toast.error("Failed to resend OTP", toastOptions);
      }
    } catch (err) {
      toast.error("Error resending OTP", toastOptions);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="hidden lg:block w-1/2">
        <img src={LoginImage} className="w-full h-full object-cover" />
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Email Verification
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  inputMode="numeric"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 text-center border rounded text-xl"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Submit"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="mt-4 text-blue-600 underline"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>

          {otpMessage && (
            <p className="text-green-600 mt-2 text-center">{otpMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationOTP;
import { useEffect, useState } from "react";
import { InputField } from "../components/Common/InputField";
import { Hr } from "../components/Common/Hr";
import { useSidebar } from "../context/SidebarContext";
import { useUserContext } from "../context/useUserContext";
import { toast } from "react-toastify";
import { AUTH_API, USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

export const Security = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const [authType, setAuthType] = useState(null);
  const [authEmail, setAuthEmail] = useState();
  const [inputOtp, setInputOtp] = useState({});
  const [inputStopOtp, setInputStopOtp] = useState({});
  const { toastOptions } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState({
    start: false,
    stop: false,
  });

  const getUser = async () => {
    try {
      const secureResponse = await api.post(`${USER_API.GET_USER_DATA}`);
      const checkSecurity = secureResponse.data.data.response;
      setAuthType(checkSecurity.user_auth_type);
      setAuthEmail(checkSecurity.user_reg_code);
    } catch (error) {
      console.error("err: ----------->", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUser();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleOtpSent = (e) => {
    const { name, value } = e.target;
    setInputOtp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStopOtpSent = (e) => {
    const { name, value } = e.target;
    setInputStopOtp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendStartOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading((prev) => ({ ...prev, start: true }));
      const optResponse = await api.post(`${AUTH_API.SEND_OTP_TWOFAC_AUTH}`);
      const { status, result } = optResponse.data.data;
      status === 200
        ? toast.success(result, toastOptions)
        : toast.error(result, toastOptions);
    } catch (error) {
      console.error("error sending start OTP -------->", error);
    } finally {
      setOtpLoading((prev) => ({ ...prev, start: false }));
    }
  };

  const sendStopOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading((prev) => ({ ...prev, stop: true }));
      const otpStopResponse = await api.post(
        `${AUTH_API.SEND_OTP_TWOFAC_UNLINK}`,
      );
      const { status, result } = otpStopResponse.data.data;
      status === 200
        ? toast.success(result, toastOptions)
        : toast.error(result, toastOptions);
    } catch (error) {
      console.error("error sending stop OTP -------->", error);
    } finally {
      setOtpLoading((prev) => ({ ...prev, stop: false }));
    }
  };

  const start2Fa = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const start2FAResponse = await api.post(`${USER_API.LINK_AUTH_VERIFY}`, {
        otp: inputOtp.otp,
      });
      const { status, result } = start2FAResponse.data.data;
      if (status === 200) {
        toast.success(result, toastOptions);
        await getUser();
      } else {
        toast.error(result, toastOptions);
      }
    } catch (error) {
      console.error("error starting 2FA -------->", error);
    } finally {
      setLoading(false);
    }
  };

  const stop2Fa = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const stop2FAResponse = await api.post(`${USER_API.UNLINK_AUTH_VERIFY}`, {
        otp: inputStopOtp.stop_otp,
      });
      const { status, result } = stop2FAResponse.data.data;
      if (status === 200) {
        toast.success(result, toastOptions);
        await getUser();
      } else {
        toast.error(result, toastOptions);
      }
    } catch (error) {
      console.error("error stopping 2FA -------->", error);
    } finally {
      setLoading(false);
    }
  };

  if (authType === null) {
    return (
      <section
        className={`transition-all duration-300 flex justify-center items-center h-screen`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </section>
    );
  }

  return (
    <section className={`transition-all duration-300`}>
      <div className="rounded-lg text-start md:min-h-[83vh]">
        <div
          onClick={() => {
            if (isMobile && toggle) {
              setToggle(false);
            }
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col items-start gap-1 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              2-Step verification
            </h1>
            <p className="text-base font-normal text-[#535862]">
              2-step verification ensures that all sensitive transactions are
              authorized by you. We encourage you to enter verification codes to
              confirm these transactions.
            </p>
          </div>
          {/* Main Row: Card */}
          <div className="flex gap-4 flex-col mt-3 mb-10">
            <div className="w-full mx-3 max-w-[960px] bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : authType === 1 ? (
                <div className="flex flex-col gap-6">
                  <div className="w-full">
                    <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
                      Email ID
                    </label>
                    <InputField
                      type="email"
                      iName="envelope"
                      size="full"
                      readonly
                      value={authEmail}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <InputField
                      type="text"
                      size="full"
                      placeholder="OTP"
                      name="stop_otp"
                      onChange={handleStopOtpSent}
                    />
                    <div className="w-full flex justify-start mt-4">
                      <button
                        onClick={sendStopOtp}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-300 flex items-center justify-center"
                        disabled={otpLoading.stop}
                      >
                        {otpLoading.stop ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  </div>
                  <Hr />
                  <div className="w-full flex justify-end mt-4">
                    <button
                      onClick={stop2Fa}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Stop 2FA"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="w-full">
                    <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
                      Email ID
                    </label>
                    <InputField
                      type="email"
                      iName="envelope"
                      size="full"
                      readonly
                      value={authEmail}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <InputField
                      type="text"
                      size="full"
                      placeholder="OTP"
                      name="otp"
                      onChange={handleOtpSent}
                    />
                    <div className="w-full flex justify-start mt-4">
                      <button
                        onClick={sendStartOtp}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-300 flex items-center justify-center"
                        disabled={otpLoading.start}
                      >
                        {otpLoading.start ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  </div>
                  <Hr />
                  <div className="w-full flex justify-end mt-4">
                    <button
                      onClick={start2Fa}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Start 2FA"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance";
import { AUTH_API } from "../utils/constants";

export const useSendOTP = (
  toastOptions,
  setToastMessage,
  amount,
  otp_type,
  mt5_id,
  mt5_receiverid,
) => {
  const [isOtPSend, setIsOtPSend] = useState(false);

  const sendOtp = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const optResponse = await api.post(`${AUTH_API.SEND_OTP}`, {
          amount: amount,
          otp_type,
          mt5_id,
          mt5_receiverid,
        });
        const responseData = optResponse?.data?.data;

        if (responseData?.status === 200) {
          setIsOtPSend(true);
          setToastMessage((prev) => ({
            ...prev,
            confirmOTP: responseData?.data?.data?.result,
            otpMessage: optResponse?.data?.data?.result,
          }));

          toast.success(responseData?.result, toastOptions);
        } else {
          setToastMessage((prev) => ({
            ...prev,
            confirmOTP: responseData?.data?.data?.result,
          }));
          toast.error(responseData?.result, toastOptions);
        }
      } catch (error) {
        console.error("Error in sendOtp Hook --->", error);
        toast.error("Something went wrong. Please try again.", toastOptions);
      }
    },
    [
      toastOptions,
      setToastMessage,
      otp_type,
      amount,
      mt5_id,
      mt5_receiverid,
    ],
  );

  return { sendOtp, isOtPSend };
};
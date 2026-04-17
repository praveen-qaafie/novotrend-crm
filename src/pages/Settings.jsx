import { useEffect, useState, useRef } from "react";
import Avatar from "../assets/img/Avatar.png";
import { Hr } from "../components/Common/Hr";
import { InputField } from "../components/Common/InputField";
import { useUserContext } from "../context/useUserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { validateUserFields } from "../utils/ProfilePersonalValidation";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";
import useCountry from "../hooks/useCountry";

export const Settings = () => {
  const navigate = useNavigate();
  const { data: countries = [] } = useCountry();

  const { toggle, isMobile, setToggle } = useSidebar();
  const { formatDate, toastOptions, fetchUserData } = useUserContext();
  const [inputOtp, setInputOtp] = useState("");
  const [inputFields, setInputFields] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    bio: "",
    email: "",
    mobile: {
      country: "",
      country_id: "",
      countryCode: "",
      number: "",
    },
  });

  const [initialFields, setInitialFields] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUserLoading, setIsUserLoading] = useState(true);

  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [startDate, setStartDate] = useState(
    inputFields.dob ? new Date(inputFields.dob) : null,
  );

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close date picker on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keep inputFields.dob in sync with startDate
  useEffect(() => {
    if (startDate) {
      const yyyy = startDate.getFullYear();
      const mm = String(startDate.getMonth() + 1).padStart(2, "0");
      const dd = String(startDate.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;
      setInputFields((prev) => ({ ...prev, dob: formatted }));
    }
  }, [startDate]);

  const handleOtpChange = (e) => {
    setInputOtp(e.target.value);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const optResponse = await api.post(`${USER_API.SEND_OTP_EMAIL}`, {
        new_email: inputFields?.email,
      });
      if (optResponse.data.data.status === 200) {
        toast.success(optResponse.data.data.result, toastOptions);
      } else {
        toast.error(optResponse.data.data.result, toastOptions);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const getUser = async () => {
    try {
      setIsUserLoading(true);
      const userResponse = await api.post(`${USER_API.GET_USER_DATA}`);
      if (userResponse.data.data.status === 200) {
        const userData = userResponse.data.data.response;
        const userCountry =
          countries.find(
            (country) =>
              String(country.country_id) === String(userData.user_country),
          ) || {};

        const userFields = {
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          dob: userData.birthdate ? formatDate(userData.birthdate) : "",
          bio: userData.user_bio || "",
          email: userData.user_reg_code || "",
          mobile: {
            country: userCountry?.country_name || "",
            country_id: userData.country_id || "",
            countryCode: userCountry?.country_code || "",
            number: userData.user_mobile || "",
          },
        };

        setInputFields(userFields);
        setInitialFields(userFields);
        setUserImage(userData.user_img);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const hasChanges = (current, initial) => {
    if (!initial) return false;
    if (
      current.firstName !== initial.firstName ||
      current.lastName !== initial.lastName ||
      current.dob !== initial.dob ||
      current.bio !== initial.bio
    ) {
      return true;
    }
    if (
      current.mobile.country !== initial.mobile.country ||
      current.mobile.number !== initial.mobile.number
    ) {
      return true;
    }
    if (userImage instanceof File) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (countries.length > 0) {
      getUser();
    }
  }, [countries]);

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const selectedCountry = countries.find(
        (country) => country.country_name === value,
      );
      setInputFields((prev) => ({
        ...prev,
        mobile: {
          ...prev.mobile,
          country: value,
          country_id: selectedCountry?.country_id || "",
          countryCode: selectedCountry?.country_code || "",
        },
      }));
    } else if (name === "mobileNumber") {
      setInputFields((prev) => ({
        ...prev,
        mobile: {
          ...prev.mobile,
          number: value,
        },
      }));
    }

    // Clear errors for mobile fields
    if (name === "country" && errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
    if (name === "mobileNumber" && errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prev) => ({
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUserImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));

      if (errors.userImage) {
        setErrors((prev) => ({ ...prev, userImage: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate before submitting
    const validationErrors = validateUserFields(inputFields, userImage);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("first_name", inputFields.firstName);
    formData.append("last_name", inputFields.lastName);
    if (userImage) formData.append("user_img", userImage);
    formData.append("dob", inputFields.dob);
    formData.append("bio", inputFields.bio);
    try {
      const response = await api.post(`${USER_API.UPDATE_USER}`, formData);
      if (response.data.data.status === 200) {
        toast.success(response.data.data.result, toastOptions);
        getUser();
        await fetchUserData(true); // Refresh cache and context after update
        setErrors({});
      } else {
        toast.error(response.data.data.result, toastOptions);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!inputFields.email.trim()) newErrors.email = "Email is required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputFields.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!inputOtp.trim()) newErrors.otp = "OTP is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const body = {
        email: inputFields.email,
        otp: inputOtp,
      };
      const response = await api.post(`${USER_API.UPDATE_ONLY_EMAIL}`, body);
      if (response.data.data.status === 200) {
        toast.success(response.data.data.result, toastOptions);
        localStorage.clear();
        navigate("/login");
        toast.success("Login with updated email please!", toastOptions);
        setErrors({});
      } else {
        toast.error(response.data.data.result, toastOptions);
      }
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!inputFields.mobile.country) newErrors.country = "Country is required";
    if (!inputFields.mobile.number) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10,12}$/.test(inputFields.mobile.number)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const body = {
        country: inputFields.mobile.country_id, //
        mobileno: inputFields.mobile.number,
      };
      const response = await api.post(
        `${USER_API.UPDATE_ONLY_MOBILE_NO}`,
        body,
      );
      if (response.data.data.status === 200) {
        toast.success(response.data.data.result, toastOptions);
        getUser(); //
        await fetchUserData(true);
        setErrors({});
      } else {
        toast.error(response.data.data.result, toastOptions);
      }
    } catch (error) {
      console.error("Error updating mobile:", error);
    }
  };

  return (
    <section className={`transition-all duration-300`}>
      <div className="rounded-lg text-start md:min-h-[83vh]">
        <div
          className={`pb-5`}
          onClick={() => {
            if (isMobile && toggle) {
              setToggle(false);
            }
          }}
        >
          {/* Personal Info Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Personal Info</h1>
            <p className="text-base font-normal text-[#535862]">
              Update your photo and personal details here.
            </p>
          </div>
          {/* personal information section */}
          <div className="flex gap-4 w-full max-w-6xl justify-center mb-5">
            <div className="w-full bg-white shadow-md rounded-lg p-6 text-start">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between gap-4 flex-col lg:flex-row">
                  {/* Wrap both inputs in a flex container that shares space */}
                  <div className="flex-1 flex flex-col mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <InputField
                      required
                      type="text"
                      size="full"
                      placeholder="First name"
                      className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:ring focus:ring-input-border focus:outline-none"
                      name="firstName"
                      value={inputFields.firstName}
                      onChange={handleInputChange}
                    />
                    {/* Reserve space only when error exists */}
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <InputField
                      required
                      type="text"
                      size="full"
                      placeholder="Last name"
                      className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:ring focus:ring-input-border focus:outline-none"
                      name="lastName"
                      value={inputFields.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                {/* Calendar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div
                    className="relative date-range-input custom-date-range-picker w-full"
                    ref={containerRef}
                  >
                    <input
                      ref={inputRef}
                      value={inputFields.dob}
                      onClick={() => setIsOpen(!isOpen)}
                      readOnly
                      name="dob"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-border focus:border-transparent bg-white cursor-pointer"
                      placeholder="Select date of birth"
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                      {startDate && (
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 focus:outline-none"
                          onClick={() => {
                            setStartDate(null);
                            setIsOpen(false);
                          }}
                          tabIndex={-1}
                          aria-label="Clear date"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="absolute top-full z-10 mt-1 left-0 sm:left-auto sm:right-0 w-full sm:w-auto max-w-sm">
                        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full overflow-x-auto">
                          <div className="min-w-[320px] p-3">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => {
                                setStartDate(date);
                                setIsOpen(false);
                              }}
                              inline
                              maxDate={new Date()}
                              showMonthDropdown={true}
                              showYearDropdown={true}
                              dropdownMode="select"
                              calendarClassName="!border-0 !shadow-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex mb-6 items-center">
                  <div className="w-fit p-2">
                    {isUserLoading ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                      </div>
                    ) : (
                      <img
                        src={previewImage || userImage || Avatar}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      className="w-full sm:w-[40%]  min-h-4 px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-input-border bg-transparent font-medium placeholder:text-base placeholder:font-medium"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      name="kyc_bank_image"
                    />
                    {errors.userImage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.userImage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={inputFields.bio}
                    onChange={handleInputChange}
                    className="w-full min-h-[8rem] bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-input-border"
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                  )}
                </div>
                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  {/* <button
                    type="button"
                    className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!hasChanges(inputFields, initialFields)}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Email Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Email ID</h1>
            <p className="text-base font-normal text-[#535862]">
              Update the email address linked to your account.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-6xl justify-center mb-5">
            <div className="w-full bg-white shadow-md rounded-lg p-6 text-start">
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <InputField
                    type="email"
                    size="full"
                    placeholder="Email"
                    name="email"
                    value={inputFields.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        !inputFields.email.trim() ||
                        inputFields.email === initialFields?.email
                      }
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <InputField
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    size="full"
                    placeholder="Enter your OTP here"
                    value={inputOtp}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        handleOtpChange(e);
                      }
                    }}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                  )}
                </div>
                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  {/* <button
                    type="button"
                    className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      inputFields.email === initialFields?.email &&
                      inputOtp.trim() === ""
                    }
                  >
                    Verify Email
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Mobile Number Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Mobile Number</h1>
            <p className="text-base font-normal text-[#535862]">
              Update the mobile number linked to your account.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-6xl justify-center mb-5">
            <div className="w-full bg-white shadow-md rounded-lg p-6 text-start">
              <form onSubmit={handleMobileSubmit}>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={inputFields.mobile.country}
                    onChange={handleMobileChange}
                    className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-input-border"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option
                        key={country.country_id}
                        value={country.country_name}
                      >
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +{inputFields.mobile.countryCode}
                    </span>
                    <input
                      type="tel"
                      name="mobileNumber"
                      pattern="\d{10}|\d{12}"
                      maxLength={12}
                      placeholder="Enter your mobile number"
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-r-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-input-border bg-transparent font-medium"
                      value={inputFields.mobile.number}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          handleMobileChange(e);
                        }
                      }}
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      inputFields.mobile.number ===
                        initialFields?.mobile.number &&
                      inputFields.mobile.country ===
                        initialFields?.mobile.country
                    }
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

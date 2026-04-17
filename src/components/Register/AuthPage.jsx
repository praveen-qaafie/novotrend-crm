import { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import AuthPageImage from "../../assets/img/AuthUserPage.webp";
import { MdEmail } from "react-icons/md";
import { useUserContext } from "../../context/userContext";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaMobileAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  validateRegisterField,
  validateRegisterForm,
} from "../../utils/userRegistrationValidation";
import api from "../../utils/axiosInstance";
import { AUTH_API } from "../../utils/constants";
import useCountry from "../../hooks/useCountry";

const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: countries = [] } = useCountry();

  const { partnerCode } = useParams();
  const [loginTabActive, setLoginTabActive] = useState(isLogin);
  const { toastOptions, userLogin } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPartner, setShowPartner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [responseError, setResponseError] = useState("");
  const [loginInputField, setloginInputField] = useState({
    email: "",
    password: "",
  });

  const [registerInputFields, setRegisterInputFields] = useState({
    email: location.state?.email || "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    country: "",
    mobileNumber: "",
    countryCode: "",
    country_id: "",
    partnerCode: partnerCode,
    inputChecked: false,
  });

  const passwordRules = {
    length:
      registerInputFields.password.length >= 8 &&
      registerInputFields.password.length <= 15,
    upperLower:
      /[a-z]/.test(registerInputFields.password) &&
      /[A-Z]/.test(registerInputFields.password),
    number: /\d/.test(registerInputFields.password),
    special: /[^A-Za-z0-9]/.test(registerInputFields.password),
  };

  // Sync tab state with route
  useEffect(() => {
    setLoginTabActive(isLogin);
  }, [isLogin, location.pathname]);

  // Handle tab switching with route navigation
  const handleTabSwitch = (isLoginTab) => {
    if (isLoginTab) {
      navigate("/login");
    } else {
      navigate("/register" + (partnerCode ? `/${partnerCode}` : ""));
    }
  };

  // Login system working
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setloginInputField((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
    setResponseError("");
  };

  // login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginInputField?.email || !loginInputField?.password) {
      toast.error("Please fill in all fields", toastOptions);
      setIsLoading(false);
      return;
    }

    try {
      const user = await userLogin(loginInputField);

      // handle both cases
      const apiData = user?.data || user;
      setResponseError(apiData);
      if (apiData?.status === 200) {
        const authType = Number(apiData?.authType ?? 0);

        if (authType === 0) {
          toast.success(apiData?.result || "Login successful", toastOptions);
          localStorage.setItem("UserLogedIn", true);
          navigate("/dashboard");
        } else if (authType === 1) {
          toast.success("OTP sent successfully", toastOptions);
          navigate("/emailVerify");
        } else {
          // fallback safety
          toast.success(apiData?.result || "Login success", toastOptions);
          navigate("/dashboard");
        }
      } else if (
        apiData?.status === 400 &&
        apiData?.result?.toLowerCase().includes("email is not verify")
      ) {
        if (apiData?.response?.token) {
          localStorage.setItem("userToken", apiData.response.token);
        }

        toast.info("Please verify your Email", toastOptions);
        navigate("/emailVerify");
      } else {
        toast.error(apiData?.result || "Login failed !!", toastOptions);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // Login system working
  const handleInputChangeRegister = (e) => {
    const { name, value } = e.target;

    setRegisterInputFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));

    // Only validate if field is not empty
    if (value.trim() !== "") {
      const validation = validateRegisterField(
        name,
        value,
        registerInputFields.countryCode,
      );
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validation.isValid ? "" : validation.message,
      }));
    } else {
      // Clear error if field is empty
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Country selection logic
    if (name === "country") {
      const countryID = countries?.find(
        (country) => country.country_name === value,
      );
      if (countryID) {
        setRegisterInputFields((prevFields) => ({
          ...prevFields,
          country_id: countryID.country_id,
          countryCode: countryID.country_code,
        }));
      }
    }

    // Password match validation
    if (name === "password" || name === "confirmPassword") {
      const password =
        name === "password" ? value : registerInputFields.password;

      const confirmPassword =
        name === "confirmPassword"
          ? value
          : registerInputFields.confirmPassword;

      if (confirmPassword && password !== confirmPassword) {
        setPasswordMatchError("Passwords do not match");
      } else {
        setPasswordMatchError("");
      }
    }
  };

  // register handler
  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    // Validate all fields before API call
    const errors = validateRegisterForm(registerInputFields);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setPasswordMatchError(""); // password already included in errors
    setIsLoading(true);

    let body = {
      email: registerInputFields.email,
      password: registerInputFields.password,
      first_name: registerInputFields.firstname,
      last_name: registerInputFields.lastname,
      cpassword: registerInputFields.confirmPassword,
      country_id: registerInputFields.country_id,
      mobileno: registerInputFields.mobileNumber,
      inputchecked: registerInputFields.inputChecked,
      partnercode: registerInputFields.partnerCode || "",
    };

    if (registerInputFields.password !== registerInputFields.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    try {
      const registerResp = await api.post(`${AUTH_API.REGISTER}`, body);
      const responseData = registerResp?.data?.data;

      if (responseData?.status === 200) {
        setIsLoading(false);
        if (responseData?.status === 200) {
          const token = responseData?.response?.token || responseData?.response;

          toast.success(
            "Registration successful. Please verify your email.",
            toastOptions,
          );

          localStorage.setItem(
            "UserInfo",
            JSON.stringify(responseData?.response),
          ); //

          navigate("/emailVerify", {
            state: { token },
          });
        }
      } else {
        setIsLoading(false);
        setIsEmailVerify(responseData?.result);
        toast.error(
          responseData?.result || "Registration failed",
          toastOptions,
        );
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Error occurred during registration", toastOptions);
      console.error(err);
    }
  };

  useEffect(() => {
    if (partnerCode) {
      setShowPartner(true);
      setRegisterInputFields((prev) => ({
        ...prev,
        partnerCode: partnerCode,
      }));
    }
  }, [partnerCode]);

  const isLoggedIn = localStorage.getItem("UserLogedIn");

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Image | Responsive image */}
      <div className="hidden lg:block lg:w-1/2 h-64 lg:h-auto bg-blue-600 relative">
        <div className="h-full w-full">
          <img
            src={AuthPageImage}
            alt="Auth Visual"
            className="w-full h-full object-center object-cover"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full flex items-center justify-center min-h-screen p-4 sm:p-6 bg-white lg:w-1/2">
        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex justify-between mb-3 border-b w-full mx-auto border-gray-300">
            <button
              onClick={() => handleTabSwitch(true)}
              className={`pb-2 w-1/2 text-center font-medium ${
                loginTabActive
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabSwitch(false)}
              className={`pb-2 w-1/2 text-center font-medium ${
                !loginTabActive
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div title="form-division">
            {loginTabActive ? (
              // Login form
              <div>
                <div className="w-full rounded ">
                  <form
                    onSubmit={handleLoginSubmit}
                    className="w-full py-5 rounded"
                  >
                    {/* Email */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Your Email Address
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 rounded px-3 py-2 space-x-2 w-full">
                        <MdEmail className="text-blue-600 w-6 h-6" />
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          className="outline-none w-full text-sm"
                          value={loginInputField.email}
                          name="email"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {responseError?.status === 402 && (
                        <span className="text-red-500 text-sm">
                          {responseError.result}
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <div className="flex items-center border-2  hover:border-blue-600 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <RiLockPasswordLine className="text-blue-600 w-6 h-6" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="enter your password"
                          className="outline-none w-full text-sm"
                          value={loginInputField.password}
                          name="password"
                          onChange={handleInputChange}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                        >
                          {showPassword ? (
                            <FaEye className="w-5 h-5 text-gray-600" />
                          ) : (
                            <FaEyeSlash className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {responseError?.status === 401 ? (
                        <span className="text-red-500 text-sm">
                          {responseError.result}
                        </span>
                      ) : responseError?.status === 403 ? (
                        <span className="text-yellow-500 text-sm">
                          {responseError.result}
                        </span>
                      ) : responseError?.status === 406 ? (
                        <span className="text-yellow-500 text-sm">
                          {responseError.result}
                        </span>
                      ) : null}
                    </div>
                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#2842F6] hover:bg-blue-600 text-white py-2 rounded font-semibold"
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {/* Switch to Register */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center text-md justify-center gap-2">
                      <p className="mr-0 sm:mr-2">Don't have an account?</p>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleTabSwitch(false)}
                        className="text-blue-700 font-semibold"
                      >
                        Register
                      </button>
                    </div>
                    {/* Forgot Password */}
                    <div className="flex justify-center text-md mt-3">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className={`w-full bg-gray-200 pointer-cursor hover:bg-gray-300 py-2 rounded text-center transition duration-200`}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              // register form
              <div className="">
                <div className="w-full py-5 rounded ">
                  <form onSubmit={handleSubmitRegister}>
                    {/* Country */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Country / Region of Residence
                      </label>
                      <div className="relative">
                        <select
                          className="w-full border-2 border-gray-300 hover:border-blue-500 focus:border-blue-700 rounded px-3 py-2 text-sm font-semibold outline-none appearance-none transition duration-150"
                          name="country"
                          value={registerInputFields.country}
                          onChange={handleInputChangeRegister}
                          required
                        >
                          <option value="" disabled hidden>
                            Choose your Country
                          </option>
                          {countries?.map((elem, index) => (
                            <option key={index} value={elem.country_name}>
                              {elem.country_name}
                            </option>
                          ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Firstname */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Your First Name
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <IoPerson className="text-blue-600 w-6 h-6" />
                        <input
                          type={"text"}
                          placeholder={"First Name"}
                          className="outline-none w-full text-sm"
                          value={registerInputFields.firstname}
                          onChange={handleInputChangeRegister}
                          name="firstname"
                          required
                        />
                      </div>
                      {fieldErrors.firstname && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.firstname}
                        </span>
                      )}
                    </div>

                    {/* Lastname */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Your Last Name
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <IoPerson className="text-blue-600 w-6 h-6" />
                        <input
                          type={"text"}
                          placeholder={"Last Name"}
                          className="outline-none w-full text-sm"
                          value={registerInputFields.lastname}
                          onChange={handleInputChangeRegister}
                          name="lastname"
                          required
                        />
                      </div>
                      {fieldErrors.lastname && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.lastname}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Your Email Address
                      </label>
                      <div
                        className={`flex items-center border-2 rounded px-3 py-2 space-x-2 w-full
                        ${
                          isEmailVerify === "Email Already Registered"
                            ? "border-red-500"
                            : "hover:border-blue-500"
                        }`}
                      >
                        <MdEmail className="text-blue-600 w-6 h-6" />
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          className="outline-none w-full text-sm"
                          value={registerInputFields.email}
                          onChange={handleInputChangeRegister}
                          name="email"
                          required
                        />
                      </div>

                      {/* Error message niche */}
                      {isEmailVerify ===
                        "Your Email is already registered. Please verify again!" && (
                        <span className="text-red-500 text-sm">
                          {isEmailVerify}
                        </span>
                      )}

                      {fieldErrors.email && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Mobile Number
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <FaMobileAlt className="text-blue-600 w-6 h-6" />
                        <span className="inline-flex items-center px-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-700 text-sm">
                          +{registerInputFields.countryCode}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d{8,12}"
                          maxLength={12}
                          placeholder="Mobile Number"
                          className="outline-none w-full text-sm"
                          value={registerInputFields.mobileNumber}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleInputChangeRegister(e);
                            }
                          }}
                          name="mobileNumber"
                          required
                        />
                      </div>
                      {fieldErrors.mobileNumber && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.mobileNumber}
                        </span>
                      )}
                    </div>

                    {/* password */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <RiLockPasswordLine className="text-blue-600 w-6 h-6" />
                        <input
                          placeholder="********"
                          key={"register-passowrd"}
                          type={showPassword ? "text" : "password"}
                          className="outline-none w-full text-sm"
                          value={registerInputFields.password}
                          onChange={handleInputChangeRegister}
                          name="password"
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                        >
                          {showPassword ? (
                            <FaEye className="w-5 h-5 text-gray-600" />
                          ) : (
                            <FaEyeSlash className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.password}
                        </span>
                      )}
                    </div>

                    {/* confirm password  */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Confirm Password
                      </label>
                      <div className="flex items-center border-2 hover:border-blue-500 focus-within:border-blue-700 rounded px-3 py-2 space-x-2 w-full">
                        <RiLockPasswordLine className="text-blue-600 w-6 h-6" />
                        <input
                          placeholder="********"
                          type={showPassword ? "text" : "password"}
                          className="outline-none w-full text-sm"
                          value={registerInputFields.confirmPassword}
                          onChange={handleInputChangeRegister}
                          name="confirmPassword"
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                        >
                          {showPassword ? (
                            <FaEye className="w-5 h-5 text-gray-600" />
                          ) : (
                            <FaEyeSlash className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <span className="text-red-500 text-sm">
                          {fieldErrors.confirmPassword}
                        </span>
                      )}

                      {/* Show error if passwords don't match */}
                      {passwordMatchError && (
                        <p className="text-red-600 text-sm my-1">
                          {passwordMatchError}
                        </p>
                      )}
                    </div>

                    {/* Password Rules */}
                    <ul className="text-xs text-gray-500 space-y-1 pl-4 mb-4">
                      <li
                        className={passwordRules.length ? "text-green-600" : ""}
                      >
                        ○ Between 8–15 characters
                      </li>
                      <li
                        className={
                          passwordRules.upperLower ? "text-green-600" : ""
                        }
                      >
                        ○ At least one upper and one lower case letter
                      </li>
                      <li
                        className={passwordRules.number ? "text-green-600" : ""}
                      >
                        ○ At least one number
                      </li>
                      <li
                        className={
                          passwordRules.special ? "text-green-600" : ""
                        }
                      >
                        ○ At least one special character
                      </li>
                    </ul>

                    {/* Partner Code */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-black">
                        Partner Code (Optional)
                      </h6>

                      <div className="flex mt-2.5">
                        <input
                          type="checkbox"
                          className="mr-2 w-5 h-5"
                          checked={showPartner}
                          onChange={() => {
                            const newValue = !showPartner;
                            setShowPartner(newValue);
                            setRegisterInputFields({
                              ...registerInputFields,
                              inputChecked: newValue,
                            });

                            // Clear previous partnerCode error if checkbox is unchecked
                            if (!newValue) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                partnerCode: "",
                              }));
                            }
                          }}
                        />
                        <p className="text-sm font-medium">
                          Have a Partner Number?
                        </p>
                      </div>

                      {showPartner && (
                        <div className="mt-2">
                          <input
                            type="text"
                            className={`w-full border rounded px-3 py-2 text-sm ${
                              fieldErrors.partnerCode
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter Partner Code"
                            value={registerInputFields.partnerCode}
                            name="partnerCode"
                            onChange={handleInputChangeRegister}
                          />

                          {/* Inline error message */}
                          {fieldErrors.partnerCode && (
                            <span className="text-red-500 text-sm mt-1 block">
                              {fieldErrors.partnerCode}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Register Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#2842F6] hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Register"}
                    </button>
                  </form>
                  <div className="mt-3.5">
                    <div className="mt-2.5">
                      <p className="text-sm text-center">
                        By creating an account, you agree to the &nbsp;
                        <a
                          href="https://novotrend.co/Privacy%20Policy.pdf"
                          className="text-blue-700 font-bold"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                        &nbsp; and to receive economic and marketing
                        communications from Novotrend.{" "}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center mt-3 text-md gap-2 items-center">
                      <p>Already have an account?</p>&nbsp;
                      <button
                        onClick={() => handleTabSwitch(true)}
                        className="text-blue-700 font-semibold"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;

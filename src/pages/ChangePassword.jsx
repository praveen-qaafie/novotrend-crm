import { useState } from "react";
import { Hr } from "../components/Common/Hr";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import useLogoutHandler from "../hooks/useLogout";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

// const backendURL = import.meta.env.VITE_API_URL;

export const ChangePassword = () => {
  const { toggle, isMobile, setToggle } = useSidebar();
  const { toastOptions } = useUserContext();
  const { handleLogOut } = useLogoutHandler();

  const [showPassword, setShowPassword] = useState(false);
  const [inputFields, setInputFields] = useState({
    currentpassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePasswordLive(value);
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePasswordLive = (password) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "" }));
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be 8–15 characters long.",
      }));
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Include both upper & lowercase letters.",
      }));
    } else if (!/\d/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Include at least one number.",
      }));
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Include one special character.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // Confirm password check only on submit
  const validateOnSubmit = () => {
    const newErrors = {};
    if (inputFields.password !== inputFields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPasswordValid = !errors.password;
    const isConfirmValid = validateOnSubmit();

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    try {
      const body = {
        currentpassword: inputFields.currentpassword,
        password: inputFields.password,
        confirmpassword: inputFields.confirmPassword,
      };

      const res = await api.post(`${USER_API.CHANGE_LOGINPASSWORD}`, body);

      if (res.data.data.status === 200) {
        toast.success(res.data.data.result, toastOptions);
        setTimeout(() => {
          handleLogOut();
        }, 2000);
        setInputFields({
          currentpassword: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        toast.error(res.data.data.result, toastOptions);
      }
    } catch (err) {
      toast.error("Something went wrong!", toastOptions);
      console.error(err);
    }
  };

  return (
    <section className="transition-all duration-300">
      <div className="rounded-lg text-start md:min-h-[62vh]">
        <div
          onClick={() => {
            if (isMobile && toggle) setToggle(false);
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-start gap-1 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Change Password
            </h1>
            <p className="text-base text-[#535862]">
              Enter your current and new password below.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 mt-3 mb-10">
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password *
                  </label>
                  <div className="flex relative items-center mt-1.5">
                    <i className="bi bi-lock absolute left-2 text-gray-400"></i>
                    <input
                      className="w-full px-8 py-2.5 border border-[#D5D7DA] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      required
                      name="currentpassword"
                      value={inputFields.currentpassword}
                      onChange={handleInputChange}
                    />
                    <i
                      className={`bi bi-${
                        showPassword ? "eye" : "eye-slash-fill"
                      } absolute right-2 text-gray-400 cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password *
                  </label>
                  <div className="flex relative items-center mt-1.5">
                    <i className="bi bi-lock absolute left-2 text-gray-400"></i>
                    <input
                      className={`w-full px-8 py-2.5 border ${
                        errors.password ? "border-red-500" : "border-[#D5D7DA]"
                      } rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      name="password"
                      value={inputFields.password}
                      onChange={handleInputChange}
                    />
                    <i
                      className={`bi bi-${
                        showPassword ? "eye" : "eye-slash-fill"
                      } absolute right-2 text-gray-400 cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="flex relative items-center mt-1.5">
                    <i className="bi bi-lock absolute left-2 text-gray-400"></i>
                    <input
                      className={`w-full px-8 py-2.5 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#D5D7DA]"
                      } rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      required
                      name="confirmPassword"
                      value={inputFields.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <i
                      className={`bi bi-${
                        showPassword ? "eye" : "eye-slash-fill"
                      } absolute right-2 text-gray-400 cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() =>
                      setInputFields({
                        currentpassword: "",
                        password: "",
                        confirmPassword: "",
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
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

<div className="flex justify-end space-x-2 mt-4">
  <button className="btn-cancel">Cancel</button>
  <button className="px-4 py-2 rounded-md bg-antique_gold hover:bg-antique_gold_dark text-black">
    Save Changes
  </button>
</div>;

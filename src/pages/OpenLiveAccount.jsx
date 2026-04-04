import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hr } from "../components/Common/Hr";
import { useUserContext } from "../context/userContext";
// import axios from "axios";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import BackButton from "../components/ui/BackButton";
import api from "../utils/axiosInstance";
import { USER_API } from "../utils/constants";

// const backendURL = import.meta.env.VITE_API_URL;

export const OpenLiveAccount = () => {
  const { toggle, isMobile, setToggle } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { toastOptions, fetchDashboardData } = useUserContext();
  // const token = localStorage.getItem("userToken");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [list_group, setList_group] = useState([]);
  const [selectedLeverage, setSelectedLeverage] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(
    location.state?.selectedGroupId || "",
  );

  const [inputField, setInputField] = useState({
    // token: token,
    selectgroup: location.state?.selectedGroupId || "",
    nickName: "",
    accleverage: "",
    mainpassword: "",
    investorpassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const getList_group = async () => {
      try {
        const resp = await api.post(`${USER_API.LIST_GROUP}`);
        const apiResp = resp?.data?.data;
        if (apiResp?.status === 200) {
          const groups = apiResp.response || [];
          setList_group(groups);

          const selId =
            location.state?.selectedGroupId || inputField.selectgroup;
          if (selId) {
            const selectedGroup = groups.find((g) => g.groupid === selId);
            if (selectedGroup) {
              setSelectedLeverage(selectedGroup.leverage || "");
              setSelectedGroupId(selectedGroup.groupid);
              setInputField((prev) => ({
                ...prev,
                selectgroup: selectedGroup.groupid,
              }));
            }
          }
        } else {
          toast.error(apiResp?.result || "Failed to load groups", toastOptions);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        toast.error("Network error while fetching groups", toastOptions);
      }
    };

    getList_group();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedGroupId && !location.state?.selectedGroupId) {
    return (
      <section>
        <div
          onClick={() => {
            if (isMobile && toggle) setToggle(false);
          }}
          className=""
        >
          <div className="">
            <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Add Account
                </h2>
                <p className="text-sm text-gray-600">
                  No account type selected
                </p>
              </div>
              <div>
                <BackButton customPath={"/account"} />
              </div>
            </div>

            <div className=" w-[77%] max-w-6xl bg-white border rounded-lg shadow-sm p-6 text-start">
              <p className="mb-4">
                You haven't selected an account type yet. Please choose one
                first.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => navigate("/account/select-account-type")}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md"
                >
                  Select account type
                </button>
                <button
                  onClick={() => navigate("/account")}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Back to Accounts
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectgroup") {
      const selectedGroup = list_group.find((group) => group.groupid === value);
      setSelectedGroupId(value);
      setSelectedLeverage(selectedGroup?.leverage || "");
      setInputField((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    } else {
      setInputField((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (isSubmitting) return;
    setIsSubmitting(true);

    const body = {
      // token: inputField.token,
      selectgroup: selectedGroupId || inputField.selectgroup,
      accleverage: selectedLeverage,
      nickname: inputField.nickName,
      mainpassword: inputField.mainpassword,
      investorpassword: inputField.investorpassword,
    };

    try {
      const response = await api.post(
        `${USER_API.OPEN_LIVE_ACCOUNT_ADD}`,
        body,
      );
      const data = response?.data?.data;
      if (data?.status === 200) {
        const successMsg = data?.result || "Account created successfully!";
        toast.success(data.result);
        setMessage({ type: "success", text: successMsg });
        toast.success(data.result, toastOptions);
        fetchDashboardData();
        navigate("/account");
      } else {
        const errorMsg = data?.result || "Unexpected error occurred";
        setMessage({ type: "error", text: errorMsg });
        toast.error(data?.result || "Unexpected error occurred", toastOptions);
      }
    } catch (err) {
      console.error("err -------->", err);
      toast.error("Failed to create account. Please try again.", toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={``}>
      <div
        className={``}
        onClick={() => {
          if (isMobile && toggle) setToggle(false);
        }}
      >
        <div className="">
          {/* Header */}
          <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-3xl font-bold text-gray-900">Add Account</h2>
            </div>
            <div>
              <BackButton customPath={"/account/select-account-type"} />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border rounded-lg shadow-sm w-full lg:w-[77%]">
            <div className="w-full bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                {/* From Account */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account type
                  </label>
                  <div className="w-full rounded-md border border-[#D5D7DA] p-2">
                    <div className="text-m text-gray-800 font-medium">
                      {list_group.find(
                        (g) =>
                          g.groupid ===
                          (selectedGroupId || inputField.selectgroup),
                      )?.groupname || "Selected account"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Leverage:{" "}
                      {selectedLeverage ? `${selectedLeverage}x` : "N/A"}
                    </div>
                  </div>
                </div>

                {/* To Account */}
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Leverage:
                    <span className="ml-2 font-semibold text-black">
                      {selectedLeverage ? `${selectedLeverage}x` : "N/A"}
                    </span>
                  </p>
                </div>

                {/* Nickname */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nick Name
                  </label>
                  <input
                    type="text"
                    placeholder="Add your Nick name here"
                    className="w-full bg-transparent border border-[#D5D7DA] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-input-border"
                    value={inputField.nickName}
                    name="nickName"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Main password */}
                <div className="mb-6">
                  <label className="text-base font-medium text-[#414651]">
                    Main password *
                  </label>
                  <div className="flex relative items-center mt-1.5">
                    <i
                      className={`bi bi-lock absolute left-2 text-gray-400 font-extrabold`}
                    ></i>
                    <input
                      className={`w-full px-8 py-2.5 border border-[#D5D7DA] rounded-lg text-[#181D27] text-base font-medium focus:outline-none focus:ring-2 focus:ring-input-border bg-transparent placeholder:text-base placeholder:font-medium`}
                      type={showPassword ? "text" : "password"}
                      onChange={handleInputChange}
                      placeholder="Main password *"
                      name="mainpassword"
                      value={inputField.mainpassword}
                    />
                    <i
                      className={`bi bi-${
                        showPassword ? "eye" : "eye-slash-fill"
                      } absolute right-0 text-gray-400 font-extrabold p-2 cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>

                {/* Investor password */}
                <div className="mb-6">
                  <label className="font-medium text-[#414651] text-base">
                    Investor password *
                  </label>
                  <div className="flex relative items-center mt-1.5">
                    <i
                      className={`bi bi-lock absolute left-2 text-gray-400 font-extrabold`}
                    ></i>
                    <input
                      className={`w-full px-8 py-2.5 border border-[#D5D7DA] rounded-lg text-[#181D27] text-base font-medium focus:outline-none focus:ring-2 focus:ring-input-border bg-transparent placeholder:text-base placeholder:font-medium`}
                      type={showPassword ? "text" : "password"}
                      onChange={handleInputChange}
                      placeholder="Investor password *"
                      name="investorpassword"
                      value={inputField.investorpassword}
                    />
                    <i
                      className={`bi bi-${
                        showPassword ? "eye" : "eye-slash-fill"
                      } absolute right-0 text-gray-400 font-extrabold p-2 cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>
                {/* Display success/error message */}
                {message.text && (
                  <div
                    className={`mb-4 px-4 py-2 rounded-md text-sm shadow-md ${
                      message.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
                <Hr />
                {/* Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isSubmitting ? "Creating....  " : " Create Account"}
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

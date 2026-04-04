import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import LoginImage from "../../assets/img/AuthUserPage.jpg";

const ForgotPassword = () => {
  const { toastOptions, ForgotPass } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [inputField, setInputField] = useState({ email: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!inputField.email) {
      toast.error("Please enter your email", toastOptions);
      setIsLoading(false);
      return;
    }

    try {
      await ForgotPass(inputField);
      setInputField({ email: "" });
    } catch (error) {
      toast.error("Error while sending reset link", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image | Responcive image is pending */}
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
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#414651] mb-1 block">
                Your email address
              </label>
              <div className="flex items-center border-2 hover:border-blue-500 rounded px-3 py-2">
                <MdEmail className="text-blue-600 w-6 h-6" />
                <input
                  type="email"
                  name="email"
                  value={inputField.email}
                  onChange={handleInputChange}
                  placeholder="example@mail.com"
                  required
                  className="w-full px-2 outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p>
              If you already have credentials?{" "}
              <Link
                to="/login"
                className="text-blue-600 text-sm hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

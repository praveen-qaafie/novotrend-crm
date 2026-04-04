import { Link } from "react-router-dom";
import bg404 from "../../assets/img/404.png";

const PageNotFound = () => {
  return (
    <>
      <section className="flex justify-center items-center min-h-screen bg-white px-4 py-20">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <img src={bg404} alt="404 Error" className="mx-auto" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            This page doesn’t exist or was removed! <br />
            We suggest you go back to home.
          </p>
          <Link to="/" className="theme-btn btn-one hover:underline">
            Back to DashBoard
          </Link>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;

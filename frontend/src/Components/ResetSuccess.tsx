import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ResetSuccess() {
  return (
    <div className="text-center">
      <FaCheckCircle className="mx-auto text-5xl text-green-500" />
      <h1 className="text-2xl font-bold mt-4">
        Password Reset Successfully!
      </h1>
      <p className="text-gray-500 mt-2">
        Redirecting to login...
      </p>

      <Link
        to="/"
        className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Sign In Now
      </Link>
    </div>
  );
}

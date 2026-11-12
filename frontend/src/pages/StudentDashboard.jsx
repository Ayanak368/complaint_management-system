
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch student's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaints(response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate statistics
  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "PENDING"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">
          Complaint Portal
        </h1>

        <button
          onClick={handleLogout}
          className="text-red-500 font-semibold hover:text-red-700"
        >
          Logout
        </button>
      </nav>

      {/* Dashboard */}
      <div className="p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Student!
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and track your college complaints.
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-5">
            {error}
          </p>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Total Complaints */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Total Complaints
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : totalComplaints}
            </h2>
          </div>

          {/* Pending Complaints */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Pending Complaints
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {loading ? "..." : pendingComplaints}
            </h2>
          </div>

          {/* Resolved Complaints */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Resolved Complaints
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "..." : resolvedComplaints}
            </h2>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8">

          <Link
            to="/submit-complaint"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Submit Complaint
          </Link>

          <Link
            to="/my-complaints"
            className="bg-white text-purple-700 border border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50"
          >
            My Complaints
          </Link>

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;

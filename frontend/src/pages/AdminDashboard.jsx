
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
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

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">
          Admin Portal
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
          Welcome, {user?.name || "Admin"}!
        </h1>

        <p className="text-gray-500 mt-2">
          Manage student complaints and responses.
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-5">
            {error}
          </p>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          {/* Total Complaints */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Total Complaints
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : totalComplaints}
            </h2>
          </div>

          {/* Pending */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {loading ? "..." : pendingComplaints}
            </h2>
          </div>

          {/* In Progress */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              In Progress
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {loading ? "..." : inProgressComplaints}
            </h2>
          </div>

          {/* Resolved */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Resolved
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "..." : resolvedComplaints}
            </h2>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8">
          <Link
            to="/admin/complaints"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            View All Complaints
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;


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
            "Failed to load complaints."
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
    (c) => c.status === "PENDING"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  // Get latest 5 complaints
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    )
    .slice(0, 5);

  // Status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 md:px-8 py-4 flex justify-between items-center">
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

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "Admin"}!
          </h1>

          <p className="text-gray-500 mt-2">
            Manage student complaints and responses.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Total Complaints
            </p>
            <h2 className="text-3xl font-bold mt-3 text-gray-800">
              {loading ? "..." : totalComplaints}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-3">
              {loading ? "..." : pendingComplaints}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              In Progress
            </p>
            <h2 className="text-3xl font-bold text-blue-600 mt-3">
              {loading ? "..." : inProgressComplaints}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Resolved
            </p>
            <h2 className="text-3xl font-bold text-green-600 mt-3">
              {loading ? "..." : resolvedComplaints}
            </h2>
          </div>

        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Complaints
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest student complaints
              </p>
            </div>

            <Link
              to="/admin/complaints"
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 text-center"
            >
              View All Complaints
            </Link>
          </div>

          <div className="p-6">

            {loading ? (
              <p className="text-center text-gray-500 py-8">
                Loading complaints...
              </p>
            ) : recentComplaints.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No complaints submitted yet.
              </p>
            ) : (
              <div className="space-y-4">

                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-purple-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-3">

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {complaint.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Student: {complaint.student_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Category: {complaint.category}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status.replace("_", " ")}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;

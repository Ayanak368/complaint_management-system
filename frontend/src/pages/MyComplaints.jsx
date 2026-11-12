
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");
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

  return (
    <div className="min-h-screen bg-purple-50">

      <nav className="bg-white shadow px-8 py-4">
        <Link
          to="/student-dashboard"
          className="text-purple-700 font-bold"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto p-6 mt-8">

        <h1 className="text-3xl font-bold text-gray-800">
          My Complaints
        </h1>

        <p className="text-gray-500 mt-2">
          Track your complaints and admin responses.
        </p>

        {loading && (
          <p className="text-purple-600 mt-8">
            Loading complaints...
          </p>
        )}

        {error && (
          <p className="text-red-600 mt-8">
            {error}
          </p>
        )}

        {!loading && !error && complaints.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow mt-8 text-center">
            <p className="text-gray-600">
              You haven't submitted any complaints yet.
            </p>
          </div>
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="mt-8 space-y-5">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white p-6 rounded-xl shadow"
              >

                <div className="flex flex-wrap justify-between gap-3">

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {complaint.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Category: {complaint.category}
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Submitted:{" "}
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`h-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.replace("_", " ")}
                  </span>

                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700">
                    Description
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {complaint.description}
                  </p>
                </div>

                <div className="mt-5 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700">
                    Admin Reply
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {complaint.admin_reply || "No reply yet."}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyComplaints;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replies, setReplies] = useState({});
  const [messages, setMessages] = useState({});
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
        setComplaints(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Status badge styling
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

  // Priority badge styling
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "NORMAL":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Update complaint priority
  const handlePriorityChange = async (complaintId, priority) => {
    try {
      const response = await api.put(
        `/complaints/${complaintId}/priority`,
        { priority }
      );

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, priority: response.data.priority }
            : complaint
        )
      );

      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "success",
          text: "Priority updated successfully!",
        },
      }));
    } catch (error) {
      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "error",
          text: error.response?.data?.detail || "Failed to update priority.",
        },
      }));
    }
  };

  // Send admin reply
  const handleSendReply = async (complaintId) => {
    const reply = replies[complaintId]?.trim();

    if (!reply) {
      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "error",
          text: "Please enter a reply.",
        },
      }));
      return;
    }

    try {
      const response = await api.put(`/complaints/${complaintId}/reply`, {
        admin_reply: reply,
      });

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, admin_reply: response.data.admin_reply }
            : complaint
        )
      );

      setReplies((previous) => ({
        ...previous,
        [complaintId]: "",
      }));

      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "success",
          text: "Reply sent successfully!",
        },
      }));
    } catch (error) {
      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "error",
          text: error.response?.data?.detail || "Failed to send reply.",
        },
      }));
    }
  };

  // Update complaint status
  const handleStatusChange = async (complaintId, status) => {
    try {
      const response = await api.put(`/complaints/${complaintId}/status`, {
        status,
      });

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: response.data.status }
            : complaint
        )
      );

      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "success",
          text: "Status updated successfully!",
        },
      }));
    } catch (error) {
      setMessages((previous) => ({
        ...previous,
        [complaintId]: {
          type: "error",
          text: error.response?.data?.detail || "Failed to update status.",
        },
      }));
    }
  };

  // Filter complaints by priority
  const filteredComplaints =
    priorityFilter === "ALL"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.priority === priorityFilter
        );

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4">
        <Link to="/admin-dashboard" className="text-purple-700 font-bold">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-gray-800">All Complaints</h1>

        <p className="text-gray-500 mt-2">
          View and manage complaints submitted by students.
        </p>

        {/* Priority Filter */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="font-semibold text-gray-700">
            Filter by Priority:
          </label>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>

          <span className="text-sm text-gray-500">
            {filteredComplaints.length} complaints found
          </span>
        </div>

        {loading && (
          <p className="text-purple-600 mt-8">Loading complaints...</p>
        )}

        {error && <p className="text-red-600 mt-8">{error}</p>}

        {!loading && !error && filteredComplaints.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow mt-8 text-center">
            <p className="text-gray-600">No complaints found for this priority.</p>
          </div>
        )}

        {/* Complaint List */}
        {!loading && !error && filteredComplaints.length > 0 && (
          <div className="mt-8 space-y-5">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white p-6 rounded-xl shadow"
              >
                {/* Complaint Details */}
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {complaint.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Complaint ID: {complaint.id}
                    </p>

                    <p className="text-gray-500">
                      Student ID: {complaint.user_id}
                    </p>

                    <p className="text-gray-500">
                      Category: {complaint.category}
                    </p>

                    <p className="text-gray-500">
                      Student Name: {complaint.student_name}
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Submitted:{" "}
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      handleStatusChange(complaint.id, e.target.value)
                    }
                    className={`h-fit px-3 py-2 rounded-lg text-sm font-semibold outline-none cursor-pointer ${getStatusStyle(
                      complaint.status
                    )}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                {/* Priority Management */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-gray-700">
                    Priority:
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityStyle(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </span>

                  <select
                    value={complaint.priority}
                    onChange={(e) =>
                      handlePriorityChange(complaint.id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1">
                    {complaint.description}
                  </p>
                </div>

                {/* Existing Admin Reply */}
                <div className="mt-5 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700">Admin Reply</h3>
                  <p className="text-gray-600 mt-2">
                    {complaint.admin_reply || "No reply sent yet."}
                  </p>
                </div>

                {/* Reply Form */}
                {complaint.admin_reply ? (
                  <div className="mt-4">
                    <p className="text-green-600 font-medium">
                      ✓ Reply already sent to the student.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Write a Reply
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Write your reply to the student..."
                      value={replies[complaint.id] || ""}
                      onChange={(e) =>
                        setReplies((previous) => ({
                          ...previous,
                          [complaint.id]: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <button
                      onClick={() => handleSendReply(complaint.id)}
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg mt-2 hover:bg-purple-700 transition"
                    >
                      Send Reply
                    </button>
                  </div>
                )}

                {/* Messages */}
                {messages[complaint.id] && (
                  <p
                    className={`text-sm mt-3 ${
                      messages[complaint.id].type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {messages[complaint.id].text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;

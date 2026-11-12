
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/complaints", {
        title,
        category,
        description,
      });

      setSuccess("Complaint submitted successfully!");

      setTimeout(() => {
        navigate("/my-complaints");
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.detail || "Failed to submit complaint."
      );
    } finally {
      setLoading(false);
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

      <div className="max-w-2xl mx-auto p-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-8">

          <h1 className="text-2xl font-bold text-gray-800">
            Submit a Complaint
          </h1>

          <p className="text-gray-500 mt-2">
            Describe your issue so the administration can help you.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="block text-gray-700 mb-2">
                Complaint Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter complaint title"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                <option value="Academics">Academics</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Hostel">Hostel</option>
                <option value="Library">Library</option>
                <option value="Transportation">Transportation</option>
                <option value="Canteen">Canteen</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your complaint..."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {success && (
              <p className="text-green-600 text-sm">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default SubmitComplaint;

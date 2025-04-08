import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { handleError, handleSuccess } from "../utils";
import { data } from "react-router-dom";

const AdminPanel = () => {
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [editFeedback, setEditFeedback] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [viewFeedback, setviewFeedback] = useState(null);
  const [isModalOpen, setisModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllFeedback = async () => {
      try {
        const res = await axiosInstance.get("/admin/all-feedback", {
          withCredentials: true,
        });

        setAllFeedbacks(res.data.allfb);
      } catch (error) {
        handleError(
          error.response?.data?.message || "Error fetching allfeedbacks"
        );
      }
    };
    if (user?.role === "admin") {
      fetchAllFeedback();
    }
  }, [user]);

  const handleEdit = (data) => {
    console.log(data);

    setEditFeedback(data);
    setNewMessage(data.message);
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(
        `/admin/edit-feedback/${editFeedback._id}`,
        { message: newMessage },
        { withCredentials: true }
      );

      setAllFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === editFeedback._id ? { ...fb, message: newMessage } : fb
        )
      );
      handleSuccess("Feedback update successfully");
      setEditFeedback(null);
    } catch (error) {
      console.error("Error updating feedback", error);
      handleError("Error in updating feedback");
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting feedback with ID:", id); // ✅ Debugging log

    if (!id) {
      handleError("Invalid feedback ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/admin/delete-feedback/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        handleSuccess(res.data.message);
        setAllFeedbacks(allFeedbacks.filter((data) => data._id !== id));
      } else {
        handleError("Failed to delete feedback");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    }
  };

  const handleViewFeedback = (fb) => {
    setviewFeedback(fb.message);
    setisModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Admin Feedback Dashboard
      </h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Index</th>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">E-mail</th>
              <th className="p-3 border">Feedback</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Update Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {allFeedbacks.length > 0 ? (
              allFeedbacks.map((data, index) => (
                <tr key={data._id} className="text-center hover:bg-gray-100">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{data._id}</td>
                  <td className="p-3 border">{data.userId.name}</td>
                  <td className="p-3 border">{data.userId.email}</td>
                  <td className="p-3 border text-left max-w-[200px] break-words ">
                    {data.message}
                  </td>
                  <td className="p-3 border">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {new Date(data.updatedAt ).toLocaleDateString()}
                  </td>
                  <td className="p-3 border space-x-2 h-full space-y-2">
                    <button
                      onClick={() => handleViewFeedback(data)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      onClick={() => handleEdit(data)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(data._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No feedback available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* view feedback */}

      {isModalOpen && viewFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Feedback Details</h2>
            <p className="text-gray-800 break-words whitespace-pre-wrap">
              {viewFeedback}
            </p>
            <button
              onClick={() => setisModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Feedback Modal */}
      {editFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Feedback</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setEditFeedback(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

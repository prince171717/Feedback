import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { axiosInstance } from "../lib/axios";

const Home = () => {
  const [feedback, setFeedback] = useState({
    userFeedback: "",
  });
  const [storeFeedback, setStoreFeedback] = useState([]);
  const [toggleMode, settoggleMode] = useState(false); // Toggle mode
  const [storeId, setstoreId] = useState(null); // Store ID of feedback being edited
  const [showForm, setShowForm] = useState(true);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [isModalOpen, setisModalOpen] = useState(false);

  const handleChangeFeedback = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  useEffect(() => {
    fetchUserFeedbacks(); // Fetch feedbacks when component mounts
  }, []);

  const fetchUserFeedbacks = async () => {
    try {
      const res = await axiosInstance.get("/auth/user-feedback", {
        withCredentials: true,
      });
      if (res.data.success) {
        setStoreFeedback(res.data.feedbackData);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Error fetching feedbacks");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const { userFeedback } = feedback;
    if (!userFeedback.trim()) {
      return handleError("Feedback is required");
    }

    try {
      let res;

      if (toggleMode && storeId) {
        res = await axiosInstance.put(
          `/auth/update-feedback/${storeId}`,
          feedback,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          handleSuccess("Feedback updated successfully");
          setFeedback({ userFeedback: "" });
          setstoreId(null);
          setShowForm(true);
        }
      } else {
        res = await axiosInstance.post("/auth/user-feedback", feedback, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log("feedback", res.data);

        const { message, success, error } = res.data;

        if (success) {
          handleSuccess("Feedback submitted successfully");
          setFeedback((prev) => ({ ...prev, userFeedback: "" }));
          console.log("Updated feedback:", feedback); // ✅ Correct reset
        } else {
          handleError(
            error?.details?.[0]?.message || message || "Something went wrong"
          );
        }
      }
      fetchUserFeedbacks();
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    }
  };

  const handleDeleteFeedback = async (id) => {
    console.log("Deleting feedback with ID:", id); // ✅ Debugging log

    if (!id) {
      handleError("Invalid feedback ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;
    try {
      const res = await axiosInstance.delete(`/auth/delete-feedback/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        handleSuccess(res.data.message);
        setStoreFeedback(storeFeedback.filter((data) => data._id !== id));
      } else {
        handleError("Failed to delete feedback");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    }
  };

  const handleAddFeedback = () => {
    settoggleMode(false);
    setFeedback({ userFeedback: "" });
    setstoreId(null);
    setShowForm(true);
  };

  const handleEditMode = () => {
    settoggleMode(true);
    setShowForm(false); // Hide form, show feedback list only
  };

  const handleEditFeedback = (fb) => {
    console.log("Editing feedback:", fb);
    setFeedback({ userFeedback: fb.message });
    setstoreId(fb._id);
    setShowForm(true);
  };

  const handleViewFeedback = (fb) => {
    setViewFeedback(fb.message);
    setisModalOpen(true);
  };

  console.log(storeFeedback);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="container flex flex-col justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[800px] ">
        <div className="flex gap-2">
          <button
            onClick={handleAddFeedback}
            className="bg-purple-700 text-white border-none text-[16px] rounded-md px-5 py-3 cursor-pointer my-2.5 "
          >
            Add Feedback
          </button>
          <button
            onClick={handleEditMode}
            className="bg-purple-700 text-white border-none text-[16px] rounded-md px-5 py-3 cursor-pointer my-2.5 "
          >
            Edit Feedback
          </button>
        </div>

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

        {toggleMode && !showForm && storeFeedback.length > 0 ? (
          <div className="feedback-list w-full my-4">
            {storeFeedback.map((fb) => (
              <div
                key={fb._id}
                className="p-3 bg-gray-100 rounded-md my-2 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="w-full sm:max-w-[65%]  break-words whitespace-pre-wrap text-gray-800">
                  <p>{fb.message}</p>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <button
                    onClick={() => handleViewFeedback(fb)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    view
                  </button>
                  <button
                    onClick={() => handleEditFeedback(fb)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFeedback(fb._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          toggleMode &&
          !showForm &&
          storeFeedback.length === 0 && <div>NO feedback found</div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmitFeedback}
            className="flex flex-col gap-2 w-full"
          >
            <div className="p-6 w-full flex flex-col gap-2 bg-white shadow-md rounded-lg">
              <label htmlFor="userFeedback">Feedback</label>
              <textarea
                className="resize-none border p-2 w-full h-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChangeFeedback}
                name="userFeedback"
                placeholder="Write your feedback here..."
                value={feedback.userFeedback}
              />
            </div>

            <button
              type="submit"
              className="bg-purple-700 text-white text-[20px] rounded-md p-3 cursor-pointer"
            >
              {toggleMode && storeId ? "Update Feedback" : "Submit Feedback"}
            </button>
          </form>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;

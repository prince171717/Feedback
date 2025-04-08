import feedbackModel from "../Models/feedback.js";

export const adminController = async (req, res) => {
  try {
    const allfb = await feedbackModel
      .find()
      .populate("userId", "name email role");
    res.status(200).json({ allfb, success: true });
  } catch (error) {
    console.log("error in admin feedback", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const updateUserFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const feedback = await feedbackModel.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    // Once you use findByIdAndUpdate, Mongoose already updates the document in the database. So you don’t need to manually set feedback.message and await feedback.save() again. That part is not harmful, but it’s unnecessary and can sometimes create issues if feedback is null.

    // feedback.message = message;
    // await feedback.save();
    console.log("update admin controller", feedback);

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.log("Error in admin update controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserFeedback = async (req, res) => {
  try {
    const deleteFeedback = await feedbackModel.findById(req.params.id);
    if (!deleteFeedback) {
      return res
        .status(404)
        .json({ message: "Feedback not found", success: false });
    }

    await feedbackModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Feedback deleted successully", success: true });
  } catch (error) {
    console.log("Error in admin delete controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

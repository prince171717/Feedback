import { Router } from "express";
import { adminProtectRoute } from "../Middlewares/adminAuth.js";
import { adminController, deleteUserFeedback, updateUserFeedback } from "../Controllers/admin.controller.js";

const router = Router();

router.get("/all-feedback", adminProtectRoute ,adminController);
router.put("/edit-feedback/:id", adminProtectRoute ,updateUserFeedback);
router.delete("/delete-feedback/:id", adminProtectRoute ,deleteUserFeedback);



export default router;

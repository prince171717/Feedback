import { Router } from "express";
import { checkAuth,deleteFeedback,fetchUserFeedback,login, logout, signUp, updateFeedback, userFeedback } from "../Controllers/auth.controller.js";
import {
  loginValidation,
  protectRoute,
  signUpValidation,
} from "../Middlewares/authValidation.js";

const router = Router();

router.post("/login", loginValidation, login);

router.post("/signup", signUpValidation, signUp);
router.post("/logout", logout);
router.post('/user-feedback',protectRoute, userFeedback);
router.get('/user-feedback',protectRoute,fetchUserFeedback );
router.put('/update-feedback/:id',protectRoute,updateFeedback );
router.delete('/delete-feedback/:id',protectRoute,deleteFeedback );



router.get('/check-auth', checkAuth);


export default router;

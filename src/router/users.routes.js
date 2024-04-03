import { Router } from "express";
import { chekAuth, authorization } from "../middlewares/auth.js";
import { putSwitchUserPremiumRole } from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.put("/premium/:uid", chekAuth, authorization("admin"), putSwitchUserPremiumRole);

export default usersRoutes;

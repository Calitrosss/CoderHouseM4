import { Router } from "express";
import { chekAuth, authorization } from "../middlewares/auth.js";
import { putSwitchUserPremiumRole, patchUserDocuments } from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.put("/premium/:uid", chekAuth, authorization("admin"), putSwitchUserPremiumRole);

usersRoutes.put("/:uid/documents", chekAuth, patchUserDocuments);

export default usersRoutes;

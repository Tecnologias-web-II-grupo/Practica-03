import express from "express";
import { signup, signin, signout, getAll, getById, update, deleteUser } from "../controllers/ctrl_Users.js";
import { verifyRol, verifyDuplicates, verifyToken, isRoot, isAdmin } from "../middleware/func_Users.js";
import {
    signupRules,
    signinRules,
    userIdParamRule,
    updateUserRules,
    validateRequest
} from "../middleware/validateRequest.js";

const users = express.Router();

users.post("/signup", [signupRules, verifyDuplicates, verifyRol, validateRequest], signup);
users.post("/signin", [signinRules, validateRequest], signin);
users.post("/signout", signout);

users.get("/", [verifyToken, isAdmin], getAll);
users.get("/:id", [verifyToken, userIdParamRule, validateRequest], getById);
users.put("/:id", [verifyToken, isRoot, userIdParamRule, updateUserRules, validateRequest], update);
users.delete("/:id", [verifyToken, isRoot, userIdParamRule, validateRequest], deleteUser);

export default users;


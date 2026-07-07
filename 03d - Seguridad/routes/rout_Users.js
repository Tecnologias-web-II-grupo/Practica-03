import express from "express";
import { signup, signin, signout, getAll, getById, update, deleteUser } from "../controllers/ctrl_Users.js";
import { verifyRol, verifyDuplicates, verifyToken, isRoot, isAdmin } from "../middleware/func_Users.js";

const users = express.Router();

users.post("/signup", [verifyDuplicates, verifyRol], signup);
users.post("/signin", signin);
users.post("/signout", signout);

users.get("/", [verifyToken, isAdmin], getAll);
users.get("/:id", [verifyToken], getById);
users.put("/:id", [verifyToken, isRoot], update);
users.delete("/:id", [verifyToken, isRoot], deleteUser);

export default users;


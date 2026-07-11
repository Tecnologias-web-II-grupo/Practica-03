import express from "express";
import { getCategories, addCategories, updCategories, delCategories} from "../controllers/ctrl_Categories.js";
import { verifyToken, isAdmin, isUser } from "../middleware/func_Users.js";
import {
    categoryCreateRules,
    categoryUpdateRules,
    categoryDeleteRules,
    validateRequest
} from "../middleware/validateRequest.js";

const categories = express.Router();

categories.get("/", getCategories);
categories.post("/", [verifyToken, isUser, categoryCreateRules, validateRequest], addCategories);
categories.put("/", [verifyToken, isAdmin, categoryUpdateRules, validateRequest], updCategories);
categories.delete("/", [verifyToken, isAdmin, categoryDeleteRules, validateRequest], delCategories);

export default categories ;

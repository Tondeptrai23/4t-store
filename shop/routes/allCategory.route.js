import { Router } from "express";
import allCategoriesController from "../controllers/allCategory.controller.js";

const allCategoryRoute = Router();

allCategoryRoute.get("/categories", allCategoriesController.getCategories);


export default allCategoryRoute;
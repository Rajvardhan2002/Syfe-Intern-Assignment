const express = require("express");
const categoryController = require("../controllers/category.controller");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.get("/categories", isAuth, categoryController.getCategories); // Fetch all categories
router.get("/category/:id", isAuth, categoryController.getCategoryDetails); // Fetch category details
router.get("/add-category", isAuth, categoryController.getAddCategory); // Render add category form
router.post("/add-category", isAuth, categoryController.addCategory); // Handle add category form submission
router.get("/edit-category/:id", isAuth, categoryController.getEditCategory); // Render edit category form
router.post("/edit-category/:id", isAuth, categoryController.editCategory); // Handle edit category form submission
router.post("/delete-category/:id", isAuth, categoryController.deleteCategory); // Handle category deletion

module.exports = router;

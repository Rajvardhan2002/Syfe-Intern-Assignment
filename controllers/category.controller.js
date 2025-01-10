const Category = require("../models/category.model");

function getAddCategory(req, res) {
  res.render("categories/add-category", {
    inputData: { name: "", description: "" },
    errorMessage: "",
  });
}

async function addCategory(req, res, next) {
  const { name, description } = req.body;
  const userId = req.session.uid;

  if (!name || name.trim() === "") {
    return res.status(400).render("categories/add-category", {
      inputData: { name, description },
      errorMessage: "Category name is required.",
    });
  }

  const category = new Category(name, description, userId);

  try {
    await category.save();
    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
}

async function getCategories(req, res, next) {
  const userId = req.session.uid;

  try {
    const categories = await Category.getAllByUser(userId);
    res.render("categories/home", { categories });
  } catch (error) {
    next(error);
  }
}

async function getCategoryDetails(req, res, next) {
  const categoryId = req.params.id;

  try {
    const category = await Category.getById(categoryId);
    if (!category || category.user_id.toString() !== req.session.uid) {
      return res.status(404).render("shared/400");
    }
    res.render("categories/category-details", { category });
  } catch (error) {
    next(error);
  }
}

async function getEditCategory(req, res, next) {
  const categoryId = req.params.id;
  const userId = req.session.uid;

  try {
    const category = await Category.getById(categoryId);
    if (!category || category.user_id.toString() !== userId) {
      return res.status(404).render("shared/400");
    }

    res.render("categories/edit-category", { category, errorMessage: "" });
  } catch (error) {
    next(error);
  }
}

async function editCategory(req, res, next) {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  const userId = req.session.uid;

  if (!name || name.trim() === "") {
    return res.status(400).render("categories/edit-category", {
      category: { _id: categoryId, name, description },
      errorMessage: "Category name is required.",
    });
  }

  try {
    const updated = await Category.updateById(categoryId, {
      name,
      description,
      user_id: userId,
    });
    if (!updated) {
      return res.status(404).render("shared/400");
    }
    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  const categoryId = req.params.id;
  const userId = req.session.uid;

  try {
    const deleted = await Category.deleteById(categoryId, userId);
    if (!deleted) {
      return res.status(404).render("shared/400");
    }
    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAddCategory,
  addCategory,
  getCategories,
  getCategoryDetails,
  getEditCategory,
  editCategory,
  deleteCategory,
};

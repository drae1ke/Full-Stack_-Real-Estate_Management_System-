const fs = require("fs");
const mongoose = require("mongoose");
const model = require("../model/category");
const {
  ensureDefaultCategories,
} = require("../utils/ensureDefaultCategories");
const Category = model.Category;

exports.createCategory = async (req, res) => {
  try {
    const categoryName = req.body.category?.trim();

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({ category: categoryName });
    const output = await category.save();
    console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.getCategory = async (req, res) => {
  try {
    await ensureDefaultCategories();
    const category = await Category.find().sort({ category: 1 });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.getOneCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findOneAndDelete({ _id: id });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const categoryName = req.body.category?.trim();

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { category: categoryName },
      {
        new: true,
      }
    );
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

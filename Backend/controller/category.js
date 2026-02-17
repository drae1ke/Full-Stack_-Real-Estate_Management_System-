const fs = require("fs");
const mongoose = require("mongoose");
const model = require("../model/category");
const Category = model.Category;

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
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
    const category = await Category.find();
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
    const category = await Category.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

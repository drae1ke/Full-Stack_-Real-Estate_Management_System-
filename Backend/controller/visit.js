const fs = require("fs");
const mongoose = require("mongoose");
const model = require("../model/visit");
const Visit = model.Visit;
exports.createVisit = async (req, res) => {
  const category = new Visit(req.body);
  try {
    const output = await category.save();
    console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.getForOneProperty = async (req, res) => {
  console.log("The body is: ", req.body);
  const { visit: search } = req.body;
  try {
    let query = Visit.find({ productId: search });

    const results = await query.exec();
    if (results) {
      console.log("The result is :", results);
    } else {
      console.log("No Result");
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching.",
      error: error.message,
    });
  }
};

exports.getVisits = async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.confirmation = async (req, res) => {
  const id = req.params.id;
  try {
    const visit = await Visit.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(visit);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const visit = await Visit.findOneAndDelete({ _id: id });
    res.json(visit);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

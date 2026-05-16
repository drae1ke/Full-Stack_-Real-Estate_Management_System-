const mongoose = require("mongoose");
const model = require("../model/property");
const { normalizePropertyPayload } = require("../utils/propertyPayload");

const Property = model.Property;

//Adding one Document
exports.createProperty = async (req, res) => {
  const response = normalizePropertyPayload(req.body);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Property image is required",
      });
    }

    const property = new Property({
      ...response,
      image: req.file.filename,
    });
    const savedProperty = await property.save();

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Getting all the documents
exports.getAllProperty = async (req, res) => {
  try {
    const property = await Property.find();
    console.log(req.body);
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting one Document
exports.GetOneProperty = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const property = await Property.findById(id);
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Put Operation on document
exports.replaceProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const response = normalizePropertyPayload(req.body);
    const property = await Property.findOneAndReplace(
      { _id: id },
      response,
      { new: true }
    );
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Update operation on document
exports.updateProperty = async (req, res) => {
  const id = req.params.id;
  const response = normalizePropertyPayload(req.body);

  if (req.file) {
    const property = await Property.findOneAndUpdate(
      { _id: id },
      { ...response, image: req.file.filename },
      {
        new: true,
      }
    );
    res.json(property);
  } else {
    const property = await Property.findOneAndUpdate(
      { _id: id },
      response,
      {
        new: true,
      }
    );

    res.json(property);
  }
};

exports.updateStar = async (req, res) => {
  console.log("Update Req is");
  const id = req.params.id;

  const property = await Property.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.json(property);
};

//Deleting Document
exports.deleteProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const property = await Property.findOneAndDelete({ _id: id });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.searchProperty = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { searchText: search } = req.body;
  try {
    const searchExp = new RegExp(search, "i");
    let query = Property.find().where("address").regex(searchExp);

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
      message: "An error occurred while searching for Properties.",
      error: error.message,
    });
  }
};

exports.searchByCategoryProperty = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { categoryFilter: category } = req.body;
  try {
    let query = Property.find().where("category").equals(category);
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
      message: "An error occurred while searching categories for properties.",
      error: error.message,
    });
  }
};

exports.searchByStock = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { inStockFilter: stock } = req.body;
  try {
    let query;
    if (stock) {
      query = Property.find().where("stock").lte(0);
      const results = await query.exec();
      res.json(results);
    } else {
      query = Property.find().where("stock").gte(0);
      const results = await query.exec();
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching for properties.",
      error: error.message,
    });
  }
};

const mongoose = require("mongoose");
const model = require("../model/order");
const model3 = require("../model/property");
const model2 = require("../model/user");
const Order = model.Order;
const Property = model3.Property;
const User = model2.User;

exports.createOrder = async (req, res) => {
  const { order, user: token, address, money, img } = req.body;
  console.log(money);
  const user = await User.findOne({ token: token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const date = Date.now();
  const userId = user._id;
  const status = true;
  const totalItem = 1;
  const property = order;
  const sellMoney = money;
  const image = img;

  const newOrder = new Order({
    userId,
    date,
    status,
    totalItem,
    property,
    address,
    sellMoney,
    image,
  });

  try {
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.getOrder = async (req, res) => {
  const orderIds = req.body.orderIds;
  try {
    const property = await Property.find({ _id: { $in: orderIds } });

    if (property.length > 0) {
      res.status(200).json(property);
    } else {
      console.log("No properties found for the given order IDs.");
      res
        .status(404)
        .json({ message: "No properties found for the given order IDs." });
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties." });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const order = await Order.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

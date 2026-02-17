const mongoose = require("mongoose");
const model = require("../model/property");
const model2 = require("../model/user");
const Property = model.Property;
const User = model2.User;
// const stripe = require("stripe")(
//    //Secret Key
// );
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.payment = async (req, res) => {
  try {
    const token = req.body.userToken;
    const user = await User.findOne({ token: token });
    const productId = new mongoose.Types.ObjectId(req.body.productId);
    const product = await Property.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculation with Math.round to prevent "Invalid Integer" errors in Stripe
    const discount = product.discountPercentage || 0;
    const proPrice = product.price - (product.price / 100) * discount;
    const finalAmountInCents = Math.round(proPrice * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: finalAmountInCents, // FIXED: Now a clean integer
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url, message: "ok" });
    console.log("Stripe Session Created Successfully");
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
    console.log("Un-Successful");
  }
};

exports.updateUser = async (req, res) => {
  console.log("Updating User Buy History...");
  try {
    const { propertyId, userToken } = req.body;

    // Find the user by token
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const propertyDetails = await Property.find({
      _id: { $in: propertyId.map((med) => med.id) },
    });

    // Prepare the buy history updates
    const buyHistoryUpdates = propertyDetails.map((med) => {
      return {
        medId: med._id.toString(),
        name: med.name,
        isRated: false,
        rating: null,
        commentId: [],
        date: new Date(),
      };
    });

    // Update the user's buy history
    user.buyHistory = [...user.buyHistory, ...buyHistoryUpdates];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
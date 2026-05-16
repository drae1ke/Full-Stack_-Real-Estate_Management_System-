const mongoose = require("mongoose");
const model = require("../model/property");
const model2 = require("../model/user");

const Property = model.Property;
const User = model2.User;
const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

exports.payment = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY to backend/.env.",
      });
    }

    const token = req.body.userToken;
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const productId = new mongoose.Types.ObjectId(req.body.productId);
    const product = await Property.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ error: "Property not found" });
    }

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
            unit_amount: finalAmountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url, message: "ok" });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { propertyId, userToken } = req.body;
    const user = await User.findOne({ token: userToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const normalizedPropertyIds = (Array.isArray(propertyId)
      ? propertyId
      : [propertyId]
    )
      .map((item) =>
        typeof item === "string" ? item : item?.id || item?._id || null
      )
      .filter(Boolean);

    const propertyDetails = await Property.find({
      _id: { $in: normalizedPropertyIds },
    });

    const buyHistoryUpdates = propertyDetails.map((property) => ({
      medId: property._id.toString(),
      name: property.name,
      isRated: false,
      rating: null,
      commentId: [],
      date: new Date(),
    }));

    user.buyHistory = [...user.buyHistory, ...buyHistoryUpdates];
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const model = require("../model/user");
const jwt = require("jsonwebtoken");

const User = model.User;
const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_local_dev";

exports.createUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No picture was provided",
      });
    }

    const user = new User(req.body);
    const token = jwt.sign({ email: req.body.email }, JWT_SECRET);

    user.token = token;
    user.role = user.role || "user";
    user.image = req.file.filename;

    const output = await user.save();
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ email: req.body.email }, JWT_SECRET);
    user.token = token;
    await user.save();

    res.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
      image: user.image,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(401);
  }
};

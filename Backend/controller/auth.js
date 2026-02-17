const model = require("../model/user");
const User = model.User;
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    if (!req.file) {
      res.json({
        success: false,
        message: "No Picture was provided",
      });
    } else {
      const user = new User(req.body);
      var token = jwt.sign({ email: req.body.email }, "shhhhh");
      user.token = token;
      if (!user.role) {
        user.role = "user";
      }

      user.image = req.file.filename;
      const output = await user.save();
      console.log(output);
      res.status(201).json(output);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user?.password === req.body.password) {
      var token = jwt.sign({ email: req.body.email }, "shhhhh");
      user.token = token;
      try {
        user.save();
        res.json({
          token: token,
          name: user.name,
          role: user.role,
          id: user._id,
          image: user.image,
          //mobileNumber: user.mobileNumber,
        });
      } catch (err) {
        console.log("Error");
        res.json(err);
      }
    } else {
      res.json({ error: "error" });
    }
  } catch (error) {
    console.error(error);
    console.log("Final error");
    res.sendStatus(401);
  }
};

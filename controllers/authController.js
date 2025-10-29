const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register user
exports.register = (req, res) => {
  const body = req.body;

  // Hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json({ message: "Error generating salt", error: err });

    bcrypt.hash(body.password, salt, (err, hash) => {
      if (err) return res.status(500).json({ message: "Error hashing password", error: err });

      body.password = hash;

      User.create(body)
        .then((data) => {
          res.status(201).json({ message: "User registered successfully", data });
        })
        .catch((err) => {
          res.status(500).json({ message: "Error registering user", error: err });
        });
    });
  });
};

// ✅ Login user


exports.login = (req, res) => {
  const usercred = req.body;

  User.findOne({ email: usercred.email })
    .then((user) => {
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      bcrypt.compare(usercred.password, user.password, (err, result) => {
        if (err) return res.status(500).json({ message: "Error comparing password", error: err });

        if (result) {
          // ✅ Generate token
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secretkey", // use a strong secret in production
            { expiresIn: "1h" }
          );

          res.json({ message: "Login successful", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      });
    })
    .catch((err) => res.status(500).json({ message: "Error logging in", error: err }));
};

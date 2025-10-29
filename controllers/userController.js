const path = require('path');
const User = require("../models/usermodel");
// Resolve validation schema relative to project root so it works both locally and on Render/Vercel
const userValidationSchema = require(path.join(process.cwd(), 'Validations', 'UserValidation'));

// ✅ Get all users
exports.getAllUsers = (req, res) => {
  User.find({})
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).json({ message: "Error fetching users", error: err }));
};

// ✅ Add new user
exports.addUser = async (req, res) => {
  const body = req.body;

  try 
  {
    const validatedData = await userValidationSchema.validateAsync(body, { abortEarly: false, presence: 'required' });
    const doc = await User.create(validatedData);
    return res.status(201).json({ message: "User added successfully", user: doc });

  } 
  catch (err) 
  {
    if (err && err.isJoi) {
      return res.status(400).json({ message: "Validation error", errors: err.details.map(d => d.message) });
    }
    return res.status(500).json({ message: "Error adding user", error: err });
  }
};

// ✅ Delete user by ID
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Error deleting user", error: err }));
};

// ✅ Update user by ID
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const validatedData = await userValidationSchema.validateAsync(body, { abortEarly: false, presence: 'optional' });
    const result = await User.updateOne({ _id: id }, validatedData);
    const matched = result.matchedCount ?? result.n ?? (result.ok ? 1 : 0);

    if (!matched) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    if (err && err.isJoi) {
      return res.status(400).json({ message: "Validation error", errors: err.details.map(d => d.message) });
    }
    return res.status(500).json({ message: "Error updating user", error: err });
  }
};

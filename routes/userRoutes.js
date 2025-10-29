const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;

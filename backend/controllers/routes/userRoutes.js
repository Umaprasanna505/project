const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  allUsers
} = require("../controllers/usercontrollers");

// register
router.post("/", registerUser);

// login
router.post("/login", authUser);

// search users
router.get("/", allUsers);

module.exports = router;

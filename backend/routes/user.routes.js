const express = require("express");
const router = express.Router();
const restrictDemo = require("../middleware/restrict.middleware");
const userController = require("../controllers/user.controller");

router.get("/", userController.getUsers);

router.post("/", restrictDemo, userController.createUser);

router.get("/:id", userController.getUserById);

router.put("/:id", restrictDemo, userController.updateUser);

router.delete("/:id", restrictDemo, userController.deleteUser);

module.exports = router;

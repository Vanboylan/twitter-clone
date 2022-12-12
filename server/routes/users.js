const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");
router.post("/", UsersController.Create);
router.get("/new", UsersController.New);

router.get("/index", UsersController.ViewMyProfile);
router.get("/:id", UsersController.ViewProfile);
router.post("/:id", UsersController.Follow);
/*
router.get("/followers", UsersController.ViewFollowers);
router.get("/following", UsersControllers.ViewFollowing);

router.post("/block/:id", UsersController.Block);
router.post("/unblock/:id", UsersController.Unblock);
router.get("/settings", UsersController.ViewSettings);
router.post("/settings", UsersController.UpdateSettings);
*/

module.exports = router;

const express=require("express");
const { accessChat, fetchChat, createGroupChat, renameGroupChat, addUserToGroup, removeUserFromGroup } = require("../controllers/chatControllers");
const {protect}=require("../middleware/authMiddleware");

const router=express.Router();

router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChat)
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroupChat)
router.route("/adduser").put(protect,addUserToGroup)
router.route("/removeuser").put(protect,removeUserFromGroup)

module.exports=router;
const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create);

router.route("/:tableId").get(controller.read);

router.route("/:tableId/seat").put(controller.seat).delete(controller.endSeat);

module.exports = router;

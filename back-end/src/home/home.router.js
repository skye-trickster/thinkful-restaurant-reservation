/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();

router.route("/").get(controller.list);

module.exports = router;

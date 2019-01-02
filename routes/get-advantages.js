const express = require("express");
const AdvantagesCoordinator = require("../server-classes/advantages-coordinator");

const router = express.Router();

router.get("/", (req, res) => {
	res.send(AdvantagesCoordinator.getAdvantages());
});


module.exports = router;

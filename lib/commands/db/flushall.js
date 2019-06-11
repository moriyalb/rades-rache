"use strict"

const Util = require("../../util")

module.exports = async function() {
	await this.rave.deleteAll("rache")
}
"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	let v = await this.pttl(key)
	return v > 0 ? parseInt(v / 1000) : v
}
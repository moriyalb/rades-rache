"use strict"

const Util = require("../../util")

module.exports = async function(key, time) {
	return await this.pexpire(key, time * 1000)
}
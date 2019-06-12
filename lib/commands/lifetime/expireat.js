"use strict"

const Util = require("../../util")

module.exports = async function(key, timestamp) {	
	return await this.pexpireat(key, timestamp * 1000)
}
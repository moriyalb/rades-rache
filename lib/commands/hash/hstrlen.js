"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, key) {
	let v = await this.hget(topkey, key)
	return !!v ? v.length : 0
}
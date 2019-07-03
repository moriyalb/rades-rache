"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(key, delta) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:incrby> ERR invalid key.`)
	}
	if (!Util.isValidNumberValue(delta)) {
		throw new Error(`<rache:string:incrby> ERR invalid delta.`)
	}

	return await this.incrby(key, -delta)
}
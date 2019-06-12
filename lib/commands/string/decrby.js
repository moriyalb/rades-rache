"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(key, delta) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:incrby> error:: invalid key.`)
	}
	if (!Util.isValidValue(delta)) {
		throw new Error(`<rache:string:incrby> error:: invalid delta.`)
	}

	return await this.incrby(key, -delta)
}
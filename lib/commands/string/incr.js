"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:incr> error:: invalid key.`)
	}

	return await this.incrby(key, 1)
}
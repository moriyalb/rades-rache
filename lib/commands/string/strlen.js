"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(key, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:strlen> ERR invalid key.`)
	}

	let data = await this.get(key)
	
	return !!data ? data.length : 0
}
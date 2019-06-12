"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:type> error:: invalid key.`)		
	}
	let data = await this._rawGet(key)
	return data.type
}
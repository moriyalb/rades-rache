"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:exists> error:: invalid key.`)		
	}
	let data = await this._rawGet(key)
	return !!data ? 1 : 0
}
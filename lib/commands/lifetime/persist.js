"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:persist> error:: invalid key.`)
	}

	this._clearTimerByKey(key)

	let data = await this._rawGet(key)
	if (!data){
		return 0
	}	
	if (!data.expire) {
		return 0
	}

	await this._rawSet(key, {expire: null})

	return 1
}
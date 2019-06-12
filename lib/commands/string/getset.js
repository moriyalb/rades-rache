"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:getset> error:: invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:getset> error:: invalid value.`)
	}

	let data = await this.get(key)
	
	this._clearTimerByKey(key)

	await this._rawSet(key, {expire: null, data: value.toString(), type: Define.RACHE_TYPE.STRING})
	
	return data
}
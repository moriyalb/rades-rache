"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:append> ERR invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:append> ERR invalid value.`)
	}

	let data = await this.get(key)

	if (!data) data = value
	else data = `${data}${value}`

	await this._rawSet(key, {data, type: Define.RACHE_TYPE.STRING})
	
	return data.length
}
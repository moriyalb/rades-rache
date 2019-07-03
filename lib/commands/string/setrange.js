"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require('ramda')

module.exports = async function(key, offset, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:setrage> ERR invalid key.`)
	}
	if (offset < 0 || !_.isSafeInteger(offset)){
		throw new Error(`<rache:string:setrage> ERR invalid offset.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:setrage> ERR invalid value.`)
	}

	let data = await this.get(key)

	if (!data) {
		data = ""
	}

	if (offset > data.length) {
		offset -= data.length
		data = `${data}${R.repeat("\x00", offset).join("")}${value}`
	}else{
		data = `${data.substr(0, offset)}${value}${data.substr(value.length + offset, data.length - value.length - offset)}`
	}

	await this._rawSet(key, {data, type: Define.RACHE_TYPE.STRING})
	
	return data.length
}
"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, before, pivot, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:linsert> ERR invalid key.`)
	}
	before = before.toString().toLowerCase()
	if (before != 'before' && before != "after") {
		throw new Error(`<rache:list:linsert> ERR invalid before.`)
	}
	before = before == "before" ? true: false
	if (!Util.isValidValue(pivot)) {
		throw new Error(`<rache:list:linsert> ERR invalid pivot.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:list:linsert> ERR invalid value.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		return 0
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:linsert> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	pivot = pivot.toString()
	value = value.toString()
	for (let i = 0; i < data.length; ++i){
		if (data[i] === pivot){
			let offset = before ? 0 : 1
			data.splice(i + offset, 0, value)

			await this._rawSet(key, {data, type: Define.RACHE_TYPE.LIST})
			
			return data.length
		}
	}
	
	return -1
}
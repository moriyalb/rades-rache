"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, index, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:lset> ERR invalid key.`)
	}
	if (!Util.isValidIntValue(index)) {
		throw new Error(`<rache:list:lset> ERR invalid index.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:list:lset> ERR invalid value.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		throw new Error(`<rache:list:lset> ERR no such key.`)
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:lset> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	if (index < 0){
		index = data.length + index
	}
	if (index < 0 || index > data.length - 1){
		throw new Error(`<rache:list:lset> ERR index out of range.`)
	}
	
	data[index] = value.toString()
	
	await this._rawSet(key, {data, type: Define.RACHE_TYPE.LIST})

	return "OK"
}
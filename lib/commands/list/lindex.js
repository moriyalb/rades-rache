"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, index) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:lindex> ERR invalid key.`)
	}
	if (!Util.isValidIntValue(index)) {
		throw new Error(`<rache:list:lindex> ERR invalid index.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		result = {data:[]}
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:lindex> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	if (index < 0){
		index = data.length + index
	}
	if (index < 0 || index > data.length - 1) return null
	
	return data[index]
}
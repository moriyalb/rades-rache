"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, start, end) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:lrange> ERR invalid key.`)
	}
	if (!Util.isValidIntValue(start)) {
		throw new Error(`<rache:list:lrange> ERR invalid start.`)
	}
	if (!Util.isValidIntValue(end)) {
		throw new Error(`<rache:list:lrange> ERR invalid end.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		result = {data:[]}
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:lrange> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	if (end == -1) end = data.length - 1 //Contains the last one.

	return _.slice(data, start, end + 1)
}
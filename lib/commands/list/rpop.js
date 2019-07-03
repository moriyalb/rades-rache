"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key) {	
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:rpop> ERR invalid key.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		return null
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:rpop> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	if (data.length == 0){
		return null
	}

	let v = data.pop()

	await this._rawSet(key, {data, type: Define.RACHE_TYPE.LIST})
	
	return v
}
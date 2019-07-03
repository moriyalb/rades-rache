"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:llen> ERR invalid key.`)
	}

	let result = await this._rawGet(key)
	if (!result){
		return 0
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:llen> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
		
	return data.length
}
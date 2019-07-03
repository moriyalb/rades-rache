"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, key) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hget> ERR invalid top key.`)
	}
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:hash:hget> ERR invalid key.`)
	}

	let result = await this._rawGet(topkey)
	
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hget> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		return null
	}

	let {data} = result

	return data[key] || null
}
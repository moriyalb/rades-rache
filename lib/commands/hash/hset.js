"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, key, value) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hset> error:: invalid top key.`)
	}
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:hash:hset> error:: invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:hash:hset> error:: invalid value.`)
	}

	let result = await this._rawGet(topkey)
	let code = 1
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hset> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		result = {data:{}}
	}
	let {data} = result
	if (!!data[key]) code = 0
	data[key] = value.toString()
	
	await this._rawSet(topkey, {data, type: Define.RACHE_TYPE.HASH})

	return code
}
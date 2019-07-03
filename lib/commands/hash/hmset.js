"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(topkey, ...kvs) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hmset> ERR invalid top key.`)
	}
	if (kvs.length == 0){
		throw new Error(`<rache:hash:hmset> ERR wrong number of arguments for 'hmget' command.`)		
	}
	
	let result = await this._rawGet(topkey)
	
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hmset> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		result = {data:{}}
	}

	let {data} = result
	if (!data){
		data = {}
	}

	for (let [k, v] of R.splitEvery(2, kvs)){
		if (!Util.isValidKey(k)){
			throw new Error(`<rache:hash:hmset> ERR invalid key.`)
		}
		if (!Util.isValidValue(v)){
			throw new Error(`<rache:hash:hmset> ERR invalid key.`)
		}
		data[k] = v.toString()
	}

	await this._rawSet(topkey, {data, type: Define.RACHE_TYPE.HASH})

	return "OK"
}
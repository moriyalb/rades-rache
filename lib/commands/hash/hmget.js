"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, ...keys) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hmget> ERR invalid top key.`)
	}
	if (keys.length == 0){
		throw new Error(`<rache:hash:hmget> ERR wrong number of arguments for 'hmget' command.`)		
	}
	
	let result = await this._rawGet(topkey)
	
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hmget> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		return _.repeat(keys.length, _.constant(null))
	}

	let {data} = result
	if (!data){
		return _.repeat(keys.length, _.constant(null))
	}

	let results = []
	for (let key of keys){
		if (!Util.isValidKey(key)){
			throw new Error(`<rache:hash:hmget> ERR invalid key.`)
		}
		results.push(data[key] || null)
	}

	return results
}
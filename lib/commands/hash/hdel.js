"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, ...keys) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hdel> ERR invalid top key.`)
	}
	if (keys.length == 0){
		throw new Error(`<rache:hash:hdel> ERR wrong number of arguments for 'hdel' command.`)
	}

	let result = await this._rawGet(topkey)
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hdel> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		return 0
	}

	let {data} = result

	let delCount = 0
	for (let key of keys){
		if (!Util.isValidKey(key)){
			throw new Error(`<rache:hash:hdel> ERR invalid key.`)
		}
		if (!!data[key]){
			delete data[key]
			delCount++
		}
	}
	
	if (delCount > 0){
		await this._rawSet(topkey, {data, type: Define.RACHE_TYPE.HASH})
	}
	
	return delCount
}
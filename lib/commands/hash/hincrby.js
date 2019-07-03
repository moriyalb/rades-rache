"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey, key, value) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hincrby> ERR invalid top key.`)
	}
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:hash:hincrby> ERR invalid key.`)
	}
	if (!Util.isValidNumberValue(value)) {
		throw new Error(`<rache:hash:hincrby> ERR invalid value.`)
	}

	let result = await this._rawGet(topkey)
	
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hincrby> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		result = {data:{
			key: 0
		}}
	}
	
	let {data} = result
	
	if (!data[key]){
		data[key] = `${value}`
	}else{
		let v = parseInt(data[key])
		if (isNaN(v)){
			throw new Error(`<rache:hash:incrby> ERR ERR value is not an integer or out of range`)
		}
		data[key] = `${v + value}`
	}
	
	await this._rawSet(topkey, {data, type: Define.RACHE_TYPE.HASH})

	return data[key]
}
"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key, delta) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:incrByFloat> ERR invalid key.`)
	}
	if (!Util.isValidValue(delta)) {
		throw new Error(`<rache:string:incrByFloat> ERR invalid delta.`)
	}

	let data = await this.get(key)
	if (!data){
		data = `${delta}`
	}else{
		data = parseFloat(data)
		if (isNaN(data)){
			throw new Error(`<rache:string:incrByFloat> ERR ERR value is not a valid float.`)
		}
		data = `${data + delta}`
	}
		
	await this._rawSet(key, {data, type: Define.RACHE_TYPE.STRING})
	
	return data
}
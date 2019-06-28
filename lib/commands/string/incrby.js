"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key, delta) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:incrby> error:: invalid key.`)
	}
	if (!Util.isValidNumberValue(delta)) {
		throw new Error(`<rache:string:incrby> error:: invalid delta.`)
	}

	let data = await this.get(key)
	if (!data){
		data = `${delta}`
	}else{
		data = parseInt(data)
		if (isNaN(data)){
			throw new Error(`<rache:string:incrby> error:: ERR value is not an integer or out of range`)
		}
		data = `${data + delta}`
	}
		
	await this._rawSet(key, {data, type: Define.RACHE_TYPE.STRING})
	
	return data
}
"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:get> ERR invalid key.`)
	}

	let result = await this._rawGet(key)

	if (!result) return null

	let {data, expire, type} = result
	
	if (type != Define.RACHE_TYPE.STRING){
		throw new Error(`<rache:string:get> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	if (!!expire){
		if (expire <= Util.imnow()) {
			await this._rawDelete(key)
			return null
		}
			
		if (!this.ttlTimers.has(key)){
			this._addExpireTimer(key, expire - Util.imnow())
		}
	}
	
	return data
}
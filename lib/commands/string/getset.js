"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(key, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:getset> ERR invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:getset> ERR invalid value.`)
	}

	let result = await this._rawGet(key)

	if (!!result){
		if (result.type != Define.RACHE_TYPE.STRING){
			throw new Error(`<rache:string:getset> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		result = {data: null}
	}
	
	this._clearTimerByKey(key)

	let {data} = result

	await this._rawSet(key, {expire: null, data: value.toString(), type: Define.RACHE_TYPE.STRING})
	
	return data
}
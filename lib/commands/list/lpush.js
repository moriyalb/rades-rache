"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, ...values) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:lpush> error:: invalid key.`)
	}
	if (!Util.isValidListValue(values)) {
		throw new Error(`<rache:string:lpush> error:: invalid values.`)
	}
	
	this._clearTimerByKey(key)

	let data = await this._rawGet(key)
	if (!data){
		data = []
	}else if (!_.isArray(data)){
		throw new Error(`<rache:string:lpush> error:: ERR Operation against a key holding the wrong kind of value.`)
	}

	data = R.concat(values.reverse(), data)

	await this._rawSet(key, {expire: null, data, type: Define.RACHE_TYPE.LIST})
	
	return data
}
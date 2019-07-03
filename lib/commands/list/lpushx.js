"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, ...values) {	
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:lpushx> ERR invalid key.`)
	}
	if (!Util.isValidListValue(values)) {
		throw new Error(`<rache:list:lpushx> ERR invalid values.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		return 0
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:lpushx> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	data = R.concat(R.map(_.toString, values.reverse()), data)

	await this._rawSet(key, {data, type: Define.RACHE_TYPE.LIST})
	
	return data.length
}
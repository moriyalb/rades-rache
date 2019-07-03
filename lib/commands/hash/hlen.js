"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

module.exports = async function(topkey) {
	if (!Util.isValidKey(topkey)){
		throw new Error(`<rache:hash:hlen> ERR invalid top key.`)
	}

	let result = await this._rawGet(topkey)
	
	if (!!result){
		if (result.type != Define.RACHE_TYPE.HASH){
			throw new Error(`<rache:hash:hget> WRONGTYPE Operation against a key holding the wrong kind of value.`)
		}
	}else{
		result = {data:{}}
	}

	let {data} = result

	return _.size(data)
}
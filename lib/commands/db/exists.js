"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:db:exists> ERR invalid key.`)		
	}
	let result = await this._rawGet(key)
	if (!result) return 0
	
	let {data} = result
	
	if (_.isNil(data)){
		return 0
	}else if (_.isArray(data)){
		return data.length > 0 ? 1 : 0
	}else if (_.isObject(data)){
		return _.isEmpty(data) ? 0 : 1
	}
	
	return 1
}
"use strict"

const Util = require("../../util")
const _ = require("lodash")

module.exports = async function(...keys) {
	let result = []
	for (let key of keys){
		if (!Util.isValidKey(key)){
			throw new Error(`<rache:string:mget> ERR invalid key.`)
		}

		result.push(await this.get(key))
	}
	
	return result
}
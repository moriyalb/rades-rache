"use strict"

const Util = require("../../util")
const _ = require("lodash")
const R = require('ramda')

/**
 * redis `getrange` will always returns string, even the given key is not exists.
 * but rache will return null(or throw error) if the given key is not exists(or not a valid string value).
 */
module.exports = async function(key, start, end) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:getrange> ERR invalid key.`)
	}
	if (!_.isSafeInteger(start)){
		throw new Error(`<rache:string:getrange> ERR Invalid arguments for 'getrange' command.`)
	}
	if (!_.isSafeInteger(end)){
		throw new Error(`<rache:string:getrange> ERR Invalid arguments for 'getrange' command.`)
	}

	let data = await this.get(key)

	if (!data) {
		return null
	}

	start = start < 0 ? data.length + start : start
	start = start < 0 ? 0 : start
	end = end < 0 ? data.length + end : end
	end = end < 0 ? 0 : end

	return data.substr(start, end - start + 1)
}
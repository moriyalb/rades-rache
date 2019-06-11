"use strict"

const Util = require("../../util")

module.exports = async function(key, value) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:set> error:: invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:set> error:: invalid value.`)
	}
	await this.rave.insert("rache", ["key"], [{
		data: value.toString(),
		key
	}])

	return "OK"
}
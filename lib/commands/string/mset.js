"use strict"

const Util = require("../../util")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(...kvs) {
	for (let [key, value] of R.splitEvery(2, kvs)){
		if (!Util.isValidKey(key)){
			throw new Error(`<rache:string:mset> error:: invalid key.`)
		}
		if (!Util.isValidValue(value)) {
			throw new Error(`<rache:string:mset> error:: invalid value.`)
		}

		await this.set(key, value)
	}

	return "OK"
}
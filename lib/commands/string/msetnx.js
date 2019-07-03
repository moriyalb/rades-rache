"use strict"

const Util = require("../../util")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(...kvs) {
	let toSet = R.splitEvery(2, kvs)
	for (let [key, value] of toSet){
		if (!Util.isValidKey(key)){
			throw new Error(`<rache:string:mset> ERR invalid key.`)
		}
		if (!Util.isValidValue(value)) {
			throw new Error(`<rache:string:mset> ERR invalid value.`)
		}

		let r = await this._rawGet(key)
		if (!!r) {
			return 0
		}
	}

	for (let [key, value] of toSet){
		await this.set(key, value)
	}

	return 1
}
"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:pttl> error:: invalid key.`)
	}

	let data = await this._rawGet(key)

	if (!data) return -2

	if (!data.expire) return -1

	if (data.expire <= Util.imnow()) {
		await this._rawDelete(key)
		return -2
	}

	let time = data.expire - Util.imnow()
	if (!this.ttlTimers.has(key)){
		this._addExpireTimer(key, time)
	}
	
	return time
}
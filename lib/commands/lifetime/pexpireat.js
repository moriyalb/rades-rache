"use strict"

const Util = require("../../util")

module.exports = async function(key, timestamp) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:pexpireat> error:: invalid key.`)
	}

	this._clearTimerByKey(key)

	let data = await this._rawGet(key)
	if (!data){
		return 0
	}

	if (timestamp <= Util.imnow()){
		await this._rawDelete(key)
	}else{
		let expire = timestamp

		this._addExpireTimer(key, expire - Util.imnow())

		await this._rawSet(key, {expire})
	}

	return 1
}
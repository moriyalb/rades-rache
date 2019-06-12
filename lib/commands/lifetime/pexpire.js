"use strict"

const Util = require("../../util")

module.exports = async function(key, time) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:expire> error:: invalid key.`)
	}

	this._clearTimerByKey(key)

	let data = await this._rawGet(key)
	if (!data){
		return 0
	}

	if (time <= 0){
		await this._rawDelete(key)
	}else{
		let expire = Util.imnow() + time

		this._addExpireTimer(key, time)

		await this._rawSet(key, {expire})
	}

	return 1
}
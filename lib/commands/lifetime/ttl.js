"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:ttl> error:: invalid key.`)
	}
	let result = await this.rave.select("rache", [key])
	if (!result || result.length == 0) return -2
	if (!result[0].expire) return -1
	if (result[0].expire <= Util.imnow()) {
		await this.rave.delete("rache", [key])
		return -2
	}

	let time = result[0].expire - Util.imnow()
	if (!this.ttlTimers[key]){
		this.ttlTimers[key] = setTimeout(async ()=>{
			await this.rave.delete("rache", [key])
			delete this.ttlTimers[key]
		}, time)
	}
	return parseInt(time / 1000)
}
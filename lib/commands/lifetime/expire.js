"use strict"

const Util = require("../../util")

module.exports = async function(key, time) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:expire> error:: invalid key.`)
	}

	if (!!this.ttlTimers[key]){
		clearTimeout(this.ttlTimers[key])
		delete this.ttlTimers[key]
	}

	let result = await this.rave.select("rache", [key])
	if (!result || result.length == 0){
		return 0
	}

	if (time <= 0){
		await this.rave.delete("rache", [key])
	}else{
		let expire = (Util.inow() + time) * 1000

		this.ttlTimers[key] = setTimeout(async ()=>{
			await this.rave.delete("rache", [key])
			delete this.ttlTimers[key]
		}, time * 1000)

		await this.rave.insert("rache", ["key"], [{
			expire,
			key
		}])
	}

	return 1
}
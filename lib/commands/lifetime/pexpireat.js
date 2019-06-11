"use strict"

const Util = require("../../util")

module.exports = async function(key, timestamp) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:pexpireat> error:: invalid key.`)
	}

	if (!!this.ttlTimers[key]){
		clearTimeout(this.ttlTimers[key])
		delete this.ttlTimers[key]
	}

	let result = await this.rave.select("rache", [key])
	if (!result || result.length == 0){
		return 0
	}

	if (timestamp <= Util.imnow()){
		await this.rave.delete("rache", [key])
	}else{
		let expire = timestamp

		this.ttlTimers[key] = setTimeout(async ()=>{
			await this.rave.delete("rache", [key])
			delete this.ttlTimers[key]
		}, timestamp - Util.imnow())

		await this.rave.insert("rache", ["key"], [{
			expire,
			key
		}])
	}

	return 1
}
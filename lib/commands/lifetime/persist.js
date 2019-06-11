"use strict"

const Util = require("../../util")

module.exports = async function(key, time) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:lifetime:expire> error:: invalid key.`)
	}

	if (!!this.ttlTimers[key]){
		clearTimeout(this.ttlTimers[key])
	}

	let result = await this.rave.select("rache", [key])
	if (!result || result.length == 0){
		return 0
	}
	let data = result[0]
	if (!data.expire) {
		return 0
	}

	await this.rave.insert("rache", ["key"], [{
		expire: null,
		key
	}])

	return 1
}
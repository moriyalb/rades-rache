"use strict"

const Util = require("../../util")

module.exports = async function(key) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:get> error:: invalid key.`)
	}
	let result = await this.rave.select("rache", [key])
	if (!result || result.length == 0) return null
	if (!!result[0].expire){
		if (result[0].expire <= Util.imnow()) {
			await this.rave.delete("rache", [key])
			return null
		}
			
		if (!this.ttlTimers[key]){
			let time = result[0].expire - Util.imnow()
			this.ttlTimers[key] = setTimeout(async ()=>{
				await this.rave.delete("rache", [key])
				delete this.ttlTimers[key]
			}, time * 1000)
		}
	}	
	
	return result[0].data
}
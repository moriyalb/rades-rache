"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(key, count, value) {	
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:list:lrem> ERR invalid key.`)
	}
	if (!Util.isValidIntValue(count)) {
		throw new Error(`<rache:list:lrem> ERR invalid count.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:list:lrem> ERR invalid value.`)
	}
	
	let result = await this._rawGet(key)
	if (!result){
		return 0
	}else if (result.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:lrem> WRONGTYPE Operation against a key holding the wrong kind of value.`)
	}

	let {data} = result
	let delCount = 0
	if (count >= 0){
		let index = 0		
		while (index < data.length){
			if (count > 0 && delCount >= count){
				break
			}
			if (value.toString() === data[index]){
				delCount++
				data.splice(index, 1)
			}else{
				index++
			}			
		}
	}else{
		let index = data.length - 1
		count = -count
		while (index >= 0){
			if (delCount >= count){
				break
			}
			if (value.toString() === data[index]){
				delCount++
				data.splice(index, 1)
			}else{
				index--
			}			
		}
	}

	await this._rawSet(key, {data, type: Define.RACHE_TYPE.LIST})
	
	return delCount
}
"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")
const R = require("ramda")

module.exports = async function(source, destination) {	
	if (!Util.isValidKey(source)){
		throw new Error(`<rache:list:rpoplpush> ERR invalid source.`)
	}
	if (!Util.isValidKey(destination)){
		throw new Error(`<rache:list:rpoplpush> ERR invalid destination.`)
	}
	
	let src = await this._rawGet(source)
	if (!src){
		return null
	}else if (src.type != Define.RACHE_TYPE.LIST){
		throw new Error(`<rache:list:rpoplpush> WRONGTYPE Operation against a source holding the wrong kind of value.`)
	}

	let {data:src_data} = src
	if (src_data.length == 0){
		return null
	}

	let dest_data
	let isSame
	if (destination != source){
		let dest = await this._rawGet(destination)
		if (!dest){
			dest = {data: []}
		}else if (src.type != Define.RACHE_TYPE.LIST){
			throw new Error(`<rache:list:rpoplpush> WRONGTYPE Operation against a destination holding the wrong kind of value.`)
		}
		;({data:dest_data} = dest)
		isSame = false
	}else{
		isSame = true
	}
		
	let v = src_data.pop()
	if (isSame){
		src_data.unshift(v)
		await this._rawSet(source, {src_data, type: Define.RACHE_TYPE.LIST})
	}else{
		dest_data.unshift(v)
		await this._rawSet(source, {src_data, type: Define.RACHE_TYPE.LIST})
		await this._rawSet(destination, {dest_data, type: Define.RACHE_TYPE.LIST})
	}
	
	return v
}
"use strict"

const Util = require("../../util")
const Define = require("../../define")
const _ = require("lodash")

/**
 * 	`SETNX` 、 `SETEX` and `PSETEX` is not implemented.
 * 	use `SET` method and arguments instead.
 */
module.exports = async function(key, value, ...opts) {
	if (!Util.isValidKey(key)){
		throw new Error(`<rache:string:set> error:: invalid key.`)
	}
	if (!Util.isValidValue(value)) {
		throw new Error(`<rache:string:set> error:: invalid value.`)
	}

	let nx = false
	let xx = false
	let ex = null
	let px = null

	for (let i = 0; i < opts.length; ++i){
		switch(opts[i]) {
			case "nx":
				if (xx) {
					throw new Error(`<rache:string:set> error:: can not set 'xx' and 'nx' together`)
				}
				nx = true
				break
			case "xx":
				if (nx) {
					throw new Error(`<rache:string:set> error:: can not set 'xx' and 'nx' together`)
				}
				xx = true
				break
			case "ex":
				if (px) {
					throw new Error(`<rache:string:set> error:: can not set 'ex' and 'px' together`)
				}
				++i
				ex = parseInt(opts[i])
				if (!ex || !_.isSafeInteger(ex)){
					throw new Error(`<rache:string:set> error:: Invalid 'ex' value`)
				}
				break
			case "ex":
				if (ex) {
					throw new Error(`<rache:string:set> error:: can not set 'ex' and 'px' together`)
				}
				++i
				px = parseInt(opts[i])
				if (!px || !_.isSafeInteger(px)){
					throw new Error(`<rache:string:set> error:: Invalid 'px' value`)
				}
				break
		}
	}

	if (nx || xx){
		let v = await this.get(key)
		if ((nx && v) || (xx && !v)){
			return null
		}
	}

	let expire = null
	if (ex) {
		expire = Util.imnow() + ex * 1000
	}
	if (px) {
		expire = Util.imnow() + px
	}

	this._clearTimerByKey(key)

	if (expire > 0){
		this._addExpireTimer(key, expire - Util.imnow())		
	}
	
	await this._rawSet(key, {expire, data: value.toString(), type: Define.RACHE_TYPE.STRING})

	return "OK"
}
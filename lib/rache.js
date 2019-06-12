
"use strict"

const {Rave} = require("rades-rave")
const os = require("os")
const path = require("path")
const shutil = require("shutil.js")

const DIR_NAME = __dirname.replace(/\\/g, `/`)

/**
 * A lightweight, non-schema, local database simulator
 * 
 * @description 
 * 
 */
class Rache {
	constructor() {
		this.ttlTimers = new Map()
		this._methods = new Set()
	}

	async init(opts = {}) {
		this.rave = new Rave()
		if (!!opts.dbroot) {
			await this.rave.init(opts)
		}else{
			await this.rave.init({
				dbroot: `${os.tmpdir()}${path.sep}.rache`,
				...opts
			})
		}

		for (let [root, dirs, files] of await shutil.walk(`${DIR_NAME}/commands`)) {			
			let rtpath = root.replace(DIR_NAME, ".")
			for (let f of files) {
				let fname = path.basename(f, ".js")
				if (!!this[fname]) {
					console.warn(`<rache:warn> init:: method ${fname} is already exists!`)
				}
				this[fname] = require(`${rtpath}/${fname}`).bind(this)
				this._methods.add(fname)
			}			
		}

		//init table.
		this.rave.insert("rache", ["key"], [])
	}

	async close() {
		await this.rave.close()

		for (let fname of this._methods) {
			delete this[fname]
		}
		
		for (let [name, timer] of this.ttlTimers) {		
			clearTimeout(timer)			
		}
		this.ttlTimers.clear()
	}

	_clearTimerByKey(key) {
		if (this.ttlTimers.has(key)){
			clearTimeout(this.ttlTimers.get(key))
			this.ttlTimers.delete(key)
		}
	}

	_addExpireTimer(key, expire) {
		this.ttlTimers.set(key, setTimeout(async ()=>{
			await this._rawDelete(key)
			this.ttlTimers.delete(key)
		}, expire))
	}

	async _rawDelete(key) {
		await this.rave.delete("rache", [key])
	}

	async _rawGet(key) {
		let [data] = await this.rave.select("rache", [key])
		return !!data ? data : null
	}

	async _rawSet(key, datas) {
		datas.key = key
		await this.rave.insert("rache", ["key"], [datas])
	}
}

module.exports = {
	default: new Rache(),
	Rache,
}
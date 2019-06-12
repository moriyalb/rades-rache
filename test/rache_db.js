"use strict"

require('should')
const Util = require("../lib/util")

describe("db", ()=> {
	it("exists", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.set("m", 1)
		let r = await Rache.exists("m")
		r.should.equal(1)

		r = await Rache.exists("n")
		r.should.equal(0)
		
		await Rache.close()
	})

	it("type", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.set("m", 1)
		let tp = await Rache.type("m")
		tp.should.equal("string")

		await Rache.lpush("n", 1, 2, 3)
		tp = await Rache.type("n")
		tp.should.equal("list")
		
		await Rache.close()
	})
})
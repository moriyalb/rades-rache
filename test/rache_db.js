"use strict"

require('should')
const Util = require("../lib/util")

describe("db", ()=> {
	it("exists", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.set("m", 1)
		;(await Rache.exists("m")).should.equal(1)
		;(await Rache.exists("n")).should.equal(0)
		
		await Rache.close()
	})

	it("type", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.set("ms", 1)
		;(await Rache.type("ms")).should.equal("string")

		await Rache.hset("mh", "hello", 1)
		;(await Rache.type("mh")).should.equal("hash")

		await Rache.lpush("ml", 1, 2, 3)
		;(await Rache.type("ml")).should.equal("list")
		
		await Rache.close()
	})
})
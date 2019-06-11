"use strict"

require('should')

describe("string", ()=> {
	it("basic", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		let v = await Rache.get("mario")
		should(v).be.exactly(null)

		await Rache.set("mario", 101)
		v = await Rache.get("mario")
		v.should.equal("101")

		await Rache.set("mario", "hello")
		v = await Rache.get("mario")
		v.should.equal("hello")
		
		await Rache.close()
	})
})
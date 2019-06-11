"use strict"

require('should')
const Util = require("../lib/util")

describe("lifetime", ()=> {
	it("expire", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		let ttl = await Rache.ttl("mario")
		ttl.should.equal(-2)

		await Rache.expire("mario", 10)
		ttl = await Rache.ttl("mario")
		ttl.should.equal(-2)
		
		await Rache.set("mario", 1)
		ttl = await Rache.ttl("mario")
		ttl.should.equal(-1)

		await Rache.expire("mario", 10)
		ttl = await Rache.ttl("mario")
		ttl.should.aboveOrEqual(9)
		ttl.should.belowOrEqual(10)

		await Rache.expire("mario", -1)
		ttl = await Rache.ttl("mario")
		ttl.should.equal(-2)

		let d = await Rache.get("mario")
		should(d).be.exactly(null)
		
		await Rache.close()
	})

	it("expireat", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.expireat("mario", Util.inow() + 10)
		let ttl = await Rache.ttl("mario")
		ttl.should.equal(-2)

		await Rache.set("mario", 1)

		await Rache.expireat("mario", Util.inow() + 10)
		ttl = await Rache.ttl("mario")
		ttl.should.aboveOrEqual(9)
		ttl.should.belowOrEqual(10)

		await Rache.expireat("mario", Util.inow() - 1)
		ttl = await Rache.ttl("mario")
		ttl.should.equal(-2)

		let d = await Rache.get("mario")
		should(d).be.exactly(null)
		
		await Rache.close()
	})

	it("persist", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init({syncInterval:200})
		await Rache.flushall()
		
		await Rache.set("mario", 1)
		await Rache.expire("mario", 10)
		await Rache.persist("mario")
		let ttl = await Rache.ttl("mario")
		ttl.should.equal(-1)
			
		await Rache.close()
	})
})
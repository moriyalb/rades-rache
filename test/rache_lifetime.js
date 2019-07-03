"use strict"

require('should')
const Util = require("../lib/util")

describe("lifetime", ()=> {
	it("expire", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.ttl("mario")).should.equal(-2)

		await Rache.expire("mario", 10)
		;(await Rache.ttl("mario")).should.equal(-2)
		
		await Rache.set("mario", 1)
		;(await Rache.ttl("mario")).should.equal(-1)

		await Rache.expire("mario", 10)
		;(await Rache.ttl("mario")).should.approximately(10, 1)
		
		await Rache.expire("mario", -1)
		;(await Rache.ttl("mario")).should.equal(-2)
		Rache.get("mario").should.be.fulfilledWith(null)
		
		await Rache.hset("mhash", "key", 1)
		await Rache.expire("mhash", 10)
		;(await Rache.ttl("mhash")).should.approximately(10, 1)
		
		await Rache.close()
	})

	it("expireat", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.expireat("mario", Util.inow() + 10)
		;(await Rache.ttl("mario")).should.equal(-2)

		await Rache.set("mario", 1)
		await Rache.expireat("mario", Util.inow() + 10)
		;(await Rache.ttl("mario")).should.approximately(10, 1)
		
		await Rache.expireat("mario", Util.inow() - 1)
		;(await Rache.ttl("mario")).should.equal(-2)
		Rache.get("mario").should.be.fulfilledWith(null)
		
		await Rache.close()
	})

	it("persist", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init({syncInterval:200})
		await Rache.flushall()
		
		await Rache.set("mario", 1)
		await Rache.expire("mario", 10)
		await Rache.persist("mario")
		;(await Rache.ttl("mario")).should.equal(-1)
			
		await Rache.close()
	})

	it("pexpire", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.pttl("mario")).should.equal(-2)

		await Rache.pexpire("mario", 10000)
		;(await Rache.ttl("mario")).should.equal(-2)
		
		await Rache.set("mario", 1)
		;(await Rache.pttl("mario")).should.equal(-1)

		await Rache.pexpire("mario", 10000)
		;(await Rache.pttl("mario")).should.approximately(10000, 100)
		
		await Rache.pexpire("mario", -1)
		;(await Rache.pttl("mario")).should.equal(-2)

		Rache.get("mario").should.be.fulfilledWith(null)
				
		await Rache.close()
	})

	it("pexpireat", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.pexpireat("mario", Util.imnow() + 10000)
		;(await Rache.pttl("mario")).should.equal(-2)

		await Rache.set("mario", 1)
		await Rache.pexpireat("mario", Util.imnow() + 10000)
		;(await Rache.pttl("mario")).should.approximately(10000, 100)
		
		await Rache.pexpireat("mario", Util.imnow() - 1)
		;(await Rache.pttl("mario")).should.equal(-2)

		Rache.get("mario").should.be.fulfilledWith(null)
		
		await Rache.close()
	})
})
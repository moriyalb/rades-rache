"use strict"

require('should')
const Util = require("../lib/util")
const R = require("ramda")

describe("hash", ()=> {
	it("hset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.hset("m", "k", 1)).should.equal(1)
		;(await Rache.hget("m", "k")).should.equal("1")

		;(await Rache.hset("m", "k", 2)).should.equal(0)
		;(await Rache.hget("m", "k")).should.equal("2")

		await Rache.set("ms", 1)
		Rache.hset("ms", "k", 2).should.be.rejected()
		Rache.hset("m", "k").should.be.rejected()
		Rache.hset("m").should.be.rejected()

		await Rache.close()
	})

	it("hsetnx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.hsetnx("m", "k", 1)).should.equal(1)
		;(await Rache.hget("m", "k")).should.equal("1")

		;(await Rache.hsetnx("m", "k", 2)).should.equal(0)
		;(await Rache.hget("m", "k")).should.equal("1")

		await Rache.set("ms", 1)
		Rache.hsetnx("ms", "k", 2).should.be.rejected()
		Rache.hsetnx("m", "k").should.be.rejected()
		Rache.hsetnx("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hget", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)				
		;(await Rache.hget("m", "k")).should.equal("1")

		Rache.hget("m", "k1").should.be.fulfilledWith(null)
		Rache.hget("m1", "k1").should.be.fulfilledWith(null)
		
		await Rache.set("ms", 1)
		Rache.hget("ms", "k").should.be.rejected()
		Rache.hget("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hexists", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)	
		;(await Rache.hexists("m", "k")).should.equal(1)
		;(await Rache.hexists("m", "k1")).should.equal(0)
		;(await Rache.hexists("m1", "k1")).should.equal(0)

		await Rache.set("ms", 1)
		Rache.hexists("ms", "k").should.be.rejected()
		Rache.hexists("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hlen", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)	
		;(await Rache.hlen("m")).should.equal(1)

		await Rache.hsetnx("m", "x", 2)	
		;(await Rache.hlen("m")).should.equal(2)

		await Rache.set("ms", 1)
		await Rache.hlen("ms").should.be.rejected()
		
		await Rache.close()
	})

	it("hdel", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hmset("m", "k", 1, "k1", 2, "k2", 3)				
		;(await Rache.hdel("m", "k")).should.equal(1)
		;(await Rache.hdel("m", "kx")).should.equal(0)
		;(await Rache.hdel("m", "k1", "kx", "ky")).should.equal(1)
		;(await Rache.hlen("m")).should.equal(1)

		await Rache.hmset("m", "k", 1, "k1", 2)
		;(await Rache.hdel("m", "k", "k1", "k2", "kx", "ky")).should.equal(3)
		;(await Rache.hlen("m")).should.equal(0)
		;(await Rache.exists("m")).should.equal(0)

		await Rache.set("ms", 1)
		Rache.hdel("ms", "k").should.be.rejected()
		Rache.hdel("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hincrby", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hset("m", "k", "cannotuse")
		Rache.hincrby("m", "k", 2).should.be.rejected()

		await Rache.hset("m", "k", 1)
		;(await Rache.hincrby("m", "k", 5)).should.equal("6")
		;(await Rache.hget("m", "k")).should.equal("6")

		;(await Rache.hincrby("m", "k1", 3)).should.equal("3")
		;(await Rache.hget("m", "k1")).should.equal("3")

		;(await Rache.hincrby("m1", "k1", 3)).should.equal("3")
		;(await Rache.hget("m1", "k1")).should.equal("3")

		await Rache.set("ms", 1)
		Rache.hincrby("ms", "k", 2).should.be.rejected()
		Rache.hincrby("ms", "k").should.be.rejected()
		Rache.hincrby("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hmget & hmset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hmset("m", "k", 1, "k1", 2, "k2", 3)
		;(await Rache.hmget("m", "k", "kx", "k1", "ky", "k2")).should.be.deepEqual(["1", null, "2", null, "3"])
		
		Rache.hmset("m").should.be.rejected()
		Rache.hmset("m", "k").should.be.rejected()
		Rache.hmget("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hkeys & hvalues & hgetall", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hmset("m", "k", 1, "k1", 2, "k2", 3)
		;(await Rache.hkeys("m")).sort().should.be.deepEqual(["k", "k1", "k2"])
		;(await Rache.hvals("m")).sort().should.be.deepEqual(["1", "2", "3"])
		;(await Rache.hgetall("m")).should.be.deepEqual(R.flatten(R.zip(
			await Rache.hkeys("m"), await Rache.hvals("m")
		)))

		await Rache.set("ms", 1)
		Rache.hkeys("ms").should.be.rejected()
		Rache.hvals("ms").should.be.rejected()
		Rache.hgetall("ms").should.be.rejected()
			
		await Rache.close()
	})

})
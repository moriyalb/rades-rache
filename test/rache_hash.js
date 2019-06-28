"use strict"

require('should')
const Util = require("../lib/util")

describe("hash", ()=> {
	it("hset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		let r = await Rache.hset("m", "k", 1)
		r.should.equal(1)
		let v = await Rache.hget("m", "k")
		v.should.equal("1")

		r = await Rache.hset("m", "k", 2)
		r.should.equal(0)
		v = await Rache.hget("m", "k")
		v.should.equal("2")

		await Rache.set("ms", 1)
		await Rache.hset("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hsetnx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		let r = await Rache.hsetnx("m", "k", 1)		
		r.should.equal(1)
		let v = await Rache.hget("m", "k")
		v.should.equal("1")

		r = await Rache.hsetnx("m", "k", 2)
		r.should.equal(0)
		v = await Rache.hget("m", "k")
		v.should.equal("1")

		await Rache.set("ms", 1)
		await Rache.hsetnx("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hget", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)				
		let v = await Rache.hget("m", "k")
		v.should.equal("1")

		v = await Rache.hget("m", "k1")
		should(v).be.exactly(null)

		v = await Rache.hget("m1", "k1")
		should(v).be.exactly(null)

		await Rache.set("ms", 1)
		await Rache.hsetnx("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hexists", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)	
		let v = await Rache.hexists("m", "k")
		v.should.equal(1)

		v = await Rache.hexists("m", "k1")
		v.should.equal(0)

		v = await Rache.hexists("m1", "k1")
		v.should.equal(0)

		await Rache.set("ms", 1)
		await Rache.hexists("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hlen", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hsetnx("m", "k", 1)	
		let v = await Rache.hlen("m")
		v.should.equal(1)

		await Rache.hsetnx("m", "x", 2)	
		v = await Rache.hlen("m")
		v.should.equal(2)

		v = await Rache.hexists("m", "k1")
		v.should.equal(0)

		v = await Rache.hexists("m1", "k1")
		v.should.equal(0)

		await Rache.set("ms", 1)
		await Rache.hexists("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hdel", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hset("m", "k", 1)				
		await Rache.hset("m", "k1", 1)				
		await Rache.hset("m", "k2", 1)
		let v = await Rache.hdel("m", "k")
		v.should.equal(1)

		v = await Rache.hdel("m", "kx")
		v.should.equal(0)

		v = await Rache.hdel("m", "k1", "kx", "ky")
		v.should.equal(1)

		v = await Rache.hlen("m")
		v.should.equal(1)

		await Rache.hset("m", "k", 1)
		await Rache.hset("m", "k1", 1)

		v = await Rache.hdel("m", "k", "k1", "k2", "kx", "ky")
		v.should.equal(3)
		v = await Rache.hlen("m")
		v.should.equal(0)
		v = await Rache.exists("m")
		v.should.equal(0)

		await Rache.set("ms", 1)
		await Rache.hdel("ms", "k").should.be.rejected()
		
		await Rache.close()
	})

	it("hincrby", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hset("m", "k", "cannotuse")
		await Rache.hincrby("m", "k", 2).should.be.rejected()

		await Rache.hset("m", "k", 1)
		let r = await Rache.hincrby("m", "k", 5)
		r.should.equal("6")
		let v = await Rache.hget("m", "k")
		r.should.equal("6")

		r = await Rache.hincrby("m", "k1", 3)
		r.should.equal("3")
		v = await Rache.hget("m", "k1")
		r.should.equal("3")

		r = await Rache.hincrby("m1", "k1", 3)
		r.should.equal("3")
		v = await Rache.hget("m1", "k1")
		r.should.equal("3")

		await Rache.set("ms", 1)
		await Rache.hincrby("ms", "k", 2).should.be.rejected()
		
		await Rache.close()
	})

	it("hmget", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hset("m", "k", 1)
		await Rache.hset("m", "k1", 2)
		await Rache.hset("m", "k2", 3)
		let v = await Rache.hmget("m", "k", "kx", "k1", "ky", "k2")
		v.length.should.equal(5)
		v[0].should.equal("1")
		should(v[1]).be.exactly(null)
		v[2].should.equal("2")
		should(v[3]).be.exactly(null)
		v[4].should.equal("3")

		await Rache.hmget("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hmset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hmset("m", "k", 1, "k1", 2, "k2", 3)
		let v = await Rache.hmget("m", "k", "kx", "k1", "ky", "k2")
		v.length.should.equal(5)
		v[0].should.equal("1")
		should(v[1]).be.exactly(null)
		v[2].should.equal("2")
		should(v[3]).be.exactly(null)
		v[4].should.equal("3")

		await Rache.hmget("m").should.be.rejected()
		
		await Rache.close()
	})

	it("hkeys & hvalues & hgetall", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.hmset("m", "k", 1, "k1", 2, "k2", 3)
		let v = await Rache.hkeys("m")
		v.should.be.deepEqual(["k", "k1", "k2"])

		v = await Rache.hvals("m")
		v.should.be.deepEqual(["1", "2", "3"])

		v = await Rache.hgetall("m")
		v.should.be.deepEqual(["k", "1", "k1", "2", "k2", "3"])
			
		await Rache.close()
	})

})
"use strict"

require('should')

describe("string", ()=> {
	it("get & set", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		Rache.get("mario").should.be.fulfilledWith(null)

		await Rache.set("mario", 101)
		;(await Rache.get("mario")).should.equal("101")

		await Rache.set("mario", "hello")
		;(await Rache.get("mario")).should.equal("hello")

		await Rache.lpush("ml", 1, 2, 3)
		Rache.get("ml").should.be.rejected()

		await Rache.hset("mh", "key", "value")
		Rache.set("mh", 2).should.be.fulfilledWith("OK")
		
		await Rache.close()
	})

	it("set with nx & xx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "good")
		;(await Rache.get("m")).should.equal("good")

		await Rache.set("m", "not-set", "nx")
		;(await Rache.get("m")).should.equal("good")

		await Rache.set("m", "set", "xx")
		;(await Rache.get("m")).should.equal("set")

		await Rache.set("n", "not-set", "xx")
		Rache.get("n").should.be.fulfilledWith(null)
		
		await Rache.set("n", "set", "nx")
		;(await Rache.get("n")).should.equal("set")

		Rache.set("n", "set", "nx", "xx").should.be.rejected()
		Rache.set("n", "set", "xx", "nx").should.be.rejected()

		await Rache.close()
	})

	it("set with ex & px", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "value", "ex", 3)
		;(await Rache.get("m")).should.equal("value")

		;(await Rache.ttl("m")).should.approximately(3, 1)

		await Rache.set("m", "value1", "px", 5000)
		;(await Rache.get("m")).should.equal("value1")

		;(await Rache.pttl("m")).should.approximately(5000, 100)
		
		await Rache.close()
	})

	it("getset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello")
		await Rache.expire("m", 1000)
		
		;(await Rache.getset("m", "world")).should.equal("hello")
		;(await Rache.get("m")).should.equal("world")
		;(await Rache.ttl("m")).should.equal(-1)

		let r = await Rache.getset("mario", "world")
		should(r).be.exactly(null)
		;(await Rache.get("mario")).should.equal("world")

		await Rache.lpush("ml", 1, 2, 3)
		Rache.getset("ml", 5).should.be.rejected()
		Rache.getset("m").should.be.rejected()
				
		await Rache.close()
	})

	it("strlen", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello")
		;(await Rache.strlen("m")).should.equal(5)

		;(await Rache.strlen("mario")).should.equal(0)

		await Rache.lpush("ml", 1, 2, 3)
		Rache.strlen("ml").should.be.rejected()
				
		await Rache.close()
	})

	it("append", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		;(await Rache.append("m", "hello")).should.equal(5)
		;(await Rache.append("m", " world")).should.equal(11)

		await Rache.expire("m", 10)
		;(await Rache.ttl("m")).should.approximately(10, 1)
		;(await Rache.append("m", "gaga")).should.equal(15)
		;(await Rache.ttl("m")).should.approximately(10, 1)

		await Rache.lpush("ml", 1, 2, 3)
		Rache.append("ml", 1).should.be.rejected()
		Rache.append("m").should.be.rejected()
				
		await Rache.close()
	})

	it("setrange", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		;(await Rache.setrange("m", 0, "hello")).should.equal(5)
		;(await Rache.get("m")).should.equal("hello")

		;(await Rache.setrange("n", 4, "hello")).should.equal(9)
		;(await Rache.get("n")).should.equal("\x00\x00\x00\x00hello")

		;(await Rache.setrange("m", 2, "ww")).should.equal(5)
		;(await Rache.get("m")).should.equal("hewwo")

		;(await Rache.setrange("m", 4, "qxy")).should.equal(7)
		;(await Rache.get("m")).should.equal("hewwqxy")

		;(await Rache.setrange("m", 10, "haha")).should.equal(14)
		;(await Rache.get("m")).should.equal("hewwqxy\x00\x00\x00haha")

		await Rache.lpush("ml", 1, 2, 3)
		Rache.setrange("ml", 0, "a").should.be.rejected()
		Rache.setrange("m", 0).should.be.rejected()
		Rache.setrange("m").should.be.rejected()
				
		await Rache.close()
	})

	it("getrange", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello rades-cache")

		;(await Rache.getrange("m", 0, 4)).should.equal("hello")
		;(await Rache.getrange("m", -5, -1)).should.equal("cache")
		;(await Rache.getrange("m", 6, -7)).should.equal("rades")
		;(await Rache.getrange("m", -100, 2)).should.equal("hel")
		;(await Rache.getrange("m", -3, 100)).should.equal("che")		

		await Rache.lpush("ml", 1, 2, 3)
		await Rache.getrange("ml", 0, 0).should.be.rejected()
		Rache.getrange("m").should.be.rejected()
		Rache.getrange("m", 0).should.be.rejected()
		Rache.getrange("m", 0, 'b').should.be.rejected()
		Rache.getrange("m", 'a', 2).should.be.rejected()

		await Rache.close()
	})

	it("incr & decr", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)
		;(await Rache.incr("m")).should.equal("51")
		;(await Rache.get("m")).should.equal("51")
		;(await Rache.decr("m")).should.equal("50")
		;(await Rache.get("m")).should.equal("50")

		;(await Rache.incr("n")).should.equal("1")
		;(await Rache.get("n")).should.equal("1")
		;(await Rache.decr("q")).should.equal("-1")
		;(await Rache.get("q")).should.equal("-1")

		await Rache.set("m", "hello")
		Rache.incr("m").should.be.rejected()
		Rache.decr("m").should.be.rejected()
		await Rache.lpush("ml", 1, 2)
		Rache.incr("ml").should.be.rejected()
		Rache.decr("ml").should.be.rejected()

		await Rache.close()
	})

	it("incrby & decrby", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)

		;(await Rache.incrby("m", 20)).should.equal("70")
		;(await Rache.get("m")).should.equal("70")
		;(await Rache.decrby("m", 20)).should.equal("50")
		;(await Rache.get("m")).should.equal("50")

		;(await Rache.incrby("n", -10)).should.equal("-10")
		;(await Rache.get("n")).should.equal("-10")
		;(await Rache.decrby("q", -10)).should.equal("10")
		;(await Rache.get("q")).should.equal("10")

		await Rache.set("ms", "hello")
		Rache.incrby("ms", 10).should.be.rejected()
		Rache.decrby("ms", 10).should.be.rejected()
		await Rache.lpush("ml", 1, 2)
		Rache.incrby("ml", 10).should.be.rejected()
		Rache.decrby("ml", 10).should.be.rejected()

		Rache.incrby("m").should.be.rejected()
		Rache.decrby("m").should.be.rejected()

		await Rache.close()
	})

	it("incrfloat", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 0.1)

		let r = await Rache.incrbyfloat("m", 0.2)		
		parseFloat(r).should.approximately(0.3, 1e-5)
		r = await Rache.get("m")
		parseFloat(r).should.approximately(0.3, 1e-5)

		r = await Rache.incrbyfloat("n", 0.2)
		parseFloat(r).should.approximately(0.2, 1e-5)
		r = await Rache.get("n")
		parseFloat(r).should.approximately(0.2, 1e-5)

		r = await Rache.incrbyfloat("m", 1.3e-3)
		parseFloat(r).should.approximately(0.3013, 1e-5)
		r = await Rache.get("m")
		parseFloat(r).should.approximately(0.3013, 1e-5)

		r = await Rache.incrbyfloat("n", 2.2e100)
		parseFloat(r).should.approximately(2.2e100, 0)

		await Rache.set("ms", "hello")
		await Rache.incrbyfloat("ms").should.be.rejected()
		await Rache.lpush("ml", 1, 2)
		Rache.incrbyfloat("ml", 10).should.be.rejected()

		Rache.incrbyfloat("m").should.be.rejected()

		await Rache.close()
	})	


	it("mset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		;(await Rache.mset("m1", 1, "m2", 2, "m3", 3)).should.equal("OK")
		;(await Rache.mget("m1", "m2", "m3")).should.deepEqual(["1", "2", "3"])

		await Rache.expire("m2", 1000)
		;(await Rache.mset("m1", 1, "m2", 2, "m3", 3)).should.equal("OK")
		;(await Rache.ttl("m2")).should.equal(-1)

		Rache.mset("m", 1, "n").should.be.rejected()

		await Rache.close()
	})

	it("msetnx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		;(await Rache.msetnx("m1", 1, "m2", 2, "m3", 3)).should.equal(1)
		;(await Rache.mget("m1", "m2", "m3")).should.deepEqual(["1", "2", "3"])
		
		;(await Rache.msetnx("m1", 100, "m5", 5, "m6", 6)).should.equal(0)
		;(await Rache.mget("m1", "m5", "m6")).should.deepEqual(["1", null, null])
		
		Rache.msetnx("m", 1, "n").should.be.rejected()

		await Rache.close()
	})

	it("mget", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.msetnx("m1", 1, "m2", 2, "m3", 3)
		let [m1, m2, m3, m4] = await Rache.mget("m1", "m2", "m3", "m4")
		m1.should.equal("1")
		m2.should.equal("2")
		m3.should.equal("3")
		should(m4).be.exactly(null)

		await Rache.lpush("ml", 1, 2)
		Rache.mget("ml").should.be.rejected()

		await Rache.close()
	})
})
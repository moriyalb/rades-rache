"use strict"

require('should')

describe("string", ()=> {
	it("get & set", async () => {
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

		await Rache.lpush("marios", 1, 2, 3)
		await Rache.get("marios").should.be.rejected()
		
		await Rache.close()
	})

	it("set with nx & xx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "good")
		let r = await Rache.get("m")
		r.should.equal("good")

		await Rache.set("m", "not-set", "nx")
		r = await Rache.get("m")
		r.should.equal("good")

		await Rache.set("m", "set", "xx")
		r = await Rache.get("m")
		r.should.equal("set")

		await Rache.set("n", "not-set", "xx")
		r = await Rache.get("n")
		should(r).be.exactly(null)

		await Rache.set("n", "set", "nx")
		r = await Rache.get("n")
		r.should.equal("set")

		await Rache.set("n", "set", "nx", "xx").should.be.rejected()
		await Rache.set("n", "set", "xx", "nx").should.be.rejected()

		await Rache.close()
	})

	it("set with ex & px", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "value", "ex", 3)
		let r = await Rache.get("m")
		r.should.equal("value")
		let ttl = await Rache.ttl("m")
		ttl.should.aboveOrEqual(2)
		ttl.should.belowOrEqual(3)
		
		await Rache.close()
	})

	it("getset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello")
		await Rache.expire("m", 1000)
		let r = await Rache.getset("m", "world")
		r.should.equal("hello")
		r = await Rache.get("m")
		r.should.equal("world")
		let ttl = await Rache.ttl("m")
		ttl.should.equal(-1)

		r = await Rache.getset("mario", "world")
		should(r).be.exactly(null)
		r = await Rache.get("m")
		r.should.equal("world")
		
		await Rache.close()
	})

	it("strlen", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello")
		let len = await Rache.strlen("m")
		len.should.equal(5)

		len = await Rache.strlen("mario")
		len.should.equal(0)

		await Rache.lpush("marios", 1, 2, 3)
		await Rache.strlen("marios").should.be.rejected()
				
		await Rache.close()
	})

	it("append", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		let len = await Rache.append("m", "hello")
		len.should.equal(5)

		len = await Rache.append("m", " world")
		len.should.equal(11)

		await Rache.expire("m", 10)
		let ttl = await Rache.ttl("m")
		ttl.should.aboveOrEqual(9)

		await Rache.lpush("marios", 1, 2, 3)
		await Rache.append("marios").should.be.rejected()
				
		await Rache.close()
	})

	it("setrange", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		let len = await Rache.setrange("m", 0, "hello")
		len.should.equal(5)
		let v = await Rache.get("m")
		v.should.equal("hello")

		len = await Rache.setrange("n", 4, "hello")
		len.should.equal(9)
		v = await Rache.get("n")
		v.should.equal("\x00\x00\x00\x00hello")

		len = await Rache.setrange("m", 2, "ww")
		len.should.equal(5)
		v = await Rache.get("m")
		v.should.equal("hewwo")

		len = await Rache.setrange("m", 4, "qxy")
		len.should.equal(7)
		v = await Rache.get("m")
		v.should.equal("hewwqxy")

		len = await Rache.setrange("m", 10, "haha")
		len.should.equal(14)
		v = await Rache.get("m")
		v.should.equal("hewwqxy\x00\x00\x00haha")

		await Rache.lpush("marios", 1, 2, 3)
		await Rache.setrange("marios", 0, "a").should.be.rejected()
				
		await Rache.close()
	})

	it("getrange", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", "hello rades-cache")
		let v = await Rache.getrange("m", 0, 4)
		v.should.equal("hello")

		v = await Rache.getrange("m", -5, -1)
		v.should.equal("cache")

		v = await Rache.getrange("m", 6, -7)
		v.should.equal("rades")

		v = await Rache.getrange("m", -100, 2)
		v.should.equal("hel")

		v = await Rache.getrange("m", -3, 100)
		v.should.equal("che")

		await Rache.getrange("m").should.be.rejected()
		await Rache.getrange("m", 0).should.be.rejected()
		await Rache.getrange("m", 0, 'b').should.be.rejected()
		await Rache.getrange("m", 'a', 2).should.be.rejected()

		await Rache.lpush("marios", 1, 2, 3)
		await Rache.getrange("marios", 0, 0).should.be.rejected()

		await Rache.close()
	})

	it("incr", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)
		let r = await Rache.incr("m")
		r.should.equal("51")
		r = await Rache.get("m")
		r.should.equal("51")

		r = await Rache.incr("n")
		r.should.equal("1")
		r = await Rache.get("n")
		r.should.equal("1")

		await Rache.set("m", "hello")
		await Rache.incr("m").should.be.rejected()

		await Rache.close()
	})

	it("incrby", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)
		let r = await Rache.incrby("m", 20)
		r.should.equal("70")
		r = await Rache.get("m")
		r.should.equal("70")

		r = await Rache.incrby("n", -10)
		r.should.equal("-10")
		r = await Rache.get("n")
		r.should.equal("-10")

		await Rache.set("m", "hello")
		await Rache.incrby("m").should.be.rejected()

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

		await Rache.set("m", "hello")
		await Rache.incrby("m").should.be.rejected()

		await Rache.close()
	})

	it("decr", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)
		let r = await Rache.decr("m")
		r.should.equal("49")
		r = await Rache.get("m")
		r.should.equal("49")

		r = await Rache.decr("n")
		r.should.equal("-1")
		r = await Rache.get("n")
		r.should.equal("-1")

		await Rache.set("m", "hello")
		await Rache.decr("m").should.be.rejected()

		await Rache.close()
	})

	it("decrby", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		await Rache.set("m", 50)
		let r = await Rache.decrby("m", 20)
		r.should.equal("30")
		r = await Rache.get("m")
		r.should.equal("30")

		r = await Rache.decrby("n", -10)
		r.should.equal("10")
		r = await Rache.get("n")
		r.should.equal("10")

		await Rache.set("m", "hello")
		await Rache.decrby("m").should.be.rejected()

		await Rache.close()
	})

	it("mset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		let r = await Rache.mset("m1", 1, "m2", 2, "m3", 3)
		r.should.equal("OK")
		r = await Rache.get("m1")
		r.should.equal("1")
		r = await Rache.get("m2")
		r.should.equal("2")
		r = await Rache.get("m3")
		r.should.equal("3")

		await Rache.expire("m2", 1000)
		await Rache.mset("m1", 1, "m2", 2, "m3", 3)
		let ttl = await Rache.ttl("m2")
		ttl.should.equal(-1)

		await Rache.mset("m", 1, "n").should.be.rejected()

		await Rache.close()
	})

	it("msetnx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()

		let r = await Rache.msetnx("m1", 1, "m2", 2, "m3", 3)
		r.should.equal(1)
		r = await Rache.get("m1")
		r.should.equal("1")
		r = await Rache.get("m2")
		r.should.equal("2")
		r = await Rache.get("m3")
		r.should.equal("3")
		
		r = await Rache.msetnx("m1", 100, "m5", 5, "m6", 6)
		r.should.equal(0)
		r = await Rache.get("m1")
		r.should.equal("1")
		r = await Rache.get("m5")
		should(r).be.exactly(null)
		r = await Rache.get("m6")
		should(r).be.exactly(null)

		await Rache.msetnx("m", 1, "n").should.be.rejected()

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

		await Rache.close()
	})
})
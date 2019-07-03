"use strict"

require('should')
const Util = require("../lib/util")

describe("list", ()=> {
	it("lpush & rpush", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.lpush("m", 1, 2, 3)).should.equal(3)
		;(await Rache.lindex("m", 0)).should.equal("3")
		;(await Rache.lindex("m", -1)).should.equal("1")
		Rache.lindex("m", 4).should.be.fulfilledWith(null)
		
		;(await Rache.rpush("mr", 1, 2, 3)).should.equal(3)		
		;(await Rache.lindex("mr", 0)).should.equal("1")
		;(await Rache.lindex("mr", -1)).should.equal("3")
		Rache.lindex("mr", 4).should.be.fulfilledWith(null)

		Rache.lpush("m").should.be.rejected()
		Rache.rpush("m").should.be.rejected()

		await Rache.set("ms", 1)
		Rache.lpush("ms", 1).should.be.rejected()
		Rache.rpush("ms", 1).should.be.rejected()
		
		await Rache.close()
	})

	it("lpushx & rpushx", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.lpushx("m", 1, 2, 3)).should.equal(0)
		await Rache.lpush("m", 1)
		;(await Rache.lpushx("m", 2, 3)).should.equal(3)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["3", "2", "1"])
				
		;(await Rache.rpushx("mr", 1, 2, 3)).should.equal(0)
		await Rache.rpush("mr", 1)
		;(await Rache.rpushx("mr", 2, 3)).should.equal(3)
		
		;(await Rache.lrange("mr", 0, -1)).should.deepEqual(["1", "2", "3"])
		
		Rache.lpushx("m").should.be.rejected()
		Rache.rpushx("m").should.be.rejected()

		await Rache.set("ms", 1)
		Rache.lpushx("ms", 1).should.be.rejected()
		Rache.rpushx("ms", 1).should.be.rejected()
		
		await Rache.close()
	})

	it("lindex", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		;(await Rache.rpush("m", 1, 2, 3)).should.equal(3)
		;(await Rache.lindex("m", 0)).should.equal("1")
		;(await Rache.lindex("m", 2)).should.equal("3")
		;(await Rache.lindex("m", -3)).should.equal("1")
		;(await Rache.lindex("m", -1)).should.equal("3")
		Rache.lindex("m", 5).should.be.fulfilledWith(null)
		Rache.lindex("m", -5).should.be.fulfilledWith(null)

		await Rache.set("ms", 1)
		Rache.lindex("ms", 1).should.be.rejected()
		Rache.lindex("m").should.be.rejected()
		
		await Rache.close()
	})

	it("lrange", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3)
		;(await Rache.lrange("m", 0, 0)).should.deepEqual(["1"])
		;(await Rache.lrange("m", 1, 2)).should.deepEqual(["2", "3"])
		;(await Rache.lrange("m", 0, 5)).should.deepEqual(["1", "2", "3"])
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "2", "3"])
		;(await Rache.lrange("m", -1, -1)).should.deepEqual(["3"])

		await Rache.set("ms", 1)
		Rache.lrange("ms", 1, 1).should.be.rejected()
		Rache.lrange("m", -1).should.be.rejected()
		Rache.lrange("m").should.be.rejected()
		Rache.lrange("m", 1, "haha").should.be.rejected()

		await Rache.close()
	})

	it("llen", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3)
		;(await Rache.llen("m")).should.equal(3)

		await Rache.lpush("m", "hello")
		;(await Rache.llen("m")).should.equal(4)

		;(await Rache.llen("m_not_exists")).should.equal(0)

		await Rache.set("ms", 1)
		Rache.llen("ms").should.be.rejected()

		await Rache.close()
	})

	it("lrem", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3, 2, 2, 3, 4, 2, 1, 2)

		;(await Rache.lrem("m", 1, 2)).should.equal(1)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "3", "2", "2", "3", "4", "2", "1", "2"])

		;(await Rache.lrem("m", -2, 2)).should.equal(2)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "3", "2", "2", "3", "4", "1"])

		;(await Rache.lrem("m", 0, 2)).should.equal(2)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "3", "3", "4", "1"])

		;(await Rache.lrem("m", 0, 5)).should.equal(0)		
		
		await Rache.set("ms", 1)
		Rache.lrem("ms", 1, 2).should.be.rejected()
		Rache.lrem("m", 0).should.be.rejected()
		Rache.lrem("m").should.be.rejected()

		await Rache.close()
	})
	
	it("linsert", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3, 4)

		;(await Rache.linsert("m", "before", 2, 100)).should.equal(5)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "100", "2", "3", "4"])

		;(await Rache.linsert("m", "after", 2, 101)).should.equal(6)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["1", "100", "2", "101", "3", "4"])

		;(await Rache.linsert("m", "after", 555, 101)).should.equal(-1)

		;(await Rache.linsert("m1", "after", 0, 101)).should.equal(0)

		await Rache.set("ms", 1)
		Rache.linsert("ms", "after", 1, 2).should.be.rejected()
		Rache.linsert("m", "after", 555).should.be.rejected()
		Rache.linsert("m", "after").should.be.rejected()
		Rache.linsert("m", 1).should.be.rejected()
		Rache.linsert("m").should.be.rejected()

		await Rache.close()
	})

	it("ltrim", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3, 4, 5, 6, 7)

		await Rache.ltrim("m", 3, 5)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["4", "5", "6"])

		await Rache.ltrim("m", 0, -1)
		;(await Rache.lrange("m", 0, -1)).should.deepEqual(["4", "5", "6"])

		await Rache.set("ms", 1)
		Rache.ltrim("ms", 1, 2).should.be.rejected()
		Rache.ltrim("m", -1).should.be.rejected()
		Rache.ltrim("m").should.be.rejected()
		Rache.ltrim("m", 1, "haha").should.be.rejected()

		await Rache.close()
	})

	it("lset", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3)

		await Rache.lset("m", 0, 5)
		;(await Rache.lindex("m", 0)).should.equal("5")

		await Rache.lset("m", -1, 5)
		;(await Rache.lindex("m", 2)).should.equal("5")

		await Rache.set("ms", 1)
		Rache.lset("ms", 1, 2).should.be.rejected()
		Rache.lset("m", 5).should.be.rejected()
		Rache.lset("m", 5, 100).should.be.rejected()
		Rache.lset("m1", 0, 100).should.be.rejected()

		await Rache.close()
	})

	it("lpop & rpop", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("m", 1, 2, 3)
		;(await Rache.lpop("m")).should.equal("1")
		;(await Rache.llen("m")).should.equal(2)

		;(await Rache.rpop("m")).should.equal("3")
		;(await Rache.llen("m")).should.equal(1)


		await Rache.set("ms", 5)
		await Rache.lpop("ms").should.be.rejected()
		await Rache.rpop("ms").should.be.rejected()

		await Rache.close()
	})

	it("rpoplpush", async () => {
		const Rache = require("../lib/rache").default
		await Rache.init()
		await Rache.flushall()
		
		await Rache.rpush("ml", 1, 2, 3)
		await Rache.rpush("mr", 100, 101, 102)

		;(await Rache.rpoplpush("mr", "ml")).should.equal("102")
		;(await Rache.lrange("mr", 0, -1)).should.deepEqual(["100", "101"])
		;(await Rache.lrange("ml", 0, -1)).should.deepEqual(["102", "1", "2", "3"])

		;(await Rache.rpoplpush("mr", "ml")).should.equal("101")
		;(await Rache.rpoplpush("mr", "ml")).should.equal("100")
		should(await Rache.rpoplpush("mr", "ml")).be.exactly(null)

		;(await Rache.lrange("mr", 0, -1)).should.deepEqual([])
		;(await Rache.lrange("ml", 0, -1)).should.deepEqual(["100", "101", "102", "1", "2", "3"])

		;(await Rache.rpoplpush("ml", "ml")).should.equal("3")
		;(await Rache.rpoplpush("ml", "ml")).should.equal("2")
		;(await Rache.lrange("ml", 0, -1)).should.deepEqual(["2", "3", "100", "101", "102", "1"])

		await Rache.set("ms", 5)
		Rache.rpoplpush("ms").should.be.rejected()
		Rache.rpoplpush("ml").should.be.rejected()

		await Rache.close()
	})
})
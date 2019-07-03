# rades-rache
A lightweight, local dictionary service

[![Build Status](https://travis-ci.org/moriyalb/rades-rache.svg?branch=master)](https://travis-ci.org/moriyalb/rades-rache)
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

# Installation

Using npm:
```shell
$ npm i -g rades-rache
```

# Usage

```js
//default instance
let rache = require('rades-rache').default
//or you can create a new instance
//const {Rache} = require('rades-rache')
//let rache = new Rache()

async () => {
	await rache.init()

	//String
	await rache.set("mario", 1)
	let v = await rache.get("mario") //"1"

	//List
	await rache.lpush("list", 1, 2, 3)
	v = await rache.lrange("list", 0, -1) //"3", "2", "1"

	//Hash
	await rache.hmset("hash", "k", 1, "q", 2)
	v = await rache.hgetall("hash") //"k", "1", "q", "2"
	
	await rache.close()
}
```

# Description

* `rades-rache` is just use for quickly server development. It's just like redis but without any other dependency.
* `rades-rache` is worked well with `rades` solution. [Learn More](https://github.com/moriyalb/rades)
* `rades-rache` is not a stand-alone service. No network, no configure, just require it and use. 

# APIs supported
* string
  * append
  * decr
  * decrby
  * get
  * getrange
  * getset
  * incr
  * incrby
  * incrbyfloat
  * mget
  * mset
  * msetnx
  * set
  * setrange
  * strlen
* hash
  * hdel
  * hexists
  * hget
  * hgetall
  * hincrby
  * hincrbyfloat
  * hkeys
  * hlen
  * hmget
  * hmset
  * hset
  * hsetnx
  * hstrlen
  * hvals
* list
  * lindex
  * linsert
  * llen
  * lpop
  * lpush
  * lpushx
  * lrange
  * lrem
  * lset
  * ltrim
  * rpop
  * rpoplpush
  * rpush
  * rpushx
* lifetime
  * expire
  * expireat
  * persist
  * pexipre  
  * pexpireat  
  * pttl
  * ttl
* db
  * exists
  * flushall
  * type


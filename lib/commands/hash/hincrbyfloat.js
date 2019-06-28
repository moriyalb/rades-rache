"use strict"

module.exports = async function(topkey, key, value) {
	return await this.hincrby(topkey, key, value)
}
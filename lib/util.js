"use strict"

const _ = require("lodash")

const Util = {}
module.exports = Util

Util.isValidKey = (key) => {
	return !!key && (_.isSafeInteger(key) || _.isString(key))
}

Util.isValidValue = (value) => {
	return !!value && (_.isSafeInteger(value) || _.isString(value))
}

Util.inow = () => {
	return _.toSafeInteger(new Date().getTime() / 1000)
}

Util.imnow = () => {
	return _.toSafeInteger(new Date().getTime())
}
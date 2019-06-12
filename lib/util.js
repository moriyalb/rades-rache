"use strict"

const _ = require("lodash")
const R = require("ramda")

const Util = {}
module.exports = Util

const _isValue = R.anyPass([_.isSafeInteger, _.isNumber, _.isString])

Util.isValidKey = R.either(_.isSafeInteger, _.isString)

Util.isValidValue = _isValue

Util.isValidListValue = R.both(_.isArray, R.all(_isValue))
	
Util.inow = () => {
	return _.toSafeInteger(new Date().getTime() / 1000)
}

Util.imnow = () => {
	return _.toSafeInteger(new Date().getTime())
}
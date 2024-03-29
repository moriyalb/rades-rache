"use strict"

const _ = require("lodash")
const R = require("ramda")

const Util = {}
module.exports = Util

const _isValue = R.anyPass([_.isSafeInteger, _.isNumber, _.isString])
const _isNumberValue = R.anyPass([_.isSafeInteger, _.isNumber])

Util.isValidKey = R.either(_.isSafeInteger, _.isString)

Util.isValidValue = _isValue
Util.isValidNumberValue = _isNumberValue
Util.isValidIntValue = _.isSafeInteger

Util.isValidListValue = R.allPass([_.isArray, R.compose(R.not, R.equals(0), R.length), R.all(_isValue)])
	
Util.inow = () => {
	return _.toSafeInteger(new Date().getTime() / 1000)
}

Util.imnow = () => {
	return _.toSafeInteger(new Date().getTime())
}
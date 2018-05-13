/* global self EventEmitter */
(function () {
  var root = (typeof self === 'object' && self.self === self && self) ||
      (typeof global === 'object' && global.global === global && global) ||
      this || {}

  var util = {
    extend: function (target) {
      for (var i = 1; i < arguments.length; i++) {
        for (var prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop]
          }
        }
      }
      return target
    },
    addEvent: function (element, type, fn) {
      if (document.addEventListener) {
        element.addEventListener(type, fn, false)
        return fn
      } else if (document.attachEvent) {
        var bound = function () {
          return fn.apply(element, arguments)
        }
        element.attachEvent('on' + type, bound)
        return bound
      }
    },
    indexOf: function (array, item) {
      if (array.indexOf) {
        return array.indexOf(item)
      } else {
        var res = -1
        for (var i = 0; i < array.lenth; i++) {
          if (array[i] === item) {
            res = i
            break
          }
        }
        return res
      }
    },
    isValidListener: function (listener) {
      if (typeof listener === 'function') {
        return true
      } else if (listener && typeof listener === 'object') {
        return util.isValidListener(listener.listener)
      } else {
        return false
      }
    },
    getViewPortSizeHeight: function () {
      var w = window
      if (w.innerWidth != null) { return w.innerHeight }
      // 标准模式
      var d = document
      if (document.compatMode === 'CSS1Compat') {
        return d.documentElement.clientHeight
      } else {
        // 怪异模式
        return d.body.clientHeight
      }
    },
    getScrollOffsetTop: function () {
      var w = window
      if (w.pageXOffset != null) { return w.pageYOffset }
      var d = w.document
      if (document.compatMode === 'CSS1Compat') {
        return d.documentElement.scrollTop
      } else {
        return d.body.scrollTop
      }
    }
  }

  function TopIndicator (options) {
    this.options = util.extend({}, this.constructor.defaultOptions, options)
    this.handlers = {}
    this.init()
  }
  TopIndicator.VERSION = '1.0.0'
  TopIndicator.defaultOptions = {
    color: 'lightseagreen'
  }

  var proto = TopIndicator.prototype = new EventEmitter()
  proto.constructor = TopIndicator

  proto.init = function () {
    this.createIndicator()
    var width = this.calcuteWidthPrecent()
    this.setWidth(width)
    this.bindScrollEvent()
  }

  proto.createIndicator = function () {
    var div = document.createElement('div')
    div.id = 'topIndicator'
    div.className = 'topIndicator'
    div.style.position = 'fixed'
    div.style.top = 0
    div.style.left = 0
    div.style.height = '3px'
    div.style.backgroundColor = this.options.color

    this.element = div
    document.body.appendChild(div)
  }

  proto.calcuteWidthPrecent = function () {
    this.docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
    this.viewPortHeight = util.getViewPortSizeHeight()
    this.sHeight = Math.max(this.docHeight - this.viewPortHeight, 0)
    var scrollTop = util.getScrollOffsetTop()

    return this.sHeight ? scrollTop / this.sHeight : 0
  }

  proto.setWidth = function (perc) {
    this.element.style.width = perc * 100 + '%'
  }

  proto.bindScrollEvent = function () {
    var self = this
    var prev

    util.addEvent(window, 'scroll', function () {
      window.requestAnimationFrame(function () {
        var perc = Math.min(util.getScrollOffsetTop() / self.sHeight, 1)
        if (perc === prev) { return }
        if (prev && perc === 1) { self.emit('end') }
        prev = perc
        self.setWidth(perc)
      })
    })
  }

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = TopIndicator
    }
    exports = TopIndicator
  } else {
    root.TopIndicator = TopIndicator
  }
}())

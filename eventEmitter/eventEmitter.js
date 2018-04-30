/* global self */
(function () {
  var root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this || {}

  function isValidListener (listener) {
    if (typeof listener === 'function') {
      return true
    } else if (typeof listener === 'object') {
      return isValidListener(listener.listener)
    } else {
      return false
    }
  }

  function indexOf (array, item) {
    if (array.indexOf) {
      return array.indexOf(item)
    } else {
      var result = -1
      item = typeof item === 'object' ? item.listener : item

      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i].listener === item) {
          result = i
          break
        }
      }
      return result
    }
  }

  function EventEmitter () {
    this.__events = {}
  }

  EventEmitter.VERSION = '1.0.0'

  var proto = EventEmitter.prototype

  // 添加事件
  proto.on = function (eventName, listener) {
    if (!eventName || !listener) { return }

    if (!isValidListener(listener)) {
      throw new TypeError('Listener must be a function!')
    }

    var events = this.__events
    var listeners = events[eventName] = events[eventName] || []
    var listenerIsWrapped = typeof listener === 'object'

    // 避免重复添加事件
    if (indexOf(listeners, listener) === -1) {
      listeners.push(listenerIsWrapped ? listener : {
        listener: listener,
        once: false
      })
    }
    return this
  }

  // 添加单次执行事件
  proto.once = function (eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true
    })
  }

  // 删除事件
  proto.off = function (eventName, listener) {
    var listeners = this.__events[eventName]
    if (!listener) { return }

    var index
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        index = i
        break
      }
    }
    if (typeof index !== 'undefined') {
      listeners.splice(index, 1, null)
    }
    return this
  }

  // 触发事件
  proto.emit = function (eventName, args) {
    var listeners = this.__events[eventName]
    if (!listeners) { return }

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      if (listener) {
        listener.listener.apply(this, args || [])
        if (listener.once) {
          this.off(eventName, listener.listener)
        }
      }
    }
    return this
  }

  // 删除某一个类型的所有事件或者所有事件
  proto.allOff = function (eventName) {
    if (eventName && this.__events[eventName]) {
      this.__events[eventName] = []
    } else {
      this.__events = {}
    }
  }

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = EventEmitter
    }
    exports.EventEmitter = EventEmitter
  } else {
    root.EventEmitter = EventEmitter
  }
}())

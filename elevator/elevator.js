/* global requestAnimationFrame, cancelAnimationFrame, updataEndPosition, Audio */
var Elevator = function (options) {
  'use strict'

  var body = null
  var that = this

  var startPosition = null
  var endPosition = 0
  var targetElement = null

  var customDuration = false
  var duration = null

  var verticalPadding = null

  var elevating = false

  var startTime = null

  var animation = null

  var mainAudio
  var endAudio
  var startCallback
  var endCallback

  // 滑动算法 - http://robertpenner.com/easing/
  function easeInOutQuad (t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  // 增加参数
  function extendParameters (options, defaults) {
    for (var option in defaults) {
      var t = options[option] === undefined && typeof option !== 'function'
      if (t) {
        options[option] = defaults[option]
      }
    }
    return options
  }

  // 上升位移
  function getVerticalOffset (element) {
    var verticalOffset = 0
    while (element) {
      verticalOffset += element.offsetTop || 0
      element = element.offsetParent
    }

    if (verticalPadding) {
      verticalOffset = verticalOffset - verticalPadding
    }
    return verticalOffset
  }

  // 动画循环
  function animateLoop (time) {
    if (!startTime) {
      startTime = time
    }
    var timeSoFar = time - startTime
    var easedPosition = easeInOutQuad(
      timeSoFar,
      startPosition,
      endPosition - startPosition,
      duration
    )
    window.scrollTo(0, easedPosition)

    if (timeSoFar < duration) {
      animation = requestAnimationFrame(animateLoop)
    } else {
      animationFinished()
    }
  }

  // main
  this.elevate = function () {
    if (elevating) {
      return
    }
    elevating = true
    startPosition = document.documentElement.scrollTop || body.scrollTop
    updateEndPosition()
    if (!customDuration) {
      duration = Math.abs(endPosition - startPosition) * 1.5
    }
    requestAnimationFrame(animateLoop)

    if (mainAudio) {
      mainAudio.play()
    }

    if (startCallback) {
      startCallback()
    }
  }

  // 重置初始位置
  function resetPositions () {
    startTime = null
    startPosition = null
    elevating = false
  }

  // 更新结束位置
  function updateEndPosition () {
    if (targetElement) {
      endPosition = getVerticalOffset(targetElement)
    }
  }

  // elevate动画完成
  function animationFinished () {
    resetPositions()

    if (mainAudio) {
      mainAudio.pause()
      mainAudio.currentTime = 0
    }

    if (endAudio) {
      endAudio.play()
    }

    if (endCallback) {
      endCallback()
    }
  }

  function onWindowBlur () {
    if (elevating) {
      cancelAnimationFrame(animation)
      resetPositions()

      if (mainAudio) {
        mainAudio.pause()
        mainAudio.currentTime = 0
      }

      updateEndPosition()
      window.scrollTo(0, endPosition)
    }
  }

  // 将元素与事件监听绑定
  function bindElevateToElement (element) {
    if (element.addEventListener) {
      element.addEventListener('click', that.elevate, false)
    } else {
      element.attachEvent('onclick', function () {
        updataEndPosition()
        document.documentElement.scrollTop = endPosition
        document.body.scrollTop = endPosition
        window.scroll(0, endPosition)
      })
    }
  }

  function init (_options) {
    body = document.body

    var defaults = {
      duration: undefined,
      mainAudio: false,
      endAudio: false,
      preloadAudio: true,
      loopAudio: true,
      startCallback: null,
      endCallback: null
    }

    _options = extendParameters(_options, defaults)

    if (_options.element) {
      bindElevateToElement(_options.element)
    }

    if (_options.duration) {
      customDuration = true
      duration = _options.duration
    }

    if (_options.targetElement) {
      targetElement = _options.targetElement
    }

    if (_options.verticalPadding) {
      verticalPadding = _options.verticalPadding
    }

    window.addEventListener('blur', onWindowBlur, false)

    if (_options.mainAudio) {
      mainAudio = new Audio(_options.mainAudio)
      mainAudio.setAttribute('preload', _options.preloadAudio)
      mainAudio.setAttribute('loop', _options.loopAudio)
    }

    if (_options.endAudio) {
      endAudio = new Audio(_options.endAudio)
      endAudio.setAttribute('preload', 'true')
    }

    if (_options.endCallback) {
      endCallback = _options.endCallback
    }
    if (_options.startCallback) {
      startCallback = _options.startCallback
    }
  }
  init(options)
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Elevator
}

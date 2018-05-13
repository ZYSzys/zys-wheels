# EventEmitter

浏览器端的EventEmitter

## Usage

```js
<script type="text/javascript" src="eventEmitter.min.js"></script>
<script type="text/javascript">
    var ee = new EventEmitter()
</script>
```

## API

```js
// 添加事件
ee.on(eventName, listener)
// 删除事件
ee.off(eventName, listener)
// 添加单次执行事件
ee.once(eventName, listener)
// 删除某个事件或所有事件
ee.allOff(eventName)
// 触发事件
ee.emit(eventName, args)
```

## Example

(结果打印在控制台中)
```js
var e = new EventEmitter()

function f1(a, b) {
    console.log(a, b, a+b)
}
function f2(a, b) {
    console.log(a, b, a-b)
}
function f3(a, b) {
    console.log(a, b, a*b)
}

e.on('f', f1).once('f', f2).on('f', f3)
e.emit('f', [2, 8])// => 2 8 10 2 8 -6 2 8 16

e.off('f', f3)
e.emit('f', [1,3])// => 1 3 4

e.allOff()
e.emit('f', [1,3])
```

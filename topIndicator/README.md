# topIndicator

原生js顶部进度条

## 依赖
[eventEmitter](https://github.com/ZYSzys/zys-wheels/tree/master/eventEmitter)

## Usage
```js
<script type="text/javascript" src="eventEmitter.min.js"></script>
<script type="text/javascript" src="topIndicator.js"></script>
<script type="text/javascript">
    var indicator = new TopIndicator()

    indicator.once("end", function() {
        //callback
    })
</script>
```

## API
- color: (default: lightseagreen)
```javascript
var indicator = new TopIndicator({
    color: 'red'
})
```
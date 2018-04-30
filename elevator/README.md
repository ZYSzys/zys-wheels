# Elevator

A "back to top" button that behaves like a real elevator.

## Usage

```html
<div class="elevator"></div>
<script type="text/javascript" src="elevator.js"></script>
<script type="text/javascript">
    var elementButton = document.querySelector('.elevator');
    var elevator = new Elevator({
        element: elementButton
    })
</script>
```

## API

```js
var elevator = new Elevator({
    element: elementButton,
    mainAudio: 'elevator.mp3',
    endAudio: 'ding.mp3'
    /*
    duration: 1000,
    preloadAudio: true,
    loopAudio: true,
    startCallback: null,
    endCallback: null
    */
})
```

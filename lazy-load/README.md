# LazyLoad

Lazy-loading images with data-* attributes.

## Usage

```html
<script type="text/javascript" src="lazy.load.js"></script>
<script type="text/javascript">
    echo.init({
        offset: 100,
        throttle: 2500,
        unload: false,
        callback: function(elem, op) {
            console.log(elem, op);
        }
    });
</script>
```

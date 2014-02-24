jquery.vflick
=============

jquery library for SP flick
[http://gorbachov.github.io/jquery.vflick/](http://gorbachov.github.io/jquery.vflick/ "http://gorbachov.github.io/jquery.vflick/")

### 01.load jQuery and jquey.vflick.js
```html
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="js/jquery.vflick.min.js"></script>
```

### 02.construct html
```html
<div class="vflick-wrapper">
    <div class="vflick">
        <div class="flick"><p>1</p></div>
        <div class="flick"><p>2</p></div>
        <div class="flick"><p>3</p></div>
    </div>
</div>
```

### 03.decorated with css(scss)
```scss(compass)
.vflick-wrapper{
    width:300px;
    overflow:hidden;
}
.vflick{
    width:900px; //.flick width * .flick num (300 x 3)
    @include display-box;
}
.flick{
    @include box-flex(1);
    width:300px;
    height:300px;
}
```

### 04.initialize in javascript
```js
;(function($){
    $(function(){
        $('.vflick').vflick();
    });
})(jQuery);
```

[more info](http://gorbachov.github.io/jquery.vflick/ "http://gorbachov.github.io/jquery.vflick/")



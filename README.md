# jsCache
基于localStorage,保存js/css等资源



## 引入

```html
<script src="jsCache.js"></script>
```

## 使用

示例：

html:

```html
<!-- 
    data-local-url:资源的链接
    data-local-name:资源的名称

  -->
<link rel="stylesheet" type="text/css" href="css/style.css" data-local-url="css/style.css" data-local-name="style" />

```

js:

```javascript
jsCache("0.0.1");//版本id,这里可以填写任一字符串,以作区别
```

jsCache会在第一次访问时通过xhr把资源下载下来，保存在LocalStorage中。下次访问时，先检查LocalStorage中是否存在该资源。如果有就写入到页面中。

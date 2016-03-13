# calendar
javascript calendar plugin

## description
It just the fist plugin create by meself, so there may have many improvements on the plugin,
so if you have any feedbacks, I am glad to accept.

## usage

first, you should import the style and js files on the page.

```html
<html>
<head>
	<link rel="stylesheet" type="text/css" href="assets/calendar.css">
	<script type="text/javascript" src="src/calendar.js"></script>
	<title></title>
</head>
<body>

</body>
</html>
```

```javascript
var calendar = new Calendar();
		var dateField = document.getElementById('date');
		calendar.init({
			format: 'YY-MM-DD',
			target: dateField,
			onselect: function(date) {
				dateField.value = date;
			}
		});
```

## init method options
- format
	+ format: 'YY/MM/DD', default fomation is like '2016/03/13'
	+ format: 'YY-MM-DD', '2016-03-13'
	+ formate 'MM-DD-YY', '03-2016-13'

- target: pure javascript dom element on your page.

- onselect: callback once your have select a date on the calendar.



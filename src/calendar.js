;(function(c) {
	if (typeof module === 'object' && typeof require === 'function') {
		module.exports.calendar = c;
	} else {
		this.calendar = c;	
	}
})(function() {

	var hasOwnProperty = Object.hasOwnProperty,
			calendarId = 'bjiang' + (new Date()).getTime(),
			nativeForEach = Array.prototype.forEach;

	function each(obj, callback, context) {
		if (!obj) return;
		if (typeof obj.forEach === 'function' && obj.forEach === nativeForEach) {
			obj.forEach(callback);
		} else if (+obj.length === obj.length) {
			for (var i = 0, len = obj.length; i < len; i++) {
				callback(obj, obj[i], i, context);
			}
		}
	}

	// get the first day of the month
	function getFirstDayOfMonth(year, month) {
		return new Date (year, month - 1, 1).getDay();
	}
	

	// get the length of month
	function getLengthOfMonth(year, month) {
		return new Date (year, month, 0).getDate();
	}

	function extend(target, source) {
		for (var key in source) {
			if (hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}

	function $(id) {
		return typeof id === 'string' ? document.getElementById(id) : null;
	}

	function $class (className) {
		return typeof className == 'string' ? document.querySelectorAll(className) : null;
	}

	function Calendar(options) {
		var 	_drawCalendar = function (year, month) {
					var html = '<div class="calendar">',
							firstDay = getFirstDayOfMonth(year, month),
							dayLength = getLengthOfMonth(year, month),
							day = ['日', '一', '二', '三', '四', '五', '六'], i;
					for (i = 0; i < 7; i++) {
						html += '<div class="day">' + day[i] + '</div>'
					}

					for (i = 1; i < firstDay + 1; i++) {
						html += '<div class="day"></div>';
					}

					for (i = 1; i < dayLength + 1; i++) {
						html += '<div class="day">' + i + '</div>'
					}

					return html;
				},	
				_bindEvent = function() {

				};

		this.init = function(options) {
			var container = document.createElement('div'),
					now = new Date(),
					year =	now.getFullYear(),
					month = now.getMonth() + 1;

			container.setAttribute('id', calendarId);
			container.innerHTML = _drawCalendar(year, month);
			document.body.appendChild(container);
			_bindEvent();
		};
	}

	return function() {
		return new Calendar().init();
	}

}());
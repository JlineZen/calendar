;
(function(c) {
    if (typeof module === 'object' && typeof require === 'function') {
        module.exports.calendar = c;
    } else {
        this.calendar = c;
    }
})(function() {

    var hasOwnProperty = Object.hasOwnProperty,
        calendarId = 'bjiang' + (new Date()).getTime(),
        nativeForEach = Array.prototype.forEach,	
        slice = Array.prototype.slice;

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
        return new Date(year, month - 1, 1).getDay();
    }


    // get the length of month
    function getLengthOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function extend(target, source) {
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    function formatMonth(year, month) {
        var month = month < 10 ? '0' + month : month;
        return year + '-' + month;
    }

    function EventList() {
    	this.events = {};

    	this.subscribe = function(event, fn) {
    		this.events[event] = [];
    		this.events[event].push(fn);
    		return this;
    	};

    	this.unsubscribe = function(event) {
    		var events = this.events;
    		if (event in events !== false) {
    			delete events[event];
    		}
    		return this;
    	};

    	this.publish = function(event) {
    		var events = this.events,
    				args = slice.call(arguments, 1);
    		if (event in events !== false) {
    			for (var i = 0, len = events[event].length; i < len; i++) {
    				events[event][i].apply(this, args);
    			}
    		}
    		return this;
    	}
    }

    function $(id) {
        return typeof id === 'string' ? document.getElementById(id) : null;
    }

    function $class(className) {
        return typeof className == 'string' ? document.querySelectorAll(className) : null;
    }

    function Calendar() {
    		var now = new Date();
        this.drawCalendar = function(year, month) {
            var html = '<div class="calendar">',
                firstDay = getFirstDayOfMonth(year, month),
                dayLength = getLengthOfMonth(year, month),
                lastMonthLength = getLengthOfMonth(year, month - 1),
                day = ['日', '一', '二', '三', '四', '五', '六'],
                i;

            html += '<div class="column">';
            html += '<div class="pre"><</div>'
            html += '<div class="date">' + formatMonth(year, month) + '</div>';
            html += '<div class="next">></div>';
            html += '</div>';
            html += '<div class="column">';

            for (i = 0; i < 7; i++) {
                html += '<div class="day">' + day[i] + '</div>'
            }

            for (i = 1; i < firstDay + 1; i++) {
                html += '<div class="last-day day">' + (lastMonthLength + i - firstDay) + '</div>';
            }

            for (i = 1; i < dayLength + 1; i++) {
                if (i == now.getDate()) {
                    html += '<div class="day day-now">' + i + '</div>'
                } else {
                    html += '<div class="day">' + i + '</div>';
                }

            }

            for (i = 1; i < 8 - (dayLength + firstDay) % 7; i++) {
                html += '<div class="day last-day">' + i + '</div>';
            }

            html += '</div>'
            return html;
        };

        this.init = function(options) {
            var container = document.createElement('div');
            container.setAttribute('id', calendarId);
            container.innerHTML = this.drawCalendar(options.year, options.month);
            document.body.appendChild(container);
        };
    }

    return function() {
        var calendar = new Calendar();
        var now = new Date();
        var defaults = { year: now.getFullYear(), month: now.getMonth() };

        EventList.call(calendar);
        calendar.init(defaults);

        var pre = $class('.pre')[0];
        var next = $class('.next')[0];
        
        calendar.subscribe('pre', function(year, month) {
        	calendar.init({year, month})
        });
        calendar.subscribe('next', function(year, month) {
        	calendar.init({year, month})
        });

        pre.addEventListener('click', function() {
        	defaults.month = defaults.month - 1;
        	calendar.publish('pre', defaults.year, defaults.month);
        }, false);
        next.addEventListener('click', function() {
        	defaults.month = defaults.month + 1;
        	calendar.publish('pre', defaults.year, defaults.month);
        }, false);
    }

}());

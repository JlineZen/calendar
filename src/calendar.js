;(function(c) {
    if (typeof module === 'object' && typeof require === 'function') {
        module.exports.calendar = c;
    } else {
        this.calendar = c;
    }
})(function() {

    var hasOwnProperty = Object.hasOwnProperty,
        calendarId = 'bjiang' + (new Date()).getTime(),
        slice = Array.prototype.slice;

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
        return year + '年-' + month + '月';
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
        var defaults = { year: now.getFullYear(), month: now.getMonth() + 1 };
        var self = this;
        var _initEvent = function() {
            function next() {
                defaults.month = defaults.month + 1;
                if (defaults.month == 13) {
                    defaults.month = 1;
                    defaults.year += 1;
                }
                self.publish('next', defaults.year, defaults.month);
            };

            function pre() {
                defaults.month = defaults.month - 1;
                if(defaults.month == 0) {
                    defaults.month = 12;
                    defaults.year -= 1;
                }
                self.publish('pre', defaults.year, defaults.month);
            };
            self.subscribe('pre', function(year, month) {
                self.init({ year, month })
            });
            self.subscribe('next', function(year, month) {
                self.init({ year, month })
            });

            $class('.pre')[0].addEventListener('click', pre, false);
            $class('.next')[0].addEventListener('click', next, false);
        };  

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

            html += '</div>';
            return html;
        };

        this.init = function() {
            var container = document.getElementById(calendarId);
            if (container) {
                document.body.removeChild(container);
            } else {
                container = document.createElement('div');
                container.setAttribute('id', calendarId);
            }
            container.innerHTML = this.drawCalendar(defaults.year, defaults.month);
            document.body.appendChild(container);
            _initEvent();
        };
    }

    EventList.call(Calendar.prototype);

    return function() {
        calendar =  new Calendar();
        calendar.init();
    }
}());

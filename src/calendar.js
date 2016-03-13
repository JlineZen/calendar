;(function(c) {
    if (typeof module === 'object' && typeof require === 'function') {
        module.exports.Calendar = c;
    } else {
        this.Calendar = c;
    }
})(function() {

    var hasOwnProperty = Object.hasOwnProperty,
        calendarId = 'bjiang-date-picker',
        slice = Array.prototype.slice;

    // get the first day of the month
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month - 1, 1).getDay();
    }

    // get the length of month
    function getLengthOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function each(obj, callback, context) {
        if (!obj) return;
        if (typeof obj.forEach === 'function' && obj.forEach === Array.prototype.forEach) {
            obj.forEach(callback);
        } else if (+obj.length === obj.length) {
            for (var i = 0, len = obj.length; i < len; i++) {
                callback.call(context, obj[i], i, obj);
            }
        }
    }

    function hasClass(elem, clsName)  {
        return elem.className.split(' ').indexOf(clsName) > -1 ? true : false;
    }
 
    function formatMonth(year, month) {
        var month = month < 10 ? '0' + month : month;
        return '<span id="bj-calendar-year">' + year + '</span>年-' +
               '<span id="bj-calendar-month">' + month + '</span>月';
    }

    function getCssStyle(elem, prop) {
        if (elem.currentStyle) {
            return elem.currentStyle[prop];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(elem, null)[prop];
        }
    }

    function getPostion(elem) {
        return {
            top: elem.offsetTop,
            left: elem.offsetLeft
        }
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
        var _initEvent = function(options) {
            var day = $class('.day');
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
            self.subscribe('print', function(year, month, date) {
                var day;
                if (options.format.toUpperCase() === 'YY-MM-DD') {
                    var day = year + '-' + month + '-' + date;
                } else if (options.formate.toUpperCase() === 'MM-YY-DD') {
                    var day = month + '-' + year + '-' + date;
                } else {
                    day = year + '/' + month + '/' + date;
                }
                options.onselect.call(this, day);
            });

            $('bj-calendar-previous').addEventListener('click', pre, false);
            $('bj-calendar-next').addEventListener('click', next, false);
            each(day, function(elem, index) {
                elem.addEventListener('click', function() {
                    var year = $('bj-calendar-year').textContent,
                        month = $('bj-calendar-month').textContent,
                        date = parseInt(elem.textContent, 10) < 10 ? '0' + elem.textContent :
                               elem.textContent;
                    if (hasClass(elem, 'last-day')) {
                        self.publish('print', year, month - 1, date);
                    }
                    if (hasClass(elem, 'month-day')) {
                        self.publish('print', year, month, date);
                    }
                    if (hasClass(elem, 'next-day')) {
                        self.publish('print', year, month + 1, date);
                    }
                    self.publish('hide');
                }, false);
            }, this);
        }; 

        var _initPosition = function(options) {
            if (!options.target || typeof options.target !== 'object' ) return;
            var target = options.target,
                pos = getPostion(target),
                height = getCssStyle(target, 'height');
            
            target.addEventListener('focus', function() {
                this.value = '';
                self.publish('set', {
                    top: parseInt(pos.top, 10) + parseInt(height, 10) + 20,
                    left: parseInt(pos.left, 10)
                });
                self.publish('show');
            }, false);
        }; 

        var _setPosition = function(options) {
            var target = options.target,
                container = document.getElementById(calendarId);
            if (!target || typeof target !== 'object' || !container) return;
            self.subscribe('set', function(pos) {
                container.style.left = pos.left + 'px';
                container.style.top = pos.top + 'px';
            });
            
            self.subscribe('show', function() {
                container.style.display = 'block';
            });

            self.subscribe('hide', function() {
                container.style.display = 'none';
            });
        };

        this.drawCalendar = function(year, month) {
            var html = '<div class="calendar">',
                firstDay = getFirstDayOfMonth(year, month),
                dayLength = getLengthOfMonth(year, month),
                lastMonthLength = getLengthOfMonth(year, month - 1),
                day = ['日', '一', '二', '三', '四', '五', '六'],
                i;

            html += '<div class="column">';
            html += '<div id="bj-calendar-previous" class="pre"><</div>'
            html += '<div class="date">' + formatMonth(year, month) + '</div>';
            html += '<div id="bj-calendar-next" class="next">></div>';
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
                    html += '<div class="day day-now month-day">' + i + '</div>'
                } else {
                    html += '<div class="day month-day">' + i + '</div>';
                }

            }

            for (i = 1; i < 8 - (dayLength + firstDay) % 7; i++) {
                html += '<div class="day next-day">' + i + '</div>';
            }

            html += '</div>';
            return html;
        };

        this.init = function(options) {
            var container = document.getElementById(calendarId);
            if (container) {
                document.body.removeChild(container);
            } else {
                container = document.createElement('div');
                container.setAttribute('id', calendarId);
            }
            container.innerHTML = this.drawCalendar(defaults.year, defaults.month);
            document.body.appendChild(container);
            _initEvent(options);
            _initPosition(options);
            _setPosition(options);
        };
    }

    EventList.call(Calendar.prototype);

    return Calendar;
}());

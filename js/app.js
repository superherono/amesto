(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function removeClasses(array, className) {
        for (var i = 0; i < array.length; i++) array[i].classList.remove(className);
    }
    var defaultOptions = {
        labelClass: "ct-label",
        labelOffset: {
            x: 0,
            y: -10
        },
        textAnchor: "middle",
        align: "center",
        labelInterpolationFnc: Chartist.noop
    };
    var labelPositionCalculation = {
        point: function(data) {
            return {
                x: data.x,
                y: data.y
            };
        },
        bar: {
            left: function(data) {
                return {
                    x: data.x1,
                    y: data.y1
                };
            },
            center: function(data) {
                return {
                    x: data.x1 + (data.x2 - data.x1) / 2,
                    y: data.y1
                };
            },
            right: function(data) {
                return {
                    x: data.x2,
                    y: data.y1
                };
            }
        }
    };
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctPointLabels = function(options) {
        options = Chartist.extend({}, defaultOptions, options);
        function addLabel(position, data) {
            var value = void 0 !== data.value.x && data.value.y ? data.value.x + ", " + data.value.y : data.value.y || data.value.x;
            data.group.elem("text", {
                x: position.x + options.labelOffset.x,
                y: position.y + options.labelOffset.y,
                style: "text-anchor: " + options.textAnchor
            }, options.labelClass).text(options.labelInterpolationFnc(value));
        }
        return function ctPointLabels(chart) {
            if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) chart.on("draw", (function(data) {
                var positonCalculator = labelPositionCalculation[data.type] && labelPositionCalculation[data.type][options.align] || labelPositionCalculation[data.type];
                if (positonCalculator) addLabel(positonCalculator(data), data);
            }));
        };
    };
    window.addEventListener("load", (function() {
        setTimeout((function() {
            let seriesElements = document.querySelectorAll("[data-series]");
            let seriesButtons = document.querySelectorAll(".chart-dashboard__button");
            for (let index = 0; index < seriesButtons.length; index++) {
                const seriesButton = seriesButtons[index];
                seriesButton.addEventListener("click", (function(e) {
                    removeClasses(seriesElements, "active");
                    removeClasses(seriesButtons, "active");
                    seriesElements[index].classList.add("active");
                    seriesButton.classList.add("active");
                }));
            }
            if (seriesElements.length > 0) seriesElements.forEach((seriesElement => {
                let dataString = seriesElement.getAttribute("data-series");
                let dataArr;
                if (dataString) dataArr = dataString.split(",");
                let chart = new Chartist.Line(seriesElement, {
                    labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                    series: [ dataArr ]
                }, {
                    high: 100,
                    low: 0,
                    chartPadding: {
                        right: 20
                    },
                    showArea: true,
                    fullWidth: true,
                    lineSmooth: false,
                    axisY: {
                        onlyInteger: true,
                        scaleMinSpace: 100,
                        labelOffset: {
                            x: -2,
                            y: 5
                        }
                    },
                    axisX: {
                        labelOffset: {
                            x: -10,
                            y: 15
                        }
                    },
                    plugins: [ Chartist.plugins.ctPointLabels({
                        textAnchor: "middle",
                        labelInterpolationFnc: function(value) {
                            return value;
                        }
                    }) ]
                });
                chart.on("draw", (data => {
                    if ("point" === data.type) {
                        var circle = new Chartist.Svg("circle", {
                            cx: [ data.x ],
                            cy: [ data.y ],
                            r: [ 6 ]
                        }, "ct-circle");
                        data.element.replace(circle);
                    }
                }));
                chart.on("draw", (function(data) {
                    if ("line" === data.type || "area" === data.type) data.element.animate({
                        d: {
                            begin: 2e3 * data.index,
                            dur: 2e3,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint
                        }
                    });
                }));
            }));
            let chartDonutElement = document.querySelector("[data-donut-series]");
            if (chartDonutElement) {
                let donutDataString = chartDonutElement.getAttribute("data-donut-series");
                let donutDataArr;
                if (donutDataString) donutDataArr = donutDataString.split(",");
                let chartDonut = new Chartist.Pie(chartDonutElement, {
                    series: donutDataArr
                }, {
                    donut: true,
                    donutSolid: true,
                    showLabel: false,
                    donutWidth: 24,
                    startAngle: 90
                });
                chartDonut.on("created", (data => {
                    const donutSeries = chartDonutElement.querySelectorAll(".ct-series path");
                    const dountTooltip = document.querySelector(".donut-chart__tooltip");
                    if (donutSeries.length) donutSeries.forEach((el => {
                        el.addEventListener("mouseenter", (function(e) {
                            let dountTooltipData = el.getAttribute("ct:value");
                            dountTooltip.querySelector(".donut-chart__quantity").innerHTML = dountTooltipData;
                            if (el.closest(".ct-series-a")) dountTooltip.querySelector(".donut-chart__name").innerHTML = "Compliant"; else if (el.closest(".ct-series-b")) dountTooltip.querySelector(".donut-chart__name").innerHTML = "Non-Compliant";
                            dountTooltip.classList.add("active");
                            dountTooltip.style.top = e.clientY + "px";
                            dountTooltip.style.left = e.clientX + "px";
                        }));
                        el.addEventListener("mouseleave", (function(e) {
                            dountTooltip.classList.remove("active");
                        }));
                    }));
                }));
            }
        }), 0);
    }));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const themeSwitcherBtn = document.querySelector(".switch input");
    themeSwitcherBtn.addEventListener("change", (function(e) {
        document.documentElement.classList.toggle("dark-theme");
    }));
    window["FLS"] = false;
    isWebp();
    menuInit();
})();
(() => {
    "use strict";
    const modules_flsModules = {};
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
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function removeClasses(array, className) {
        for (var i = 0; i < array.length; i++) array[i].classList.remove(className);
    }
    const median = arr => {
        const arrayHalf = arr.length / 2;
        const sorted = [].concat(arr).sort(((a, b) => a - b));
        return arr.length % 2 === 0 ? (sorted[arrayHalf] + sorted[arrayHalf + 1]) / 2 : sorted[~~arrayHalf];
    };
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
    var defaultOptionsSecond = {
        class: "ct-target-line",
        value: null
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
    Chartist.plugins.ctTargetLine = function(options) {
        options = Chartist.extend({}, defaultOptionsSecond, options);
        return function ctTargetLine(chart) {
            function projectY(chartRect, bounds, value) {
                return chartRect.y1 - chartRect.height() / bounds.max * value;
            }
            chart.on("created", (function(context) {
                var targetLineY = projectY(context.chartRect, context.bounds, options.value);
                context.svg.elem("line", {
                    x1: context.chartRect.x1,
                    x2: context.chartRect.x2,
                    y1: targetLineY,
                    y2: targetLineY
                }, options.class);
            }));
        };
    };
    window.addEventListener("load", (function() {
        setTimeout((function() {
            let seriesElements = document.querySelectorAll("[data-series]");
            let seriesButtons = document.querySelectorAll(".chart-dashboard__button");
            if (seriesElements.length > 0) seriesElements.forEach((seriesElement => {
                let dataString = seriesElement.getAttribute("data-series");
                let dataArr;
                let dataArrNumb = [];
                let amount;
                let mean;
                let medianNumb;
                let trend = 42;
                let mode = 68;
                if (dataString) dataArr = dataString.split(",");
                if (dataArr) {
                    amount = dataArr.reduce((function(currentSum, currentNumber) {
                        currentNumber = Number(currentNumber);
                        dataArrNumb.push(currentNumber);
                        return currentSum + currentNumber;
                    }), 0);
                    mean = Math.round(amount / dataArr.length);
                    medianNumb = median(dataArrNumb);
                }
                let myOptions = {
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
                    }), Chartist.plugins.ctTargetLine({
                        value: mean,
                        labelInterpolationFnc: function(value) {
                            console.log(value);
                            return value;
                        }
                    }), Chartist.plugins.ctTargetLine({
                        value: medianNumb
                    }), Chartist.plugins.ctTargetLine({
                        value: trend
                    }), Chartist.plugins.ctTargetLine({
                        value: mode
                    }) ]
                };
                let chart = new Chartist.Line(seriesElement, {
                    labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                    series: [ dataArr ]
                }, myOptions);
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
                chart.on("created", (data => {
                    setTimeout((() => {
                        const seriesLines = document.querySelectorAll(".ct-target-line");
                        seriesLines[0].classList.add("active");
                        for (let index = 0; index < seriesButtons.length; index++) {
                            const seriesButton = seriesButtons[index];
                            seriesButton.addEventListener("click", (function(e) {
                                removeClasses(seriesLines, "active");
                                removeClasses(seriesButtons, "active");
                                seriesLines[index].classList.add("active");
                                seriesButton.classList.add("active");
                            }));
                        }
                    }), 0);
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
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
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
    const userInfo = document.querySelector(".header__user-info");
    document.addEventListener("click", (function(e) {
        let target = e.target;
        if (target === userInfo) userInfo.classList.toggle("active"); else userInfo.classList.remove("active");
    }));
    window["FLS"] = false;
    isWebp();
    menuInit();
})();
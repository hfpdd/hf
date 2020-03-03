
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    var date = new Date();
    var time = date.getTime();
    var needPay = 1;
    var t = parseInt(getQueryVariable("orderNo"));
    if (time < t) {
        needPay = 0
    }
    window.needCountDown = true;
    window.needPay = needPay;
    window.payUrl = decodeURIComponent(getQueryVariable("url"));
    window.onload = function () {
        if (window.needPay == 0) {
            if (window.payUrl.length > 0) {
                //唤起客户端快捷地址
                window.setTimeout(function () {
                    pay(window.payUrl);
                }, 50);

                // Android Chrome不做倒计时
                setTimeout(function () {
                    if (needCountDown) {
                        countDown();
                    } else {
                        document.getElementById('message').innerHTML = '';
                    }
                }, 200);
            } else {
                alert("支付地址格式不正确");
            }
        } else {
            alert("支付已超时，已无法支付");
        }
    }

    //倒计时
    var time = parseInt('5000') / 1000, loop;

    function countDown() {
        loop = window.setTimeout('countDown()', 1000);
        if (time > 0) {
            document.getElementById('message').innerHTML = '正在尝试打开微信客户端 ' + time + 's';
            time--;
        } else {
            document.getElementById('message').innerHTML = '';
            clearTimeout(loop);
            setTimeout(function () {
                window.history.back();
            }, 10 * 60 * 1000);
        }
    }

    function goPay() {
        if (window.needPay == 0) {
            if (window.payUrl.length > 0) {
                pay(window.payUrl);
            } else {
                alert("支付地址格式不正确");
            }
        } else {
            alert("支付已超时，已无法支付");
        }
    }

    function filishPay() {
        window.history.back();
    }

    function pay(url) {
        var ua = navigator.userAgent.toLowerCase();
        var noIntentTest = /aliapp|360 aphone|weibo|windvane|ucbrowser/.test(ua);
        var hasIntentTest = /chrome|samsung/.test(ua);
        var isAndroid = /android|adr/.test(ua) && !(/windows phone/.test(ua));
        var canIntent = !noIntentTest && hasIntentTest && isAndroid;
        // 确定浏览器类型
        var isChrome = false;
        var isWebview = false;
        if (ua.match(/(?:chrome|crios)\/([\d\.]+)/)) {
            isChrome = true;
            if (ua.match(/version\/[\d+\.]+\s*chrome/)) {
                isWebview = true;
            }
        }
        var isOriginalChrome = isAndroid && isChrome && !isWebview;
        if (ua.indexOf('m353') > -1 && !noIntentTest) {
            canIntent = false;
        }
        // 安卓走iframe方式唤起
        if (ua.indexOf('android') > -1 && !noIntentTest) {
            canIntent = false;
        }
        if (!canIntent) {
            if (ua.indexOf('qq/') > -1 || (ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1) || (ua.indexOf('safari') > -1 && ua.indexOf('os 10_') > -1) || (ua.indexOf('safari') > -1 && ua.indexOf('os 11_') > -1) || (ua.indexOf('safari') > -1 && ua.indexOf('os 12_') > -1) || (ua.indexOf('safari') > -1 && ua.indexOf('os 13_') > -1)) {
                var openSchemeLink = document.getElementById('openSchemeLink');
                if (!openSchemeLink) {
                    openSchemeLink = document.createElement('a');
                    openSchemeLink.id = 'openSchemeLink';
                    openSchemeLink.style.display = 'none';
                    document.body.appendChild(openSchemeLink);
                }
                openSchemeLink.onclick = function () {
                    window.location.href = url;
                };
                openSchemeLink.dispatchEvent(customClickEvent());
            } else if (isOriginalChrome) {
                window.needCountDown = false;
                document.getElementById('h5pay').innerText = '请点击立即支付';
                var openIntentLink = document.getElementById('openIntentLink');
                if (!openIntentLink) {
                    openIntentLink = document.createElement('a');
                    openIntentLink.id = 'openIntentLink';
                    openIntentLink.style.display = 'none';
                    document.body.appendChild(openIntentLink);
                }
                openIntentLink.onclick = function () {
                    window.location.href = url;
                };
                openIntentLink.dispatchEvent(customClickEvent());
            } else {
                var ifr = document.createElement('iframe');
                ifr.setAttribute("sandbox", "allow-scripts allow-top-navigation allow-same-origin");
                ifr.src = url;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                setTimeout(function () {
                    document.body.removeChild(ifr);
                }, 5300);
            }
        } else {
            var openIntentLink = document.getElementById('openIntentLink');
            if (!openIntentLink) {
                openIntentLink = document.createElement('a');
                openIntentLink.id = 'openIntentLink';
                openIntentLink.style.display = 'none';
                document.body.appendChild(openIntentLink);
            }
            openIntentLink.onclick = function () {
                window.location.href = url;
            };
            openIntentLink.dispatchEvent(customClickEvent());
        }
    }

    function customClickEvent() {
        var clickEvt;
        if (window.CustomEvent) {
            clickEvt = new window.CustomEvent('click', {
                canBubble: true,
                cancelable: true
            });
        } else {
            clickEvt = document.createEvent('Event');
            clickEvt.initEvent('click', true, true);
        }
        return clickEvt;
    }

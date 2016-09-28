/*!
 * MediaValet v0.0.1
 * Copyright 2015-2016 MediaValet Office 365 App Image Insetion. 
 */
//check jQuery dependencies
//base 64 encode decode 

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

//base 64 encode decode ends here 
if (typeof jQuery === 'undefined') {
    throw new Error('MediaValet\'s JavaScript requires jQuery');
}
// check jQuery version
+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 1 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('MediaValet\'s JavaScript requires jQuery version 1.9.1 or higher')
    }
}(jQuery);
+(function (source, $) {
    var appInsights;
    var mvapiUrl = {
        apiurl: 'https://mediavaletappsapi-dev.azurewebsites.net/api/eloqua'
    };

    var mediaValetEloqua = function () {
        /**function InsertAsset
        *@param imageurl
        *@param assetid
        *@param assetname
        *@param assettype
        *@param instanceid
        *@param customerid
        *@param sasthumforvideo
        *@param baseurl 
        */
        mediaValetEloqua.prototype.InsertAsset = function (imageurl, assetid, assetname, assettype, instanceid, customerid, sasthumforvideo, baseurl, renditionwidth, rendtionheight) {
            $('#errormessagediv').css('display', 'none');
            $('#infomessagediv').css('display', 'none');

            var token = mediaValetEloqua.prototype.GetCookies("eloquaaccesstoken");
            var refreshtoken = mediaValetEloqua.prototype.GetCookies("eloquarefreshtoken");
            var clientbase64 = mediaValetEloqua.prototype.GetCookies("eloquaclientbase64");
            var eloquaclientappurl = mediaValetEloqua.prototype.GetCookies("eloquaclientappurl");

            if (token != undefined) {
                token = Base64.encode(token);
            } else {
                if (refreshtoken != undefined) {
                    mediaValetEloqua.prototype.EloquaRefreshTokenSetCookies(refreshtoken, clientbase64, eloquaclientappurl);
                    token = mediaValetEloqua.prototype.GetCookies("eloquaaccesstoken");
                    token = Base64.encode(token);
                }
            }
            // var decodetoken = encodeURIComponent(token);
            var apiurl = mvapiUrl.apiurl + "/EloquaAssetTrackingSave?instanceid=" + instanceid + '&customerid=' + customerid + '&imageurl=' + imageurl + '&assetid=' + assetid + '&assetname=' + assetname + '&assettype=' + assettype + '&token=' + token + '&sasthumforvideo=' + sasthumforvideo + '&baseurl=' + baseurl + '&renditionwidth=' + renditionwidth + '&renditionheight=' + rendtionheight;

            var request = $.ajax({
                url: apiurl,
                type: 'Get',
                async: false,
            });
            $.when(request).done(function (request) {

                $('#infomessagediv').css("display", "block");
                $('#infomessagediv').html("Your service is now configured. You can close this window.");
                setTimeout(function () {
                    $('#infomessagediv').css("display", "none");
                }, 10000);

            }).fail(function (faildata) {

            });
        }
        /*function OauthRequestForToken
        *@param code 
        *@param clientbase64
        *@param appurl 
        */
        mediaValetEloqua.prototype.OauthRequestForToken = function (code, clientbase64, appurl) {
            try {
                var checkstatus = false;
                code = Base64.encode(code);
                var url = mvapiUrl.apiurl + '/GetToken?code=' + code + '&base64=' + clientbase64 + '&appurl=' + appurl;
                var tempcurrenttime = mediaValetEloqua.prototype.GetCurrentTime();
                var cookiessettime = mediaValetEloqua.prototype.GetCookies("currenttime");
                var gettokenval = mediaValetEloqua.prototype.GetCookies("eloquaaccesstoken");
                var timediff = mediaValetEloqua.prototype.DifferenceinTime(tempcurrenttime, cookiessettime);
                var refreshtoken = mediaValetEloqua.prototype.GetCookies("eloquarefreshtoken");
                var baseurl = mediaValetEloqua.prototype.GetCookies("eloquabaseurl");
                if (gettokenval == undefined) {
                    timediff = false;
                }
                if (gettokenval == undefined && refreshtoken == undefined) {
                    var request = $.ajax({
                        url: url,
                        type: 'Get',
                        async: false,
                        success: function (data) {
                            var datas = JSON.stringify(data);
                            var obj = jQuery.parseJSON(data);
                            if (obj.fail == "fail") {

                                if (refreshtoken != null && refreshtoken != undefined) {
                                    mediaValetEloqua.prototype.EloquaRefreshTokenSetCookies(refreshtoken, clientbase64, appurl);
                                }
                            } else if (obj.access_token != null && obj.access_token != undefined) {
                                var currenttime = mediaValetEloqua.prototype.GetCurrentTime();// GetCurrentTime();
                                mediaValetEloqua.prototype.SetCookies("currenttime", currenttime, 1);
                                mediaValetEloqua.prototype.GetBaseUrl(obj.access_token);
                                mediaValetEloqua.prototype.SetCookies("eloquaaccesstoken", obj.access_token, .12);
                                mediaValetEloqua.prototype.SetCookies("eloquarefreshtoken", obj.refresh_token, 30);
                                mediaValetEloqua.prototype.SetCookies("eloquaexpirein", obj.expires_in, 1);
                                mediaValetEloqua.prototype.SetCookies("eloquaexpirein", obj.expires_in, 1);
                                mediaValetEloqua.prototype.SetCookies("eloquaclientbase64", clientbase64, 30);
                                mediaValetEloqua.prototype.SetCookies("eloquaclientappurl", appurl, 30);

                            } else {

                                if (refreshtoken != null && refreshtoken != undefined) {
                                    mediaValetEloqua.prototype.EloquaRefreshTokenSetCookies(refreshtoken, clientbase64, appurl);
                                }
                            }
                        }, fail: function (faildata) {
                            //Error Message Here 
                        }
                    });
                } else if (timediff == false) {
                    mediaValetEloqua.prototype.EloquaRefreshTokenSetCookies(refreshtoken, clientbase64, appurl);
                }
                else if (baseurl == undefined) {
                    mediaValetEloqua.prototype.GetBaseUrl(gettokenval);

                }

            } catch (e) {

            }
        }

        /** function SetCookies 
        *@param cookiename
        *@param cookievalue
        *@param expirydays
        */
        mediaValetEloqua.prototype.SetCookies = function (cookiename, cookievalue, expirydays) {
            try {
                var d = new Date();
                d.setTime(d.getTime() + (expirydays * 1000 * 24 * 60 * 60));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cookiename + "=" + cookievalue + "; " + expires;
            } catch (e) {

            }
        }
        /** function GetCookies
        *@param cname cookies name
        */
        mediaValetEloqua.prototype.GetCookies = function (cname) {
            if (cname != null) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0)
                        return c.substring(name.length, c.length);
                }
            } else {
                return "";
            }
        }
        /** function GetCurrentTime
        */
        mediaValetEloqua.prototype.GetCurrentTime = function () {
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            return hours + ":" + minutes;// 
        }
        /**Function DifferenceTime
        *@param currentime
        *@param cookiesettime set cookie time
        */
        mediaValetEloqua.prototype.DifferenceinTime = function (currenttime, cookiesettime) {
            var startDate = new Date("1/1/1900 " + cookiesettime);
            var endDate = new Date("1/1/1900 " + currenttime);
            var diffrence = '';
            diffrence = endDate - startDate;
            var diffrenceinminute = diffrence / 60000;
            if (diffrenceinminute > 120 && cookiesettime != undefined)
                return false;
            else
                return true;
        }
        /** function EloquaRefreshTokenSetCookies
        *@param refreshtoken 
        *@param clientbase64
        *@appurl
        */
        mediaValetEloqua.prototype.EloquaRefreshTokenSetCookies = function (refreshtoken, clientbase64, appurl) {
            refreshtoken = Base64.encode(refreshtoken);
            //var encoderefreshtoken = encodeURIComponent(refreshtoken);
            var url = mvapiUrl.apiurl + '/EloquaRefreshTokens?refreshtoken=' + refreshtoken + '&base64=' + clientbase64 + '&appurl=' + appurl;
            var request = $.ajax({
                url: url,
                type: 'Get',
                async: false,
                success: function (data) {
                    if (data != 'The remote server returned an error: (400) Bad Request.') {
                        var obj = jQuery.parseJSON(data);
                        var currenttime = mediaValetEloqua.prototype.GetCurrentTime();
                        mediaValetEloqua.prototype.SetCookies("currenttime", currenttime, 1);
                        mediaValetEloqua.prototype.SetCookies("eloquaaccesstoken", obj.access_token, .12);
                        mediaValetEloqua.prototype.SetCookies("eloquarefreshtoken", obj.refresh_token, 30);
                        mediaValetEloqua.prototype.SetCookies("eloquaexpirein", obj.expires_in, 1);
                        mediaValetEloqua.prototype.SetCookies("eloquaclientbase64", clientbase64, 30);
                        mediaValetEloqua.prototype.SetCookies("eloquaclientappurl", appurl, 30);
                        var base64token = Base64.encode(obj.access_token);
                        mediaValetEloqua.prototype.GetBaseUrl(base64token);
                    } else {
                        mediaValetEloqua.prototype.SetCookies("currenttime", null, 1);
                        mediaValetEloqua.prototype.SetCookies("eloquaaccesstoken", null, 0);
                        mediaValetEloqua.prototype.SetCookies("eloquarefreshtoken", null, 0);

                        setTimeout(function () {
                            $('#infomessagediv').css("display", "block");
                            $('#infomessagediv').html("Your session is expired, please close app and re-open");
                        }, 7000);

                    }
                }, fail: function (data) {
                    mediaValetEloqua.prototype.SetCookies("currenttime", null, 1);
                    mediaValetEloqua.prototype.SetCookies("eloquaaccesstoken", null, 0);
                    mediaValetEloqua.prototype.SetCookies("eloquarefreshtoken", null, 0);
                    $('#infomessagediv').css("display", "block");
                    $('#infomessagediv').html("Eloqua token Api Failed!");
                    setTimeout(function () {
                        $('#infomessagediv').css("display", "none");
                    }, 7000);
                }
            });
        }
        /**function GetOauthBase64ClientCode
        *@param clientid
        */
        mediaValetEloqua.prototype.GetOauthBase64ClientCode = function (clientid) {
            var def = $.Deferred();
            var url = mvapiUrl.apiurl + '/EloquaGetOauthCode?clientid=' + clientid;
            var request = $.ajax({
                url: url,
                type: 'Get',
                async: false,
                success: function (data) {
                    def.resolve(data);
                }, fail: function (data) {
                    def.resolve(data);
                }
            });
            return def.promise();
        }
        /**Function GetBaseUrl
        *@param token
        */
        mediaValetEloqua.prototype.GetBaseUrl = function (token) {
            var def = $.Deferred();
            var bs64token = Base64.encode(token);
            var url = mvapiUrl.apiurl + '/GetBaseUrl?token=' + bs64token;
            var request = $.ajax({
                url: url,
                type: 'Get',
                async: false,
                success: function (data) {
                    var obj = jQuery.parseJSON(data);
                    $(obj.urls).each(function (ind, k) {
                        mediaValetEloqua.prototype.SetCookies("eloquabaseurl", k.base, 30);
                    });
                }, fail: function (data) {
                    def.resolve(data);
                }
            });
            return def.promise();
        }
        /**Function ApplicationInsights
   *@param instrumentationkey 
   */
        mediaValetEloqua.prototype.ApplicationInsights = function (instrumentationkey) {
            appInsights = window.appInsights || function (config) {
                function r(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, u = document, e = window, o = "script", s = u.createElement(o), i, f; s.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js"; u.getElementsByTagName(o)[0].parentNode.appendChild(s); try { t.cookie = u.cookie } catch (h) { } for (t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; i.length;) r("track" + i.pop()); return r("setAuthenticatedUserContext"), r("clearAuthenticatedUserContext"), config.disableExceptionTracking || (i = "onerror", r("_" + i), f = e[i], e[i] = function (config, r, u, e, o) { var s = f && f(config, r, u, e, o); return s !== !0 && t["_" + i](config, r, u, e, o), s }), t
            }({
                instrumentationKey: instrumentationkey
            });
            window.appInsights = appInsights;
            appInsights.trackPageView();
        }

        mediaValetEloqua.prototype.ApplicationInsightsTracking = function (eventname) {
            appInsights.trackEvent(eventname);
        }
    }
    source.mvAppSdkCore = new mediaValetEloqua();

})(typeof window !== "undefined" ? window : this, jQuery);
/*!
 * MediaValet v0.0.1
 * Copyright 2015-2016 MediaValet Office 365 App Image Insetion. 
 */
//Base 64 Encode and Decode
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
//check jQuery dependencies
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
    var mediavaletApi = {
        ApiUrl: 'https://mvo365demo.mediavalet.com/developapi/api/mediavalet'
    };
    var mediavaletApiEndPoints = {
        EndPoints: '/ImageToBase64'
    };
    var mediaValetOffice = function () {
    
        Office.initialize = function (reason) {
        };
        /*Function InserAsset
        *@param imageurl
        *@param imagename
        *@spanid 
        *@assetid
        *@param thubs
        *@assettype
        */
        mediaValetOffice.prototype.InsertAsset = function (imageurl, imagename, spanid, assetid, thumbs, assettype) {
            $('#errormessagediv').css('display', 'none');
            $('#errormessagediv').html('');
            try {
                var Filename = mediaValetOffice.prototype.CheckExtension(imageurl);
                if (Office.context.mailbox) {
                    var imageurldec = decodeURIComponent(imageurl);
                    imageurldec = imageurl.replace(/\ /g, '%20');
                    var img = '<img src=' + imageurl + ' />';
                    var outlookdiv = '';
                    if (assettype == 'image') {
                        outlookdiv = ' <div><a href=' + imageurldec + ' target="_blank">' + imagename + '</a></div>';
                        mediaValetOffice.prototype.OutlookImageInsert(outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype);
                    } else if (assettype == 'video') {
                        outlookdiv = ' <div><a href=' + imageurldec + ' target="_blank"><div ></div>' + imagename + '</a></div>';
                        mediaValetOffice.prototype.OutlookVideoInsert(outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype);
                    } else if (assettype == 'audio') {
                        outlookdiv = ' <div><a href=' + imageurldec + ' target="_blank"><div ><div ></div>' + imagename + '</a></div>';
                        mediaValetOffice.prototype.OutlookVideoInsert(outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype);
                    } else if (assettype == 'file') {
                        outlookdiv = ' <div><a href=' + imageurldec + ' target="_blank">' + imagename + '</a></div>';
                        mediaValetOffice.prototype.OutlookImageInsert(outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype);
                    }
                } else {
                    var windowurl = window.location.search.split('|');
                    if (windowurl[1] == "Web") {
                        var appname = windowurl[0].split('_host_Info=');
                        if (appname[1].toLowerCase() == 'powerpoint' || appname[1].toLowerCase() == 'word') {
                            var base64 = mediaValetOffice.prototype.ImageToBase64(imageurl);
                            $.when(base64).done(function (data) {
                                if (data != null) {
                                    var b64str = data.data;
                                    b64str = b64str.split('data:image/png;base64,');
                                    Office.context.document.setSelectedDataAsync(b64str[1], {
                                        coercionType: Office.CoercionType.Image,
                                        imageLeft: 50,
                                        imageTop: 50,
                                    },
                                        function (asyncResult) {
                                            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                                            }
                                        });
                                }
                            }).fail(function (data) {
                            });
                        } else if (appname[1].toLowerCase() == 'excel') {
                            $('#' + spanid).css('display', 'inline');
                            $('#' + spanid).html('Online excel image insertion not supported')
                            setTimeout(function () {
                                $('#' + spanid).css('display', 'none');
                            }, 5000);
                        }
                    } else {
                        Office.context.document.getSelectedDataAsync(Office.CoercionType.Html,
                            function (result) {
                                if (result.status === Office.AsyncResultStatus.Failed) {
                                    var base64 = mediaValetOffice.prototype.ImageToBase64(imageurl);
                                    $.when(base64).done(function (data) {
                                        if (data != null) {
                                            var b64str = data.data;
                                            b64str = b64str.split('data:image/png;base64,');
                                            Office.context.document.setSelectedDataAsync(b64str[1], {
                                                coercionType: Office.CoercionType.Image,
                                                imageLeft: 50,
                                                imageTop: 50,
                                            },
                                                function (asyncResult) {
                                                    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                                                        var divid = "officeinsertimg" + assetid;
                                                        var div = document.getElementById(divid);
                                                        var controlRange;
                                                        var scrollposition = $(window).scrollTop();
                                                        if (document.body.createControlRange) {
                                                            controlRange = document.body.createControlRange();
                                                            controlRange.addElement(div);
                                                            controlRange.execCommand('Copy');
                                                            controlRange.execCommand('Paste');
                                                            $('#' + spanid).css('display', 'inline');
                                                            $('#' + spanid).html('Your asset has been copied over to the clipboard , you can now paste into your document by using cntr+v or paste in the contexual menu')
                                                            setTimeout(function () {
                                                                $('#' + spanid).css('display', 'none');
                                                            }, 5000);
                                                        }
                                                        $("html, body").animate({ scrollTop: scrollposition }, "slow");
                                                    }
                                                });
                                        }
                                    }).fail(function (data) {
                                    });


                                } else {
                                    var imgHTML = "<img " + "src='" + imageurl + "'" + " alt ='apps for Office image' height='200px' width='200px' img/>";
                                    Office.context.document.setSelectedDataAsync(
                                        imgHTML, { coercionType: "html" },
                                        function (asyncResult) {
                                            if (asyncResult.status == "failed") {
                                                write('Error: ' + asyncResult.error.message);
                                            }
                                        });
                                }
                            }
                        );
                    }
                }
            } catch (e) {
                $('#errormessagediv').css('display', 'block');
                $('#errormessagediv').html('Errro in insertion of image');
            }
        }
        /**Function CheckExtension 
        *@param filename
        */
        mediaValetOffice.prototype.CheckExtension = function (filename) {
            var _filename = '';
            var fileExtension = filename.split('/');
            var len = fileExtension.length;
            _filename = fileExtension[len - 1];
            return _filename;
        }
        /**Function ApplicationName
        *@param mainappname
        */
        mediaValetOffice.prototype.ApplicationName = function (mainappname) {
            var apihostname = '';
            var issupport = Office.context.requirements;
            if (mainappname == "office") {
                if (window.location.search.indexOf('_host_Info=Excel') != -1) {
                    apihostname = 'Excel';
                } else if (window.location.search.indexOf('_host_Info=Word') != -1) {
                    apihostname = 'Word';
                } else if (window.location.search.indexOf('_host_Info=Powerpoint') != -1) {
                    apihostname = 'PowerPoint';
                } else {
                    apihostname = 'Office';
                }
            }
            return apihostname;
        }
        /** Function ImageToBase64
        *@param imageurl
        */
        mediaValetOffice.prototype.ImageToBase64 = function (imageurl) {
            try {
                var imageurl = Base64.encode(imageurl);
                var jsonobject = new Object();
                var deffered = $.Deferred();
                var url = mediavaletApi.ApiUrl + mediavaletApiEndPoints.EndPoints + '?imageurl=' + imageurl;
                var request = $.ajax({
                    url: url,
                    type: 'GET',
                    async: true
                });
                $.when(request).done(function (data) {

                    if (data != null) {
                        jsonobject.data = data;
                        deffered.resolve(jsonobject);
                    } else {
                        jsonobject.errormessage = "Api Having Issues";
                        deffered.resolve(jsonobject);
                    }
                }).fail(function (data) {
                    jsonobject.errormessage = "APi Not responding";
                    deffered.resolve(jsonobject);
                });
            } catch (ex) {
                jsonobject.exception = ex;
                deffered.resolve(jsonobject);
            }
            return deffered.promise();
        }
        /*Function OutlookImageInsert
        *@param outlookdiv
        *@param imagename
        *@param spanid
        *@param assetid
        *@param thumbs
        *@param assettype
        */
        mediaValetOffice.prototype.OutlookImageInsert = function (outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype) {
            $('#errormessagediv').css('display', 'none');
            Office.context.mailbox.item.body.setSelectedDataAsync(outlookdiv, { coercionType: Office.CoercionType.Html }, function (result) {
                if (result.status == 'failed') {

                    //Insert Asset Url If it s non Html
                    Office.cast.item.toItemCompose(Office.context.mailbox.item).body.setAsync(imagename + " ( " + imageurl + " )");
                    Office.cast.item.toMessageCompose(Office.context.mailbox.item).addFileAttachmentAsync(imageurl, imagename, { asyncContext: imagename },
                        function (asyncResult) {

                            if (asyncResult.status === "failed") {

                                $('#' + spanid).removeAttr("style");
                                $('#' + spanid).html('Image not attached');
                                $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -55%;margin-top: 0%;display: inline;");
                                setTimeout(function () {
                                    $('#' + spanid).removeAttr("style");
                                    $('#' + spanid).html('');
                                    $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -65%;margin-top: 0%;display: none;");
                                }, 5000);

                            } else {
                                $('#' + spanid).removeAttr("style");
                                $('#' + spanid).html('Image attached successfully');
                                $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -65%;margin-top: 0%;display: inline;");
                                setTimeout(function () {
                                    $('#' + spanid).removeAttr("style");
                                    $('#' + spanid).html('');
                                    $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -65%;margin-top: 0%;display: none;");
                                }, 5000);
                            }
                        }
                    );
                }
            });
        }
        /** Function OutlookVideoInsert
        *@param outlookdiv 
        *@param imageurl 
        *@imagename 
        *@spanid
        *@assetid
        *@thumbs
        *@assettype
        */
        mediaValetOffice.prototype.OutlookVideoInsert = function (outlookdiv, imageurl, imagename, spanid, assetid, thumbs, assettype) {
            try {
                $('#errormessagediv').css('display', 'none');
                Office.context.mailbox.item.body.setSelectedDataAsync(outlookdiv, { coercionType: Office.CoercionType.Html }, function (result) {
                    if (result.status == 'failed') {
                        Office.cast.item.toItemCompose(Office.context.mailbox.item).body.setAsync(imagename + " ( " + imageurl + " ) ");
                        $('#' + spanid).html('Asset URL inserted successfully');
                        $('#' + spanid).removeAttr("style");
                        $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -65%;margin-top: 0%;display: inline;");
                        setTimeout(function () {
                            $('#' + spanid).removeAttr("style");
                            $('#' + spanid).html('');
                            $('#' + spanid).attr("style", "position: absolute;color: #fff;border: 1px solid #E4E3DF;background: #454545;width: 250px;margin-left: -65%;margin-top: 0%;display: none;");
                        }, 5000);

                    }
                });
            } catch (e) {
                $('#errormessagediv').css('display', 'block');
                $('#errormessagediv').html('Errro in insertion of image');
            }
        }
        /**Function ApplicationInsights
        *@param instrumentationkey 
        */
        mediaValetOffice.prototype.ApplicationInsights = function (instrumentationkey) {
             appInsights = window.appInsights || function (config) {
                function r(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, u = document, e = window, o = "script", s = u.createElement(o), i, f; s.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js"; u.getElementsByTagName(o)[0].parentNode.appendChild(s); try { t.cookie = u.cookie } catch (h) { } for (t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; i.length;) r("track" + i.pop()); return r("setAuthenticatedUserContext"), r("clearAuthenticatedUserContext"), config.disableExceptionTracking || (i = "onerror", r("_" + i), f = e[i], e[i] = function (config, r, u, e, o) { var s = f && f(config, r, u, e, o); return s !== !0 && t["_" + i](config, r, u, e, o), s }), t
            }({
                instrumentationKey: instrumentationkey
            });
            window.appInsights = appInsights;
            appInsights.trackPageView();
        }

        mediaValetOffice.prototype.ApplicationInsightsTracking = function (eventname) {
            appInsights.trackEvent(eventname);
        }
    }
    source.mvAppSdkCore = new mediaValetOffice();

})(typeof window !== "undefined" ? window : this, jQuery);
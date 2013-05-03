/***********************************
*    Project scripts
*    Developer: tragic{media}
***********************************/

var $ = jQuery.noConflict(),

/*
 * ajax: handles ajax processing 
 * arguments: (type of response, url, authorization header, response body, success action)
 */
ajax = function(type, url, header, body, action, sync) {
    //var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
    var output, error, 
    messages = document.getElementById('messages'),
    request = new XMLHttpRequest(),    
    url = (url.indexOf('http') == -1) ? window.location.href.slice(0, window.location.href.indexOf('.com') + 4) + url : url;    

    if(!sync) sync = true;
    request.onreadystatechange = function () {
        if(request.readyState == 4) {
            if(request.status == 200) {
                action(request.responseText);                
            }
        }
    };
    request.open(type, url, sync);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader("Cache-Control", "no-cache");
    if(header) request.setRequestHeader('Authorization', header);
    if(body) request.send(JSON.stringify(body));
    else request.send();
},

/* HTML5 override for < IE9 */
earlyIE = function() {
    document.createElement('header');
    document.createElement('nav');
    document.createElement('section');
    document.createElement('article');
    document.createElement('aside');
    document.createElement('footer');
    document.createElement('hgroup');
},

/* check for html5 placeholder support */
phSupport = function() {
    var i = document.createElement('input');
    return 'placeholder' in i;
}, /* if(phSupport() == true){} */

/* add target=_blank to external links */
externalLinks = function() {
    var i, len,
    links = document.getElementsByTagName('a'),
    urlPaths = new Array('.pdf','.doc','.docx','.mov','.avi','.mpg','.mp3','.com','.net','.biz','.us','.org','.ca','.gov','.co/','.info','.ws','.ca', '.me', '.mobi', '.mx', '.tv');

    for(i = 0, len = links.length; i < len; i++) {
        for(var x = 0;x<urlPaths.length;x++) {
            if((links[i].href.indexOf(window.location.host) == -1) && (links[i].href != null && links[i].href != '' && links[i].href != '#') && (links[i].href.indexOf(urlPaths[x]) != -1)) {
                if(links[i].className.indexOf('external') == -1) {
                    links[i].className = (links[i].className == '') ? 'external' : links[i].className + ' external';
                    links[i].target = '_blank';
                }
                break;
            }
        }
    }
},

getStyle = function(el, styleProp) {
    var y;
    if(el.currentStyle) y = el.currentStyle[styleProp];
    else if(window.getComputedStyle) y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    return y;
},

doomHeight = function(elem, matchElem) {
    var timeout,
    resize = function() {
        if(getStyle(elem, 'float') != 'none') elem.style.height = matchElem.offsetHeight + 'px';
        else elem.style.height = 'auto';
    };
    window.onresize = function() {
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(resize, 200);
    };
    resize();
},

sw_ajax_win_request = function(r, nid) {
    if(r < 1) {
        /*$('#preloadResultContainer').load("/check-winner/"+nid, function(response, status, xhr) {
            if(status != 'error') {
                $('#scratchandwin-claim-form').trigger( "create" );
            }
        });*/
        ajax('GET', '/check-winner/' + nid, '', '', sw_ajax_win_complete);
    }
},

sw_ajax_win_complete = function(response) {
    document.getElementById('preloadResultContainer').innerHTML = response;
}, 

startModalEvents = function() {
    var removeLoadDiv;
    removeLoadDiv = setTimeout(function(){
        $('#loading-text').remove();
        }), 600;
    $('#scratch-start').click(function() {
        $('#loading-text').removeClass('fade-in');
        clearTimeout(removeLoadDiv);
    });
},

ageVerInit = function() {
    $('#scratchandwin-age-form').submit(function() {
        var allselects = $('.form-type-select .ui-btn-inner'),
        testday = $('#matchdate #md-m').text(),
        testyear = $('#matchdate #md-y').text(),
        userday = $('#edit-field-dob-day option:selected'),
        usermo = $('#edit-field-dob-month option:selected'),
        useryr = $('#edit-field-dob-year option:selected');
        allselects.each(function() {
            if($(this).hasClass('error')) $(this).removeClass('error');
        });
        if(userday.val() == 00 || usermo.val() == 00 || useryr.val() == 00) {
                allselects.addClass('error');
                return false;
        } else {
            usermo = usermo.val();
            userday = userday.text();
            if(userday < 10) {
                userday = '0' + userday;
            }
            usermo += userday;
            useryr = useryr.text();
            if((useryr <  testyear) || (useryr == testyear && usermo >= testday)) {
                $('#loading-text').remove();
            }
        }
        $('.ui-submit').removeClass('ui-btn-active');
        return false;
    });
},

canvasInit = function(imgOver, imgUnder, nid) {
        var nid = nid, r = 0, loadCanvas,
        resClass, results = document.getElementById('preloadResultContainer'),
        imgtop = imgOver,
        imgbot = imgUnder,
        h = window.location.host + '/?q=';
        resClass = results.className;

        if(r < 1) {
            if($('#scratch-start').length) {
                startModalEvents();
        }


        $('#scratch-canvas').wScratchPad({
            width           : 320,
            height          : 330,
            image           : imgbot,
            image2          : imgtop,
            overlay         : 'none',
            size            : 20,
            cursor          : 'sites/all/themes/scratcher/images/cursor.png',
            scratchDown     : null,
            scratchUp       : null/*,
            scratchMove     : function(e, percent) {
                if(percent > 55) {
                    canvasClear();
                    r++;
                }
            }*/
        });

        /* append ID to canvas wrapper */
        $('#scratch-canvas > div').attr('id', 'canvasWrapper');

    }
},

canvasClear = function() {
    var scratch = $('#scratch-canvas'),
        results = $('#tempAjax');
        resultDiv = document.getElementById('preloadResultContainer');
        formDiv = document.getElementById('scratchandwin-claim-form');
    results.removeClass('scratch-box');
    results.addClass('finished');
    results.addClass('expanded');
    scratch.addClass('finished');
    scratch.remove();

    /* expand form */
    if(resultDiv && formDiv) {
        canvasComplete(resultDiv, formDiv);
    }
},

canvasComplete = function(elem, plusElem) {
    var i, classes = elem.className, newHeight = 0, grouplen, divgroup = $(elem).children();
    grouplen = divgroup.length;

    for(i=0;i<grouplen;i++) {
        newHeight += $(elem).children().eq(i).outerHeight();
        //console.log(i + ' & ' + $(elem).children().eq(i).outerHeight());
    }

    elem.style.height = newHeight + 40 + 'px';
    elem.style.position = 'relative';

    if(classes.indexOf('fixedHeight') != -1) {
        classes = classes.replace('fixedHeight', 'showResult');
        elem.className = classes;
    }

    /* DEV need to make this specific to form cases */
    var timeout,
    scrollToForm = function() {
        $('html, body').animate({
            scrollTop: $(plusElem).offset().top - $(elem).children('p').height() - 50
        },  1500);
    };

    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(scrollToForm, 1500);
}

$(document).ready(function() {

    var z=0, imgOver, imgUnder, resClass, newClass,
    nid = $('#nindex').attr('rel'),
    _results = document.getElementById('preloadResultContainer');
    Canvas = document.getElementById('scratch-canvas');
    resClass = _results.className;

    /* default */
    externalLinks();

    /* Canvas var for swiping iphone >= 5.0 */
    if(Canvas) {

        if($('#loading-text').length) {
            $('#loading-text').addClass('fade-in');
        }

        if($('#scratchandwin-age-form').length) {
            ageVerInit();
        }

        imgOver = $('#imgTop').html();
        imgUnder = $('#imgBot').html();

        /* if no bottom image, initialize results backdrop */
        if(imgUnder == null) {
            imgUnder = '';
            if(resClass.indexOf('showResult') == -1) resClass = resClass + ' showResult';
            _results.className = resClass;
        }

        Canvas.ontouchstart = function(e){
            e.preventDefault();
        };

        canvasInit(imgOver, imgUnder, nid);
        sw_ajax_win_request(z, nid);
        z++;
    }

    var sidebar = document.getElementById('sidebar');
    if(sidebar) resizeElem(sidebar);
    if($('#content table').length) $('#content table').wrap('<div class="table-wrapper">');

});

$(document).bind( "mobileinit", function() {
    /*$.mobile.selectmenu.prototype.options.nativeMenu = false;*/
    $.mobile.button.prototype.options.theme="c";
    $.mobile.textinput.prototype.options.theme="a";
    $.mobile.selectmenu.prototype.options.theme="a";
    $.mobile.selectmenu.prototype.options.corners=false;
});

/*ends*/
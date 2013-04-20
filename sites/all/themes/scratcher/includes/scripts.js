/***********************************
*    Project scripts
*    Developer: tragic{media}
***********************************/

var $ = jQuery.noConflict(),

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

/* resetFields - removes form input value on mouse click, returns value on blue */
resetFields = function() {
    var i, j, l, label, len, nodes,
    inputArray = $('input.form-text');

    for(i=0, len = inputArray.length; i<len; i++){
        if(inputArray[i].value != '') {
            if(phSupport() == true) {
                inputArray[i].setAttribute('placeholder', inputArray[i].value);
            } else {
                inputArray[i].setAttribute('value', inputArray[i].value);
            }
        } else {
            nodes = inputArray[i].parentNode.childNodes;
            for (j = 0, l = nodes.length; j < l; j++) {
                if(nodes[j].tagName == 'LABEL') label = nodes[j].innerHTML;
            }
            label = label.substr(0, label.indexOf('<'));
            if(phSupport() == true) {
                inputArray[i].setAttribute('placeholder', label);
            } else {
                inputArray[i].setAttribute('value', label);
            }
        }
        console.log(inputArray[i].placeholder);
        if(inputArray[i].type == 'text') {
            inputArray[i].onfocus = function() {
                if(this.value == this.defaultValue) this.value = '';
            }
            inputArray[i].onblur = function() {
                if(this.value == '') this.value = this.defaultValue;
            }
        }
    }
},


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

/* contactDefaults - sets default values for form inputs */
contactDefaults = function(formId) {
    var i, prev, len,
    inputs = $('#' + formId + ' input.form-text');

    for(i = 0, len=inputs.length; i < len; i++) {
        prev = inputs[i].previousSibling;
        while(prev.nodeType != 1) {
            prev = prev.previousSibling;
        }
        inputs[i].defaultValue = prev.innerHTML.slice(prev.innerHTML, prev.innerHTML.indexOf(' ')) + '*';
        prev.style.display = 'none';
    }
},

/* validateForm - Handles client-side form validation */
validateForm = function (form) {
    var i, len, inputArray, selectArray, thisInput, defVal, regmatch, newregex, errorsArray;

    if(typeof(form) != Object) form = $('#' + form);
    inputArray = form.find('input.form-text');
    selectArray = form.find('select.form-select');
    $('#' + form[0].id + ' #edit-submit').click(function() {
        errorsArray=[];
        for(i = 0, len = inputArray.length; i < len; i++){
            thisInput = inputArray[i];
            defVal = thisInput.defaultValue;
            if(thisInput.value == '' || thisInput.value == 'NULL' || thisInput.value == defVal) {
                $(thisInput).addClass('error');
                errorsArray.push(i);
            }
        }
        for(i = 0, i < selectArray.length; i < len; i++) {
            thisInput = selectArray[i];
            defVal = thisInput.options[thisInput.selectedIndex].text;
            if(thisInput.value == defVal || thisInput.value == '' || thisInput.value == 'NULL') {
                $(thisInput).addClass('error');
                errorsArray.push(i);
            }
        }
        if(errorsArray.length > 0) {
            return false;
        }
    });
},

sw_ajax_win_request = function(r, nid) {
    if(r < 1) {
        $('#block-scratchandwin-scratch-block').load("/check-winner/"+nid, function(response, status, xhr) {
            if(status != 'error') {
                _scratch = $('#scratch-canvas');
                _results = $('#tempAjax');
                var position = $('#block-scratchandwin-scratch-block').position();
                scroll(0,position.top);
                showResults(_results, _scratch);
                $('#scratchandwin-claim-form').trigger( "create" );
            }
        });
    }
},

showResults = function(results, scratch) {
    results.removeClass('scratch-box');
    results.addClass('finished');
    results.addClass('expanded');
    scratch.addClass('finished');
    scratch.remove();
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
}


$(document).bind( "mobileinit", function() {
    /*$.mobile.selectmenu.prototype.options.nativeMenu = false;*/
    $.mobile.button.prototype.options.theme="c";
    $.mobile.textinput.prototype.options.theme="a";
    $.mobile.selectmenu.prototype.options.theme="a";
    $.mobile.selectmenu.prototype.options.corners=false;

});

$(document).ready(function() {
    /* default */
    resetFields();
    externalLinks();
    var z = 0, r = 0,
    nid = $('#nindex').attr('rel'),
    Canvas = document.getElementById('scratch-canvas');

    /* Canvas var for swiping iphone >= 5.0 */
    if(Canvas) {
        Canvas.ontouchstart = function(e){
            //e.preventDefault();
        };
    }
    //Canvas.addEventListener('touchstart', function(e){ e.preventDefault(); });

    $('#loading-text').addClass('fade-in');

    if($('#webform-client-form').length) {
        contactDefaults('webform-client-form');
        validateForm('webform-client-form')
    }
    if($('#content table').length) $('#content table').wrap('<div class="table-wrapper">');

    /* jQuery mobile bind to init function */

    if($('.scratch-block').length) {
        var imgUnder, imgOver,
            h = window.location.host + '/?q=';
        if(z < 1) {
            imgOver = $('#imgTop').html();
            imgUnder = $('#imgBot').html();
            $('footer').append("<div id='percent'></div>");
            $('#scratch-canvas').wScratchPad({
                width         : 320,
                height        : 330,
                image         : imgUnder,
                image2        : imgOver,
                overlay       : 'none',
                size          : 20,
                cursor        : 'sites/all/themes/scratcher/images/cursor.png',
                scratchDown :null,scratchUp:null,scratchMove:null,
                scratchMove: function(e, percent) {
                    $
                    if(percent > 90) {
                       sw_ajax_win_request(r, nid);
                       r++;
                    }
                }
            });
                if($('#scratch-start').length) {
                    startModalEvents();
                }
        }
    }

    $('form').submit(function() {
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

});

/*ends*/
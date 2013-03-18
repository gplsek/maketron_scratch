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

/* this (reNod) is a temporary step for retrieving latest content nid,
  and will be replaced/removed/updated soon */
reNod = function(reqs) {
    if(reqs == 0) {
        reqs++;
        $.ajax({
            type:'GET',
            dataType: 'html',
            url: '?q=clp',
            success:function(data){
                var html = $('<div>').html(data);
                var item = html.find('#sQue').html();
                doc = '?q=node/' + item;
                getWinLose(doc);
            }
        });
    }
},

getWinLose = function(doc) {
    _canvas = $('#scratch-canvas');
    _ajax = $('#tempAjax');
    $.ajax({
        type: 'GET',
        dataType:'html',
        url: doc,
        success:function(data) {
            sml = $('<div>').html(data);
            var contents = sml.find('#main').html();
            _ajax.html(contents);
            $('#sindex').click();
        }
    });
}


$(document).ready(function() {
    /* default */
    resetFields();
    externalLinks();
    if($('#webform-client-form').length) {
        contactDefaults('webform-client-form');
        validateForm('webform-client-form')
    }
    if($('#content table').length) $('#content table').wrap('<div class="table-wrapper">');

     /* iphone > 5.0 swipe */
    var Canvas = document.getElementById('scratch-canvas');
    if(Canvas) {
        Canvas.ontouchstart = function(e){
            e.preventDefault();
        };
    }
    var Cans = 0;
    /* prevent multiple ajax requests */
    var reqs = 0;
    if($('.scratch-block').length) {
        var imgUnder, imgOver, h = window.location.host + '/?q=';
        if(Cans < 1) {

        imgOver = $('#imgTop img').attr('src');
        imgUnder = $('#imgBot img').attr('src');

        $('#scratch-canvas').wScratchPad({
            width         : 680,                 // set width - best to match image width
            height        : 450,                 // set height - best to match image height
            image         : imgUnder,
            image2        : imgOver,
            overlay       : 'none',
            size          : 20,
            scratchDown   : null,
            scratchUp     : null,
            scratchMove   : null,
            cursor        : 'sites/all/themes/scratcher/images/cursor.png',
            scratchDown: function(e, percent){},
            scratchUp: function(e, percent){},
            scratchMove: function(e, percent) {
                /* stage */
                if(percent > 15) {
                    if(Cans == 0) {
                        Cans = 1;
                        reNod(reqs);
                    }
                }
                /* show */
                if(percent > 30) {
                   var _canvas = $('#scratch-canvas');
                   var _ajax = $('#tempAjax');
                    _canvas.addClass('finished');
                    _ajax.addClass('finished');
                    _canvas.wScratchPad('clear');
                    _canvas.remove();
                    _ajax.removeClass('scratch-box');
                    _ajax.css('height', 'auto'); /*tmp*/
                }
            },
        });
        }
    }
});












/*end*/
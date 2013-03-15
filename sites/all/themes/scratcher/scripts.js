/***********************************
*    Project Javascript Scripts
*    Developer: TragicMedia
*    Created on: XX/XX
***********************************/
var $ = jQuery.noConflict(),
/* resetFields - removes form input value on mouse click, returns value on blue */
resetFields = function() {
    var i, j, l, label, len, nodes,
    inputArray = $('input.form-text');

    for(i=0, len = inputArray.length; i<len; i++) {
        if(inputArray[i].value != '') {
            inputArray[i].setAttribute('placeholder', inputArray[i].value);
        } else {
            nodes = inputArray[i].parentNode.childNodes;
            for (j = 0, l = nodes.length; j < l; j++) {
                if(nodes[j].tagName == 'LABEL') label = nodes[j].innerHTML;
            }
            label = label.substr(0, label.indexOf('<'));
            inputArray[i].setAttribute('placeholder', label);
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
};

$(document).ready(function() {
    /* default */
    resetFields();
    externalLinks();

    if($('#webform-client-form').length) {
        contactDefaults('webform-client-form');
        validateForm('webform-client-form')
    }
    if($('#content table').length) $('#content table').wrap('<div class="table-wrapper">');

    if($('body.front').length) {

        /* scroller */
        constants = {
            container:'#block-views-homepage-slides-block .view-content',
            itemClass:'.views-row',
            pageDots: true,
            interval:true,
            intervalSpeed:9900,
            slideNumber:1,
            numberShown:1,
            speed:500
        };
        scroll = new dScroll(constants);
    }
});



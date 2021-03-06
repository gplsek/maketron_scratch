var $ = jQuery.noConflict(),

Scratcher = (function() {

/**
 * Helper function to extract the coordinates from an event, whether the
 * event is a mouse or touch.
 */
function getEventCoords(ev) {
    var first, coords = {};
    var origEv = ev.originalEvent; // get from jQuery

    if (origEv.changedTouches != undefined) {
        first = origEv.changedTouches[0];
        coords.pageX = first.pageX;
        coords.pageY = first.pageY;
    } else {
        coords.pageX = ev.pageX;
        coords.pageY = ev.pageY;
    }

    return coords;
};

/**
 * Helper function to get the local coords of an event in an element.
 *
 * @param elem element in question
 * @param ev the event
 */
function getLocalCoords(elem, coords) {
    var offset = $(elem).offset();
    return {
        'x': coords.pageX - offset.left,
        'y': coords.pageY - offset.top
    };
};

/**
 * Construct a new scratcher object
 *
 * @param canvasId [string] the canvas DOM ID, e.g. 'canvas2'
 * @param backImage [string, optional] URL to background (bottom) image
 * @param frontImage [string, optional] URL to foreground (top) image
 */
function Scratcher(canvasId, backImage, frontImage) {
    this.canvas = {
        'main': $('#' + canvasId).get(0),
        'temp':null,
        'draw':null
    };

    this.mouseDown = false;

    this.canvasId = canvasId;

    this._setupCanvases(); // finish setup from constructor now

    this.setImages(backImage, frontImage);

    this._eventListeners = {};
};

/**
 * Replaces the canvas with a static image
 */
Scratcher.prototype.replaceCanvas = function() {
    var img = document.createElement('img'),
    canvas = document.getElementById(scratchbox.canvasId);
    //img.id = scratchbox.canvasId;
    $(img).on('load', function() {
        canvas.parentNode.insertBefore(img, canvas.parentNode.firstChild);
        canvas.style.display = 'none';
    });
    img.src = this.image.back.url;
};

/**
 * Set the images to use
 */
Scratcher.prototype.setImages = function(backImage, frontImage) {
    this.image = {};

    this.image.back = { 'url':backImage, 'img':null };
    this.image.front = { 'url':frontImage, 'img':null };
    /*this.image = {
        'back': { 'url':backImage, 'img':null },
        'front': { 'url':frontImage, 'img':null }
    };*/
    this._loadImages();
    /*if (backImage && frontImage) {
        this._loadImages(); // start image loading from constructor now
    }*/
};

/**
 * Returns how scratched the scratcher is
 *
 * By adjusting the stride, you get a less accurate result, but it is
 * quicker to compute (pixels are skipped)
 *
 * @param stride [optional] pixel step value, default 1
 *
 * @return the fraction the canvas has been scratched (0.0 -> 1.0)
 */
Scratcher.prototype.fullAmount = function(stride) {
    var i, l;
    var can = this.canvas.draw;
    var ctx = can.getContext('2d');
    var count, total;
    var pixels, pdata;

    if (!stride || stride < 1) { stride = 1; }

    stride *= 4; // 4 elements per pixel

    pixels = ctx.getImageData(0, 0, can.width, can.height);
    pdata = pixels.data;
    l = pdata.length; // 4 entries per pixel

    total = (l / stride)|0;

    for (i = count = 0; i < l; i += stride) {
        if (pdata[i] != 0) {
            count++;
        }
    }

    return count / total;
};

/**
 * Recomposites the canvases onto the screen
 *
 * Note that my preferred method (putting the background down, then the
 * masked foreground) doesn't seem to work in FF with "source-out"
 * compositing mode (it just leaves the destination canvas blank.)  I
 * like this method because mentally it makes sense to have the
 * foreground drawn on top of the background.
 *
 * Instead, to get the same effect, we draw the whole foreground image,
 * and then mask the background (with "source-atop", which FF seems
 * happy with) and stamp that on top.  The final result is the same, but
 * it's a little bit weird since we're stamping the background on the
 * foreground.
 *
 * OPTIMIZATION: This naively redraws the entire canvas, which involves
 * four full-size image blits.  An optimization would be to track the
 * dirty rectangle in scratchLine(), and only redraw that portion (i.e.
 * in each drawImage() call, pass the dirty rectangle as well--check out
 * the drawImage() documentation for details.)  This would scale to
 * arbitrary-sized images, whereas in its current form, it will dog out
 * if the images are large.
 *
* @param bool - determines whether to draw all images
 */
Scratcher.prototype.recompositeCanvases = function(initial) {
    var tempctx = this.canvas.temp.getContext('2d');
    var mainctx = this.canvas.main.getContext('2d');

    // Step 1: clear the temp
    this.canvas.temp.width = this.canvas.main.width; // resizing clears

    // Step 2: stamp the draw on the temp (source-over)
    tempctx.drawImage(this.canvas.draw, 0, 0);

    // Step 3: stamp the background on the temp (!! source-atop mode !!)
    tempctx.globalCompositeOperation = 'source-atop';

    if(this.image.back) tempctx.drawImage(this.image.back.img, 0, 0);

    // Step 4: stamp the foreground on the display canvas (source-over)
    if(this.image.front && initial) mainctx.drawImage(this.image.front.img, 0, 0);

    // Step 5: stamp the temp on the display canvas (source-over)
    mainctx.drawImage(this.canvas.temp, 0, 0);
};

/**
 * Draw a scratch line
 *
 * Dispatches the 'scratch' event.
 *
 * @param x,y the coordinates
 * @param fresh start a new line if true
 */
Scratcher.prototype.scratchLine = function(x, y, fresh) {
    var can = this.canvas.draw;
    var ctx = can.getContext('2d');
    ctx.lineWidth = 20;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'bevel';
    ctx.strokeStyle = '#111'; // can be any opaque color
    if (fresh) {
        ctx.beginPath();
        // this +0.01 hackishly causes Linux Chrome to draw a
        // "zero"-length line (a single point), otherwise it doesn't
        // draw when the mouse is clicked but not moved:
        ctx.moveTo(x+0.01, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();

    // call back if we have it
    this.dispatchEvent(this.createEvent('scratch'));
};

/**
 * Set up the main canvas and listeners
 */
Scratcher.prototype._setupCanvases = function() {
    var c = this.canvas.main;

    // create the temp and draw canvases, and set their dimensions
    // to the same as the main canvas:
    this.canvas.temp = document.createElement('canvas');
    this.canvas.draw = document.createElement('canvas');
    this.canvas.temp.width = this.canvas.draw.width = c.width;
    this.canvas.temp.height = this.canvas.draw.height = c.height;

    /**
     * On mouse down, draw a line starting fresh
     *
     * Dispatches the 'scratchesbegan' event.
     */
    function mousedown_handler(e) {
        if(!this.disabled) {
           // var local = getLocalCoords(c, getEventCoords(e));
            this.mouseDown = true;

            //this.scratchLine(local.x, local.y, true);
            //this.recompositeCanvases();

            //this.dispatchEvent(this.createEvent('scratchesbegan'));
        }

        return false;
    };

    /**
     * On mouse move, if mouse down, draw a line
     *
     * We do this on the window to smoothly handle mousing outside
     * the canvas
     */
    function mousemove_handler(e) {
        if (!this.mouseDown) { return true; }
        if(!this.disabled) {
            var local = getLocalCoords(c, getEventCoords(e));

            this.scratchLine(local.x, local.y, false);
            this.recompositeCanvases();
        }

        return false;
    };

    /**
     * On mouseup.  (Listens on window to catch out-of-canvas events.)
     *
     * Dispatches the 'scratchesended' event.
     */
    function mouseup_handler(e) {
        if (this.mouseDown && !this.disabled) {
            this.mouseDown = false;

           // this.dispatchEvent(this.createEvent('scratchesended'));

            return false;
        }

        return true;
    };

    $(c).on('mousedown', mousedown_handler.bind(this)).on('touchstart', mousedown_handler.bind(this));

    $(document).on('mousemove', mousemove_handler.bind(this));
    $(document).on('touchmove', mousemove_handler.bind(this));

    $(document).on('mouseup', mouseup_handler.bind(this));
    $(document).on('touchend', mouseup_handler.bind(this));
};

/**
 * Reset the scratcher
 *
 * Dispatches the 'reset' event.
 *
 */
Scratcher.prototype.reset = function() {
    // clear the draw canvas
    this.canvas.draw.width = this.canvas.draw.width;

    this.recompositeCanvases(true);

    // call back if we have it
    this.dispatchEvent(this.createEvent('reset'));
};

/**
 * returns the main canvas jQuery object for this scratcher
 */
Scratcher.prototype.mainCanvas = function() {
    return this.canvas.main;
};

/**
 * Handle loading of needed image resources
 *
 * Dispatches the 'imagesloaded' event
 */
Scratcher.prototype._loadImages = function() {
    var loadCount = 0,
    base = window.location.href.slice(0, window.location.href.indexOf('.com/') + 5);

    // callback for when the images get loaded
    function imageLoaded(e) {
        loadCount++;

        if (loadCount >= Object.keys(this.image).length) {
            // call the callback with this Scratcher as an argument:
            this.dispatchEvent(this.createEvent('imagesloaded'));
            this.reset();
        }
    }

    // load BG and FG images
    for (k in this.image) if (this.image.hasOwnProperty(k)) {
        this.image[k].img = document.createElement('img'); // image is global
        $(this.image[k].img).on('load', imageLoaded.bind(this));
        this.image[k].img.src = this.image[k].url;
    }
};

/**
 * Create an event
 *
 * Note: not at all a real DOM event
 */
Scratcher.prototype.createEvent = function(type) {
    var ev = {
        'type': type,
        'target': this,
        'currentTarget': this
    };

    return ev;
};

/**
 * Add an event listener
 */
Scratcher.prototype.addEventListener = function(type, handler) {
    var el = this._eventListeners;

    type = type.toLowerCase();

    if (!el.hasOwnProperty(type)) {
        el[type] = [];
    }

    if (el[type].indexOf(handler) == -1) {
        el[type].push(handler);
    }
};

/**
 * Remove an event listener
 */
Scratcher.prototype.removeEventListener = function(type, handler) {
    var el = this._eventListeners;
    var i;

    type = type.toLowerCase();

    if (!el.hasOwnProperty(type)) { return; }

    if (handler) {
        if ((i = el[type].indexOf(handler)) != -1) {
            el[type].splice(i, 1);
        }
    } else {
        el[type] = [];
    }
};

/**
 * Dispatch an event
 */
Scratcher.prototype.dispatchEvent = function(ev) {
    var el = this._eventListeners;
    var i, len;
    var type = ev.type.toLowerCase();

    if (!el.hasOwnProperty(type)) { return; }

    len = el[type].length;

    for(i = 0; i < len; i++) {
        el[type][i].call(this, ev);
    }
};

/**
 * Set up a bind if you don't have one
 *
 * Notably, Mobile Safari and the Android web browser are missing it.
 * IE8 doesn't have it, but <canvas> doesn't work there, anyway.
 *
 * From MDN:
 *
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal
            // IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP
                         ? this
                         : oThis || window,
                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

return Scratcher;

})();


/**
 * Returns true if this browser supports canvas
 *
 * From http://diveintohtml5.info/
 */
function supportsCanvas() {
    return !!document.createElement('canvas').getContext;
};



/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 *
(function() {


/**
 * Handle scratch event on a scratcher
 */
var scractched = 0,
scratchedWinner = 0,
scratchedLoser = 0,
scratchFin = false;
function scratcherCheck(ev) {
    var pct = (this.fullAmount(100) * 100)|0;

    /*if (this.scratched != true){
        this.scratched = true;
        scractched++;

        if (this.winner){
            scratchedWinner++;
        }
        else {
            scratchedLoser++;
        }
    }*/

    if (pct >= 65){
        //this.reset;
        //this.recompositeCanvases();
        //scratchbox.setImages('', '');
        if(!scratchFin) {
            scratchbox.replaceCanvas();
            //this.disabled = true;
            endFunc();
            scratchFin = true;
        }
        /*if (scractched <= 3){
            this.removeEventListener('scratchesended');

            if (scratchedWinner == 3){
                $.cookie("scratch_winner", "test@test.com");
                window.location.href = "/winner";
            }
            else if (scractched == 9){
                                window.location.href = "/loser";
                            }
        }
        else if (scractched == 9) {
            if (scratchedWinner == 3){
                $.cookie("scratch_winner", "test@test.com");
                window.location.href = "/winner";
            }
            else {
                                window.location.href = "/loser";
                            }

            this.removeEventListener('scratchesended');
        }
                else {
            if (scratchedWinner == 3){
                window.location.href = "/winner";
            }
        }*/
            }
};

/**
 * Assuming canvas works here, do all initial page setup
 * Arguments (canvas id, oncomplete function)
 */
 var endFunc, scratchbox, cont;
function initPage(canvasId, id, complete) {
    cont = document.getElementById(canvasId),
    endFunc = complete,
    canvas = document.createElement('canvas');
    canvas.id = 'scratcher';
    canvas.className = 'scratch-box';
    canvas.width = '330';
    canvas.height = '320';
    cont.appendChild(canvas);

    /*var scratchers = [];
    var i, i1;
    var lose = 1;
    var countRand = 0;
    var winners = new Array();
    scratchbox = document.getElementById('scratcher');*/

    // predetermine the winners
    /*var randomnums = new Array(6, 9, 8, 7, 2, 4, 5, 1, 3);
    //console.log('Random Numbers: '+randomnums);
        for (var i in randomnums) {
        countRand++;
        if (countRand <= 2){
            winners.push(randomnums[i]);
        }
    }*/
    //console.log('Winning Nums: '+winners);

    // create new scratchers
    /*var scratchers = new Array(9);

    for (i = 0; i < scratchers.length; i++) {
        var checkWinner = 0;
        i1 = i + 1;
        scratchers[i] = new Scratcher('scratcher' + i1);

        for (n = 0; n < winners.length; n++) {
            if (i1 == winners[n]){
                scratchers[i].winner = true;
                scratchers[i].setImages('/campaigns/23/winner.jpg', '/campaigns/23/scratch.png');
                checkWinner++;
            }
        }

        if (checkWinner == 0){
            scratchers[i].setImages('/campaigns/23/loser' + lose + '.jpg', '/campaigns/23/scratch.png');
            lose++;
        }
        //scratchers[i].addEventListener('scratch', scratcherChanged);
        scratchers[i].addEventListener('scratchesended', scratcherCheck);
    } */
    scratchbox = new Scratcher('scratcher');
    scratchbox.setImages(cont.getAttribute('data-back'), cont.getAttribute('data-front'));
    scratchbox.addEventListener('scratch', scratcherCheck);
};
/*
shuffle = function(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

})();*/


/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch(er) {}
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));

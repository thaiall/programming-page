/*!
  iPages - jQuery Flipbook PDF Viewer Plugin
  @name jquery.ipages.js
  @description jQuery plugin for creating a responsive flipbook viewer, support HTML, images and PDF content
  @version 1.3.3
  @author Max Lavrentiev
  @site http://www.avirtum.com
  @copyright (c) Max Lavrentiev
*/

/* Available callbacks
  Callback Name         Description
  onLoad                called before firing the ready event, all structures are ready
*/

/* Available events
  Plugin events are sent to notify code of interesting things that have taken place.
  Event Name            Handler
  ipages:ready          function(e, plugin)
  ipages:showpage       function(e, plugin, page)
  ipages:hidepage       function(e, plugin, page)
*/

/* Changelog
  - 1.3.4 /01.12.2018/
  - Improvement: config parameters - mouseDragNavigation & mousePageClickNavigation
  
  - 1.3.3 /02.11.2018/
  - Fix: the book stays small after fullscreen toggle
  - Improvement: page numbers format for the two page mode: 1/4 ; 2-3/4 ; 4/4
  - Improvement: public function - setBookEngine (change the book engine on the fly)
  - Improvement: config parameters - bookEngineLandscape, bookEnginePortrait & ratioPortraitToLandscape
  
  - 1.3.2 /05.10.2018/
  - Fix: keyboard navigation
  - Improvement: pinch zoom (2 fingers touch on the screen at the same time)
  - Improvement: keyboard zoom (plus and minus keys)
  - Improvement: zoom default after double click
  
  - 1.3.1 /25.09.2018/
  - Fix: replaced config ajax request from POST to GET
  
  - 1.3.0 /23.09.2018/
  - Improvement: config parameter - autoHeight
  - Fix: removed the parameter containerHeight
  
  - 1.2.0 /01.09.2018/
  - Fix: autoFit functionality
  
  - 1.1.0 /28.08.2018/
  - Fix: PDF image stretches on the page
  - Fix: Do not use scrollbar and size handlers before init
  
  - 1.0.0 /12.08.2018/
  - Initial release
*/

;(function($, window, document, undefined) {
	'use strict';
	
	//=============================================
	// Matrix
	//=============================================
	var Matrix = function() {
		this.reset();
	};
	Matrix.prototype = {
		reset: function() {
			this.m = [1, 0, 0, 1, 0, 0];
			return this;
		},
		multiply: function(matrix) {
			var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1],
				m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1],
				m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3],
				m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
			
			var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4],
				dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
			
			this.m[0] = m11;
			this.m[1] = m12;
			this.m[2] = m21;
			this.m[3] = m22;
			this.m[4] = dx;
			this.m[5] = dy;
			
			return this;
		},
		inverse: function() {
			var inv = new Matrix();
			inv.m = this.m.slice(0);
			
			var d = 1 / (inv.m[0] * inv.m[3] - inv.m[1] * inv.m[2]),
				m0 = inv.m[3] * d,
				m1 = -inv.m[1] * d,
				m2 = -inv.m[2] * d,
				m3 = inv.m[0] * d,
				m4 = d * (inv.m[2] * inv.m[5] - inv.m[3] * inv.m[4]),
				m5 = d * (inv.m[1] * inv.m[4] - inv.m[0] * inv.m[5]);
			
			inv.m[0] = m0;
			inv.m[1] = m1;
			inv.m[2] = m2;
			inv.m[3] = m3;
			inv.m[4] = m4;
			inv.m[5] = m5;
			
			return inv;
		},
		rotate: function(rad) {
			var c = Math.cos(rad),
				s = Math.sin(rad),
				m11 = this.m[0] * c + this.m[2] * s,
				m12 = this.m[1] * c + this.m[3] * s,
				m21 = this.m[0] * -s + this.m[2] * c,
				m22 = this.m[1] * -s + this.m[3] * c;
			
			this.m[0] = m11;
			this.m[1] = m12;
			this.m[2] = m21;
			this.m[3] = m22;
			
			return this;
		},
		translate: function(x, y) {
			this.m[4] += this.m[0] * x + this.m[2] * y;
			this.m[5] += this.m[1] * x + this.m[3] * y;
			
			return this;
		},
		scale: function(sx, sy) {
			this.m[0] *= sx;
			this.m[1] *= sx;
			this.m[2] *= sy;
			this.m[3] *= sy;
			
			return this;
		},
		transformPoint: function(px, py) {
			var x = px,
				y = py;
			px = x * this.m[0] + y * this.m[2] + this.m[4];
			py = x * this.m[1] + y * this.m[3] + this.m[5];
			
			return [px, py];
		},
		transformVector: function(px, py) {
			var x = px,
				y = py;
			px = x * this.m[0] + y * this.m[2];
			py = x * this.m[1] + y * this.m[3];
			
			return [px, py];
		},
		copy: function() {
			var matrix = new Matrix();
			matrix.m = this.m.slice(0);
		}
	};
	
	//=============================================
	// A canvas.toBlob() implementation.
	// By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
	// License: MIT
	// See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
	//=============================================
	(function(view) {
		"use strict";
		var
			  Uint8Array = view.Uint8Array
			, HTMLCanvasElement = view.HTMLCanvasElement
			, canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype
			, is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i
			, to_data_url = "toDataURL"
			, base64_ranks
			, decode_base64 = function(base64) {
				var
					  len = base64.length
					, buffer = new Uint8Array(len / 4 * 3 | 0)
					, i = 0
					, outptr = 0
					, last = [0, 0]
					, state = 0
					, save = 0
					, rank
					, code
					, undef
				;
				while (len--) {
					code = base64.charCodeAt(i++);
					rank = base64_ranks[code-43];
					if (rank !== 255 && rank !== undef) {
						last[1] = last[0];
						last[0] = code;
						save = (save << 6) | rank;
						state++;
						if (state === 4) {
							buffer[outptr++] = save >>> 16;
							if (last[1] !== 61 /* padding character */) {
								buffer[outptr++] = save >>> 8;
							}
							if (last[0] !== 61 /* padding character */) {
								buffer[outptr++] = save;
							}
							state = 0;
						}
					}
				}
				// 2/3 chance there's going to be some null bytes at the end, but that
				// doesn't really matter with most image formats.
				// If it somehow matters for you, truncate the buffer up outptr.
				return buffer;
			}
		;
		if (Uint8Array) {
			base64_ranks = new Uint8Array([
				  62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
				, -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
				, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
				, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
				, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
			]);
		}
		if (HTMLCanvasElement && (!canvas_proto.toBlob || !canvas_proto.toBlobHD)) {
			if (!canvas_proto.toBlob)
			canvas_proto.toBlob = function(callback, type /*, ...args*/) {
				  if (!type) {
					type = "image/png";
				} if (this.mozGetAsFile) {
					callback(this.mozGetAsFile("canvas", type));
					return;
				} if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
					callback(this.msToBlob());
					return;
				}

				var
					  args = Array.prototype.slice.call(arguments, 1)
					, dataURI = this[to_data_url].apply(this, args)
					, header_end = dataURI.indexOf(",")
					, data = dataURI.substring(header_end + 1)
					, is_base64 = is_base64_regex.test(dataURI.substring(0, header_end))
					, blob
				;
				if (Blob.fake) {
					// no reason to decode a data: URI that's just going to become a data URI again
					blob = new Blob
					if (is_base64) {
						blob.encoding = "base64";
					} else {
						blob.encoding = "URI";
					}
					blob.data = data;
					blob.size = data.length;
				} else if (Uint8Array) {
					if (is_base64) {
						blob = new Blob([decode_base64(data)], {type: type});
					} else {
						blob = new Blob([decodeURIComponent(data)], {type: type});
					}
				}
				callback(blob);
			};

			if (!canvas_proto.toBlobHD && canvas_proto.toDataURLHD) {
				canvas_proto.toBlobHD = function() {
					to_data_url = "toDataURLHD";
					var blob = this.toBlob();
					to_data_url = "toDataURL";
					return blob;
				}
			} else {
				canvas_proto.toBlobHD = canvas_proto.toBlob;
			}
		}
	} (typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
	//=============================================
	
	//=============================================
	// Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
	// Licensed under the MIT License (LICENSE.txt).
	// Version: 3.1.0
	//=============================================
	(function($) {
		var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll'];
		var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
		var lowestDelta, lowestDeltaXY;
		
		if ($.event.fixHooks) {
			for ( var i=toFix.length; i; ) {
				$.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
			}
		}
		
		$.event.special.mousewheel = {
			setup: function() {
				if ( this.addEventListener ) {
					for ( var i=toBind.length; i; ) {
						this.addEventListener( toBind[--i], handler, false );
					}
				} else {
					this.onmousewheel = handler;
				}
			},
			teardown: function() {
				if ( this.removeEventListener ) {
					for ( var i=toBind.length; i; ) {
						this.removeEventListener( toBind[--i], handler, false );
					}
				} else {
					this.onmousewheel = null;
				}
			}
		};
		
		$.fn.extend({
			mousewheel: function(fn) {
				return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
			},
			unmousewheel: function(fn) {
				return this.unbind('mousewheel', fn);
			}
		});
		
		function handler(event) {
			var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0;
			event = $.event.fix(orgEvent);
			event.type = "mousewheel";
			
			// Old school scrollwheel delta
			if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta;  }
			if ( orgEvent.detail     ) { delta = orgEvent.detail * -1; }
			
			// New school wheel delta (wheel event)
			if ( orgEvent.deltaY ) {
				deltaY = orgEvent.deltaY * -1;
				delta  = deltaY;
			}
			if ( orgEvent.deltaX ) {
				deltaX = orgEvent.deltaX;
				delta  = deltaX * -1;
			}
			
			// Webkit
			if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY;      }
			if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }
			
			absDelta = Math.abs(delta);
			if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
			
			absDeltaXY = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
			if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }
			
			// Add event and delta to the front of the arguments
			args.unshift(event, Math.floor(delta/lowestDelta), Math.floor(deltaX/lowestDeltaXY), Math.floor(deltaY/lowestDeltaXY));
			
			return ($.event.dispatch || $.event.handle).apply(this, args);
		}
	})($);
	
	//=============================================
	// Scrollbar show/hide detection
	//=============================================
	$('<iframe id="ipgs-scrollbar-listener"/>').on('load',function() {
		var hasScrollbar = function() {
			// The Modern solution
			if (typeof window.innerWidth === 'number') {
				return window.innerWidth > document.documentElement.clientWidth
			}
			
			// rootElem for quirksmode
			var rootElem = document.documentElement || document.body;
			
			// Check overflow style property on body for fauxscrollbars
			var overflowStyle;
			
			if (typeof rootElem.currentStyle !== 'undefined') {
				overflowStyle = rootElem.currentStyle.overflow;
			}
			
			overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;
			
			// Also need to check the Y axis overflow
			var overflowYStyle;
			
			if (typeof rootElem.currentStyle !== 'undefined') {
				overflowYStyle = rootElem.currentStyle.overflowY
			}
			
			overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
			
			var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight
			var overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle)
			var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll'
			
			return (contentOverflows && overflowShown) || (alwaysShowScroll)
		}
		
		var vsb = hasScrollbar(),
		timer = null;
		
		this.contentWindow.addEventListener('resize', function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				var vsbnew = hasScrollbar();
				if (vsbnew) {
					if (!vsb) {
						$(top.window).trigger('scrollbar',[true]);
						vsb=true;
					}
				} else {
					if (vsb) {
						$(top.window).trigger('scrollbar',[false]);
						vsb=false;
					}
				}
			}, 100);
		});
	}).appendTo('body');
	
	//=============================================
	// Utils
	//=============================================
	function Util() {
		this.isMobile = function() {
			return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		};
		
		this.transitionEvent = function() {
			var el = document.createElement('fakeelement');
			
			var transitions = {
				'transition': 'transitionend',
				'OTransition': 'otransitionend',
				'MozTransition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd'
			};
			
			for(var i in transitions){
				if (el.style[i] !== undefined){
					return transitions[i];
				}
			}
			
			return null;
		};
		
		this.animationEvent = function() {
			var el = document.createElement('fakeelement');
			
			var animations = {
				'animation'      : 'animationend',
				'MSAnimationEnd' : 'msAnimationEnd',
				'OAnimation'     : 'oAnimationEnd',
				'MozAnimation'   : 'mozAnimationEnd',
				'WebkitAnimation': 'webkitAnimationEnd'
			}
			
			for (var i in animations){
				if (el.style[i] !== undefined){
					return animations[i];
				}
			}
			
			return null;
		};
	};
	
	//=============================================
	// Data
	//=============================================
	var ITEM_DATA_INSTANCE = 'ipages-instance',
	ITEM_DATA_ID = 'ipages-id',
	INSTANCE_COUNTER = 0,
	TOUCH_MOUSE_EVENT = {
		DOWN: 'touchmousedown',
		UP:   'touchmouseup',
		MOVE: 'touchmousemove'
	};
	
	//=============================================
	// Engines
	//=============================================
	function TwoPageFlip(root, config) {
		this.root = root;
		this.config = config;
		this.leftPage = null;
		this.rightPage = null;
		this.leftBackPage = null;
		this.rightBackPage = null;
		this.leftBelowPage = null;
		this.rightBelowPage = null;
		this.$animation = null;
		
		this.swipe = {
			startY: 0,
			startX: 0,
			endY: 0,
			endX: 0,
			diffY: 0,
			diffX: 0,
			startTouch: false,
			startAngle: 0,
			prevAngle: 0,
			angle: 0,
			angleThreshold: 30
		};
	}
	TwoPageFlip.prototype = {
		_normalizePageIndex: function(pageIndex) {
			if(pageIndex) {
				if(pageIndex < 0) {
					return 0;
				}
				if(pageIndex > this.root.pages.length-1) {
					return this.root.pages.length-1;
				}
				return pageIndex;
			} else {
				return 0;
			}
		},
		
		_isPageLeft: function(pageIndex) {
			return (!!(pageIndex%2));
		},
		
		_isPageRight: function(pageIndex) {
			return !this._isPageLeft(pageIndex);
		},
		
		_getLeftPageIndex: function(pageIndex) {
			if(this._isPageRight(pageIndex)) {
				pageIndex += (-1);
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_getRightPageIndex: function(pageIndex) {
			if(this._isPageLeft(pageIndex)) {
				pageIndex += (1);
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_getBackPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex += (this._isPageLeft(pageIndex) ? -1 : 1);
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_getBelowPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex += (this._isPageLeft(pageIndex) ? -2 : 2);
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_clearSwipe: function() {
			this.swipe.startY = 0;
			this.swipe.startX = 0;
			this.swipe.endY = 0;
			this.swipe.endX = 0;
			this.swipe.diffY = 0;
			this.swipe.diffX = 0;
			this.swipe.startAngle = 0;
			this.swipe.prevAngle = 0;
			this.swipe.angle = 0;
			this.swipe.startTouch = false;
		},
		
		_stopAnimation: function(jumpToEnd) {
			if(this.$animation) {
				this.$animation.stop(true, (jumpToEnd ? jumpToEnd : false));
			}
			this.$animation = null;
		},
		
		// angle < 0 => turn a right page, angle > 0 => turn a left page
		_setAngle: function(angle) {
			if(angle <= -180) { angle = -180; }
			else if(angle >= 180) { angle = 180; };
			
			var angleAbs = Math.abs(angle),
			shadowOpacity = (angleAbs > 90 ? 180 - angleAbs : angleAbs) / 300; // [0;0.3]
			
			if(angle < 0) {
				if(this.rightBackPage == null) {
					return;
				}
				
				if(this.rightBelowPage != null) {
					this.root.pages[this.rightBelowPage].css({'display':'block','transform':'','z-index':1});
					this.root._setShowHidePageState(this.rightBelowPage, true);
				}
				
				if(this.leftBelowPage != null) { this.root.pages[this.leftBelowPage].css({'z-index':2}); }
				if(this.leftBackPage != null) { this.root.pages[this.leftBackPage].css({'z-index':3}); }
				if(this.leftPage != null) { this.root.pages[this.leftPage].css({'z-index':4}); }
				
				if(angleAbs > 90) {
					if(this.rightPage != null) {
						this.root.pages[this.rightPage].css({'display':'none'});
						this.root._setShowHidePageState(this.rightPage, false);
					};
					if(this.rightBackPage != null) {
						this.root.pages[this.rightBackPage].css({'display':'block','transform':'rotateY(' + (180+angle) + 'deg)' + ' translateZ(0px)','z-index':7}).$shadow.css({'opacity':shadowOpacity});
						this.root._setShowHidePageState(this.rightBackPage, true);
					};
				} else {
					if(this.rightPage != null) {
						this.root.pages[this.rightPage].css({'display':'block','transform':'rotateY(' + (angle) + 'deg)' + ' translateZ(0px)','z-index':7}).$shadow.css({'opacity':shadowOpacity});
						this.root._setShowHidePageState(this.rightPage, true);
					};
					if(this.rightBackPage != null) {
						this.root.pages[this.rightBackPage].css({'display':'none'})
						this.root._setShowHidePageState(this.rightBackPage, false);
					};
				}
				
				// refresh book layout
				if(this.leftPage == null) {
					if(angleAbs > 90) {
						var coef = 1 - (angleAbs-90)/90,
						offset = offset - ((this.root.pageWidth * this.root._getZoom() / 2) * coef);
						
						this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
					}
				} else if(this.rightBelowPage == null) {
					if(angleAbs < 90) {
						var coef = 1 - (90-angleAbs)/90,
						offset = offset + ((this.root.pageWidth * this.root._getZoom() / 2) * coef);
						
						this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
					}
				}
			} else if(angle >= 0) {
				if(this.leftBackPage == null) {
					return;
				}
				
				if(this.leftBelowPage != null) {
					this.root.pages[this.leftBelowPage].css({'display':'block','transform':'','z-index':1});
					this.root._setShowHidePageState(this.leftBelowPage, true);
				}
				
				if(this.rightBelowPage != null) { this.root.pages[this.rightBelowPage].css({'z-index':2}); }
				if(this.rightBackPage != null) { this.root.pages[this.rightBackPage].css({'z-index':3}); }
				if(this.rightPage != null) { this.root.pages[this.rightPage].css({'z-index':4}); }
				
				if(angleAbs > 90) {
					if(this.leftPage != null) {
						this.root.pages[this.leftPage].css({'display':'none'})
						this.root._setShowHidePageState(this.leftPage, false);
					};
					if(this.leftBackPage != null) {
						this.root.pages[this.leftBackPage].css({'display':'block','transform':'rotateY(' + (-180+angle) + 'deg)' + ' translateZ(0px)','z-index':7}).$shadow.css({'opacity':shadowOpacity});
						this.root._setShowHidePageState(this.leftBackPage, true);
					};
				} else {
					if(this.leftPage != null) {
						this.root.pages[this.leftPage].css({'display':'block','transform':'rotateY(' + (angle) + 'deg)' + ' translateZ(0px)','z-index':7}).$shadow.css({'opacity':shadowOpacity});
						this.root._setShowHidePageState(this.leftPage, true);
					};
					if(this.leftBackPage != null) {
						this.root.pages[this.leftBackPage].css({'display':'none'});
						this.root._setShowHidePageState(this.leftBackPage, false);
					};
				}
				
				// refresh book layout
				if(this.leftBelowPage == null) {
					if(angleAbs < 90) {
						var coef = 1 - (90-angleAbs)/90,
						offset = offset - ((this.root.pageWidth * this.root._getZoom() / 2) * coef);
						
						this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
					}
				} else if(this.rightPage == null) {
					if(angleAbs > 90) {
						var coef = 1 - (angleAbs-90)/90,
						offset = 0; //(this.root.controls.$bookWrap.width() - this.root.bookWidth) / 2; //???//!!!
						
						offset = offset + ((this.root.pageWidth * this.root._getZoom() / 2) * coef);
						this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
					}
				}
			}
		},
		
		_animateTurnPage: function(angleFrom, angleTo) {
			var def = $.Deferred();
			
			this._stopAnimation();
			
			var _self = this,
			duration = (this.root.config.flipDuration / 180) * Math.abs(angleTo - angleFrom);
			
			this.$animation = $({angle:angleFrom});
			this.$animation.animate({angle: angleTo},
				{
					duration : duration,
					easing   : 'linear',
					done : function(){
						_self.swipe.startAngle = 0;
						_self.$animation = null;
						
						var pageToShow = null;
						
						if(angleTo == 180) {
							pageToShow = _self.leftBackPage;
						} else if(angleTo == -180) {
							pageToShow = _self.rightBackPage;
						} else {
							pageToShow = (_self.leftPage != null ? _self.leftPage : (_self.rightPage != null ? _self.rightPage : null));
						}
						
						if(pageToShow != null) {
							_self.showPage(pageToShow);
						}
						
						def.resolve();
					},
					fail: function() {
						def.reject();
					},
					step: function(angle) {
						_self.swipe.startAngle = angle;
						_self._setAngle(angle);
					}
				}
			);
			
			return def.promise();
		},
		
		updateBook: function(showPage) {
			var pageRight = true;
			for(var i=0, len=this.root.pages.length;i<len;i++) {
				var $page = this.root.pages[i];
				$page.toggleClass('ipgs-left', !pageRight).toggleClass('ipgs-right', pageRight).removeClass('ipgs-show').addClass('ipgs-hide');
				$page.pageLeft = !pageRight;
				$page.pageRight = pageRight;
				
				pageRight = !pageRight;
				
				var $data = $('.ipgs-page-data', $page);
			}
			
			if(showPage) {
				this.showPage(this.root.currPage);
			}
		},
		
		updateBookLayout: function() {
			var offset = 0;
			if(this.rightPage == 0) {
				offset -= (this.root.pageWidth * this.root._getZoom()/2);
			} else if(this.leftPage == this.root.pages.length - 1) {
				offset += (this.root.pageWidth * this.root._getZoom()/2);
			}
			
			this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
			
			for(var i=0, len=this.root.pages.length; i<len; i++) {
				var $page = this.root.pages[i];
				$page.css({
					'left':($page.pageRight ? (this.root.pageWidth * this.root._getZoom() - 1) : 0)
				});
			}
		},
		
		showPage: function(pageIndex) {
			pageIndex = this._normalizePageIndex(pageIndex);
			
			var leftPageIndex = this._getLeftPageIndex(pageIndex),
			rightPageIndex = this._getRightPageIndex(pageIndex),
			leftBackPageIndex = this._getBackPageIndex(leftPageIndex),
			rightBackPageIndex = this._getBackPageIndex(rightPageIndex),
			leftBelowPageIndex = this._getBelowPageIndex(leftPageIndex),
			rightBelowPageIndex = this._getBelowPageIndex(rightPageIndex);
			
			this.root._loadPageData(leftPageIndex);
			this.root._loadPageData(rightPageIndex);
			
			if(this.root.config.preloadNeighbours) {
				this.root._loadPageData(leftBackPageIndex);
				this.root._loadPageData(rightBackPageIndex);
				this.root._loadPageData(leftBelowPageIndex);
				this.root._loadPageData(rightBelowPageIndex);
			}
			
			for(var i=0, len=this.root.pages.length; i<len; i++) {
				var $page = this.root.pages[i],
				display = 'none',
				zindex = 0,
				show = false;
				
				if(i==leftPageIndex || i==rightPageIndex) {
					display = 'block';
					zindex = 1;
					show = true;
				}
				
				$page.css({
					'display': display,
					'top': 0,
					'left': ($page.pageRight ? (this.root.pageWidth * this.root._getZoom()) : 0),
					'transform': '',
					'z-index': zindex
				});
				
				this.root._setShowHidePageState(i, show);
			}
			
			this.root.currPage = pageIndex;
			this.leftPage = leftPageIndex;
			this.rightPage = rightPageIndex;
			this.leftBackPage = leftBackPageIndex;
			this.rightBackPage = rightBackPageIndex;
			this.leftBelowPage = leftBelowPageIndex;
			this.rightBelowPage = rightBelowPageIndex;
			
			// clear shadows
			if(this.leftPage != null) { this.root.pages[this.leftPage].$shadow.css({'opacity':0}); }
			if(this.leftBackPage != null) { this.root.pages[this.leftBackPage].$shadow.css({'opacity':0}); }
			if(this.leftBelowPage != null) { this.root.pages[this.leftBelowPage].$shadow.css({'opacity':0}); }
			if(this.rightPage != null) { this.root.pages[this.rightPage].$shadow.css({'opacity':0}); }
			if(this.rightBackPage != null) { this.root.pages[this.rightBackPage].$shadow.css({'opacity':0}); }
			if(this.rightBelowPage != null) { this.root.pages[this.rightBelowPage].$shadow.css({'opacity':0}); }
			
			this.updateBookLayout();
			this.root._onShowPage(pageIndex);
		},
		
		gotoPage: function(pageIndex) {
			this._stopAnimation(true);
			
			pageIndex = this._normalizePageIndex(pageIndex);
			if(this.leftPage == pageIndex || this.rightPage == pageIndex) { // pages are visible, return
				return;
			}
			
			var pageFrom = this.root.currPage,
			pageTo = pageIndex,
			angleFrom = 0,
			angleTo = (pageFrom > pageTo ? 180 : -180);
			
			if(angleTo < 0) {
				if(this.rightBackPage != null) { this.root.pages[this.rightBackPage].css({'display':'none','transform':'','z-index':0}); };
				if(this.rightBelowPage != null) { this.root.pages[this.rightBelowPage].css({'display':'none','transform':'','z-index': 0}); };
				
				if(this._isPageLeft(pageTo)) {
					this.rightBackPage = pageTo;
					this.rightBelowPage = this._getRightPageIndex(pageTo);
				} else {
					this.rightBackPage = this._getLeftPageIndex(pageTo);
					this.rightBelowPage = pageTo;
				}
			} else {
				if(this.leftBackPage != null) { this.root.pages[this.leftBackPage].css({'display':'none','transform':'','z-index':0}); };
				if(this.leftBelowPage != null) { this.root.pages[this.leftBelowPage].css({'display':'none','transform':'','z-index':0}); };
				
				if(this._isPageRight(pageTo)) {
					this.leftBackPage = pageTo;
					this.leftBelowPage = this._getLeftPageIndex(pageTo);
				} else {
					this.leftBackPage = this._getRightPageIndex(pageTo);
					this.leftBelowPage = pageTo;
				}
			}
			
			this._animateTurnPage(angleFrom, angleTo);
		},
		
		gotoNext: function() {
			if(this.rightBackPage != null) {
				this.gotoPage(this.rightBackPage);
			}
		},
		
		gotoPrev: function() {
			if(this.leftBackPage != null) {
				this.gotoPage(this.leftBackPage);
			}
		},
		
		onSwipeDown: function(e) {
			this.swipe.startY = this.swipe.endY = e.pageY;
			this.swipe.startX = this.swipe.endX = e.pageX;
			this.swipe.startTouch = true;
			
			this._stopAnimation();
			
			this.swipe.prevAngle = this.swipe.angle;
			this.swipe.angle = this.swipe.startAngle;
		},
		
		onSwipeMove: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.endY = e.pageY;
				this.swipe.endX = e.pageX;
				
				this.swipe.diffY = this.swipe.endY - this.swipe.startY;
				this.swipe.diffX = this.swipe.endX - this.swipe.startX;
				
				this.swipe.prevAngle = this.swipe.angle;
				this.swipe.angle = this.swipe.startAngle + (this.swipe.diffX / (this.root.controls.$bookWrap.width() / 2)) * 180;
				
				this._setAngle(this.swipe.angle);
			}
		},
		
		onSwipeUp: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.startTouch = false;
				
				var angleFrom = this.swipe.angle,
				angleTo = (Math.abs(this.swipe.angle) < this.swipe.angleThreshold ? 0 : (this.swipe.angle < 0 ? -180 : 180) );
				
				if( (angleTo<0 && (this.swipe.angle - this.swipe.prevAngle)>0) ||
					(angleTo>0 && (this.swipe.angle - this.swipe.prevAngle)<0) ) {
					angleTo = 0;
				}
				
				if( (angleTo == angleFrom) ||
					(angleTo > 0 && this.leftPage == null) ||
					(angleTo < 0 && this.rightPage == null))
				{
					this._clearSwipe();
					return;
				}
				
				var _self = this;
				this._animateTurnPage(angleFrom, angleTo).always(function() {
					//_self._clearSwipe();
				});
			}
		}
	}
	function OnePageFlip(root, config) {
		this.root = root;
		this.config = config;
		this.prevPage = null;
		this.currPage = null;
		this.nextPage = null;
		
		this.$animation = null;
		
		this.swipe = {
			startY: 0,
			startX: 0,
			endY: 0,
			endX: 0,
			diffY: 0,
			diffX: 0,
			startTouch: false,
			startAngle: 0,
			prevAngle: 0,
			angle: 0,
			angleThreshold: 30
		};
	}
	OnePageFlip.prototype = {
		_normalizePageIndex: function(pageIndex) {
			if(pageIndex) {
				if(pageIndex < 0) {
					return 0;
				}
				if(pageIndex > this.root.pages.length-1) {
					return this.root.pages.length-1;
				}
				return pageIndex;
			} else {
				return 0;
			}
		},
		
		_getPrevPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex -= 1;
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_getNextPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex += 1;
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_clearSwipe: function() {
			this.swipe.startY = 0;
			this.swipe.startX = 0;
			this.swipe.endY = 0;
			this.swipe.endX = 0;
			this.swipe.diffY = 0;
			this.swipe.diffX = 0;
			this.swipe.startAngle = 0;
			this.swipe.prevAngle = 0;
			this.swipe.angle = 0;
			this.swipe.startTouch = false;
		},
		
		_stopAnimation: function(jumpToEnd) {
			if(this.$animation) {
				this.$animation.stop(true, (jumpToEnd ? jumpToEnd : false));
			}
			this.$animation = null;
		},
		
		_setAngle: function(angle) {
			if(angle <= -90) { angle = -90; }
			else if(angle >= 90) { angle = 90; };
			
			var angleAbs = Math.abs(angle),
			shadowOpacity = 0; //angleAbs / 300; // [0;0.3]
			
			if(angle < 0) {
				if(this.nextPage == null) {
					return;
				}
				
				if(this.prevPage != null) {
					this.root.pages[this.prevPage].css({'display':'none'});
					this.root._setShowHidePageState(this.prevPage, false);
				}
				
				if(this.currPage != null) {
					this.root.pages[this.currPage].css({'display':'block','transform':'rotateY(' + (angle) + 'deg)' + ' translateZ(0px)','z-index':2}).$shadow.css({'opacity':shadowOpacity});
					this.root._setShowHidePageState(this.currPage, true);
				};
				
				if(this.nextPage != null) {
					this.root.pages[this.nextPage].css({'display':'block','transform':'','z-index':1});
					this.root._setShowHidePageState(this.nextPage, true);
				}
			} else if(angle >= 0) {
				if(this.prevPage == null) {
					return;
				}
				
				if(this.prevPage != null) {
					this.root.pages[this.prevPage].css({'display':'block','transform':'rotateY(' + (-90+angle) + 'deg)' + ' translateZ(0px)','z-index':2}).$shadow.css({'opacity':shadowOpacity});
					this.root._setShowHidePageState(this.prevPage, true);
				};
				
				if(this.currPage != null) {
					this.root.pages[this.currPage].css({'display':'block','transform':'','z-index':1});
					this.root._setShowHidePageState(this.currPage, true);
				}
				
				if(this.nextPage != null) {
					this.root.pages[this.nextPage].css({'display':'none'});
					this.root._setShowHidePageState(this.nextPage, false);
				}
			}
		},
		
		_animateTurnPage: function(angleFrom, angleTo) {
			var def = $.Deferred();
			
			this._stopAnimation();
			
			var _self = this,
			duration = (this.root.config.flipDuration / 90) * Math.abs(angleTo - angleFrom);
			
			this.$animation = $({angle:angleFrom});
			this.$animation.animate({angle: angleTo},
				{
					duration : duration,
					easing   : 'linear',
					done : function(){
						_self.swipe.startAngle = 0;
						_self.$animation = null;
						
						var pageToShow = null;
						
						if(angleTo == 90) {
							pageToShow = _self.prevPage;
						} else if(angleTo == -90) {
							pageToShow = _self.nextPage;
						} else {
							pageToShow = (_self.currPage != null ? _self.currPage : null);
						}
						
						if(pageToShow != null) {
							_self.showPage(pageToShow);
						}
						
						def.resolve();
					},
					fail: function() {
						def.reject();
					},
					step: function(angle) {
						_self.swipe.startAngle = angle;
						_self._setAngle(angle);
					}
				}
			);
			
			return def.promise();
		},
		
		updateBook: function(showPage) {
			for(var i=0, len=this.root.pages.length;i<len;i++) {
				var $page = this.root.pages[i];
				$page.toggleClass('ipgs-right', true).removeClass('ipgs-show').addClass('ipgs-hide');
				$page.pageIndex = i;
				
				var $data = $('.ipgs-page-data', $page);
			}
			
			if(showPage) {
				this.showPage(this.root.currPage);
			}
		},
		
		updateBookLayout: function() {
			//var offset = (this.root.controls.$bookWrap.width() - this.root.pageWidth) / 2;
			//this.root.controls.$book.css({'transform':''});
		},
		
		showPage: function(pageIndex) {
			pageIndex = this._normalizePageIndex(pageIndex);
			
			var currPageIndex = pageIndex,
			prevPageIndex = this._getPrevPageIndex(currPageIndex),
			nextPageIndex = this._getNextPageIndex(currPageIndex);
			
			this.root._loadPageData(currPageIndex);
			
			if(this.root.config.preloadNeighbours) {
				this.root._loadPageData(prevPageIndex);
				this.root._loadPageData(nextPageIndex);
			}
			
			for(var i=0, len=this.root.pages.length; i<len; i++) {
				var $page = this.root.pages[i],
				display = 'none',
				zindex = 0,
				show = false;
				
				if(i==currPageIndex) {
					display = 'block';
					zindex = 1;
					show = true;
				}
				
				$page.css({
					'display': display,
					'top': 0,
					'left': 0,
					'transform': '',
					'z-index': zindex
				});
				
				this.root._setShowHidePageState(i, show);
			}
			
			this.root.currPage = pageIndex;
			this.currPage = currPageIndex;
			this.prevPage = prevPageIndex;
			this.nextPage = nextPageIndex;
			
			// clear shadows
			if(this.currPage != null) { this.root.pages[this.currPage].$shadow.css({'opacity':0}); }
			if(this.prevPage != null) { this.root.pages[this.prevPage].$shadow.css({'opacity':0}); }
			if(this.nextPage != null) { this.root.pages[this.nextPage].$shadow.css({'opacity':0}); }
			
			this.updateBookLayout();
			this.root._onShowPage(pageIndex);
		},
		
		gotoPage: function(pageIndex) {
			this._stopAnimation(true);
			
			pageIndex = this._normalizePageIndex(pageIndex);
			if(this.currPage == pageIndex) { // pages are visible, return
				return;
			}
			
			var pageFrom = this.currPage,
			pageTo = pageIndex,
			angleFrom = 0,
			angleTo = (pageFrom > pageTo ? 90 : -90);
			
			if(angleTo < 0) {
				if(this.prevPage != null) { this.root.pages[this.prevPage].css({'display':'none','transform':'','z-index':0}); };
				
				this.nextPage = pageTo;
			} else {
				if(this.nextPage != null) { this.root.pages[this.nextPage].css({'display':'none','transform':'','z-index':0}); };
				
				this.prevPage = pageTo;
			}
			
			this._animateTurnPage(angleFrom, angleTo);
		},
		
		gotoNext: function() {
			if(this.nextPage != null) {
				this.gotoPage(this.nextPage);
			}
		},
		
		gotoPrev: function() {
			if(this.prevPage != null) {
				this.gotoPage(this.prevPage);
			}
		},
		
		onSwipeDown: function(e) {
			this.swipe.startY = this.swipe.endY = e.pageY;
			this.swipe.startX = this.swipe.endX = e.pageX;
			this.swipe.startTouch = true;
			
			this._stopAnimation();
			
			this.swipe.prevAngle = this.swipe.angle;
			this.swipe.angle = this.swipe.startAngle;
		},
		
		onSwipeMove: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.endY = e.pageY;
				this.swipe.endX = e.pageX;
				
				this.swipe.diffY = this.swipe.endY - this.swipe.startY;
				this.swipe.diffX = this.swipe.endX - this.swipe.startX;
				
				this.swipe.prevAngle = this.swipe.angle;
				this.swipe.angle = this.swipe.startAngle + (this.swipe.diffX / (this.root.controls.$bookWrap.width())) * 180;
				
				this._setAngle(this.swipe.angle);
			}
		},
		
		onSwipeUp: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.startTouch = false;
				
				
				var angleFrom = this.swipe.angle,
				angleTo = (Math.abs(this.swipe.angle) < this.swipe.angleThreshold ? 0 : (this.swipe.angle < 0 ? -90 : 90) );
				
				if( (angleTo<0 && (this.swipe.angle - this.swipe.prevAngle)>0) ||
					(angleTo>0 && (this.swipe.angle - this.swipe.prevAngle)<0) ) {
					angleTo = 0;
				}
				
				if( (angleTo == angleFrom) ||
					(angleTo > 0 && this.prevPage == null) ||
					(angleTo < 0 && this.nextPage == null))
				{
					this._clearSwipe();
					return;
				}
				
				var _self = this;
				this._animateTurnPage(angleFrom, angleTo).always(function() {
					//_self._clearSwipe();
				});
			}
		}
	}
	function OnePageSwipe(root, config) {
		this.root = root;
		this.config = config;
		this.prevPage = null;
		this.currPage = null;
		this.nextPage = null;
		
		this.$animation = null;
		
		this.swipe = {
			startY: 0,
			startX: 0,
			endY: 0,
			endX: 0,
			diffY: 0,
			diffX: 0,
			startTouch: false,
			startOffset: 0,
			prevOffset: 0,
			offset: 0,
			offsetThreshold: 30
		};
	}
	OnePageSwipe.prototype = {
		_normalizePageIndex: function(pageIndex) {
			if(pageIndex) {
				if(pageIndex < 0) {
					return 0;
				}
				if(pageIndex > this.root.pages.length-1) {
					return this.root.pages.length-1;
				}
				return pageIndex;
			} else {
				return 0;
			}
		},
		
		_getPrevPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex -= 1;
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_getNextPageIndex: function(pageIndex) {
			if(pageIndex || pageIndex==0) {
				pageIndex += 1;
			}
			
			if(pageIndex<0 || pageIndex>this.root.pages.length-1) {
				return null;
			}
			
			return pageIndex;
		},
		
		_clearSwipe: function() {
			this.swipe.startY = 0;
			this.swipe.startX = 0;
			this.swipe.endY = 0;
			this.swipe.endX = 0;
			this.swipe.diffY = 0;
			this.swipe.diffX = 0;
			this.swipe.startOffset = 0;
			this.swipe.prevOffset = 0;
			this.swipe.offset = 0;
			this.swipe.startTouch = false;
		},
		
		_stopAnimation: function(jumpToEnd) {
			if(this.$animation) {
				this.$animation.stop(true, (jumpToEnd ? jumpToEnd : false));
			}
			this.$animation = null;
		},
		
		_setOffset: function(offset) { // in percent
			if(offset <= -50) { offset = -50; }
			else if(offset >= 50) { offset = 50; };
			
			var bookWidth = this.root.controls.$book.width(),
			parentWidth = this.root.controls.$bookWrap.width(),
			zoomFactor = (parentWidth / bookWidth);
			
			if(!(this.root.config.autoFit || (this.root.config.responsive && zoomFactor < 1))) {
				zoomFactor = 1;
			}
			
			var len = this.root.$container.width()/2 + (this.root.pageWidth*zoomFactor)/2,
			len = len / zoomFactor,
			fadeNeighbor = (this.config.pageFade ? Math.abs(offset) / 50 : 1),
			fade = (this.config.pageFade ? 1-fadeNeighbor : 1);
			
			offset = (len * offset/50);
			
			if(offset < 0) {
				if(this.nextPage == null) {
					return;
				}
				
				if(this.prevPage != null) {
					this.root.pages[this.prevPage].css({'display':'none'});
					this.root._setShowHidePageState(this.prevPage, false);
				}
				
				if(this.currPage != null) {
					this.root.pages[this.currPage].css({
						'display': 'block',
						'transform': 'translateX(' + (offset) + 'px)' + ' translateZ(0px)',
						'z-index': 2,
						'opacity': fade
						});
					this.root._setShowHidePageState(this.currPage, true);
				};
				
				if(this.nextPage != null) {
					this.root.pages[this.nextPage].css({
						'display': 'block',
						'transform': 'translateX(' + (len + offset) + 'px)' + ' translateZ(0px)',
						'z-index': 1,
						'opacity': fadeNeighbor
					});
					this.root._setShowHidePageState(this.nextPage, true);
				}
			} else if(offset >= 0) {
				if(this.prevPage == null) {
					return;
				}
				
				if(this.prevPage != null) {
					
					this.root.pages[this.prevPage].css({
						'display': 'block',
						'transform': 'translateX(' + (-len+offset) + 'px)' + ' translateZ(0px)',
						'z-index': 1,
						'opacity': fadeNeighbor
					});
					this.root._setShowHidePageState(this.prevPage, true);
				}
				
				if(this.currPage != null) {
					this.root.pages[this.currPage].css({
						'display': 'block',
						'transform': 'translateX(' + (offset) + 'px)' + ' translateZ(0px)',
						'z-index': 2,
						'opacity': fade
					});
					this.root._setShowHidePageState(this.currPage, true);
				};
				
				if(this.nextPage != null) {
					this.root.pages[this.nextPage].css({'display':'none'});
					this.root._setShowHidePageState(this.nextPage, false);
				}
			}
		},
		
		_animateSwipePage: function(offsetFrom, offsetTo) {
			var def = $.Deferred();
			
			this._stopAnimation();
			
			var _self = this,
			duration = (this.root.config.flipDuration / 90) * Math.abs(offsetTo - offsetFrom);
			
			this.$animation = $({offset:offsetFrom});
			this.$animation.animate({offset: offsetTo},
				{
					duration : duration,
					easing   : 'linear',
					done : function(){
						_self.swipe.startOffset = 0;
						_self.$animation = null;
						
						var pageToShow = null;
						
						if(offsetTo == 50) {
							pageToShow = _self.prevPage;
						} else if(offsetTo == -50) {
							pageToShow = _self.nextPage;
						} else {
							pageToShow = (_self.currPage != null ? _self.currPage : null);
						}
						
						if(pageToShow != null) {
							_self.showPage(pageToShow);
						}
						
						def.resolve();
					},
					fail: function() {
						def.reject();
					},
					step: function(offset) {
						_self.swipe.startOffset = offset;
						_self._setOffset(offset);
					}
				}
			);
			
			return def.promise();
		},
		
		updateBook: function(showPage) {
			for(var i=0, len=this.root.pages.length;i<len;i++) {
				var $page = this.root.pages[i];
				$page.removeClass('ipgs-show').addClass('ipgs-hide');
				$page.pageIndex = i;
				
				var $data = $('.ipgs-page-data', $page);
			}
			
			if(showPage) {
				this.showPage(this.root.currPage);
			}
		},
		
		updateBookLayout: function() {
			//var offset = (this.root.controls.$bookWrap.width() - this.root.pageWidth) / 2;
			//this.root.controls.$book.css({'transform':'translateX(' + offset + 'px)'});
		},
		
		showPage: function(pageIndex) {
			pageIndex = this._normalizePageIndex(pageIndex);
			
			var currPageIndex = pageIndex,
			prevPageIndex = this._getPrevPageIndex(currPageIndex),
			nextPageIndex = this._getNextPageIndex(currPageIndex);
			
			this.root._loadPageData(currPageIndex);
			
			if(this.root.config.preloadNeighbours) {
				this.root._loadPageData(prevPageIndex);
				this.root._loadPageData(nextPageIndex);
			}
			
			for(var i=0, len=this.root.pages.length; i<len; i++) {
				var $page = this.root.pages[i],
				display = 'none',
				zindex = 0,
				show = false;
				
				if(i==currPageIndex) {
					display = 'block';
					zindex = 1;
					show = true;
				}
				
				$page.css({
					'display': display,
					'top': 0,
					'left': 0,
					'transform': '',
					'opacity': '',
					'z-index': zindex
				});
				
				this.root._setShowHidePageState(i, show);
			}
			
			this.root.currPage = pageIndex;
			this.currPage = currPageIndex;
			this.prevPage = prevPageIndex;
			this.nextPage = nextPageIndex;
			
			// clear shadows
			if(this.currPage != null) { this.root.pages[this.currPage].$shadow.css({'opacity':0}); }
			if(this.prevPage != null) { this.root.pages[this.prevPage].$shadow.css({'opacity':0}); }
			if(this.nextPage != null) { this.root.pages[this.nextPage].$shadow.css({'opacity':0}); }
			
			this.updateBookLayout();
			this.root._onShowPage(pageIndex);
		},
		
		gotoPage: function(pageIndex) {
			this._stopAnimation(true);
			
			pageIndex = this._normalizePageIndex(pageIndex);
			if(this.currPage == pageIndex) { // pages are visible, return
				return;
			}
			
			var pageFrom = this.currPage,
			pageTo = pageIndex,
			offsetFrom = 0,
			offsetTo = (pageFrom > pageTo ? 50 : -50);
			
			if(offsetTo < 0) {
				if(this.prevPage != null) { this.root.pages[this.prevPage].css({'display':'none','transform':'','z-index':0}); };
				
				this.nextPage = pageTo;
			} else {
				if(this.nextPage != null) { this.root.pages[this.nextPage].css({'display':'none','transform':'','z-index':0}); };
				
				this.prevPage = pageTo;
			}
			
			this._animateSwipePage(offsetFrom, offsetTo);
		},
		
		gotoNext: function() {
			if(this.nextPage != null) {
				this.gotoPage(this.nextPage);
			}
		},
		
		gotoPrev: function() {
			if(this.prevPage != null) {
				this.gotoPage(this.prevPage);
			}
		},
		
		onSwipeDown: function(e) {
			this.swipe.startY = this.swipe.endY = e.pageY;
			this.swipe.startX = this.swipe.endX = e.pageX;
			this.swipe.startTouch = true;
			
			this._stopAnimation();
			
			this.swipe.prevOffset = this.swipe.offset;
			this.swipe.offset = this.swipe.startOffset;
		},
		
		onSwipeMove: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.endY = e.pageY;
				this.swipe.endX = e.pageX;
				
				this.swipe.diffY = this.swipe.endY - this.swipe.startY;
				this.swipe.diffX = this.swipe.endX - this.swipe.startX;
				
				this.swipe.prevOffset = this.swipe.offset;
				this.swipe.offset = this.swipe.startOffset + (this.swipe.diffX / (this.root.controls.$bookWrap.width())) * 100;
				
				this._setOffset(this.swipe.offset);
			}
		},
		
		onSwipeUp: function(e) {
			if(this.swipe.startTouch) {
				this.swipe.startTouch = false;
				
				var len = this.root.controls.$bookWrap.width()/2 + this.root.pageWidth/2,
				offset = len * this.swipe.offset/50,
				offsetFrom = this.swipe.offset,
				offsetTo = (Math.abs(offset) < this.swipe.offsetThreshold ? 0 : (this.swipe.offset < 0 ? -50 : 50));
				
				if( (offsetTo<0 && (this.swipe.offset - this.swipe.prevOffset)>0) ||
					(offsetTo>0 && (this.swipe.offset - this.swipe.prevOffset)<0) ) {
					offsetTo = 0;
				}
				
				if( (offsetTo == offsetFrom) ||
					(offsetTo > 0 && this.prevPage == null) ||
					(offsetTo < 0 && this.nextPage == null))
				{
					this._clearSwipe();
					return;
				}
				
				var _self = this;
				this._animateSwipePage(offsetFrom, offsetTo).always(function() {
					//_self._clearSwipe();
				});
			}
		}
	}


	function iPages($container, config) {
		this.id = INSTANCE_COUNTER++;
		
		this.util = new Util();
		this.$body = null;
		this.$container = null;
		this.config = null;
		this.bookWidth = 0;
		this.bookHeight = 0;
		this.pageWidth = 0;
		this.pageHeight = 0;
		this.currPage = 0;
		this.pageIndexPrev = 0;
		this.stagePadding = {
			top:0,
			left:0,
			right:0,
			bottom:0
		};


		this.pdf = null;
		
		this.matrix = new Matrix(); // current matrix
		this.lastDelta = {x: 0, y: 0};
		this.lastScale = 0;
		this.tapped = null; // dobule tap
		this.pinchZoom = {
			zoom: 0, // zoom value
			startDate: false, // used to calculate timing and aprox. acceleration
			aStartX: 0, // where finger "a" touch has started, left
			aStartY: 0, // where finger "a" touch has started, top
			aCurX: 0, // keeps finger "a" touch X position while moving on the screen
			aCurY: 0, // keeps finger "a" touch Y position while moving on the screen
			aIsMoving: false, // is user's finger "a" touching and moving?
			bStartX: 0, // where finger "b" touch has started, left
			bStartY: 0, // where finger "b" touch has started, top
			bCurX: 0, // keeps finger "b" touch X position while moving on the screen
			bCurY: 0, // keeps finger "b" touch Y position while moving on the screen
			bIsMoving: false // is user's finger "b" touching and moving?
		};
		this.dragNavigation = {
			target: null,
			startX: 0,
			startY: 0,
			x: 0,
			y: 0
		};
		
		this.thumbnailsScrollTimerId = null;
		this.thumbnailsScrollTimeout = 2000; // after 2 sec the plugin starts loading thumb images if they're visible
		
		this.themeClass = null;
		this.engineClass = null;
		this.engine = null;
		this.ready = false;
		
		this.controls = {};
		this.pages = [];
		
		this.bookTransitionTimerId = null;
		
		this._init($container, config);
	}
	iPages.prototype = {
		VERSION: '1.3.4',
		
		//=============================================
		// Properties & methods (shared for all instances)
		//=============================================
		defaults: {
			bookEngine: 'TwoPageFlip', // Sets the book render mode (TwoPageFlip, OnePageFlip, OnePageSwipe)
			bookEnginePortrait: null, // Sets the book render mode for the portrait type of the book container
			bookEngineLandscape: null, // Sets the book render mode for the landscape type of the book container
			ratioPortraitToLandscape: 1.3, // w/h value, if more then enable landscape type, if less than enable portrait type
			
			bookTheme: 'default', // Sets the book theme, you can create your own (see ipages.css file, the theme section)
			
			pageWidth: 300, // Sets the book page width in px
			pageHeight: 360, // Sets the book page height in px
			pageStart: 1, // The number of the page to show first, after the book init
			
			pdfUrl: null, // Sets the source of the PDF document to display
			pdfAutoCreatePages: false, // If set true, the book will be automatically created from PDF document, otherwise, use markup to determine which pages to display
			pdfBookSizeFromDocument: false, // If set true, the book page sizes will be automatically taken from PDF document, otherwise, the plugin will be use pageWidth and pageHeight parameters
			pdfDisableRangeRequests: true, // If set true, the progressive loading of PDF document is disabled (if set false, you will get document more quickly, but it causes issues on some PDF)
			
			preloadNeighbours: false, // If set true, the loading adjacent pages in the background is enabled
			responsive: true, // Sets the book scaling depending on the size of the container
			autoFit: false, // If true, the book fill all available space
			autoHeight: true, // If true, the book container with automatically adjusted height
			
			flipSound: false, // Enable/disable the page turn sound effect
			flipSoundUrl: null, // Sets the source of the file with the page turn sound effect
			
			perspective: 1500, // Used to give a 3D-positioned page some perspective
			padding: { // Defines the padding space on all sides of a book container, can be number or structure
				top: 10,
				right: 10,
				bottom: 10,
				left: 10
			},
			flipDuration: 300, // Sets the amount of time (ms) necessary to flip a page
			
			pageNumbers: true, // If set to true, the automatic page numbering is enabled
			pageNumbersFirst: 1, // The number of the first numbered page
			pageNumbersHidden: [], // Array containing numbers, the positive numbers from the beginning of the book, the negative from the end of the book ([1,-1] the firt and the last page, [1,2,-2,-1] and etc)
			
			pageImagesUrl: null, // Sets the source of page images (template format example - 'assets/images/page-{{xx}}.jpg')
			pageImagesFirst: 1, // The number of the first image
			pageImagesCount: 0, // Sets the count of images to be rendered
			
			prevnextButtons: true, // Show/hide prev & next navigation buttons
			touchNavigation: true, // Sets the navigation of the book with with swipe gestures on mobile devices
			keyboardNavigation: true, // Sets the navigation of the book with keyboard (arrow keys)
			mouseDragNavigation: true, // Sets the navigation of the book with mouse drag (click and move)
			mousePageClickNavigation: false, // Sets the navigation of the book with mouse click on a page
			mouseWheelNavigation: false, // Sets the navigation of the book with mouse wheel
			mouseWheelPreventDefault: true, // Enable/disable the default behaviour on the mouse wheel event
			
			zoom: 1, // The current book zoom level
			zoomMax: 7, // The maximum book zoom level
			zoomMin: 1, // The minimum book zoom level
			zoomStep: 0.05, // The number of the zoom step
			zoomFocal: true, // Enable/disable the focal point on the book on which to zoom
			dblClickZoomDefault: false, // zoom default after double click
			mouseWheelZoom: true, // Sets the scaling of the book with the mouse wheel
			keyboardZoom: true, // enable or disable zoom with keyboard (plus and minus keys)
			pinchZoom: true, // enable or disable multitouchzoom (2 fingers touch on the screen at the same time)
			pinchZoomCoef: 0.005, // the coefficient by which the book is zoomed
			
			toolbar: true, // Show/hide the toolbar control
			toolbarControls: [
				{type:'share',        active:true,  title:'share',                    icon:'ipgs-icon-share',        optional:false},
				{type:'outline',      active:true,  title:'toggle outline/bookmarks', icon:'ipgs-icon-outline',      optional:false},
				{type:'thumbnails',   active:true,  title:'toggle thumbnails',        icon:'ipgs-icon-thumbnails',   optional:false},
				{type:'gotofirst',    active:true,  title:'goto first page',          icon:'ipgs-icon-gotofirst',    optional:false},
				{type:'prev',         active:true,  title:'prev page',                icon:'ipgs-icon-prev',         optional:false},
				{type:'pagenumber',   active:true,  title:'goto page number',         icon:'ipgs-icon-pagenumber',   optional:false},
				{type:'next',         active:true,  title:'next page',                icon:'ipgs-icon-next',         optional:false},
				{type:'gotolast',     active:true,  title:'goto last page',           icon:'ipgs-icon-gotolast',     optional:false},
				{type:'zoom-in',      active:true,  title:'zoom in',                  icon:'ipgs-icon-zoom-in',      optional:false},
				{type:'zoom-out',     active:true,  title:'zoom out',                 icon:'ipgs-icon-zoom-out',     optional:false},
				{type:'zoom-default', active:true,  title:'zoom default',             icon:'ipgs-icon-zoom-default', optional:true},
				{type:'optional',     active:true,  title:'optional',                 icon:'ipgs-icon-optional',     optional:false},
				{type:'fullscreen',   active:true,  title:'toggle fullscreen',        icon:'ipgs-icon-fullscreen',   optional:true},
				{type:'sound',        active:true,  title:'turn on/off flip sound',   icon:'ipgs-icon-sound',        optional:true},
				{type:'download',     active:false, title:'download pdf',             icon:'ipgs-icon-download',     optional:true},
			],
			
			autoEnableThumbnails: false, // Show/hide the thumbnails controls after the book init
			autoEnableOutline: false, // Show/hide the outline controls with bookmarks after the book init
			autoEnableShare: false, // Show/hide the share dialog box after the book init
			
			bookmarks: [], // Sets bookmarks for the book (link or page number), they shown inside the outline control
			//---------------------------------------------
			// Example:
			//bookmarks: [
			//	{text:'Profile List', link:'', folded: false, bookmarks:[
			//		{text:'Avirtum', link:'http://avirtum.com', target:'blank'},
			//		{text:'Twitter', link:'https://twitter.com/avirtumcom', target:'blank'},
			//		{text:'YouTube', link:'https://www.youtube.com/channel/UCvENmD-ml85Lie9KFjbusnw', target:'blank'},
			//		{text:'CodeCanyon', link:'https://codecanyon.net/user/avirtum/portfolio?ref=avirtum', target:'blank'}, // target: self, blank, page
			//	]},
			//	{text:'The page 1 from begin', link:'1'},
			//	{text:'The page 2 from begin', link:'2'},
			//	{text:'The page 3 from begin', link:'2'},
			//	{text:'The page 1 from end', link:'-1'},
			//	{text:'The page 2 from end', link:'-2'},
			//	{text:'The page 3 from end', link:'-3'}
			//],
			//---------------------------------------------
			
			shareControls: [ // Sets the share controls
				{type:'facebook',  active:true, title:'facebook',  icon:'ipgs-share-icon-facebook'},
				{type:'twitter',   active:true, title:'twitter',   icon:'ipgs-share-icon-twitter'},
				{type:'google',    active:true, title:'google+',   icon:'ipgs-share-icon-google'},
				{type:'linkedin',  active:true, title:'linkedin',  icon:'ipgs-share-icon-linkedin'},
				{type:'email',     active:true, title:'email',     icon:'ipgs-share-icon-email'}
			],
			
			// Config for the book engines
			twoPageFlip: {},
			onePageFlip: {},
			onePageSwipe: {
				pageFade: true
			},
			
			onLoad: null, // function(){} fire after the plugin was loaded
			
			// Texts used inside the plugin
			txtFailedEngine: 'Can not find the book engine module specified',
			txtPDFLoading: 'Loading PDF document',
			txtPDFFailedToLoad: 'Failed to load PDF document',
			txtShareDlgTitle: 'Share'
		},
		
		touchMouseEvent: {
			down: 'touchmousedown',
			up:   'touchmouseup',
			move: 'touchmousemove'
		},
		
		$body: null,
		util: null,
		
		//=============================================
		// Private Methods
		//=============================================
		_init: function($container, config) {
			this.$body = $('body');
			this.$container = $container;
			this.config = config;
			
			this.themeClass = (config.bookTheme ? 'ipgs-theme-' + config.bookTheme.toLowerCase() : null);
			
			this._create();
		},
		
		_create: function() {
			this._buildDOM();
			this._bind();
			
			var _self = this;
			function init() {
				_self.pageWidth = _self.config.pageWidth;
				_self.pageHeight = _self.config.pageHeight;
				_self.bookHeight = _self.config.pageHeight;
				
				_self.engineClass = 'ipgs-' + _self.config.bookEngine.toLowerCase();
				_self.engine = null;
				switch(_self.engineClass) {
					case 'ipgs-twopageflip': {
						_self.bookWidth = _self.config.pageWidth * 2;
						_self.engine = new TwoPageFlip(_self, $.extend(true, {}, _self.config.twoPageFlip));
					} break;
					case 'ipgs-onepageflip': {
						_self.bookWidth = _self.config.pageWidth;
						_self.engine = new OnePageFlip(_self, $.extend(true, {}, _self.config.onePageFlip));
					} break;
					case 'ipgs-onepageswipe': {
						_self.bookWidth = _self.config.pageWidth;
						_self.engine = new OnePageSwipe(_self, $.extend(true, {}, _self.config.onePageSwipe));
					} break;
					default: {
						console.error(_self.config.txtFailedEngine + ' [' + _self.engineClass + ']');
						_self._updateLoadingInfo(_self.config.txtFailedEngine);
						return;
					}
				}
				_self.controls.$book.css({'width':_self.bookWidth,'height':_self.bookHeight});
				
				_self._initPages();
				_self._initThumbnails();
				_self._initBookmarks();
				_self._setZoom({zoom:_self.config.zoom}, true, true);
				_self._updateSize();
				_self._updateBookEngine();
				_self._ready();
			}
			
			if(this.config.pdfUrl) {
				PDFJS.disableAutoFetch = true;
				PDFJS.disableStream = true;
				PDFJS.disableRange = _self.config.pdfDisableRangeRequests;
				PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK;
				
				var pdfLoading = PDFJS.getDocument(this.config.pdfUrl);
				
				pdfLoading.then(
					function pdfLoaded(pdf) {
						_self.pdf = pdf;
						
						if(_self.config.pdfBookSizeFromDocument) {
							_self.pdf.getPage(1).then(
								function(pdfPage) {
									var viewport = pdfPage.getViewport(1.0);
									_self.config.pageWidth = parseInt(viewport.width,10);
									_self.config.pageHeight = parseInt(viewport.height,10);
									
									init();
								},
								function() {
									init();
								}
							);
						} else {
							init();
						}
					},
					function pdfFailed(ex) {
						console.error(ex.message);
						_self._updateLoadingInfo(_self.config.txtPDFFailedToLoad);
					}
				);
				
				pdfLoading.onProgress = function progress(data) {
					var percent = 100 * data.loaded / data.total;
					if(isNaN(percent)) {
						if(data && data.loaded) {
							_self._updateLoadingInfo(_self.config.txtPDFLoading + ' ' + (Math.ceil(data.loaded / 10000) / 100).toString() + "Mb");
						} else {
							_self._updateLoadingInfo(_self.config.txtPDFLoading);
						}
					} else {
						_self._updateLoadingInfo(_self.config.txtPDFLoading + ' ' + percent.toString().split('.')[0] + '%');
					}
				};
			} else {
				init();
			}
		},
		
		_ready: function() {
			if(this.config.onLoad) {
				var fn = null;
				if(typeof this.config.onLoad == 'string') {
					try {
						fn = new Function(this.config.onLoad);
					} catch(ex) {
						console.error('Can not compile onLoad function: ' + ex.message);
					}
				} else if(typeof this.config.onLoad == 'function') {
					fn = this.config.onLoad;
				}
				
				if(fn) {
					fn.call(this);
				}
			}

			this.controls.$book.addClass('ipgs-no-transition');
			this.$container.addClass('ipgs-ready');
			this.ready = true;
			this.$container.trigger('ipages:ready', [this]);
			
			var _self = this;
			setTimeout(function() {
				_self.controls.$book.removeClass('ipgs-no-transition');
			},1);
			
			var flipSound = this.config.flipSound;
			this.config.flipSound = false;
			this._showPage(this.config.pageStart-1);
			this.config.flipSound = flipSound;
			
			// auto Enable controls
			if(this.config.toolbar) {
				if(this.config.autoEnableThumbnails) {
					this._onToggleThumbnails();
				}
				if(this.config.autoEnableOutline) {
					this._onToggleOutline();
				}
				if(this.config.autoEnableShare) {
					this._onToggleShare();
				}
			}
		},
		
		_buildDOM: function() {
			this.$container.addClass('ipgs').addClass(this.engineClass).addClass(this.themeClass);
			
			this.$container.wrapInner($('<div></div>').addClass('ipgs-pages').css('display','none')); // временный контейнер, чтобы при медленной загрузке не было видно артефактов
			
			this.controls.$nextBtn = $('<div></div>').addClass('aun-page');
			this.controls.$stage = $('<div></div>').addClass('ipgs-stage').attr('tabindex','1');
			this.controls.$audio = $('<audio preload></audio>').addClass('ipgs-audio');
			this.controls.$prevBtn = $('<div></div>').addClass('ipgs-prev-page');
			this.controls.$nextBtn = $('<div></div>').addClass('ipgs-next-page');
			this.controls.$stageMove = $('<div></div>').addClass('ipgs-stage-move');
			this.controls.$bookLoading = $('<div></div>').addClass('ipgs-book-loading');
			this.controls.$bookLoadingInfo = $('<div></div>').addClass('ipgs-book-loading-info');
			this.controls.$bookTransform = $('<div></div>').addClass('ipgs-book-transform');
			this.controls.$bookWrap = $('<div></div>').addClass('ipgs-book-wrap');
			this.controls.$bookSize = $('<div></div>').addClass('ipgs-book-size');
			this.controls.$book = $('<div></div>').addClass('ipgs-book').css({'perspective':this.config.perspective});
			
			if(this.config.flipSoundUrl) {
				this.controls.$audio.append($('<source src="' + this.config.flipSoundUrl + '">'));
			}
			
			this.controls.$bookSize.append(this.controls.$book);
			this.controls.$bookTransform.append(this.controls.$bookWrap);
			this.controls.$bookWrap.append(this.controls.$bookSize);
			this.controls.$stage.append(this.controls.$bookTransform, this.controls.$stageMove);
			
			// add padding to the stage
			this._updateStagePadding(this.config.padding);
			
			this.$container.append(this.controls.$stage, this.controls.$audio);
			
			if(this.config.prevnextButtons) {
				this.$container.append(this.controls.$prevBtn, this.controls.$nextBtn);
			}
			
			this._buildToolbarDOM();
			
			this.$container.append(this.controls.$bookLoading, this.controls.$bookLoadingInfo);
			
			if(this.$container.is(':hidden')) {
				this.$container.css('display','block');
			}
		},
		
		_updateStagePadding: function(padding) {
			if(typeof padding === 'number') {
				this.stagePadding.top = padding;
				this.stagePadding.right = padding;
				this.stagePadding.bottom = padding;
				this.stagePadding.left = padding;
			} else {
				this.stagePadding.top = (padding.hasOwnProperty('top') ? padding.top : 0);
				this.stagePadding.right = (padding.hasOwnProperty('right') ? padding.right : 0);
				this.stagePadding.bottom = (padding.hasOwnProperty('bottom') ? padding.bottom : 0);
				this.stagePadding.left = (padding.hasOwnProperty('left') ? padding.left : 0);
			}
		},
		
		_buildToolbarDOM: function() {
			if(!this.config.toolbar) {
				return;
			}


			this.controls.$toolbar = $('<div></div>').addClass('ipgs-toolbar');
			this.controls.toolbar = {};
			
			var toolbarControls = [],
			optionalControls = [];
			
			for(var i=0;i<this.config.toolbarControls.length;i++) {
				var control = this.config.toolbarControls[i];
				
				var $icon = $('<i></i>').addClass(control.icon),
				$control = $('<div></div>')
					.addClass('ipgs-control')
					.addClass('ipgs-control-' + control.type)
					.addClass((control.active ? '' : 'ipgs-hidden'))
					.attr('title', control.title)
					.append($icon);
				
				$control.on('click', $.proxy(this._onToolbarControlClick, this));
				
				switch(control.type) {
					case 'gotofirst': {
						this.controls.toolbar.$gotofirst = $control;
						$control.on('click', $.proxy(this._onPageFirst, this));
					} break;
					case 'prev': {
						this.controls.toolbar.$prev = $control;
						$control.on('click', $.proxy(this._onPagePrev, this));
					} break;
					case 'pagenumber': {
						this.controls.toolbar.$pagenumber = $control;
						this.controls.toolbar.$pagenumber.empty();
						
						this.controls.toolbar.$pagenumberLabel = $('<span></span>').addClass('ipgs-pagenumber-label');
						this.controls.toolbar.$pagenumberInput = $('<input>').addClass('ipgs-pagenumber-input').attr('type','text');
						
						this.controls.toolbar.$pagenumberLabel.on('click', $.proxy(this._onPageNumberLabelClick, this));
						this.controls.toolbar.$pagenumberInput.on('click', $.proxy(this._onPageNumberInputClick, this));
						this.controls.toolbar.$pagenumberInput.on('keyup', $.proxy(this._onPageNumberInputKeyup, this));
						
						this.controls.toolbar.$pagenumber.append(this.controls.toolbar.$pagenumberLabel, this.controls.toolbar.$pagenumberInput);
					} break;
					case 'next': {
						this.controls.toolbar.$next = $control;
						$control.on('click', $.proxy(this._onPageNext, this));
					} break;
					case 'gotolast': {
						this.controls.toolbar.$gotolast = $control;
						$control.on('click', $.proxy(this._onPageLast, this));
					} break;
					case 'outline': {
						this.controls.$outline = $('<div></div>').addClass('ipgs-outline');
						this.$container.append(this.controls.$outline);
						
						this.controls.$outline.on('click', '.ipgs-bookmark', $.proxy(this._onBookmarkClick, this));
						
						this.controls.toolbar.$outline = $control;
						$control.on('click', $.proxy(this._onToggleOutline, this));
					} break;
					case 'thumbnails': {
						this.controls.$thumbnails = $('<div></div>').addClass('ipgs-thumbnails');
						this.$container.append(this.controls.$thumbnails);
						
						this.controls.$thumbnails.on('scroll', $.proxy(this._onThumbnailsScroll, this));
						this.controls.$thumbnails.on('click', '.ipgs-thumb', $.proxy(this._onThumbClick, this));
						
						this.controls.toolbar.$thumbnails = $control;
						$control.on('click', $.proxy(this._onToggleThumbnails, this));
					} break;
					case 'zoom-in': {
						this.controls.toolbar.$zoomin = $control;
						$control.on('click', $.proxy(this._onZoomIn, this));
					} break;
					case 'zoom-out': {
						this.controls.toolbar.$zoomout = $control;
						$control.on('click', $.proxy(this._onZoomOut, this));
					} break;
					case 'zoom-default': {
						this.controls.toolbar.$zoomdefault = $control;
						$control.on('click', $.proxy(this._onZoomDefault, this));
					} break;
					case 'fullscreen': {
						this.controls.toolbar.$fullscreen = $control;
						$control.on('click', $.proxy(this._onToggleFullscreen, this));
					} break;
					case 'share': {
						this.controls.$share = $('<div></div>').addClass('ipgs-share');
						this.controls.$shareDialog = $('<div></div>').addClass('ipgs-share-dialog');
						this.controls.$shareHeader = $('<div></div>').addClass('ipgs-share-header').html(this.config.txtShareDlgTitle);
						this.controls.$shareControls = $('<div></div>').addClass('ipgs-share-controls');
						
						for(var j=0;j<this.config.shareControls.length;j++) {
							var shareControl = this.config.shareControls[j];
							
							if(!shareControl.active) {
								continue;
							}
							
							var $shareIcon = $('<i></i>').addClass(shareControl.icon),
							$shareControl = $('<div></div>')
								.addClass('ipgs-share-control-' + control.type)
								.attr('title', shareControl.title)
								.append($shareIcon);
							
							this.controls.$shareControls.append($shareControl);
							
							$shareControl.on('click', $.proxy(this._onShareClick, this, shareControl.type));
						}
						
						this.controls.$shareDialog.append(this.controls.$shareHeader, this.controls.$shareControls);
						this.controls.$share.append(this.controls.$shareDialog);
						this.$container.append(this.controls.$share);
						
						this.controls.$share.on('click', $.proxy(this._onToggleShare, this));
						
						this.controls.toolbar.$share = $control;
						$control.on('click', $.proxy(this._onToggleShare, this));
					} break;
					case 'optional': {
						this.controls.toolbar.$optional = $control;
						
						this.controls.toolbar.$optionalBar = $('<div></div>').addClass('ipgs-optional-bar');
						this.controls.toolbar.$optional.append(this.controls.toolbar.$optionalBar);
						
						$control.on('click', $.proxy(this._onToggleOptional, this));
					} break;
					case 'download': {
						this.controls.toolbar.$download = $control;
						$control.on('click', $.proxy(this._onDownload, this));
					} break;
					case 'sound': {
						this.controls.toolbar.$sound = $control;
						this.controls.toolbar.$sound.toggleClass('ipgs-disable', !this.config.flipSound);
						$control.on('click', $.proxy(this._onToggleSound, this));
					} break;
				}
				
				if(control.optional) {
					optionalControls.push($control);
				} else {
					toolbarControls.push($control);
				}
			}
			
			for(var i=0;i<toolbarControls.length;i++) {
				this.controls.$toolbar.append(toolbarControls[i]);
			}
			
			for(var i=0;i<optionalControls.length;i++) {
				this.controls.toolbar.$optionalBar.append(optionalControls[i]);
			}
			
			this.$container.append(this.controls.$toolbar);
		},
		
		_bind: function() {


			if('ontouchstart' in window && this.config.touchNavigation) {
				this.controls.$stage.on('touchstart', $.proxy(this._onBookTouch, this));
				this.controls.$stage.on('touchmove', $.proxy(this._onBookTouch, this));
				this.controls.$stage.on('touchend', $.proxy(this._onBookTouch, this));
			}
			
			if(this.config.mouseDragNavigation) {
				this.controls.$stage.on('mousedown', $.proxy(this._onBookMouse, this));
			}
			
			this.controls.$stage.on(this.touchMouseEvent.down, $.proxy(this._onSwipeDown, this));
			this.controls.$stage.on(this.touchMouseEvent.move, $.proxy(this._onSwipeMove, this));
			this.controls.$stage.on(this.touchMouseEvent.up, $.proxy(this._onSwipeUp, this));
			
			if(this.config.mousePageClickNavigation) {
				this.controls.$stage.on('click', $.proxy(this._onBookMouseClick, this));
			}
			
			if(this.config.mouseWheelNavigation) {
				this.controls.$stage.on('mousewheel', $.proxy(this._onMouseWheelNavigation, this));
			}
			
			if(this.config.keyboardNavigation) {
				this.controls.$stage.on('keydown', $.proxy(this._onKeyboardNavigation, this));
			}
			
			if(this.config.dblClickZoomDefault) {
				this.controls.$stage.on('dblclick', $.proxy(this._onDblClickZoomDefault, this));
				this.controls.$stage.on('touchstart', $.proxy(this._onDblTapZoomDefault, this));
			}
			
			if(this.config.mouseWheelZoom) {
				this.controls.$stage.on('mousewheel', $.proxy(this._onMouseWheelZoom, this));
			}
			
			if(this.config.keyboardZoom) {
				this.controls.$stage.on('keydown', $.proxy(this._onKeyboardZoom, this));
			}
			
			if(this.config.pinchZoom) {
				this.controls.$stage.on('touchstart', $.proxy(this._onPinchZoomTouchStart, this));
				this.controls.$stage.on('touchend', $.proxy(this._onPinchZoomTouchEnd, this));
			}
			
			if(this.config.prevnextButtons) {
				this.controls.$prevBtn.on('click', $.proxy(this._onPrevBtnClick, this));
				this.controls.$nextBtn.on('click', $.proxy(this._onNextBtnClick, this));
			}
			
			if(this.config.bookEngineLandscape || this.config.bookEnginePortrait) {
				$(window).on('orientationchange', $.proxy(this._onOrientationChange, this));
			}
			
			$(window).on('resize', $.proxy(this._onResize, this));
			$(window).on('scrollbar', $.proxy(this._onScrollbar, this));
			
			this.$container.on('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', $.proxy(this._onFullScreenChange, this));
		},
		
		_unbind: function() {
			this.controls.$stage.off('touchstart', $.proxy(this._onBookTouch, this));
			this.controls.$stage.off('touchmove', $.proxy(this._onBookTouch, this));
			this.controls.$stage.off('touchend', $.proxy(this._onBookTouch, this));
			
			this.controls.$stage.off('mousedown', $.proxy(this._onBookMouse, this));
			
			this.controls.$stage.off(this.touchMouseEvent.down, $.proxy(this._onSwipeDown, this));
			this.controls.$stage.off(this.touchMouseEvent.move, $.proxy(this._onSwipeMove, this));
			this.controls.$stage.off(this.touchMouseEvent.up, $.proxy(this._onSwipeUp, this));
			
			this.controls.$stage.off('click', $.proxy(this._onBookMouseClick, this));
			
			this.controls.$stage.off('mousewheel', $.proxy(this._onMouseWheelNavigation, this));
			this.controls.$stage.off('keydown', $.proxy(this._onKeyboardNavigation, this));
			this.controls.$stage.off('dblclick', $.proxy(this._onDblClickZoomDefault, this));
			this.controls.$stage.off('mousewheel', $.proxy(this._onMouseWheelZoom, this));
			this.controls.$stage.off('keydown', $.proxy(this._onKeyboardZoom, this));
			this.controls.$stage.off('touchstart', $.proxy(this._onPinchZoomTouchStart, this));
			this.controls.$stage.off('touchend', $.proxy(this._onPinchZoomTouchEnd, this));
			
			this.controls.$prevBtn.off('click', $.proxy(this._onPrevBtnClick, this));
			this.controls.$nextBtn.off('click', $.proxy(this._onNextBtnClick, this));
			
			$(window).off('orientationchange', $.proxy(this._onOrientationChange, this));
			$(window).off('resize', $.proxy(this._onResize, this));
			$(window).off('scrollbar', $.proxy(this._onScrollbar, this));
			
			this.$container.off('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', $.proxy(this._onFullScreenChange, this));
		},
		
		_replaceNumberTemplate: function(template, number) {
			if(template) {
				var regex = /\{\{(x+)\}\}/g;
				number = '' + number;
				
				return template.replace(regex, function(match, p1) {
					if(p1.length > number.length) {
						var zeros = '';
						for(var i = 0; i < p1.length; i++) {
							zeros = zeros + '0';
						}
						return (zeros + number).slice(-zeros.length);
					}
					return number;
				});
			}
			return template;
		},
		
		_createBlob: function(data, contentType) {
			return new Blob([data], {type: contentType});
		},
		
		_createObjectURL: function(data, contentType) {
			var blob = this._createBlob(data, contentType);
			return URL.createObjectURL(blob);
		},
		
		_initThumbnails: function() {
			if(!this.controls.$thumbnails) {
				return;
			}
			
			var ratio = this.pageHeight/this.pageWidth,
			thumbWidth = (this.controls.$thumbnails.outerWidth() * 0.8),
			thumbHeight = ratio * thumbWidth;
			
			for(var i=0;i<this.pages.length;i++) {
				var $page = this.pages[i],
				$preloader = $('<div></div>').addClass('ipgs-preloader'),
				$number = $('<div></div>').addClass('ipgs-number').text(i+1),
				$thumb = $('<div></div>')
				.css({
					'width': thumbWidth + 'px',
					'height': thumbHeight + 'px'
				})
				.addClass('ipgs-thumb')
				.addClass('ipgs-loading')
				.attr('data-page-index', i)
				.appendTo(this.controls.$thumbnails)
				.append($preloader, $number);
				
				$thumb.$number = $number;
				$thumb.thumbLoading = false;
				$thumb.thumbLoaded = false;
				$thumb.image = $page.image;
				$thumb.pdfPage = $page.pdfPage;
				
				$page.$thumb = $thumb; // back link
			}
		},
		
		_addBookmarks: function($container, bookmarks) {
			if(!(bookmarks && bookmarks.length>0)) {
				return;
			}
			
			var $bookmarks = $('<div></div>').addClass('ipgs-bookmarks').appendTo($container);
			$container.addClass('ipgs-has-childs');
			
			for(var i=0;i<bookmarks.length;i++) {
				var bookmark = bookmarks[i],
				$state = $('<div></div>').addClass('ipgs-state'),
				$link = $('<div></div>').addClass('ipgs-link').html(bookmark.text),
				$bookmark = $('<div></div>').addClass('ipgs-bookmark'),
				target = (bookmark.target ? bookmark.target : 'page'),
				folded = (bookmark.folded == false ? false : true);
				
				$bookmark.attr('data-link', bookmark.link).attr('data-target', target).toggleClass('ipgs-folded', folded);
				$bookmark.append($state, $link).appendTo($bookmarks);
				
				this._addBookmarks($bookmark, bookmark.bookmarks);
			}
		},
		
		_initBookmarks: function() {
			if(!this.controls.$outline) {
				return;
			}
			
			this._addBookmarks(this.controls.$outline, this.config.bookmarks);
		},
		
		_initPages: function() {
			var $pages = this.$container.find('.ipgs-pages'),
			pages = $pages.children();
			for(var i=0, len=pages.length; i<len; i++) {
				if(!$(pages[i]).hasClass('ipgs-stage') && !$(pages[i]).hasClass('ipgs-toolbar')) {
					this._addPage(pages[i]);
				}
			};
			$pages.remove();
			
			if(this.config.pdfAutoCreatePages && this.pdf) {
				for(var i=0; i<this.pdf.numPages; i++) {
					var $page = $('<div></div>').addClass('ipgs-no-come-back').attr('data-ipgs-pdf-page', i+1);
					this._addPage($page);
				}
			}
			
			if(this.config.pageImagesUrl) {
				for(var i=0; i<this.config.pageImagesCount; i++) {
					var image = this._replaceNumberTemplate(this.config.pageImagesUrl, this.config.pageImagesFirst + i),
					$page = $('<div></div>').addClass('ipgs-no-come-back').attr('data-ipgs-image', image);
					
					this._addPage($page);
				}
			}
			
			if(this.pages.length>0) {
				this.pages[0].addClass('ipgs-first');
				this.pages[this.pages.length-1].addClass('ipgs-last');
			}
			for(var i=0;i<this.pages.length;i++) {
				this.pages[i].attr('data-page-number', i+1);
			}
			
			this._updateBook(false);
		},
		
		_addPage: function(page) {
			var $content = $(page),
			$preloader = $('<div></div>').addClass('ipgs-preloader'),
			$image = $('<div></div>').addClass('ipgs-image'),
			$data = $('<div></div>').addClass('ipgs-data'),
			$number = $('<div></div>').addClass('ipgs-number'),
			$shadow = $('<div></div>').addClass('ipgs-shadow'),
			$page = $('<div></div>')
			.css({
				'display': 'none',
				'width': this.pageWidth + 'px',
				'height': this.pageHeight + 'px'
			})
			.addClass('ipgs-page')
			.addClass('ipgs-loading')
			.appendTo(this.controls.$book)
			.append($image, $data, $number, $shadow, $preloader);
			
			$page.$image = $image, // to avoid flickering
			$page.$data = $data;
			$page.$number = $number;
			$page.$shadow = $shadow;
			$page.$thumb = null,
			$page.pageLoading = false;
			$page.pageLoaded = false;
			$page.zoom = this._getZoom();
			$page.image = $content.data('ipgs-image');
			$page.pdfPage = $content.data('ipgs-pdf-page');
			$page.showCSSClass = $content.data('ipgs-showcssclass');
			$page.hideCSSClass = $content.data('ipgs-hidecssclass');
			
			if(!$content.hasClass('ipgs-no-come-back')) {
				$content.addClass('ipgs-come-back');
			}
			
			$data.append($content);
			
			this.pages.push($page);
		},
		
		_updateLoadingInfo: function(text) {
			this.controls.$bookLoadingInfo.text(text).addClass('ipgs-active');
		},
		
		_updateBook: function(showPage) {
			for(var i=0, len=this.pages.length;i<len;i++) {
				var $page = this.pages[i];
				$page.pageIndex = i;
				$page.pageNumber = this.config.pageNumbersFirst + i;
				
				if(this.config.pageNumbers) {
					var fromBegin = i+1,
					fromEnd = i - this.pages.length;
					
					if($.inArray(fromBegin, this.config.pageNumbersHidden) == -1 &&
					   $.inArray(fromEnd, this.config.pageNumbersHidden) == -1) {
						$page.$number.addClass('ipgs-show').text($page.pageNumber);
					} else {
						$page.$number.removeClass('ipgs-show').text('');
					}
					
				}
			}
			
			this.engine.updateBook(showPage);
		},
		
		_updateSize: function() {
			var zoom = this._getZoom(),
			bookWidth = this.bookWidth,
			bookHeight = this.bookHeight,
			paddingTop = this.stagePadding.top,
			paddingBottom = this.stagePadding.bottom,
			paddingLeft = this.stagePadding.left,
			paddingRight = this.stagePadding.right,
			parentWidth = this.controls.$stage.outerWidth() - paddingLeft - paddingRight;
			
			if(this.config.autoHeight) {
				var ratio = bookHeight / bookWidth,
				w = (!this.config.autoFit && parentWidth > bookWidth ? bookWidth : parentWidth),
				h = ratio * w + paddingTop + paddingBottom;
				
				this.$container.css({'height': h});
			}
			
			var parentHeight = this.controls.$stage.outerHeight() - paddingTop - paddingBottom,
			ratio = 1,
			offsetTop = 0,
			offsetLeft = 0;
			
			parentHeight = (parentHeight <= 0 ? bookHeight : parentHeight);
			
			if(this.config.responsive && !this.config.autoFit) {
				if(bookWidth > parentWidth || bookHeight > parentHeight) {
					var widthRatio = parentWidth / bookWidth,
					heightRatio = parentHeight / bookHeight;
					
					if(widthRatio > heightRatio) {
						ratio = heightRatio;
					} else {
						ratio = widthRatio;
					}
				}
			}
			
			if(this.config.autoFit) {
				var widthRatio = parentWidth / bookWidth,
				heightRatio = parentHeight / bookHeight;
				
				if(widthRatio > heightRatio) {
					ratio = heightRatio;
				} else {
					ratio = widthRatio;
				}
			}
			
			offsetTop = (parentHeight - bookHeight * ratio)/2;
			offsetLeft = (parentWidth - bookWidth * ratio)/2;
			this.controls.$bookTransform.css({top:offsetTop + paddingTop + 'px', left:offsetLeft + paddingLeft + 'px'});
			
			this.controls.$bookWrap.css({'width':bookWidth*ratio + 'px','height':bookHeight*ratio + 'px'});
			this.controls.$bookWrap.get(0).offsetHeight;
			
			this.controls.$bookSize.css({transform:'scale(' + (1/zoom)*ratio + ')'});
			
			this._updateThumbnails();
			
			this.engine.updateBookLayout();
		},
		
		_updateBookEngine: function() {
			var bookEngineLandscape = this.config.bookEngineLandscape || this.config.bookEngine,
			bookEnginePortrait = this.config.bookEnginePortrait || this.config.bookEngine,
			paddingTop = this.stagePadding.top,
			paddingBottom = this.stagePadding.bottom,
			paddingLeft = this.stagePadding.left,
			paddingRight = this.stagePadding.right,
			stageWidth = this.controls.$stage.outerWidth() - paddingLeft - paddingRight,
			stageHeight = this.controls.$stage.outerHeight() - paddingTop - paddingBottom,
			ratio = stageWidth / stageHeight;
			
			if(ratio >= this.config.ratioPortraitToLandscape) {
				this.$container.addClass('ipgs-landscape').removeClass('ipgs-portrait');
				this.setBookEngine(bookEngineLandscape);
			} else {
				this.$container.addClass('ipgs-portrait').removeClass('ipgs-landscape');
				this.setBookEngine(bookEnginePortrait);
			}
		},
		
		_updateThumbnails: function() {
			if(this.controls.$thumbnails) {
				this._onThumbnailsRefresh();
			}
		},
		
		_updateZoomPosition: function() {
			var zoom = this._getZoom();
			if(zoom == 1) {
				this._setPosition({x:0,y:0}, false);
			}
			
			var pos = this._getPosition();
			this.controls.$bookTransform.css({'transform':'translate3d(' + pos.x + 'px,' + pos.y + 'px, 0) scale(' + zoom + ')'});
			
			// update book and page sizes
			this.controls.$book.addClass('ipgs-no-transition');
			this.controls.$book.css({'width':this.bookWidth * zoom + 'px','height':this.bookHeight * zoom + 'px'});
			for(var i=0;i<this.pages.length;i++) {
				var $page = this.pages[i];
				$page.css({
					'width': this.pageWidth * zoom + 'px',
					'height': this.pageHeight * zoom + 'px'
				});
				
				$page.$data.css({
					'width': this.pageWidth + 'px',
					'height': this.pageHeight + 'px',
					'transform':'scale(' + zoom + ')'
				});
				
				if($page.hasClass('ipgs-show')) {
					this._loadPageData($page.pageIndex);
				}
			}
			
			this._updateSize();
			
			var _self = this;
			clearTimeout(_self.bookTransitionTimerId);
			_self.bookTransitionTimerId = setTimeout(function() {
				_self.controls.$book.removeClass('ipgs-no-transition');
			}, 300);
		},
		
		_getPosition: function() {
			return {x: this.matrix.m[4], y: this.matrix.m[5]};
		},
		
		_setPosition: function(options, update) {
			var x = options.x || 0,
			y = options.y || 0;
			
			this.matrix.m[4] = x;
			this.matrix.m[5] = y;
			
			if(update) {
				this._updateZoomPosition();
			}


		},
		
		_setDeltaPosition: function(options) {
			var dx = options.dx || 0,
			dy = options.dy || 0;
			
			var posBase = this.matrix.inverse().transformPoint(dx, dy),
			posBaseCenterCenter = this.matrix.inverse().transformPoint(0,0),
			x = posBase[0] - posBaseCenterCenter[0],
			y = posBase[1] - posBaseCenterCenter[1];
			//x = (isNaN(posBase[0]) ? 0 : posBase[0]) - (isNaN(posBaseCenterCenter[0]) ? 0 : posBaseCenterCenter[0]),
			//y = (isNaN(posBase[1]) ? 0 : posBase[1]) - (isNaN(posBaseCenterCenter[1]) ? 0 : posBaseCenterCenter[1]);
			
			this.matrix.translate(x, y);
			
			this._updateZoomPosition();
		},
		
		_getZoom: function() {
			return this.matrix.m[0];
		},
		
		_setZoom: function(options, update, force) {
			var zoom = options.zoom || 0.000001; // options.zoom || 1
			
			// constrain min and max zoom
			if(this.config.zoomMin != null) {
				zoom = Math.max(this.config.zoomMin, zoom)
			}
			if(this.config.zoomMax != null) {
				zoom = Math.min(this.config.zoomMax, zoom);
			}
			
			if(!force && zoom == this._getZoom()) {
				return;
			}
			
			var x = this.matrix.m[4],
			y = this.matrix.m[5];
			
			this.matrix.reset()
				.translate(x, y)
				.scale(zoom, zoom);
			
			if(update) {
				this._updateZoomPosition();
			}
		},
		
		_setDeltaZoom: function(options) {
			var zoom = options.zoom || 1, // delta zoom
			focalPoint = options.focalPoint || { x: this.matrix.m[4], y: this.matrix.m[5] }; // focal point position
			
			// check focal zoom
			if(!this.config.zoomFocal) {
				focalPoint = { x:this.matrix.m[4], y:this.matrix.m[5] };
			}
			
			// constrain min and max zoom
			var zoomNew = this.matrix.m[0] * zoom;
			if(this.config.zoomMin != null && zoomNew < this.config.zoomMin) {
				zoom = this.config.zoomMin / this.matrix.m[0];
			} else if(this.config.zoomMax != null && zoomNew > this.config.zoomMax) {
				zoom = this.config.zoomMax / this.matrix.m[0];
			}
			
			var posBase = this.matrix.inverse().transformPoint(focalPoint.x, focalPoint.y),
			x = posBase[0],
			y = posBase[1];
			//x = (isNaN(posBase[0]) ? 0 : posBase[0]),
			//y = (isNaN(posBase[1]) ? 0 : posBase[1]);
			
			this.matrix.translate(x, y)
				.scale(zoom, zoom)
				.translate(-x,-y);
			
			this._updateZoomPosition();
		},
		
		_zoomIn: function() {
			var zoom = this._getZoom() + this.config.zoomStep;
			this._setZoom({zoom:zoom}, true, false);
		},
		
		_zoomOut: function() {
			var zoom = this._getZoom() - this.config.zoomStep;
			this._setZoom({zoom:zoom}, true, false);
		},
		
		_setBackgroundImage: function($el, src) { // $el = $page or $thumb
			if($el.$image) {
				$el.css({'background-image':$el.$image.css('background-image')});
				$el.$image.css({'background-image': (src ? 'url(' + src + ')' : 'none')});
			} else {
				$el.css({'background-image': (src ? 'url(' + src + ')' : 'none')});
			}
			
			$el.pageLoading = false;
			$el.pageLoaded = true;
			$el.toggleClass('ipgs-loading', !$el.pageLoaded);
		},
		
		_loadPageData: function(pageIndex) {
			if(pageIndex == null) {
				return;
			}
			
			var $page = this.pages[pageIndex];
			
			if($page.pdfPage && $page.zoom != this._getZoom()) { // only fo pdf sources
				$page.zoom = this._getZoom();
				$page.pageLoaded = false;
				$page.pageLoading = false;
			}
			
			if($page.pageLoaded || $page.pageLoading) {
				return;
			}
			$page.pageLoading = true;
			
			var _self = this;
			if($page.image) {
				var img = new Image();
				img.onload = function(){
					_self._setBackgroundImage($page, this.src);
					if($page.$thumb && !($page.$thumb.pageLoaded || $page.$thumb.pageLoading)) {
						_self._setBackgroundImage($page.$thumb, this.src);
					}
				};
				img.src = $page.image;
			} else if($page.pdfPage) {
				if(_self.pdf) {
					if($page.updateTimerId) {
						clearTimeout($page.updateTimerId);
					}
					
					$page.updateTimerId = setTimeout(function() {
						_self.pdf.getPage($page.pdfPage).then(function(pdfPage) {
							var viewport = pdfPage.getViewport(_self.pageWidth * _self._getZoom() / pdfPage.getViewport(1.0).width),
							$canvas = $('<canvas>'),
							canvasContext = $canvas.get(0).getContext('2d');
							
							$canvas.get(0).width = viewport.width; //_self.pageWidth * _self._getZoom();
							$canvas.get(0).height = viewport.height; //_self.pageHeight * _self._getZoom();
							
							var renderContext = {
								canvasContext: canvasContext,
								viewport: viewport
							};
							
							$page.renderTask = pdfPage.render(renderContext);
							$page.renderTask.then(function() {
								$canvas.get(0).toBlob(function(blob) {
									var src = _self._createObjectURL(blob, blob.type);
									_self._setBackgroundImage($page, src);
									if($page.$thumb) {
										_self._loadThumbData($page.$thumb);
									}
									
									$canvas.remove();
								});
							});
						});
					}, ($page.updateTimerId ? 300 : 1));
				}
			} else {
				_self._setBackgroundImage($page, '');
				if($page.$thumb && !($page.$thumb.pageLoaded || $page.$thumb.pageLoading)) {
					_self._setBackgroundImage($page.$thumb, '');
				}
			}
		},
		
		_loadThumbData: function($thumb) {
			if($thumb.pageLoaded || $thumb.pageLoading) {
				return;
			}
			$thumb.pageLoading = true;
			
			var _self = this;
			if($thumb.image) {
				var img = new Image();
				img.onload = function(){
					_self._setBackgroundImage($thumb, this.src);
				};
				img.src = $thumb.image;
			} else if($thumb.pdfPage) {
				if(_self.pdf) {
					_self.pdf.getPage($thumb.pdfPage).then(function(pdfPage) {
						var viewport = pdfPage.getViewport($thumb.width() / pdfPage.getViewport(1).width),
						$canvas = $('<canvas>'),
						canvasContext = $canvas.get(0).getContext('2d');
						
						$canvas.get(0).width = $thumb.width();
						$canvas.get(0).height = $thumb.height();
						
						var renderContext = {
							canvasContext: canvasContext,
							viewport: viewport
						};
						pdfPage.render(renderContext).then(function() {
							$canvas.get(0).toBlob(function(blob) {
								var src = _self._createObjectURL(blob, blob.type);
								_self._setBackgroundImage($thumb, src);
								
								$canvas.remove();
							});
						});
					});
				}
			} else {
				_self._setBackgroundImage($thumb, '');
			}
		},
		
		_showPage: function(pageIndex) {
			if(this.pages.length == 0) {
				return;
			}
			this.engine.showPage(pageIndex);
		},
		
		_gotoPage: function(pageIndex) {
			if(this.pages.length == 0) {
				return;
			}
			this.engine.gotoPage(pageIndex);
		},
		
		_gotoPrev: function() {
			this.engine.gotoPrev();
		},
		
		_gotoNext: function() {
			this.engine.gotoNext();
		},
		
		_setShowHidePageState: function(pageIndex, show) {
			var $page = this.pages[pageIndex];
			if(show) {
				if($page.hasClass('ipgs-hide')) {
					$page.removeClass('ipgs-hide');
					$page.get(0).offsetHeight;
					$page.addClass('ipgs-show');
					
					$page.removeClass($page.hideCSSClass).addClass($page.showCSSClass);
					
					this._loadPageData(pageIndex); // we need it when we manually turn the page
					
					// fire event
					this.$container.trigger('ipages:showpage', [this, pageIndex]);
				}
			} else {
				if($page.hasClass('ipgs-show')) {
					$page.removeClass('ipgs-show');
					$page.get(0).offsetHeight;
					$page.addClass('ipgs-hide');
					
					$page.removeClass($page.showCSSClass).addClass($page.hideCSSClass);
					
					// fire event
					this.$container.trigger('ipages:hidepage', [this, pageIndex]);
				}
			}
			
			if(this.config.prevnextButtons && this.pages.length>0) {
				this.controls.$prevBtn.toggleClass('ipgs-active', !this.pages[0].hasClass('ipgs-show'));
				this.controls.$nextBtn.toggleClass('ipgs-active', !this.pages[this.pages.length-1].hasClass('ipgs-show'));
			}
		},
		
		_normalizeEvent: function(type, original, x, y) {
			return $.Event(type, {pageX: x, pageY: y, originalEvent: original});
		},
		
		_onShowPage: function(pageIndex) {
			if(this.config.flipSound && this.pageIndexPrev != pageIndex) {
				var audioEl = this.controls.$audio.get(0);
				
				audioEl.pause();
				audioEl.currentTime = 0
				audioEl.play();
			}
			
			if(this.config.toolbar) {
				if(this.engineClass == 'ipgs-twopageflip') {
					var even = ((pageIndex+1) % 2 == 0),
					leftPart = 0,
					rightPart = 0;
					
					if(even || pageIndex+1==1 || pageIndex+1==this.pages.length) {
						leftPart = pageIndex+1;
					} else {
						leftPart = pageIndex;
					}
					rightPart = (leftPart>1 && leftPart<this.pages.length ? '-' + (leftPart+1) : '');
					
					this.controls.toolbar.$pagenumberLabel.text(leftPart + rightPart + '/' + this.pages.length);
				} else {
					this.controls.toolbar.$pagenumberLabel.text((pageIndex+1) + '/' + this.pages.length);
				}
			}
			
			this.pageIndexPrev = pageIndex;
		},
		
		_onResize: function() {
			if(this.ready) {
				this._updateSize();
				this._updateBookEngine();
			}
		},
		
		_onScrollbar: function(e, state) {
			if(state && this.ready) {
				this._updateSize();
				this._updateBookEngine();
			}
		},
		
		_onOrientationChange: function() {
			this._updateBookEngine();
		},
		
		_onBookTouch: function(e) {
			if($(e.target).is('a')) {
				return;
			}
			alert("1");


			var type;
			switch(e.type) {
				case 'touchstart': type = this.touchMouseEvent.down; break;
				case 'touchend':   type = this.touchMouseEvent.up;   break;
				case 'touchmove':  {
					e.preventDefault();
					e.stopPropagation();
					
					type = this.touchMouseEvent.move; 
				} break;
				default:
					return;
			}
			
			var touch = e.originalEvent.touches[0],
			touchMouseEvent;
			if(type == this.touchMouseEvent.up) {
				touchMouseEvent = this._normalizeEvent(type, e, null, null);
			} else {
				touchMouseEvent = this._normalizeEvent(type, e, touch.pageX, touch.pageY);
			}
			$(e.target).trigger(touchMouseEvent);
		},
		
		_onBookMouse: function(e) {
			if($(e.target).is('a')) {
				return;
			}


			e.preventDefault(); // FireFox has issues without this line //!!!
			e.stopPropagation();
			
			var type, fireClickEvent = false;
			switch (e.type) {
				case 'mousedown': {
					type = this.touchMouseEvent.down;
					console.log('...');
					document.getElementById('Hh').value=e.clientX+"+"+e.clientY;					
					this.dragNavigation.target = e.target;
					this.dragNavigation.startX = this.dragNavigation.x = e.pageX;
					this.dragNavigation.startY = this.dragNavigation.y = e.pageY;
					
					this.controls.$stageMove.addClass('ipgs-active');
					this.controls.$stageMove.on('mouseup', $.proxy(this._onBookMouse, this));
					this.controls.$stageMove.on('mouseout', $.proxy(this._onBookMouse, this));
					this.controls.$stageMove.on('mousemove', $.proxy(this._onBookMouse, this));
					
					this.controls.$stage.focus();
				} break;
				case 'mouseup': {
					if(this.dragNavigation.startX == this.dragNavigation.x && this.dragNavigation.startY == this.dragNavigation.y) {
						fireClickEvent = true;
					}
				}
				case 'mouseout': {
					type = this.touchMouseEvent.up;
					
					this.controls.$stageMove.removeClass('ipgs-active');
					this.controls.$stageMove.off('mouseup', $.proxy(this._onBookMouse, this));
					this.controls.$stageMove.off('mouseout', $.proxy(this._onBookMouse, this));
					this.controls.$stageMove.off('mousemove', $.proxy(this._onBookMouse, this));
				} break;
				case 'mousemove': {
					type = this.touchMouseEvent.move;
					
					this.dragNavigation.x = e.pageX;
					this.dragNavigation.y = e.pageY;
				} break;
				default: {
					return;
				}
			}
			
			var touchMouseEvent = this._normalizeEvent(type, e, e.pageX, e.pageY);
			$(e.target).trigger(touchMouseEvent);
			
			if(fireClickEvent) {
				this.controls.$stage.trigger('click', [this.dragNavigation.target]);
			}
		},
		
		_onSwipeDown: function(e) {
			this.lastDelta = {x: e.pageX, y: e.pageY};
			this.controls.$bookTransform.addClass('ipgs-no-transition');
			
			if(this._getZoom() == 1) {
				this.engine.onSwipeDown(e);
			}
		},
		
		_onSwipeMove: function(e) {
			if(this._getZoom() == 1) {
				this.engine.onSwipeMove(e);
			} else {
				this._setDeltaPosition({
					dx: e.pageX - this.lastDelta.x,
					dy: e.pageY - this.lastDelta.y
				});
				this.lastDelta.x = e.pageX;
				this.lastDelta.y = e.pageY;
			}
		},
		
		_onSwipeUp: function(e) {
			this.controls.$bookTransform.removeClass('ipgs-no-transition');
			
			if(this._getZoom() == 1) {
				this.engine.onSwipeUp(e);
			}
		},
		
		_onBookMouseClick: function(e, target) {
			target = target || e.target;
			var $page = $(target).closest('.ipgs-page');
			alert("1");
			if($page.length) {
				switch(this.engineClass) {
					case 'ipgs-twopageflip': {
						if($page.data('page-number') % 2 == 0) {
							this._gotoPrev();
						} else {
							this._gotoNext();
						}
					} break;
					case 'ipgs-onepageflip':
					case 'ipgs-onepageswipe': {
						this._gotoNext();
					} break;
				}
			}
		},
		
		_onPrevBtnClick: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			this.controls.$stage.focus();
			this._gotoPrev();
		},
		
		_onNextBtnClick: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			this.controls.$stage.focus();
			this._gotoNext();
			//console.log('_onNextBtnClick');
			//document.getElementById('Hh').value="_gotoNext";
		},
		
		_onKeyboardNavigation: function(e) {
			// https://stackoverflow.com/questions/4471582/keycode-vs-which
			switch(e.which){
				case 37: { this.gotoPrev(); } break; // left arrow key
				case 39: { this.gotoNext(); } break; // right arrow key
			}
		},
		
		_onMouseWheelNavigation: function(e, delta) {
			// sometimes we need to disable/enable default behavior
			if(this.config.mouseWheelPreventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
			
			if(delta<0) {
				this.gotoPrev();
			} else {
				this.gotoNext();
			}
		},
		
		_onDblClickZoomDefault: function(e) {
			this._setZoom({zoom:1}, true, false);
		},
		
		_onDblTapZoomDefault: function(e) {
			if(this.tapped) { //if tap is not set, set up single tap
				clearTimeout(this.tapped); //stop single tap callback
				this.tapped = null;
				this._setZoom({zoom:1}, true, false); //things we want to do when double tapped
			} else {
				var _self = this;
				this.tapped=setTimeout(function(){_self.tapped = null; },300); //wait 300ms then run single click code
			}
		},
		
		_onMouseWheelZoom: function(e, delta) {
			if(this.config.mouseWheelPreventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}

			var rcStage = this.controls.$stage.get(0).getBoundingClientRect(),
			x = e.clientX,
			y = e.clientY,
			focalPoint = null,
			zoom = 1 + delta * 0.1;
			
			x = x - rcStage.left;
			y = y - rcStage.top;
			
			focalPoint = {
				x: x - (rcStage.right- rcStage.left)/2,
				y: y - (rcStage.bottom- rcStage.top)/2
			}
			
			this._setDeltaZoom({
				zoom: zoom,
				focalPoint: focalPoint
			});
		},
		
		_onKeyboardZoom: function(e) {
			switch(e.which){
				case 189:
				case 109: {
					var zoom = this._getZoom() - this.config.zoomStep;
					this._setZoom({zoom:zoom}, true, false);
				} break; // minus
				case 187:
				case 107: {
					var zoom = this._getZoom() + this.config.zoomStep;
					this._setZoom({zoom:zoom}, true, false);
				} break; // plus
			}
		},
		
		_onPinchZoomTouchStart: function(e) {
			this.pinchZoom.aStart = e.originalEvent.touches[0] && e.originalEvent.touches.length > 1;
			this.pinchZoom.bStart = e.originalEvent.touches[1];
			if (!this.pinchZoom.aIsMoving && !this.pinchZoom.bIsMoving && this.pinchZoom.aStart && this.pinchZoom.bStart) {
				e.preventDefault();
				e.stopPropagation();
				
				this.controls.$stage.focus();
				this.controls.$bookTransform.addClass('ipgs-no-transition');
				
				this.pinchZoom.aStartX = e.originalEvent.touches[0].pageX;
				this.pinchZoom.aStartY = e.originalEvent.touches[0].pageY;
				this.pinchZoom.bStartX = e.originalEvent.touches[1].pageX;
				this.pinchZoom.bStartY = e.originalEvent.touches[1].pageY;
				
				this.controls.$stage.on('touchmove', $.proxy(this._onPinchZoomTouchMove, this));
				
				// Set the start date and current X/Y for finger "a" & finger "b".
				this.pinchZoom.zoom = this._getZoom();
				this.pinchZoom.startDate = new Date().getTime();
				this.pinchZoom.aCurX = this.pinchZoom.aStartX;
				this.pinchZoom.aCurY = this.pinchZoom.aStartY;
				this.pinchZoom.bCurX = this.pinchZoom.bStartX;
				this.pinchZoom.bCurY = this.pinchZoom.bStartY;
				this.pinchZoom.aIsMoving = true;
				this.pinchZoom.bIsMoving = true;
			}
		},
		
		_onPinchZoomTouchMove: function(e) {
			
			if(this.pinchZoom.aIsMoving || this.pinchZoom.bIsMoving) {
				this.pinchZoom.aCurX = e.originalEvent.touches[0].pageX;
				this.pinchZoom.aCurY = e.originalEvent.touches[0].pageY;
				this.pinchZoom.bCurX = e.originalEvent.touches[1].pageX;
				this.pinchZoom.bCurY = e.originalEvent.touches[1].pageY;
				
				// If there's a MultiTouchMove event, call it passing
				// current X and Y position (curX and curY).
				var endDate = new Date().getTime(), // current date to calculate timing
				ms = this.pinchZoom.startDate - endDate; // duration of touch in milliseconds
				
				var ax = this.pinchZoom.aCurX, // current left position of finger 'a'
				ay = this.pinchZoom.aCurY, // current top position of finger 'a'
				bx = this.pinchZoom.bCurX, // current left position of finger 'b'
				by = this.pinchZoom.bCurY, // current top position of finger 'b'
				dax = ax - this.pinchZoom.aStartX, // diff of current left to starting left of finger 'a'
				day = ay - this.pinchZoom.aStartY, // diff of current top to starting top of finger 'a'
				dbx = bx - this.pinchZoom.bStartX, // diff of current left to starting left of finger 'b'
				dby = by - this.pinchZoom.bStartY, // diff of current top to starting top of finger 'b'
				aax = Math.abs(dax), // amount of horizontal movement of finger 'a'
				aay = Math.abs(day), // amount of vertical movement of finger 'a'
				abx = Math.abs(dbx), // amount of horizontal movement of finger 'b'
				aby = Math.abs(dby); // amount of vertical movement of finger 'b'
				
				//diff of current starting distance to starting distance between the 2 points
				var diff = Math.sqrt((this.pinchZoom.aStartX - this.pinchZoom.bStartX) * (this.pinchZoom.aStartX - this.pinchZoom.bStartX) + (this.pinchZoom.aStartY - this.pinchZoom.bStartY) * (this.pinchZoom.aStartY - this.pinchZoom.bStartY)) - Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
				
				var zoom = this.pinchZoom.zoom - diff * this.config.pinchZoomCoef;
				this._setZoom({zoom:zoom}, true, false);
			}
		},
		
		_onPinchZoomTouchEnd: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			// when touch events are not present, use mouse events.
			this.controls.$stage.off('touchmove', $.proxy(this._onPinchZoomTouchMove, this));
			this.controls.$bookTransform.addClass('ipgs-no-transition');
			
			this._pinchZoomReset();
		},
		
		_pinchZoomReset: function() {
			this.pinchZoom.aStartX = false;
			this.pinchZoom.aStartY = false;
			this.pinchZoom.bStartX = false;
			this.pinchZoom.bStartY = false;
			this.pinchZoom.startDate = false;
			this.pinchZoom.aIsMoving = false;
			this.pinchZoom.bIsMoving = false;
		},
		
		_onToolbarControlClick: function(e) {
			this.controls.$stage.focus();
		},
		
		_onPageFirst: function(e) {
			this.gotoPage(0);
		},
		
		_onPagePrev: function(e) {
			this.gotoPrev();
		},
		
		_pageNumberInputShow: function() {
			this.controls.toolbar.$pagenumber.addClass('ipgs-pagenumber-input');
			this.controls.toolbar.$pagenumberInput.focus().val(this.currPage+1);
		},
		
		_pageNumberInputHide: function() {
			this.controls.toolbar.$pagenumber.removeClass('ipgs-pagenumber-input');
		},
		
		_pageNumberInputUpdate: function() {
			var pageNumber = parseInt(this.controls.toolbar.$pagenumberInput.val(), 10);
				
			if(pageNumber <= 0) {
				pageNumber = 1;
			} else if(pageNumber > this.pages.length) {
				pageNumber = this.pages.length;
			} else if(isNaN(pageNumber)) {
				pageNumber = this.currPage+1;
			}
			
			this.controls.toolbar.$pagenumberInput.val(pageNumber);
			
			this.gotoPage(pageNumber);
		},
		
		_onPageNumberLabelClick: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			this.$body.one('click', $.proxy(this._onPageNumberInputHide, this));
			this._pageNumberInputShow();
		},
		
		_onPageNumberInputClick: function(e) {
			e.preventDefault();
			e.stopPropagation();
		},
		
		_onPageNumberInputHide: function(e) {
			this._pageNumberInputUpdate();
			this._pageNumberInputHide();
		},
		
		_onPageNumberInputKeyup: function(e) {
			if(e.which == 13) {
				this._pageNumberInputUpdate();
			} if(e.which == 27) {
				this.$body.off('click', $.proxy(this._onPageNumberInputHide, this));
				this._pageNumberInputHide();
			}
		},
		
		_onPageNext: function(e) {
			this.gotoNext();
		},
		
		_onPageLast: function(e) {
			this.gotoPage(this.pages.length);
		},
		
		_onToggleThumbnails: function(e) {
			this.controls.$thumbnails.toggleClass('ipgs-active');
			this.controls.toolbar.$thumbnails.toggleClass('ipgs-active');
			
			if(this.controls.$thumbnails.hasClass('ipgs-active')) {
				this._onThumbnailsScroll();
			}
			
			if(this.controls.$outline.hasClass('ipgs-active')) {
				this.controls.$outline.toggleClass('ipgs-active');
				this.controls.toolbar.$outline.toggleClass('ipgs-active');
			}
		},
		
		_onThumbnailsScroll: function(e) {
			clearTimeout(this.thumbnailsScrollTimerId);
			this.thumbnailsScrollTimerId = setTimeout($.proxy(this._onThumbnailsRefresh, this), this.thumbnailsScrollTimeout);
		},
		
		_onThumbnailsRefresh: function() {
			if(!this.controls.$thumbnails.hasClass('ipgs-active') || this.pages.length == 0) {
				return;
			}
			
			var $firstThumb = this.controls.$thumbnails.find('.ipgs-thumb:first-child'),
			thumbHeight = $firstThumb.outerHeight(true),
			containerHeight = this.controls.$thumbnails.outerHeight(),
			containerTop = this.controls.$thumbnails.scrollTop(),
			containerBottom = containerTop + containerHeight,
			thumbFirst = Math.floor(containerTop / thumbHeight),
			thumbsLast = Math.floor(containerBottom / thumbHeight);
			
			for(var i=thumbFirst; i<=thumbsLast && i<this.pages.length; i++) {
				this._loadThumbData(this.pages[i].$thumb);
			}
		},
		
		_onThumbClick: function(e) {
			e.preventDefault;
			e.stopPropagation();
			
			var pageIndex = $(e.target).data('page-index');
			this._gotoPage(pageIndex);
		},
		
		_onToggleOutline: function(e) {
			this.controls.$outline.toggleClass('ipgs-active');
			this.controls.toolbar.$outline.toggleClass('ipgs-active');
			
			if(this.controls.$thumbnails.hasClass('ipgs-active')) {
				this.controls.$thumbnails.toggleClass('ipgs-active');
				this.controls.toolbar.$thumbnails.toggleClass('ipgs-active');
			}
		},
		
		_onBookmarkClick: function(e) {
			e.preventDefault;
			e.stopPropagation();
			
			var $bookmark = $(e.currentTarget);
			
			if($(e.target).is('.ipgs-state')) {
				$bookmark.toggleClass('ipgs-folded');
			} else {
				var link = $bookmark.data('link'),
				target = $bookmark.data('target');
				
				if(link) {
					if(target == 'page') {
						var pageIndex = parseInt(link, 10);
						if(isNaN(pageIndex)) {
							return;
						}
						
						if(pageIndex < 0) {
							pageIndex = pageIndex + this.pages.length;
						} else {
							pageIndex = pageIndex - 1;
						}
						
						this._gotoPage(pageIndex);
					} else {
						target = '_' + target;
						var $link = $('<a></a>').attr('href', link).attr('target', target);
						this.$body.append($link);
						$link.get(0).click();
						$link.remove();
					}
				}
			}
		},
		
		_onZoomIn: function(e) {
			this._zoomIn();
		},
		
		_onZoomOut: function(e) {
			this._zoomOut();
		},
		
		_onZoomDefault: function(e) {
			this._setZoom({zoom:1}, true, false);
		},
		
		_onToggleOptional: function(e) {
			this.controls.toolbar.$optional.toggleClass('ipgs-active');
			this.controls.toolbar.$optionalBar.toggleClass('ipgs-active');
		},
		
		_onToggleSound: function(e) {
			this.config.flipSound = !this.config.flipSound;
			this.controls.toolbar.$sound.toggleClass('ipgs-disable', !this.config.flipSound);
		},
		
		_onFullScreenChange: function(e) {
			if(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement) {
				this.$container.addClass('ipgs-fullscreen');
				this.$container.get(0).offsetHeight;
				
				if(this.controls.toolbar.$fullscreen) {
					this.controls.toolbar.$fullscreen.addClass('ipgs-active');
				}
			} else {
				this.$container.removeClass('ipgs-fullscreen');
				this.$container.get(0).offsetHeight;
				
				if(this.controls.toolbar.$fullscreen) {
					this.controls.toolbar.$fullscreen.removeClass('ipgs-active');
				}
			}
			
			var _self = this;
			setTimeout(function() {
				_self._onResize();
			}, 100);
		},
		
		_onToggleFullscreen: function(e) {
			if(!this.$container.hasClass('ipgs-fullscreen')) {
				try {
					var el = this.$container.get(0);
					if(el.requestFullscreen) { el.requestFullscreen(); }
					else if(el.mozRequestFullScreen) { el.mozRequestFullScreen(); } 
					else if(el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); } 
					else if(el.msRequestFullscreen) { el.msRequestFullscreen(); }
				} catch(event) {
					console.error('The browser does not support the fullscreen API');
				}
			} else {
				try {
					if(document.exitFullscreen) { document.exitFullscreen(); }
					else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
					else if(document.webkitCancelFullScreen) { document.webkitCancelFullScreen(); }
					else if(document.msExitFullscreen) { document.msExitFullscreen(); }
				} catch(event) {
					console.error('The browser does not support the fullscreen API');
				}
			}
		},
		
		_onDownload: function(e) {
			if(this.config.pdfUrl) {
				var filename = this.config.pdfUrl.substring(this.config.pdfUrl.lastIndexOf('/') + 1, this.config.pdfUrl.length),
				$link = $('<a></a>').attr('href', this.config.pdfUrl).attr('download', filename);
				this.$body.append($link);
				$link.get(0).click();
				$link.remove();
			}
		},
		
		_getShareUrl: function() {
			return window.location.href;
		},
		
		_buildUrl: function(baseUrl, params) {
			var i=0;
			for(var prop in params) {
				baseUrl += (i?'&':'') + prop + '=' + encodeURIComponent(params[prop]);
				i++;
			};
			
			return baseUrl;
		},
		
		_onToggleShare: function(e) {
			if(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var target = e.toElement || e.relatedTarget;
				if(this.controls.$shareDialog.has(target).length === 0 && !this.controls.$shareDialog.is(target)) {
					this.controls.$share.toggleClass('ipgs-active');
					this.controls.toolbar.$share.toggleClass('ipgs-active');
				}
			} else {
				this.controls.$share.toggleClass('ipgs-active');
				this.controls.toolbar.$share.toggleClass('ipgs-active');
			}
		},
		
		_executeShareUrl: function(url) {
			var $link = $('<a></a>').attr('href', url).attr('target', '_blank');
			this.$body.append($link);
			$link.get(0).click();
			$link.remove();
		},
		
		_onShareClick: function(type, e) {
			var url = '',
			params = {};
			
			switch(type) {
				case 'facebook': {
					url = 'http://www.facebook.com/sharer.php?';
					params = {'u':this._getShareUrl()};
				} break;
				case 'twitter': {
					url = 'http://twitter.com/share?';
					params = {'url': this._getShareUrl()};
				} break;
				case 'google': {
					url = 'https://plus.google.com/share?';
					params = {'url': this._getShareUrl()};
				} break;
				case 'linkedin': {
					url = 'http://www.linkedin.com/shareArticle?';
					params = {'mini':'true','url': this._getShareUrl()};
				} break;
				case 'email': {
					url = 'mailto:?';
					params = {'subject':'','body':this._getShareUrl()};
				} break;
				default: {
					return;
				}
			}
			this._executeShareUrl(this._buildUrl(url, params));
		},
		
		_destroy: function() {
			var $root = this.$container,
			$elements = this.$container.find('.ipgs-come-back');
			
			$root.removeClass('ipgs ipgs-ready').removeClass(this.engineClass).removeClass(this.themeClass).empty();
			$($elements).each(function() {
				$root.append($(this).removeClass('ipgs-come-back'));
			});
			
			this._unbind();
		},
		//=============================================
		// Public Methods
		//=============================================
		gotoPage: function(pageNumber) {
			this._gotoPage(pageNumber - 1);
		},
		gotoNext: function() {
			this._gotoNext();
		},
		gotoPrev: function() {
			this._gotoPrev();
		},
		zoomIn: function() {
			this._zoomIn();
		},
		zoomOut: function() {
			this._zoomOut();
		},
		zoomDefault: function() {
			this._setZoom({zoom:1}, true, false);
		},
		setBookEngine: function(bookEngine) {
			var engineClass = (bookEngine ? 'ipgs-' + bookEngine.toLowerCase() : null);
			
			if(this.engineClass == engineClass) {
				return false;
			}
			
			switch(engineClass) {
				case 'ipgs-twopageflip':
				case 'ipgs-onepageflip':
				case 'ipgs-onepageswipe':
				break;
				default: {
					console.error(this.config.txtFailedEngine + ' [' + bookEngine + ']');
					return false;
				}
			}
			
			this.controls.$bookTransform.addClass('ipgs-no-transition');
			this.controls.$book.addClass('ipgs-no-transition');
			
			this.$container.removeClass(this.engineClass);
			this.engineClass = engineClass;
			this.$container.addClass(this.engineClass);
			
			for(var i=0, len=this.pages.length;i<len;i++) {
				var $page = this.pages[i];
				$page.removeClass('ipgs-left').removeClass('ipgs-right');
				$page.css({'left':''});
			}
			this.controls.$book.css({'transform':''});
			
			switch(this.engineClass) {
				case 'ipgs-twopageflip': {
					this.bookWidth = this.config.pageWidth * 2;
					this.engine = new TwoPageFlip(this, $.extend(true, {}, this.config.twoPageFlip));
				} break;
				case 'ipgs-onepageflip': {
					this.bookWidth = this.config.pageWidth;
					this.engine = new OnePageFlip(this, $.extend(true, {}, this.config.onePageFlip));
				} break;
				case 'ipgs-onepageswipe': {
					this.bookWidth = this.config.pageWidth;
					this.engine = new OnePageSwipe(this, $.extend(true, {}, this.config.onePageSwipe));
				} break;
			}
			this.controls.$book.css({'width':this.bookWidth});
			
			if(this.pages.length > 0) {
				this._updateBook(1);
			}
			this._updateSize();
			
			this.controls.$bookTransform.removeClass('ipgs-no-transition');
			this.controls.$book.removeClass('ipgs-no-transition');
		}
	}
	
	//=============================================
	// Init jQuery Plugin
	//=============================================
	/**
	 * @param CfgOrCmd - config object or command name
	 * @param CmdArgs - some commands may require an argument
	 * List of methods:
	 * $("#flipbook").ipages("destroy")
	 * $("#flipbook").ipages("instance")
	 */
	$.fn.ipages = function(CfgOrCmd, CmdArgs) {
		if (CfgOrCmd == 'instance') {
			var $container = $(this),
			instance = $container.data(ITEM_DATA_INSTANCE);
			
			if (!instance) {
				console.error('Calling "instance" method on not initialized instance is forbidden');
				return;
			}
			
			return instance;
		}
		
		return this.each(function() {
			var $container = $(this),
			instance = $container.data(ITEM_DATA_INSTANCE),
			jsonUrl = $container.data('json'),
			pdfUrl = $container.data('pdf-src'),
			pdfDisableRangeRequests = $container.data('pdf-disable-range-requests'),
			bookEngine = $container.data('book-engine'),
			pageWidth = parseInt($container.data('page-width'),10),
			pageHeight = parseInt($container.data('page-height'),10),
			options = $.isPlainObject(CfgOrCmd) ? CfgOrCmd : (jsonUrl ? null : {});
			
			if(CfgOrCmd == 'destroy') {
				if (!instance) {
					console.error('Calling "destroy" method on not initialized instance is forbidden');
					return;
				}
				
				$container.removeData(ITEM_DATA_INSTANCE);
				instance._destroy();
				
				return;
			}
			
			if(instance) {
				$container.removeData(ITEM_DATA_INSTANCE);
				instance._destroy();
				instance = null;
			}
			
			function init() {
				var config = $.extend(true, {}, iPages.prototype.defaults, options);
				
				//=============================================
				// Book options
				config.bookEngine = (bookEngine ? bookEngine : config.bookEngine);
				config.pageWidth = (isNaN(pageWidth) ? config.pageWidth : pageWidth);
				config.pageHeight = (isNaN(pageHeight) ? config.pageHeight : pageHeight);
				//=============================================
				
				//=============================================
				if(typeof(pdfDisableRangeRequests) === 'boolean') {
					config.pdfDisableRangeRequests = pdfDisableRangeRequests;
				}
				//=============================================
				
				//=============================================
				// if the pdfUrl parameter is not set, we try to use value from data-pdf-src attribute
				if(config.pdfUrl == null && pdfUrl) {
					config.pdfUrl = pdfUrl;
					config.pdfAutoCreatePages = true;
					config.pdfBookSizeFromDocument = true;
				}
				//=============================================
				
				//=============================================
				// special processing for options with type array
				function processArrayOptions(defaultArray, userArray) {
					var resultArray = [];
					
					for(var i=0;i<userArray.length;i++) {
						var userItem = userArray[i];
						
						for(var j=0; j<defaultArray.length;j++) {
							var defaultItem = defaultArray[j];
							
							if(defaultItem.type == userItem.type) {
								var item = $.extend(true, {}, defaultItem, userItem);
								resultArray.push(item);
							}
						}
					}
					
					for(var i=0; i<defaultArray.length;i++) {
						var defaultItem = defaultArray[i],
						flag = true;
						
						for(var j=0;j<userArray.length;j++) {
							var userItem = userArray[j];
							
							if(defaultItem.type == userItem.type) {
								flag = false;
								break;
							}
						}
						
						if(flag) {
							var item = $.extend(true, {}, defaultItem);
							resultArray.push(item);
						}
					}
					
					return resultArray;
				}
				
				if(options.toolbarControls && options.toolbarControls instanceof Array) {
					config.toolbarControls = processArrayOptions(iPages.prototype.defaults.toolbarControls, options.toolbarControls);
				}
				
				if(options.shareControls && options.shareControls instanceof Array) {
					config.shareControls = processArrayOptions(iPages.prototype.defaults.shareControls, options.shareControls);
				}
				
				if(options.bookmarks && options.bookmarks instanceof Array) {
					config.bookmarks = $.extend(true, [], options.bookmarks);
				}
				//=============================================
				
				//=============================================
				// lets try to set the default flip sound
				if(config.flipSoundUrl == null) {
					var scripts = document.getElementsByTagName('script'),
					scriptName = 'jquery.ipages.min',
					soundName = 'page-flip.mp3',
					scriptUrl = null;
					
					if(scripts && scripts.length > 0) {
						for(var i in scripts) {
							if(scripts[i].src && scripts[i].src.match(new RegExp(scriptName+'\\.js$'))) {
								scriptUrl = scripts[i].src.replace(new RegExp('(.*)'+scriptName+'\\.js$'), '$1');
								break;
							}
						}
					}
					
					if(scriptUrl) {
						config.flipSoundUrl = scriptUrl + soundName;
					}
				}
				//=============================================
				
				instance = new iPages($container, config);
				$container.data(ITEM_DATA_INSTANCE, instance);
			}
			
			// options have more priority than json
			if(options == null) {
				$.ajax({
					url: jsonUrl,
					type: 'GET',
					dataType: 'json'
				}).done(function(data) {
					options = $.isPlainObject(data) ? data : {};
				}).fail(function() {
					options = {};
				}).always(function() {
					init();
				});
			} else {
				init();
			}
		});
	}
	
	$('.ipgs-flipbook').ipages();
})(jQuery, window, document);

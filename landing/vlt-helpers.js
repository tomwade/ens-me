/***********************************************
 * VLThemes
 ***********************************************/

'use strict';

/**
 * Initialize main helper object
 */
var VLTJS = {
	window: jQuery(window),
	document: jQuery(document),
	html: jQuery('html'),
	body: jQuery('body'),
	is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
	is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
	is_chrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
	is_ie10: navigator.appVersion.indexOf('MSIE 10') !== -1,
	transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
	animIteration: 'animationiteration webkitAnimationIteration oAnimationIteration MSAnimationIteration',
	animationEnd: 'animationend webkitAnimationEnd'
};

/**
 * Detects whether user is viewing site from a mobile device
 */
VLTJS.isMobile = function(agent) {
	agent = agent || navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
};

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout;
VLTJS.window.on('load resize orientationchange', function(e) {
	if (resizeArr.length) {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function() {
			for (var i = 0; i < resizeArr.length; i++) {
				resizeArr[i](e);
			}
		}, 250);
	}
});

VLTJS.debounceResize = function(callback) {
	if (typeof callback === 'function') {
		resizeArr.push(callback);
	} else {
		window.dispatchEvent(new Event('resize'));
	}
}


VLTJS.addLedingZero = function(number) {
	return ('0' + number).slice(-2);
}

/**
 * Throttle scroll
 */
var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;

VLTJS.window.on('load resize scroll orientationchange', function() {
	if (throttleArr.length) {
		didScroll = true;
	}
});

function hasScrolled() {

	var scrollTop = VLTJS.window.scrollTop(),
		windowHeight = VLTJS.window.height(),
		documentHeight = VLTJS.document.height(),
		scrollState = '';

	// Make sure they scroll more than delta
	if (Math.abs(lastScrollTop - scrollTop) <= delta) {
		return;
	}

	if (scrollTop > lastScrollTop) {
		scrollState = 'down';
	} else if (scrollTop < lastScrollTop) {
		scrollState = 'up';
	} else {
		scrollState = 'none';
	}

	if (scrollTop === 0) {
		scrollState = 'start';
	} else if (scrollTop >= documentHeight - windowHeight) {
		scrollState = 'end';
	}

	for (var i in throttleArr) {
		if (typeof throttleArr[i] === 'function') {
			throttleArr[i](scrollState, scrollTop, lastScrollTop, VLTJS.window);
		}
	}

	lastScrollTop = scrollTop;
}

setInterval(function() {
	if (didScroll) {
		didScroll = false;
		window.requestAnimationFrame(hasScrolled);
	}
}, 250);

VLTJS.throttleScroll = function(callback) {
	if (typeof callback === 'function') {
		throttleArr.push(callback);
	}
}

/**
 * Masonry grid
 */
jQuery.fn.vlt_masonry_grid = function() {

	var $ = jQuery,
		$el = $(this);

	$el.imagesLoaded(function() {
		$el.masonry({
			columnWidth: '.grid-sizer',
			itemSelector: '.grid-item',
			gutter: '.gutter-sizer',
		});
	});

	return this;
};

/**
 * AOS animation
 */
if (typeof AOS !== 'undefined') {

	VLTJS.window.on('vlt.preloader_done', function() {
		AOS.init({
			disable: 'mobile',
			offset: 120,
			once: true,
			duration: 1000,
			easing: 'ease',
		});

		function aos_refresh() {
			AOS.refresh();
		}

		aos_refresh();
		VLTJS.debounceResize(aos_refresh);
	});

}

/**
 * VAR polyfill
 */
if (typeof cssVars !== 'undefined') {
	cssVars(
	// 	{
	// 	onlyVars: true,
	// }
	);
}

/**
 * AJAX load more button
 */
jQuery.fn.vlt_ajax_load_more_button = function() {


	if (typeof VLT_LOAD_MORE_CDATA == 'undefined') {
		return;
	}

	var $ = jQuery,
		$el = $(this);

	var startPage = parseInt(VLT_LOAD_MORE_CDATA.load_more_btn_startPage) + 1,
		maxPages = parseInt(VLT_LOAD_MORE_CDATA.load_more_btn_maxPages),
		nextLink = VLT_LOAD_MORE_CDATA.load_more_btn_nextLink,
		noMore = VLT_LOAD_MORE_CDATA.load_more_btn_noMore,
		text = VLT_LOAD_MORE_CDATA.load_more_btn_text,
		loading = VLT_LOAD_MORE_CDATA.load_more_btn_loading;

	$('.vlt-btn--ajax-load-more span').html(text);

	var postsContainer = $el.find('.masonry'),
		itemSelector = '.grid-item';

	$el.on('click', '.vlt-btn--ajax-load-more', function(e) {
		e.preventDefault();

		if (nextLink === null) {
			return;
		}

		var $this = $(this);

		if (!$this.hasClass('disabled')) {
			$this.addClass('loading');
			$this.find('span').html(loading);
		}

		if (startPage <= maxPages) {

			$.ajax({
				type: 'POST',
				url: nextLink,
				dataType: 'html',
				success: function(data) {
					var newElems = $(data).find(itemSelector);
					if (newElems.length > 0) {

						postsContainer.append(newElems);

						postsContainer.imagesLoaded(function() {
							postsContainer.masonry('appended', newElems);
							VLTJS.document.trigger('vlt.loaded_more');
						});

						$this.removeClass('loading');
						$this.find('span').html(text);

					} else {
						$this.removeClass('loading').addClass('disabled');
						$this.find('span').html(noMore);
					}
					startPage++;
					nextLink = nextLink.replace(/\/page\/[0-9]+/, '/page/' + startPage);

					if (startPage <= maxPages) {
						$this.removeClass('loading');
					} else {
						$this.removeClass('loading').addClass('disabled');
						$this.find('span').html(noMore);
					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown);
				}
			});
		}

	});

	return this;

};
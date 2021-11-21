/***********************************************
 * AUDIO PLAYER
 ***********************************************/
(function($) {

	'use strict';

	var el = $('.vlt-audio-player');

	el.each(function() {

		var $this = $(this),
			playButton = $this.find('.vlt-audio-player__button > a'),
			playButtonIcon = playButton.find('i'),
			audio = $this.find('audio'),
			audioObject = audio.get(0);

		audio.on('ended', function() {
			playButtonIcon.removeClass('leedo-pause-button').addClass('leedo-play-button');
		});

		playButton.on('click', function(e) {
			e.preventDefault();
			$('.vlt-audio-player__button > a > i').removeClass('leedo-pause-button').addClass('leedo-play-button');
			if (audioObject.paused) {
				audioObject.play();
				playButtonIcon.removeClass('leedo-play-button').addClass('leedo-pause-button');
			} else {
				audioObject.pause();
				playButtonIcon.removeClass('leedo-pause-button').addClass('leedo-play-button');
			}

		});
	});

})(jQuery);
/***********************************************
 * AWARDS SLIDER
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-awards-list');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			loop: false,
			slidesPerView: 'auto',
			spaceBetween: 110,
			speed: 1000,
			mousewheel: {
				releaseOnEdges: false,
			},
			freeMode: true,
			slidesOffsetBefore: container[0].getBoundingClientRect().left + 15,
			slidesOffsetAfter: container[0].getBoundingClientRect().left + 15,
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);
/***********************************************
 * COUNTDOWN
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.countdown == 'undefined') {
		return;
	}

	// check if object defined
	if (typeof VLT_COUNTDOWN_CDATA == 'undefined') {
		return;
	}

	$('.vlt-countdown').each(function() {
		var $this = $(this),
			final_date = $this.data('final-date');

		$this.countdown(final_date, function(e) {
			$(this).html(e.strftime(''
				+ '<div><strong>%-D</strong><h5>' + VLT_COUNTDOWN_CDATA.days + '</h5></div>'
				+ '<div><strong>%H</strong><h5>' + VLT_COUNTDOWN_CDATA.hours + '</h5></div>'
				+ '<div><strong>%M</strong><h5>' + VLT_COUNTDOWN_CDATA.minutes + '</h5></div>'
				+ '<div><strong>%S</strong><h5>' + VLT_COUNTDOWN_CDATA.seconds + '</h5></div>'
			));
		});

	});

})(jQuery);
/***********************************************
 * COUNTER UP
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof anime == 'undefined') {
		return;
	}

	$('.vlt-counter-up').each(function() {

		var $duration = 1500,
			$delay = 150;

		$(this).one('inview', function() {
			var $this = $(this),
				finalValue = $this.data('value') || 0,
				finalValueContainer = $this.find('strong'),
				obj = {
					count: 0
				};

			anime({
				targets: obj,
				count: finalValue,
				round: 1,
				easing: 'linear',
				duration: $duration,
				delay: $delay,
				update: function() {
					finalValueContainer.text(obj.count);
				}
			});
		});
	});

})(jQuery);
/***********************************************
 * FAQ
 ***********************************************/
(function($) {

	'use strict';

	$('.vlt-faq-container').each(function() {
		var container = $(this),
			type = container.data('type'),
			index = container.data('active-index'),
			item = container.find('.vlt-faq-item');

		if (index <= 0) {
			item.removeClass('vlt-faq-item--active');
		} else {
			item.eq(index-1).addClass('vlt-faq-item--active').find('.vlt-faq-item__content').show(0);
		}

		switch(type) {

			case 'accordion':

				item.on('click', '.vlt-faq-item__header', function() {
					var $this = $(this),
						parentItem = $this.parent('.vlt-faq-item'),
						content = parentItem.find('.vlt-faq-item__content');

					if (parentItem.hasClass('vlt-faq-item--active')) {
						return;
					}

					item.removeClass('vlt-faq-item--active');
					parentItem.addClass('vlt-faq-item--active');

					item.find('.vlt-faq-item__content').slideUp(300);
					content.slideDown(300);
				});

			break;

			case 'toggle':

				item.on('click', '.vlt-faq-item__header', function() {
					var $this = $(this),
						parentItem = $this.parent('.vlt-faq-item'),
						content = parentItem.find('.vlt-faq-item__content');

					parentItem.toggleClass('vlt-faq-item--active');

					content.slideToggle(300);
				});

			break;
		}

	});

})(jQuery);
/***********************************************
 * FIT TEXT
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.fitText == 'undefined') {
		return;
	}

	function fit_text() {
		$('.vlt-fit-text').each(function() {
			var $this = $(this),
				compressor = $this.data('comp-rate') || 1;
			$this.fitText(compressor, {
				minFontSize: $this.data('min-size') || Number.NEGATIVE_INFINITY,
				maxFontSize: $this.data('max-size') || Number.POSITIVE_INFINITY
			});
		});
	}

	VLTJS.window.trigger('resize');

	fit_text();
	VLTJS.debounceResize(fit_text);

})(jQuery);
/***********************************************
 * FIXED AUDIO LINK
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Howl == 'undefined') {
		return;
	}

	function audio_link() {

		$('.vlt-fixed-audio-link').each(function() {
			var $this = $(this),
				audioSrc = $this.attr('href') || '',
				audioAutoplay = $this.data('audio-autoplay') || false,
				audioLoop = $this.data('audio-loop') || false,
				audioVolume = $this.data('audio-volume') || 0.5;

			var audio = new Howl({
				src: [audioSrc],
				autoplay: audioAutoplay,
				loop: audioLoop,
				volume: audioVolume,
				onplay: function() {
					$this.removeClass('pause').addClass('play');
				},
				onpause: function() {
					$this.removeClass('play').addClass('pause');
				}
			});

			if ($this.filter('.play')) {
				$this.find('i').removeClass('fa-play').addClass('fa-pause');
			}

			$this.on('click', function(e) {
				e.preventDefault();
				var currentButton = $(this),
					icon = currentButton.find('i');
				if (currentButton.hasClass('pause')){
					icon.removeClass('fa-play').addClass('fa-pause');
					audio.play();
				} else {
					icon.removeClass('fa-pause').addClass('fa-play');
					audio.pause();
				}
			});

		});

	}

	VLTJS.window.on('vlt.preloader_done', function() {
		audio_link();
	});

})(jQuery);
/***********************************************
 * FOOTER FIXED
 ***********************************************/
(function($) {

	'use strict';

	function vlthemes_fixed_footer() {
		var footer = $('.vlt-footer').filter('.vlt-footer--fixed'),
			siteWrapperInner = $('.vlt-site-wrapper__inner'),
			footerHeight = footer.outerHeight();

		siteWrapperInner.css({
			'margin-bottom': footerHeight
		});
	}

	vlthemes_fixed_footer();
	VLTJS.debounceResize(vlthemes_fixed_footer);

})(jQuery);
/***********************************************
 * FIXED SOCIAL LINKS
 ***********************************************/
(function($) {

	'use strict';

	var el = $('.vlt-fixed-social-links');

	if (!el.length) {
		return;
	}

	VLTJS.window.on('scroll resize', function() {

		$('.vlt-main').each(function() {
			var $this = $(this),
				sT = VLTJS.window.scrollTop(),
				thisH = $this.outerHeight(),
				oT = $this.offset().top,
				winH = VLTJS.window.height() / 2;

			if (sT >= winH && sT <= thisH + oT - winH) {
				el.removeClass('is-hidden').addClass('is-visible');
			} else {
				el.removeClass('is-visible').addClass('is-hidden');
			}
		});

	});

})(jQuery);
/***********************************************
 * IMAGE SLIDER
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-image-slider');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			slidesPerView: 1,
			grabCursor: true,
			speed: 1000,
			navigation: {
				nextEl: $this.find('.vlt-swiper-button-next'),
				prevEl: $this.find('.vlt-swiper-button-prev'),
			},
			pagination: {
				el: $this.find('.vlt-swiper-pagination').get(0),
				clickable: true,
			},
		});

		swiper.init();

	});

})(jQuery);
/***********************************************
 * MARQUEE
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof anime == 'undefined') {
		return;
	}

	$('.vlt-marquee').each(function() {
		var $this = $(this),
			direction = $this.data('direction') || 'normal',
			duration = $this.data('duration') || 10000;

		if ($this.find('.vlt-marquee__item--copy').length) {
			duration = duration * 2;
		}

		anime({
			targets: $this.find('.vlt-marquee__item--original')[0],
			autoplay: true,
			translateX: [{
				value: '0%',
				delay: 0,
				duration: 0
			},
			{
				value: '-100%',
				delay: 0,
				duration: duration
			},
			{
				value: '100%',
				delay: 0,
				duration: 0
			},
			{
				value: '0%',
				delay: 0,
				duration: duration
			}
			],
			direction: direction,
			loop: true,
			delay: 0,
			easing: 'linear'
		});

		anime({
			targets: $this.find('.vlt-marquee__item--copy')[0],
			autoplay: true,
			translateX: [{
				value: '100%',
				delay: 0,
				duration: 0
			},
			{
				value: '0%',
				delay: 0,
				duration: duration
			},
			{
				value: '-100%',
				delay: 0,
				duration: duration
			},
			{
				value: '100%',
				delay: 0,
				duration: 0
			},
			],
			direction: direction,
			loop: true,
			easing: 'linear'
		});

	});

})(jQuery);
/***********************************************
 * INIT THIRD PARTY SCRIPTS
 ***********************************************/
(function($) {

	'use strict';

	// Comments GDPR
	if ($('input[type="checkbox"][name="gdpr_terms"]:not(.activated), .wpcf7-acceptance input[type="checkbox"]:not(.activated), .vlt-subscribe-form__checkbox input[type="checkbox"]:not(.activated)').length) {
		$('input[type="checkbox"][name="gdpr_terms"]:not(.activated), .wpcf7-acceptance input[type="checkbox"]:not(.activated), .vlt-subscribe-form__checkbox input[type="checkbox"]:not(.activated)')
			.addClass('activated')
			.on('change', function(e) {
				if ($(this).get(0).checked) {
					$(this).parents('form').find('.vlt-btn').removeClass('disabled');
				} else {
					$(this).parents('form').find('.vlt-btn').addClass('disabled');
				}
			}).trigger('change');
	}

	// Jarallax
	if (typeof $.fn.jarallax !== 'undefined') {
		$('.jarallax').jarallax({
			speed: 0.8
		});
	}

	if (typeof $.fn.imagesLoaded !== 'undefined' || typeof $.fn.jarallax !== 'undefined') {
		VLTJS.body.imagesLoaded(function() {
			setTimeout(function() {
				$('[data-jarallax-element]').jarallax('onResize').jarallax('onScroll');
			}, 150);
		});
	}

	// Equal height
	if (typeof $.fn.matchHeight !== 'undefined') {
		function vlthemes_equal_height() {
			setTimeout(function() {
				$('.vc_row .vlt-services-box, .vc_row .vlt-services').matchHeight();
			}, 100);
		}
		vlthemes_equal_height();
		VLTJS.debounceResize(vlthemes_equal_height);
	}

	// Fitvids
	if (typeof $.fn.fitVids !== 'undefined') {
		VLTJS.body.fitVids();
	}

	// Widget menu
	if (typeof $.fn.superclick !== 'undefined') {
		$('.widget_pages > ul, .widget_nav_menu ul.menu').superclick({
			delay: 500,
			cssArrows: false,
			animation: {
				opacity: 'show',
				height: 'show'
			},
			animationOut: {
				opacity: 'hide',
				height: 'hide'
			},
		});
	}

	// Fancybox
	if (typeof $.fn.fancybox !== 'undefined') {
		$.fancybox.defaults.btnTpl = {
			close: '<button data-fancybox-close class="fancybox-button fancybox-button--close">' +
				'<span><i class="leedo-close"></i></span>' +
				'</button>',
			arrowLeft: '<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" href="javascript:;">' +
				'<span><i class="leedo-left-arrow"></i></span>' +
				'</a>',
			arrowRight: '<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" href="javascript:;">' +
				'<span><i class="leedo-right-arrow"></i></span>' +
				'</a>'
		};
		$.fancybox.defaults.buttons = [
			'close'
		];
		$.fancybox.defaults.infobar = false;
		$.fancybox.defaults.transitionEffect = 'slide';
		$.fancybox.defaults.animationEffect = 'fade';
	}
	VLTJS.document.on('beforeInitFancybox.vpf', function(event, vpObject, options) {
		if ( 'vpf' !== event.namespace ) {
			return;
		}
		options.caption = false;
		options.btnTpl = {
			close: '<button data-fancybox-close class="fancybox-button fancybox-button--close">' +
				'<span><i class="leedo-close"></i></span>' +
				'</button>',
			arrowLeft: '<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" href="javascript:;">' +
				'<span><i class="leedo-left-arrow"></i></span>' +
				'</a>',
			arrowRight: '<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" href="javascript:;">' +
				'<span><i class="leedo-right-arrow"></i></span>' +
				'</a>'
		};
	});

	// Add one copy item to swiper loop
	VLTJS.document.on('beforeInitSwiper.vpf', function(event, vpObject, options) {
		if ( 'vpf' !== event.namespace ) {
			return;
		}
		options.loopAdditionalSlides = 1;
	});

	// Remove p / br tags from contact form 7
	$('.wpcf7-form').find('p').contents().unwrap();
	$('.wpcf7-form').find('p, br').remove();

	// Sticky sidebar
	if (typeof $.fn.imagesLoaded !== 'undefined' || typeof $.fn.theiaStickySidebar !== 'undefined') {
		VLTJS.body.imagesLoaded(function() {
			var adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').outerHeight() : 0;
			var stickyHeaderHeight = 0;
			$('.vlt-column-sticky-content, .vlt-column-sticky-sidebar').theiaStickySidebar({
				additionalMarginTop: 60 + adminBarHeight + stickyHeaderHeight,
				additionalMarginBottom: 60
			});
			$('.vlt-shortcode-column-sticky-sidebar').theiaStickySidebar({
				containerSelector: '.vlt-shortcode-column-sticky-wrap',
				additionalMarginTop: 60 + adminBarHeight + stickyHeaderHeight,
				additionalMarginBottom: 60
			});
		});
	}

	// Fast click
	if (typeof FastClick === 'function') {
		FastClick.attach(document.body);
	}

	// Masonry blog
	$('.masonry').vlt_masonry_grid();
	VLTJS.document.on('vlt.loaded_more', function() {
		$('.masonry').vlt_masonry_grid();
	});

	// AJAX load more button
	$('.vlt-blog-posts--load-more_pagination').vlt_ajax_load_more_button();
	$('.vlt-products-list--load-more_pagination').vlt_ajax_load_more_button();

	// Quantity Woo
	VLTJS.document.on('click', '.vlt-quantity .plus, .vlt-quantity .minus', function(){
		var $this = $(this),
			$qty = $this.siblings('.qty'),
			current = parseInt($qty.val(), 10),
			min = parseInt($qty.attr('min'), 10),
			max = parseInt($qty.attr('max'), 10),
			step = parseInt($qty.attr('step'), 10);

		min = min ? min : 1;
		max = max ? max : current + step;

		if ($this.hasClass('minus') && current > min) {
			$qty.val(current - step);
			$qty.trigger('change');
		}

		if ($this.hasClass('plus') && current < max) {
			$qty.val(current + step);
			$qty.trigger('change');
		}

		return false;
	});

	// Fix particles on single product page
	if (typeof $.fn.jarallax !== 'undefined') {
		VLTJS.body.on('click', '.wc-tabs li a', function() {
			setTimeout(function() {
				$('[data-jarallax-element]').jarallax('onResize').jarallax('onScroll');
			}, 10);
		});
	}

})(jQuery);
/***********************************************
 * PORTFOLIO HOVER EFFECT
 ***********************************************/
(function($) {

	'use strict';

	if (!$('div[data-vp-items-style="leedo_work_style_3"]').length) {
		return;
	}

	function vlthemes_portfolio_hover_effect() {

		$('div[data-vp-items-style="leedo_work_style_3"]').parents('body').append('<div class="js-caption"><h4></h4></div>');

		var $portfolioGrid = $('.vp-portfolio__items-style-leedo_work_style_3'),
			$jsCaption = $('.js-caption'),
			$jsCaptionTitle = $jsCaption.find('h4');

		$portfolioGrid.on('mousemove', function(e) {
			$jsCaption.css({
				top: e.clientY,
				left: e.clientX
			});
		});

		$portfolioGrid.find('.vp-portfolio__item').on({
			mouseenter: function () {
				$jsCaption.removeClass('js-caption--active');
				$jsCaptionTitle.text($(this).find('.vp-portfolio__item-meta-title').text());
				$jsCaption.addClass('js-caption--active');
			},
			mouseleave: function() {
				$jsCaption.removeClass('js-caption--active');
			}
		});

	}

	vlthemes_portfolio_hover_effect();

	VLTJS.document.on('endLoadingNewItems.vpf', function(event) {
		vlthemes_portfolio_hover_effect();
	});

})(jQuery);
/***********************************************
 * PRELOADER
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof NProgress !== 'undefined') {
		NProgress.start();
	}

	VLTJS.window.on('load', function() {
		VLTJS.window.trigger('vlt.preloader_done');
		VLTJS.html.addClass('vlt-is-page-loaded');
		if (typeof NProgress != 'undefined') {
			NProgress.done();
		}
	});

})(jQuery);
/***********************************************
 * PRICING TOGGLE
 ***********************************************/
(function($) {

	'use strict';

	var checkbox = $('.vlt-pricing-toggle input[type="checkbox"]'),
		toggler = $('.vlt-pricing-toggle .toggler');

	checkbox.on('click', function() {
		toggler.toggleClass('toggler--is-active');
		$('.vlt-pricing-table--monthly-annually').toggleClass('vlt-pricing-table--is-annually');
	});

	toggler.on('click', function() {
		checkbox.trigger('click');
	});

})(jQuery);
/***********************************************
 * PROGRESS BAR CIRCLE
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.circleProgress == 'undefined') {
		return;
	}

	$('.vlt-progress-bar-circle').each(function() {

		var $duration = 3000,
			$delay = 150;

		var $this = $(this),
			finalValue = $this.data('value') || 0,
			size = $this.data('size') || 160,
			thickness = $this.data('thickness') || 4,
			fill = $this.data('bar-color') || '#ee3364',
			emptyFill = $this.data('track-color') || 'rgba(0,0,0,.1)',
			barContainer = $this.find('.vlt-progress-bar-circle__bar'),
			finalValueContainer = $this.find('.vlt-progress-bar-circle__bar > h5'),
			obj = {
				count: 0
			};

		// predraw
		barContainer.circleProgress({
			startAngle: -Math.PI / 2,
			value: 0,
			size: size,
			thickness: thickness,
			fill: fill,
			emptyFill: emptyFill,
			animation: {
				duration: $duration,
				easing: 'circleProgressEasing',
				delay: $delay
			}
		});

		$(this).one('inview', function() {

			barContainer.circleProgress({
				value: finalValue / 100,
			});

			anime({
				targets: obj,
				count: finalValue,
				round: 1,
				easing: 'linear',
				duration: $duration,
				delay: $delay,
				update: function() {
					finalValueContainer.text(obj.count);
				}
			});

		});
	});

})(jQuery);
/***********************************************
 * PROGRESS BAR
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof anime == 'undefined') {
		return;
	}

	$('.vlt-progress-bar').each(function() {

		var $duration = 3000,
			$delay = 150;

		$(this).one('inview', function() {
			var $this = $(this),
				finalValue = $this.data('value') || 0,
				finalValueContainer = $this.find('.percent'),
				barContainer = $this.find('.vlt-progress-bar__bar > span'),
				obj = {
					count: 0
				};

			anime({
				targets: obj,
				count: finalValue,
				round: 1,
				easing: 'linear',
				duration: $duration / 2,
				delay: $delay,
				update: function() {
					finalValueContainer.text(obj.count);
				}
			});

			anime({
				targets: barContainer[0],
				width: finalValue + '%',
				duration: $duration,
				delay: $delay
			});
		});
	});

})(jQuery);
/***********************************************
 * PROJECTS PREVIEW
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-preview');

	el.each(function() {

		var $this = $(this);
		var images = $this.find('.vlt-projects-preview__images');
		var projectsLinks = $this.find('.vlt-projects-preview__links');
		var container = images.find('.swiper-container');

		// wrap each slide
		images.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		// add active class
		projectsLinks.find('li').eq(0).addClass('is-active');

		var swiper = new Swiper(container.get(0), {
			init: false,
			loop: false,
			slidesPerView: 1,
			effect: 'fade',
			allowTouchMove: false,
			lazy: true,
			speed: 1000,
			on: {
				init: function() {
					projectsLinks.on('click', 'li', function(e) {
						e.preventDefault();
						var currentLink = $(this);
						projectsLinks.find('li').removeClass('is-active');
						currentLink.addClass('is-active');
						swiper.slideTo(currentLink.index());
					});
				},
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);
/***********************************************
 * PROJECTS SHOWCASE STYLE 1
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-1');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			lazy: true,
			loop: false,
			mousewheel: {
				releaseOnEdges: true,
			},
			slidesPerView: 1,
			speed: 1000,
			touchReleaseOnEdges: true,
			breakpoints: {
				// when window width is >= 576px
				576: {
					slidesPerView: 1
				},
				// when window width is >= 768px
				768: {
					slidesPerView: 2
				},
				// when window width is >= 992px
				992: {
					slidesPerView: 3
				}
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	    VLTJS.document.on('keydown', function(e){
	        if(e.keyCode == 37) {
		        // left
		        swiper.slidePrev();
	        }
	        else if(e.keyCode == 39) {
		        // right
		        swiper.slideNext();
	        }
	    });

		// fix transform for each item
		if (typeof $.fn.matchHeight !== 'undefined') {

			function vlthemes_content_position() {
				setTimeout(function() {
					$('.vlt-projects-showcase--style-1 .vlt-projects-showcase__content > div').matchHeight();
				}, 100);
			}

			vlthemes_content_position();
			VLTJS.debounceResize(vlthemes_content_position);
		}

	});

})(jQuery);

/***********************************************
 * PROJECTS SHOWCASE STYLE 2
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-2');

	el.each(function() {
		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			direction: 'vertical',
			lazy: true,
			loop: false,
			parallax: true,
			mousewheel: {
				releaseOnEdges: true,
			},
			slidesPerView: 1,
			speed: 1000,
			touchReleaseOnEdges: true,
			pagination: {
				el: $this.find('.vlt-swiper-pagination').get(0),
				clickable: true,
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);

/***********************************************
 * PROJECTS SHOWCASE STYLE 3
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-3');

	el.each(function() {
		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			direction: 'vertical',
			lazy: true,
			loop: false,
			parallax: true,
			mousewheel: {
				releaseOnEdges: true,
			},
			slidesPerView: 1,
			speed: 1000,
			touchReleaseOnEdges: true,
			pagination: {
				el: $this.find('.vlt-swiper-pagination > .container').get(0),
				clickable: false,
				renderBullet: function(index, className) {
					return '<span class="' + className + '">0' + (index + 1) + " - " + VLTJS.addLedingZero(container
						.find('.swiper-slide').length) + "</span>"
				}
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);

/***********************************************
 * PROJECTS SHOWCASE STYLE 4 / STYLE 6
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-4')
		.add('.vlt-projects-showcase--style-6');

	el.each(function() {

		var $this = $(this);
		var images = $this.find('.vlt-projects-showcase__images');
		var projectsLinks = $this.find('.vlt-projects-showcase__links');
		var container = images.find('.swiper-container');

		// wrap each slide
		images.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		// add active class
		projectsLinks.find('li').eq(0).addClass('is-active');

		var swiper = new Swiper(container.get(0), {
			init: false,
			loop: false,
			effect: 'fade',
			lazy: true,
			slidesPerView: 1,
			allowTouchMove: false,
			speed: 1000,
			on: {
				init: function() {
					projectsLinks.on('mouseenter', 'li', function(e) {
						e.preventDefault();
						var currentLink = $(this);
						projectsLinks.find('li').removeClass('is-active');
						currentLink.addClass('is-active');
						swiper.slideTo(currentLink.index());
					});
				},
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);

/***********************************************
 * PROJECTS SHOWCASE STYLE 5
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-5');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			direction: 'vertical',
			lazy: true,
			loop: false,
			parallax: true,
			mousewheel: {
				releaseOnEdges: true,
			},
			slidesPerView: 1,
			speed: 1000,
			touchReleaseOnEdges: true,
			pagination: {
				el: $this.find('.vlt-swiper-pagination > .container').get(0),
				clickable: false,
				renderBullet: function(index, className) {
					return '<span class="' + className + '">0' + (index + 1) + " - " + VLTJS.addLedingZero(container.find('.swiper-slide').length) + "</span>"
				}
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);

/***********************************************
 * PROJECTS SHOWCASE STYLE 7
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-projects-showcase--style-7');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			preloadImages: false,
			lazy: true,
			loop: false,
			parallax: true,
			freeMode: true,
			slidesPerView: 1,
			speed: 1000,
			mousewheel: true,
			pagination: {
				el: $this.find('.vlt-swiper-pagination > .container').get(0),
				clickable: true,
				renderBullet: function(index, className) {
					return '<span class="' + className + '">0' + (index + 1) + " - " + VLTJS.addLedingZero(container.find('.swiper-slide').length) + "</span>"
				}
			},
			on: {
				init: function() {
					$this.css({
						'background-color': container.find('[data-background-color]').eq(0).data('background-color')
					});
				},
				slideChange: function() {
					$this.css({
						'background-color': container.find('[data-background-color]').eq(swiper.activeIndex).data('background-color')
					});
				}
			}
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);
/***********************************************
 * SCROLL TO SECTION
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.scrollTo == 'undefined') {
		return;
	}

	$('a[href^="#"]').not('[href="#"]').on('click', function(e) {
		e.preventDefault();
		if ($(this).parents('.tabs').length) {
			return;
		}
		VLTJS.html.scrollTo($(this).attr('href'), 500);
	});

})(jQuery);

/***********************************************
 * BACK TO TOP
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.scrollTo == 'undefined') {
		return;
	}

	function _show_btn() {
		VLTJS.html.addClass('vlt-is--show-back-to-top');
		$('.vlt-btn--back-to-top').removeClass('hidden').addClass('visible');
	}

	function _hide_btn() {
		VLTJS.html.removeClass('vlt-is--show-back-to-top');
		$('.vlt-btn--back-to-top').removeClass('visible').addClass('hidden');
	}

	_hide_btn();

	VLTJS.throttleScroll(function(type, scroll) {
		var offset = VLTJS.window.height() + 100;

		if ( scroll > offset) {
			if (type === 'down') {
				_hide_btn();
			} else if (type === 'up') {
				_show_btn();
			}
		} else {
			_hide_btn();
		}

	});

	VLTJS.document.on('click', '.vlt-btn--back-to-top', function(e) {
		e.preventDefault();
		VLTJS.html.scrollTo(0, 500);
	});

})(jQuery);
/***********************************************
 * SITE PROTECTION
 ***********************************************/
(function($) {

	'use strict';

	if (!VLTJS.html.hasClass('vlt-is--site-protection')) {
		return;
	}

	var isClicked = false;

	VLTJS.document.bind('contextmenu', function(e) {
		e.preventDefault();

		if (!isClicked) {
			$('.vlt-site-protection').addClass('vlt-site-protection--visible');
			VLTJS.body.addClass('is-right-clicked');
			isClicked = true;
		}

		VLTJS.document.on('mousedown', function() {
			$('.vlt-site-protection').removeClass('vlt-site-protection--visible');
			VLTJS.body.removeClass('is-right-clicked');
			isClicked = false;
		});

		isClicked = false;

	});

})(jQuery);
/***********************************************
 * STRETCH ELEMENT INSIDE COLUMN
 ***********************************************/
(function($) {

	'use strict';

	function vlthemes_stretch_element_inside_column() {

		var wndW = VLTJS.window.width();

		$('.wpb_column .vlt-stretch-element-inside-column').each(function() {
			const $this = $(this);
			const $row = $this.closest('.vc_row');
			const $col = $this.closest('.wpb_column');
			const rectElement = this.getBoundingClientRect();
			const rectRow = $row[0].getBoundingClientRect();
			const rectCol = $col[0].getBoundingClientRect();
			const leftElement = rectElement.left;
			const rightElement = wndW - rectElement.right;
			const leftRow = rectRow.left + (parseFloat($row.css('padding-left')) || 0);
			const rightRow = wndW - rectRow.right + (parseFloat($row.css('padding-right')) || 0);
			const leftCol = rectCol.left;
			const rightCol = wndW - rectCol.right;
			const css = {
				'margin-left': 0,
				'margin-right': 0,
			};

			if (Math.round(leftRow) === Math.round(leftCol)) {
				const ml = parseFloat($this.css('margin-left') || 0);
				css['margin-left'] = ml - leftElement;
			}

			if (Math.round(rightRow) === Math.round(rightCol)) {
				const mr = parseFloat($this.css('margin-right') || 0);
				css['margin-right'] = mr - rightElement;
			}

			$this.css(css);

		});

	}

	vlthemes_stretch_element_inside_column();
	VLTJS.debounceResize(vlthemes_stretch_element_inside_column);

})(jQuery);

/***********************************************
 * STRETCH ELEMENT
 ***********************************************/
(function($) {

	'use strict';

	var element = $('.vlt-stretched-element');

	if (!element.length) {
		return;
	}

	function vlthemes_stretch_element() {

		var wndW = VLTJS.window.width();

		element.each(function() {
			var $this = $(this);
			var rect = this.getBoundingClientRect();
			var left = rect.left;
			var right = wndW - rect.right;
			var ml = parseFloat($this.css('margin-left') || 0);
			var mr = parseFloat($this.css('margin-right') || 0);
			$this.css({
				'margin-left': ml - left,
				'margin-right': mr - right,
				'width': wndW
			});
		});

	}

	vlthemes_stretch_element();
	VLTJS.debounceResize(vlthemes_stretch_element);

})(jQuery);

/***********************************************
 * STRETCH TO CONTAINER
 ***********************************************/
(function($) {

	'use strict';

	var element = $('[data-vc-stretch-to-container="true"]');

	if (!element.length) {
		return;
	}

	function stretch_to_container() {

		var container = element.parents('.container'),
			containerW = container.outerWidth(),
			containerOffset = container.offset().left;

		element.each(function() {
			var $this = $(this);
			var rect = this.getBoundingClientRect();
			var left = rect.left;

			var ml = parseFloat($this.css('margin-left') || 0);

			$this.css({
				'margin-left': containerOffset - left + ml,
				'width': containerW
			});

		});

	}

	stretch_to_container();
	VLTJS.debounceResize(stretch_to_container);

})(jQuery);

/***********************************************
 * STRETCH TO CONTENT
 ***********************************************/
(function($) {

	'use strict';

	var element = $('[data-vc-stretch-to-content="true"]');

	if (!element.length) {
		return;
	}

	function stretch_to_content() {

		var container = element.parents('.vlt-main'),
			containerW = container.outerWidth(),
			containerOffset = container.offset().left;

		element.each(function() {
			var $this = $(this);
			var rect = this.getBoundingClientRect();
			var left = rect.left;

			var ml = parseFloat($this.css('margin-left') || 0);

			$this.css({
				'margin-left': containerOffset - left + ml,
				'width': containerW
			});

		});

	}

	stretch_to_content();
	VLTJS.debounceResize(stretch_to_content);

})(jQuery);
/***********************************************
 * SUBSCRIBE FORM
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.ajaxChimp == 'undefined') {
		return;
	}

	// check if object defined
	if (typeof VLT_SUBSCRIBE_CDATA == 'undefined') {
		return;
	}

	$.ajaxChimp.translations.leedo = {
		'submit': VLT_SUBSCRIBE_CDATA.subscribe_submit,
		0: VLT_SUBSCRIBE_CDATA.subscribe_string_0,
		1: VLT_SUBSCRIBE_CDATA.subscribe_string_1,
		2: VLT_SUBSCRIBE_CDATA.subscribe_string_2,
		3: VLT_SUBSCRIBE_CDATA.subscribe_string_3,
		4: VLT_SUBSCRIBE_CDATA.subscribe_string_4,
		5: VLT_SUBSCRIBE_CDATA.subscribe_string_5
	};

	$('.vlt-subscribe-form').each(function() {
		var $form = $(this);

		$form.on('submit', function() {
			$form.addClass('mc-loading');
		});

		$form.ajaxChimp({
			language: 'leedo',
			label: $form.find('.vlt-alert'),
			callback: function(resp) {
				$form.removeClass('mc-loading');
				$form.toggleClass('mc-valid', (resp.result === 'success'));
				$form.toggleClass('mc-invalid', (resp.result === 'error'));
				if (resp.result === 'success') {
					$form.find('input[type="email"]').val('');
					if (VLT_SUBSCRIBE_CDATA.subscribe_thank_you_page) {
						window.location.href = VLT_SUBSCRIBE_CDATA.subscribe_thank_you_page;
					}
				}
				setTimeout(function() {
					$form.removeClass('mc-valid mc-invalid');
					$form.find('input[type="email"]').focus();
				}, 4500);
			}
		});
	});

})(jQuery);
/***********************************************
 * TESTIMONIAL SLIDER STYLE 1
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-testimonial-slider--style-1');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			loop: true,
			slidesPerView: 1,
			spaceBetween: 30,
			grabCursor: true,
			speed: 1000,
			parallax: true,
			autoHeight: true,
			autoplay: {
				delay: $this.data('autoplay-speed') || 5000,
				disableOnInteraction: false
			},
			navigation: {
				nextEl: $this.find('.vlt-swiper-button-next'),
				prevEl: $this.find('.vlt-swiper-button-prev'),
			},
			pagination: {
				el: $this.find('.vlt-swiper-pagination').get(0),
				clickable: true,
			},
		});

		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);

/***********************************************
 * TESTIMONIAL SLIDER STYLE 2
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof Swiper == 'undefined') {
		return;
	}

	var el = $('.vlt-testimonial-slider--style-2');

	el.each(function() {

		var $this = $(this);
		var container = $this.find('.swiper-container');

		// wrap each slide
		$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

		var swiper = new Swiper(container.get(0), {
			init: false,
			loop: true,
			initialSlide: 1,
			centeredSlides: true,
			slidesPerView: 1,
			spaceBetween: 30,
			grabCursor: true,
			speed: 1000,
			autoplay: {
				delay: $this.data('autoplay-speed') || 5000,
				disableOnInteraction: false
			},
			breakpoints: {
				// when window width is >= 576px
				576: {
					slidesPerView: 1
				},
				// when window width is >= 768px
				768: {
					slidesPerView: 2
				},
				// when window width is >= 992px
				992: {
					slidesPerView: 3
				}
			},
			on: {
				init: function () {
					container.find('.vlt-testimonial-item__content').matchHeight();
				},
				slideChange: function () {
					container.find('.vlt-testimonial-item__content').matchHeight();
				}
			},
		});


		VLTJS.window.on('vlt.preloader_done', function() {
			swiper.init();
		});

	});

})(jQuery);
/***********************************************
 * HEADER / ANIMATED
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof anime == 'undefined') {
		return;
	}

	var menuItem = $('.vlt-header--animated .vlt-default-navigation ul.sf-menu > li'),
		menuToggle = $('#vlt-menu-animated-toggle'),
		menuIsOpen = false;

	menuToggle.on('click', function(e) {
		e.preventDefault();
		if (!menuIsOpen) {
			_open_menu();
		} else {
			_close_menu();
		}
	});

	menuItem.css('visibility', 'hidden');

	function _open_menu() {
		menuToggle.addClass('vlt-menu-burger--opened');
		anime({
			targets: menuItem.find('> a > span').get(),
			opacity: [0, 1],
			easing: 'easeInOutSine',
			duration: 300,
			translateX: [20, 0],
			delay: anime.stagger(100, {
				from: 'last'
			}),
			begin: function() {
				menuItem.css('visibility', 'visible');
			}
		});
		menuIsOpen = true;
	}

	function _close_menu() {
		menuToggle.removeClass('vlt-menu-burger--opened');
		anime({
			targets: menuItem.find('> a > span').get(),
			opacity: [1, 0],
			easing: 'easeInOutSine',
			duration: 300,
			translateX: [0, 20],
			delay: anime.stagger(100, {
				from: 'last'
			}),
			complete: function() {
				menuItem.css('visibility', 'hidden');
			}
		});
		menuIsOpen = false;
	}

})(jQuery);
/***********************************************
 * HEADER ASIDE
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superclick == 'undefined') {
		return;
	}

	var menu = $('.vlt-header--aside');

	menu.find('ul.sf-menu:not(.vlt-onepage-nav)').superclick({
		delay: 500,
		cssArrows: false,
		animation: {
			opacity: 'show',
			height: 'show'
		},
		animationOut: {
			opacity: 'hide',
			height: 'hide'
		},
	});

})(jQuery);
/***********************************************
 * HEADER DEFAULT / ANIMATED
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superfish == 'undefined') {
		return;
	}

	var menu = $('.vlt-header--default ul.sf-menu:not(.vlt-onepage-nav)')
		.add('.vlt-header--animated ul.sf-menu:not(.vlt-onepage-nav)');

	// remove sub-menu class
	menu.find('li.menu-item-has-megamenu ul ul.sub-menu').removeClass();

	menu.superfish({
		popUpSelector: 'ul.sub-menu',
		delay: 0,
		speed: 300,
		speedOut: 300,
		cssArrows: false,
		animation: {
			opacity: 'show',
			marginTop: '0',
			visibility: 'visible'
		},
		animationOut: {
			opacity: 'hide',
			marginTop: '10px',
			visibility: 'hidden'
		}
	});

})(jQuery);
/***********************************************
 * HEADER FULLSCREEN
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superclick == 'undefined') {
		return;
	}

	var menu = $('.vlt-fullscreen-navigation ul.sf-menu:not(.vlt-onepage-nav)'),
		menuHolder = $('.vlt-fullscreen-navigation-holder'),
		menuItem = $('.vlt-fullscreen-navigation ul.sf-menu > li'),
		menuOpen = $('#vlt-fullscreen-menu-open'),
		menuClose = $('#vlt-fullscreen-menu-close'),
		onepageMenu = $('.vlt-is--header-fullscreen.vlt-is--onepage-navigation'),
		menuIsOpen = false;

	menu.superclick({
		delay: 500,
		cssArrows: false,
		animation: {
			opacity: 'show',
			height: 'show'
		},
		animationOut: {
			opacity: 'hide',
			height: 'hide'
		},
	});

	menuItem.css('visibility', 'hidden');

	function _open_menu() {
		// start animation
		if (typeof anime != 'undefined') {

			anime.timeline({
				easing: 'easeInOutQuad',
				duration: 600
			})
			.add({
				targets: menuHolder.get(),
				duration: 350,
				opacity: [0, 1],
				begin: function() {

					// show holder
					menuHolder.css('visibility', 'visible');

					// play sound
					if (typeof VLT_MENU_TOGGLE_SOUND_CDATA != 'undefined' && typeof Howl != 'undefined') {
						new Howl({
							src: [VLT_MENU_TOGGLE_SOUND_CDATA.open],
							autoplay: true,
							loop: false,
							volume: 0.4
						});
					}
				}
			})
			.add({
				targets: menuItem.get(),
				opacity: [0, 1],
				duration: 300,
				translateY: [50, 0],
				delay: anime.stagger(100, {
					from: 'first'
				}),
				begin: function() {
					// show menu item
					menuItem.css('visibility', 'visible');
				}
			});
		}

		menuIsOpen = true;
	}

	function _close_menu() {

		// start animation
		if (typeof anime != 'undefined') {

			anime.timeline({
				easing: 'easeInOutQuad',
				duration: 600,
			}).add({
				targets: menuItem.get(),
				opacity: 0,
				duration: 300,
				translateY: 50,
				delay: anime.stagger(100, {
					from: 'last'
				}),
				begin: function() {
					// play sound
					if (typeof VLT_MENU_TOGGLE_SOUND_CDATA != 'undefined' && typeof Howl != 'undefined') {
						new Howl({
							src: [VLT_MENU_TOGGLE_SOUND_CDATA.close],
							autoplay: true,
							loop: false,
							volume: 0.4
						});
					}
				},
				complete: function() {

					// hide menu item
					menuItem.css('visibility', 'hidden');

				}
			})
			.add({
				targets: menuHolder.get(),
				opacity: 0,
				complete: function() {
					// hide holder
					menuHolder.css('visibility', 'hidden');
				}
			}, '-=300');

		}

	menuIsOpen = false;
	}

	menuOpen.on('click', function(e) {
		e.preventDefault();
		if (!menuIsOpen) {
			_open_menu();
		} else {
			_close_menu();
		}
	});

	menuClose.on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	// click on ESC
	VLTJS.document.keyup(function(e) {
		if (e.keyCode === 27) {
			e.preventDefault();
			_close_menu();
		}
	});

	menu.find('a[href^="#"]').not('[href="#"]').on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	onepageMenu.on('click', 'ul.sf-menu.vlt-onepage-nav a', function(e) {
		e.preventDefault();
		_close_menu();
	});

})(jQuery);
/***********************************************
 * HEADER MOBILE
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superclick == 'undefined') {
		return;
	}

	var navbarMain = $('.vlt-navbar--mobile');

	// sticky navbar
	var navbarHeight = navbarMain.length ? navbarMain.outerHeight() : 0;
	var navbarMainOffset = navbarMain.hasClass('vlt-navbar--offset') ? VLTJS.window.outerHeight() : navbarHeight;

	// fake navbar
	var navbarFake = $('<div class="vlt-fake-navbar">').hide();

	function _fixed_navbar() {
		navbarMain.addClass('vlt-navbar--fixed');
		navbarFake.show();
	}

	function _unfixed_navbar() {
		navbarMain.removeClass('vlt-navbar--fixed');
		navbarFake.hide();
	}

	function _on_scroll_navbar() {
		if (VLTJS.window.scrollTop() >= navbarMainOffset) {
			_fixed_navbar();
		} else {
			_unfixed_navbar();
		}
	}

	if (navbarMain.hasClass('vlt-navbar--sticky')) {

		VLTJS.window.on('scroll resize', _on_scroll_navbar);

		_on_scroll_navbar();

		// append fake navbar
		navbarMain.after(navbarFake);

		// fake navbar height after resize
		navbarFake.height(navbarMain.innerHeight());

		VLTJS.debounceResize(function() {
			navbarFake.height(navbarMain.innerHeight());
		});

	}

	// hide navbar on scroll

	var navbarHideOnScroll = navbarMain.filter('.vlt-navbar--hide-on-scroll');

	VLTJS.throttleScroll(function(type, scroll) {
		var start = 450;

		function _show_navbar() {
			navbarHideOnScroll.removeClass('vlt-on-scroll-hide').addClass('vlt-on-scroll-show');
		}

		function _hide_navbar() {
			navbarHideOnScroll.removeClass('vlt-on-scroll-show').addClass('vlt-on-scroll-hide');
		}

		// hide or show
		if (type === 'down' && scroll > start) {
			_hide_navbar();
		} else if (type === 'up' || type === 'end' || type === 'start') {
			_show_navbar();
		}

	});

	// navigation
	var menu = $('.vlt-mobile-navigation'),
		menuToggle = $('#vlt-mobile-menu-toggle'),
		onepageMenu = $('.vlt-is--onepage-navigation'),
		menuIsOpen = false;

	menu.find('ul.sf-menu:not(.vlt-onepage-nav)').superclick({
		delay: 500,
		cssArrows: false,
		animation: {
			opacity: 'show',
			height: 'show'
		},
		animationOut: {
			opacity: 'hide',
			height: 'hide'
		},
	});

	function _open_menu() {
		menu.slideDown();
		menuToggle.addClass('vlt-menu-burger--opened');
		menuIsOpen = true;
	}

	function _close_menu() {
		menu.slideUp();
		menuToggle.removeClass('vlt-menu-burger--opened');
		menuIsOpen = false;
	}

	menuToggle.on('click', function(e) {
		e.preventDefault();
		if (!menuIsOpen) {
			_open_menu();
		} else {
			_close_menu();
		}
	});

	// click on ESC
	VLTJS.document.keyup(function(e) {
		if (e.keyCode === 27) {
			e.preventDefault();
			_close_menu();
		}
	});

	menu.find('a[href^="#"]').not('[href="#"]').on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	onepageMenu.on('click', 'ul.sf-menu.vlt-onepage-nav a', function(e) {
		e.preventDefault();
		_close_menu();
	});

})(jQuery);
/***********************************************
 * HEADER SLIDE
 ***********************************************/
(function($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superclick == 'undefined') {
		return;
	}

	var menu = $('.vlt-slide-navigation ul.sf-menu:not(.vlt-onepage-nav)'),
		menuItem = $('.vlt-slide-navigation ul.sf-menu > li'),
		menuHolder = $('.vlt-slide-navigation-holder'),
		menuOpen = $('#vlt-slide-menu-open'),
		menuClose = $('#vlt-slide-menu-close'),
		navbarOverlay = $('.vlt-navbar-overlay'),
		onepageMenu = $('.vlt-is--header-slide.vlt-is--onepage-navigation'),
		menuIsOpen = false;

	menu.superclick({
		delay: 500,
		cssArrows: false,
		animation: {
			opacity: 'show',
			height: 'show'
		},
		animationOut: {
			opacity: 'hide',
			height: 'hide'
		},
	});

	menuItem.css('visibility', 'hidden');

	function _open_menu() {

		// start animation
		if (typeof anime != 'undefined') {

			anime.timeline({
				easing: 'easeInOutQuad',
				duration: 600
			})
			.add({
				targets: navbarOverlay.get(),
				duration: 150,
				opacity: [0, 1],
				begin: function() {
					navbarOverlay.css('visibility', 'visible');
				}
			})
			.add({
				targets: menuHolder.get(),
				translateX: ['100%', 0],
				begin: function() {
					// show overlay
					navbarOverlay.fadeIn(150);

					// show holder
					menuHolder.css('visibility', 'visible');

					// play sound
					if (typeof VLT_MENU_TOGGLE_SOUND_CDATA != 'undefined' && typeof Howl != 'undefined') {
						new Howl({
							src: [VLT_MENU_TOGGLE_SOUND_CDATA.open],
							autoplay: true,
							loop: false,
							volume: 0.4
						});
					}
				}
			}, '-=150')
			.add({
				targets: menuItem.get(),
				opacity: [0, 1],
				duration: 300,
				translateX: [50, 0],
				delay: anime.stagger(100, {
					from: 'first'
				}),
				begin: function() {
					// show menu item
					menuItem.css('visibility', 'visible');
				}
			});
		}
		menuIsOpen = true;
	}

	function _close_menu() {

		// start animation
		if (typeof anime != 'undefined') {

			anime.timeline({
				easing: 'easeInOutQuad',
				duration: 600,
			}).add({
				targets: menuItem.get(),
				opacity: 0,
				duration: 300,
				translateX: 50,
				delay: anime.stagger(100, {
					from: 'last'
				}),
				begin: function() {
					// play sound
					if (typeof VLT_MENU_TOGGLE_SOUND_CDATA != 'undefined' && typeof Howl != 'undefined') {
						new Howl({
							src: [VLT_MENU_TOGGLE_SOUND_CDATA.close],
							autoplay: true,
							loop: false,
							volume: 0.4
						});
					}
				},
				complete: function() {

					// hide menu item
					menuItem.css('visibility', 'hidden');

				}
			})
			.add({
				targets: navbarOverlay.get(),
				duration: 150,
				opacity: 0
			})
			.add({
				targets: menuHolder.get(),
				translateX: '100%',
				complete: function() {

					// hide overlay
					navbarOverlay.css('visibility', 'hidden');

					// hide holder
					menuHolder.css('visibility', 'hidden');

				}
			}, '-=150');

		}

		menuIsOpen = false;
	}

	menuOpen.on('click', function(e) {
		e.preventDefault();
		if (!menuIsOpen) {
			_open_menu();
		} else {
			_close_menu();
		}
	});

	menuClose.on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	navbarOverlay.on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	// click on ESC
	VLTJS.document.keyup(function(e) {
		if (e.keyCode === 27) {
			e.preventDefault();
			_close_menu();
		}
	});

	menu.find('a[href^="#"]').not('[href="#"]').on('click', function(e) {
		e.preventDefault();
		_close_menu();
	});

	onepageMenu.on('click', 'ul.sf-menu.vlt-onepage-nav a', function(e) {
		e.preventDefault();
		_close_menu();
	});

})(jQuery);
/***********************************************
 * NAVBAR
 ***********************************************/
(function($) {

	'use strict';

	var navbarMain = $('.vlt-navbar--main');

	// sticky navbar
	var navbarHeight = navbarMain.length ? navbarMain.outerHeight() : 0;
	var navbarMainOffset = navbarMain.hasClass('vlt-navbar--offset') ? VLTJS.window.outerHeight() : navbarHeight;

	// fake navbar
	var navbarFake = $('<div class="vlt-fake-navbar">').hide();

	function _fixed_navbar() {
		navbarMain.addClass('vlt-navbar--fixed');
		navbarFake.show();
	}

	function _unfixed_navbar() {
		navbarMain.removeClass('vlt-navbar--fixed');
		navbarFake.hide();
	}

	function _on_scroll_navbar() {
		if (VLTJS.window.scrollTop() >= navbarMainOffset) {
			_fixed_navbar();
		} else {
			_unfixed_navbar();
		}
	}

	if (navbarMain.hasClass('vlt-navbar--sticky')) {

		VLTJS.window.on('scroll resize', _on_scroll_navbar);

		_on_scroll_navbar();

		// append fake navbar
		navbarMain.after(navbarFake);

		// fake navbar height after resize
		navbarFake.height(navbarMain.innerHeight());

		VLTJS.debounceResize(function() {
			navbarFake.height(navbarMain.innerHeight());
		});

	}

	// hide navbar on scroll

	var navbarHideOnScroll = navbarMain.filter('.vlt-navbar--hide-on-scroll');

	VLTJS.throttleScroll(function(type, scroll) {
		var start = 450;

		function _show_navbar() {
			navbarHideOnScroll.removeClass('vlt-on-scroll-hide').addClass('vlt-on-scroll-show');
		}

		function _hide_navbar() {
			navbarHideOnScroll.removeClass('vlt-on-scroll-show').addClass('vlt-on-scroll-hide');
		}

		// hide or show
		if (type === 'down' && scroll > start) {
			_hide_navbar();
		} else if (type === 'up' || type === 'end' || type === 'start') {
			_show_navbar();
		}

		// add solid color
		if (navbarMain.hasClass('vlt-navbar--transparent') && navbarMain.hasClass('vlt-navbar--sticky')) {
			scroll > navbarHeight ? navbarMain.addClass('vlt-navbar--solid') : navbarMain.removeClass('vlt-navbar--solid');
		}
	});

})(jQuery);

/***********************************************
 * ONEPAGE NAVIGATION
 ***********************************************/
(function($) {

	'use strict';

	if (!VLTJS.html.hasClass('vlt-is--onepage-navigation')) {
		return;
	}

	function vlthemes_onepage_navigation() {

		var mainNavLinks = $('.vlt-onepage-nav > li > a[href^="#"]');
		var linkHref = null;
		var section = null;

		VLTJS.window.on('scroll', function() {
			var fromTop = VLTJS.window.scrollTop();
			mainNavLinks.each(function() {

				var $this = $(this);

				linkHref = $this.attr('href').split('#')[1];
				section = $('#' + linkHref);

				if (section.length) {
					if(section.offset().top <= fromTop && section.offset().top + section.outerHeight() > fromTop) {
						$this.parent('li').addClass('current-menu-item');
					} else {
						$this.parent('li').removeClass('current-menu-item');
					}
				}

			});
		});

	}

	vlthemes_onepage_navigation();
	VLTJS.debounceResize(vlthemes_onepage_navigation);

})(jQuery);
/***********************************************
 * SEARCH POPUP
 ***********************************************/
(function($) {

	'use strict';

	var search = $('.vlt-search-wrapper'),
		searchToggle = $('.vlt-menu-search-icon'),
		searchIsOpen = false;

	function _open_search() {
		// start animation
		if (typeof anime != 'undefined') {
			anime({
				targets: search.get(),
				easing: 'easeInOutQuad',
				duration: 300,
				opacity: [0, 1],
				begin: function() {
					// show search
					search.css('visibility', 'visible');
				},
				complete: function() {
					search.find('input[type="text"]').focus();
				}
			})
		}
		searchIsOpen = true;
	}

	function _close_search() {
		// start animation
		if (typeof anime != 'undefined') {
			anime({
				targets: search.get(),
				easing: 'easeInOutQuad',
				duration: 250,
				opacity: 0,
				complete: function() {
					search.find('input[type="text"]').blur();
					// hide search
					search.css('visibility', 'hidden');
				}
			})
		}
		searchIsOpen = false;
	}

	searchToggle.on('click', function(e) {
		e.preventDefault();
		if (!searchIsOpen) {
			_open_search();
		} else {
			_close_search();
		}
	});

	VLTJS.throttleScroll(function(type, scroll) {
		var start = 300;
		if (scroll > start) {
			_close_search();
		}
	});

	// click on ESC
	VLTJS.document.keyup(function(e) {
		if (e.keyCode === 27) {
			e.preventDefault();
			_close_search();
		}
	});

	search.on('click', function(e) {
		_close_search();
	});

	search.on('click', 'input[type="text"]', function(e) {
		e.stopPropagation();
	});

})(jQuery);
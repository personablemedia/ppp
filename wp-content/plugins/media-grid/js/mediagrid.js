(function($) {
	var mg_lb_height = 30 + 60; // lightbox default height + padding
	var mg_window_h = jQuery(window).height();
	
	mg_sizes = new Array(
		'1_1',
		'1_2',
		
		'1_3',
		'2_3',
		
		'1_4',
		'3_4',
		
		'1_5',
		'2_5',
		'3_5',
		'4_5',
		
		'1_6',
		'5_6' 
	);
	
	// first init
	jQuery(document).ready(function() {
		mg_append_lightbox();
		mg_get_deeplink();
		
		jQuery('.mg_container').each(function() {
			var mg_cont_id = jQuery(this).attr('id');
			mg_size_boxes(mg_cont_id);
			
			// fallback for IE
			if( jQuery.browser.msie && jQuery.browser['version'] < 10 ) {
				mg_ie_fallback();	
			}

			mg_display_grid(mg_cont_id);
		});
	});
	
	
	// Grid handling for AJAX pages
	mg_ajax_init = function(grid_id) {
		var mg_cont_id = 'mg_grid_'+ grid_id;
		mg_size_boxes(mg_cont_id);
		
		// fallback for IE
		if(	jQuery.browser.msie && jQuery.browser['version'] < 10 ) {
			mg_ie_fallback();	
		}
		
		// when img loaded, display
		mg_display_grid(mg_cont_id);
		
		if(jQuery('#mg_full_overlay').size() == 0) {
			mg_append_lightbox();
		}
	}
	
	
	// append the lightbox code to the website
	mg_append_lightbox = function() {
		if(typeof(mg_lightbox_mode) != 'undefined') {
			if(jQuery('#mg_full_overlay').size() > 0) {
				jQuery('#mg_full_overlay').remove();
			}
			
			jQuery('body').append('\
			<div id="mg_full_overlay">\
				<div class="mg_item_load"></div>\
				<div id="mg_overlay_content" style="display: none;"></div>\
				<div id="mg_full_overlay_wrap" class="'+ mg_lightbox_mode +'"></div>\
			</div>');
			
			$mg_item_content = jQuery('#mg_overlay_content');	
		}
	}
	
	
	// fraction to size percentage
	mg_get_size = function(shape) {
		switch(shape) {
		  case '5_6': var perc = 0.83; break;
		  case '1_6': var perc = 0.166; break;
		  
		  case '4_5': var perc = 0.80; break;
		  case '3_5': var perc = 0.60; break;
		  case '2_5': var perc = 0.40; break;
		  case '1_5': var perc = 0.20; break;
		  
		  case '3_4': var perc = 0.75; break;
		  case '1_4': var perc = 0.25; break;
		  
		  case '2_3': var perc = 0.6666666; break;
		  case '1_3': var perc = 0.3333333; break;
		  
		  case '1_2': var perc = 0.50; break;
		  default : var perc = 1; break;
		}
		return perc; 	
	};
	
	
	// box width
	mg_reresize_w = function(box_id, mg_wrap_w) {
		var wsize = false;
		
		jQuery.each(mg_sizes, function(key, val) {
			if( jQuery(box_id).hasClass('col' + val) )	{ 
				var raw_wsize = (mg_wrap_w - 0.2) * mg_get_size(val);
				wsize = Math.round(raw_wsize - (mg_boxMargin * 2) - (mg_boxBorder * 2));
				
				if (wsize%2 != 0) {wsize = wsize - 1;}
				return false;
			}
		});
		
		return wsize;
	}
	
	
	// box height
	mg_reresize_h = function(box_id, mg_wrap_w) {
		var hsize = false;
		
		jQuery.each(mg_sizes, function(key, val) {
			if( jQuery(box_id).hasClass('row' + val) )	{
				var raw_hsize = (mg_wrap_w - 0.2) * mg_get_size(val);
				hsize = Math.floor(raw_hsize - (mg_boxMargin * 2) - (mg_boxBorder * 2));
				
				if (hsize%2 != 0) {hsize = hsize - 1;}
				return false;
			}
		});
		
		return hsize;	
	}

	
	// size boxes
	mg_size_boxes = function(cont_id, on_orientationchange) {
		jQuery('#'+cont_id+' .mg_box').each(function(i) {
			var $mg_target = jQuery(this);
			var mg_box_id = '#' + jQuery(this).attr('id');

			if( $mg_target.parents('.mg_container').attr('rel') == 'auto' ) {
				var mg_wrap_w = $mg_target.parent('.mg_container').width();
			} else {
				var mg_wrap_w = parseInt($mg_target.parents('.mg_container').attr('rel'));
			}

			// size boxes
			var mg_box_w = mg_reresize_w(mg_box_id, mg_wrap_w);
			var mg_box_h = mg_reresize_h(mg_box_id, mg_wrap_w);

			jQuery(this).css('width', mg_box_w);
			jQuery(this).css('height', mg_box_h);
			
			// calculate the title under
			if( jQuery(this).find('.mg_title_under').size() > 0 ) {
				var tit_under_h = jQuery(this).find('.mg_title_under').height() + 
									parseInt(jQuery(this).find('.mg_title_under').css('padding-bottom')) + 
									parseInt(jQuery(this).find('.mg_title_under').css('padding-top'));	
									
				jQuery(this).css('width', mg_box_w);
				jQuery(this).css('height', mg_box_h + tit_under_h);
			} 
			
			// overlays control
			if( mg_box_w < 90 || mg_box_h < 90 ) { jQuery(this).find('.cell_type').hide(); }
			else {jQuery(this).find('.cell_type').show();}
			
			if( mg_box_w < 60 || mg_box_h < 60 ) { jQuery(this).find('.cell_more').hide(); }
			else {jQuery(this).find('.cell_more').show();}
			
			// image wrappers
			jQuery(this).find('.img_wrap').css('width', (mg_box_w - (mg_imgPadding * 2)) + 'px');
			jQuery(this).find('.img_wrap').css('height', (mg_box_h - (mg_imgPadding * 2)) + 'px');
			
			jQuery(this).find('.img_wrap > div').css('width', (mg_box_w - (mg_imgPadding * 2)) + 'px');
			jQuery(this).find('.img_wrap > div').css('height', (mg_box_h - (mg_imgPadding * 2)) + 'px');
			jQuery(this).find('.img_wrap > div').css('top', mg_imgPadding + 'px').css('left', mg_imgPadding + 'px');
			
			////////////////////////////////////////////
			// hack for the spacer
			if($mg_target.hasClass('mg_spacer') && mg_boxBorder > 0) {
				$mg_target.css('height', $mg_target.height() + 2 + 'px');
				$mg_target.css('width', $mg_target.width() + 2 + 'px');
				$mg_target.css('border', 'none');
			}
			////////////////////////////////////////////
			
			
			// masonerize after the sizing
			if(i == (jQuery('#'+cont_id+' .mg_box').length - 1)) {
				if(typeof(on_orientationchange) == 'undefined') {
					mg_masonerize(cont_id);	
				} else {
					setTimeout(function() {
						jQuery('#' + cont_id).isotope( 'reLayout');
					}, 800);	
				}
			}
		});
		
		return true;	
	};
	
	
	// masonry init
	mg_masonerize = function(cont_id) {
		jQuery('#' + cont_id).isotope({
			masonry: {
				columnWidth: 1
			},
			containerClass: 'mg_isotope',	
			itemClass : 'mg_isotope-item',
			itemSelector: '.mg_box',
			animationOptions: {
				duration: 700
		   }
		});	
		
		// category deeplink
		var hash = location.hash;
		if (hash.indexOf('#mg_cd') !== -1) {
			var val = hash.substring(hash.indexOf('#mg_cd')+7, hash.length)

			// check the cat existence
			if( jQuery('.mg_filter a[rel=' + val + ']') ) {
				var gid = jQuery('.mg_filter a[rel=' + val + ']').parents('.mg_filter').attr('id').substr(4);
				var sel = '.mgc_' + jQuery('.mg_filter a[rel=' + val + ']').attr('rel');
				var cont_id = 'mg_grid_' + gid ;
				
				// filter
				jQuery('#' + cont_id).isotope({ filter: sel });
				
				// set the selected
				jQuery('#mgf_'+gid+' a').removeClass('mg_cats_selected');
				jQuery('.mg_filter a[rel=' + val + ']').addClass('mg_cats_selected');	
			}
		}
		
		return true;	
	};
	
	
	// grid display
	mg_display_grid = function(grid_id) {
		jQuery('#'+grid_id+' .mg_box img').lcweb_lazyload({
			allLoaded: function(url_arr, width_arr, height_arr) {
				var a = 0;
				jQuery('#'+grid_id+' .mg_box').each(function() {
					jQuery(this).delay(150*a).fadeTo(400, 1);
					jQuery(this).find('.thumb').css('opacity', 1);
					a = a+1;
				});
				jQuery('#'+grid_id).removeClass('lcwp_loading');
			}
		});	
	}


	// IE transitions fallback
	mg_ie_fallback = function() {
		jQuery('.mg_box .overlays').children().hide();
		
		jQuery('.mg_box .img_wrap').hover(
			function() {
				jQuery(this).find('.overlays').children().hide();
				jQuery(this).find('.overlays').children().fadeIn();
			}
		);
		
		// remove type overlay for IE < 9
		if(mg_is_old_IE()) {
			jQuery('.mg_box .cell_more').remove();
		}
	};

	/////////////////////////////


	// open item trigger
	jQuery('.mg_closed').unbind('click');
	jQuery(document.body).on('click', '.mg_closed', function(){
		var pid = jQuery(this).attr('rel').substr(4);
		$mg_sel_grid = jQuery(this).parents('.mg_container').attr('id');
		
		mg_open_item(pid);
	});
	
	
	// open item
	mg_open_item = function(pid) {
		jQuery('#mg_full_overlay_wrap, #mg_full_overlay').fadeIn();
		mg_get_item_content(pid);	
	}
	
	
	// get item content
	mg_get_item_content = function(pid) {
		mg_set_deeplink('lb', pid);
		
		var cur_url = location.href;	
		var data = {
			mg_type: 'mg_overlay_layout',
			pid: pid
		};

		jQuery('#mg_full_overlay .mg_item_load').fadeIn();
		jQuery.post(cur_url, data, function(response) {
			jQuery('#mg_full_overlay .mg_item_load').fadeOut();
			jQuery('#mg_overlay_content').html(response);
			
			// featured content max-width
			if( jQuery('.mg_item_featured[rel]').size() > 0 ) {
				var fc_max_w = jQuery('.mg_item_featured').attr('rel');
				jQuery('#mg_overlay_content').css('max-width', fc_max_w);
			}
			else {jQuery('#mg_overlay_content').removeAttr('style');}
			
			// older IE iframe bg fix
			if(mg_is_old_IE() && jQuery('#mg_overlay_content .mg_item_featured iframe').size() > 0) {
				jQuery('#mg_overlay_content .mg_item_featured iframe').attr('allowTransparency', 'true');
			}
			
			// set position & show
			$mg_item_content.css("margin-top", ( jQuery(window).scrollTop() + 60));
			
			mg_lb_center = setInterval(function() {	
				mg_lb_cert_center();
			}, 150);
			
			$mg_item_content.fadeIn();
			
			// navigator
			mg_grid_items_nav(pid);
			
			// functions for slider and players
		 	mg_slider();
			mg_resize_video();
			mg_lazyload();
		});

		return true;
	};
	
	
	// create the navigator of visible items of a defined grid for opened items
	mg_grid_items_nav = function(selected) {
		mg_grid_items = new Array();
		mg_count = new Array();
		mgc = 0;
		
		jQuery('#'+ $mg_sel_grid +' .mg_transitions').not('#'+ $mg_sel_grid +' .isotope-hidden').each(function() {
			if( typeof( jQuery(this).attr('rel') ) != 'undefined' ) {
            	var iid = jQuery(this).attr('rel').substr(4);
				var title = (jQuery(this).find('.mg_overlay_tit').size() == 0) ? jQuery(this).find('.mg_title_under').text() : jQuery(this).find('.mg_overlay_tit').text();
				
				if(iid == selected) {mg_curr = mgc;}
				mg_grid_items.push({
					id: iid, 
					title: title
				});
				
				mg_count.push(iid);
				mgc = mgc + 1;
			}
        });	

		var items_num = mg_count.length;

		if(mg_curr == 0) {
			var prev = '';		
			
			if(items_num == 1) {var next = '';}
			else {
				var next = '<div class="mg_nav_next" id="mg_nav_'+ mg_grid_items[1]['id'] +'"><span rel="'+ mg_grid_items[1]['title'] +'"></span></div>';
			}
		}
		else if(mg_curr == (items_num - 1)) {
			var index = mg_curr - 1;
			var prev = '<div class="mg_nav_prev" id="mg_nav_'+ mg_grid_items[index]['id'] +'"><span rel="'+ mg_grid_items[index]['title'] +'"></span></div>';
			
			var next = '';
		}
		else {
			var index = mg_curr - 1;
			var prev = '<div class="mg_nav_prev" id="mg_nav_'+ mg_grid_items[index]['id'] +'"><span rel="'+ mg_grid_items[index]['title'] +'"></span></div>';
			
			var index = mg_curr + 1;
			var next = '<div class="mg_nav_next" id="mg_nav_'+ mg_grid_items[index]['id'] +'"><span rel="'+ mg_grid_items[index]['title'] +'"></span></div>';	
		}
		
		jQuery('#mg_nav').prepend(prev).append(next + '<p><span></span></p>');
	};
	
	
	// next / prev titles show
	jQuery('#mg_nav .mg_nav_next, #mg_nav .mg_nav_prev').unbind('mouseover');
	jQuery(document.body).on('mouseover', '#mg_nav .mg_nav_next, #mg_nav .mg_nav_prev', function(){
		var tit = jQuery(this).children().attr('rel');
		jQuery('#mg_nav p span').fadeIn().html(tit);
	});
	
	
	// switch item
	jQuery('.mg_nav_prev, .mg_nav_next').unbind('click');
	jQuery(document.body).on('click', '.mg_nav_prev, .mg_nav_next', function(){
		var pid = jQuery(this).attr('id').substr(7);
		
		jQuery('#mg_overlay_content > div').fadeOut();	
		$mg_item_content.hide().empty();	
		mg_get_item_content(pid);
	});
	
	
	// switch item - keyboards events
	jQuery('body').keydown(function(e){
		if( jQuery('#mg_overlay_content #mg_close').size() > 0 ) {
			var items_num = mg_count.length;

			// prev
			if (e.keyCode == 37) {
				if(items_num > 1 && mg_curr > 0) {
					var ks_id = mg_curr - 1;
					var pid = mg_grid_items[ks_id]['id'];
					
					jQuery('#mg_overlay_content > div').fadeOut();	
					$mg_item_content.hide().empty();	
					mg_get_item_content(pid);
				}
			}
			
			// next 
			if (e.keyCode == 39) {
				if(items_num > 1 && mg_curr < (items_num - 1)) {
					var ks_id = mg_curr + 1;
					var pid = mg_grid_items[ks_id]['id'];
					
					jQuery('#mg_overlay_content > div').fadeOut();	
					$mg_item_content.hide().empty();	
					mg_get_item_content(pid);
				}
			}
		}
	});	
	

	// close item
	mg_close_lightbox = function() {
		if(typeof(mg_lb_center) != 'undefined') {
			window.clearInterval(mg_lb_center);
		}
		
		// prevent jPlayer crash
		if( jQuery('.jp-jplayer').size() > 0 ) {
			jQuery('.jp-jplayer').jPlayer("stop");
			jQuery('.jp-jplayer').jPlayer("destroy");
		}
		
		jQuery('#mg_full_overlay_wrap, #mg_full_overlay').fadeOut(function() {
			jQuery('#mg_overlay_content').css('opacity', 0);
		});
		$mg_item_content.fadeOut().empty();	
		
		mg_clear_deeplink();
	}
	
	jQuery('#mg_close, #mg_full_overlay_wrap.mg_classic_lb').unbind('click');
	jQuery(document.body).on('click', '#mg_close, #mg_full_overlay_wrap.mg_classic_lb', function(){
		mg_close_lightbox();
	});
	jQuery(document).keydown(function(e){
		if( jQuery('#mg_overlay_content #mg_close').size() > 0 && e.keyCode == 27 ) { // escape key pressed
			mg_close_lightbox();
		}
	});
	

	// slider
	mg_slider = function() {
		if( jQuery('.mg_item_featured #mg_slider').size() > 0 ) {
			jQuery('#mg_slider').wmuSlider({
				animation: 'fade',
				slideshow: false
			});	
		}
	};
	
	
	// resize video 
	mg_resize_video = function() {
		if( jQuery('.mg_item_featured iframe').size() > 0 ) {	
			var if_w = jQuery('.mg_item_featured').width();
			var if_h = if_w * 0.56;
			jQuery('.mg_item_featured iframe').attr('width', if_w).attr('height', if_h);
		}	
	}
		
		
	// opened item resizing functions
	mg_item_resize = function() {
		mg_resize_video();
	};
		
		
	// on resize
	jQuery(window).resize(function() {
		mg_item_resize();
	});
	
	
	// lightbox images lazyload
	mg_lazyload = function() {
		if( jQuery(".mg_item_featured > img").size() > 0 ) {
			$ll_img = jQuery('.mg_item_featured > img');
			
			$ll_img.hide();			
			$ll_img.lcweb_lazyload({
				allLoaded: function(url_arr, width_arr, height_arr) {
					
					$ll_img.fadeIn();
					jQuery('.mg_item_featured').css('background', 'none');
					
					// for the mp3 player
					if( jQuery('.mg_item_featured .jp-audio').size() > 0 )  {
						mg_lb_jplayer();
						jQuery('.jp-audio').fadeIn();	
					}
				}
			});	
		}
	};

	
	// cat filter
	jQuery('.mg_filter a').unbind('click');
	jQuery(document.body).on('click', '.mg_filter a', function(e) {
		e.preventDefault();
		
		var gid = jQuery(this).parents('.mg_filter').attr('id').substr(4);
		var sel = jQuery(this).attr('rel');
		var cont_id = 'mg_grid_' + gid ;

		// set deeplink
		if ( sel !== '*' ) { mg_set_deeplink('cat', sel); }
		else { mg_clear_deeplink(); }

		if ( sel !== '*' ) {sel = '.mgc_' + sel;}
		jQuery('#' + cont_id).isotope({ filter: sel });
  
		jQuery('#mgf_'+gid+' a').removeClass('mg_cats_selected');
		jQuery(this).addClass('mg_cats_selected');
	});

	
	// adjust lightbox vertical position 
	mg_lb_cert_center = function() {
		if( $mg_item_content.is(':visible') && $mg_item_content.height() > 30 ) {
			var new_h = $mg_item_content.height() + parseInt($mg_item_content.css('padding-top')) + parseInt($mg_item_content.css('padding-bottom'));
			var diff = new_h - mg_lb_height;
			var win_height_diff = mg_window_h - jQuery(window).height();
			
			if( $mg_item_content.is(':visible') ) {	
				
				// if the lightbox is bigger than the window
				if( (new_h + 30) >= jQuery(window).height()) {
					if( $mg_item_content.css('top') != 0) {
						$mg_item_content.clearQueue().animate({'top' : 0}, 100, 'linear');	
						$mg_item_content.css('top', 0);
					}
				}
				
				else {
					var top_val = Math.floor( (jQuery(window).height() - new_h) / 2) - 60;	
					if( $mg_item_content.css('top') != top_val ) {
						$mg_item_content.clearQueue().animate({'top' : top_val}, 100, 'linear');
					}
				}
				
				mg_lb_height = new_h;
				mg_window_h == jQuery(window).height();
			}
		}
	}
	
	
	// adjust opened item position on scroll
	jQuery(window).scroll(function () {
		if( jQuery('#mg_full_overlay').is(':visible') && jQuery('#mg_overlay_content').css('opacity') == 1 && !jQuery('.mg_item_load').is(':visible') ) {	

			var lb_h = jQuery('#mg_overlay_content').height();
			var top_scroll = parseInt( jQuery(document).scrollTop() );
			var top_margin = jQuery('#mg_overlay_content').offset();
			
			var full_top_space = parseInt( (top_margin.top + lb_h) + 90 - top_scroll );
			var diff = jQuery(window).height() - full_top_space;

			// top position
			if(top_scroll < (top_margin.top - 60)) {
				setTimeout(function() {
					$mg_item_content.stop().animate({ 
						marginTop: ( jQuery(window).scrollTop() + 60) + "px",
						opacity: 1 
					}, 350, 'linear');
				}, 150);
			}
			
			// bottom position for big items
			if(diff > 1 && jQuery(window).height() < (lb_h + 90) ) {
				setTimeout(function() {
					$mg_item_content.stop().animate({ 
						marginTop: (top_margin.top + diff) + "px",
						opacity: 1  
					}, 350, 'linear');
				}, 150);
			}
			
			// bottom position for small items
			else if( diff > 1 && jQuery(window).height() > (lb_h + 90) ) {
				setTimeout(function() {
					$mg_item_content.stop().animate({ 
						marginTop: ( jQuery(window).scrollTop() + 60) + "px",
						opacity: 1  
					}, 350, 'linear');
				}, 150);
			}
			
			// security position for lightbox higher than the page
			if( lb_h > jQuery(window).height() && top_scroll == 0 && parseInt($mg_item_content.css('margin-top')) < 0) {
				 setTimeout(function() {
					$mg_item_content.stop().animate({ 
						marginTop: "60px",
						opacity: 1  
					}, 350, 'linear');
				}, 150);	
			}
		}
	});
	
	
	// on mobile orientation change
	jQuery(window).bind('orientationchange', function() {
		
		jQuery('.mg_container').each(function() {
			var mg_cont_id = jQuery(this).attr('id');
			mg_size_boxes(mg_cont_id, true);
		});
    });
	
	
	// touch devices hover effects
	if( mg_is_touch_device() ) {
		jQuery('.mg_box').bind('touchstart', function() { jQuery(this).addClass('mg_touch_on'); });
		jQuery('.mg_box').bind('touchend', function() { jQuery(this).removeClass('mg_touch_on'); });
	}
	
	
	/////////////////////////////////////
	// lightbox deeplinking
	
	function mg_get_deeplink() {
		if(jQuery('#mg_full_overlay').size() == 0) {
			mg_append_lightbox();
		}
		
		var hash = location.hash;
		if(hash == '' || hash == '#mg') {return false;}
		
		if (hash.indexOf('#mg_ld') !== -1) {
			var val = hash.substring(hash.indexOf('#mg_ld')+7, hash.length)
			
			// check the item existence
			if( jQuery('.mg_closed[rel=pid_' + val + ']') ) {
				$mg_sel_grid = jQuery('.mg_box[rel=pid_'+ val +']').parents('.mg_container').attr('id');	
				mg_open_item(val);
			}
		}
	}
	
	
	function mg_set_deeplink(subj, val) {
		if( jQuery('.mg_grid_wrap').hasClass('mg_deeplink') ) {
			mg_clear_deeplink();
	
			var mg_hash = (subj == 'cat') ? 'mg_cd' : 'mg_ld';  
			location.hash = mg_hash + '_' + val;
		}
	}
	
	
	function mg_clear_deeplink() {
		if( jQuery('.mg_grid_wrap').hasClass('mg_deeplink') ) {
			var curr_hash = location.hash;

			// find if a mg hash exists
			if(curr_hash.indexOf('#mg_cd') !== false || curr_hash.indexOf('#mg_ld') !== false) {
				location.hash = 'mg';
			}
		}
	}
	
	
	/////////////////////////////////////
	// utilities
	
	// check for touch device
	function mg_is_touch_device() {
		return !!('ontouchstart' in window);
	}
	
	// check if the browser is IE8 or older
	function mg_is_old_IE() {
		if( jQuery.browser.msie && jQuery.browser['version'] < 9 ) {return true;}
		else {return false;}
	}

})(jQuery);


/////////////////////////////////////
// Image preloader v1.01
(function($) {	
	$.fn.lcweb_lazyload = function(lzl_callbacks) {
		lzl_callbacks = jQuery.extend({
			oneLoaded: function() {},
			allLoaded: function() {}
		}, lzl_callbacks);

		var lzl_loaded = 0, 
			lzl_url_array = [], 
			lzl_width_array = [], 
			lzl_height_array = [], 
			lzl_img_obj = this;
		
		var check_complete = function() {
			if(lzl_url_array.length == lzl_loaded) {
				lzl_callbacks.allLoaded.call(this, lzl_url_array, lzl_width_array, lzl_height_array); 
			}
		}

		var lzl_load = function() {
			jQuery.map(lzl_img_obj, function(n, i){
                lzl_url_array.push( $(n).attr('src') );
            });
			
			jQuery.each(lzl_url_array, function(i, v) {
				if( jQuery.trim(v) == '' ) {console.log('empty img url - ' + (i+1) );}
				
				$('<img />').bind("load.lcweb_lazyload",function(){ 
					if(this.width == 0 || this.height == 0) {
						setTimeout(function() {
							lzl_width_array[i] = this.width;
							lzl_height_array[i] = this.height;
							
							lzl_loaded++;
							check_complete();
						}, 70);
					}
					else {
						lzl_width_array[i] = this.width;
						lzl_height_array[i] = this.height;
						lzl_loaded++;
						check_complete();
					}
				}).attr('src',  v);
			});
		}
		
		return lzl_load();
	}; 
	
})(jQuery);
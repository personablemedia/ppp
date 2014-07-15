<?php
// SHORCODE TO DISPLAY THE GRID

// [mediagrid] 
function mg_shortcode( $atts, $content = null ) {
	require_once(MG_DIR . '/functions.php');
	
	extract( shortcode_atts( array(
		'cat' => '',
		'filter' => 1,
		'r_width' => 'auto',
		'title_under' => 0 
	), $atts ) );

	if($cat == '') {return '';}
	
	// deeplinking class
	(get_option('mg_disable_dl')) ? $dl_class = '' : $dl_class = 'mg_deeplink'; 
	
	// init
	$grid = '';
	
	// filter
	if($filter == '1') {
		$filter_code = mg_grid_terms_data($cat);
		
		$grid .= '<div id="mgf_'.$cat.'" class="mg_filter">';
			if($filter_code) { $grid .= $filter_code; }
		$grid .= '</div>';
	}
	
	// title under - wrap class
	$tit_under_class = ($title_under == 1) ? 'mg_grid_title_under' : '';
	
	$grid .= '
	<div class="mg_grid_wrap '.$dl_class.'">
      <div id="mg_grid_'.$cat.'" class="mg_container lcwp_loading '.$tit_under_class.'" rel="'.$r_width.'">';
	
	/////////////////////////
	// grid contents
		
	$items_list = get_option('mg_grid_'.$cat.'_items');
	$items_w = get_option('mg_grid_'.$cat.'_items_width');
	$items_h = get_option('mg_grid_'.$cat.'_items_height');
	
	$a = 0;
	if(!is_array($items_list)) {return '';}
	foreach($items_list as $post_id) {
      	if(!$items_w) {
			$cell_width = get_post_meta($post_id, 'mg_width', true);
			$cell_height = get_post_meta($post_id, 'mg_height', true);
		}
		else {
			$cell_width = $items_w[$a];
			$cell_height = $items_h[$a];	
		}

		$main_type = get_post_meta($post_id, 'mg_main_type', true);
		$item_layout = get_post_meta($post_id, 'mg_layout', true);
		
		if($main_type != 'spacer') {
			// calculate the thumb img size
			(!get_option('mg_maxwidth')) ? $grid_max_w = 960 : $grid_max_w = (int)get_option('mg_maxwidth');
			$thb_w = ceil($grid_max_w * mg_size_to_perc($cell_width));
			$thb_h = ceil($grid_max_w * mg_size_to_perc($cell_height));
			
			// thumb url
			$img_id = get_post_thumbnail_id($post_id);
			(get_post_meta($post_id, 'mg_thumb_center', true)) ? $thumb_center = get_post_meta($post_id, 'mg_thumb_center', true) : $thumb_center = 'c'; 
			
			$thumb_url = mg_thumb_src($img_id, $thb_w, $thb_h, get_option('mg_thumb_q'), $thumb_center);
			
			// item title
			$item_title = get_the_title($post_id);
			
			// image ALT attribute
			$img_alt = strip_tags( mg_sanitize_input($item_title) );
			
			// title under switch
			if($title_under == 1) {
				$ol_title = '';
				$ud_title = '<div class="mg_title_under"><span>'.$item_title.'</span></div>';
			} 
			else {
				$ol_title = '<div class="cell_type"><span class="mg_overlay_tit">'.$item_title.'</span></div>';
				$ud_title = '';
			}
		}

		
		////////////////////////////
		// simple image
		if($main_type == 'simple_img') {

			$grid .= '
			<div id="'.uniqid().'" class="mg_box col'.$cell_width.' row'.$cell_height.' '.mg_item_terms_classes($post_id).'">	
				<div class="img_wrap">';
					$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
					
			$grid .= '		
				</div>
				'.$ud_title.'
			</div>';	
		}
		
		
		////////////////////////////
		// single image
		else if($main_type == 'single_img') {
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box mg_transitions col'.$cell_width.' row'.$cell_height.' mg_image mg_closed '.mg_item_terms_classes($post_id).'" rel="pid_'.$post_id.'">	

				<div class="img_wrap">
					<div>';
				
						$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
					
						$grid .= '  
						<div class="overlays">
							<div class="overlay"></div>
							<div class="cell_more"><span></span></div>
							'.$ol_title.'
						</div>';
					
			$grid .= '</div>	
				</div>
				'.$ud_title.'
			</div>';
		}
		
		
		////////////////////////////
		// image slider
		else if($main_type == 'img_gallery') {
			$slider_img = get_post_meta($post_id, 'mg_slider_img', true);
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box mg_transitions col'.$cell_width.' row'.$cell_height.' mg_gallery mg_closed '.mg_item_terms_classes($post_id).'" rel="pid_'.$post_id.'">	
				
				<div class="img_wrap">
					 <div>';
					 	$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
				
						$grid .= '  
						<div class="overlays">
							<div class="overlay"></div>
							<div class="cell_more"><span></span></div>
							'.$ol_title.'
						</div>';
					
			$grid .= '</div>	
				</div>
				'.$ud_title.'
			</div>';
		}
		
		
		////////////////////////////
		// video
		else if($main_type == 'video') {
			$video_url = get_post_meta($post_id, 'mg_video_url', true);
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box mg_transitions col'.$cell_width.' row'.$cell_height.' mg_video mg_closed '.mg_item_terms_classes($post_id).'" rel="pid_'.$post_id.'">				
				
				<div class="img_wrap">
					<div>';
					
					$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
				
					$grid .= '  
					<div class="overlays">
						<div class="overlay"></div>
						<div class="cell_more"><span></span></div>
						'.$ol_title.'
					</div>';

					
			$grid .= '</div>	
				</div>
				'.$ud_title.'
			</div>';
		}
		
		
		////////////////////////////
		// audio
		else if($main_type == 'audio') {
			$tracklist = get_post_meta($post_id, 'mg_audio_tracks', true);
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box mg_transitions col'.$cell_width.' row'.$cell_height.' mg_audio mg_closed '.mg_item_terms_classes($post_id).'" rel="pid_'.$post_id.'">	
	
				<div class="img_wrap">
					<div>';
					
						$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
				
						$grid .= '  
						<div class="overlays">
							<div class="overlay"></div>
							<div class="cell_more"><span></span></div>
							'.$ol_title.'
						</div>';
					
			$grid .= '</div>	
				</div>
				'.$ud_title.'
			</div>';
		}
		
		
		////////////////////////////
		// link 
		else if($main_type == 'link') {
			$link_url = get_post_meta($post_id, 'mg_link_url', true);
			$link_target = get_post_meta($post_id, 'mg_link_target', true);
			$nofollow = (get_post_meta($post_id, 'mg_link_nofollow', true) == '1') ? 'rel="nofollow"' : '';
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box col'.$cell_width.' row'.$cell_height.' mg_link '.mg_item_terms_classes($post_id).'">	
				<div class="img_wrap">
					<div>';
	
						$grid .= '
						<a href="'.$link_url.'" target="_'.$link_target.'" '.$nofollow.'><img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />
						  
						<div class="overlays">
							<div class="overlay"></div>
							<div class="cell_more"><span></span></div>
							'.$ol_title.'
						</div>';
					
				$grid .= '</a>
					</div>';
					
			$grid .= '	
				</div>
				'.$ud_title.'
			</div>';		
		}
		
		
		////////////////////////////
		// lightbox custom content
		else if($main_type == 'lb_text') {
			
			$grid .= '
			<div id="'.uniqid().'" class="mg_box mg_transitions col'.$cell_width.' row'.$cell_height.' mg_lb_text mg_closed '.mg_item_terms_classes($post_id).'" rel="pid_'.$post_id.'">	

				<div class="img_wrap">
					<div>';
				
						$grid .= '<img src="'.$thumb_url.'" class="thumb" alt="'.$img_alt.'" />';
					
						$grid .= '  
						<div class="overlays">
							<div class="overlay"></div>
							<div class="cell_more"><span></span></div>
							'.$ol_title.'
						</div>';
					
			$grid .= '</div>	
				</div>
				'.$ud_title.'
			</div>';	
		}
		
		
		
		////////////////////////////
		// spacer 
		else if($main_type == 'spacer') {
			$grid .= '
			<div id="'.uniqid().'" class="mg_box col'.$cell_width.' row'.$cell_height.' mg_spacer"></div>';		
		}
	
		$a++; // counter for the sizes
	}

	////////////////////////////////

	$grid .= '</div></div>';


	// Ajax init
	if(get_option('mg_enable_ajax')) {
		$grid .= '
		<script type="text/javascript">
		jQuery(document).ready(function($) { 
			if( eval("typeof mg_ajax_init == \'function\'") ) {
				mg_ajax_init('.$cat.');
			}
		});
		</script>
		';
	}

	return $grid;
}
add_shortcode('mediagrid', 'mg_shortcode');

?>
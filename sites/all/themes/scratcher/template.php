<?php

/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function scratcher_breadcrumb($vars) {
  $breadcrumb = $vars['breadcrumb'];
  $last = null;

  if(!empty($breadcrumb)) {
    // Provide a navigational heading to give context for breadcrumb links to screen-reader users. Make the heading invisible with .element-invisible.
    if(count($breadcrumb) > 1) $last = array_pop($breadcrumb);
    $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';
    $output .= '<div class="breadcrumb">' . implode('<span class="arrow">></span>', $breadcrumb);
    if($last) $output .= '<span class="arrow">></span><span class="current">'.$last.'</span>';
    $output .= '</div>';
    return $output;
  }
}

/**
 * Override or insert variables into the maintenance page template.
 */
function scratcher_preprocess_maintenance_page(&$vars) {
  // While markup for normal pages is split into page.tpl.php and html.tpl.php,
  // the markup for the maintenance page is all in the single
  // maintenance-page.tpl.php template. So, to have what's done in
  // scratcher_preprocess_html() also happen on the maintenance page, it has to be
  // called here.
  scratcher_preprocess_html($vars);
}

/**
 * Override or insert variables into the html template.
 */
function scratcher_preprocess_html(&$vars) {
    // Classes for body element. Allows advanced theming based on context
    // (home page, node of certain type, etc.)
    if (!$vars['is_front']) {
      // Add unique class for each page.
      $path = drupal_get_path_alias($_GET['q']);
      // Add unique class for each website page
      $section = (strpos($path, '/')) ? substr($path, 0, strpos($path, '/')) : $path;
      $page = preg_split('/\//', $path);
      $page = $page[count($page) - 1];
      if (arg(0) == 'node') {
          if (arg(1) == 'add') {
              $page = 'node-add';
          } elseif (is_numeric(arg(1)) && (arg(2) == 'edit' || arg(2) == 'delete')) {
              $page = 'node-' . arg(2);
          }
      }
      $vars['classes_array'][] = drupal_html_class('path-' . $page);
      $vars['classes_array'][] = drupal_html_class('section-' . $section);

    }
}

/**
 * Override or insert variables into the page template.
 */
function scratcher_preprocess_page(&$vars) {
  // Prepare header.
  $site_fields = array();
  if (!empty($vars['site_name'])) {
    $site_fields[] = $vars['site_name'];
  }
  if (!empty($vars['site_slogan'])) {
    $site_fields[] = $vars['site_slogan'];
  }
  $vars['site_title'] = implode(' ', $site_fields);
  if (!empty($site_fields)) {
    $site_fields[0] = '<span>' . $site_fields[0] . '</span>';
  }
  $vars['site_html'] = implode(' ', $site_fields);

  // Set a variable for the site name title and logo alt attributes text.
  $slogan_text = $vars['site_slogan'];
  $site_name_text = $vars['site_name'];
  $vars['site_name_and_slogan'] = $site_name_text . ' ' . $slogan_text;

  // Set ajax and page-node tpls
  if(isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    $vars['theme_hook_suggestions'] = 'page__ajax';
  }
  if(!empty($vars['node'])) {
    if($vars['node']->type != '') {
      $vars['theme_hook_suggestions'][] = 'page__'.str_replace('_', '--', $vars['node']->type);
    }
    if(strtolower($vars['node']->title) == 'contact') {
      $vars['theme_hook_suggestions'][] = 'page__contact';
    }
    if(strtolower($vars['node']->title) == 'gallery') {
      $vars['theme_hook_suggestions'][] = 'page__gallery';
	}
  }
  // Initialize section image if it exists.
  if (!empty($vars['node'])) {

    /* scratcher header/footer images */
    if($vars['node]']->type = 'scratch_campaign') {
        if($vars['node']->field_page_background['und']){
            $pageBG = file_create_url($vars['node']->field_page_background['und'][0]['uri']);
        } else {
            $pageBG = '';
        }
        $vars['social_links'] = false;
        /* fetch vars */
        $headerImg = field_get_items('node', $vars['node'], 'field_header_images');
        $footerImg = field_get_items('node', $vars['node'], 'field_footer_images');
        $fb = field_get_items('node', $vars['node'], 'field_facebook_url');
        $tw = field_get_items('node', $vars['node'], 'field_twitter_url');
        $yt = field_get_items('node', $vars['node'], 'field_youtube_url');
        $vars['page_bg'] = $pageBG;

        if(!empty($headerImg)) $vars['header_image'] = theme('image_style', array('style_name' => 'campaign_node_banner', 'path' => $headerImg[0]['uri']));
        if(!empty($footerImg)) $vars['footer_image'] = theme('image_style', array('style_name' => 'campaign_node_banner', 'path' => $footerImg[0]['uri']));
        if(!empty($fb) || !empty($tw) || !empty($yt)) {
          $vars['social_links'] = true;
        }
        if(!empty($fb)) $vars['fb_link'] = $fb[0]['value'];
        if(!empty($tw)) $vars['tw_link'] = $tw[0]['value'];
        if(!empty($yt)) $vars['yt_link'] = $yt[0]['value'];
    }


    $items = field_get_items('node', $vars['node'], 'field_section_image');
    if (!empty($items)) {
      $vars['section_image'] = theme('image_style', array('style_name' => 'banner', 'path' => $items[0]['uri']));
    }
  }
}

/**
 * Override or insert variables into the node template.
 */
function scratcher_preprocess_node(&$vars) {
  $vars['submitted'] = $vars['date'] . ' � ' . $vars['name'];
}

/**
 * Override or insert variables into the comment template.
 */
function scratcher_preprocess_comment(&$vars) {
    $vars['submitted'] = $vars['author'].'<span class="pipe">|</span><span class="date">'.$vars['created'].'</span>';
    if($vars['id']%2 == 0) $vars['comment_stripe'] = 'comment-even';
    else $vars['comment_stripe'] = 'comment-odd';
}

/*
* Override filter.module's theme_filter_tips() function to disable tips display.
*/
function scratcher_form_comment_form_alter(&$form, &$form_state, $form_id) {
  $form['comment_body']['#after_build'][] = 'remove_tips';
}

function remove_tips(&$form) {
  unset($form['und'][0]['format']['guidelines']);
  unset($form['und'][0]['format']['help']);
  return $form;
}

/**
* Add unique class (mlid) to all menu items.
* with Menu title as class
*/
function scratcher_menu_link(&$vars) {
  $element = $vars['element'];
  $sub_menu = '';
  $name_id = strtolower(strip_tags($element['#title']));
// remove colons and anything past colons
  if (strpos($name_id, ':')) $name_id = substr ($name_id, 0, strpos($name_id, ':'));
//Preserve alphanumerics, everything else goes away
  $pattern = '/[^a-z]+/ ';
  $name_id = preg_replace($pattern, '', $name_id);
  $element['#attributes']['class'][] = 'menu-' . $name_id;
  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}



<?php
/**
 * @file
 * scratcher.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function scratcher_views_default_views() {
  $export = array();

  $view = new view;
  $view->name = 'campaign_listing';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'campaign_listing';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'campaign_listing';
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['query']['options']['query_comment'] = FALSE;
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['pager']['options']['items_per_page'] = '1';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['title']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['title']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = 0;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = 0;
  $handler->display->display_options['fields']['title']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['title']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['title']['alter']['html'] = 0;
  $handler->display->display_options['fields']['title']['hide_empty'] = 0;
  $handler->display->display_options['fields']['title']['empty_zero'] = 0;
  $handler->display->display_options['fields']['title']['link_to_node'] = 1;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'scratch_campaign' => 'scratch_campaign',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['defaults']['access'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = '';
  $handler->display->display_options['fields']['nid']['alter']['alter_text'] = 1;
  $handler->display->display_options['fields']['nid']['alter']['text'] = '<div id="sQue">[nid]</div>';
  $handler->display->display_options['fields']['nid']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['external'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['nid']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['nid']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['html'] = 0;
  $handler->display->display_options['fields']['nid']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['nid']['element_default_classes'] = 0;
  $handler->display->display_options['fields']['nid']['hide_empty'] = 0;
  $handler->display->display_options['fields']['nid']['empty_zero'] = 0;
  $handler->display->display_options['fields']['nid']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['nid']['link_to_node'] = 1;
  $handler->display->display_options['path'] = 'clp';

  /* Display: Scratcher Home */
  $handler = $view->new_display('page', 'Scratcher Home', 'page_1');
  $handler->display->display_options['defaults']['css_class'] = FALSE;
  $handler->display->display_options['css_class'] = 'scratch-block';
  $handler->display->display_options['defaults']['access'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['defaults']['pager'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'fields';
  $handler->display->display_options['row_options']['hide_empty'] = 0;
  $handler->display->display_options['row_options']['default_field_elements'] = 1;
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['title']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['title']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['title']['alter']['external'] = 0;
  $handler->display->display_options['fields']['title']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['title']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['title']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['title']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['title']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['title']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['title']['alter']['html'] = 0;
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['title']['hide_empty'] = 0;
  $handler->display->display_options['fields']['title']['empty_zero'] = 0;
  $handler->display->display_options['fields']['title']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['title']['link_to_node'] = 1;
  /* Field: Content: Scratcher Images */
  $handler->display->display_options['fields']['field_scratcher_images']['id'] = 'field_scratcher_images';
  $handler->display->display_options['fields']['field_scratcher_images']['table'] = 'field_data_field_scratcher_images';
  $handler->display->display_options['fields']['field_scratcher_images']['field'] = 'field_scratcher_images';
  $handler->display->display_options['fields']['field_scratcher_images']['label'] = '';
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['text'] = '<div id="imgTop">[field_scratcher_images]</div>';
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['external'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['alter']['html'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_scratcher_images']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['field_scratcher_images']['hide_empty'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['empty_zero'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['field_scratcher_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_scratcher_images']['settings'] = array(
    'image_style' => 'scratcher_image_680x450',
    'image_link' => 'content',
  );
  $handler->display->display_options['fields']['field_scratcher_images']['group_rows'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['delta_limit'] = '1';
  $handler->display->display_options['fields']['field_scratcher_images']['delta_offset'] = '0';
  $handler->display->display_options['fields']['field_scratcher_images']['delta_reversed'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['delta_first_last'] = 0;
  $handler->display->display_options['fields']['field_scratcher_images']['field_api_classes'] = 0;
  $handler->display->display_options['path'] = 'home';

  /* Display: Scratcher Home Header */
  $handler = $view->new_display('block', 'Scratcher Home Header', 'block_1');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['defaults']['access'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Header Images */
  $handler->display->display_options['fields']['field_header_images']['id'] = 'field_header_images';
  $handler->display->display_options['fields']['field_header_images']['table'] = 'field_data_field_header_images';
  $handler->display->display_options['fields']['field_header_images']['field'] = 'field_header_images';
  $handler->display->display_options['fields']['field_header_images']['label'] = '';
  $handler->display->display_options['fields']['field_header_images']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['external'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['field_header_images']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['field_header_images']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['field_header_images']['alter']['html'] = 0;
  $handler->display->display_options['fields']['field_header_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_header_images']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['field_header_images']['hide_empty'] = 0;
  $handler->display->display_options['fields']['field_header_images']['empty_zero'] = 0;
  $handler->display->display_options['fields']['field_header_images']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['field_header_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_header_images']['settings'] = array(
    'image_style' => 'campaign_header_680x150',
    'image_link' => '',
  );
  $handler->display->display_options['fields']['field_header_images']['field_api_classes'] = 0;

  /* Display: Scratcher Home Footer */
  $handler = $view->new_display('block', 'Scratcher Home Footer', 'block_2');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['defaults']['access'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Footer Images */
  $handler->display->display_options['fields']['field_footer_images']['id'] = 'field_footer_images';
  $handler->display->display_options['fields']['field_footer_images']['table'] = 'field_data_field_footer_images';
  $handler->display->display_options['fields']['field_footer_images']['field'] = 'field_footer_images';
  $handler->display->display_options['fields']['field_footer_images']['label'] = '';
  $handler->display->display_options['fields']['field_footer_images']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['external'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['field_footer_images']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['field_footer_images']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['alter']['html'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_footer_images']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['field_footer_images']['hide_empty'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['empty_zero'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['field_footer_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_footer_images']['settings'] = array(
    'image_style' => 'campaign_header_680x150',
    'image_link' => '',
  );
  $handler->display->display_options['fields']['field_footer_images']['group_rows'] = 1;
  $handler->display->display_options['fields']['field_footer_images']['delta_offset'] = '0';
  $handler->display->display_options['fields']['field_footer_images']['delta_reversed'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['delta_first_last'] = 0;
  $handler->display->display_options['fields']['field_footer_images']['field_api_classes'] = 0;
  $export['campaign_listing'] = $view;

  return $export;
}

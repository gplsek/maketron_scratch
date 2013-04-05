<?php
/**
 * @file
 * scratcher.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function scratcher_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_images|node|scratch_campaign|form';
  $field_group->group_name = 'group_images';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'scratch_campaign';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_properties';
  $field_group->data = array(
    'label' => 'Campaign Images',
    'weight' => '1',
    'children' => array(
      0 => 'field_header_images',
      1 => 'field_loose_images',
      2 => 'field_scratcher_images',
      3 => 'field_temp_images',
      4 => 'field_win_images',
      5 => 'field_footer_images',
      6 => 'field_page_background',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => '',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_images|node|scratch_campaign|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_properties|node|scratch_campaign|form';
  $field_group->group_name = 'group_properties';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'scratch_campaign';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Campaign Properties',
    'weight' => '2',
    'children' => array(
      0 => 'group_settings',
      1 => 'group_images',
    ),
    'format_type' => 'htabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => '',
      ),
    ),
  );
  $export['group_properties|node|scratch_campaign|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_settings|node|scratch_campaign|form';
  $field_group->group_name = 'group_settings';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'scratch_campaign';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_properties';
  $field_group->data = array(
    'label' => 'Campaign Settings',
    'weight' => '3',
    'children' => array(
      0 => 'field_current_impressions',
      1 => 'field_impressions',
      2 => 'field_win_every',
      3 => 'field_winner_',
      4 => 'field_campaign_type',
      5 => 'field_loose_text',
      6 => 'field_number_of_random_winners',
      7 => 'field_random_winners',
      8 => 'field_show_form_on_loose',
      9 => 'field_win_text',
      10 => 'field_age_verification',
      11 => 'field_age',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => '',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_settings|node|scratch_campaign|form'] = $field_group;

  return $export;
}

<?php
/**
 * @file
 * scratcher.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function scratcher_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "context" && $api == "context") {
    return array("version" => "3");
  }
}

/**
 * Implements hook_node_info().
 */
function scratcher_node_info() {
  $items = array(
    'scratch_campaign' => array(
      'name' => t('Scratch_Campaign'),
      'base' => 'node_content',
      'description' => t('Scratch and win campaign'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}

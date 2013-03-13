<?php
/**
 * @file
 * scratcher.context.inc
 */

/**
 * Implements hook_context_default_contexts().
 */
function scratcher_context_default_contexts() {
  $export = array();

  $context = new stdClass();
  $context->disabled = FALSE; /* Edit this to true to make a default context disabled initially */
  $context->api_version = 3;
  $context->name = 'scratcher';
  $context->description = '';
  $context->tag = 'scratcher';
  $context->conditions = array(
    'node' => array(
      'values' => array(
        'scratch_campaign' => 'scratch_campaign',
      ),
      'options' => array(
        'node_form' => '0',
      ),
    ),
  );
  $context->reactions = array(
    'block' => array(
      'blocks' => array(
        'scratchandwin-scratch-block' => array(
          'module' => 'scratchandwin',
          'delta' => 'scratch-block',
          'region' => 'content',
          'weight' => '-10',
        ),
      ),
    ),
  );
  $context->condition_mode = 0;

  // Translatables
  // Included for use with string extractors like potx.
  t('scratcher');
  $export['scratcher'] = $context;

  return $export;
}

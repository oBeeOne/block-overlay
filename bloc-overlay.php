<?php
/**
 * Plugin Name: Bloc Overlay
 * Description: Ajoute un bloc Gutenberg "Bloc Overlay" permettant de positionner un contenu superposé (overlay) via CSS.
 * Version: 1.0.0
 * Author: Bicreactive
 * Text Domain: bloc-overlay
 */

defined('ABSPATH') || exit;

function bloc_overlay_register_block() {
    register_block_type(__DIR__ . '/block');
}
add_action('init', 'bloc_overlay_register_block');

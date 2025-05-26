<?php
/**
 * GitHub Plugin Updater for Bloc Overlay
 */

add_filter('pre_set_site_transient_update_plugins', function ($transient) {
    if (empty($transient->checked)) return $transient;

    $plugin_slug = 'bloc-overlay/bloc-overlay.php';
    $repo_url = 'https://api.github.com/repos/oBeeOne/bloc-overlay';
    $response = wp_remote_get("$repo_url/releases/latest");

    if (is_wp_error($response)) return $transient;

    $body = json_decode(wp_remote_retrieve_body($response));

    if (!isset($body->tag_name)) return $transient;

    $new_version = ltrim($body->tag_name, 'v');
    $current_version = $transient->checked[$plugin_slug];

    if (version_compare($new_version, $current_version, '>')) {
        $transient->response[$plugin_slug] = (object)[
            'slug' => 'bloc-overlay',
            'plugin' => $plugin_slug,
            'new_version' => $new_version,
            'url' => $body->html_url,
            'package' => $body->zipball_url
        ];
    }

    return $transient;
});

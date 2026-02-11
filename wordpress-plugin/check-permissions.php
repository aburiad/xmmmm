<?php
/**
 * WordPress PDF Generator - Directory Permissions Checker
 * Upload this file to WordPress root and visit it in browser
 */

// Load WordPress
require_once('wp-load.php');

if (!current_user_can('manage_options')) {
    die('Unauthorized');
}

echo '<h1>Directory Permissions Check</h1>';
echo '<style>body{font-family:monospace;padding:20px;}pre{background:#f5f5f5;padding:10px;border-left:3px solid #0073aa;}.success{color:green;}.error{color:red;}.warning{color:orange;}</style>';

// Get WordPress upload directory
$wp_upload_dir = wp_upload_dir();
$base_upload_dir = $wp_upload_dir['basedir'];
$base_upload_url = $wp_upload_dir['baseurl'];

echo '<h2>WordPress Upload Directory</h2>';
echo '<pre>';
echo 'Base Directory: ' . $base_upload_dir . "\n";
echo 'Base URL: ' . $base_upload_url . "\n";
echo 'Exists: ' . (file_exists($base_upload_dir) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";
echo 'Writable: ' . (is_writable($base_upload_dir) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";
echo 'Permissions: ' . substr(sprintf('%o', fileperms($base_upload_dir)), -4) . "\n";
echo '</pre>';

// Custom question-papers directory
$qp_dir = $base_upload_dir . '/question-papers/';
$qp_url = $base_upload_url . '/question-papers/';

echo '<h2>Question Papers Directory</h2>';
echo '<pre>';
echo 'Directory: ' . $qp_dir . "\n";
echo 'URL: ' . $qp_url . "\n";
echo 'Exists: ' . (file_exists($qp_dir) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";

if (!file_exists($qp_dir)) {
    echo 'Attempting to create...' . "\n";
    if (wp_mkdir_p($qp_dir)) {
        echo '<span class="success">Created successfully!</span>' . "\n";
        chmod($qp_dir, 0755);
        echo 'Permissions set to: 0755' . "\n";
    } else {
        echo '<span class="error">Failed to create!</span>' . "\n";
    }
}

if (file_exists($qp_dir)) {
    echo 'Writable: ' . (is_writable($qp_dir) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";
    echo 'Permissions: ' . substr(sprintf('%o', fileperms($qp_dir)), -4) . "\n";
    
    // Test write
    $test_file = $qp_dir . 'test-' . time() . '.txt';
    echo "\n" . 'Testing file write to: ' . basename($test_file) . "\n";
    
    $write_result = @file_put_contents($test_file, 'Test content at ' . date('Y-m-d H:i:s'));
    
    if ($write_result !== false) {
        echo '<span class="success">✓ File write successful!</span>' . "\n";
        echo 'Bytes written: ' . $write_result . "\n";
        echo 'File exists: ' . (file_exists($test_file) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";
        
        if (file_exists($test_file)) {
            echo 'File size: ' . filesize($test_file) . ' bytes' . "\n";
            echo 'File permissions: ' . substr(sprintf('%o', fileperms($test_file)), -4) . "\n";
            
            // Set proper permissions
            chmod($test_file, 0644);
            
            $test_url = $qp_url . basename($test_file);
            echo 'File URL: <a href="' . $test_url . '" target="_blank">' . $test_url . '</a>' . "\n";
            
            // Clean up
            echo "\n" . 'Cleaning up test file...' . "\n";
            if (unlink($test_file)) {
                echo '<span class="success">Test file deleted</span>' . "\n";
            }
        }
    } else {
        echo '<span class="error">✗ File write FAILED!</span>' . "\n";
        $error = error_get_last();
        if ($error) {
            echo 'Error: ' . $error['message'] . "\n";
        }
    }
}
echo '</pre>';

// List existing PDF files
if (file_exists($qp_dir)) {
    echo '<h2>Existing PDF Files</h2>';
    $files = glob($qp_dir . '*.pdf');
    
    if (empty($files)) {
        echo '<pre><span class="warning">No PDF files found</span></pre>';
    } else {
        echo '<pre>';
        echo 'Found ' . count($files) . ' PDF file(s):' . "\n\n";
        
        foreach ($files as $file) {
            $basename = basename($file);
            $size = filesize($file);
            $url = $qp_url . $basename;
            $perms = substr(sprintf('%o', fileperms($file)), -4);
            
            echo 'File: ' . $basename . "\n";
            echo '  Size: ' . number_format($size) . ' bytes' . "\n";
            echo '  Permissions: ' . $perms . "\n";
            echo '  URL: <a href="' . $url . '" target="_blank">' . $url . '</a>' . "\n";
            echo '  Readable: ' . (is_readable($file) ? '<span class="success">YES</span>' : '<span class="error">NO</span>') . "\n";
            echo "\n";
        }
        echo '</pre>';
    }
}

// Server info
echo '<h2>Server Information</h2>';
echo '<pre>';
echo 'PHP Version: ' . PHP_VERSION . "\n";
echo 'Server Software: ' . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo 'Current User: ' . get_current_user() . "\n";
echo 'PHP User: ' . (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['name'] : 'N/A') . "\n";
echo '</pre>';

echo '<hr><p><strong>Diagnostic completed!</strong></p>';
echo '<p>If all checks show <span class="success">YES</span>, your WordPress PDF Generator should work properly.</p>';
echo '<p><a href="' . admin_url() . '">← Back to WordPress Admin</a></p>';
?>

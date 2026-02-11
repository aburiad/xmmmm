<?php
/**
 * Simple Test File for WordPress Plugin
 * Upload this file to your WordPress root and visit: https://ahsan.ronybormon.com/test-plugin.php
 */

// Load WordPress
require_once('wp-load.php');

?>
<!DOCTYPE html>
<html>
<head>
    <title>Plugin Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .success { color: green; padding: 10px; background: #d4edda; margin: 10px 0; border-radius: 4px; }
        .error { color: red; padding: 10px; background: #f8d7da; margin: 10px 0; border-radius: 4px; }
        .info { padding: 10px; background: #d1ecf1; margin: 10px 0; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📄 Question Paper PDF Generator - Test</h1>
        
        <?php
        // Check if plugin is active
        $plugin_active = is_plugin_active('question-paper-pdf-generator/question-paper-pdf-generator.php');
        
        if ($plugin_active) {
            echo '<div class="success">✅ Plugin is ACTIVE!</div>';
        } else {
            echo '<div class="error">❌ Plugin is NOT active. Please activate it first.</div>';
        }
        
        // Check if classes exist
        echo '<h2>Class Check:</h2>';
        
        if (class_exists('FPDF')) {
            echo '<div class="success">✅ FPDF class loaded</div>';
        } else {
            echo '<div class="error">❌ FPDF class not found</div>';
        }
        
        if (class_exists('QP_PDF_Generator')) {
            echo '<div class="success">✅ QP_PDF_Generator class loaded</div>';
        } else {
            echo '<div class="error">❌ QP_PDF_Generator class not found</div>';
        }
        
        // Check FPDF_FONTPATH
        echo '<h2>Font Path Check:</h2>';
        if (defined('FPDF_FONTPATH')) {
            echo '<div class="info">FPDF_FONTPATH is defined: <strong>' . FPDF_FONTPATH . '</strong></div>';
            
            // Check if directory exists
            if (is_dir(FPDF_FONTPATH)) {
                echo '<div class="success">✅ Font directory exists!</div>';
                
                // List font files
                $font_files = glob(FPDF_FONTPATH . '*.php');
                if (!empty($font_files)) {
                    echo '<div class="info">Font files found:<ul>';
                    foreach ($font_files as $file) {
                        $file_size = filesize($file);
                        echo '<li>' . basename($file) . ' (' . $file_size . ' bytes)</li>';
                    }
                    echo '</ul></div>';
                } else {
                    echo '<div class="error">❌ No .php font files found in directory!</div>';
                }
            } else {
                echo '<div class="error">❌ Font directory does NOT exist!</div>';
            }
        } else {
            echo '<div class="error">❌ FPDF_FONTPATH is NOT defined!</div>';
        }
        
        // Check plugin directory constant
        echo '<h2>Plugin Directory Check:</h2>';
        if (defined('QP_PDF_PLUGIN_DIR')) {
            echo '<div class="info">QP_PDF_PLUGIN_DIR: <strong>' . QP_PDF_PLUGIN_DIR . '</strong></div>';
            echo '<div class="info">Expected font path: <strong>' . QP_PDF_PLUGIN_DIR . 'fonts/</strong></div>';
        } else {
            echo '<div class="error">❌ QP_PDF_PLUGIN_DIR is NOT defined!</div>';
        }
        
        // Check REST API endpoint
        echo '<h2>REST API Endpoint:</h2>';
        echo '<div class="info">';
        echo '<strong>GET:</strong> <a href="' . home_url('/wp-json/qpm/v1/papers') . '" target="_blank">' . home_url('/wp-json/qpm/v1/papers') . '</a><br>';
        echo '<strong>POST:</strong> ' . home_url('/wp-json/qpm/v1/generate-pdf');
        echo '</div>';
        
        // Test REST API
        echo '<h2>Quick API Test:</h2>';
        echo '<button onclick="testAPI()">Test GET /papers</button>';
        echo '<div id="api-result"></div>';
        
        // Show constants
        echo '<h2>Plugin Constants:</h2>';
        echo '<pre>';
        echo 'QP_PDF_VERSION: ' . (defined('QP_PDF_VERSION') ? QP_PDF_VERSION : 'Not defined') . "\n";
        echo 'QP_PDF_PLUGIN_DIR: ' . (defined('QP_PDF_PLUGIN_DIR') ? QP_PDF_PLUGIN_DIR : 'Not defined') . "\n";
        echo 'QP_PDF_PLUGIN_URL: ' . (defined('QP_PDF_PLUGIN_URL') ? QP_PDF_PLUGIN_URL : 'Not defined') . "\n";
        echo 'Upload Dir: ' . (function_exists('qp_pdf_get_upload_dir') ? qp_pdf_get_upload_dir() : 'Function not found') . "\n";
        echo 'Upload URL: ' . (function_exists('qp_pdf_get_upload_url') ? qp_pdf_get_upload_url() : 'Function not found') . "\n";
        echo '</pre>';
        
        // Test PDF Generation
        if (isset($_POST['test_pdf'])) {
            echo '<h2>PDF Generation Test:</h2>';
            
            if (class_exists('QP_PDF_Generator')) {
                try {
                    $generator = new QP_PDF_Generator();
                    
                    $test_data = array(
                        'header' => array(
                            'boardName' => 'Test Board',
                            'examTitle' => 'Test Exam',
                            'class' => 'Class 10',
                            'subject' => 'Mathematics',
                            'totalMarks' => '100',
                            'duration' => '3 hours'
                        ),
                        'questions' => array(
                            array(
                                'number' => '1',
                                'marks' => '10',
                                'blocks' => array(
                                    array(
                                        'type' => 'text',
                                        'content' => array('text' => 'This is a test question.')
                                    )
                                ),
                                'subQuestions' => array()
                            )
                        )
                    );
                    
                    $settings = array(
                        'marginLeft' => 20,
                        'marginRight' => 20,
                        'marginTop' => 20,
                        'marginBottom' => 20
                    );
                    
                    $result = $generator->generate($test_data, $settings, 'test-paper');
                    
                    if (is_wp_error($result)) {
                        echo '<div class="error">❌ Error: ' . $result->get_error_message() . '</div>';
                    } else {
                        echo '<div class="success">✅ PDF Generated Successfully!</div>';
                        echo '<div class="info">';
                        echo '<strong>File:</strong> ' . $result['filename'] . '<br>';
                        echo '<strong>Path:</strong> ' . $result['path'] . '<br>';
                        echo '<strong>URL:</strong> <a href="' . $result['url'] . '" target="_blank">' . $result['url'] . '</a>';
                        echo '</div>';
                    }
                } catch (Exception $e) {
                    echo '<div class="error">❌ Exception: ' . $e->getMessage() . '</div>';
                }
            } else {
                echo '<div class="error">❌ QP_PDF_Generator class not found</div>';
            }
        }
        ?>
        
        <h2>Generate Test PDF:</h2>
        <form method="post">
            <button type="submit" name="test_pdf">Generate Test PDF</button>
        </form>
        
        <hr>
        <p><small>Test file - Delete after testing | Created: <?php echo date('Y-m-d H:i:s'); ?></small></p>
    </div>
    
    <script>
        async function testAPI() {
            const resultDiv = document.getElementById('api-result');
            resultDiv.innerHTML = '<div class="info">⏳ Testing API...</div>';
            
            try {
                const response = await fetch('<?php echo home_url('/wp-json/qpm/v1/papers'); ?>');
                const data = await response.json();
                
                resultDiv.innerHTML = '<div class="success">✅ API Response:</div><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                resultDiv.innerHTML = '<div class="error">❌ Error: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>
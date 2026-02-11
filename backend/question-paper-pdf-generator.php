<?php
/**
 * Plugin Name: Question Paper PDF Generator
 * Plugin URI: https://ahsan.ronybormon.com
 * Description: Generate PDF from question paper JSON data with Bangladesh Education Board styling
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://ahsan.ronybormon.com
 * Text Domain: qp-pdf-gen
 * Requires PHP: 7.4
 * Requires at least: 5.6
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('QP_PDF_VERSION', '1.0.0');
define('QP_PDF_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('QP_PDF_PLUGIN_URL', plugin_dir_url(__FILE__));
define('QP_PDF_UPLOAD_DIR', wp_upload_dir()['basedir'] . '/question-papers/');
define('QP_PDF_UPLOAD_URL', wp_upload_dir()['baseurl'] . '/question-papers/');

/**
 * Main Plugin Class
 */
class Question_Paper_PDF_Generator {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load required files
     */
    private function load_dependencies() {
        // Load FPDF library (no composer needed!)
        require_once QP_PDF_PLUGIN_DIR . 'includes/lib/fpdf.php';
        
        // Load plugin classes
        require_once QP_PDF_PLUGIN_DIR . 'includes/class-qp-post-type.php';
        require_once QP_PDF_PLUGIN_DIR . 'includes/class-qp-rest-api.php';
        require_once QP_PDF_PLUGIN_DIR . 'includes/class-qp-pdf-generator.php';
    }
    
    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Activation/Deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Initialize components
        add_action('init', array($this, 'init_components'));
        
        // Add CORS headers for REST API
        add_action('rest_api_init', array($this, 'add_cors_headers'));
    }
    
    /**
     * Initialize plugin components
     */
    public function init_components() {
        // Initialize custom post type
        QP_Post_Type::get_instance();
        
        // Initialize REST API
        QP_REST_API::get_instance();
    }
    
    /**
     * Add CORS headers for external access
     */
    public function add_cors_headers() {
        // Allow requests from any origin (তবে production এ specific origin set করবেন)
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create upload directory
        if (!file_exists(QP_PDF_UPLOAD_DIR)) {
            wp_mkdir_p(QP_PDF_UPLOAD_DIR);
        }
        
        // Create .htaccess to allow PDF downloads
        $htaccess_file = QP_PDF_UPLOAD_DIR . '.htaccess';
        if (!file_exists($htaccess_file)) {
            $htaccess_content = "Options -Indexes\n";
            $htaccess_content .= "<Files *.pdf>\n";
            $htaccess_content .= "    Allow from all\n";
            $htaccess_content .= "</Files>";
            file_put_contents($htaccess_file, $htaccess_content);
        }
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// Initialize the plugin
function qp_pdf_generator() {
    return Question_Paper_PDF_Generator::get_instance();
}

// Start the plugin
qp_pdf_generator();
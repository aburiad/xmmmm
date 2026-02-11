<?php
/**
 * REST API Endpoints for Question Paper PDF Generation
 */

if (!defined('ABSPATH')) {
    exit;
}

class QP_REST_API {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        $namespace = 'qpm/v1';
        
        // Generate PDF from JSON data
        register_rest_route($namespace, '/generate-pdf', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'generate_pdf'),
            'permission_callback' => '__return_true', // Public access (আপাতত, পরে auth যোগ করবেন)
        ));
        
        // Get PDF by ID
        register_rest_route($namespace, '/papers/(?P<id>\d+)/pdf', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_pdf'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'id' => array(
                    'required'          => true,
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ),
            ),
        ));
        
        // Save question paper
        register_rest_route($namespace, '/papers', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'save_paper'),
            'permission_callback' => '__return_true',
        ));
        
        // Get all papers
        register_rest_route($namespace, '/papers', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_papers'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Generate PDF from question paper data
     */
    public function generate_pdf($request) {
        try {
            $params = $request->get_json_params();
            
            if (empty($params['questionPaper']) || empty($params['pageSettings'])) {
                return new WP_Error(
                    'missing_data',
                    'Question paper data and page settings are required',
                    array('status' => 400)
                );
            }
            
            // Initialize PDF generator
            $generator = new QP_PDF_Generator();
            
            // Generate PDF
            $result = $generator->generate(
                $params['questionPaper'],
                $params['pageSettings'],
                isset($params['title']) ? $params['title'] : 'question-paper'
            );
            
            if (is_wp_error($result)) {
                return $result;
            }
            
            return new WP_REST_Response(array(
                'success'  => true,
                'pdf_url'  => $result['url'],
                'file_path' => $result['path'],
                'message'  => 'PDF generated successfully'
            ), 200);
            
        } catch (Exception $e) {
            return new WP_Error(
                'pdf_generation_failed',
                $e->getMessage(),
                array('status' => 500)
            );
        }
    }
    
    /**
     * Get PDF URL for a saved paper
     */
    public function get_pdf($request) {
        $post_id = $request->get_param('id');
        
        // Check if post exists
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'question_paper') {
            return new WP_Error(
                'not_found',
                'Question paper not found',
                array('status' => 404)
            );
        }
        
        // Get PDF URL from meta
        $pdf_url = get_post_meta($post_id, 'qp_pdf_url', true);
        
        if (empty($pdf_url)) {
            return new WP_Error(
                'pdf_not_generated',
                'PDF not generated for this paper',
                array('status' => 404)
            );
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'pdf_url' => $pdf_url,
            'generated_at' => get_post_meta($post_id, 'qp_pdf_generated_at', true)
        ), 200);
    }
    
    /**
     * Save question paper
     */
    public function save_paper($request) {
        try {
            $params = $request->get_json_params();
            
            if (empty($params['title']) || empty($params['questionPaper'])) {
                return new WP_Error(
                    'missing_data',
                    'Title and question paper data are required',
                    array('status' => 400)
                );
            }
            
            // Create post
            $post_data = array(
                'post_title'   => sanitize_text_field($params['title']),
                'post_type'    => 'question_paper',
                'post_status'  => 'publish',
                'post_content' => '', // Optional: Add description
            );
            
            $post_id = wp_insert_post($post_data);
            
            if (is_wp_error($post_id)) {
                return $post_id;
            }
            
            // Save question paper data
            update_post_meta($post_id, 'qp_data', wp_json_encode($params['questionPaper']));
            
            // Save page settings
            if (!empty($params['pageSettings'])) {
                update_post_meta($post_id, 'qp_page_settings', wp_json_encode($params['pageSettings']));
            }
            
            return new WP_REST_Response(array(
                'success' => true,
                'post_id' => $post_id,
                'message' => 'Question paper saved successfully'
            ), 201);
            
        } catch (Exception $e) {
            return new WP_Error(
                'save_failed',
                $e->getMessage(),
                array('status' => 500)
            );
        }
    }
    
    /**
     * Get all question papers
     */
    public function get_papers($request) {
        $args = array(
            'post_type'      => 'question_paper',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'date',
            'order'          => 'DESC'
        );
        
        $query = new WP_Query($args);
        $papers = array();
        
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();
                
                $papers[] = array(
                    'id'           => $post_id,
                    'title'        => get_the_title(),
                    'date'         => get_the_date('c'),
                    'pdf_url'      => get_post_meta($post_id, 'qp_pdf_url', true),
                    'has_pdf'      => !empty(get_post_meta($post_id, 'qp_pdf_url', true)),
                );
            }
            wp_reset_postdata();
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'papers'  => $papers,
            'total'   => count($papers)
        ), 200);
    }
}

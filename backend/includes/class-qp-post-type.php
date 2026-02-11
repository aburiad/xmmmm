<?php
/**
 * Custom Post Type for Question Papers
 */

if (!defined('ABSPATH')) {
    exit;
}

class QP_Post_Type {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('init', array($this, 'register_meta_fields'));
    }
    
    /**
     * Register Question Paper post type
     */
    public function register_post_type() {
        $labels = array(
            'name'               => 'Question Papers',
            'singular_name'      => 'Question Paper',
            'menu_name'          => 'Question Papers',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Question Paper',
            'edit_item'          => 'Edit Question Paper',
            'new_item'           => 'New Question Paper',
            'view_item'          => 'View Question Paper',
            'search_items'       => 'Search Question Papers',
            'not_found'          => 'No question papers found',
            'not_found_in_trash' => 'No question papers found in trash',
        );
        
        $args = array(
            'labels'              => $labels,
            'public'              => true,
            'has_archive'         => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'rest_base'           => 'question-papers',
            'menu_icon'           => 'dashicons-media-document',
            'supports'            => array('title', 'editor', 'author', 'revisions'),
            'capability_type'     => 'post',
            'rewrite'             => array('slug' => 'question-papers'),
        );
        
        register_post_type('question_paper', $args);
    }
    
    /**
     * Register custom meta fields
     */
    public function register_meta_fields() {
        // Question paper JSON data
        register_post_meta('question_paper', 'qp_data', array(
            'type'         => 'string',
            'description'  => 'Question paper JSON data',
            'single'       => true,
            'show_in_rest' => true,
        ));
        
        // Page settings
        register_post_meta('question_paper', 'qp_page_settings', array(
            'type'         => 'string',
            'description'  => 'Page settings JSON',
            'single'       => true,
            'show_in_rest' => true,
        ));
        
        // Generated PDF URL
        register_post_meta('question_paper', 'qp_pdf_url', array(
            'type'         => 'string',
            'description'  => 'Generated PDF file URL',
            'single'       => true,
            'show_in_rest' => true,
        ));
        
        // PDF generation timestamp
        register_post_meta('question_paper', 'qp_pdf_generated_at', array(
            'type'         => 'string',
            'description'  => 'PDF generation timestamp',
            'single'       => true,
            'show_in_rest' => true,
        ));
    }
}

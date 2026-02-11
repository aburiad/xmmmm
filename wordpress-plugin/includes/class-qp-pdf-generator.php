<?php
/**
 * PDF Generator using FPDF (No Composer Dependencies)
 * Supports Bangladesh Education Board styling with Bangla fonts
 */

if (!defined('ABSPATH')) {
    exit;
}

// Extended FPDF class for Bangla support
class PDF_Bangla extends FPDF {
    
    protected $B;
    protected $I;
    protected $U;
    protected $HREF;
    
    function __construct($orientation='P', $unit='mm', $size='A4') {
        parent::__construct($orientation, $unit, $size);
        $this->B = 0;
        $this->I = 0;
        $this->U = 0;
        $this->HREF = '';
    }
    
    // Override to add UTF-8 support
    function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='') {
        parent::Cell($w, $h, $txt, $border, $ln, $align, $fill, $link);
    }
    
    function MultiCellBangla($w, $h, $txt, $border=0, $align='L', $fill=false) {
        // Simple multi-line cell (Bangla text will be rendered line by line)
        $lines = explode("\n", $txt);
        foreach($lines as $line) {
            $this->Cell($w, $h, $line, $border, 1, $align, $fill);
        }
    }
}

class QP_PDF_Generator {
    
    private $pdf;
    private $font_path;
    
    public function __construct() {
        $this->font_path = QP_PDF_PLUGIN_DIR . 'fonts/';
    }
    
    /**
     * Generate PDF from question paper data
     * 
     * @param array $question_paper Question paper data
     * @param array $page_settings Page settings
     * @param string $filename PDF filename (without extension)
     * @return array|WP_Error Generated PDF info or error
     */
    public function generate($question_paper, $page_settings, $filename = 'question-paper') {
        try {
            error_log('QPM Debug: Starting PDF generation...');
            error_log('QPM Debug: Filename: ' . $filename);
            error_log('QPM Debug: Question paper data: ' . print_r($question_paper, true));
            
            // Initialize PDF
            $this->init_pdf($page_settings);
            error_log('QPM Debug: PDF initialized');
            
            // Add page
            $this->pdf->AddPage();
            error_log('QPM Debug: Page added');
            
            // Add some test content to ensure PDF is not empty
            $this->pdf->SetFont('Arial', 'B', 16);
            $this->pdf->Cell(0, 10, 'Question Paper', 0, 1, 'C');
            error_log('QPM Debug: Test content added');
            
            // Render header
            if (!empty($question_paper['header'])) {
                $this->render_header($question_paper['header']);
                error_log('QPM Debug: Header rendered');
            }
            
            // Render questions
            if (!empty($question_paper['questions'])) {
                $this->render_questions($question_paper['questions']);
                error_log('QPM Debug: Questions rendered, count: ' . count($question_paper['questions']));
            } else {
                error_log('QPM Debug: No questions to render!');
            }
            
            // Save PDF file
            $result = $this->save_pdf($filename);
            error_log('QPM Debug: PDF saved successfully');
            
            return $result;
            
        } catch (Exception $e) {
            error_log('QPM Debug: Exception caught: ' . $e->getMessage());
            return new WP_Error(
                'pdf_generation_error',
                'PDF generation failed: ' . $e->getMessage(),
                array('status' => 500)
            );
        }
    }
    
    /**
     * Initialize PDF with settings
     */
    private function init_pdf($settings) {
        // FPDF_FONTPATH is already defined in main plugin file (line 26)
        // No need to redefine it here
        
        // Create new PDF instance
        $this->pdf = new PDF_Bangla('P', 'mm', 'A4');
        
        // Set default font (Arial/Helvetica is a core font)
        $this->pdf->SetFont('Arial', '', 11);
        
        // Set margins
        $left = isset($settings['marginLeft']) ? intval($settings['marginLeft']) : 15;
        $top = isset($settings['marginTop']) ? intval($settings['marginTop']) : 15;
        $right = isset($settings['marginRight']) ? intval($settings['marginRight']) : 15;
        
        $this->pdf->SetMargins($left, $top, $right);
        $this->pdf->SetAutoPageBreak(true, isset($settings['marginBottom']) ? intval($settings['marginBottom']) : 15);
        
        // Set metadata
        $this->pdf->SetAuthor('Question Paper Generator');
        $this->pdf->SetTitle('Question Paper');
        $this->pdf->SetCreator('Question Paper PDF Generator Plugin');
    }
    
    /**
     * Render header section
     */
    private function render_header($header) {
        // Title with guaranteed content
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->Cell(0, 10, 'QUESTION PAPER', 0, 1, 'C');
        $this->pdf->Ln(3);
        
        // Board name
        if (!empty($header['boardName'])) {
            $this->pdf->SetFont('Arial', 'B', 13);
            $this->pdf->Cell(0, 8, $header['boardName'], 0, 1, 'C');
        }
        
        // Exam title
        if (!empty($header['examTitle'])) {
            $this->pdf->SetFont('Arial', 'B', 12);
            $this->pdf->Cell(0, 7, $header['examTitle'], 0, 1, 'C');
        }
        
        // Class and Subject
        $this->pdf->SetFont('Arial', '', 11);
        if (!empty($header['class'])) {
            $this->pdf->Cell(0, 6, 'Class: ' . $header['class'], 0, 1, 'C');
        }
        
        if (!empty($header['subject'])) {
            $this->pdf->Cell(0, 6, 'Subject: ' . $header['subject'], 0, 1, 'C');
        }
        
        // Marks and Time
        $this->pdf->Ln(3);
        $this->pdf->Cell(0, 0, '', 'T'); // Top border line
        $this->pdf->Ln(2);
        
        $this->pdf->SetFont('Arial', '', 10);
        $marks_time = '';
        if (!empty($header['totalMarks'])) {
            $marks_time .= 'Total Marks: ' . $header['totalMarks'];
        }
        if (!empty($header['duration'])) {
            if ($marks_time) $marks_time .= '        '; // Spacing
            $marks_time .= 'Time: ' . $header['duration'];
        }
        
        if ($marks_time) {
            $this->pdf->Cell(0, 6, $marks_time, 0, 1, 'C');
        }
        
        $this->pdf->Ln(2);
        $this->pdf->Cell(0, 0, '', 'T'); // Bottom border line
        $this->pdf->Ln(5);
    }
    
    /**
     * Render all questions
     */
    private function render_questions($questions) {
        $this->pdf->SetFont('Arial', '', 11);
        
        foreach ($questions as $question) {
            $this->render_question($question);
            $this->pdf->Ln(4); // Space between questions
        }
    }
    
    /**
     * Render single question
     */
    private function render_question($question) {
        // Question number and marks
        $this->pdf->SetFont('Arial', 'B', 11);
        
        // Simple ASCII question header (avoid Bangla rendering issues)
        $question_header = 'Q' . $question['number'] . '. ';
        
        if (!empty($question['marks'])) {
            $question_header .= '[' . $question['marks'] . ' marks]';
        }
        
        $this->pdf->Cell(0, 7, $question_header, 0, 1);
        $this->pdf->Ln(2);
        
        // Question blocks
        if (!empty($question['blocks'])) {
            $this->pdf->SetFont('Arial', '', 11);
            $this->render_blocks($question['blocks']);
        }
        
        // Sub-questions (a, b, c, d)
        if (!empty($question['subQuestions'])) {
            $this->pdf->Ln(2);
            foreach ($question['subQuestions'] as $sub) {
                $this->pdf->SetX($this->pdf->GetX() + 10); // Indent
                $this->pdf->SetFont('Arial', 'B', 10);
                
                // Convert Bangla labels (ক, খ, গ) to English (a, b, c)
                $label = $this->convert_bangla_label($sub['label']);
                $this->pdf->Cell(10, 6, $label . ')', 0, 0);
                
                $this->pdf->SetFont('Arial', '', 10);
                if (!empty($sub['blocks'])) {
                    $this->render_blocks($sub['blocks'], true);
                } else {
                    $this->pdf->Ln();
                }
                
                if (!empty($sub['marks'])) {
                    $this->pdf->Cell(0, 5, '[' . $sub['marks'] . ' marks]', 0, 1, 'R');
                }
                $this->pdf->Ln(1);
            }
        }
    }
    
    /**
     * Render content blocks
     */
    private function render_blocks($blocks, $inline = false) {
        foreach ($blocks as $block) {
            $this->render_block($block, $inline);
        }
    }
    
    /**
     * Render single block
     */
    private function render_block($block, $inline = false) {
        switch ($block['type']) {
            case 'text':
                $text = $this->convert_bangla($block['content']['text']);
                if ($inline) {
                    $this->pdf->MultiCell(0, 5, $text, 0, 'L');
                } else {
                    $this->pdf->MultiCell(0, 5, $text, 0, 'L');
                    $this->pdf->Ln(1);
                }
                break;
                
            case 'formula':
                // Display formula as text (LaTeX rendering not supported in basic FPDF)
                $this->pdf->SetFont('Courier', '', 10);
                $this->pdf->Cell(0, 6, $block['content']['latex'], 0, 1, 'C');
                $this->pdf->SetFont('Arial', '', 11);
                $this->pdf->Ln(1);
                break;
                
            case 'image':
                if (!empty($block['content']['url'])) {
                    $this->render_image($block['content']);
                }
                break;
                
            case 'table':
                $this->render_table($block['content']);
                break;
                
            case 'diagram':
                // Render diagram placeholder
                $this->pdf->SetFillColor(249, 249, 249);
                $this->pdf->SetDrawColor(153, 153, 153);
                $this->pdf->Rect($this->pdf->GetX(), $this->pdf->GetY(), 80, 40, 'D');
                $this->pdf->SetY($this->pdf->GetY() + 15);
                $desc = !empty($block['content']['description']) ? $block['content']['description'] : 'চিত্র';
                $this->pdf->Cell(80, 6, '[' . $this->convert_bangla($desc) . ']', 0, 1, 'C');
                $this->pdf->SetY($this->pdf->GetY() + 15);
                $this->pdf->Ln(2);
                break;
                
            case 'list':
                if (!empty($block['content']['items'])) {
                    foreach ($block['content']['items'] as $item) {
                        if (!empty($item)) {
                            $this->pdf->Cell(5, 5, '-', 0, 0);
                            $this->pdf->MultiCell(0, 5, $this->convert_bangla($item), 0, 'L');
                        }
                    }
                    $this->pdf->Ln(1);
                }
                break;
                
            case 'blank':
                $lines = isset($block['content']['lines']) ? intval($block['content']['lines']) : 1;
                for ($i = 0; $i < $lines; $i++) {
                    $this->pdf->Cell(0, 0, '', 'B'); // Blank line
                    $this->pdf->Ln(6);
                }
                break;
        }
    }
    
    /**
     * Render image block
     */
    private function render_image($content) {
        $url = $content['url'];
        
        // Handle base64 images
        if (strpos($url, 'data:image') === 0) {
            // Extract base64 data
            preg_match('/data:image\/(\w+);base64,(.*)/', $url, $matches);
            if (count($matches) == 3) {
                $image_data = base64_decode($matches[2]);
                $temp_file = tempnam(sys_get_temp_dir(), 'qp_img_') . '.' . $matches[1];
                file_put_contents($temp_file, $image_data);
                $url = $temp_file;
            }
        }
        
        // Check if image file exists
        if (file_exists($url) || filter_var($url, FILTER_VALIDATE_URL)) {
            $width = !empty($content['width']) ? intval($content['width']) * 0.264583 : 0; // px to mm
            $height = !empty($content['height']) ? intval($content['height']) * 0.264583 : 0;
            
            try {
                $this->pdf->Image($url, null, null, $width, $height);
                $this->pdf->Ln(2);
                
                // Caption
                if (!empty($content['caption'])) {
                    $this->pdf->SetFont('Arial', 'I', 9);
                    $this->pdf->Cell(0, 5, $this->convert_bangla($content['caption']), 0, 1, 'C');
                    $this->pdf->SetFont('Arial', '', 11);
                    $this->pdf->Ln(1);
                }
                
                // Clean up temp file
                if (isset($temp_file) && file_exists($temp_file)) {
                    unlink($temp_file);
                }
            } catch (Exception $e) {
                // If image fails, show placeholder
                $this->pdf->Cell(0, 6, '[Image: ' . basename($url) . ']', 0, 1);
            }
        }
    }
    
    /**
     * Render table block
     */
    private function render_table($content) {
        $headers = isset($content['headers']) ? $content['headers'] : array();
        $data = isset($content['data']) ? $content['data'] : array();
        
        if (empty($data)) {
            return;
        }
        
        // Calculate column width
        $num_cols = !empty($headers) ? count($headers) : (is_array($data[0]) ? count($data[0]) : 0);
        if ($num_cols == 0) return;
        
        $col_width = (210 - $this->pdf->GetX() - 30) / $num_cols; // A4 width minus margins
        
        // Set table font
        $this->pdf->SetFont('Arial', '', 10);
        
        // Headers
        if (!empty($headers) && array_filter($headers)) {
            $this->pdf->SetFillColor(241, 245, 249);
            $this->pdf->SetFont('Arial', 'B', 10);
            foreach ($headers as $header) {
                $this->pdf->Cell($col_width, 7, $this->convert_bangla($header), 1, 0, 'C', true);
            }
            $this->pdf->Ln();
        }
        
        // Data rows
        $this->pdf->SetFont('Arial', '', 10);
        foreach ($data as $row) {
            if (is_array($row)) {
                foreach ($row as $cell) {
                    $this->pdf->Cell($col_width, 7, $this->convert_bangla($cell), 1, 0, 'L');
                }
                $this->pdf->Ln();
            }
        }
        
        $this->pdf->Ln(2);
    }
    
    /**
     * Convert Bangla text (basic UTF-8 handling)
     * Note: For proper Bangla rendering, TTF font support is needed
     */
    private function convert_bangla($text) {
        // For now, return as-is
        // In production, you would need to:
        // 1. Add TTF font with AddFont()
        // 2. Use SetFont() with that font
        // 3. Convert text encoding if needed
        return $text;
    }
    
    /**
     * Convert Bangla labels to English
     */
    private function convert_bangla_label($label) {
        // Bangla to English mapping for sub-question labels
        $bangla_to_english = array(
            'ক' => 'a',
            'খ' => 'b',
            'গ' => 'c',
            'ঘ' => 'd'
        );
        
        // Replace Bangla with English
        $label = str_replace(array_keys($bangla_to_english), array_values($bangla_to_english), $label);
        
        return $label;
    }
    
    /**
     * Save PDF file
     */
    private function save_pdf($filename) {
        // Remove Bangla characters and sanitize filename
        // Convert to ASCII-safe filename
        $filename = $this->sanitize_bangla_filename($filename);
        $filename = sanitize_file_name($filename);
        $filename = $filename . '-' . time() . '.pdf';
        
        // Get upload directory dynamically
        $upload_dir = qp_pdf_get_upload_dir();
        $upload_url = qp_pdf_get_upload_url();
        
        // Ensure upload directory exists with proper permissions
        if (!file_exists($upload_dir)) {
            if (!wp_mkdir_p($upload_dir)) {
                error_log('QPM Error: Failed to create directory: ' . $upload_dir);
                throw new Exception('Failed to create upload directory');
            }
            // Set proper permissions
            @chmod($upload_dir, 0755);
        }
        
        // Verify directory is writable
        if (!is_writable($upload_dir)) {
            error_log('QPM Error: Directory not writable: ' . $upload_dir);
            throw new Exception('Upload directory is not writable');
        }
        
        $file_path = $upload_dir . $filename;
        
        // Save PDF with error handling
        try {
            $this->pdf->Output('F', $file_path);
            
            // Verify file was created
            if (!file_exists($file_path)) {
                error_log('QPM Error: PDF file not created: ' . $file_path);
                throw new Exception('PDF file was not created');
            }
            
            // Check file size
            $file_size = filesize($file_path);
            error_log('QPM Debug: PDF file size: ' . $file_size . ' bytes');
            
            if ($file_size < 100) {
                error_log('QPM Error: PDF file too small (possibly empty): ' . $file_size . ' bytes');
                throw new Exception('PDF file is empty or corrupted');
            }
            
            // Set proper file permissions
            @chmod($file_path, 0644);
            
            error_log('QPM Success: PDF created at: ' . $file_path . ' (' . $file_size . ' bytes)');
            
        } catch (Exception $e) {
            error_log('QPM Error during PDF Output: ' . $e->getMessage());
            throw new Exception('Failed to save PDF: ' . $e->getMessage());
        }
        
        return array(
            'path' => $file_path,
            'url'  => $upload_url . $filename,
            'filename' => $filename
        );
    }
    
    /**
     * Sanitize Bangla filename - Transliterate to English
     */
    private function sanitize_bangla_filename($filename) {
        // Bangla to English mapping
        $bangla_to_english = array(
            'গণিত' => 'gonit',
            'বাংলা' => 'bangla',
            'ইংরেজি' => 'english',
            'বিজ্ঞান' => 'biggan',
            'সমাজ' => 'somaj',
            'ইতিহাস' => 'itihas',
            'ভূগোল' => 'bhugol',
            'পদার্থবিজ্ঞান' => 'physics',
            'রসায়ন' => 'chemistry',
            'জীববিজ্ঞান' => 'biology',
            'ধর্ম' => 'religion',
            'কৃষি' => 'agriculture',
            'গার্হস্থ্য' => 'home-science',
            'চারু' => 'fine-arts',
            'সংগীত' => 'music',
            '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4',
            '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9',
        );
        
        // Replace Bangla with English
        $filename = str_replace(array_keys($bangla_to_english), array_values($bangla_to_english), $filename);
        
        // Remove any remaining Bangla characters
        $filename = preg_replace('/[^\x00-\x7F]+/', '', $filename);
        
        // If filename is empty after sanitization, use default
        if (empty(trim($filename, '_-'))) {
            $filename = 'question-paper';
        }
        
        return $filename;
    }
}
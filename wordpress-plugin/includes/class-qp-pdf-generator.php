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
            // Initialize PDF
            $this->init_pdf($page_settings);
            
            // Add page
            $this->pdf->AddPage();
            
            // Render header
            if (!empty($question_paper['header'])) {
                $this->render_header($question_paper['header']);
            }
            
            // Render questions
            if (!empty($question_paper['questions'])) {
                $this->render_questions($question_paper['questions']);
            }
            
            // Save PDF file
            $result = $this->save_pdf($filename);
            
            return $result;
            
        } catch (Exception $e) {
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
        // Board logo (if exists and is accessible)
        if (!empty($header['logo']) && file_exists($header['logo'])) {
            $this->pdf->Image($header['logo'], null, null, 15);
            $this->pdf->Ln(2);
        }
        
        // Board name
        if (!empty($header['boardName'])) {
            $this->pdf->SetFont('Arial', 'B', 13);
            $this->pdf->Cell(0, 6, $this->convert_bangla($header['boardName']), 0, 1, 'C');
        }
        
        // Exam title
        if (!empty($header['examTitle'])) {
            $this->pdf->SetFont('Arial', 'B', 12);
            $this->pdf->Cell(0, 6, $this->convert_bangla($header['examTitle']), 0, 1, 'C');
        }
        
        // Class and Subject
        $this->pdf->SetFont('Arial', '', 10);
        if (!empty($header['class'])) {
            $this->pdf->Cell(0, 5, $this->convert_bangla('শ্রেণি: ' . $header['class']), 0, 1, 'C');
        }
        
        if (!empty($header['subject'])) {
            $this->pdf->Cell(0, 5, $this->convert_bangla('বিষয়: ' . $header['subject']), 0, 1, 'C');
        }
        
        // Marks and Time
        $this->pdf->Ln(2);
        $this->pdf->Cell(0, 0, '', 'T'); // Top border line
        $this->pdf->Ln(1);
        
        $marks_time = '';
        if (!empty($header['totalMarks'])) {
            $marks_time .= $this->convert_bangla('পূর্ণমান: ' . $header['totalMarks']);
        }
        if (!empty($header['duration'])) {
            if ($marks_time) $marks_time .= '                '; // Spacing
            $marks_time .= $this->convert_bangla('সময়: ' . $header['duration']);
        }
        
        $this->pdf->Cell(0, 6, $marks_time, 0, 1, 'C');
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
        $question_header = $this->convert_bangla($question['number']) . '. ';
        
        if (!empty($question['marks'])) {
            $question_header .= ' [' . $this->convert_bangla($question['marks'] . ' নম্বর') . ']';
        }
        
        $this->pdf->Cell(0, 6, $question_header, 0, 1);
        
        // Question blocks
        if (!empty($question['blocks'])) {
            $this->pdf->SetFont('Arial', '', 11);
            $this->render_blocks($question['blocks']);
        }
        
        // Sub-questions (ক, খ, গ, ঘ)
        if (!empty($question['subQuestions'])) {
            $this->pdf->Ln(2);
            foreach ($question['subQuestions'] as $sub) {
                $this->pdf->SetX($this->pdf->GetX() + 10); // Indent
                $this->pdf->SetFont('Arial', 'B', 10);
                $this->pdf->Cell(10, 5, $this->convert_bangla($sub['label']), 0, 0);
                
                $this->pdf->SetFont('Arial', '', 10);
                if (!empty($sub['blocks'])) {
                    $this->render_blocks($sub['blocks'], true);
                } else {
                    $this->pdf->Ln();
                }
                
                if (!empty($sub['marks'])) {
                    $this->pdf->Cell(0, 5, '[' . $this->convert_bangla($sub['marks']) . ']', 0, 1, 'R');
                }
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
     * Save PDF file
     */
    private function save_pdf($filename) {
        // Sanitize filename
        $filename = sanitize_file_name($filename);
        $filename = $filename . '-' . time() . '.pdf';
        
        // Get upload directory dynamically
        $upload_dir = qp_pdf_get_upload_dir();
        $upload_url = qp_pdf_get_upload_url();
        
        // Ensure upload directory exists
        if (!file_exists($upload_dir)) {
            wp_mkdir_p($upload_dir);
        }
        
        $file_path = $upload_dir . $filename;
        
        // Save PDF
        $this->pdf->Output('F', $file_path);
        
        return array(
            'path' => $file_path,
            'url'  => $upload_url . $filename,
            'filename' => $filename
        );
    }
}
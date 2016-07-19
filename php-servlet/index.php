<?php
// example of how to use basic selector to retrieve HTML contents
include('simple_dom.php');
 
// get desired user name
if (isset($_GET['username'])){
	$username = $_GET['username'];
}
else {
        $arr = array('followers' => 'none found');
        echo json_encode($arr);
	die;
}
if ($username == ''){

        $arr = array('followers' => 'none found');
        echo json_encode($arr);
	die;
}
// get DOM from URL or file
$html = file_get_html('http://www.twitter.com/'.$username);
// find all td tags with attribite align=center
if (preg_match('/ProfileNav-item--followers/',$html)){
foreach($html->find('li.ProfileNav-item--followers') as $article) {
        // get title
        $item = trim($article->find('span', 1)->plaintext);
        $arr = array('followers' => $item);
        echo json_encode($arr);
    }}
else {

        $arr = array('followers' => '-1');
        echo json_encode($arr);
}
    

?>
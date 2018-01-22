<?php
  $servername = 'localhost';
  $username 	= 'root';
  $password 	= '';
  $dbname 		= 'ka_babylist';

  $feedback 	= array();

	if ($_POST && isset($_POST['data']) && isset($_POST['type'])) {
		$mysqli = new mysqli($servername, $username, $password, $dbname);
	  if ($mysqli->connect_error) {
	      die('Connection failed: ' . $mysqli->connect_error);
	  }

		if($_POST['type'] === 'name') {
			$data 	= $_POST['data'];
			$name 	= $mysqli->real_escape_string(json_decode($data)->name);
			$userId = json_decode($data)->user_id;

			$mysqli->set_charset("utf8");

		  if ($mysqli->query('UPDATE users SET name="'.$name.'" WHERE user_id="'.$userId.'"')) {
		  	$feedback['info'] 					= mysqli_info($mysqli);
		  	$feedback['action'] 				= 'UPDATE';
		  	$feedback['user_id=>name'] 	= $userId.'=>'.$name;   
			} else {
				$feedback['info'] 					= 'ERROR';
		  	$feedback['action'] 				= 'UPDATE';
		  	$feedback['user_id=>name'] 	= $userId.'=>'.$name;   
			}
		} else if($_POST['type'] === 'item') {
			$data 	= $_POST['data'];
			$userId = json_decode($data)->user_id;
			$itemId = json_decode($data)->id;

		  if ($mysqli->query('UPDATE items SET user_id='.($userId === null ? 'NULL' : '"'.$userId.'"').' WHERE id="'.$itemId.'"')) {
		    $feedback['info'] 						= mysqli_info($mysqli);
		  	$feedback['action'] 					= 'UPDATE';
		  	$feedback['itemId=>user_id'] 	= $itemId.'=>'.($userId === null ? 'NULL' : $userId);
			} else {
				$feedback['info'] 						= 'ERROR';
		  	$feedback['action'] 					= 'UPDATE';
		  	$feedback['itemId=>user_id'] 	= $itemId.'=>'.($userId === null ? 'NULL' : $userId);
			}
		}
		echo '<pre>';
		print_r($feedback);
		echo '</pre>';
		$mysqli->close();
	} else {
		echo 'POST empty value';
	}
?>
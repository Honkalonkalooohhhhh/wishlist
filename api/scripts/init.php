<?php
  
?>
<?php
  $config = array(
    'servername' => 'localhost',
    'username' => 'root',
    'password' => '',
    'dbname' => 'ka_babylist'
  );
  
  if(isset($_COOKIE['bl_user_id'])){
    $user_id = $_COOKIE['bl_user_id'];
  } else {
    $user_id = gen_uuid();
    setcookie(
      'bl_user_id',
      $user_id,
      time() + (10 * 365 * 24 * 60 * 60)
    );
    add_user($config, $user_id);
  }

  function add_user ($config, $userId) {
    $mysqli = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);
    if ($mysqli->connect_error) {
        die('Connection failed: ' . $mysqli->connect_error);
    }

    $sql = 'INSERT INTO users (user_id) VALUES ("'.$userId.'")';
    if($mysqli->query($sql)){
      echo '<script>console.log("'.$mysqli->affected_rows.' Row inserted.");</script>';
    } else {
      echo '<script>console.log("ERROR insertion failed");</script>';
    }
    $mysqli->close();
  }

  function get_items_data($config) {
    $mysqli = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);
    if ($mysqli->connect_error) {
        die('Connection failed: ' . $mysqli->connect_error);
    }
    
    $sql = 'SELECT id, name, category, user_id FROM items';
    $result = $mysqli->query($sql);
    
    $items = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $category = utf8_encode($row['category']);
          $item = array('id' => $row['id'], 'name' => utf8_encode($row['name']), 'user_id' => $row['user_id']);
          if(!array_key_exists ( $category , $items )){
            $items[$category]  = array();         
          }
          array_push($items[$category], $item);
        }
    }
    $mysqli->close();

    return $items;
  }

  function get_user_name($config, $userId) {
    $conn = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    } 

    $sql = 'SELECT name FROM users WHERE user_id="'.$userId.'"';

  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $name = utf8_encode($row['name']);

  $conn->close();
  
  return $name;
}

function gen_uuid() {
  return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    // 32 bits for "time_low"
    mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

    // 16 bits for "time_mid"
    mt_rand( 0, 0xffff ),

    // 16 bits for "time_hi_and_version",
    // four most significant bits holds version number 4
    mt_rand( 0, 0x0fff ) | 0x4000,

    // 16 bits, 8 bits for "clk_seq_hi_res",
    // 8 bits for "clk_seq_low",
    // two most significant bits holds zero and one for variant DCE1.1
    mt_rand( 0, 0x3fff ) | 0x8000,

    // 48 bits for "node"
    mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
  );
}
?>

<script type="text/javascript">
    var itemsData = <?php echo json_encode(get_items_data($config)); ?>;
    var userId = '<?php echo $user_id; ?>';
    var userName = '<?php echo get_user_name( $config, $user_id ); ?>';
</script>
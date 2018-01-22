<?php
/**
 * Created by PhpStorm.
 * User: Tarip
 * Date: 20.01.2018
 * Time: 17:03
 */

class Database{

    // specify your own database credentials
    private $host = "localhost";
    private $db_name = "ka_babylist";
    private $username = "root";
    private $password = "";
    public $conn;

    // get the database connection
    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
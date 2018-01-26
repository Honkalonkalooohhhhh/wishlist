<?php
class Category{

    // database connection and table name
    private $conn;
    private $table_name = "categories";

    // object properties
    public $id;
    public $name;

    public function __construct($db){
        $this->conn = $db;
    }

    public function read(){

        //select all data
        $query = "SELECT
                id, name
            FROM
                " . $this->table_name . "
            ORDER BY
                id";

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();

        return $stmt;
    }

    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                name=:name";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));

        // bind values
        $stmt->bindParam(":name", $this->name);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;

    }
}
?>
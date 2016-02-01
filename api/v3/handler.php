<?php
  class Handler {
    static function log(){
      $data = Flight::request()->data;
      $sql = "SELECT * FROM users WHERE LOWER(name) LIKE LOWER(?) AND password LIKE(?)";
      $sth = Flight::db()->prepare($sql);
      $sth->bindParam(1,$data["username"]);
      $sth->bindParam(2,hash("sha256",$data["password"]));
      $sth->execute();
      $res = $sth->fetchAll();
      if(count($res) !== 1){Flight::error();return;}
      echo Flight::json(JWTHelper::generate(60*60,$data));
    }

    static function reg(){
      $data = Flight::request()->data;
      $sql = "SELECT * FROM users WHERE LOWER(name) LIKE LOWER(?)";
      $sth = Flight::db()->prepare($sql);
      $sth->bindParam(1,$data["username"]);
      $sth->execute();
      $res = $sth->fetchAll();
      if(count($res) !== 0){Flight::error();return;}
      $sql = "INSERT INTO users(name,password) VALUES(?,?)";
      $sth = Flight::db()->prepare($sql);
      $sth->bindParam(1,$data["username"]);
      $sth->bindParam(2,hash("sha256",$data["password"]));
      $sth->execute();
      echo Flight::json(JWTHelper::generate(60*60,$data));
    }

    static function snippets(){
      $sth = Flight::db()->prepare("SELECT identifier,name,author,version FROM snippets");
      $sth->execute();
      $res = $sth->fetchAll(PDO::FETCH_ASSOC);
      echo Flight::json($res);
    }

    static function snippet(){
      $data = Flight::request()->data;

      $mode = $data["mode"];

      if($mode==="get"){
        $sql = "SELECT * FROM snippets WHERE LOWER(identifier) LIKE LOWER(?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->execute();
        $res = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(count($res) == 0) {Flight::error();}
        echo Flight::json($res[0]);
      }elseif($mode==="exists"){
        $sql = "SELECT * FROM snippets WHERE LOWER(identifier) LIKE LOWER(?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->execute();
        $res = $sth->fetchAll(PDO::FETCH_ASSOC);
        if(count($res) !== 0){
          Flight::error();
        }else{
          echo "";
        }
      }elseif($mode==="new"){
        $sql = "SELECT * FROM snippets WHERE LOWER(identifier) LIKE LOWER(?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->execute();
        $res = $sth->fetchAll();
        if(count($res) !== 0){
          Flight::error();
        }
        $jwt = JWTHelper::authenticate(apache_request_headers());
        $sql = "INSERT INTO snippets(identifier,name,author,version,code) VALUES(?,?,?,?,?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->bindParam(2,$data["name"]);
        $sth->bindParam(3,$jwt->data->userName);
        $sth->bindParam(4,$data["version"]);
        $sth->bindParam(5,$data["code"]);
        $sth->execute();
      }elseif($mode==="delete"){
        $sql = "SELECT * FROM snippets WHERE LOWER(identfier) LIKE LOWER(?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->execute();
        $res = $sth->fetchAll();
        if(count($res) !== 1){
          Flight::error();
        }
        $jwt = JWTHelper::authenticate(apache_request_headers());
        $sql = "DELETE FROM snippets WHERE LOWER(identifier) LIKE LOWER(?)";
        $sth = Flight::db()->prepare($sql);
        $sth->bindParam(1,$data["identifier"]);
        $sth->execute();
      }
    }

    static function validate(){
      $valid = JWTHelper::authenticate(apache_request_headers());
      if($valid){
        echo "Yep.";
      }else{
        Flight::error();
      }
    }
  }
?>

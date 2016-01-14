<?php
  require 'flight/Flight.php';
  require "config.php";
  require "handler.php";

  include 'jwt/BeforeValidException.php';
	include 'jwt/ExpiredException.php';
	include 'jwt/SignatureInvalidException.php';
	include 'jwt/JWT.php';
	include "jwt/jwthelper.php";


  Flight::route('/', function(){
      echo Flight::get("dbname");
  });

  Flight::route("POST /user/register", array("Handler","reg"));
  Flight::route("POST /user/login", array("Handler","log"));
  Flight::route("POST /snippets", array("Handler","snippets"));
  Flight::route("POST /snippet", array("Handler","snippet"));
  Flight::route("POST /key/valid",array("Handler","validate"));

  Flight::register("db","PDO", array("mysql:host=".Flight::get("dbhost").";dbname=".Flight::get("dbname").";charset=utf8;",Flight::get("dbuser"),Flight::get("dbpass")));

  Flight::map("error",function($err = "error"){
    Flight::halt(404,$err);
    Flight::stop();
  });

  Flight::start();
?>

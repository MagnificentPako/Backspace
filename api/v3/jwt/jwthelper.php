<?php
  class JWTHelper {
    static function generate($expires,$user){
      $tokenId = base64_encode(mcrypt_create_iv(32));
      $issuedAt = time();
      $notBefore = $issuedAt;
      $expire = $notBefore + $expires;
      $serverName = Flight::get("servername");

      $data = [
        "iat" => $issuedAt,
        "jti" => $tokenId,
        "iss" => $serverName,
        "nbf" => $notBefore,
        "exp" => $expire,
        "data" => [
            "userName" => $user["username"]
        ]
      ];

      $secretKey = base64_decode(Flight::get("jwtkey"));

      $jwt = Firebase\JWT\JWT::encode(
        $data,
        $secretKey,
        "HS512"
        );
      $unencoded = ["jwt" => $jwt];
      return $unencoded;
    }

    static function authenticate($headers){
      $jwt = "";
      foreach($headers as $header=>$value){
          if($header=="Authorization"){
            $head = explode(" ",$value);
            if(count($head) == 2){
              if($head[0] == "Bearer"){
                $jwt = $head[1];
              }
            }
          }
      }

      if($jwt == ""){
        return false;
      }

      try{
        $secretKey = base64_decode(Flight::get("jwtkey"));
        $token = Firebase\JWT\JWT::decode($jwt,$secretKey,array("HS512"));
        return $token;
      }catch (Exception $e){
        return false;
      }
    }
  }
?>

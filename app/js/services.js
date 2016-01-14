var services = angular.module("testServices",[]);

services.factory("Auth",function($http,toaster,$location){
  var obj = {};
  obj.jwt = "";
  obj.username = "";
  var baseurl = "api/v3/";

  obj.login = function(name,password) {
    var pass = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
    toaster.pop("wait","","Logging in as "+name+"...");
    obj.sendNormal("user/login",{"username":name,"password":pass},
    function successCallback(response){
      obj.jwt = response.data.jwt;
      toaster.pop("success","","Login successful!");
      obj.username = name;
      $location.path("/");
    },function errorCallback(response){
      toaster.pop("error","","Oops! Something went wrong!");
      obj.logout();
    });
  }

  obj.register = function(name,password){
    toaster.pop("wait","","Registering as "+name+"...");
    obj.sendNormal("user/register",{"username":name,"password":CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex)},
    function success(response){
      obj.jwt = response.data.jwt;
      toaster.pop("success","","Registered successful!");
      obj.username = name;
      $location.path("/");
    },function error(response){
      toaster.pop("error","","Oops! Something went wrong!");
      obj.logout();
    });
  }

  obj.hasJWT = function() {
    return obj.jwt != "";
  }

  obj.getJWT = function() {
    return obj.jwt;
  }

  obj.logout = function() {
    obj.jwt = "";
    obj.username = "";
  }

  obj.getUsername = function() {
    return obj.username;
  }

  obj.sendSecured = function(url,data,success,error){
    if(!obj.hasJWT()){toaster.pop("error","","Not logged in!"); return;}
    var dat = data || {};
    var conf = {};
    conf.headers = {"Authorization": "Bearer "+obj.getJWT()};
    $http.post(baseurl+url,dat,conf).then(function(response){success(response);},function(response){error(response);obj.logout();});
  }

  obj.sendNormal = function(url,data,success,error){
    var dat = data || {};
    $http.post(baseurl+url,dat).then(success,error);
  }

  return obj;
});

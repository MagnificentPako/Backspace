var controllers = angular.module("testControllers",["toaster","ngAnimate"]);

controllers.controller("SnippetListCtrl",function($scope,$http, Auth, $location){

  $scope.snippets = {};

  $scope.Auth = Auth;
  $scope.context = {};

  $scope.loadSnippets = function(){
    Auth.sendNormal("snippets",{},function successCallback(response){
      $scope.snippets = response.data;
    },function errorCallback(response){
      return [];
    });
  };

  $scope.openSnippet = function(snip){
    $location.path("/snippet/"+snip);
  }

  $scope.newSnippet = function(){
    $location.path("/new");
  }

});

controllers.controller("LoginCtrl",function($scope,toaster,$http,Auth){
  $scope.submit = function(){
    Auth.login($scope.username,$scope.password);
    return;
  }
});

controllers.controller("RegisterCtrl", function($scope,toaster, $http, Auth){
  $scope.submit = function(){
    Auth.register($scope.username,$scope.password);
    return;
  }
});

controllers.controller("NavCtrl", function($scope,Auth, $location){
  $scope.Auth = Auth;
  $scope.logout = function() {
    $location.path("/");
    Auth.logout();
  };
});

controllers.controller("SnippetViewCtrl", function($scope,Auth,$location,$routeParams,toaster){
  $scope.Auth = Auth;
  Auth.sendNormal("snippet",{"identifier":$routeParams["identifier"],"mode":"get"},function(response){
    $scope.snippet = response.data;
    $scope.delete = function(identifier){
      toaster.pop("wait","","deleting...");
      Auth.sendSecured("snippet",{"identifier":$routeParams["identifier"],"mode":"delete"},function(response){toaster.pop("success","","Deleted.")},function(response){toaster.pop("error","","Something went wrong!")});
    }
  },function(response){
    alert(response.data);
    toaster.pop("warning","","Snippet not found!");
    $location.path("/snippets");
  });
});

controllers.controller("NewCtrl", function($scope,$location,Auth,toaster){

  $scope.new = function() {
    toaster.pop("wait","","Creating snippet...");
    Auth.sendSecured("snippet",{"identifier":$scope.identifier,"mode":"exists"},function(response){
      Auth.sendSecured("snippet",{"identifier":$scope.identifier,"name":$scope.name,"version":$scope.version,"code":$scope.code,"mode":"new"},function(res){
        $location.path("/snippet/"+$scope.identifier);
      }, function(res){
        toaster.pop("error","","Something went wrong! You didn't try to exploit something, did you?");
      });
    },function(response){
      toaster.pop("error","","Seems like that identifier already exists.");
      $location.path("/login");
    });
  }

});

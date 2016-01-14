var app = angular.module('testApp', ["ngAnimate","ngRoute","testControllers","testServices","testDirectives"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "app/views/index.html"})
    .when("/snippets",{templateUrl: "app/views/snippets.html"})
    .when("/search",{templateUrl: "app/views/search.html"})
    .when("/login",{templateUrl: "app/views/login.html"})
    .when("/snippet/:identifier",{templateUrl: "app/views/snippet.html", controller: "SnippetViewCtrl"})
    .when("/new",{templateUrl: "app/views/new.html", restricted:true})
    .otherwise({redirectTo: "/"});
});


app.filter("name",function(Auth) {
  return function(input,search){
    if(!input) return input;
    if(!search) return input;
    var expected = (''+search).toLowerCase();
    var results = {};
    var added = false;
    angular.forEach(input, function(value,key){
      if((''+value.name).toLowerCase().indexOf(expected) !== -1){
        results[key] = value;
      }
    });
    return results;
  };
});

app.filter("author",function() {
  return function(input,search){
    if(!input) return input;
    if(!search) return input;
    var expected = (''+search).toLowerCase();
    var results = {};
    var added = false;
    angular.forEach(input, function(value,key){
      if((''+value.author).toLowerCase().indexOf(expected) !== -1){
        results[key] = value;
      }
    });
    return results;
  };
});

app.run(function($rootScope,$location,Auth,toaster){
  $rootScope.$on("$routeChangeStart", function(event,next){
    if(next.restricted){
      if(!Auth.hasJWT()){
        $rootScope.savedLocation  = $location.url();
        $location.path("/login");
      }
    }
  });
});

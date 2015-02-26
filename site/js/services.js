hackServices = angular.module("hackServices",["angular-jwt","ngResource"])
       .factory("JWToken", function($window,$rootScope,jwtHelper){
        
        token = {}
        token.set = function (authToken) {$window.sessionStorage.token = authToken};
        token.get = function () {return $window.sessionStorage.token};
        token.exists = function () {return (this.get() != undefined)};
        token.deleteToken = function () {delete $window.sessionStorage.token};
        token.claims = function() { return jwtHelper.decodeToken(this.get())};
        token.isExpired = function(){ return jwtHelper.isTokenExpired(this.get())};

        return token;
      }).factory("AuthService", function ($http, JWToken){
          var   authService = {};
          authService.login = function (credentials){
                return $http.post('/authenticate', credentials)
                .success(function (data, status, headers, config) {
                 JWToken.set(data.token); 
                })
                .error(function(){
                  // Throw away any existing token on login error
                  JWToken.deleteToken();
                })
          }

          authService.isAdmin = function(){
            if (JWToken.exists()  && JWToken.claims().admin && !JWToken.isExpired()){
              return true;
            }
            else{
              return false;
            }
          }
          return authService;
        }).factory("Resource", function ($resource) {

           return $resource(
               "/api/resources/:_id"
          );
      }).factory("Project", function ($resource,JWToken) {
           if (JWToken.get()){
              headers = {'Authorization':'Bearer ' + JWToken.get()}
           }
           else headers = {};
           return $resource(
               "/api/projects/:_id",{},
                {
                  "save": {method:"POST", headers: headers},
                  "remove": {method:"DELETE", headers: headers},
                  "update": {method:"PUT", headers: headers}
                }
          );
      }).factory("DataSet", function ($resource) {
           return $resource(
               "/api/datasets/:_id"
          );
      }).factory("Event", function ($resource) {
          return $resource(
            "http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Code-For-Nova&desc=false&offset=0&photo-host=public&format=json&page=20&fields=&sig_id=11545665&sig=40fe4c201e2189b4c7be742fd6e221fd30c8ba43",
             {callback:"JSON_CALLBACK"}, {"query": {method:"jsonp"}}
             );
        }).service("loginModal", function ($modal){
            //This provides the modal popup used for login.


            return function() {
              var instance = $modal.open({
                templateUrl: '/static/partials/login.html',
                controller: 'LoginCtrl',
              })

              return instance.result;
            };
          });





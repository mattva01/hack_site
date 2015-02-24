var hackControllers = angular.module('hackControllers', ["hackServices"]).controller('ResourceCtrl', function ($scope, $http, Resource) {
  $scope.resources = Resource.query();
  $scope.addResource = function () {
  	var newResource = new Resource({name: $scope.newresource.name, description: $scope.newresource.description, link: $scope.newresource.link })
  	newResource.$save();
  	$scope.resources.push(newResource)
  	
  };

  $scope.deleteResource = function (id, item) {
  	Resource.remove({_id: id});
  	$scope.resources.splice(item,1);
  };

}).controller('ProjectCtrl', function ($scope, $http, Project) {
  $scope.projects = Project.query();
  var seperateTags = function(tagObjarray){
    return tagObjarray.map(function(tag){
      return tag['text'];
    });
  }
  $scope.addProject = function () {

  	var newProject = new Project({name: $scope.newproject.name, description: $scope.newproject.description, github_url: $scope.newproject.github_url, production_url: $scope.newproject.production_url, demo_url: $scope.newproject.demo_url, help_text: $scope.newproject.help_text, tags: seperateTags($scope.newproject.tags) })
  	newProject.$save();
  	$scope.projects.push(newProject)
  	
  };

  $scope.deleteProject = function (id, item) {
  	Project.remove({_id: id});
  	$scope.projects.splice(item,1);
  };

}).controller('EventCtrl', function ($scope,$http, Event){
  $scope.events = Event.query();
}).controller('LoginCtrl', function ($scope, $http, $window, $location) {
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        console.log("YAY!")
        $window.sessionStorage.token = data.token;
        $location.path("/");
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
});

function HeaderCtrl($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
        //return true;
    };
}


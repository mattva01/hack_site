var hackApp = angular.module('hackApp', [
  'ui.router',
  'hackControllers',
  'hackServices',
  'hackDirectives'
]);
 


hackApp.config(['$stateProvider','$urlRouterProvider','$locationProvider','$urlMatcherFactoryProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider,$urlMatcherFactoryProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
    $urlMatcherFactoryProvider.strictMode(false)
    $stateProvider.
    state('app',{
        abstract:true,
        views: {
            
            'main': {
                templateUrl: '/static/partials/app.html' 
            },
            'header@app': {
                templateUrl: '/static/partials/header.html' 
            },
            'footer@app': {
                templateUrl: '/static/partials/footer.html' 
            }

        }
    }).
      state('homepage', {
        url: '/',
        views: {
          'main': {
            templateUrl: '/static/partials/home.html',
          }
        }
      }).
      state('app.login', {
        url: '/login',   
        views: {
            'content': {
                templateUrl: '/static/partials/login.html',
                controller: 'LoginCtrl'
            }
        }
      }).
      state('app.aboutus', {
        url: '/aboutus',
        views: {
            'content': {
                templateUrl: '/static/partials/aboutus.html' 
            }
        }
      }).
      state('app.events', {
        url: '/events',
        views: {
            'content': {
                templateUrl: '/static/partials/events.html',
                controller: 'EventCtrl', 
            }
        }
      }).
      state('app.resources', {
        url: '/resources',
        views: {
            'content': {
                templateUrl: '/static/partials/resources.html',
                controller: 'ResourceCtrl'
        }
      }
        
      }).
      state('app.adminresources', {
        url: '/admin/resources',
        views: {
            'content': {
                templateUrl: '/static/partials/resources_admin.html',
                controller: 'ResourceCtrl'
        }
      },
        resolve: {loginRequired:loginRequired}
      }).
       state('app.adminprojects', {
        url: '/admin/projects',
        views: {
            'content': {
                templateUrl: '/static/partials/projects_admin.html',
                controller: 'ProjectCtrl',
        }
      },
        
        resolve: {loginRequired:loginRequired}
      }).
       state('app.projects', {
        url: '/projects',
        views: {
            'content': {
                templateUrl: '/static/partials/projects.html',
                controller: 'ProjectCtrl' 
            }
          }
      })
  }]);

var loginRequired = function($location,$q,JWToken){
  var deferred = $q.defer();
  if (!JWToken.get()|| !JWToken.claims().admin ||  JWToken.isExpired()){
    deferred.reject()
    $location.path('/login/');
  }
  else{
      deferred.resolve();
  }
    return deferred.promise;
  }


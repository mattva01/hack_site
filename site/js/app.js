var hackApp = angular.module('hackApp', [
  'ui.router',
  'ngTagsInput',
  'ui.bootstrap',
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
      state('app.admin',{
        abstract:true,
        data: {
          requireLogin: true // this property will apply to all children of 'app'
        }
      }).
      state('app.admin.resources', {
        url: '^/admin/resources',
        views: {
            'content@app': {
                templateUrl: '/static/partials/resources_admin.html',
                controller: 'ResourceCtrl'
        }
      }
      }).
       state('app.admin.projects', {
        url: '^/admin/projects',
        views: {
            'content@app': {
                templateUrl: '/static/partials/projects_admin.html',
                controller: 'ProjectCtrl',
        }
      }        
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

app.run(function ($rootScope,loginModal,$state, AuthService) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams,fromState,fromParams) {
    if (toState.data)
      var requireLogin = toState.data.requireLogin;
    if (requireLogin && !AuthService.isAdmin()) {
      event.preventDefault();
       loginModal()
        .then(function () {
          return $state.go(toState.name, toParams);
        })
        .catch(function (e) {
          if (fromState.name != ""){
            return $state.go(fromState.name,fromParams);
          }
          else{
            return $state.go('homepage');
          }
        });
    }
  });

});


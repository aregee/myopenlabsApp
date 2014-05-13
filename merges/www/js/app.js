// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'openlabs.angular-nereid-auth', 'highcharts-ng'])

.run(function ($ionicPlatform, nereidAuth, $rootScope, $location, CONFIG) {
  nereidAuth.setapiBasePath(CONFIG.baseURL);
  nereidAuth.refreshUserInfo();
  $rootScope.$on('$routeChangeStart', 
    function (event, current) {
      $rootScope.currentPage = current;
      if(!current.publicAccess && !nereidAuth.isLoggedIn()) {
        $location.path('/main');
      }
    }
  );
  $rootScope.$on('nereid-auth:loginRequired', function () {
      nereidAuth.logoutUser();
  });
  $rootScope.$on('nereid-auth:logout', function () {
      $location.path('/main');
  });
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.constant('CONFIG', {
    'baseURL': 'https://my.openlabs.co.in',
     makeURL: function (url) {
      return this.baseURL + url;
    }
  })
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';


  $stateProvider

    .state('main', {
      url:'/main',
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('app.projects', {
      url: "/projects",
      views: {
        'menuContent' :{
          templateUrl: "templates/projects.html",
          controller: 'ProjectsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/projects/:projectId",
      views: {
        'menuContent' :{
          templateUrl: "templates/project.html",
          controller: 'ProjectCtrl'
        }
      }
    })
    
    .state('app.tasks', {
      url: "/tasks",
      views: {
        'menuContent' :{
          templateUrl: "templates/tasks.html",
          controller: 'TasksCtrl'
        }
      }
    })

    .state('app.stats', {
      url: '/stats',
      views: {
        'menuContent': {
          templateUrl: 'templates/stats.html',
          controller: 'StatsCtrl',
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/settings');
});


'use strict';

angular.module('NereidProjectApp', ['ionic', 'NereidProjectApp.controllers', 'NereidProjectApp.services', 'openlabs.angular-nereid-auth','highcharts-ng'])

.run(function ($ionicPlatform, nereidAuth, $rootScope, $location, CONFIG) {
  nereidAuth.setapiBasePath(CONFIG.baseURL);
  nereidAuth.refreshUserInfo();
  $rootScope.$on('$routeChangeStart', 
    function (event, current) {
      $rootScope.currentPage = current;
      if(!current.publicAccess && !nereidAuth.isLoggedIn()) {
        $location.path('/tab/login');
      }
    }
  );
  $rootScope.$on('nereid-auth:loginRequired', function () {
      nereidAuth.logoutUser();
  });
  $rootScope.$on('nereid-auth:logout', function () {
      $location.path('/tab/login');
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
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl',
        }
      }
    })

    .state('tab.stats', {
      url: '/stats',
      views: {
        'tab-stats': {
          templateUrl: 'templates/tab-detail.html',
          controller: 'StatsCtrl',
        }
      }
    })

   .state('tab.tasks', {
      url: '/tasks',
      views: {
        'tab-tasks': {
          templateUrl: 'templates/tab-tasks.html',
          controller: 'TaskCtrl'
        }
      }
    })

    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'LoginCtrl',
          publicAccess: true
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});


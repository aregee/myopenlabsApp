angular.module('NereidProjectApp.controllers', [])
.controller('DashCtrl', function($scope, $state, nereidAuth, Projects, Stream, $ionicModal) {
  Projects.get()
    .success(function(result, status) {
      $scope.projects = result.items;
    });
  $scope.showStream = false;
  $scope.fetch = function (uri, page) {
    Stream.get(uri, page)
      .success(function (result, status) {
        $scope.details = result.items;
        $scope.showStream = true;
      });
  };
  $scope.activityState = false;
  $scope.viewState = function (data) {
      $scope.activity = data;
      $scope.activityState = true
  };
  $scope.openModal = function(data) {  
    $scope.activity = data;        
    $scope.modalCtrl.show();
  };
    
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modalCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-right-left'//'slide-left-right', 'slide-in-up', 'slide-right-left'
  });
})
.controller('ModalCtrl', function($scope) {
        $scope.hideModal = function() {
          $scope.modalCtrl.hide();
        };
        $scope.applyModal = function() {
          $scope.modalCtrl.remove();
        };
})
.controller('StatsCtrl', function($scope, Stats) {
    $scope.performers = [];
    $scope.performerNames = []
    $scope.topUsers = [];
    $scope.topUserNames = [];
    Stats.get()
      .success(function (data,status) {
        var statsData = data;
        angular.forEach(statsData.top_time_reporters, function(elm) {
          $scope.performers.push(elm[2]);
          $scope.performerNames.push(elm[1]);
        });
        angular.forEach(statsData.top_commentors, function(elm) {
          $scope.topUsers.push(elm[0]);
          $scope.topUserNames.push(elm[1]);
        });
      });
    $scope.viewPerformer = true;

    $scope.toggleGraph = function () {
      if($scope.viewPerformer === true) {
        $scope.viewPerformer = false;
      }
      else {
        $scope.viewPerformer = true;
      }
    };
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{ 
            data: $scope.performers
        }],
        title: {
            text: 'Top Performers'
        },

        loading: false,
        xAxis: {
              currentMin: 0,
              currentMax: 5,
              categories: $scope.performerNames
             },
    }
    $scope.chartConfig2 = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{ 
            data: $scope.topUsers
        }],
        title: {
            text: 'Top Users'
        },

        loading: false,
        xAxis: {
              currentMin: 0,
              currentMax: 5,
              categories: $scope.topUserNames
             },
    }

})
.controller('TaskCtrl', function($scope, Tasks, $state, $ionicModal) {
  console.log($scope.$parent);
  $scope.fetch= function() {
    param = { 'state': 'opened'};
    Tasks.get(param)
    .success(function(data, status) {
      $scope.tasks = data.items;
     });
  };

  $scope.showTask = false;
  $scope.toggleView = function () {
      if($scope.showTask === true) {
        $scope.showTask = false;
      }
      else {
        $scope.showTask = true;
      }
  };
  $scope.fetchTask = function() {
    var urlString = '/project-'+ arguments[0] + '/task-' + arguments[1]
    Tasks.getTask(urlString)
      .success(function (data) {
        $scope.task = data;
        $scope.toggleView();      
    });
  };
  $scope.openModal = function() {  
    $scope.modalCtrl.show();
  };
    
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modalCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-right-left' //'slide-left-right', 'slide-in-up', 'slide-right-left'
  });
})
.controller('ModalCtrl', function($scope, Tasks, Projects, nereidAuth) {
      Projects.get()
        .success(function(data){
          $scope.projects = data.items;
        });
        $scope.taskFormModel = {};
        $scope.userInfo = nereidAuth.user();
        $scope.submitForm = function () {
          $scope.taskFormModel.assign_to = $scope.userInfo.id;
          Tasks.postTask($scope.taskFormModel.project, $scope.taskFormModel)
            .success(function(data){
              $scope.taskFormModel = {};
              $scope.applyModal();
            })
            .error(function(reason, status) {
              $scope.hideModal();
            });
        };
        $scope.hideModal = function() {
          $scope.modalCtrl.hide();
        };
        $scope.applyModal = function() {
          $scope.modalCtrl.remove();
        };
})
.controller('LoginCtrl', ['$scope', 'nereidAuth', '$location',
    function($scope, nereidAuth, $location) {

      if (nereidAuth.isLoggedIn()) {
      	  $scope.isLogged = true;
          nereidAuth.refreshUserInfo();
          $scope.userInfo = nereidAuth.user();
      }

      $scope.user = {
        email: '',
        password: ''
      };

      $scope.message = '';

      // For form to show error classes
      $scope.badCredentials = false;

      // Login success should initially be false
      $scope.loginSuccess = false;

      $scope.logout = function() {
        nereidAuth.logoutUser();
      };

      $scope.submit = function() {
        nereidAuth.login($scope.user.email, $scope.user.password)
          .success(function(data){
            $scope.badCredentials = false;
            $scope.loginSuccess = true;
            if (data.message) {
              $scope.message = data.message;
            } else {
              $scope.message = 'Login Succesful';
            }
            $scope.isLogged = true;
            $location.path('/tab/dash');
          })
          .error(function(data, status){
            $scope.loginSuccess = false;
            if (status === 404) {
              // 404 indicates that the URL could not be reached. Perhaps the
              // credentials are correct, but could not connect to the server ?
              $scope.message = 'Could not connect to the server';
              $scope.badCredentials = false;
              return;
            }
            $scope.badCredentials = true;
            if (data.message) {
              $scope.message = data.message;
            } else {
              $scope.message = 'Login Failed';
            }
          });
      };
    }
  ]);
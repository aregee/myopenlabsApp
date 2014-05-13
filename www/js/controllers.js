angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, Projects) {
	Projects.get()
  	.success(function(data, status) {
  		$scope.projects = data.items;
  	})
  	.error(function(reason) {
  		console.log(reason.message);
  	});
})
.controller('SettingsCtrl', function($scope, nereidAuth) {
	$scope.userInfo = nereidAuth.user;	
})
.controller('ProjectsCtrl', function($scope, Projects) {
  Projects.get()
  	.success(function(data, status) {
  		$scope.projects = data.items;
  	})
  	.error(function(reason) {
  		console.log(reason.message);
  	});
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
.controller('ProjectCtrl', function($scope, $stateParams , Project, Stream, nereidAuth, Tasks) {
	$scope.userInfo = nereidAuth.user();
  $scope.showTask = false;
	$scope.fetchProject = function () {
		Project.get($stateParams.projectId)
		 .success(function(data, status) {
		  	$scope.project = data;
		 })
		 .error(function(reason, status){
			console.log(reason.message);
		 });
	};
  //$scope.fetchProject();
	$scope.fetchStream = function (projectUrl) {
		Stream.get(projectUrl)
			.success(function (data, status) {
				$scope.activityFeed = data.items;
			})
			.finally(function() {
				$scope.$broadcast('scroll.refreshComplete');	
			});
	};
	$scope.fetchTasks = function (projectUrl) {
		Project.getTaskList(projectUrl)
			.success(function (data) {
				$scope.tasks = data.items;	
			});
	};

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
})
.controller('TasksCtrl', function($scope, Tasks, $state, $ionicModal) {
  $scope.fetch= function() {
    param = { 'state': 'opened'};
    Tasks.get(param)
    .success(function(data, status) {
      $scope.tasks = data.items;
     })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');  
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
      $scope.userInfo = nereidAuth.user;
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
            $location.path('/app/projects');
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
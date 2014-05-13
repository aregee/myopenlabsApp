angular.module('NereidProjectApp.services', [])
.factory('Projects', function($http, CONFIG) {
  var get = function () {
    return $http.get(CONFIG.makeURL('/projects'));
  };
  return {
    get: get,
  };
})
.factory('Stream', function($http, CONFIG) {
  var get = function (projectUrl, page) {
    return $http.get(CONFIG.makeURL(projectUrl +'/stream?page='+page));
  };
  return {
    get: get,
  };
})
.factory('Stats', function($http, CONFIG) {
  var get = function () {
    return $http.get(CONFIG.makeURL('/project/stats'));
  };
  return {
    get: get,
  };
})
.factory('Tasks', function($http, CONFIG) {
  var get = function(state) {
    return $http.get(CONFIG.makeURL('/my-tasks'), {params: state});
  };
  var getTask = function(urlString) {
    return $http.get(CONFIG.makeURL(urlString));
  };
  var postTask = function(projectId, data) {
    return $http.post(CONFIG.makeURL('/project-'+projectId+'/task/-new'), data);
  };
  return {
    get: get,
    getTask: getTask,
    postTask: postTask,
  };
});

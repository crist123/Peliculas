//Interceptor para el icono de loading
//http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux/
angular.module('peliculasApp').constant('_START_REQUEST_', '_START_REQUEST_');
angular.module('peliculasApp').constant('_END_REQUEST_', '_END_REQUEST_');

angular.module('peliculasApp').factory('myHttpInterceptor', ["$q", '_START_REQUEST_', '_END_REQUEST_', "$rootScope", "$injector", function ($q, _START_REQUEST_, _END_REQUEST_, $rootScope, $injector) {
    var rootScope = $rootScope;
    var $http;
    return {
        request: function (promise) {
            promise.headers = {'accept-language': 'es-ES,es;q=0.9'};
            rootScope.$broadcast(_START_REQUEST_);
            return promise;
        },
        response: function (response) {

            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                rootScope.$broadcast(_END_REQUEST_);
            }

            return response;
        },
        responseError: function (response, param1) {
            //if ($("#errorLabel")) {

            if (response.data) {

            }
            else {
              
            }
           
            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                rootScope.$broadcast(_END_REQUEST_);
            }
            return $q.reject(response);
        }
    };
}]);

angular.module('peliculasApp').config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);
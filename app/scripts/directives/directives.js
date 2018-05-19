angular.module('peliculasApp').directive('loadingWidget', ['_START_REQUEST_', '_END_REQUEST_', function (_START_REQUEST_, _END_REQUEST_) {
    return {
        restrict: "A",
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            scope.$on(_START_REQUEST_, function () {
                // got the request start notification, show the element
                element.show();
            });

            scope.$on(_END_REQUEST_, function () {
                // got the request end notification, hide the element
                element.hide();
            });
        }
    };
}]);
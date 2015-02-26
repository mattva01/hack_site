app = angular.module("hackDirectives",[])


app.directive("technologyContainer", function(){
		return { 
			restrict: "E",
			templateUrl: '/static/partials/projects_page/technology-container.html'
	}
}
);

app.directive("participate", function(){
		return { 
			restrict: "E",
			templateUrl: '/static/partials/projects_page/participate.html'
	}
}
);

app.directive("projectShowcase", function(){
		return { 
			restrict: "E",
			templateUrl: '/static/partials/projects_page/project-showcase.html'
	}
}
);

app.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
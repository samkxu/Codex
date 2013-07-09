var module;

module = angular.module("ace", []);
module.directive("aceEditor", [
  function() {
    var Editor, Renderer;
    Editor = require("ace/editor").Editor;
    Renderer = require("ace/virtual_renderer").VirtualRenderer;
    return {
      restrict: "E",
      require: "ngModel",
      replace: true,
      template: "<div class=\"ace-container\"></div>",
      link: function($scope, $el, attrs, model) {
        var editor, session, updateViewValue;
        editor = new Editor(new Renderer($el[0], "ace/theme/textmate"));
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setPrintMarginColumn(false);
        session = editor.getSession();
        model.$render = function() {
          return session.setValue(model.$modelValue);
        };
        updateViewValue = function() {
          return $scope.$apply(function() {
            return model.$setViewValue(session.getValue());
          });
        };
        session.on("change", updateViewValue);
        return $scope.$on("$destroy", function() {
          return editor.removeListener("change", updateViewValue);
        });
      }
    };
  }
]);

module.controller('MainCtrl', function($scope) {
  return $scope.document;
});

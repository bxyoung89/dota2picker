angular.module('Templates', ['app/features/aboutModal/aboutModal.html', 'app/features/appHeader/appHeader.html', 'app/features/counterPickerPage/counterPickerPage.html', 'app/features/counterPicksList/counterPickList.html', 'app/features/enemyTeam/enemyTeam.html', 'app/features/heroGrid/heroGrid.html']);

angular.module("app/features/aboutModal/aboutModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/aboutModal/aboutModal.html",
    "<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><title></title></head><body></body></html>");
}]);

angular.module("app/features/appHeader/appHeader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/appHeader/appHeader.html",
    "<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><title></title></head><body></body></html>");
}]);

angular.module("app/features/counterPickerPage/counterPickerPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/counterPickerPage/counterPickerPage.html",
    "<div>Hello World!</div>");
}]);

angular.module("app/features/counterPicksList/counterPickList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/counterPicksList/counterPickList.html",
    "<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><title></title></head><body></body></html>");
}]);

angular.module("app/features/enemyTeam/enemyTeam.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/enemyTeam/enemyTeam.html",
    "<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><title></title></head><body></body></html>");
}]);

angular.module("app/features/heroGrid/heroGrid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/features/heroGrid/heroGrid.html",
    "<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><title></title></head><body></body></html>");
}]);

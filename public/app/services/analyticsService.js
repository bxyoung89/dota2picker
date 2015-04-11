angular.module("WalrusPunch").service("analyticsService", ["Angularytics", function(Angularytics){

	function AnalyticsService(){

	}

	AnalyticsService.prototype.trackEvent = function(category, eventName){
		Angularytics.trackEvent(category, eventName);
	};

	return new AnalyticsService();
}]);
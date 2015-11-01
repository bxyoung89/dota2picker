angular.module("WalrusPunch").service("dataSourceService", [
	"$rootScope",
	"DATASOURCE_EVENTS",
	function ($rootScope, DATASOURCE_EVENTS) {

		var currentDataSourceId = "combined";
		var dataSources = [
			//{
			//	name: "Combined",
			//	id: "combined",
			//	advantageFunction: function(hero){
			//		return hero.advantages.combined;
			//	}
			//},
			//{
			//	name: "DotaBuff",
			//	id: "dotabuff",
			//	advantageFunction: function(hero){
			//		return hero.advantages.dotabuff;
			//	}
			//},
			{
				name: "DotaMax",
				id: "dotaMax",
				advantageFunction: function(hero){
					return hero.advantages.dotabuff;
				}
			}
		];
		var currentDataSource = dataSources[0];
		
		function DataSourceService() {
			var previousDataSource = getDataSourceFromLocalStorage();
			currentDataSourceId = previousDataSource;
		}

		DataSourceService.prototype.getDataSources = function(){
			return dataSources;
		};

		DataSourceService.prototype.getCurrentDataSourceId = function(){
			return currentDataSourceId;
		};

		DataSourceService.prototype.changeDataSource = function (dataSourceId) {
			saveDataSourceToLocalStorage(dataSourceId);
			currentDataSourceId = dataSourceId;
			currentDataSource = dataSources.filter(function(dataSource){
				return dataSource.id === dataSourceId;
			})[0];
			$rootScope.$broadcast(DATASOURCE_EVENTS.dataSourceChanged);
		};

		DataSourceService.prototype.getAdvantages = function(hero){
			return currentDataSource.advantageFunction(hero);
		};
		
		function getDataSourceFromLocalStorage(){
			return localStorage.getItem("walrusPunchDataSource") === undefined ? "english" : localStorage.getItem("walrusPunchDataSource");
		}

		function saveDataSourceToLocalStorage(dataSource){
			localStorage.setItem("walrusPunchDataSource", dataSource);
		}


		return new DataSourceService();
	}]);
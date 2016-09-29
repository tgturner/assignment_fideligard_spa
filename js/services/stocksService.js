"use strict";
app.factory('StocksService', ['$http', 'dateService', '_', function($http, dateService, _){

	var _stocks = {};
	var stub = {};
  var _dates = {};
  var _dateCollection = [];
  var _stockDates = {};

	var _populateStock = function(){
		return $http({
			url: 'AAPL.json',
			method: "GET"
		})
		.then(function(response){
			response.data.query.results.quote.forEach(function(stock) {
        _buildStockObject(stock);
        _buildDatesArr(stock);
        _buildStockDates(stock);
      });
      var sortedDates = Object.keys(_dates).sort(function(a,b) {
        var aDate = new Date(a);
        var bDate = new Date(b);
        if (aDate > bDate) {
          return 1;
        } else if (aDate < bDate) {
          return -1;
        } else {
          return 0;
        }
      })
      angular.copy(sortedDates, _dateCollection)
      return _stocks;
		});
	};

  var _buildStockObject = function(stock) {
    if (_stocks[stock.Symbol]) {
      _stocks[stock.Symbol][stock.Date] = stock;
    } else {
      _stocks[stock.Symbol] = {};
      _stocks[stock.Symbol][stock.Date] = stock;
    }
  };

  var _buildDatesArr = function(stock) {
    if (_dates[stock.Date]) {
      _dates[stock.Date].push(stock.Symbol);
    } else {
      _dates[stock.Date] = [stock.Symbol];
    }
  };

  var _buildStockDates = function(stock) {
    if (_stockDates[stock.Symbol]) {
      _stockDates[stock.Symbol].unshift(stock.Date);
    } else {
      _stockDates[stock.Symbol] = [stock.Date];
    }
  }

  stub.getDateCollection = function() {
    return _dateCollection;
  };

  stub.sevenDayAverage = function(symbol) {
    var today;
    for (var i = 0; i < _stockDates[symbol].length; i++) {
      if (_stockDates[symbol][i] === _dateCollection[dateService.getDate().index]) {
        today = i;
        break;
      }
    }
    var avgPrice = 0;
    for (var j = today - 6; j <= today; j++ ) {
      avgPrice += Number(_stocks[symbol][_stockDates[symbol][j]].Close);
    }
    return Math.round(avgPrice / 7 * 100) / 100;
  };

  stub.thirtyDayAverage = function(symbol) {
    var today;
    for (var i = 0; i < _stockDates[symbol].length; i++) {
      if (_stockDates[symbol][i] === _dateCollection[dateService.getDate().index]) {
        today = i;
        break;
      }
    }
    var avgPrice = 0;
    for (var j = today - 29; j <= today; j++ ) {
      avgPrice += Number(_stocks[symbol][_stockDates[symbol][j]].Close);
    }
    return Math.round(avgPrice / 30 * 100) / 100;
  };

  stub.currentPrice = function(symbol) {
    return Math.round(_stocks[symbol][_dateCollection[dateService.getDate().index]].Close * 100) / 100;
  };

	stub.all = function(){
		if(!_.isEmpty(_stocks)){
			return _stocks;
		}
		else{
			return _populateStock();
		}
	};

	return stub;
}]);

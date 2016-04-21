(function() {
	"use strict";
	var elem = document.getElementById('app');

	//allows support in < IE9
	function map(func, array) {
		var newArray = new Array(array.length);
		for (var i = 0; i < array.length; i++) {
			newArray[i] = func(array[i]);
		}
		return newArray;
	}

	var $ = Inferno.createVNode;

	function createDatabase(db) {
		var lastSample = db.lastSample;
		var children = [
			$('td').className('dbname').children(db.dbname),
			$('td').className('query-count').children(
				$('span')
					.className(db.lastSample.countClassName)
					.children(db.lastSample.nbQueries)
			)
		];

		for (var i = 0; i < 5; i++) {
			var query = lastSample.topFiveQueries[i];
			children.push($('td').className(query.elapsedClassName).children([
				$('span').children(query.formatElapsed),
				$('div').className('popover left').children([
					$('div').className('popover-content').children(query.query),
					$('div').className('arrow')
				])
			]));
		}

		return $('tr').children(children);
	}

	function createTable(dbs) {
		return $('table')
			.className('table table-striped latest-data')
			.children(
				$('tbody')
					.children(map(createDatabase, dbs))
			);
	}

	var lastNode = null;

	function render() {
		var dbs = ENV.generateData().toArray();
		var nextNode = createTable(dbs);

		if (lastNode === null) {
			lastNode = Inferno.mount(nextNode, elem, null, null);
		} else {
			lastNode = Inferno.patch(lastNode, nextNode, elem, null)
		}
		Monitoring.renderRate.ping();
		setTimeout(render, ENV.timeout);
	}
	render();
})();

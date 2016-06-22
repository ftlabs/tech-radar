/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _toConsumableArray = __webpack_require__(1)['default'];
	
	var _Object$keys = __webpack_require__(39)['default'];
	
	var _Set = __webpack_require__(43)['default'];
	
	var _Promise = __webpack_require__(61)['default'];
	
	var _Array$from = __webpack_require__(2)['default'];
	
	var _getIterator = __webpack_require__(72)['default'];
	
	var _Map = __webpack_require__(75)['default'];
	
	var define = false;
	
	'use strict';
	
	// configProperty: [optionsParameter, type, default value, description, category]
	var qpSchema = {
		filter: ['filter', String, '', 'Some Examples: <ul><li>foo</li><li>biz:baz</li><li>do-able:[3-9]</li><li>state:1|state:3|name:tech</li><li>fina.*times</li></ul>', 'Filter Data'],
		id: ['docUIDs', Array, [], 'Comma seperated list of IDs of spreadsheet documents to load', 'Data Source'],
		sheet: ['sheets', Array, [], 'Comma seperated list of sheets to load from those documents', 'Data Source'],
		json: ['jsonFeeds', Array, [], 'List of JSON documents from which to pull data', 'Data Source'],
		sortcol: ['sortCol', String, 'phase', 'Which column to sort by', 'Data Source'],
		segment: ['segment', String, '', 'Column to use to segment the data, defaults to the source spreadsheet.', 'Data Source'],
		showcol: ['showCol', Array, [], 'Comma seperated list of columns to show', 'Data Source'],
		sortcolorder: ['sortColOrder', Array, [], 'Comma seperated list, order to sort the rings', 'Data Source'],
		sorttype: ['sortType', String, '', '"alphabetical" or "numerical" (without quotes)', 'Data Source'],
		title: ['title', String, '', 'Title to display', 'Display'],
		dashboard: ['dashboard', Boolean, false, 'Whether to hide these settings.', 'Display'],
		showtable: ['showTable', Boolean, true, 'Whether to display the data table', 'Display'],
		scatter: ['scatterInBand', Boolean, true, 'Whether the results should be scattered within the band or placed in the center.', 'Display'],
		tightlabels: ['tightlyBoundLabels', Boolean, false, 'Whether the labels should be allowed to position freely to avoid overlapping', 'Display'],
		linewrap: ['lineWrapLabels', Boolean, true, 'Whether to break the labels across muliple lines.', 'Display'],
		ringcolor: ['ringColor', String, '', 'Colour to use for the ring (try rainbow to make multicolour) <a href="http://www.cssportal.com/css3-color-names/">List of CSS colour names</a>', 'Display'],
		gradient: ['gradientOffset', Number, -0.4, 'How to colour the rings, -1 go darker, 0 no gradient, 1 go lighter', 'Display'],
		crystallisation: ['crystallisation', String, '', 'Make this row the focus of attention.', 'Display'],
		proportionalrings: ['useProportionalRings', Boolean, false, 'Whether to scale rings according to number of items.', 'Display'],
		noderepulsion: ['nodeRepulsion', Number, 3, 'How strongly the nodes repel each other (default, 3)', 'Display'],
		nodeattraction: ['nodeAttraction', Number, 3, 'How strongly the nodes are pulled to the center of the segment (default, 3)', 'Display'],
		quadrant: ['quadrant', ['bottom right', 'bottom left', 'top left', 'top right'], 'bottom right', 'What quadrant of a circle should the graph display as.', 'Display'],
		css: ['customCss', String, '', 'Advanced: Style this page with some custom css.', 'Advanced']
	};
	
	var options = {};
	_Object$keys(qpSchema).forEach(function (key) {
		options[qpSchema[key][0]] = qpSchema[key][2];
	});
	var color = __webpack_require__(79);
	var graph = __webpack_require__(81);
	var tracking = __webpack_require__(82);
	var extend = __webpack_require__(101)._extend;
	var berthaRoot = 'https://bertha.ig.ft.com/';
	var berthaView = 'view/publish/gss/';
	var berthaRepublish = 'republish/publish/gss/';
	var isEqual = __webpack_require__(105);
	var queryString = __webpack_require__(109);
	var sheetTitles = new _Set();
	var titleFromQueryParam = false;
	
	// Handle the mapping of queryParams/sheetConfig to options' properties.
	function parseOptions(config) {
		var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		_Object$keys(config).forEach(function (key) {
	
			// Don't set empty values
			if (config[key] === '') return;
	
			var handle = qpSchema[key];
			if (handle === undefined) return;
	
			// COMPLEX
			var queryStringData = queryString.parse(location.search);
			if (!force && // always overwrite if forcing it (initial load)
			key in queryStringData && // skip if present in query string unless
			(options[handle[0]] === undefined || // the option is empty
			handle[1] === Array && options[handle[0]].length === 0) // or is an empty array
			 !== true) {
				return;
			}
	
			switch (handle[1]) {
				case Array:
					var arr = undefined;
					if (config[key].constructor === Array) {
						arr = config[key];
					} else {
						arr = config[key].split(/, */).filter(function (item) {
							return item !== '';
						});
					}
					options[handle[0]] = arr;
					break;
				case String:
					options[handle[0]] = String(config[key]);
					break;
				case Number:
					options[handle[0]] = Number(config[key]);
					break;
				case Boolean:
					options[handle[0]] = config[key].toLowerCase() !== 'false' && config[key] !== false;
					break;
				default:
					if (handle[1].constructor === Array) {
						options[handle[0]] = handle[1].indexOf(config[key]) !== -1 ? config[key] : handle[2];
					}
					break;
			}
		});
	
		return options;
	}
	
	tracking({ action: 'PageLoad' });
	
	function addScript(url) {
		return new _Promise(function (resolve, reject) {
			var script = document.createElement('script');
			script.setAttribute('src', url);
			document.head.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
		});
	}
	
	function getDocsFromJson(jsons) {
	
		var requests = jsons.map(function (jsonOrigin) {
			return fetch(jsonOrigin).then(function (response) {
				return response.json();
			}).then(function (json) {
				return processJSON(json, {
					UID: jsonOrigin,
					sheet: (jsonOrigin.match(/[^/]+$/) || [0])[0]
				}, jsons.length);
			});
		});
	
		return _Promise.all(requests).then(function (requests) {
	
			if (!titleFromQueryParam) {
				options.title = document.querySelector('.sheet-title').textContent = _Array$from(sheetTitles).join(' & ');
				sheetTitles.clear();
			}
	
			return requests;
		});
	}
	
	function getDocsFromBertha(docs) {
		var republish = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		var requests = docs.map(function (doc) {
			return fetch('' + berthaRoot + (republish ? berthaRepublish : berthaView) + doc.UID + '/' + doc.sheet).then(function (response) {
				return response.json();
			}).then(function (json) {
				return processJSON(json, doc, docs.length);
			});
		});
	
		return _Promise.all(requests).then(function (requests) {
	
			if (!titleFromQueryParam) {
				options.title = document.querySelector('.sheet-title').textContent = _Array$from(sheetTitles).join(' & ');
				sheetTitles.clear();
			}
	
			return requests;
		});
	}
	
	function processJSON(json, doc, numberOfItems) {
	
		// supply some additional information about where the datum came from.
		var i = 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = _getIterator(json), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var datum = _step.value;
	
				datum['hidden-graph-item-source'] = doc.UID + '/' + doc.sheet;
				datum['hidden-graph-item-id'] = (datum.name + '---' + doc.UID + '---' + doc.sheet + '---' + i++).replace(/[^a-z_\-0-9]/ig, '_');
			}
	
			// override options
	
			// only override if it has configuration data
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	
		if (json[0].configvalue === undefined || json[0].name === undefined) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;
	
			try {
	
				for (var _iterator2 = _getIterator(json), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var datum = _step2.value;
	
					datum.sheetTitle = doc.sheet;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
	
			sheetTitles.add(doc.sheet);
	
			return json;
		}
	
		var config = {};
	
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;
	
		try {
			for (var _iterator3 = _getIterator(json), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var datum = _step3.value;
	
				if (datum.configvalue !== null && // It has a config value set
				datum.name !== null) {
	
					if (datum.name === 'sortcol' && numberOfItems > 1 || // local sortcol is invalid if there are multiple documents
					datum.name === 'sheet' || // overriding the sheets or id from a sheet is nonsense
					datum.name === 'id') {
						continue;
					}
	
					config[datum.name] = datum.configvalue;
				}
			}
	
			// Set the options globally
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3['return']) {
					_iterator3['return']();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	
		parseOptions(config);
	
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;
	
		try {
			for (var _iterator4 = _getIterator(json), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var datum = _step4.value;
	
				datum.sheetTitle = config.title || doc.sheet;
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4['return']) {
					_iterator4['return']();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}
	
		sheetTitles.add(config.title || doc.sheet);
	
		return json;
	}
	
	function retrieveSheets(how) {
		var republish = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		// "multipleIDsWithSingleSheet";
		// "singleIDWithMultipleSheets";
		// "oneIDPerSheet";
	
		if (how === 'multipleIDsWithSingleSheet') {
			return getDocsFromBertha(options.docUIDs.map(function (UID) {
				return {
					UID: UID,
					sheet: options.sheets[0]
				};
			}), republish);
		} else if (how === 'singleIDWithMultipleSheets') {
			return getDocsFromBertha(options.sheets.map(function (sheetName) {
				return {
					UID: options.docUIDs[0],
					sheet: sheetName
				};
			}), republish);
		} else if (how === 'oneIDPerSheet') {
			return getDocsFromBertha(options.docUIDs.map(function (UID, idx) {
				return {
					UID: UID,
					sheet: options.sheets[idx]
				};
			}), republish);
		} else if (how === 'json') {
			return getDocsFromJson(options.jsonFeeds);
		}
	}
	
	function decideHowToAct() {
		if (options.jsonFeeds.length) return _Promise.resolve('json');
		if (options.docUIDs.length > options.sheets.length) {
			return _Promise.resolve('multipleIDsWithSingleSheet');
		} else if (options.docUIDs.length === 1 && options.sheets.length) {
			return _Promise.resolve('singleIDWithMultipleSheets');
		} else {
			return _Promise.resolve('oneIDPerSheet');
		}
	}
	
	function toggleCollapsedClass(e) {
		e.currentTarget.classList.toggle('collapsed');
	}
	
	// Process the data
	function process(data) {
	
		if (data[0]) {
			if (data[0][options.sortCol] === undefined) {
				throw Error('No column with the name \'' + options.sortCol + '\'. ' + (options.sortCol === 'phase' ? 'Do you need to set the sortcol parameter?' : 'Did you set the sortcol parameter to the correct column heading?') + '\n Available headings: ' + _Object$keys(data[0]).join(', '));
			}
			if (data[0]['name'] === undefined) {
				throw Error('No column with the name "name". The name column is required to label each data point.');
			}
		} else {
			throw Error('Empty spreasheet from Bertha');
		}
	
		// starting point for colours
		var hue = 0.1;
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;
	
		try {
			for (var _iterator5 = _getIterator(data), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var datum = _step5.value;
	
				if (!datum['hidden-graph-item-hue']) {
					datum['hidden-graph-item-hue'] = 360 * hue;
	
					// Add the golden ratio to get the next colour, gives great distribution.
					hue = (hue + 0.618033988749895) % 1;
				};
	
				// Ensure it is string so we can do analysis
				datum[options.sortCol] = String(datum[options.sortCol]);
	
				// expose additional data;
				datum.longDesc = '';
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;
	
				try {
					for (var _iterator9 = _getIterator(stripDuplicates(['name', options.sortCol].concat(options.showCol))), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var col = _step9.value;
	
						datum.longDesc = datum.longDesc + (col + ': ' + datum[col]) + '\n';
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9['return']) {
							_iterator9['return']();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError5 = true;
			_iteratorError5 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion5 && _iterator5['return']) {
					_iterator5['return']();
				}
			} finally {
				if (_didIteratorError5) {
					throw _iteratorError5;
				}
			}
		}
	
		data = cloneData(data).filter(function (datum) {
			return !!datum[options.sortCol] && !!datum['name'] && (datum['configvalue'] === undefined || datum['configvalue'] === null);
		});
	
		if (!data.length) {
			throw Error('No data from source');
		}
	
		var sortType = 'numerical';
	
		// Default to numerical but if any of the sortcol values
		// are Integers or Alphabetical then treat alphabetical
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;
	
		try {
			for (var _iterator6 = _getIterator(data), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var datum = _step6.value;
	
				if (!datum[options.sortCol].match(/^[0-9]/)) {
					sortType = 'alphabetical';
					break;
				}
			}
		} catch (err) {
			_didIteratorError6 = true;
			_iteratorError6 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion6 && _iterator6['return']) {
					_iterator6['return']();
				}
			} finally {
				if (_didIteratorError6) {
					throw _iteratorError6;
				}
			}
		}
	
		if (options.sortType === 'alphabetical' || options.sortType === 'numerical') {
			sortType = options.sortType;
		}
	
		var labels = [];
		if (sortType === 'numerical') {
	
			data.map(function (datum) {
				return datum['datumValue'] = datum[options.sortCol].match(/^[0-9\.]+/), datum;
			}).filter(function (datum) {
				return datum['datumValue'] !== null;
			})
	
			// Map 1.2.3 to 1.23 to for smarter sorting
			.forEach(function (datum) {
				datum['datumValue'] = Number(datum['datumValue'][0].split('.').reduce(function (p, c, i) {
					return p + (!i ? c + '.' : c);
				}, ''));
			});
		} else if (sortType === 'alphabetical') {
			(function () {
				var phases = new _Set();
				var valueMap = new _Map();
				data.forEach(function (datum) {
					return phases.add(datum[options.sortCol]);
				});
	
				// If we don't have enough values passed to sort the
				// order by, we'll default to ordering the rings alphabetically
				if (options.sortColOrder.length) {
					options.sortColOrder.forEach(function (item, i) {
						return valueMap.set(item, i);
					});
				} else {
	
					// Create a map of 'My String' => 1, 'Mz String' => 2
					[].concat(_toConsumableArray(phases)).sort().forEach(function (d, i) {
						return valueMap.set(d, i);
					});
				}
	
				data.forEach(function (datum) {
					if (!valueMap.has(datum[options.sortCol])) {
						valueMap.set(datum[options.sortCol], valueMap.size);
					}
					datum['datumValue'] = valueMap.get(datum[options.sortCol]) + (options.scatterInBand ? 0.5 * Math.random() + 0.2 : 0.5);
				});
	
				labels = _Array$from(valueMap.entries()).sort(function (a, b) {
					return a[1] - b[1];
				}).map(function (entry) {
					return entry[0];
				});
			})();
		}
	
		data = data.sort(function (a, b) {
			return a['datumValue'] - b['datumValue'];
		});
	
		// Generate chart rings and attatch that data
		var chartRings = generateChartRings(data, labels);
		data.forEach(function (datum) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;
	
			try {
				for (var _iterator7 = _getIterator(chartRings), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var r = _step7.value;
	
					if (datum.datumValue >= r.min && datum.datumValue < r.max) {
						datum['hidden-graph-item-ring'] = r;
						break;
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7['return']) {
						_iterator7['return']();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}
		});
	
		data = data.filter(function (datum) {
			var regex = undefined;
			try {
				regex = new RegExp(options.filter, 'gi');
			} catch (e) {
	
				// if there is a broken regex then don't try matching
				return true;
			}
			var possibleMatches = _Object$keys(datum).map(function (k) {
				return k + ':' + datum[k];
			});
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;
	
			try {
				for (var _iterator8 = _getIterator(possibleMatches), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var p = _step8.value;
	
					if (p.match(regex)) return true;
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8['return']) {
						_iterator8['return']();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}
		});
	
		if (!data.length) {
			throw Error('No data matched by filter');
		}
	
		return {
			data: data,
			labels: labels
		};
	}
	
	function generateChartRings(data) {
		var labels = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
		var segmentBy = options.segment || 'hidden-graph-item-source';
		var segments = new _Set();
		var max = 0;
		var counts = [];
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;
	
		try {
			for (var _iterator10 = _getIterator(data), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var datum = _step10.value;
	
				max = Math.max(datum.datumValue, max);
				segments.add(datum[segmentBy]);
				var segment = Math.floor(datum.datumValue);
				counts[segment] = (counts[segment] || 0) + 1;
			}
		} catch (err) {
			_didIteratorError10 = true;
			_iteratorError10 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion10 && _iterator10['return']) {
					_iterator10['return']();
				}
			} finally {
				if (_didIteratorError10) {
					throw _iteratorError10;
				}
			}
		}
	
		if (labels.length === 0) {
			labels = counts.map(function (l, i) {
				return String(i);
			});
		};
	
		// add smidge so that integers get rounded up
		// other wise it adds too many rings
		if (Math.ceil(max + 0.0001) - max < 0.1) {
	
			// add an empty ring if needed
			counts.push(0);
		}
		var nRings = counts.length;
	
		var smallestWidth = 0.5;
		var mostPopulousRingPopulation = counts.reduce(function (a, b) {
			return Math.max(a || 0, b || 0);
		}, -Infinity);
		for (var i = 0; i < counts.length; i++) {
			counts[i] = {
				count: counts[i] || 0,
				proportionalSize: (counts[i] || smallestWidth) / mostPopulousRingPopulation
			};
		}
		var totalProportionalSize = counts.reduce(function (a, b) {
			return a + b.proportionalSize;
		}, 0);
	
		var crystallisationIndex = labels.indexOf(options.crystallisation);
	
		var ringColors = counts.map(function (ring, i) {
	
			var rainbowFill = 'hsla(' + i * 360 / nRings + ', 60%, 75%, 1)';
			if (options.ringColor === 'rainbow') return rainbowFill;
	
			var baseColor = color(options.ringColor || '#fff1e0').toHsv();
			var maxV = baseColor.v;
			var minV = Math.min(Math.max(baseColor.v + (options.gradientOffset || -0.4), 0), 1);
	
			// don't go fully black
			baseColor.v = i * ((maxV - minV) / nRings) + minV;
			var newColor = color(baseColor).toHslString();
			return newColor;
		});
	
		// Draw rings from the max value down to zero
		var totalWidth = 0;
		return counts.map(function (_ref, i) {
			var count = _ref.count;
			var proportionalSize = _ref.proportionalSize;
	
			var width = options.useProportionalRings ? proportionalSize / totalProportionalSize : 1 / nRings;
			totalWidth += width;
			var fill = undefined;
	
			if (crystallisationIndex !== -1 && crystallisationIndex !== ringColors.length - 1) {
				fill = ringColors[nRings - 1 - Math.abs(i - crystallisationIndex)];
			} else {
				fill = ringColors[i];
			}
			return {
				fill: fill,
				min: i,
				max: i + 1,
				index: i,
				groupLabel: labels[i],
				segments: _Array$from(segments.values()),
				segmentBy: segmentBy,
				width: width,
				proportionalSizeStart: totalWidth - width,
				proportionalSizeEnd: totalWidth
			};
		});
	}
	
	function generateGraphs(inData) {
	
		// Set graph title
		document.querySelector('.sheet-title').textContent = options.title;
	
		var _process = process(inData);
	
		var data = _process.data;
		var labels = _process.labels;
	
		var svgTarget = document.getElementById('tech-radar__graph-target');
		var header = document.querySelector('.o-header');
		var footer = document.querySelector('footer');
		var svg = graph({
			data: data,
			size: Math.min(svgTarget.clientWidth, document.body.clientHeight - header.clientHeight - footer.clientHeight),
			rings: generateChartRings(data, labels),
			options: options
		});
		svgTarget.appendChild(svg);
	
		return function cleanUp() {
			svg.parentNode.removeChild(svg);
		};
	}
	
	function rowMouseOver(e) {
		e.currentTarget.classList.add('hovering');
		var pointId = e.currentTarget.id + '--graph-point';
		var point = document.getElementById(pointId);
		if (!point) return;
		point.classList.add('hovering');
	}
	
	function rowMouseOut(e) {
		e.currentTarget.classList.remove('hovering');
		var pointId = e.currentTarget.id + '--graph-point';
		var point = document.getElementById(pointId);
		if (!point) return;
		point.classList.remove('hovering');
	}
	
	function stripDuplicates(arr) {
		return [].concat(_toConsumableArray(new _Set(arr)));
	}
	
	function generateTable(inData) {
	
		// if not suppose to show the table return a noop to clean it up.
		if (options.showTable === false) return function () {};
	
		var _process2 = process(inData);
	
		var data = _process2.data;
	
		var table = document.createElement('table');
		var thead = document.createElement('thead');
		var theadTr = document.createElement('tr');
		var tbody = document.createElement('tbody');
		var headings = new _Set();
		data.forEach(function (datum) {
			var keys = _Object$keys(datum);
			keys.forEach(function (k) {
				return headings.add(k);
			});
		});
	
		// Get the headings removing duplicates and empty strings.
		var filterHeadings = stripDuplicates(['Key', 'name', options.sortCol].concat(options.showCol).concat(['Other Details']));
	
		table.appendChild(thead);
		thead.appendChild(theadTr);
		table.appendChild(tbody);
		table.classList.add('filter-table');
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;
	
		try {
			for (var _iterator11 = _getIterator(filterHeadings), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var heading = _step11.value;
	
				var td = document.createElement('td');
				td.textContent = heading;
				theadTr.appendChild(td);
			}
		} catch (err) {
			_didIteratorError11 = true;
			_iteratorError11 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion11 && _iterator11['return']) {
					_iterator11['return']();
				}
			} finally {
				if (_didIteratorError11) {
					throw _iteratorError11;
				}
			}
		}
	
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;
	
		try {
			for (var _iterator12 = _getIterator(data), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var datum = _step12.value;
	
				var tbodyTr = document.createElement('tr');
				tbodyTr.addEventListener('click', toggleCollapsedClass);
				tbody.appendChild(tbodyTr);
				tbodyTr.classList.add('collapsed');
				tbodyTr.id = datum['hidden-graph-item-id'];
				tbodyTr.addEventListener('mouseover', rowMouseOver);
				tbodyTr.addEventListener('mouseout', rowMouseOut);
				var _iteratorNormalCompletion13 = true;
				var _didIteratorError13 = false;
				var _iteratorError13 = undefined;
	
				try {
					for (var _iterator13 = _getIterator(filterHeadings), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
						var heading = _step13.value;
	
						var td = document.createElement('td');
						td.classList.add(heading.replace(/[^a-z]/ig, '-'));
						var tdContent = document.createElement('div');
						tdContent.classList.add('datum');
						td.appendChild(tdContent);
						if (heading === 'Other Details') {
	
							var newContent = '<ul class="details">';
	
							var itemKeys = _Object$keys(datum);
							var _iteratorNormalCompletion14 = true;
							var _didIteratorError14 = false;
							var _iteratorError14 = undefined;
	
							try {
								for (var _iterator14 = _getIterator(itemKeys), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
									var k = _step14.value;
	
									if (k.match(/^hidden-graph-item/)) continue;
									newContent += '<li><span class="key">' + k + ':</span> ' + datum[k] + '</li>';
								}
							} catch (err) {
								_didIteratorError14 = true;
								_iteratorError14 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion14 && _iterator14['return']) {
										_iterator14['return']();
									}
								} finally {
									if (_didIteratorError14) {
										throw _iteratorError14;
									}
								}
							}
	
							newContent += '</ul>';
							tdContent.innerHTML = newContent;
							td.classList.add('hidden');
						} else if (heading === 'Key') {
							td.style.background = 'hsl(' + datum['hidden-graph-item-hue'] + ', 95%, 60%)';
						} else if (heading === options.sortCol) {
							td.style.background = datum['hidden-graph-item-ring'].fill;
							tdContent.textContent = datum[heading] || '';
						} else {
							tdContent.textContent = datum[heading] || '';
						}
						tbodyTr.appendChild(td);
					}
				} catch (err) {
					_didIteratorError13 = true;
					_iteratorError13 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion13 && _iterator13['return']) {
							_iterator13['return']();
						}
					} finally {
						if (_didIteratorError13) {
							throw _iteratorError13;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError12 = true;
			_iteratorError12 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion12 && _iterator12['return']) {
					_iterator12['return']();
				}
			} finally {
				if (_didIteratorError12) {
					throw _iteratorError12;
				}
			}
		}
	
		document.getElementById('tech-radar__filter-list-target').appendChild(table);
	
		return function cleanUp() {
			table.parentNode.removeChild(table);
		};
	}
	
	function mergeData(data) {
	
		if (data.length === 1) {
			return data[0];
		}
	
		var flattenedData = [];
	
		for (var a = 0; a < data.length; a += 1) {
	
			var thisArray = data[a];
	
			for (var b = 0; b < thisArray.length; b += 1) {
				var thisValue = thisArray[b];
	
				if (a === 0) {
					flattenedData.push(thisValue);
				}
	
				for (var c = a; c < data.length; c++) {
	
					var arrayToCompareWith = data[c];
					for (var d = 0; d < arrayToCompareWith.length; d += 1) {
						var theValueToCompareWith = arrayToCompareWith[d];
	
						if (!isEqual(thisValue, theValueToCompareWith)) {
							flattenedData.push(theValueToCompareWith);
						}
					}
				}
			}
		}
	
		for (var e = 0; e < flattenedData.length; e += 1) {
			for (var f = e + 1; f < flattenedData.length; f += 1) {
				if (isEqual(flattenedData[e], flattenedData[f])) {
					flattenedData.splice(f, 1);
					f -= 1;
				}
			}
		}
	
		return flattenedData;
	}
	
	function cloneData(data) {
		return data.map(function (datum) {
			return extend({}, datum);
		});
	}
	
	_Promise.all([addScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'), addScript('https://polyfill.webservices.ft.com/v1/polyfill.min.js?features=fetch,default')]).then(function () {
	
		// read query params
		parseOptions((function () {
			var parsed = queryString.parse(location.search);
	
			if (parsed.title !== undefined && parsed.title !== '') {
				titleFromQueryParam = true;
				document.querySelector('.sheet-title').textContent = parsed.title;
			}
	
			return parsed;
		})(), true);
	}).then(function () {
		if (!options.jsonFeeds.length && (!options.docUIDs.length || !options.sheets.length)) {
			var errMessage = 'No ID and Sheet parameters or JSON feed provided.';
	
			// Don't go any further
			// Render the form anyway
			__webpack_require__(111)(qpSchema, [], [], options);
	
			document.querySelector('li[aria-controls="data-source"]').click();
	
			throw Error(errMessage);
		}
	}).then(decideHowToAct).then(function (howToAct) {
		return retrieveSheets(howToAct);
	}).then(function (data) {
		return mergeData(data);
	}).then(function (data) {
	
		var cleanUpGraph = function cleanUpGraph() {};
		var cleanUpTable = function cleanUpTable() {};
		var rings = [];
		var e = undefined;
	
		try {
			var o = process(data);
			rings = generateChartRings(o.data, o.labels);
		} catch (err) {
			document.getElementById('error-text-target').textContent = err.message;
			e = err;
		}
		__webpack_require__(111)(qpSchema, data[0] ? _Object$keys(data[0]).filter(function (k) {
			return !k.match(/^(configvalue$|hidden-graph-item)/);
		}) : [], rings.map(function (r) {
			return r.groupLabel;
		}), options);
	
		document.getElementById('filter').addEventListener('input', function (e) {
	
			// Filter graph
			options.filter = e.currentTarget.value;
			cleanUpTable();
			cleanUpTable = generateTable(data);
		});
	
		if (e) throw e;
	
		if (options.customCss) {
			var customStyleSheet = document.createElement('style');
			customStyleSheet.textContent = options.customCss;
			document.head.appendChild(customStyleSheet);
		}
	
		if (options.dashboard) {
			document.getElementById('tech-radar__settings').style.display = 'none';
		}
	
		var buttons = document.getElementById('tech-radar__buttons');
	
		var updateDataButton = document.createElement('button');
		updateDataButton.textContent = 'Refresh Data';
		buttons.appendChild(updateDataButton);
		updateDataButton.classList.add('o-buttons');
		updateDataButton.classList.add('o-buttons--standout');
		updateDataButton.addEventListener('click', function () {
			cleanUpGraph();
			cleanUpTable();
	
			decideHowToAct().then(function (howToAct) {
				return retrieveSheets(howToAct, true);
			}).then(function (data) {
				return mergeData(data);
			}).then(function (dataIn) {
				data = dataIn;
				cleanUpTable = generateTable(data);
				cleanUpGraph = generateGraphs(data);
	
				// Hide the dashboard if hidden
				if (options.dashboard) {
					document.getElementById('tech-radar__settings').style.display = 'none';
				}
			});
		});
	
		cleanUpTable = generateTable(data);
		cleanUpGraph = generateGraphs(data);
	})['catch'](function (e) {
		document.getElementById('error-text-target').textContent = e.message;
		throw e;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Array$from = __webpack_require__(2)["default"];
	
	exports["default"] = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
	
	    return arr2;
	  } else {
	    return _Array$from(arr);
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(28);
	module.exports = __webpack_require__(12).Array.from;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(5)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(8)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(6)
	  , defined   = __webpack_require__(7);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(9)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(15)
	  , hide           = __webpack_require__(16)
	  , has            = __webpack_require__(21)
	  , Iterators      = __webpack_require__(22)
	  , $iterCreate    = __webpack_require__(23)
	  , setToStringTag = __webpack_require__(24)
	  , getProto       = __webpack_require__(17).getProto
	  , ITERATOR       = __webpack_require__(25)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(17)
	  , createDesc = __webpack_require__(18);
	module.exports = __webpack_require__(19) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(20)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(17)
	  , descriptor     = __webpack_require__(18)
	  , setToStringTag = __webpack_require__(24)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(16)(IteratorPrototype, __webpack_require__(25)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(17).setDesc
	  , has = __webpack_require__(21)
	  , TAG = __webpack_require__(25)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(26)('wks')
	  , uid    = __webpack_require__(27)
	  , Symbol = __webpack_require__(11).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(13)
	  , $export     = __webpack_require__(10)
	  , toObject    = __webpack_require__(29)
	  , call        = __webpack_require__(30)
	  , isArrayIter = __webpack_require__(33)
	  , toLength    = __webpack_require__(34)
	  , getIterFn   = __webpack_require__(35);
	$export($export.S + $export.F * !__webpack_require__(38)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(7);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(31);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(32);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(22)
	  , ITERATOR   = __webpack_require__(25)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(6)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(36)
	  , ITERATOR  = __webpack_require__(25)('iterator')
	  , Iterators = __webpack_require__(22);
	module.exports = __webpack_require__(12).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(37)
	  , TAG = __webpack_require__(25)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(25)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(40), __esModule: true };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(41);
	module.exports = __webpack_require__(12).Object.keys;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(29);
	
	__webpack_require__(42)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(20);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(44), __esModule: true };

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	__webpack_require__(4);
	__webpack_require__(46);
	__webpack_require__(52);
	__webpack_require__(59);
	module.exports = __webpack_require__(12).Set;

/***/ },
/* 45 */
/***/ function(module, exports) {



/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(47);
	var Iterators = __webpack_require__(22);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(48)
	  , step             = __webpack_require__(49)
	  , Iterators        = __webpack_require__(22)
	  , toIObject        = __webpack_require__(50);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(8)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(51)
	  , defined = __webpack_require__(7);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(37);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(53);
	
	// 23.2 Set Objects
	__webpack_require__(58)('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(17)
	  , hide         = __webpack_require__(16)
	  , redefineAll  = __webpack_require__(54)
	  , ctx          = __webpack_require__(13)
	  , strictNew    = __webpack_require__(55)
	  , defined      = __webpack_require__(7)
	  , forOf        = __webpack_require__(56)
	  , $iterDefine  = __webpack_require__(8)
	  , step         = __webpack_require__(49)
	  , ID           = __webpack_require__(27)('id')
	  , $has         = __webpack_require__(21)
	  , isObject     = __webpack_require__(32)
	  , setSpecies   = __webpack_require__(57)
	  , DESCRIPTORS  = __webpack_require__(19)
	  , isExtensible = Object.isExtensible || isObject
	  , SIZE         = DESCRIPTORS ? '_s' : 'size'
	  , id           = 0;
	
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	};
	
	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined;      // first entry
	      that._l = undefined;      // last entry
	      that[SIZE] = 0;           // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(15);
	module.exports = function(target, src){
	  for(var key in src)redefine(target, key, src[key]);
	  return target;
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(13)
	  , call        = __webpack_require__(30)
	  , isArrayIter = __webpack_require__(33)
	  , anObject    = __webpack_require__(31)
	  , toLength    = __webpack_require__(34)
	  , getIterFn   = __webpack_require__(35);
	module.exports = function(iterable, entries, fn, that){
	  var iterFn = getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var core        = __webpack_require__(12)
	  , $           = __webpack_require__(17)
	  , DESCRIPTORS = __webpack_require__(19)
	  , SPECIES     = __webpack_require__(25)('species');
	
	module.exports = function(KEY){
	  var C = core[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(17)
	  , global         = __webpack_require__(11)
	  , $export        = __webpack_require__(10)
	  , fails          = __webpack_require__(20)
	  , hide           = __webpack_require__(16)
	  , redefineAll    = __webpack_require__(54)
	  , forOf          = __webpack_require__(56)
	  , strictNew      = __webpack_require__(55)
	  , isObject       = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(24)
	  , DESCRIPTORS    = __webpack_require__(19);
	
	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      strictNew(target, C, NAME);
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);
	
	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(10);
	
	$export($export.P, 'Set', {toJSON: __webpack_require__(60)('Set')});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var forOf   = __webpack_require__(56)
	  , classof = __webpack_require__(36);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	__webpack_require__(4);
	__webpack_require__(46);
	__webpack_require__(63);
	module.exports = __webpack_require__(12).Promise;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(17)
	  , LIBRARY    = __webpack_require__(9)
	  , global     = __webpack_require__(11)
	  , ctx        = __webpack_require__(13)
	  , classof    = __webpack_require__(36)
	  , $export    = __webpack_require__(10)
	  , isObject   = __webpack_require__(32)
	  , anObject   = __webpack_require__(31)
	  , aFunction  = __webpack_require__(14)
	  , strictNew  = __webpack_require__(55)
	  , forOf      = __webpack_require__(56)
	  , setProto   = __webpack_require__(64).set
	  , same       = __webpack_require__(65)
	  , SPECIES    = __webpack_require__(25)('species')
	  , speciesConstructor = __webpack_require__(66)
	  , asap       = __webpack_require__(67)
	  , PROMISE    = 'Promise'
	  , process    = global.process
	  , isNode     = classof(process) == 'process'
	  , P          = global[PROMISE]
	  , Wrapper;
	
	var testResolve = function(sub){
	  var test = new P(function(){});
	  if(sub)test.constructor = Object;
	  return P.resolve(test) === test;
	};
	
	var USE_NATIVE = function(){
	  var works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = P && P.resolve && testResolve();
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
	    if(works && __webpack_require__(19)){
	      var thenableThenGotten = false;
	      P.resolve($.setDesc({}, 'then', {
	        get: function(){ thenableThenGotten = true; }
	      }));
	      works = thenableThenGotten;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();
	
	// helpers
	var sameConstructor = function(a, b){
	  // library wrapper special case
	  if(LIBRARY && a === P && b === Wrapper)return true;
	  return same(a, b);
	};
	var getConstructor = function(C){
	  var S = anObject(C)[SPECIES];
	  return S != undefined ? S : C;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var PromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve),
	  this.reject  = aFunction(reject)
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(record, isReject){
	  if(record.n)return;
	  record.n = true;
	  var chain = record.c;
	  asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , result, then;
	      try {
	        if(handler){
	          if(!ok)record.h = true;
	          result = handler === true ? value : handler(value);
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	    record.n = false;
	    if(isReject)setTimeout(function(){
	      var promise = record.p
	        , handler, console;
	      if(isUnhandled(promise)){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      } record.a = undefined;
	    }, 1);
	  });
	};
	var isUnhandled = function(promise){
	  var record = promise._d
	    , chain  = record.a || record.c
	    , i      = 0
	    , reaction;
	  if(record.h)return false;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var $reject = function(value){
	  var record = this;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  notify(record, true);
	};
	var $resolve = function(value){
	  var record = this
	    , then;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(record.p === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      asap(function(){
	        var wrapper = {r: record, d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record, false);
	    }
	  } catch(e){
	    $reject.call({r: record, d: false}, e); // wrap
	  }
	};
	
	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    aFunction(executor);
	    var record = this._d = {
	      p: strictNew(this, P, PROMISE),         // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false,                               // <- handled rejection
	      n: false                                // <- notify
	    };
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(54)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction = new PromiseCapability(speciesConstructor(this, P))
	        , promise  = reaction.promise
	        , record   = this._d;
	      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      record.c.push(reaction);
	      if(record.a)record.a.push(reaction);
	      if(record.s)notify(record, false);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
	__webpack_require__(24)(P, PROMISE);
	__webpack_require__(57)(PROMISE);
	Wrapper = __webpack_require__(12)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = new PromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof P && sameConstructor(x.constructor, this))return x;
	    var capability = new PromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(38)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject
	      , values     = [];
	    var abrupt = perform(function(){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        var alreadyCalled = false;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled = true;
	          results[index] = value;
	          --remaining || resolve(results);
	        }, reject);
	      });
	      else resolve(results);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(17).getDesc
	  , isObject = __webpack_require__(32)
	  , anObject = __webpack_require__(31);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(13)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(31)
	  , aFunction = __webpack_require__(14)
	  , SPECIES   = __webpack_require__(25)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , macrotask = __webpack_require__(68).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(37)(process) == 'process'
	  , head, last, notify;
	
	var flush = function(){
	  var parent, domain, fn;
	  if(isNode && (parent = process.domain)){
	    process.domain = null;
	    parent.exit();
	  }
	  while(head){
	    domain = head.domain;
	    fn     = head.fn;
	    if(domain)domain.enter();
	    fn(); // <- currently we use it only for Promise - try / catch not required
	    if(domain)domain.exit();
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	};
	
	// Node.js
	if(isNode){
	  notify = function(){
	    process.nextTick(flush);
	  };
	// browsers with MutationObserver
	} else if(Observer){
	  var toggle = 1
	    , node   = document.createTextNode('');
	  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	  notify = function(){
	    node.data = toggle = -toggle;
	  };
	// environments with maybe non-completely correct, but existent Promise
	} else if(Promise && Promise.resolve){
	  notify = function(){
	    Promise.resolve().then(flush);
	  };
	// for other environments - macrotask based on:
	// - setImmediate
	// - MessageChannel
	// - window.postMessag
	// - onreadystatechange
	// - setTimeout
	} else {
	  notify = function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    macrotask.call(global, flush);
	  };
	}
	
	module.exports = function asap(fn){
	  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
	  if(last)last.next = task;
	  if(!head){
	    head = task;
	    notify();
	  } last = task;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(13)
	  , invoke             = __webpack_require__(69)
	  , html               = __webpack_require__(70)
	  , cel                = __webpack_require__(71)
	  , global             = __webpack_require__(11)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listner = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(37)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listner, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(32)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(46);
	__webpack_require__(4);
	module.exports = __webpack_require__(74);

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(31)
	  , get      = __webpack_require__(35);
	module.exports = __webpack_require__(12).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	__webpack_require__(4);
	__webpack_require__(46);
	__webpack_require__(77);
	__webpack_require__(78);
	module.exports = __webpack_require__(12).Map;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(53);
	
	// 23.1 Map Objects
	__webpack_require__(58)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(10);
	
	$export($export.P, 'Map', {toJSON: __webpack_require__(60)('Map')});

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(80);

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;// TinyColor v1.3.0
	// https://github.com/bgrins/TinyColor
	// Brian Grinstead, MIT License
	
	(function() {
	
	var trimLeft = /^\s+/,
	    trimRight = /\s+$/,
	    tinyCounter = 0,
	    math = Math,
	    mathRound = math.round,
	    mathMin = math.min,
	    mathMax = math.max,
	    mathRandom = math.random;
	
	function tinycolor (color, opts) {
	
	    color = (color) ? color : '';
	    opts = opts || { };
	
	    // If input is already a tinycolor, return itself
	    if (color instanceof tinycolor) {
	       return color;
	    }
	    // If we are called as a function, call using new instead
	    if (!(this instanceof tinycolor)) {
	        return new tinycolor(color, opts);
	    }
	
	    var rgb = inputToRGB(color);
	    this._originalInput = color,
	    this._r = rgb.r,
	    this._g = rgb.g,
	    this._b = rgb.b,
	    this._a = rgb.a,
	    this._roundA = mathRound(100*this._a) / 100,
	    this._format = opts.format || rgb.format;
	    this._gradientType = opts.gradientType;
	
	    // Don't let the range of [0,255] come back in [0,1].
	    // Potentially lose a little bit of precision here, but will fix issues where
	    // .5 gets interpreted as half of the total, instead of half of 1
	    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
	    if (this._r < 1) { this._r = mathRound(this._r); }
	    if (this._g < 1) { this._g = mathRound(this._g); }
	    if (this._b < 1) { this._b = mathRound(this._b); }
	
	    this._ok = rgb.ok;
	    this._tc_id = tinyCounter++;
	}
	
	tinycolor.prototype = {
	    isDark: function() {
	        return this.getBrightness() < 128;
	    },
	    isLight: function() {
	        return !this.isDark();
	    },
	    isValid: function() {
	        return this._ok;
	    },
	    getOriginalInput: function() {
	      return this._originalInput;
	    },
	    getFormat: function() {
	        return this._format;
	    },
	    getAlpha: function() {
	        return this._a;
	    },
	    getBrightness: function() {
	        //http://www.w3.org/TR/AERT#color-contrast
	        var rgb = this.toRgb();
	        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	    },
	    getLuminance: function() {
	        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	        var rgb = this.toRgb();
	        var RsRGB, GsRGB, BsRGB, R, G, B;
	        RsRGB = rgb.r/255;
	        GsRGB = rgb.g/255;
	        BsRGB = rgb.b/255;
	
	        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
	        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
	        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
	        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
	    },
	    setAlpha: function(value) {
	        this._a = boundAlpha(value);
	        this._roundA = mathRound(100*this._a) / 100;
	        return this;
	    },
	    toHsv: function() {
	        var hsv = rgbToHsv(this._r, this._g, this._b);
	        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
	    },
	    toHsvString: function() {
	        var hsv = rgbToHsv(this._r, this._g, this._b);
	        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
	        return (this._a == 1) ?
	          "hsv("  + h + ", " + s + "%, " + v + "%)" :
	          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
	    },
	    toHsl: function() {
	        var hsl = rgbToHsl(this._r, this._g, this._b);
	        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
	    },
	    toHslString: function() {
	        var hsl = rgbToHsl(this._r, this._g, this._b);
	        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
	        return (this._a == 1) ?
	          "hsl("  + h + ", " + s + "%, " + l + "%)" :
	          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
	    },
	    toHex: function(allow3Char) {
	        return rgbToHex(this._r, this._g, this._b, allow3Char);
	    },
	    toHexString: function(allow3Char) {
	        return '#' + this.toHex(allow3Char);
	    },
	    toHex8: function() {
	        return rgbaToHex(this._r, this._g, this._b, this._a);
	    },
	    toHex8String: function() {
	        return '#' + this.toHex8();
	    },
	    toRgb: function() {
	        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
	    },
	    toRgbString: function() {
	        return (this._a == 1) ?
	          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
	          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
	    },
	    toPercentageRgb: function() {
	        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
	    },
	    toPercentageRgbString: function() {
	        return (this._a == 1) ?
	          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
	          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
	    },
	    toName: function() {
	        if (this._a === 0) {
	            return "transparent";
	        }
	
	        if (this._a < 1) {
	            return false;
	        }
	
	        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
	    },
	    toFilter: function(secondColor) {
	        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
	        var secondHex8String = hex8String;
	        var gradientType = this._gradientType ? "GradientType = 1, " : "";
	
	        if (secondColor) {
	            var s = tinycolor(secondColor);
	            secondHex8String = s.toHex8String();
	        }
	
	        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
	    },
	    toString: function(format) {
	        var formatSet = !!format;
	        format = format || this._format;
	
	        var formattedString = false;
	        var hasAlpha = this._a < 1 && this._a >= 0;
	        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");
	
	        if (needsAlphaFormat) {
	            // Special case for "transparent", all other non-alpha formats
	            // will return rgba when there is transparency.
	            if (format === "name" && this._a === 0) {
	                return this.toName();
	            }
	            return this.toRgbString();
	        }
	        if (format === "rgb") {
	            formattedString = this.toRgbString();
	        }
	        if (format === "prgb") {
	            formattedString = this.toPercentageRgbString();
	        }
	        if (format === "hex" || format === "hex6") {
	            formattedString = this.toHexString();
	        }
	        if (format === "hex3") {
	            formattedString = this.toHexString(true);
	        }
	        if (format === "hex8") {
	            formattedString = this.toHex8String();
	        }
	        if (format === "name") {
	            formattedString = this.toName();
	        }
	        if (format === "hsl") {
	            formattedString = this.toHslString();
	        }
	        if (format === "hsv") {
	            formattedString = this.toHsvString();
	        }
	
	        return formattedString || this.toHexString();
	    },
	    clone: function() {
	        return tinycolor(this.toString());
	    },
	
	    _applyModification: function(fn, args) {
	        var color = fn.apply(null, [this].concat([].slice.call(args)));
	        this._r = color._r;
	        this._g = color._g;
	        this._b = color._b;
	        this.setAlpha(color._a);
	        return this;
	    },
	    lighten: function() {
	        return this._applyModification(lighten, arguments);
	    },
	    brighten: function() {
	        return this._applyModification(brighten, arguments);
	    },
	    darken: function() {
	        return this._applyModification(darken, arguments);
	    },
	    desaturate: function() {
	        return this._applyModification(desaturate, arguments);
	    },
	    saturate: function() {
	        return this._applyModification(saturate, arguments);
	    },
	    greyscale: function() {
	        return this._applyModification(greyscale, arguments);
	    },
	    spin: function() {
	        return this._applyModification(spin, arguments);
	    },
	
	    _applyCombination: function(fn, args) {
	        return fn.apply(null, [this].concat([].slice.call(args)));
	    },
	    analogous: function() {
	        return this._applyCombination(analogous, arguments);
	    },
	    complement: function() {
	        return this._applyCombination(complement, arguments);
	    },
	    monochromatic: function() {
	        return this._applyCombination(monochromatic, arguments);
	    },
	    splitcomplement: function() {
	        return this._applyCombination(splitcomplement, arguments);
	    },
	    triad: function() {
	        return this._applyCombination(triad, arguments);
	    },
	    tetrad: function() {
	        return this._applyCombination(tetrad, arguments);
	    }
	};
	
	// If input is an object, force 1 into "1.0" to handle ratios properly
	// String input requires "1.0" as input, so 1 will be treated as 1
	tinycolor.fromRatio = function(color, opts) {
	    if (typeof color == "object") {
	        var newColor = {};
	        for (var i in color) {
	            if (color.hasOwnProperty(i)) {
	                if (i === "a") {
	                    newColor[i] = color[i];
	                }
	                else {
	                    newColor[i] = convertToPercentage(color[i]);
	                }
	            }
	        }
	        color = newColor;
	    }
	
	    return tinycolor(color, opts);
	};
	
	// Given a string or object, convert that input to RGB
	// Possible string inputs:
	//
	//     "red"
	//     "#f00" or "f00"
	//     "#ff0000" or "ff0000"
	//     "#ff000000" or "ff000000"
	//     "rgb 255 0 0" or "rgb (255, 0, 0)"
	//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	//
	function inputToRGB(color) {
	
	    var rgb = { r: 0, g: 0, b: 0 };
	    var a = 1;
	    var ok = false;
	    var format = false;
	
	    if (typeof color == "string") {
	        color = stringInputToObject(color);
	    }
	
	    if (typeof color == "object") {
	        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
	            rgb = rgbToRgb(color.r, color.g, color.b);
	            ok = true;
	            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
	        }
	        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
	            color.s = convertToPercentage(color.s);
	            color.v = convertToPercentage(color.v);
	            rgb = hsvToRgb(color.h, color.s, color.v);
	            ok = true;
	            format = "hsv";
	        }
	        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
	            color.s = convertToPercentage(color.s);
	            color.l = convertToPercentage(color.l);
	            rgb = hslToRgb(color.h, color.s, color.l);
	            ok = true;
	            format = "hsl";
	        }
	
	        if (color.hasOwnProperty("a")) {
	            a = color.a;
	        }
	    }
	
	    a = boundAlpha(a);
	
	    return {
	        ok: ok,
	        format: color.format || format,
	        r: mathMin(255, mathMax(rgb.r, 0)),
	        g: mathMin(255, mathMax(rgb.g, 0)),
	        b: mathMin(255, mathMax(rgb.b, 0)),
	        a: a
	    };
	}
	
	
	// Conversion Functions
	// --------------------
	
	// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
	// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
	
	// `rgbToRgb`
	// Handle bounds / percentage checking to conform to CSS color spec
	// <http://www.w3.org/TR/css3-color/>
	// *Assumes:* r, g, b in [0, 255] or [0, 1]
	// *Returns:* { r, g, b } in [0, 255]
	function rgbToRgb(r, g, b){
	    return {
	        r: bound01(r, 255) * 255,
	        g: bound01(g, 255) * 255,
	        b: bound01(b, 255) * 255
	    };
	}
	
	// `rgbToHsl`
	// Converts an RGB color value to HSL.
	// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
	// *Returns:* { h, s, l } in [0,1]
	function rgbToHsl(r, g, b) {
	
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	
	    var max = mathMax(r, g, b), min = mathMin(r, g, b);
	    var h, s, l = (max + min) / 2;
	
	    if(max == min) {
	        h = s = 0; // achromatic
	    }
	    else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max) {
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	
	        h /= 6;
	    }
	
	    return { h: h, s: s, l: l };
	}
	
	// `hslToRgb`
	// Converts an HSL color value to RGB.
	// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
	// *Returns:* { r, g, b } in the set [0, 255]
	function hslToRgb(h, s, l) {
	    var r, g, b;
	
	    h = bound01(h, 360);
	    s = bound01(s, 100);
	    l = bound01(l, 100);
	
	    function hue2rgb(p, q, t) {
	        if(t < 0) t += 1;
	        if(t > 1) t -= 1;
	        if(t < 1/6) return p + (q - p) * 6 * t;
	        if(t < 1/2) return q;
	        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	        return p;
	    }
	
	    if(s === 0) {
	        r = g = b = l; // achromatic
	    }
	    else {
	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }
	
	    return { r: r * 255, g: g * 255, b: b * 255 };
	}
	
	// `rgbToHsv`
	// Converts an RGB color value to HSV
	// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
	// *Returns:* { h, s, v } in [0,1]
	function rgbToHsv(r, g, b) {
	
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	
	    var max = mathMax(r, g, b), min = mathMin(r, g, b);
	    var h, s, v = max;
	
	    var d = max - min;
	    s = max === 0 ? 0 : d / max;
	
	    if(max == min) {
	        h = 0; // achromatic
	    }
	    else {
	        switch(max) {
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }
	    return { h: h, s: s, v: v };
	}
	
	// `hsvToRgb`
	// Converts an HSV color value to RGB.
	// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
	// *Returns:* { r, g, b } in the set [0, 255]
	 function hsvToRgb(h, s, v) {
	
	    h = bound01(h, 360) * 6;
	    s = bound01(s, 100);
	    v = bound01(v, 100);
	
	    var i = math.floor(h),
	        f = h - i,
	        p = v * (1 - s),
	        q = v * (1 - f * s),
	        t = v * (1 - (1 - f) * s),
	        mod = i % 6,
	        r = [v, q, p, p, t, v][mod],
	        g = [t, v, v, q, p, p][mod],
	        b = [p, p, t, v, v, q][mod];
	
	    return { r: r * 255, g: g * 255, b: b * 255 };
	}
	
	// `rgbToHex`
	// Converts an RGB color to hex
	// Assumes r, g, and b are contained in the set [0, 255]
	// Returns a 3 or 6 character hex
	function rgbToHex(r, g, b, allow3Char) {
	
	    var hex = [
	        pad2(mathRound(r).toString(16)),
	        pad2(mathRound(g).toString(16)),
	        pad2(mathRound(b).toString(16))
	    ];
	
	    // Return a 3 character hex if possible
	    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
	        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	    }
	
	    return hex.join("");
	}
	
	// `rgbaToHex`
	// Converts an RGBA color plus alpha transparency to hex
	// Assumes r, g, b and a are contained in the set [0, 255]
	// Returns an 8 character hex
	function rgbaToHex(r, g, b, a) {
	
	    var hex = [
	        pad2(convertDecimalToHex(a)),
	        pad2(mathRound(r).toString(16)),
	        pad2(mathRound(g).toString(16)),
	        pad2(mathRound(b).toString(16))
	    ];
	
	    return hex.join("");
	}
	
	// `equals`
	// Can be called with any tinycolor input
	tinycolor.equals = function (color1, color2) {
	    if (!color1 || !color2) { return false; }
	    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
	};
	
	tinycolor.random = function() {
	    return tinycolor.fromRatio({
	        r: mathRandom(),
	        g: mathRandom(),
	        b: mathRandom()
	    });
	};
	
	
	// Modification Functions
	// ----------------------
	// Thanks to less.js for some of the basics here
	// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
	
	function desaturate(color, amount) {
	    amount = (amount === 0) ? 0 : (amount || 10);
	    var hsl = tinycolor(color).toHsl();
	    hsl.s -= amount / 100;
	    hsl.s = clamp01(hsl.s);
	    return tinycolor(hsl);
	}
	
	function saturate(color, amount) {
	    amount = (amount === 0) ? 0 : (amount || 10);
	    var hsl = tinycolor(color).toHsl();
	    hsl.s += amount / 100;
	    hsl.s = clamp01(hsl.s);
	    return tinycolor(hsl);
	}
	
	function greyscale(color) {
	    return tinycolor(color).desaturate(100);
	}
	
	function lighten (color, amount) {
	    amount = (amount === 0) ? 0 : (amount || 10);
	    var hsl = tinycolor(color).toHsl();
	    hsl.l += amount / 100;
	    hsl.l = clamp01(hsl.l);
	    return tinycolor(hsl);
	}
	
	function brighten(color, amount) {
	    amount = (amount === 0) ? 0 : (amount || 10);
	    var rgb = tinycolor(color).toRgb();
	    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
	    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
	    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
	    return tinycolor(rgb);
	}
	
	function darken (color, amount) {
	    amount = (amount === 0) ? 0 : (amount || 10);
	    var hsl = tinycolor(color).toHsl();
	    hsl.l -= amount / 100;
	    hsl.l = clamp01(hsl.l);
	    return tinycolor(hsl);
	}
	
	// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	// Values outside of this range will be wrapped into this range.
	function spin(color, amount) {
	    var hsl = tinycolor(color).toHsl();
	    var hue = (mathRound(hsl.h) + amount) % 360;
	    hsl.h = hue < 0 ? 360 + hue : hue;
	    return tinycolor(hsl);
	}
	
	// Combination Functions
	// ---------------------
	// Thanks to jQuery xColor for some of the ideas behind these
	// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
	
	function complement(color) {
	    var hsl = tinycolor(color).toHsl();
	    hsl.h = (hsl.h + 180) % 360;
	    return tinycolor(hsl);
	}
	
	function triad(color) {
	    var hsl = tinycolor(color).toHsl();
	    var h = hsl.h;
	    return [
	        tinycolor(color),
	        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
	        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
	    ];
	}
	
	function tetrad(color) {
	    var hsl = tinycolor(color).toHsl();
	    var h = hsl.h;
	    return [
	        tinycolor(color),
	        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
	        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
	        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
	    ];
	}
	
	function splitcomplement(color) {
	    var hsl = tinycolor(color).toHsl();
	    var h = hsl.h;
	    return [
	        tinycolor(color),
	        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
	        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
	    ];
	}
	
	function analogous(color, results, slices) {
	    results = results || 6;
	    slices = slices || 30;
	
	    var hsl = tinycolor(color).toHsl();
	    var part = 360 / slices;
	    var ret = [tinycolor(color)];
	
	    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
	        hsl.h = (hsl.h + part) % 360;
	        ret.push(tinycolor(hsl));
	    }
	    return ret;
	}
	
	function monochromatic(color, results) {
	    results = results || 6;
	    var hsv = tinycolor(color).toHsv();
	    var h = hsv.h, s = hsv.s, v = hsv.v;
	    var ret = [];
	    var modification = 1 / results;
	
	    while (results--) {
	        ret.push(tinycolor({ h: h, s: s, v: v}));
	        v = (v + modification) % 1;
	    }
	
	    return ret;
	}
	
	// Utility Functions
	// ---------------------
	
	tinycolor.mix = function(color1, color2, amount) {
	    amount = (amount === 0) ? 0 : (amount || 50);
	
	    var rgb1 = tinycolor(color1).toRgb();
	    var rgb2 = tinycolor(color2).toRgb();
	
	    var p = amount / 100;
	    var w = p * 2 - 1;
	    var a = rgb2.a - rgb1.a;
	
	    var w1;
	
	    if (w * a == -1) {
	        w1 = w;
	    } else {
	        w1 = (w + a) / (1 + w * a);
	    }
	
	    w1 = (w1 + 1) / 2;
	
	    var w2 = 1 - w1;
	
	    var rgba = {
	        r: rgb2.r * w1 + rgb1.r * w2,
	        g: rgb2.g * w1 + rgb1.g * w2,
	        b: rgb2.b * w1 + rgb1.b * w2,
	        a: rgb2.a * p  + rgb1.a * (1 - p)
	    };
	
	    return tinycolor(rgba);
	};
	
	
	// Readability Functions
	// ---------------------
	// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
	
	// `contrast`
	// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
	tinycolor.readability = function(color1, color2) {
	    var c1 = tinycolor(color1);
	    var c2 = tinycolor(color2);
	    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
	};
	
	// `isReadable`
	// Ensure that foreground and background color combinations meet WCAG2 guidelines.
	// The third argument is an optional Object.
	//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
	//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
	// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
	
	// *Example*
	//    tinycolor.isReadable("#000", "#111") => false
	//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
	tinycolor.isReadable = function(color1, color2, wcag2) {
	    var readability = tinycolor.readability(color1, color2);
	    var wcag2Parms, out;
	
	    out = false;
	
	    wcag2Parms = validateWCAG2Parms(wcag2);
	    switch (wcag2Parms.level + wcag2Parms.size) {
	        case "AAsmall":
	        case "AAAlarge":
	            out = readability >= 4.5;
	            break;
	        case "AAlarge":
	            out = readability >= 3;
	            break;
	        case "AAAsmall":
	            out = readability >= 7;
	            break;
	    }
	    return out;
	
	};
	
	// `mostReadable`
	// Given a base color and a list of possible foreground or background
	// colors for that base, returns the most readable color.
	// Optionally returns Black or White if the most readable color is unreadable.
	// *Example*
	//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
	//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
	//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
	//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
	tinycolor.mostReadable = function(baseColor, colorList, args) {
	    var bestColor = null;
	    var bestScore = 0;
	    var readability;
	    var includeFallbackColors, level, size ;
	    args = args || {};
	    includeFallbackColors = args.includeFallbackColors ;
	    level = args.level;
	    size = args.size;
	
	    for (var i= 0; i < colorList.length ; i++) {
	        readability = tinycolor.readability(baseColor, colorList[i]);
	        if (readability > bestScore) {
	            bestScore = readability;
	            bestColor = tinycolor(colorList[i]);
	        }
	    }
	
	    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
	        return bestColor;
	    }
	    else {
	        args.includeFallbackColors=false;
	        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
	    }
	};
	
	
	// Big List of Colors
	// ------------------
	// <http://www.w3.org/TR/css3-color/#svg-color>
	var names = tinycolor.names = {
	    aliceblue: "f0f8ff",
	    antiquewhite: "faebd7",
	    aqua: "0ff",
	    aquamarine: "7fffd4",
	    azure: "f0ffff",
	    beige: "f5f5dc",
	    bisque: "ffe4c4",
	    black: "000",
	    blanchedalmond: "ffebcd",
	    blue: "00f",
	    blueviolet: "8a2be2",
	    brown: "a52a2a",
	    burlywood: "deb887",
	    burntsienna: "ea7e5d",
	    cadetblue: "5f9ea0",
	    chartreuse: "7fff00",
	    chocolate: "d2691e",
	    coral: "ff7f50",
	    cornflowerblue: "6495ed",
	    cornsilk: "fff8dc",
	    crimson: "dc143c",
	    cyan: "0ff",
	    darkblue: "00008b",
	    darkcyan: "008b8b",
	    darkgoldenrod: "b8860b",
	    darkgray: "a9a9a9",
	    darkgreen: "006400",
	    darkgrey: "a9a9a9",
	    darkkhaki: "bdb76b",
	    darkmagenta: "8b008b",
	    darkolivegreen: "556b2f",
	    darkorange: "ff8c00",
	    darkorchid: "9932cc",
	    darkred: "8b0000",
	    darksalmon: "e9967a",
	    darkseagreen: "8fbc8f",
	    darkslateblue: "483d8b",
	    darkslategray: "2f4f4f",
	    darkslategrey: "2f4f4f",
	    darkturquoise: "00ced1",
	    darkviolet: "9400d3",
	    deeppink: "ff1493",
	    deepskyblue: "00bfff",
	    dimgray: "696969",
	    dimgrey: "696969",
	    dodgerblue: "1e90ff",
	    firebrick: "b22222",
	    floralwhite: "fffaf0",
	    forestgreen: "228b22",
	    fuchsia: "f0f",
	    gainsboro: "dcdcdc",
	    ghostwhite: "f8f8ff",
	    gold: "ffd700",
	    goldenrod: "daa520",
	    gray: "808080",
	    green: "008000",
	    greenyellow: "adff2f",
	    grey: "808080",
	    honeydew: "f0fff0",
	    hotpink: "ff69b4",
	    indianred: "cd5c5c",
	    indigo: "4b0082",
	    ivory: "fffff0",
	    khaki: "f0e68c",
	    lavender: "e6e6fa",
	    lavenderblush: "fff0f5",
	    lawngreen: "7cfc00",
	    lemonchiffon: "fffacd",
	    lightblue: "add8e6",
	    lightcoral: "f08080",
	    lightcyan: "e0ffff",
	    lightgoldenrodyellow: "fafad2",
	    lightgray: "d3d3d3",
	    lightgreen: "90ee90",
	    lightgrey: "d3d3d3",
	    lightpink: "ffb6c1",
	    lightsalmon: "ffa07a",
	    lightseagreen: "20b2aa",
	    lightskyblue: "87cefa",
	    lightslategray: "789",
	    lightslategrey: "789",
	    lightsteelblue: "b0c4de",
	    lightyellow: "ffffe0",
	    lime: "0f0",
	    limegreen: "32cd32",
	    linen: "faf0e6",
	    magenta: "f0f",
	    maroon: "800000",
	    mediumaquamarine: "66cdaa",
	    mediumblue: "0000cd",
	    mediumorchid: "ba55d3",
	    mediumpurple: "9370db",
	    mediumseagreen: "3cb371",
	    mediumslateblue: "7b68ee",
	    mediumspringgreen: "00fa9a",
	    mediumturquoise: "48d1cc",
	    mediumvioletred: "c71585",
	    midnightblue: "191970",
	    mintcream: "f5fffa",
	    mistyrose: "ffe4e1",
	    moccasin: "ffe4b5",
	    navajowhite: "ffdead",
	    navy: "000080",
	    oldlace: "fdf5e6",
	    olive: "808000",
	    olivedrab: "6b8e23",
	    orange: "ffa500",
	    orangered: "ff4500",
	    orchid: "da70d6",
	    palegoldenrod: "eee8aa",
	    palegreen: "98fb98",
	    paleturquoise: "afeeee",
	    palevioletred: "db7093",
	    papayawhip: "ffefd5",
	    peachpuff: "ffdab9",
	    peru: "cd853f",
	    pink: "ffc0cb",
	    plum: "dda0dd",
	    powderblue: "b0e0e6",
	    purple: "800080",
	    rebeccapurple: "663399",
	    red: "f00",
	    rosybrown: "bc8f8f",
	    royalblue: "4169e1",
	    saddlebrown: "8b4513",
	    salmon: "fa8072",
	    sandybrown: "f4a460",
	    seagreen: "2e8b57",
	    seashell: "fff5ee",
	    sienna: "a0522d",
	    silver: "c0c0c0",
	    skyblue: "87ceeb",
	    slateblue: "6a5acd",
	    slategray: "708090",
	    slategrey: "708090",
	    snow: "fffafa",
	    springgreen: "00ff7f",
	    steelblue: "4682b4",
	    tan: "d2b48c",
	    teal: "008080",
	    thistle: "d8bfd8",
	    tomato: "ff6347",
	    turquoise: "40e0d0",
	    violet: "ee82ee",
	    wheat: "f5deb3",
	    white: "fff",
	    whitesmoke: "f5f5f5",
	    yellow: "ff0",
	    yellowgreen: "9acd32"
	};
	
	// Make it easy to access colors via `hexNames[hex]`
	var hexNames = tinycolor.hexNames = flip(names);
	
	
	// Utilities
	// ---------
	
	// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
	function flip(o) {
	    var flipped = { };
	    for (var i in o) {
	        if (o.hasOwnProperty(i)) {
	            flipped[o[i]] = i;
	        }
	    }
	    return flipped;
	}
	
	// Return a valid alpha value [0,1] with all invalid values being set to 1
	function boundAlpha(a) {
	    a = parseFloat(a);
	
	    if (isNaN(a) || a < 0 || a > 1) {
	        a = 1;
	    }
	
	    return a;
	}
	
	// Take input from [0, n] and return it as [0, 1]
	function bound01(n, max) {
	    if (isOnePointZero(n)) { n = "100%"; }
	
	    var processPercent = isPercentage(n);
	    n = mathMin(max, mathMax(0, parseFloat(n)));
	
	    // Automatically convert percentage into number
	    if (processPercent) {
	        n = parseInt(n * max, 10) / 100;
	    }
	
	    // Handle floating point rounding errors
	    if ((math.abs(n - max) < 0.000001)) {
	        return 1;
	    }
	
	    // Convert into [0, 1] range if it isn't already
	    return (n % max) / parseFloat(max);
	}
	
	// Force a number between 0 and 1
	function clamp01(val) {
	    return mathMin(1, mathMax(0, val));
	}
	
	// Parse a base-16 hex value into a base-10 integer
	function parseIntFromHex(val) {
	    return parseInt(val, 16);
	}
	
	// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	function isOnePointZero(n) {
	    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
	}
	
	// Check to see if string passed in is a percentage
	function isPercentage(n) {
	    return typeof n === "string" && n.indexOf('%') != -1;
	}
	
	// Force a hex value to have 2 characters
	function pad2(c) {
	    return c.length == 1 ? '0' + c : '' + c;
	}
	
	// Replace a decimal with it's percentage value
	function convertToPercentage(n) {
	    if (n <= 1) {
	        n = (n * 100) + "%";
	    }
	
	    return n;
	}
	
	// Converts a decimal to a hex value
	function convertDecimalToHex(d) {
	    return Math.round(parseFloat(d) * 255).toString(16);
	}
	// Converts a hex value to a decimal
	function convertHexToDecimal(h) {
	    return (parseIntFromHex(h) / 255);
	}
	
	var matchers = (function() {
	
	    // <http://www.w3.org/TR/css3-values/#integers>
	    var CSS_INTEGER = "[-\\+]?\\d+%?";
	
	    // <http://www.w3.org/TR/css3-values/#number-value>
	    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
	
	    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
	    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
	
	    // Actual matching.
	    // Parentheses and commas are optional, but not required.
	    // Whitespace can take the place of commas or opening paren
	    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	
	    return {
	        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
	        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	    };
	})();
	
	// `stringInputToObject`
	// Permissive string parsing.  Take in a number of formats, and output an object
	// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	function stringInputToObject(color) {
	
	    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
	    var named = false;
	    if (names[color]) {
	        color = names[color];
	        named = true;
	    }
	    else if (color == 'transparent') {
	        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
	    }
	
	    // Try to match string input using regular expressions.
	    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	    // Just return an object and let the conversion functions handle that.
	    // This way the result will be the same whether the tinycolor is initialized with string or object.
	    var match;
	    if ((match = matchers.rgb.exec(color))) {
	        return { r: match[1], g: match[2], b: match[3] };
	    }
	    if ((match = matchers.rgba.exec(color))) {
	        return { r: match[1], g: match[2], b: match[3], a: match[4] };
	    }
	    if ((match = matchers.hsl.exec(color))) {
	        return { h: match[1], s: match[2], l: match[3] };
	    }
	    if ((match = matchers.hsla.exec(color))) {
	        return { h: match[1], s: match[2], l: match[3], a: match[4] };
	    }
	    if ((match = matchers.hsv.exec(color))) {
	        return { h: match[1], s: match[2], v: match[3] };
	    }
	    if ((match = matchers.hsva.exec(color))) {
	        return { h: match[1], s: match[2], v: match[3], a: match[4] };
	    }
	    if ((match = matchers.hex8.exec(color))) {
	        return {
	            a: convertHexToDecimal(match[1]),
	            r: parseIntFromHex(match[2]),
	            g: parseIntFromHex(match[3]),
	            b: parseIntFromHex(match[4]),
	            format: named ? "name" : "hex8"
	        };
	    }
	    if ((match = matchers.hex6.exec(color))) {
	        return {
	            r: parseIntFromHex(match[1]),
	            g: parseIntFromHex(match[2]),
	            b: parseIntFromHex(match[3]),
	            format: named ? "name" : "hex"
	        };
	    }
	    if ((match = matchers.hex3.exec(color))) {
	        return {
	            r: parseIntFromHex(match[1] + '' + match[1]),
	            g: parseIntFromHex(match[2] + '' + match[2]),
	            b: parseIntFromHex(match[3] + '' + match[3]),
	            format: named ? "name" : "hex"
	        };
	    }
	
	    return false;
	}
	
	function validateWCAG2Parms(parms) {
	    // return valid WCAG2 parms for isReadable.
	    // If input parms are invalid, return {"level":"AA", "size":"small"}
	    var level, size;
	    parms = parms || {"level":"AA", "size":"small"};
	    level = (parms.level || "AA").toUpperCase();
	    size = (parms.size || "small").toLowerCase();
	    if (level !== "AA" && level !== "AAA") {
	        level = "AA";
	    }
	    if (size !== "small" && size !== "large") {
	        size = "small";
	    }
	    return {"level":level, "size":size};
	}
	
	// Node: Export function
	if (typeof module !== "undefined" && module.exports) {
	    module.exports = tinycolor;
	}
	// AMD/requirejs: Define the module
	else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {return tinycolor;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	// Browser: Expose to window
	else {
	    window.tinycolor = tinycolor;
	}
	
	})();


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _getIterator = __webpack_require__(72)['default'];
	
	var define = false;
	
	/* global d3 */
	/**
	 * Based on http://bl.ocks.org/MoritzStefaner/1377729
	 */
	
	'use strict';
	
	module.exports = function (_ref) {
		var data = _ref.data;
		var size = _ref.size;
		var rings = _ref.rings;
		var options = _ref.options;
	
		var boilDown = document.getElementById('boil-down');
		var width = size || 400;
		var height = size || 400;
		var innerWidth = 0.1;
		var totalRingSize = height;
		var chargeDistance = size / 2;
		var segmentLines = [];
		var nodes = data.slice(0);
		var links = [];
		var labelAnchorNodes = [];
		var labelAnchorLinks = [];
	
		var rootNodeObject = {
			name: 'root',
			fixed: true,
			visible: false,
			rootEl: true,
			charge: 10
		};
		switch (options.quadrant) {
			case 'bottom right':
				rootNodeObject.x = width;
				rootNodeObject.y = height;
				break;
			case 'bottom left':
				rootNodeObject.x = -width;
				rootNodeObject.y = height;
				break;
			case 'top left':
				rootNodeObject.x = -width;
				rootNodeObject.y = -height;
				break;
			case 'top right':
				rootNodeObject.x = width;
				rootNodeObject.y = -height;
				break;
		}
	
		nodes.forEach(function (n) {
			n.ring = rings[Math.floor(n.datumValue)];
			var positionInRing = n.datumValue % 1 * n.ring.width;
			var startPositionOfRing = n.ring.proportionalSizeStart * (1 - innerWidth) + innerWidth;
			n.pseudoDatumValue = positionInRing + startPositionOfRing;
			n.weight = 0.2;
			n.x = rootNodeObject.x / 2;
			n.y = rootNodeObject.y / 2;
	
			// Initial boost of repulsion which drives them apart
			n.charge = -100 * (options.nodeRepulsion || 3) * Math.pow((Math.floor(n.datumValue) + 2) / rings.length, 2);
		});
		(function addRootNode() {
			nodes.unshift(rootNodeObject);
	
			// Attatch all nodes to the rootnode
			nodes.map(function (n, i) {
				return {
					target: 0,
					source: i,
					distance: (n.pseudoDatumValue || 0) * totalRingSize,
					linkStrength: 0.1,
					fixed: n.fixed,
					toRoot: true
				};
			}).filter(function (l) {
				return !l.fixed;
			}).forEach(function (l) {
				links.push(l);
			});
		})();
	
		// Create a label and attatch it to each node
		// this resides in it's own force diagram.
		links.forEach(function (l, i) {
			var nodeToAttachTo = nodes[l.source];
			var x = nodeToAttachTo.x - totalRingSize;
			var y = nodeToAttachTo.y;
			var weight = 0.1;
			var text = nodeToAttachTo.name;
	
			// Has the text
			var label = {
				__coment: 'The text end',
				x: x,
				y: y,
				weight: weight,
				text: text,
				charge: options.tightlyBoundLabels ? -50 : -1100,
				id: nodeToAttachTo['hidden-graph-item-id'] + '--graph-label'
			};
	
			// Pulls the label towards the node
			var anchorToNode = {
				__coment: 'Anchor Node',
				x: x,
				y: y,
				fixed: true,
				charge: 0
			};
			labelAnchorNodes.push(label);
			labelAnchorNodes.push(anchorToNode);
			nodeToAttachTo.labelAnchor = anchorToNode;
			labelAnchorLinks.push({
				source: 2 * i,
				target: 2 * i + 1,
				distance: 3,
				weight: weight
			});
		});
	
		(function drawSegmentLabels() {
	
			// Draw an arc of points to act as the segment labels
			// they also attract the nodes.
			var r = height * 1.05;
			var offset = undefined;
			switch (options.quadrant) {
				case 'bottom right':
					offset = 1;
					break;
				case 'bottom left':
					offset = 0;
					break;
				case 'top left':
					offset = -1;
					break;
				case 'top right':
					offset = -2;
					break;
			}
	
			var thetaMin = offset * Math.PI / 2;
			var thetaMax = (offset + 1) * Math.PI / 2;
			for (var i = 0, l = rings[0].segments.length; i < l; i++) {
	
				var segment = rings[0].segments[i];
				var arcWidth = thetaMax - thetaMin;
				var segmentWidth = arcWidth / l;
				var theta = thetaMin + i * segmentWidth;
				var attractionNode = {
					name: rings[0].segmentBy !== 'hidden-graph-item-source' ? segment || 'null' : '',
					x: rootNodeObject.x + r * Math.cos(theta + segmentWidth / 2),
					y: rootNodeObject.y - r * Math.sin(theta + segmentWidth / 2),
					fixed: true,
					charge: 0,
					dot: false
				};
				labelAnchorNodes.push({
					name: '',
					x: rootNodeObject.x + r * Math.cos(theta + segmentWidth / 2),
					y: rootNodeObject.y - r * Math.sin(theta + segmentWidth / 2),
					fixed: true,
					charge: -700
				});
				nodes.push(attractionNode);
				segmentLines.push({
					x: r * Math.cos(theta),
					y: r * -Math.sin(theta)
				});
				if (i === l - 1) {
					segmentLines.push({
						x: r * Math.cos(theta),
						y: r * -Math.sin(theta)
					});
				}
			}
	
			// remove first and last line
			segmentLines.pop();
			segmentLines.shift();
		})();
	
		// Attract the nodes to the segments
		nodes.forEach(function (n, j) {
			for (var i = 0, l = rings[0].segments.length; i < l; i++) {
				if (n[rings[0].segmentBy] !== undefined && n[rings[0].segmentBy] === rings[0].segments[i]) {
					var target = nodes.length - l + i;
					n.x = nodes[target].x;
					n.y = nodes[target].y;
					var link = {
						target: target,
						source: j,
						distance: 0,
						linkStrength: 0.01 * (options.nodeAttraction || 3) * Math.pow(1.2, l)
					};
					links.push(link);
					break;
				}
			}
		});
	
		var svgNode = document.createElementNS(d3.ns.prefix.svg, 'svg');
		var svg = d3.select(svgNode);
		svg.attr('class', options.quadrant);
		var padding = {
			hSmall: 110,
			hLarge: 300,
			vTop: 50,
			vBottom: 110
		};
	
		switch (options.quadrant) {
			case 'bottom right':
				svg.attr('width', width + padding.hLarge + padding.hSmall).attr('height', height + padding.vTop + padding.vBottom).attr('viewBox', -padding.hLarge + ' ' + -padding.vTop + ' ' + (width + padding.hLarge + padding.hSmall) + ' ' + (height + padding.vTop + padding.vBottom));
				break;
			case 'bottom left':
				svg.attr('width', width + padding.hLarge + padding.hSmall).attr('height', height + padding.vTop + padding.vBottom).attr('viewBox', -width - padding.hSmall + ' ' + -padding.vTop + ' ' + (width + padding.hLarge + padding.hSmall) + ' ' + (height + padding.vTop + padding.vBottom));
				break;
			case 'top left':
				svg.attr('width', width + padding.hLarge + padding.hSmall).attr('height', height + padding.vTop + padding.vBottom).attr('viewBox', -width - padding.hSmall + ' ' + (-height - padding.vBottom) + ' ' + (width + padding.hLarge + padding.hSmall) + ' ' + (height + padding.vTop + padding.vBottom));
				break;
			case 'top right':
				svg.attr('width', width + padding.hLarge + padding.hSmall).attr('height', height + padding.vTop + padding.vBottom).attr('viewBox', -padding.hLarge + ' ' + (-height - padding.vBottom) + ' ' + (width + padding.hLarge + padding.hSmall) + ' ' + (height + padding.vTop + padding.vBottom));
				break;
		}
	
		var force = d3.layout.force().nodes(nodes).links(links).charge(function (n) {
			return n.charge;
		}).chargeDistance(chargeDistance).linkStrength(function (l) {
			return l.linkStrength;
		}).linkDistance(function (l) {
			return l.distance;
		}).gravity(0.01).size([width, height]);
	
		var labelForce = d3.layout.force().nodes(labelAnchorNodes).links(labelAnchorLinks).charge(function (n) {
			return n.charge || 0;
		}).chargeDistance(totalRingSize / 4).gravity(0.01).linkStrength(options.tightlyBoundLabels ? 10 : 1.5).linkDistance(0.5).size([width, height]);
	
		var drag = force.drag().on('drag', function () {
			return labelForce.alpha(0.03);
		}).on('dragstart', function () {
			return nodes.forEach(function (n) {
				return n.fixed = true;
			});
		});
		var dragLabel = labelForce.drag().on('dragend', function (d) {
			d.fixed = true;
		});
	
		function anchorNode(n) {
			switch (options.quadrant) {
				case 'bottom right':
					if (n.y > rootNodeObject.y) {
						n.y = rootNodeObject.y;
					}
					if (n.x > rootNodeObject.x) {
						n.x = rootNodeObject.x;
					}
					break;
				case 'bottom left':
					if (n.y > rootNodeObject.y) {
						n.y = rootNodeObject.y;
					}
					if (n.x < rootNodeObject.x) {
						n.x = rootNodeObject.x;
					}
					break;
				case 'top left':
					if (n.y < rootNodeObject.y) {
						n.y = rootNodeObject.y;
					}
					if (n.x < rootNodeObject.x) {
						n.x = rootNodeObject.x;
					}
					break;
				case 'top right':
					if (n.y < rootNodeObject.y) {
						n.y = rootNodeObject.y;
					}
					if (n.x > rootNodeObject.x) {
						n.x = rootNodeObject.x;
					}
					break;
			}
	
			var r = Math.pow(Math.pow(n.x - rootNodeObject.x, 2) + Math.pow(n.y - rootNodeObject.y, 2), 0.5);
			if (r >= totalRingSize) {
				var vX = n.x - rootNodeObject.x;
				var vY = n.y - rootNodeObject.y;
				vX *= totalRingSize / r;
				vY *= totalRingSize / r;
				n.x = rootNodeObject.x + vX;
				n.y = rootNodeObject.y + vY;
			}
		}
	
		force.on('tick', function () {
	
			nodes.forEach(function (d) {
				anchorNode(d);
	
				// Attach the label node to this node
				if (d.labelAnchor) {
					d.labelAnchor.px = d.x;
					d.labelAnchor.py = d.y;
					d.labelAnchor.x = d.x;
					d.labelAnchor.y = d.y;
				}
			});
			node.attr('transform', function (d) {
				return 'translate(' + d.x + ', ' + d.y + ')';
			});
		});
	
		labelForce.on('tick', function () {
			labelAnchorNodes.forEach(anchorNode);
	
			labelLine.attr('x1', function (d) {
				return d.source.x;
			}).attr('y1', function (d) {
				return d.source.y;
			}).attr('x2', function (d) {
				return d.target.x;
			}).attr('y2', function (d) {
				return d.target.y;
			});
			labelNode.attr('transform', function (d) {
				return 'translate(' + d.x + ', ' + d.y + ')';
			});
		});
	
		var node = svg.selectAll('.node').data(nodes).enter().append('svg:g').attr('class', function (d) {
			return d.rootEl ? 'rootNode' : 'node';
		}).attr('id', function (n) {
			return n['hidden-graph-item-id'] + '--graph-point';
		}).call(drag);
	
		var labelNode = svg.selectAll('.label-node').data(labelAnchorNodes).enter().append('svg:g').call(dragLabel).attr('id', function (n) {
			return '' + n.id;
		});
	
		var labelLine = svg.selectAll('.label.link').data(labelAnchorLinks).enter().append('svg:line').style('stroke', options.tightlyBoundLabels ? 'transparent' : 'grey').style('stroke-width', '1px');
	
		labelNode.append('svg:text').attr('class', 'd3-label bg').attr('x', '-10px').attr('y', '5px').each(function (n) {
			var _this = this;
	
			if (!n.text) return;
			var strs = options.lineWrapLabels ? n.text.split(' ') : [n.text];
			strs.forEach(function (str, i) {
				d3.select(_this).append('svg:tspan').text(str).attr('x', 0).attr('y', (options.quadrant.match(/bottom/) ? -(strs.length - 1) : +1) + i + 'em');
			});
		});
	
		labelNode.append('svg:text').attr('class', 'd3-label').attr('x', '-10px').attr('y', '5px').each(function (n) {
			var _this2 = this;
	
			if (!n.text) return;
			var strs = options.lineWrapLabels ? n.text.split(' ') : [n.text];
			strs.forEach(function (str, i) {
				d3.select(_this2).append('svg:tspan').text(str).attr('x', 0).attr('y', (options.quadrant.match(/bottom/) ? -(strs.length - 1) : +1) + i + 'em');
			});
		});
	
		node.style('display', function (d) {
			return d.visible === false && d.rootEl !== true ? 'none' : 'initial';
		});
	
		function mouseover(d) {
			var labelSelector = '#' + (d['hidden-graph-item-id'] + '--graph-label');
			renderOnTop.attr('xlink:href', labelSelector);
			document.querySelector(labelSelector).classList.add('hovering');
			var row = document.getElementById(d['hidden-graph-item-id']);
			if (!row) return;
			row.classList.add('hovering');
		}
	
		function mouseout(d) {
			var labelSelector = '#' + (d['hidden-graph-item-id'] + '--graph-label');
			renderOnTop.attr('xlink:href', '#');
			document.querySelector(labelSelector).classList.remove('hovering');
			var row = document.getElementById(d['hidden-graph-item-id']);
			if (!row) return;
			row.classList.remove('hovering');
		}
	
		function showTable(d, alsoUncollapseTable) {
	
			var hasTable = document.querySelector('.filter-table') !== null;
	
			if (alsoUncollapseTable === true && hasTable) {
				var row = document.getElementById(d['hidden-graph-item-id']);
				if (!row) return;
				row.classList.toggle('collapsed');
			} else if (!hasTable) {
	
				boilDown.innerHTML = '';
				d.longDesc.split('\n').forEach(function (line) {
	
					var aspects = line.split(':');
	
					if (aspects[0] === 'longdesc') {
						return;
					}
	
					var heading = document.createElement('h3');
					var info = document.createElement('p');
	
					heading.textContent = aspects[0];
					info.textContent = aspects[1];
	
					boilDown.appendChild(heading);
					boilDown.appendChild(info);
				});
			}
		}
	
		node.append('circle').attr('class', function (n) {
			return 'node' + (n.dot === false ? ' segment-label' : '');
		}).attr('r', 8).style('fill', function (n) {
			return 'hsla(' + n['hidden-graph-item-hue'] + ', 95%, 60%, 1)';
		}).on('mouseover', mouseover).on('mouseout', mouseout).on('mouseover', showTable).on('click', function (d) {
			return showTable(d, true);
		}).append('svg:title').text(function (n) {
			return n.longDesc;
		});
	
		node.append('svg:text').text(function (n) {
			return n.dot === false ? n.name : '';
		}).attr('class', function (n) {
			return 'd3-label bg' + ('' + (n.dot === false ? ' segment-label' : ''));
		}).attr('x', '-10px').attr('y', '5px');
	
		node.append('svg:text').text(function (n) {
			return n.dot === false ? n.name : '';
		}).attr('class', function (n) {
			return 'd3-label' + ('' + (n.dot === false ? ' segment-label' : ''));
		}).attr('x', '-10px').attr('y', '5px');
	
		var rootNode = svg.select('.rootNode');
	
		rings.reverse();
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = _getIterator(rings), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var ring = _step.value;
	
				rootNode.append('svg:circle').attr('class', 'background').attr('r', (ring.proportionalSizeEnd * (1 - innerWidth) + innerWidth) * totalRingSize).style('fill', ring.fill);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	
		rings.reverse();
	
		// Add rectangles to hide other quadrants of the circle.
		var rectFill = 'rgba(255, 255, 255, 1)';
		switch (options.quadrant) {
			case 'bottom right':
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', 0).attr('y', -totalRingSize).attr('width', totalRingSize).attr('height', totalRingSize * 2).style('fill', rectFill);
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', 0).attr('width', totalRingSize * 2).attr('height', totalRingSize).style('fill', rectFill);
				break;
			case 'bottom left':
				// Tall Box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', -totalRingSize).attr('width', totalRingSize).attr('height', totalRingSize * 2).style('fill', rectFill);
	
				// Wide box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', 0).attr('width', totalRingSize * 2).attr('height', totalRingSize).style('fill', rectFill);
				break;
			case 'top left':
				// Tall Box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', -totalRingSize).attr('width', totalRingSize).attr('height', totalRingSize * 2).style('fill', rectFill);
	
				// Wide box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', -totalRingSize).attr('width', totalRingSize * 2).attr('height', totalRingSize).style('fill', rectFill);
				break;
			case 'top right':
				// Tall Box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', 0).attr('y', -totalRingSize).attr('width', totalRingSize).attr('height', totalRingSize * 2).style('fill', rectFill);
	
				// Wide box
				rootNode.append('svg:rect').attr('class', 'mask').attr('x', -totalRingSize).attr('y', -totalRingSize).attr('width', totalRingSize * 2).attr('height', totalRingSize).style('fill', rectFill);
				break;
		}
	
		// Draw segment lines
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;
	
		try {
			for (var _iterator2 = _getIterator(segmentLines), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var lineOrigin = _step2.value;
	
				rootNode.append('svg:line').attr('x1', lineOrigin.x).attr('y1', lineOrigin.y).attr('x2', 0).attr('y2', 0).style('stroke', 'rgba(255, 255, 255, 1)');
			}
	
			// Nothing goes in the middle  block it out
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	
		rootNode.append('svg:circle').attr('class', 'background mask').attr('r', totalRingSize * innerWidth).style('fill', 'rgba(255, 255, 255, 1)');
	
		// Ring labels
		(function () {
			var labelX = undefined;
			var labelY = undefined;
			switch (options.quadrant) {
				case 'bottom right':
					labelX = -5;
					labelY = -1;
					break;
				case 'bottom left':
					labelX = 5;
					labelY = -1;
					break;
				case 'top left':
					labelX = 5;
					labelY = 1;
					break;
				case 'top right':
					labelX = -5;
					labelY = 1;
					break;
			}
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;
	
			try {
				for (var _iterator3 = _getIterator(rings), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var ring = _step3.value;
	
					rootNode.append('svg:text').text(ring.groupLabel || ring.min).attr('class', 'd3-label ring-label bg').attr('x', labelX).attr('y', 5 + ((ring.proportionalSizeStart + ring.width / 2) * (1 - innerWidth) + innerWidth) * labelY * totalRingSize + 'px');
					rootNode.append('svg:text').text(ring.groupLabel || ring.min).attr('class', 'd3-label ring-label').attr('x', labelX).attr('y', 5 + ((ring.proportionalSizeStart + ring.width / 2) * (1 - innerWidth) + innerWidth) * labelY * totalRingSize + 'px');
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3['return']) {
						_iterator3['return']();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		})();
	
		force.start();
		labelForce.start();
		var n = 120;
		for (var i = 0; i < n; ++i) {
	
			if (i === 10) {
				links.filter(function (l) {
					return l.toRoot;
				}).forEach(function (l) {
					return l.linkStrength = 0.5;
				});
				force.links(links).start().alpha(0.05);
			}
	
			if (i === 30) {
				links.filter(function (l) {
					return l.toRoot;
				}).forEach(function (l) {
					return l.linkStrength = 10;
				});
				force.links(links).start().alpha(0.05);
			}
	
			force.tick();
			labelForce.tick();
		}
	
		var renderOnTop = svg.append('svg:g').append('svg:use');
	
		return svgNode;
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	'use strict';
	
	var oTracking = __webpack_require__(83).init({
		server: 'https://spoor-api.ft.com/px.gif',
		context: {
			product: 'FTLabs Tech Radar'
		}
	});
	
	function makeTrackingRequest(details) {
	
		var trackingReq = details;
		trackingReq.category = 'ftlabs-tech-radar';
	
		oTracking.event({
			detail: trackingReq
		});
	}
	
	module.exports = makeTrackingRequest;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(84);

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global require, module */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var settings = __webpack_require__(85);
	var user = __webpack_require__(86);
	var session = __webpack_require__(90);
	var send = __webpack_require__(91);
	
	/**
	 * The version of the tracking module.
	 * @type {string}
	 */
	var version = '1.1.8';
	/**
	 * The source of this event.
	 * @type {string}
	 */
	var source = 'o-tracking';
	/**
	 * The API key.
	 * @type {string}
	 */
	var api_key = 'qUb9maKfKbtpRsdp0p2J7uWxRPGJEP';
	
	/**
	 * @class Tracking
	 */
	function Tracking() {
		this.version = version;
		this.source = source;
		this.api_key = api_key;
	
		/**
	  * The initialised state of the object.
	  * @type {boolean}
	  */
		this.initialised = false;
	}
	
	/**
	 * Turn on/off developer mode. (Can also be activated on init.)
	 * @param {boolean} level - Turn on or off, defaults to false if omitted.
	 * @return {undefined}
	 */
	Tracking.prototype.developer = function (level) {
		if (level) {
			settings.set('developer', true);
		} else {
			settings.destroy('developer', null);
			settings.destroy('no_send', null);
		}
	};
	
	/**
	 * Clean up the tracking module.
	 * @return {undefined}
	 */
	Tracking.prototype.destroy = function () {
		this.developer(false);
		this.initialised = false;
	
		settings.destroy('config');
		settings.destroy('page_sent');
	};
	
	/**
	 * Overload toString method to show the version.
	 * @return {string} The module's version.
	 */
	Tracking.prototype.toString = function () {
		return 'oTracking version ' + version;
	};
	
	Tracking.prototype.page = __webpack_require__(97);
	
	Tracking.prototype.event = __webpack_require__(99);
	
	Tracking.prototype.link = __webpack_require__(100);
	
	Tracking.prototype.utils = __webpack_require__(87);
	
	/**
	 * Initialises the Tracking object.
	 *
	 * All options are optional, if a configuration option is missing, the module
	 * will try to initialise using any configuration found in the DOM using the
	 * script config tag.
	 *
	 * @example
	 * <!-- DOM configuration settings -->
	 * <script type='application/json' data-o-tracking-config>
	 * page: {
	 * 	 product: 'desktop'
	 * },
	 * user: {
	 *   user_id: '023ur9jfokwenvcklwnfiwhfoi324'
	 * }
	 * </script>
	 *
	 * @param {Object} config 					- See {@link Tracking} for the configuration options.
	 * @param {boolean} config.developer        - Optional, if `true`, logs certain actions.
	 * @param {boolean} config.noSend           - Optional, if `true`, won't send events.
	 * @param {string} config.configId          - Optional
	 * @param {string} config.session           - Optional
	 *
	 * @return {Tracking} - Returns the tracking object
	 */
	Tracking.prototype.init = function (config) {
		if (this.initialised) {
			return this;
		}
	
		var hasDeclarativeConfig = !!this._getDeclarativeConfigElement();
	
		if (!(hasDeclarativeConfig || config)) {
			return this;
		}
	
		config = config || {};
		if (hasDeclarativeConfig) {
			config = this._getDeclarativeConfig(config);
		}
	
		settings.set('config', config);
		settings.set('version', this.version);
		settings.set('source', this.source);
		settings.set('api_key', this.api_key);
	
		settings.set('page_sent', false);
	
		// Developer mode
		if (config.developer) {
			this.developer(config.developer);
	
			if (config.noSend) {
				settings.set('no_send', true);
			}
		}
	
		// User identifier
		user.init(config.user ? config.user.user_id : null);
	
		// Session
		session.init(config.session);
	
		// Initialize the sending queue.
		var queue = send.init();
	
		// If queue length is very large, could be due to a bug in a previous version
		// This was fixed in 1.0.14 https://github.com/Financial-Times/o-tracking/compare/1.0.13...1.0.14
		// But, still seeing big queues coming through in the data for historical reasons.
		// This tries to catch those big queues and forcibly empty them.
		var queue_length = queue.all().length;
	
		if (queue_length > 200) {
			queue.replace([]);
	
			this.event({ detail: {
					category: 'o-tracking',
					action: 'queue-bug',
					context: {
						queue_length: queue_length
					}
				} });
		}
		this.event.init();
		this.page.init();
		this.initialised = true;
		return this;
	};
	
	/**
	 * Checks if the <script type='application/json' data-o-tracking-config> element is in the DOM
	 * @private
	 * @return {HTMLElement} - Returns the <script> element if found
	 */
	Tracking.prototype._getDeclarativeConfigElement = function () {
		return document.querySelector('script[data-o-tracking-config]');
	};
	
	/**
	 * Initialises additional data using the <script type='application/json' data-o-tracking-config> element in the DOM.
	 * @private
	 * @param {Object} options - A partially, or fully filled options object.  If
	 *                           an option is missing, this method will attempt to
	 *                           initialise it from the DOM.
	 * @return {Object} - The options modified to include the options gathered from the DOM
	 */
	Tracking.prototype._getDeclarativeConfig = function (options) {
		var configEl = this._getDeclarativeConfigElement();
		var declarativeConfigString = undefined;
		if (configEl) {
			declarativeConfigString = configEl.textContent || configEl.innerText || configEl.innerHTML;
		} else {
			return false;
		}
	
		var declarativeOptions = undefined;
	
		try {
			declarativeOptions = JSON.parse(declarativeConfigString);
		} catch (e) {
			var configError = new Error('Invalid JSON configuration syntax, check validity for o-tracking configuration: "' + e.message + '"');
			this.utils.broadcast('oErrors', 'log', {
				error: configError.message,
				info: { module: 'o-tracking' }
			});
			throw configError;
		}
	
		for (var property in declarativeOptions) {
			if (declarativeOptions.hasOwnProperty(property)) {
				options[property] = options[property] || declarativeOptions[property];
			}
		}
	
		return options;
	};
	
	var tracking = new Tracking();
	
	function initialise() {
		tracking.init();
		document.removeEventListener('o.DOMContentLoaded', initialise);
	}
	
	// Try and initialise on o.DOMContentLoaded. If it fails, defer to the
	// consumer of the library.
	document.addEventListener('o.DOMContentLoaded', initialise);
	
	/**
	 * A constructed object, this module is a Singleton as we only want one
	 * instance sending events. See {@link Tracking} for the publicly available
	 * interface.
	 * @type {Tracking}
	 */
	module.exports = tracking;

/***/ },
/* 85 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var settings = {};
	
	/**
	 * Very basic implementation of deep clone, and only supports simple POJO objects and
	 * native arrays.
	 * @param  {*} value Any value
	 * @return {*}       Copy of value
	 * @private
	 */
	function clone(value) {
	  if (value === undefined) {
	    return value;
	  }
	  switch (Object.prototype.toString.call(value)) {
	    case '[object Object]':
	      return JSON.parse(JSON.stringify(value));
	    case '[object Array]':
	      return [].slice.call(value);
	    default:
	      return value;
	  }
	}
	
	/**
	 * Saves a value. Stores a copy rather than a reference, to avoid mutations leaking.
	 *
	 * @param {string} key - The key to use to store the object
	 * @param {*} value - The value
	 * @return {undefined}
	 */
	function setValue(key, value) {
	  settings[key] = clone(value);
	}
	
	/**
	 * Retrieves a value from the settings object. Returns a copy rather than reference, to
	 * avoid mutations leaking.
	 *
	 * @param {string} key - The key to get
	 * @return {*} - The setting.
	 */
	function getValue(key) {
	  return clone(settings[key]);
	}
	
	/**
	 * Deletes a value
	 *
	 * @param  {string} key - The key to delete
	 * @return {undefined}
	 */
	function destroy(key) {
	  delete settings[key];
	}
	
	module.exports = {
	  'set': setValue,
	  'get': getValue,
	  'destroy': destroy
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var _userID = undefined;
	var store = undefined;
	var defaultUserConfig = {
		storage: 'cookie',
		name: 'spoor-id',
		value: null,
		domain: document.URL.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1].indexOf('ft.com') > -1 ? 'ft.com' : null
	};
	
	var utils = __webpack_require__(87);
	var Store = __webpack_require__(89);
	
	/**
	 * migrate_across_domains
	 * Clean up after forgetting to write cookies to the 'root' ft.com domain.
	 * - Check local storage for the 'proper' value.
	 * - If it exists, use it.
	 * - If not, set current user id as the 'proper' value.
	 * - If this value and the cookie match, then we've already fixed it.
	 * - If not, drop the cookie and it will be reset it on the root domain.
	 *
	 * @param {Store} store - The storage instance used for storing the ID.
	 * @param {String} user_id - The user ID to check against storage.
	 * @return {String} - The real user ID.
	 */
	function migrate_across_domains(store, user_id) {
		var ls_name = 'o-tracking-proper-id';
		var proper_id = undefined;
	
		try {
			// This isn't consistent in at least Firefox, maybe more, localstorage seems secured at subdomian level.
			proper_id = utils.getValueFromCookie(ls_name + '=([^;]+)');
	
			if (!proper_id) {
				var d = new Date();
				d.setTime(d.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
				var expires = 'expires=' + d.toGMTString() + ';';
	
				window.document.cookie = ls_name + '=' + utils.encode(user_id) + ';' + expires + 'path=/;domain=.' + defaultUserConfig.domain + ';';
				proper_id = user_id;
			}
		} catch (error) {
			utils.broadcast('oErrors', 'log', {
				error: error.message,
				info: { module: 'o-tracking' }
			});
			proper_id = user_id;
		}
	
		// Expire the cookie on the (sub)domain
		window.document.cookie = 'spoor-id=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
		// Re-set the cookie on the  root domain
		store.write(proper_id);
	
		return proper_id;
	}
	
	/**
	 * Init
	 *
	 * @param {String|Object} value The value of a userID to use or configuration object.
	 * @return {String} - The user ID.
	 */
	function init(value) {
		var config = utils.merge(defaultUserConfig, { value: value });
	
		// config.name is important here, means the user has specifically asked for a cookie name.
		if (config.storage === 'cookie' && config.name) {
			config.nameOverride = config.name;
		}
	
		store = new Store(config.name, config);
	
		_userID = store.read();
	
		if (_userID) {
			_userID = migrate_across_domains(store, _userID);
		}
	
		if (!_userID) {
			_userID = config.value;
		}
	
		if (!_userID) {
			_userID = utils.guid();
		}
	
		store.write(_userID); // Refreshes the cookie...
	
		return _userID;
	}
	
	function destroy() {
		store.destroy();
	}
	
	module.exports = {
		init: init,
		userID: function userID() {
			return _userID;
		},
		destroy: destroy
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require, window */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	/**
	 * Shared 'internal' scope.
	 * @private
	 */
	var settings = __webpack_require__(85);
	
	/**
	 * CUID Generator
	 */
	var cuid = __webpack_require__(88);
	
	/**
	 * Record of callbacks to call when a page is tracked.
	 */
	var page_callbacks = [];
	
	/**
	 * Log messages to the browser console. Requires 'log' to be set on init.
	 *
	 * @param {*} List of objects to log
	 * @return {undefined}
	 */
	function log() {
		if (settings.get('developer') && window.console) {
			for (var i = 0; i < arguments.length; i++) {
				window.console.log(arguments[i]);
			}
		}
	}
	
	/**
	 * Tests if variable is a certain type. Defaults to check for undefined if no type specified.
	 *
	 * @param {*} variable - The variable to check.
	 * @param {string} type - The type to test for. Defaults to undefined.
	 *
	 * @return {boolean} - The answer for if the variable is of type.
	 */
	function is(variable, type) {
		if (!type) {
			type = 'undefined';
		}
		return typeof variable === type;
	}
	
	/**
	 * Merge objects together. Will remove 'falsy' values.
	 *
	 * @param {Object} target - The original object to merge in to.
	 * @param {Object} options - The object to merge into the target. If omitted, will merge target into a new empty Object.
	 *
	 * @return {Object} The merged object.
	 */
	function merge(target, options) {
		if (!options) {
			options = target;
			target = {};
		}
	
		var name = undefined;
		var src = undefined;
		var copy = undefined;
	
		/* jshint -W089 */
		/* eslint guard-for-in: 0 */
		for (name in options) {
			src = target[name];
			copy = options[name];
	
			// Prevent never-ending loop
			if (target === copy) {
				continue;
			}
	
			// Gets rid of missing values too
			if (typeof copy !== 'undefined' && copy !== null) {
				target[name] = src === Object(src) && !is(src, 'function') ? merge(src, copy) : copy;
			}
		}
		/* jshint +W089 */
		/* jslint forin:true */
	
		return target;
	}
	
	/**
	 * URL encode a string.
	 * @param {string} str - The string to be encoded.
	 *
	 * @return {string} The encoded string.
	 */
	function encode(str) {
		if (window.encodeURIComponent) {
			return window.encodeURIComponent(str);
		} else {
			return window.escape(str);
		}
	}
	
	/**
	 * URL decode a string.
	 * @param {string} str - The string to be decoded.
	 *
	 * @return {string} The decoded string.
	 */
	function decode(str) {
		if (window.decodeURIComponent) {
			return window.decodeURIComponent(str);
		} else {
			return window.unescape(str);
		}
	}
	
	/*
	 * Utility to add event listeners.
	 *
	 * @param {Element} element
	 * @param {string} event
	 * @param {Function} listener
	 */
	function addEvent(element, event, listener) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, false);
		} else {
			element.attachEvent('on' + event, listener);
		}
	}
	
	/*
	 * Utility for dispatching custom events from window
	 *
	 * @param {string} namespace
	 * @param {string} eventType
	 * @param {Object} detail
	 */
	function broadcast(namespace, eventType, detail) {
		detail = detail || {};
		try {
			window.dispatchEvent(new CustomEvent(namespace + '.' + eventType, {
				detail: detail,
				bubbles: true
			}));
		} catch (error) {}
	}
	
	/**
	 * Listen for page tracking requests.
	 *
	 * @param {Function} cb - The callback to be called whenever a page is tracked.
	 * @return {undefined}
	 */
	function onPage(cb) {
		if (is(cb, 'function')) {
			page_callbacks.push(cb);
		}
	}
	
	/**
	 * Trigger the 'page' listeners.
	 * @return {undefined}
	 */
	function triggerPage() {
		for (var i = 0; i < page_callbacks.length; i++) {
			page_callbacks[i]();
		}
	}
	
	/**
	 * Get a value from document.cookie matching the first match of the regexp you supply
	 * @param {RegExp} matcher - The Regex to match with
	 * @return {String} - The vale from the cookie
	 */
	function getValueFromCookie(matcher) {
		return document.cookie.match(matcher) && RegExp.$1 !== '' && RegExp.$1 !== 'null' ? RegExp.$1 : null;
	}
	
	/**
	 * Get a value from the url, used for uuid or querystring parameters
	 * @param {RegExp} matcher - The Regex to match with
	 * @return {String} - The value from the URL
	 */
	function getValueFromUrl(matcher) {
		return document.location.href.match(matcher) && RegExp.$1 !== '' ? RegExp.$1 : null;
	}
	
	/**
	 * Get a value from a specified JavaScript variable.
	 * @param {String} str - The name of variable, in dot syntax.
	 * @return {String} The value from the JS variable.
	 */
	function getValueFromJsVariable(str) {
		if (typeof str !== 'string') {
			return null;
		}
	
		var i = undefined;
		var namespaces = str.split('.');
		var test = window;
	
		for (i = 0; i < namespaces.length; i = i + 1) {
			if (typeof test[namespaces[i]] === 'undefined') {
				return null;
			}
	
			test = test[namespaces[i]];
		}
	
		return test !== '' ? test : null;
	}
	
	module.exports = {
		log: log,
		is: is,
		isUndefined: is,
		merge: merge,
		encode: encode,
		decode: decode,
		guid: cuid,
		addEvent: addEvent,
		broadcast: broadcast,
		onPage: onPage,
		triggerPage: triggerPage,
		getValueFromCookie: getValueFromCookie,
		getValueFromUrl: getValueFromUrl,
		getValueFromJsVariable: getValueFromJsVariable
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*eslint-disable*/
	/**
	 * cuid.js
	 * Collision-resistant UID generator for browsers and node.
	 * Sequential for fast db lookups and recency sorting.
	 * Safe for element IDs and server-side lookups.
	 *
	 * Extracted from CLCTR
	 *
	 * Copyright (c) Eric Elliott 2012
	 * MIT License
	 */
	
	/*global window, navigator, document, require, process, module */
	(function (app) {
	  'use strict';
	  var namespace = 'cuid',
	      c = 0,
	      blockSize = 4,
	      base = 36,
	      discreteValues = Math.pow(base, blockSize),
	      pad = function pad(num, size) {
	    var s = "000000000" + num;
	    return s.substr(s.length - size);
	  },
	      randomBlock = function randomBlock() {
	    return pad((Math.random() * discreteValues << 0).toString(base), blockSize);
	  },
	      safeCounter = function safeCounter() {
	    c = c < discreteValues ? c : 0;
	    c++; // this is not subliminal
	    return c - 1;
	  },
	      api = function cuid() {
	    // Starting with a lowercase letter makes
	    // it HTML element ID friendly.
	    var letter = 'c',
	        // hard-coded allows for sequential access
	
	    // timestamp
	    // warning: this exposes the exact date and time
	    // that the uid was created.
	    timestamp = new Date().getTime().toString(base),
	
	    // Prevent same-machine collisions.
	    counter,
	
	    // A few chars to generate distinct ids for different
	    // clients (so different computers are far less
	    // likely to generate the same id)
	    fingerprint = api.fingerprint(),
	
	    // Grab some more chars from Math.random()
	    random = randomBlock() + randomBlock();
	
	    counter = pad(safeCounter().toString(base), blockSize);
	
	    return letter + timestamp + counter + fingerprint + random;
	  };
	
	  api.slug = function slug() {
	    var date = new Date().getTime().toString(36),
	        counter,
	        print = api.fingerprint().slice(0, 1) + api.fingerprint().slice(-1),
	        random = randomBlock().slice(-2);
	
	    counter = safeCounter().toString(36).slice(-4);
	
	    return date.slice(-2) + counter + print + random;
	  };
	
	  api.globalCount = function globalCount() {
	    // We want to cache the results of this
	    var cache = (function calc() {
	      var i,
	          count = 0;
	
	      for (i in window) {
	        count++;
	      }
	
	      return count;
	    })();
	
	    api.globalCount = function () {
	      return cache;
	    };
	    return cache;
	  };
	
	  api.fingerprint = function browserPrint() {
	    return pad((navigator.mimeTypes.length + navigator.userAgent.length).toString(36) + api.globalCount().toString(36), 4);
	  };
	
	  // don't change anything from here down.
	  if (true) {
	    module.exports = api;
	  } else {
	    app[namespace] = api;
	  }
	})(undefined);
	/*eslint-enable */

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require, window */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	/**
	 * Class for storing data
	 * Will choose the 'best' storage method available. Can also specify a type of storage.
	 *
	 * @class  Store
	 * @param {string} name - The name of the store
	 * @param {Object} config - Optional, config object for extra configuration
	 */
	var Store = function Store(name, config) {
	
		/**
	  * Internal Storage key prefix.
	  */
		var keyPrefix = 'o-tracking';
	
		/**
	  * Temporary var containing data from a previously saved store.
	  * @property loadStore
	  */
		var loadStore = undefined;
		var utils = __webpack_require__(87);
	
		if (utils.isUndefined(name)) {
			var undefinedName = new Error('You must specify a name for the store.');
			utils.broadcast('oErrors', 'log', {
				error: undefinedName.message,
				info: { module: 'o-tracking' }
			});
			throw undefinedName;
		}
	
		this.config = utils.merge({ storage: 'best', expires: 10 * 365 * 24 * 60 * 60 * 1000 }, config);
	
		/**
	  * Store data.
	  */
		this.data = null;
	
		/**
	  * The key/name of this store.
	  */
		this.storageKey = this.config.hasOwnProperty('nameOverride') ? this.config.nameOverride : [keyPrefix, name].join('_');
	
		/**
	  * The storage method to use. Determines best storage method.
	  *
	  * @type {Object}
	  */
		this.storage = (function (config, window) {
			var test_key = keyPrefix + '_InternalTest';
	
			// If cookie has been manually specified, don't bother with local storage.
			if (config.storage !== 'cookie') {
				try {
					if (window.localStorage) {
						window.localStorage.setItem(test_key, 'TEST');
	
						if (window.localStorage.getItem(test_key) === 'TEST') {
							window.localStorage.removeItem(test_key);
							return {
								_type: 'localStorage',
								load: function load(name) {
									return window.localStorage.getItem.call(window.localStorage, name);
								},
								save: function save(name, value) {
									return window.localStorage.setItem.call(window.localStorage, name, value);
								},
								remove: function remove(name) {
									return window.localStorage.removeItem.call(window.localStorage, name);
								}
							};
						}
					}
				} catch (error) {
					utils.broadcast('oErrors', 'log', {
						error: error.message,
						info: { module: 'o-tracking' }
					});
				}
			}
	
			function cookieLoad(name) {
				name = name + '=';
	
				var cookies = window.document.cookie.split(';');
				var i = undefined;
				var cookie = undefined;
	
				for (i = 0; i < cookies.length; i = i + 1) {
					cookie = cookies[i].replace(/^\s+|\s+$/g, '');
					if (cookie.indexOf(name) === 0) {
						return utils.decode(cookie.substring(name.length, cookie.length));
					}
				}
	
				return null;
			}
	
			function cookieSave(name, value, expiry) {
				var d = undefined;
				var expires = '';
				var cookie = undefined;
	
				if (utils.is(expiry, 'number')) {
					d = new Date();
					d.setTime(d.getTime() + expiry);
					expires = 'expires=' + d.toGMTString() + ';';
				}
	
				cookie = utils.encode(name) + '=' + utils.encode(value) + ';' + expires + 'path=/;' + (config.domain ? 'domain=.' + config.domain + ';' : '');
				window.document.cookie = cookie;
			}
	
			function cookieRemove(name) {
				cookieSave(name, '', -1);
			}
	
			cookieSave(test_key, 'TEST');
	
			if (cookieLoad(test_key) === 'TEST') {
				cookieRemove(test_key);
	
				return {
					_type: 'cookie',
					load: cookieLoad,
					save: cookieSave,
					remove: cookieRemove
				};
			}
	
			return {
				_type: 'none',
				load: function load() {},
				save: function save() {},
				remove: function remove() {}
			};
		})(this.config, window);
	
		// Retrieve any previous store with the same name.
		loadStore = this.storage.load(this.storageKey);
		if (loadStore) {
			try {
				this.data = JSON.parse(loadStore);
			} catch (error) {
				utils.broadcast('oErrors', 'log', {
					error: error.message,
					module: 'o-tracking'
				});
				this.data = loadStore;
			}
		}
	
		return this;
	};
	
	/**
	 * Get/Read the current data.
	 *
	 * @return {Object} Returns the data from the store.
	 */
	Store.prototype.read = function () {
		return this.data;
	};
	
	/**
	 * Write the supplied data to the store.
	 *
	 * @param {String} data - The data to write.
	 * @return {Store} - The instance of the store
	 */
	Store.prototype.write = function (data) {
		// Set this.data, in-case we're on a file:// domain and can't set cookies.
		this.data = data;
		this.storage.save(this.storageKey, typeof this.data === 'string' ? this.data : JSON.stringify(this.data), this.config.expires);
	
		return this;
	};
	
	/**
	 * Delete the current data.
	 * @return {Store} - The instance of the store
	 */
	Store.prototype.destroy = function () {
		this.data = null;
		this.storage.remove(this.storageKey);
		return this;
	};
	
	module.exports = Store;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var store = undefined;
	var defaultSessionConfig = {
		storage: 'best',
		name: 'session',
		expires: 30 * 60 * 1000 // 30 minutes
	};
	
	var utils = __webpack_require__(87);
	var Store = __webpack_require__(89);
	
	/**
	 * Set the session in the store.
	 *
	 * @param {String} session - The session to be stored.
	 * @return {undefined}
	 */
	function setSession(session) {
		var d = new Date();
		d.setTime(d.getTime() + store.config.expires);
	
		store.write({
			value: session,
			expiry: d.valueOf()
		});
	}
	
	/**
	 * Get the session from the store. Expiry and gen of a new session are handled here.
	 *
	 * @return {Object} the current session
	 */
	function getSession() {
		var s = store.read();
		var session = undefined;
		var isNew = false;
	
		if (s) {
			var d = new Date().valueOf();
			var exp = parseInt(s.expiry);
	
			// If current session is active.
			if (exp >= d) {
				session = s.value;
			}
		}
	
		// No active session, gen a new one.
		if (!session) {
			session = utils.guid();
			isNew = true;
		}
	
		// Refreshes the cookie...
		setSession(session);
	
		return {
			id: session,
			isNew: isNew
		};
	}
	
	/**
	 * Init
	 *
	 * @param {String|Object} config The name used to store the session or configuration object.
	 * @return {Session} - The session
	 */
	function init(config) {
		if (utils.is(config, 'string')) {
			config = { name: config };
		}
	
		if (utils.isUndefined(config)) {
			config = {};
		}
	
		var c = utils.merge(defaultSessionConfig, config);
	
		// config.name is important here, means the user has specifically asked for a cookie name.
		if (c.storage === 'cookie' && config.name) {
			c.nameOverride = c.name;
		}
	
		store = new Store(c.name, c);
	
		return getSession();
	}
	
	module.exports = {
		init: init,
		session: getSession
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _Promise = __webpack_require__(61)['default'];
	
	var define = false;
	
	/*global module, require, window */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var settings = __webpack_require__(85);
	var utils = __webpack_require__(87);
	var Queue = __webpack_require__(92);
	var transports = __webpack_require__(93);
	/**
	 * Default collection server.
	 */
	var domain = 'http://test.spoor-api.ft.com';
	
	/**
	 * Queue queue.
	 *
	 * @type {Queue}
	 */
	var queue = undefined;
	
	/**
	 * Consistent check to see if we should use sendBeacon or not.
	 *
	 * @return {boolean}
	 */
	function should_use_sendBeacon() {
		return navigator.sendBeacon && _Promise && (settings.get('config') || {}).useSendBeacon;
	}
	
	/**
	 * Attempts to send a tracking request.
	 *
	 * @param {Object} request The request to be sent.
	 * @param {Function} callback Callback to fire the next item in the queue.
	 * @return {undefined}
	 */
	function sendRequest(request, callback) {
		var queueTime = request.queueTime;
		var offlineLag = new Date().getTime() - queueTime;
		var path = undefined;
		var transport = should_use_sendBeacon() ? transports.get('sendBeacon')() : window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest() ? transports.get('xhr')() : transports.get('image')();
		var user_callback = request.callback;
	
		var core_system = settings.get('config') && settings.get('config').system || {};
		var system = utils.merge(core_system, {
			api_key: settings.get('api_key'), // String - API key - Make sure the request is from a valid client (idea nicked from Keen.io) useful if a page gets copied onto a Russian website and creates noise
			version: settings.get('version'), // Version of the tracking client e.g. '1.2'
			source: settings.get('source') });
	
		// Source of the tracking client e.g. 'o-tracking'
		request = utils.merge({ system: system }, request);
	
		// Only bothered about offlineLag if it's longer than a second, but less than 12 months. (Especially as Date can be dodgy)
		if (offlineLag > 1000 && offlineLag < 12 * 30 * 24 * 60 * 60 * 1000) {
			request.time = request.time || {};
			request.time.offset = offlineLag;
		}
		delete request.callback;
		delete request.async;
		delete request.type;
		delete request.queueTime;
	
		utils.log('user_callback', user_callback);
		utils.log('PreSend', request);
	
		path = JSON.stringify(request);
	
		utils.log('path', path);
	
		transport.complete(function (error) {
			if (utils.is(user_callback, 'function')) {
				user_callback.call(request);
				utils.log('calling user_callback');
			}
	
			if (error) {
				// Re-add to the queue if it failed.
				// Re-apply queueTime here
				request.queueTime = queueTime;
				queue.add(request).save();
	
				utils.broadcast('oErrors', 'log', {
					error: error.message,
					info: { module: 'o-tracking' }
				});
			} else {
				callback && callback();
			}
		});
	
		// Both developer and noSend flags have to be set to stop the request sending.
		if (!(settings.get('developer') && settings.get('no_send'))) {
			transport.send(domain, path);
		}
	}
	
	/**
	 * Adds a new request to the list of pending requests
	 *
	 * @param {Tracking} request The request to queue
	 * @return {undefined}
	 */
	function add(request) {
		request.queueTime = new Date().getTime();
		if (should_use_sendBeacon()) {
			sendRequest(request);
		} else {
			queue.add(request).save();
		}
		utils.log('AddedToQueue', queue);
	}
	
	/**
	 * If there are any requests queued, attempts to send the next one
	 * Otherwise, does nothing
	 * @param {Function} callback - Optional callback
	 * @return {undefined}
	 */
	function run(callback) {
		if (utils.isUndefined(callback)) {
			callback = function () {};
		}
	
		var next = function next() {
			run();
			callback();
		};
		var nextRequest = queue.shift();
	
		// Cancel if we've run out of requests.
		if (!nextRequest) {
			return callback();
		}
	
		// Send this request, then try run again.
		return sendRequest(nextRequest, next);
	}
	
	/**
	 * Convenience function to add and run a request all in one go.
	 *
	 * @param {Object} request The request to queue and run.
	 * @return {undefined}
	 */
	function addAndRun(request) {
		add(request);
		run();
	}
	
	/**
	 * Init the queue and send any leftover events.
	 * @return {undefined}
	 */
	function init() {
		queue = new Queue('requests');
	
		if (settings.get('config') && settings.get('config').server) {
			domain = settings.get('config').server;
		}
	
		// If any tracking calls are made whilst offline, try sending them the next time the device comes online
		utils.addEvent(window, 'online', run);
	
		// On startup, try sending any requests queued from a previous session.
		run();
	
		return queue;
	}
	
	module.exports = {
		init: init,
		add: add,
		run: run,
		addAndRun: addAndRun
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var utils = __webpack_require__(87);
	var Store = __webpack_require__(89);
	
	/**
	 * Class for handling a queue backed up by a store.
	 * @class Queue
	 *
	 * @param {String} name - The name of the queue.
	 * @return {Queue} - Returns the instance of the queue.
	 */
	var Queue = function Queue(name) {
		if (utils.isUndefined(name)) {
			var undefinedName = new Error('You must specify a name for the queue.');
			utils.broadcast('oErrors', 'log', {
				error: undefinedName.message,
				info: { module: 'o-tracking' }
			});
			throw undefinedName;
		}
	
		/**
	  * Queue data.
	  * @type {Array}
	  */
		this.queue = [];
	
		/**
	  * The storage method to use. Determines best storage method.
	  * @type {Object}
	  */
		this.storage = new Store(name);
	
		// Retrieve any previous store with the same name.
		if (this.storage.read()) {
			this.queue = this.storage.read();
		}
	
		return this;
	};
	
	/**
	 * Gets the contents of the store.
	 *
	 * @return {Array} The array of items.
	 */
	Queue.prototype.all = function () {
		if (this.queue.length === 0) {
			return [];
		}
	
		var items = [];
	
		for (var i = 0; i < this.queue.length; i = i + 1) {
			items.push(this.queue[i].item);
		}
	
		return items;
	};
	
	/**
	 * Gets the first item in the store.
	 *
	 * @return {Object} Returns the item.
	 */
	Queue.prototype.first = function () {
		if (this.queue.length === 0) {
			return null;
		}
	
		return this.queue[0].item;
	};
	
	/**
	 * Gets the last item in the store.
	 *
	 * @return {Object} Returns the item.
	 */
	Queue.prototype.last = function () {
		if (this.queue.length === 0) {
			return null;
		}
	
		return this.queue.slice(-1)[0].item;
	};
	
	/**
	 * Add data to the store.
	 *
	 * @param {Object} item - An item or an array of items.
	 *
	 * @return {Queue} - Returns the instance of the queue.
	 */
	Queue.prototype.add = function (item) {
		// I was trying to turn this whole add function into a little module, to stop doAdd function being created everytime, but couldn't work out how to get to 'this' from within the module.
	
		var self = this;
		var i = undefined;
	
		function doAdd(item) {
			self.queue.push({
				created_at: new Date().valueOf(),
				item: item
			});
		}
	
		if (utils.is(item, 'object') && item.constructor.toString().match(/array/i)) {
			for (i = 0; i < item.length; i = i + 1) {
				doAdd(item[i]);
			}
		} else {
			doAdd(item);
		}
	
		return self;
	};
	
	/**
	 * Overwrite the store with something completely new.
	 *
	 * @param {Array} items The new array of data.
	 *
	 * @return {Queue} - Returns the instance of the queue.
	 */
	Queue.prototype.replace = function (items) {
		if (utils.is(items, 'object') && items.constructor.toString().match(/array/i)) {
			this.queue = [];
			this.add(items).save();
	
			return this;
		}
	
		var invalidArg = new Error('Argument invalid, must be an array.');
		utils.broadcast('oErrors', 'log', {
			error: invalidArg.message,
			info: { module: 'o-tracking' }
		});
		throw invalidArg;
	};
	
	/**
	 * Pop the first item from the queue.
	 *
	 * @return {Object} The item.
	 */
	Queue.prototype.shift = function () {
		if (this.queue.length === 0) {
			return null;
		}
	
		var item = this.queue.shift().item;
	
		this.save();
	
		return item;
	};
	
	/**
	 * Save the current store to localStorage so that old requests can still be sent after a page refresh.
	 *
	 * @return {Queue} - Returns the instance of the queue.
	 */
	Queue.prototype.save = function () {
		this.storage.write(this.queue);
	
		return this;
	};
	
	module.exports = Queue;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	module.exports = {
		xhr: __webpack_require__(94),
		sendBeacon: __webpack_require__(95),
		image: __webpack_require__(96),
		get: function get(name) {
			return this.mock || this[name];
		}
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	module.exports = function () {
		var xhr = new window.XMLHttpRequest();
	
		return {
			send: function send(url, data) {
				xhr.open('POST', url, true);
				xhr.withCredentials = true;
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.send(data);
			},
			complete: function complete(callback) {
				xhr.onerror = function () {
					callback(this);
				};
				xhr.onload = function () {
					if (xhr.status >= 200 && xhr.status < 300) {
						callback();
					} else {
						callback('Incorrect response: ' + xhr.status);
					}
				};
			}
		};
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _Promise = __webpack_require__(61)['default'];
	
	var define = false;
	
	module.exports = function () {
	    var resolver = undefined;
	    var rejecter = undefined;
	    var p = new _Promise(function (resolve, reject) {
	        resolver = resolve;
	        rejecter = reject;
	    });
	    return {
	        send: function send(url, data) {
	            if (navigator.sendBeacon(url, data)) {
	                resolver();
	            } else {
	                rejecter(new Error('Failed to send beacon event: ' + data.toString()));
	            }
	        },
	        complete: function complete(callback) {
	            callback && p.then(callback, callback);
	        }
	    };
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	var utils = __webpack_require__(87);
	
	module.exports = function () {
		var image = new Image(1, 1);
	
		return {
			send: function send(url, data) {
				image.src = url + '?data=' + utils.encode(data);
			},
			complete: function complete(callback) {
				if (image.addEventListener) {
					image.addEventListener('error', callback);
					image.addEventListener('load', function () {
						return callback();
					});
				} else {
					// it's IE!
					image.attachEvent('onerror', callback);
					image.attachEvent('onload', function () {
						return callback();
					});
				}
			}
		};
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var Core = __webpack_require__(98);
	var utils = __webpack_require__(87);
	
	/**
	 * Default properties for page tracking requests.
	 *
	 * @return {Object} - The default properties for pages.
	 */
	var defaultPageConfig = function defaultPageConfig() {
		return {
			category: 'page',
			action: 'view',
			context: {
				url: document.URL,
				referrer: document.referrer
			},
	
			async: true // Send this event asyncronously - as sync doesn't work in FF, as it doesn't send cookies. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#withCredentials
		};
	};
	
	/**
	 * Make the page tracking request.
	 *
	 * @param {Object} config - Configuration object. If omitted, will use the defaults.
	 * @param {Function} callback - Callback function. Called when request completed.
	 * @return {undefined}
	 */
	function page(config, callback) {
		config = utils.merge(defaultPageConfig(), {
			context: config
		});
	
		// New PageID for a new Page.
		Core.setRootID();
		Core.track(config, callback);
	
		// Alert internally that a new page has been tracked - for single page apps for example.
		utils.triggerPage();
	}
	
	/**
	 * Listener for pages.
	 *
	 * @param {CustomEvent} e - The CustomEvent
	 * @private
	 * @return {undefined}
	 */
	function listener(e) {
		page(e.detail);
	}
	
	module.exports = page;
	module.exports.init = function () {
		utils.addEvent(window, 'oTracking.page', listener);
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var Send = __webpack_require__(91);
	var User = __webpack_require__(86);
	var Session = __webpack_require__(90);
	
	/**
	 * Shared 'internal' scope.
	 * @type {Object}
	 */
	var settings = __webpack_require__(85);
	var utils = __webpack_require__(87);
	
	/**
	 * Default properties for sending a tracking request.
	 * @type {Object}
	 * @return {Object} - The default settings for the component.
	 */
	var defaultConfig = function defaultConfig() {
		return {
			async: true,
			callback: function callback() {},
			system: {},
			context: {},
			user: {
				passport_id: utils.getValueFromCookie(/USERID=([0-9]+):/) || utils.getValueFromCookie(/PID=([0-9]+)\_/),
				ft_session: utils.getValueFromCookie(/FTSession=([^;]+)/)
			}
		};
	};
	
	/**
	 * Generate and store a new rootID.
	 * @param {string} new_id - Optional rootID, if you want to use your own. Otherwise we'll create one for you.
	 * @return {string|*} The rootID.
	 */
	function setRootID(new_id) {
		settings.set('root_id', requestID(new_id));
		return settings.get('root_id');
	}
	
	/**
	 * Get rootID.
	 * @return {string|*} The rootID.
	 */
	function getRootID() {
		var root_id = settings.get('root_id');
	
		if (utils.isUndefined(root_id)) {
			root_id = setRootID();
		}
	
		return root_id;
	}
	
	/**
	 * Create a requestID (unique identifier) for the page impression.
	 *
	 * @param {string} request_id - Optional RequestID, if you want to use your own. Otherwise will create one for you.
	 *
	 * @return {string|*} The RequestID.
	 */
	function requestID(request_id) {
		if (utils.isUndefined(request_id)) {
			request_id = utils.guid();
		}
	
		return request_id;
	}
	
	/**
	 * Make a tracking request.
	 *
	 * @param {Object} config - Should be passed an object containing a format and the values for that format
	 * @param {function} callback - Fired when the request has been made.
	 *
	 * @return {Object} request
	 */
	function track(config, callback) {
		if (utils.isUndefined(callback)) {
			callback = function () {};
		}
	
		var coreContext = settings.get('config') && settings.get('config').context || {};
		config.context = utils.merge(coreContext, config.context);
	
		var request = utils.merge(defaultConfig(), utils.merge(config, { callback: callback }));
	
		var session = Session.session();
	
		/* Values here are kinda the mandatory ones, so we want to make sure they're possible. */
		request = utils.merge({
			context: {
				id: requestID(request.id), // Keep an ID if it's been set elsewhere.
				root_id: getRootID()
			},
	
			user: settings.get('config') ? settings.get('config').user : {},
	
			device: {
				spoor_session: session.id,
				spoor_session_is_new: session.isNew,
				spoor_id: User.userID()
			}
		}, request);
	
		utils.log('Core.Track', request);
		// Send it.
		Send.addAndRun(request);
	
		return request;
	}
	
	module.exports = {
		setRootID: setRootID,
		getRootID: getRootID,
		track: track
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var Core = __webpack_require__(98);
	var utils = __webpack_require__(87);
	
	/**
	 * Default properties for events.
	 *
	 * @type {Object}
	 * @return {Object} - Default configuration for events
	 */
	var defaultEventConfig = function defaultEventConfig() {
		return {
			category: 'event',
			action: 'generic',
			context: {}
		};
	};
	
	/**
	 * Track an event.
	 *
	 * @param {Event} trackingEvent - The event, which could the following properties in its 'detail' key:
	 *   [category] - The category, for example: video
	 *   [action] - The action performed, for example: play
	 *   [component_id] - Optional. The ID for the component instance.
	 *
	 * @param {Function} callback - Optional, Callback function. Called when request completed.
	 * @return {undefined}
	 */
	function event(trackingEvent, callback) {
		if (utils.is(trackingEvent.detail.category) || utils.is(trackingEvent.detail.action)) {
			var noCategoryActionVals = 'Missing category or action values';
			utils.broadcast('oErrors', 'log', {
				error: noCategoryActionVals,
				info: { module: 'o-tracking' }
			});
			throw noCategoryActionVals;
		}
	
		var config = utils.merge(defaultEventConfig(), {
			category: trackingEvent.detail.category,
			action: trackingEvent.detail.action,
			context: trackingEvent.detail
		});
	
		delete config.context.category;
		delete config.context.action;
	
		var origamiElement = getOrigamiEventTarget(trackingEvent);
		if (origamiElement) {
			config.context.component_name = origamiElement.getAttribute('data-o-component');
			config.context.component_id = config.context.component_id || getComponentId(origamiElement);
		} else {
			config.context.component_name = config.context.component_name;
			config.context.component_id = config.context.component_id;
		}
	
		Core.track(config, callback);
	}
	
	/**
	 * Helper function that gets the target of an event if it's an Origami component
	 * @param  {Event} event - The event triggered.
	 * @return {HTMLElement|undefined} - Returns the HTML element if an Origami component, else undefined.
	 */
	function getOrigamiEventTarget(event) {
		// IE backwards compatibility (get the actual target). If not IE, uses
		// `event.target`
		var element = event.target || event.srcElement;
	
		if (element && element.getAttribute('data-o-component')) {
			return element;
		} else {
			return;
		}
	}
	
	/**
	 * Helper function that generates a component id based on its xpath
	 *
	 * @param {HTMLElement} element - The HTML Element to gen an ID for.
	 *
	 * @return {string} hash
	 */
	function getComponentId(element) {
		var path = _getElementPath(element);
	
		if (typeof path === 'undefined') {
			return;
		}
	
		// Select the source element (first item in the ordered sequence `path`)
		var srcElement = path[0];
	
		// Because, you could have two identical elements in the DOM as siblings,
		// we need to determine the 'sibling index': the order they're sitting within a DOM node.
		// Although in reality this is unlikely to always be the same, it's just a
		// best guess - unless child elements are always appended to an element rather than added as the first child.
		var siblingIndex = (function getSiblingIndex(element) {
			var srcParent = element.parentElement;
			if (srcParent) {
				for (var i = 0; i < srcParent.childNodes.length; i++) {
					if (srcParent.childNodes[i] === srcElement) {
						return i;
					}
				}
				return -1;
			} else {
				return 0;
			}
		})(srcElement);
	
		// Generate a normalised string (normalising browser quirks) from the sequence of elements
		var normalisedStringPath = path.reduceRight(function (builder, el) {
			if (!el.nodeName) {
				return builder + ' - ' + el.constructor.name + '\n';
			}
	
			var nodeName = el.nodeName.toLowerCase();
	
			// In some browsers, document is prepended with a '#'
			if (nodeName.indexOf('#') === 0) {
				return builder + '<' + nodeName + '>';
			}
	
			// Replace this stuff with stuff that makes each node unique - without including styling detail (as this may change depending on animation state etc, position)
			return builder + '<' + nodeName + ' id="' + (el.id || '') + '">';
		}, '');
	
		// Append a sibling index to the string and use some simple, off the shelf string hashing algorithm.
		return _generateHash(normalisedStringPath + '_siblingIndex=' + siblingIndex);
	}
	
	/**
	 * Gets the xpath for an element
	 *
	 * @param  {HTMLElement} element - The element to get a path for.
	 *
	 * @private
	 *
	 * @return {array} The xpath
	 */
	function _getElementPath(element) {
		var path = [];
	
		while (element) {
			path.push(element);
			element = element.parentElement;
		}
	
		return path;
	}
	
	/**
	 * JS Implementation of MurmurHash2
	 *
	 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
	 * @see http://github.com/garycourt/murmurhash-js
	 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
	 * @see http://sites.google.com/site/murmurhash/
	 * Copyright (c) 2011 Gary Court
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 *
	 * @param {string} str  - The string to hash, ASCII only.
	 *
	 * @return {number} 32-bit positive integer hash
	 *
	 * @private
	 */
	function _generateHash(str) {
		var l = str.length;
		var h = 1 ^ l;
		var i = 0;
		var k = undefined;
	
		while (l >= 4) {
			k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
	
			k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
			k ^= k >>> 24;
			k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
	
			h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
	
			l -= 4;
			++i;
		}
	
		switch (l) {
			case 3:
				h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
				break;
			case 2:
				h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
				break;
			case 1:
				h ^= str.charCodeAt(i) & 0xff;
				h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
		}
	
		h ^= h >>> 13;
		h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
		h ^= h >>> 15;
	
		return h >>> 0;
	}
	
	module.exports = event;
	module.exports.init = function () {
		utils.addEvent(window, 'oTracking.event', event);
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global module, require, window */
	/*eslint-disable*/
	'use strict';
	/*eslint-enable*/
	
	var Queue = __webpack_require__(92);
	var Core = __webpack_require__(98);
	var utils = __webpack_require__(87);
	var internalQueue = undefined;
	
	/**
	 * Default properties for events.
	 *
	 * @type {Object}
	 * @return {Object} The default link configuration.
	 */
	var defaultLinkConfig = function defaultLinkConfig() {
		return {
			category: 'link',
			action: 'click',
			context: {}
		};
	};
	
	var callback = function callback() {};
	
	/**
	 * Check if a URL is going to the same site (internal)
	 *
	 * @param {string} url - The url to check.
	 *
	 * @return {boolean} - Result of internal url.
	 * @private
	 */
	function isInternal(url) {
		return url.indexOf(window.document.location.hostname) > -1;
	}
	
	/**
	 * Check if a URL is going to an external site.
	 *
	 * @param {string} url - The url to check.
	 *
	 * @return {boolean} - The result of external url.
	 * @private
	 */
	function isExternal(url) {
		return !isInternal(url);
	}
	
	/**
	 * Checks if a URL is pointing at a file.
	 * NOTE: Don't want to maintain a list of file extensions, so try best guess.
	 *
	 * @param {string} url - The url to check.
	 *
	 * @return {boolean} - The result if a url is a file location.
	 * @private
	 */
	function isFile(url) {
		var path = url.replace(/^\w+:\/\//, '').replace(/(#|\?).+/g, '').replace(/\/$/, '');
	
		// It must have a slash to have a file path
		if (path.indexOf('/') === -1) {
			return false;
		}
	
		// No extension
		if (!path.match(/\.(\w{2,4})$/)) {
			return false;
		}
	
		// Obviously a web page.
		if (['html', 'htm', 'php'].indexOf(RegExp.$1) > -1) {
			return false;
		}
	
		return true;
	}
	
	/**
	 * Calculates the parents of a HTML element.
	 *
	 * @param {Element} element - The starting element.
	 *
	 * @return {array} The tree of parent elements.
	 * @private
	 */
	function parentTree(element) {
		if (!element) {
			return [];
		}
	
		var tree = [element];
	
		if (element.nodeName === 'BODY') {
			return tree;
		}
	
		return tree.concat(parentTree(element.parentElement));
	}
	
	/**
	 * Create the identifier of the link. TODO: https://rally1.rallydev.com/#/16966478977d/detail/defect/17919485944
	 *
	 * @param {Element} link - The link element.
	 *
	 * @return {string} The ID for the link.
	 * @private
	 */
	function createLinkID(link) {
		var parents = parentTree(link);
		var name = link.href || link.text || link.name || link.id;
	
		name = name.replace(/^http:\/\/[\w\.\:]+/, '') // Remove http://[something].
		.replace(/^\//, '') // Remove slash at beginning
		.replace(/(\?|#).*$/, '') // Remove query string and page anchor (#)
		.replace(/\/$/, '') // Remove trailing slash
		.replace(/\.[a-z]{3,4}$/, ''); // Remove final '.com' or similar
	
		// If it's an external URL
		if (name === '') {
			name = link.href.replace(/^http:\/\//, '').split('?')[0].replace(/\/$/, '');
		}
	
		// Last 2 items of URL
		name = name.split('/').slice(-2).filter(function (obj) {
			return obj;
		});
	
		// If uuid then take final value only
		if (name.slice(-1)[0].match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)) {
			name = name.slice(-1);
		}
	
		// Remove slashes as final outcome is slash delimited
		name = (name.length > 1 ? name.slice(0, 2).join('-') : name[0]).toLowerCase();
	
		return parents.map(function (p) {
			return p.tagName.toLowerCase();
		}).filter(function (e, i, arr) {
			return arr.lastIndexOf(e) === i;
		}).reverse().join('/') + '/' + name;
	}
	
	/**
	 * Track the link.
	 *
	 * @param {Element} element - The element being tracked.
	 *
	 * @return {Object|boolean} - If synscronous, returns when the tracking event is sent, if async, returns true immediately.
	 */
	function track(element) {
		var linkID = createLinkID(element);
		var config = utils.merge(defaultLinkConfig(), {
			context: {
				link: {
					id: linkID,
					source_id: Core.getRootID(),
					href: element.href,
					title: element.text
				}
			}
		});
	
		if (isExternal(element.href) || isFile(element.href)) {
			// Send now
			config.async = false;
			return Core.track(config, callback);
		}
	
		if (isInternal(element.href)) {
			// Queue and send on next page.
			internalQueue.add(config).save();
		}
	
		return true;
	}
	
	/**
	 * Handle a click event.
	 *
	 * @param {Event} event - The event.
	 *
	 * @return {boolean} - Returns the result of the tracking request
	 * @private
	 */
	function clickEvent(event) {
		return track(event.target);
	}
	
	/**
	 * Set the callback called on every link tracking event.
	 *
	 * @param {Function} cb - The callback.
	 * @return {undefined}
	 */
	function onClick(cb) {
		callback = cb;
	}
	
	/**
	 * If there are any requests queued, attempts to send the next one
	 * Otherwise, does nothing
	 * @return {undefined}
	 */
	function runQueue() {
		var next = function next() {
			runQueue();callback();
		};
		var nextLink = internalQueue.shift();
		if (nextLink) {
			Core.track(nextLink, next);
		}
	}
	
	/**
	 * Listener for links.
	 *
	 * @param {CustomEvent} e - The CustomEvent
	 * @private
	 * @return {undefined}
	 */
	function listener(e) {
		track(e.detail);
	}
	
	/**
	 * Setup and initialise link tracking.
	 *
	 * @param {Object}  config - Initial configuration
	 * @param {Element} config.root - Optional. The root element to search for links. Defaults to window.document - useful if trying to track links from an iframe.
	 * @param {string}  config.selector - Optional. The selector to use to search for links. Defaults to 'a'.
	 * @param {string}  config.event - Optional. The event to listen on. Defaults to 'click'.
	 * @param {array}   config.links - Optional. If you've already worked out the links to track, then this is used to pass them over. Must be an array with elements that accept events.
	 *
	 * @return {array} The links setup in this init.
	 */
	function init(config) {
		var links = undefined;
		var i = undefined;
	
		internalQueue = new Queue('links');
	
		runQueue();
	
		// Listen for page requests. If this is a single page app, we can send link requests now.
		utils.onPage(runQueue);
	
		if (utils.isUndefined(config)) {
			config = {};
		}
		config = utils.merge({
			root: window.document,
			selector: 'a',
			event: 'click',
			links: null
		}, config);
	
		if (config.hasOwnProperty('callback')) {
			callback = config.callback;
		}
	
		if (config.links && utils.is(config.links, 'object') && config.links.constructor.toString().match(/array/i)) {
			links = config.links;
	
			for (i = 0; i < links.length; i = i + 1) {
				utils.addEvent(links[i], config.event, clickEvent);
			}
		} else {
			if (typeof config.root !== 'object' || typeof config.selector !== 'string') {
				var configException = 'If supplying a config it must have a valid root element and a selector string';
				utils.broadcast('oErrors', 'log', {
					error: configException,
					info: { module: 'o-tracking' }
				});
				throw configException;
			}
	
			utils.addEvent(config.root, config.event, function (event) {
				if (event.target.tagName === config.selector.toUpperCase()) {
					clickEvent.call(event.target, event);
				}
			});
		}
	
		utils.addEvent(window, 'oTracking.link', listener);
	}
	
	module.exports = {
		init: init,
		onClick: onClick,
		track: track
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(103);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(104);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(102)))

/***/ },
/* 102 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 104 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var keys = __webpack_require__(106),
	    root = __webpack_require__(107);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;
	
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;
	
	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);
	
	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}
	
	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);
	
	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/** Built-in value references. */
	var Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    splice = arrayProto.splice;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;
	
	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView'),
	    Map = getNative(root, 'Map'),
	    Promise = getNative(root, 'Promise'),
	    Set = getNative(root, 'Set'),
	    WeakMap = getNative(root, 'WeakMap'),
	    nativeCreate = getNative(Object, 'create');
	
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
	
	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}
	
	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}
	
	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}
	
	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	
	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;
	
	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}
	
	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}
	
	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}
	
	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	
	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}
	
	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}
	
	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}
	
	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}
	
	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}
	
	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
	    cache = this.__data__ = new MapCache(cache.__data__);
	  }
	  cache.set(key, value);
	  return this;
	}
	
	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return hasOwnProperty.call(object, key) ||
	    (typeof object == 'object' && key in object && getPrototype(object) === null);
	}
	
	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = getTag(object);
	    objTag = objTag == argsTag ? objectTag : objTag;
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    othTag = othTag == argsTag ? objectTag : othTag;
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
	      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
	  }
	  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;
	
	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
	}
	
	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;
	
	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;
	
	  stack.set(array, other);
	
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];
	
	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!seen.has(othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	              return seen.add(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, customizer, bitmask, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  return result;
	}
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;
	
	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;
	
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and
	      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
	      // not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object) ? other != +other : object == +other;
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');
	
	    case mapTag:
	      var convert = mapToArray;
	
	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);
	
	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= UNORDERED_COMPARE_FLAG;
	      stack.set(object, other);
	
	      // Recursively compare objects (susceptible to call stack limits).
	      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
	
	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : baseHas(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	
	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];
	
	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  return result;
	}
	
	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}
	
	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function getTag(value) {
	  return objectToString.call(value);
	}
	
	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;
	
	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}
	
	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Performs a deep comparison between two values to determine if they are
	 * equivalent.
	 *
	 * **Note:** This method supports comparing arrays, array buffers, booleans,
	 * date objects, error objects, maps, numbers, `Object` objects, regexes,
	 * sets, strings, symbols, and typed arrays. `Object` objects are compared
	 * by their own, not inherited, enumerable properties. Functions and DOM
	 * nodes are **not** supported.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent,
	 *  else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.isEqual(object, other);
	 * // => true
	 *
	 * object === other;
	 * // => false
	 */
	function isEqual(value, other) {
	  return baseIsEqual(value, other);
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	}
	
	module.exports = isEqual;


/***/ },
/* 106 */
/***/ function(module, exports) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    stringTag = '[object String]';
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf,
	    nativeKeys = Object.keys;
	
	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return hasOwnProperty.call(object, key) ||
	    (typeof object == 'object' && key in object && getPrototype(object) === null);
	}
	
	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}
	
	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  if (isLength(length) &&
	      (isArray(object) || isString(object) || isArguments(object))) {
	    return baseTimes(length, String);
	  }
	  return null;
	}
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;
	
	  for (var key in object) {
	    if (baseHas(object, key) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keys;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};
	
	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;
	
	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();
	
	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}
	
	module.exports = root;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(108)(module), (function() { return this; }())))

/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(110);
	
	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};
	
	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}
	
		str = str.trim().replace(/^(\?|#|&)/, '');
	
		if (!str) {
			return {};
		}
	
		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;
	
			key = decodeURIComponent(key);
	
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);
	
			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}
	
			return ret;
		}, {});
	};
	
	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];
	
			if (val === undefined) {
				return '';
			}
	
			if (val === null) {
				return key;
			}
	
			if (Array.isArray(val)) {
				return val.slice().sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}
	
			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _Object$keys = __webpack_require__(39)['default'];
	
	var _getIterator = __webpack_require__(72)['default'];
	
	var define = false;
	
	'use strict';
	var tracking = __webpack_require__(82);
	
	function makeSelect(items, selected) {
		var input = document.createElement('select');
		input.classList.add('o-forms-select');
		var noSelection = document.createElement('option');
		noSelection.value = '';
		noSelection.textContent = 'Default';
		input.appendChild(noSelection);
		items.forEach(function (key) {
			var o = document.createElement('option');
			if (key === selected) {
				o.selected = 'selected';
			}
			o.textContent = key;
			o.value = key;
			input.appendChild(o);
		});
		return input;
	}
	
	function makeTextarea(placeholder, text) {
		var ta = document.createElement('textarea');
		ta.classList.add('o-forms-textarea');
		ta.style.height = '6em';
		ta.setAttribute('form', 'tech-radar__qp-form');
		ta.placeholder = placeholder;
		ta.textContent = text;
		return ta;
	}
	
	var inputs = [];
	module.exports = function (schema, visibleColumns, ringLabels, options) {
	
		var formLocation = document.getElementById('tech-radar__qp-form');
	
		var tabs = document.createElement('ul');
		tabs.setAttribute('data-o-component', 'o-tabs');
		tabs.setAttribute('class', 'o-tabs o-tabs--buttontabs');
		tabs.setAttribute('role', 'tablist');
		formLocation.appendChild(tabs);
	
		var queryParams = _Object$keys(schema);
		var categoryDom = {};
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = _getIterator(queryParams), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var qp = _step.value;
	
				var group = document.createElement('div');
				var label = document.createElement('label');
				var input = document.createElement('input');
				var small = document.createElement('small');
	
				var thisSchema = schema[qp];
				var optionKey = thisSchema[0];
				var optionType = thisSchema[1];
				var optionDefault = thisSchema[2];
				var category = thisSchema[4];
				var categoryKey = category.split(' ').map(function (str) {
					return str.toLowerCase();
				}).join('-');
				var desc = thisSchema[3];
				var optionValue = options[optionKey];
	
				input.type = 'text';
	
				// show the default value if it is something worth showing
				input.placeholder = optionType.name + (!!String(optionDefault) ? ' (' + thisSchema[2] + ')' : '');
				label.title = desc;
	
				if (qp === 'id') {
					desc = desc + (' <a href="https://docs.google.com/spreadsheets/d/' + optionValue + '/" target="_blank">Link to spreadsheet</a>');
				}
	
				small.innerHTML = desc;
				input.value = optionValue || '';
				if (optionValue === optionDefault) {
					input.value = '';
				}
	
				if (optionType === Boolean) {
					input.value = 'true';
					if (optionDefault) {
						input.setAttribute('checked', 'checked');
					}
					input.type = 'checkbox';
					input.className = 'o-forms-checkbox';
					input.checked = optionValue !== undefined ? optionValue : optionDefault;
					group.style.flexBasis = '8em';
					label.setAttribute('for', qp);
				}
	
				if (optionType === Array) {
					input.value = optionValue.join(', ');
					group.style.flexBasis = '60%';
				}
	
				if (optionType.constructor === Array) {
					input = makeSelect(optionType, optionValue || optionDefault);
				}
	
				if (qp === 'filter') {
					group.style.flexBasis = '80%';
				}
	
				label.classList.add('o-forms-label');
				input.classList.add('o-forms-text');
				group.classList.add('o-forms-group');
				small.classList.add('o-forms-additional-info');
	
				if (qp === 'sortcol') {
					input = makeSelect(visibleColumns, options.sortCol === optionDefault ? 'Default' : options.sortCol);
				}
	
				if (qp === 'segment') {
					input = makeSelect(visibleColumns, options.segment === optionDefault ? 'Default' : options.segment);
				}
	
				if (qp === 'crystallisation') {
					input = makeSelect(ringLabels, options.crystallisation || 'Default');
				}
	
				if (qp === 'css') {
					input = makeTextarea(optionDefault, optionValue);
					group.style.flexBasis = '90%';
				}
	
				label.textContent = '' + qp;
				if (optionType === Boolean) {
					group.appendChild(label.cloneNode(true));
					group.appendChild(small);
					group.appendChild(input);
					group.appendChild(label);
				} else {
					group.appendChild(label);
					group.appendChild(small);
					group.appendChild(input);
				}
	
				if (categoryDom[categoryKey] === undefined) {
					var cat = document.createElement('div');
					categoryDom[categoryKey] = cat;
					cat.classList.add('form-tab-contents');
					cat.classList.add('o-tabs__tabpanel');
					cat.id = categoryKey;
					formLocation.appendChild(cat);
	
					var tab = document.createElement('li');
					tab.setAttribute('role', 'tab');
	
					var a = document.createElement('a');
					a.href = '#' + categoryKey;
					a.textContent = category;
	
					tab.appendChild(a);
					tabs.appendChild(tab);
				}
				categoryDom[categoryKey].appendChild(group);
				input.name = qp;
				input.setAttribute('id', qp);
				inputs.push(input);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	
		var submit = document.createElement('input');
		submit.type = 'submit';
		submit.addEventListener('click', function () {
			validate();
		});
		submit.classList.add('o-buttons');
		submit.classList.add('o-buttons--standout');
		var hiddenSubmit = submit.cloneNode();
		hiddenSubmit.style.display = 'none';
		formLocation.appendChild(hiddenSubmit);
		formLocation.parentNode.appendChild(submit);
	
		function validate() {
			tracking({
				action: 'Form Used'
			});
			inputs.forEach(function (el) {
				var shouldDisable = el.value === '' || el.value === 'Default' || el.type === 'checkbox' && el.checked === el.defaultChecked;
				if (shouldDisable) {
					el.disabled = 'disabled';
				} else {
					if (el.type === 'checkbox') {
						el.checked = true;
						el.value = String(!el.defaultChecked);
					}
				}
			});
			formLocation.submit();
		}
	
		formLocation.addEventListener('submit', function submitCatcher(e) {
			e.preventDefault();
			validate();
			return false;
		});
	
		window.Origami['o-tabs'].init();
	};

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map
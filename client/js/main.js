'use strict';

// configProperty: [optionsParameter, type, default value, description, category]
const qpSchema = {
	filter: ['filter', String, '', 'Some Examples: <ul><li>foo</li><li>biz:baz</li><li>do-able:[3-9]</li><li>state:1|state:3|name:tech</li><li>state:1|state:3|name:tech</li><li>fina.*times</li></ul>', 'Filter Data'],
	id: ['docUIDs', Array, [], 'Comma seperated list of IDs of spreadsheet documents to load', 'Data Source'],
	sheet: ['sheets', Array, [], 'Comma seperated list of sheets to load from those documents', 'Data Source'],
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

const options = {};
Object.keys(qpSchema).forEach(key => {
	options[qpSchema[key][0]] = qpSchema[key][2];
});
const color = require('tinycolor2');
const graph = require('./lib/d3');
const tracking = require('./lib/tracking');
const extend = require('util')._extend;
const berthaRoot = 'https://bertha.ig.ft.com/';
const berthaView = 'view/publish/gss/';
const berthaRepublish = 'republish/publish/gss/';
const isEqual = require('lodash.isequal');
const queryString = require('query-string');
let sheetTitles = new Set();
let titleFromQueryParam = false;

// Handle the mapping of queryParams/sheetConfig to options' properties.
function parseOptions (config, force = false) {

	Object.keys(config).forEach(key => {

		// Don't set empty values
		if (config[key] === '') return;

		const handle = qpSchema[key];
		if (handle === undefined) return;

		// COMPLEX
		const queryStringData = queryString.parse(location.search);
		if (!force &&                                                    // always overwrite if forcing it (initial load)
			key in queryStringData &&									 // skip if present in query string unless
			(
				options[handle[0]] === undefined || 					 // the option is empty
				(handle[1] === Array && options[handle[0]].length === 0) // or is an empty array
			) !== true
		) {
			return;
		}

		switch (handle[1]) {
		case Array:
			let arr;
			if (config[key].constructor === Array) {
				arr = config[key];
			} else {
				arr = config[key].split(/, */).filter(item => (item !== ''));
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

tracking({action: 'PageLoad'});

// read query params
parseOptions((function () {
	const parsed = queryString.parse(location.search);

	if (parsed.title !== undefined && parsed.title !== '') {
		titleFromQueryParam = true;
		document.querySelector('.sheet-title').textContent = parsed.title;
	}

	// show the table by default
	if (parsed.id && parsed.sheet) {
		return parsed;
	}

	const errMessage = 'No ID and Sheet parameters.';
	document.getElementById('error-text-target').textContent = errMessage;
	throw Error(errMessage);
}()), true);

function addScript (url) {
	return new Promise(function (resolve, reject) {
		const script = document.createElement('script');
		script.setAttribute('src', url);
		document.head.appendChild(script);
		script.onload = resolve;
		script.onerror = reject;
	});
}

function getDocsFromBertha (docs, republish = false) {

	const requests = docs.map(doc => {
		return fetch(`${berthaRoot}${republish ? berthaRepublish : berthaView}${doc.UID}/${doc.sheet}`)
		.then(response => response.json())
		.then(function (json) {

			// supply some additional information about where the datum came from.
			let i = 0;
			for (const datum of json) {
				datum['hidden-graph-item-source'] = `${doc.UID}/${doc.sheet}`;
				datum['hidden-graph-item-id'] = (`${datum.name}---${doc.UID}---${doc.sheet}---${i++}`).replace(/[^a-z_\-0-9]/ig, '_');
			}

			// override options

			// only override if it has configuration data
			if (json[0].configvalue === undefined || json[0].name === undefined) {

				for (const datum of json) {
					datum.sheetTitle = doc.sheet;
				}
				sheetTitles.add(doc.sheet);

				return json;
			}

			const config = {};

			for (const datum of json) {
				if (
					datum.configvalue !== null &&  // It has a config value set
					datum.name !== null
				) {

					if (
						datum.name === 'sortcol' && docs.length > 1 || // local sortcol is invalid if there are multiple documents
						datum.name === 'sheet' || // overriding the sheets or id from a sheet is nonsense
						datum.name === 'id'
					) {
						continue;
					}

					config[datum.name] = datum.configvalue;
				}
			}

			// Set the options globally
			parseOptions(config);

			for (const datum of json) {
				datum.sheetTitle = config.title || doc.sheet;
			}

			sheetTitles.add(config.title || doc.sheet);

			return json;
		});
	});

	return Promise.all(requests)
	.then(requests => {

		if (!titleFromQueryParam) {
			options.title = document.querySelector('.sheet-title').textContent = Array.from(sheetTitles).join(' & ');
			sheetTitles.clear();
		}

		return requests;
	});

}

function retrieveSheets (how, republish = false) {

	// "multipleIDsWithSingleSheet";
	// "singleIDWithMultipleSheets";
	// "oneIDPerSheet";

	if(how === 'multipleIDsWithSingleSheet'){
		return getDocsFromBertha(
			options.docUIDs.map(UID => ({
				UID,
				sheet: options.sheets[0]
			})),
			republish
		);
	} else if(how === 'singleIDWithMultipleSheets'){
		return getDocsFromBertha(
			options.sheets.map(sheetName => ({
				UID: options.docUIDs[0],
				sheet : sheetName
			})),
			republish
		);
	} else if( how === 'oneIDPerSheet'){
		return getDocsFromBertha(
			options.docUIDs.map((UID, idx) => ({
				UID,
				sheet: options.sheets[idx]
			})),
			republish
		);
	}

}

function decideHowToAct () {
	if (options.docUIDs.length > options.sheets.length){
		return Promise.resolve('multipleIDsWithSingleSheet');
	} else if(options.docUIDs.length === 1 && options.sheets.length){
		return Promise.resolve('singleIDWithMultipleSheets');
	} else {
		return Promise.resolve('oneIDPerSheet');
	}
}

function toggleCollapsedClass (e) {
	e.currentTarget.classList.toggle('collapsed');
}

// Process the data
function process (data) {

	if (data[0]) {
		if (data[0][options.sortCol] === undefined) {
			throw Error(`No column with the name '${options.sortCol}'. ${ options.sortCol === 'phase' ? 'Do you need to set the sortcol parameter?' : 'Did you set the sortcol parameter to the correct column heading?' }\n Available headings: ${Object.keys(data[0]).join(', ')}`);
		}
		if (data[0]['name'] === undefined) {
			throw Error('No column with the name "name". The name column is required to label each data point.');
		}
	} else {
		throw Error('Empty spreasheet from Bertha');
	}

	// starting point for colours
	let hue = 0.1;
	for (const datum of data) {
		if (!datum['hidden-graph-item-hue']) {
			datum['hidden-graph-item-hue'] = 360 * hue;

			// Add the golden ratio to get the next colour, gives great distribution.
			hue = (hue + 0.618033988749895) % 1;
		};

		// Ensure it is string so we can do analysis
		datum[options.sortCol] = String(datum[options.sortCol]);

		// expose additional data;
		datum.longDesc = '';
		for (const col of stripDuplicates(['name', options.sortCol].concat(options.showCol))) {
			datum.longDesc = datum.longDesc + `${col}: ${datum[col]}` + '\n';
		}
	}

	data = cloneData(data)
	.filter(datum =>
		!!datum[options.sortCol] &&
		!!datum['name'] &&
		(
			datum['configvalue'] === undefined ||
			datum['configvalue'] === null
		)
	);

	if (!data.length) {
		throw Error('No data from source');
	}

	let sortType = 'numerical';

	// Default to numerical but if any of the sortcol values
	// are Integers or Alphabetical then treat alphabetical
	for (const datum of data) {
		if (!datum[options.sortCol].match(/^[0-9]/)) {
			sortType = 'alphabetical';
			break;
		}
	}

	if (options.sortType === 'alphabetical' || options.sortType === 'numerical') {
		sortType = options.sortType;
	}

	let labels = [];
	if (sortType === 'numerical') {

		data
		.map(datum => (datum['datumValue'] = datum[options.sortCol].match(/^[0-9\.]+/), datum))
		.filter(datum => datum['datumValue'] !== null)

		// Map 1.2.3 to 1.23 to for smarter sorting
		.forEach(datum => {
			datum['datumValue'] = Number(datum['datumValue'][0].split('.').reduce((p,c,i) => p + (!i ? c + '.' : c ),''));
		});

	} else if (sortType === 'alphabetical') {
		const phases = new Set();
		const valueMap = new Map();
		data.forEach(datum => phases.add(datum[options.sortCol]));

		// If we don't have enough values passed to sort the
		// order by, we'll default to ordering the rings alphabetically
		if ( options.sortColOrder.length ) {
			options.sortColOrder.forEach((item, i) => valueMap.set(item, i));
		} else {

			// Create a map of 'My String' => 1, 'Mz String' => 2
			[...phases].sort().forEach((d,i) => valueMap.set(d,i));
		}

		data.forEach(datum => {
			if (!valueMap.has(datum[options.sortCol])) {
				valueMap.set(datum[options.sortCol], valueMap.size);
			}
			datum['datumValue'] = valueMap.get(datum[options.sortCol]) + (options.scatterInBand ? (0.5*Math.random() + 0.2) : 0.5);
		});

		labels = Array.from(valueMap.entries())
		.sort((a,b) => a[1] - b[1])
		.map(entry => entry[0]);
	}

	data = data.sort((a,b) => a['datumValue'] - b['datumValue']);

	// Generate chart rings and attatch that data
	const chartRings = generateChartRings(data, labels);
	data.forEach(datum => {
		for (const r of chartRings) {
			if (datum.datumValue >= r.min && datum.datumValue < r.max) {
				datum['hidden-graph-item-ring'] = r;
				break;
			}
		}
	});

	data = data.filter(datum => {
		let regex;
		try {
			regex = new RegExp(options.filter, 'gi');
		} catch (e) {

			// if there is a broken regex then don't try matching
			return true;
		}
		const possibleMatches = Object.keys(datum).map(k => `${k}:${datum[k]}`);
		for (const p of possibleMatches) {
			if (p.match(regex)) return true;
		}
	});

	if (!data.length) {
		throw Error('No data matched by filter');
	}

	return {
		data,
		labels
	};
}

function generateChartRings (data, labels = []) {
	const segmentBy = options.segment || 'hidden-graph-item-source';
	let segments = new Set();
	let max = 0;
	const counts = [];
	for (const datum of data) {
		max = Math.max(datum.datumValue, max);
		segments.add(datum[segmentBy]);
		const segment = Math.floor(datum.datumValue);
		counts[segment] = (counts[segment] || 0) + 1;
	}

	if (labels.length === 0	) {
		labels = counts.map((l,i) => String(i));
	};

	// add smidge so that integers get rounded up
	// other wise it adds too many rings
	if (Math.ceil(max + 0.0001) - max < 0.1) {

		// add an empty ring if needed
		counts.push(0);
	}
	let nRings = counts.length;

	const smallestWidth = 0.5;
	const mostPopulousRingPopulation = counts.reduce((a,b) => Math.max(a || 0, b || 0), -Infinity);
	for(let i = 0; i < counts.length; i++) {
		counts[i] = {
			count: counts[i] || 0,
			proportionalSize: (counts[i] || smallestWidth)/mostPopulousRingPopulation
		};
	}
	const totalProportionalSize = counts.reduce(function (a,b) { return a + b.proportionalSize; }, 0);

	let crystallisationIndex = labels.indexOf(options.crystallisation);

	const ringColors = counts.map((ring, i) => {

		const rainbowFill = `hsla(${i * 360/nRings}, 60%, 75%, 1)`;
		if (options.ringColor === 'rainbow') return rainbowFill;

		const baseColor = color(options.ringColor || '#fff1e0').toHsv();
		const maxV = baseColor.v;
		const minV = Math.min(Math.max(baseColor.v + (options.gradientOffset || -0.4), 0), 1);

		// don't go fully black
		baseColor.v = i * ((maxV - minV)/nRings) + minV;
		const newColor = color(baseColor).toHslString();
		return newColor;
	});

	// Draw rings from the max value down to zero
	let totalWidth = 0;
	return counts.map(function ({count, proportionalSize}, i) {
		const width = options.useProportionalRings ? proportionalSize/totalProportionalSize : 1/nRings;
		totalWidth += width;
		let fill;

		if (
			crystallisationIndex !== -1 &&
			crystallisationIndex !== ringColors.length - 1
		) {
			fill = ringColors[nRings -1 - Math.abs(i - crystallisationIndex)];
		} else {
			fill = ringColors[i];
		}
		return {
			fill,
			min: i,
			max: i+1,
			index: i,
			groupLabel: labels[i],
			segments: Array.from(segments.values()),
			segmentBy,
			width,
			proportionalSizeStart: totalWidth - width,
			proportionalSizeEnd: totalWidth
		};
	});
}

function generateGraphs (inData) {

	// Set graph title
	document.querySelector('.sheet-title').textContent = options.title;

	const {data, labels} = process(inData);
	const svgTarget = document.getElementById('tech-radar__graph-target');
	const header = document.querySelector('.o-header');
	const footer = document.querySelector('footer');
	const svg = graph({
		data,
		size: Math.min(svgTarget.clientWidth, document.body.clientHeight - header.clientHeight - footer.clientHeight),
		rings: generateChartRings(data, labels),
		options
	});
	svgTarget.appendChild(svg);

	return function cleanUp () {
		svg.parentNode.removeChild(svg);
	};
}

function rowMouseOver (e) {
	e.currentTarget.classList.add('hovering');
	const pointId = e.currentTarget.id + '--graph-point';
	const point = document.getElementById(pointId);
	if (!point) return;
	point.classList.add('hovering');
}

function rowMouseOut (e) {
	e.currentTarget.classList.remove('hovering');
	const pointId = e.currentTarget.id + '--graph-point';
	const point = document.getElementById(pointId);
	if (!point) return;
	point.classList.remove('hovering');
}

function stripDuplicates (arr) {
	return [...new Set(arr)];
}

function generateTable (inData) {

	// if not suppose to show the table return a noop to clean it up.
	if (options.showTable === false) return function () {};

	const {data} = process(inData);
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const theadTr = document.createElement('tr');
	const tbody = document.createElement('tbody');
	let headings = new Set();
	data.forEach(datum => {
		const keys = Object.keys(datum);
		keys.forEach(k => headings.add(k));
	});

	// Get the headings removing duplicates and empty strings.
	const filterHeadings = stripDuplicates(['Key', 'name', options.sortCol].concat(options.showCol).concat(['Other Details']));

	table.appendChild(thead);
	thead.appendChild(theadTr);
	table.appendChild(tbody);
	table.classList.add('filter-table');
	for (const heading of filterHeadings) {
		const td = document.createElement('td');
		td.textContent = heading;
		theadTr.appendChild(td);
	}
	for (const datum of data) {
		const tbodyTr = document.createElement('tr');
		tbodyTr.addEventListener('click', toggleCollapsedClass);
		tbody.appendChild(tbodyTr);
		tbodyTr.classList.add('collapsed');
		tbodyTr.id = datum['hidden-graph-item-id'];
		tbodyTr.addEventListener('mouseover', rowMouseOver);
		tbodyTr.addEventListener('mouseout', rowMouseOut);
		for (const heading of filterHeadings) {
			const td = document.createElement('td');
			td.classList.add(heading.replace(/[^a-z]/ig, '-'));
			const tdContent = document.createElement('div');
			tdContent.classList.add('datum');
			td.appendChild(tdContent);
			if (heading === 'Other Details') {

				let newContent = '<ul class="details">';

				const itemKeys = Object.keys(datum);
				for (const k of itemKeys) {
					if (k.match(/^hidden-graph-item/)) continue;
					newContent += `<li><span class="key">${k}:</span> ${datum[k]}</li>`;
				}
				newContent += '</ul>';
				tdContent.innerHTML = newContent;
				td.classList.add('hidden');
			} else if (heading === 'Key') {
				td.style.background = `hsl(${datum['hidden-graph-item-hue']}, 95%, 60%)`;
			} else if (heading === options.sortCol) {
				td.style.background = datum['hidden-graph-item-ring'].fill;
				tdContent.textContent = datum[heading] || '';
			} else {
				tdContent.textContent = datum[heading] || '';
			}
			tbodyTr.appendChild(td);
		}
	}
	document.getElementById('tech-radar__filter-list-target').appendChild(table);

	return function cleanUp () {
		table.parentNode.removeChild(table);
	};
}

function mergeData (data) {

	if(data.length === 1){
		return data[0];
	}

	const flattenedData = [];

	for(let a = 0; a < data.length; a += 1){

		const thisArray = data[a];

		for(let b = 0; b < thisArray.length; b += 1){
			const thisValue = thisArray[b];

			if(a === 0){
				flattenedData.push(thisValue);
			}

			for(let c = a; c < data.length; c++){

				const arrayToCompareWith = data[c];
				for(let d = 0; d < arrayToCompareWith.length; d += 1){
					const theValueToCompareWith = arrayToCompareWith[d];

					if( !isEqual(thisValue, theValueToCompareWith) ){
						flattenedData.push(theValueToCompareWith);
					}
				}
			}
		}
	}

	for (let e = 0; e < flattenedData.length; e += 1) {
		for(let f = e + 1; f < flattenedData.length; f +=1 ){
			if(isEqual(flattenedData[e], flattenedData[f])){
				flattenedData.splice( f, 1 );
				f -= 1;
			}
		}
	}

	return flattenedData;

}

function cloneData (data) {
	return data.map(datum => extend({}, datum));
}

Promise.all([
	addScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'),
	addScript('https://polyfill.webservices.ft.com/v1/polyfill.min.js?features=fetch,default')
])
.then(decideHowToAct)
.then(howToAct => retrieveSheets(howToAct))
.then(data => mergeData(data))
.then(function (data) {

	let rings = [];
	let e;
	try {
		const o = process(data);
		rings = generateChartRings(o.data, o.labels);
	} catch (err) {
		document.getElementById('error-text-target').textContent = err.message;
		e = err;
	}
	require('./lib/form')(
		qpSchema,
		data[0] ? Object.keys(data[0]).filter(k => !k.match(/^(configvalue$|hidden-graph-item)/)) : [],
		rings.map(r => r.groupLabel),
		options
	);

	document.getElementById('filter')
	.addEventListener('input', function (e) {

		// Filter graph
		options.filter = e.currentTarget.value;
		cleanUpTable();
		cleanUpTable = generateTable(data);
	});

	if (e) throw e;

	let cleanUpGraph = function () {};
	let cleanUpTable = function () {};

	if (options.customCss) {
		const customStyleSheet = document.createElement('style');
		customStyleSheet.textContent = options.customCss;
		document.head.appendChild(customStyleSheet);
	}

	if (options.dashboard) {
		document.getElementById('tech-radar__settings').style.display = 'none';
	}

	const buttons = document.getElementById('tech-radar__buttons');

	const updateDataButton = document.createElement('button');
	updateDataButton.textContent = 'Refresh Data';
	buttons.appendChild(updateDataButton);
	updateDataButton.classList.add('o-buttons');
	updateDataButton.classList.add('o-buttons--standout');
	updateDataButton.addEventListener('click', () => {
		cleanUpGraph();
		cleanUpTable();

		decideHowToAct()
		.then(howToAct => retrieveSheets(howToAct, true))
		.then(data => mergeData(data))
		.then(dataIn => {
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

})
.catch(e => {
	document.getElementById('error-text-target').textContent = e.message;
	throw e;
});

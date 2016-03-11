'use strict';

// Handle the mapping of queryParams/sheetConfig to options' properties.
const options = {};
function parseOptions (config, force = false) {

	// configProperty: [optionsParameter, type]
	const filter = {
		id: ['docUIDs', Array],
		sheet: ['sheets', Array],
		sortcol: ['sortCol', String],
		showcol: ['showCol', Array],
		dashboard: ['dashboard', Boolean],
		showtable: ['showTable', Boolean],
		sortcolorder: ['sortColOrder', Array],
		segment: ['segment', String]
	};

	Object.keys(config).forEach(key => {
		const handle = filter[key];
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
			options[handle[0]] = config[key] !== 'false' && config[key] !== false;
			break;
		}
	});

	return options;
}

const graph = require('./lib/d3');
const extend = require('util')._extend;
const berthaRoot = 'https://bertha.ig.ft.com/';
const berthaView = 'view/publish/gss/';
const berthaRepublish = 'republish/publish/gss/';
const isEqual = require('lodash.isequal');
const queryString = require('query-string');
parseOptions((function () {
	const parsed = queryString.parse(location.search);
	parsed.showcol = parsed.showcol || '';
	parsed.sortcol = (parsed.sortcol || 'phase').toLowerCase();
	parsed.sortcolorder = (parsed.sortcolorder || '');

	// show the table by default
	if (parsed.showtable === undefined) {
		parsed.showtable = '';
	}
	if (parsed.id && parsed.sheet) {
		return parsed;
	}
	const errMessage = 'No ID and Sheet parameters.';
	document.getElementById('error-text-target').textContent = errMessage;
	throw Error(errMessage);
}()), true);

// String input from the filter field used to filter the text input
let filterString = '';

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
			for (const datum of json) {
				datum['hidden-graph-item-source'] = `${doc.UID}/${doc.sheet}`;
				datum['hidden-graph-item-id'] = `${datum.name}${doc.UID}/${doc.sheet}`;
			}

			// override options

			// only override if it has configuration data
			if (json[0].configvalue === undefined) return json;
			if (json[0].name === undefined) return json;

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

			return json;
		});
	});

	return Promise.all(requests);

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
	} else {
		throw Error('Empty spreasheet from Bertha');
	}

	for (const datum of data) {

		// Ensure it is string so we can do analysis
		datum[options.sortCol] = String(datum[options.sortCol]);

		// expose additional data;
		datum.longDesc = '';
		for (const col of stripDuplicates(['name', options.sortCol].concat(options.showCol))) {
			datum.longDesc = datum.longDesc + `${col}: ${datum[col]}` + '\n';
		}
	}

	data = cloneData(data).filter(datum => !!datum[options.sortCol] && !!datum['name'] && (datum['configvalue'] === undefined || datum['configvalue'] === null));

	let sortType = 'alphabetical';
	for (const datum of data) {
		if (datum[options.sortCol].match(/^[0-9]/)) {

			sortType = 'numerical';
			break;
		}
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
		if( options.sortColOrder.length === phases.size ){
			options.sortColOrder.forEach( (item, idx) => valueMap.set(item, idx + 0.2) );
		} else {

			// Create a map of 'My String' => 1, 'Mz String' => 2
			[...phases].sort().forEach((d,i) => valueMap.set(d,i + 0.2));
		}

		data.forEach(datum => {
			datum['datumValue'] = valueMap.get(datum[options.sortCol]);
		});

		labels = Array.from(valueMap.entries())
		.sort((a,b) => b[1] - a[1])
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
			regex = new RegExp(filterString, 'gi');
		} catch (e) {

			// if there is a broken regex then don't try matching
			return true;
		}
		const possibleMatches = Object.keys(datum).map(k => `${k}:${datum[k]}`);
		for (const p of possibleMatches) {
			if (p.match(regex)) return true;
		}
	});

	// starting point for colours
	let hue = 0.1;
	data.forEach(datum => {

		if (datum['hidden-graph-item-hue']) return;

		datum['hidden-graph-item-hue'] = 360 * hue;

		// Add the golden ratio to get the next colour, gives great distribution.
		hue = (hue + 0.618033988749895) % 1;
	});

	return {
		data,
		labels
	};
}

function generateChartRings (data, labels = []) {
	const segmentBy = options.segment || 'hidden-graph-item-source';
	let segments = new Set();
	let max = 0;
	for (const datum of data) {
		max = Math.max(datum.datumValue, max);
		segments.add(datum[segmentBy]);
	}

	if (Math.ceil(max) - max < 0.1) {
		max = Math.ceil(max) + 1;
	} else {
		max = Math.ceil(max);
	}

	// Draw rings from the max value down to zero
	let nRings = Math.ceil(max);
	const rings = Array(nRings);
	let i = nRings;
	for (const r of rings) {
		r; // Suppress lint warning for r not being used
		rings[--i] = {
			fill: `hsla(${i * 360/nRings}, 100%, 85%, 1)`,
			min: max - i - 1,
			max: max - i,
			index: i,
			groupLabel: labels[i],
			segments: Array.from(segments.values()),
			segmentBy
		};
	}
	return rings;
}

function generateGraphs (inData) {
	const {data, labels} = process(inData);
	const svgTarget = document.getElementById('tech-radar__graph-target');
	const header = document.querySelector('.o-header');
	const footer = document.querySelector('footer');
	const svg = graph({
		data,
		size: Math.min(svgTarget.clientWidth, document.body.clientHeight - header.clientHeight - footer.clientHeight),
		rings: generateChartRings(data, labels)
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
	point.parentNode.classList.add('hovering');
}

function rowMouseOut (e) {
	e.currentTarget.classList.remove('hovering');
	const pointId = e.currentTarget.id + '--graph-point';
	const point = document.getElementById(pointId);
	if (!point) return;
	point.parentNode.classList.remove('hovering');
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

	let cleanUpTable = generateTable(data);
	let cleanUpGraph = generateGraphs(data);

	if (options.dashboard) {
		document.getElementById('tech-radar__settings').style.display = 'none';
		return;
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

	document.getElementById('filter').addEventListener('input', function (e) {

		// Filter graph
		filterString = e.currentTarget.value;
		cleanUpTable();
		cleanUpTable = generateTable(data);
	});

	document.getElementById('filter-form').addEventListener('submit', function (e) {
		e.preventDefault();
		cleanUpTable();
		cleanUpGraph();
		cleanUpTable = generateTable(data);
		cleanUpGraph = generateGraphs(data);
	});
})
.catch(e => {
	document.getElementById('error-text-target').textContent = e.message;
	throw e;
});

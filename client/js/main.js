'use strict';

const graph = require('./lib/d3');
const extend = require('util')._extend;
const berthaRoot = 'https://bertha.ig.ft.com/';
const berthaView = 'view/publish/gss/';
const berthaRepublish = 'republish/publish/gss/';
const {
	dataUrlFragment,
	showcol,
	sortcol,
	sortcolorder
} = (function () {
	const queryString = require('query-string');
	const parsed = queryString.parse(location.search);
	parsed.showcol = parsed.showcol || '';
	parsed.sortcol = (parsed.sortcol || 'phase').toLowerCase();
	parsed.sortcolorder = (parsed.sortcolorder || '');
	if (parsed.id && parsed.sheet) {
		return {
			dataUrlFragment: `${parsed.id}/${parsed.sheet}`,
			sortcol: parsed.sortcol,
			showcol: parsed.showcol.split(','),
			sortcolorder : parsed.sortcolorder.split(',').filter(item => (item !== '') )
		};
	}
	const errMessage = 'No ID and Sheet parameters.';
	document.getElementById('error-text-target').textContent = errMessage;
	throw Error(errMessage);
}());

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

function toggleCollapsedClass (e) {
	e.currentTarget.classList.toggle('collapsed');
}


// Process the data
function process (data) {

	if (data[0]) {
		if (data[0][sortcol] === undefined) {
			throw Error(`No column with the name '${sortcol}'. ${ sortcol === 'phase' ? 'Do you need to set the sortcol parameter?' : 'Did you set the sortcol parameter to the correct column heading?' }\n Available headings: ${Object.keys(data[0]).join(', ')}`);
		}
	} else {
		throw Error('Empty spreasheet from Bertha');
	}

	for (const datum of data) {

		// Ensure it is string so we can do analysis
		datum[sortcol] = String(datum[sortcol]);
	}

	data = cloneData(data).filter(datum => !!datum[sortcol] && !!datum['name']);

	let sortType = 'alphabetical';
	for (const datum of data) {
		if (datum[sortcol].match(/^[0-9]/)) {
			sortType = 'numerical';
			break;
		}
	}

	if (sortType === 'numerical') {

		data
		.map(datum => (datum['datumValue'] = datum[sortcol].match(/^[0-9\.]+/), datum))
		.filter(datum => datum['datumValue'] !== null)

		// Map 1.2.3 to 1.23 to for smarter sorting
		.forEach(datum => datum['datumValue'] = Number(datum['datumValue'][0].split('.').reduce((p,c,i) => p + (!i ? c + '.' : c ),'')));

	} else if (sortType === 'alphabetical') {
		const phases = new Set();
		const valueMap = new Map();
		data.forEach(datum => phases.add(datum[sortcol]));
		
		// If we don't have enough values passed to sort the 
		// order by, we'll default to ordering the rings alphabetically 
		if( sortcolorder.length === phases.size ){
			sortcolorder.forEach( (item, idx) => valueMap.set(item, idx + 0.5) );
		} else {
			// Create a map of 'My String' => 1, 'Mz String' => 2
			[...phases].sort().forEach((d,i) => valueMap.set(d,i + 0.5));
		}

		data.forEach(datum => {
			datum['datumValue'] = valueMap.get(datum[sortcol]);
		});
	}

	data = data.sort((a,b) => a['datumValue'] - b['datumValue']);
	
	// Generate chart rings and attatch that data
	const chartRings = generateChartRings(data);
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

	return data;
}

function generateChartRings (data) {

	let max = 0;
	for (const datum of data) {
		max = Math.max(datum.datumValue, max);
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
			index: i
		};
	}
	return rings;
}

function generateGraphs (data) {
	const svgTarget = document.getElementById('tech-radar__graph-target');
	const svg = graph({
		data,
		width: svgTarget.clientWidth,
		height: svgTarget.clientWidth*0.5,
		rings: generateChartRings(data)
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

function generateTable (data) {
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
	const filterHeadings = stripDuplicates(['Key', 'name', sortcol].concat(showcol).concat(['Other Details'])).filter(a => !!String(a));

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
		tbodyTr.id = datum.name;
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
			} else if (heading === sortcol) {
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

function cloneData (data) {
	return data.map(datum => extend({}, datum));
}

Promise.all([
	addScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'),
	addScript('https://polyfill.webservices.ft.com/v1/polyfill.min.js?features=fetch,default')
])
.then(() => dataUrlFragment)
.then(urlFragment => `${berthaRoot}${berthaView}${urlFragment}`)
.then(fetch)
.then(response => response.json())
.then(function (data) {

	let cleanUpTable = generateTable(process(data));
	let cleanUpGraph = generateGraphs(process(data));

	const buttons = document.getElementById('tech-radar__buttons');

	const updateDataButton = document.createElement('button');
	updateDataButton.textContent = 'Refresh Data';
	buttons.appendChild(updateDataButton);
	updateDataButton.classList.add('o-buttons');
	updateDataButton.classList.add('o-buttons--standout');
	updateDataButton.addEventListener('click', () => {
		cleanUpGraph();
		cleanUpTable();
		fetch(`${berthaRoot}${berthaRepublish}${dataUrlFragment}`)
		.then(response => response.json())
		.then(dataIn => {
			data = dataIn;
			cleanUpTable = generateTable(process(data));
			cleanUpGraph = generateGraphs(process(data));
		});
	});

	document.getElementById('filter').addEventListener('input', function (e) {

		// Filter graph
		filterString = e.currentTarget.value;
		cleanUpTable();
		cleanUpTable = generateTable(process(data));
	});

	document.getElementById('filter-form').addEventListener('submit', function (e) {
		e.preventDefault();
		cleanUpTable();
		cleanUpGraph();
		cleanUpTable = generateTable(process(data));
		cleanUpGraph = generateGraphs(process(data));
	});
})
.catch(e => {
	document.getElementById('error-text-target').textContent = e.message;
	throw e;
});

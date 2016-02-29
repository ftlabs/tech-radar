'use strict';

const graph = require('./lib/d3');
const berthaRoot = 'http://bertha.ig.ft.com/';
const berthaView = 'view/publish/gss/';
const berthaRepublish = 'republish/publish/gss/';
const dataUrlFragment = (function () {
	const queryString = require('query-string');
	const parsed = queryString.parse(location.search);
	if (parsed.id && parsed.sheet) {
		return `${parsed.id}/${parsed.sheet}`;
	}
	throw Error('No ID and Sheet parameters.');
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

function removeCollapsedClass (e) {
	e.currentTarget.classList.remove('collapsed');
}


// Process the data
function process (data) {
	data = data.filter(datum => !!datum['do-able'] && !!datum['name']);

	let hue = Math.random();
	data.forEach(datum => {

		if (datum.hue) return;

		datum.hue = 360 * hue;

		// Add the golden ratio to get the next colour, gives great distribution.
		hue = (hue + 0.618033988749895) % 1;
	});

	return data;
}

function generateGraphs (data) {

	data = process(data);

	const svgTarget = document.getElementById('tech-radar__graph-target');
	const svg = graph({
		data,
		width: svgTarget.clientWidth,
		height: svgTarget.clientWidth*0.5
	});
	svgTarget.appendChild(svg);

	return function cleanUp () {
		svg.parentNode.removeChild(svg);
	};
}

function rowMouseOver (e) {
	const pointId = e.currentTarget.id + '--graph-point';
	const point = document.getElementById(pointId);
	point.parentNode.classList.add('hovering');
	e.currentTarget.classList.add('hovering');
}

function rowMouseOut (e) {
	const pointId = e.currentTarget.id + '--graph-point';
	const point = document.getElementById(pointId);
	point.parentNode.classList.remove('hovering');
	e.currentTarget.classList.remove('hovering');
}

function generateTable (data) {
	data = process(data);
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const theadTr = document.createElement('tr');
	const tbody = document.createElement('tbody');
	let headings = new Set();
	data.forEach(datum => {
		const keys = Object.keys(datum);
		keys.forEach(k => headings.add(k));
	});
	const filterHeadings = ['hue', 'name', 'do-able', 'Other Details'];

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
		tbodyTr.addEventListener('click', removeCollapsedClass);
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

				// Do something prettier here
				tdContent.style.whiteSpace = 'pre';
				tdContent.textContent = JSON.stringify(datum, null, '  ');
			} else if (heading === 'hue') {
				td.style.background = `hsl(${datum.hue}, 95%, 60%)`;
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


Promise.all([
	addScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'),
	addScript('https://polyfill.webservices.ft.com/v1/polyfill.min.js?features=fetch,default')
])
.then(() => dataUrlFragment)
.then(urlFragment => `${berthaRoot}${berthaView}${urlFragment}`)
.then(fetch)
.then(response => response.json())
.then(function (data) {

	let cleanUpGraph = generateGraphs(data);
	let cleanUpTable = generateTable(data);

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
			cleanUpGraph = generateGraphs(data);
			cleanUpTable = generateTable(data);
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
		console.log(e);
		cleanUpTable();
		cleanUpGraph();
		cleanUpTable = generateTable(data);
		cleanUpGraph = generateGraphs(data);
	});
});

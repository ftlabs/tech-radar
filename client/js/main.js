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

function generateData (data) {
	data = data.filter(datum => !!datum['do-able'] && !!datum['name']);

	const svgTarget = document.getElementById('tech-radar__graph-target');
	const svg = graph({
		data,
		width: svgTarget.clientWidth,
		height: svgTarget.clientWidth*0.5
	});
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const theadTr = document.createElement('tr');
	const tbody = document.createElement('tbody');
	let headings = new Set();
	data.forEach(datum => {
		const keys = Object.keys(datum);
		keys.forEach(k => headings.add(k));
	});
	const filterHeadings = ['name', 'do-able', 'Other Details'];

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
		for (const heading of filterHeadings) {
			const td = document.createElement('td');
			td.classList.add(heading.replace(/[^a-z]/ig, '-'));
			const tdContent = document.createElement('div');
			tdContent.classList.add('datum');
			td.appendChild(tdContent);
			if (heading !== 'Other Details') {
				tdContent.textContent = datum[heading] || '';
			} else {

				// Do something prettier here
				tdContent.style.whiteSpace = 'pre';
				tdContent.textContent = JSON.stringify(datum, null, '  ');
			}
			tbodyTr.appendChild(td);
		}
	}
	document.getElementById('tech-radar__filter-list-target').appendChild(table);
	svgTarget.appendChild(svg);

	return function cleanUp () {
		table.parentNode.removeChild(table);
		svg.parentNode.removeChild(svg);
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

	let cleanUp = generateData(data);

	const buttons = document.getElementById('tech-radar__buttons');

	const updateDataButton = document.createElement('button');
	updateDataButton.textContent = 'Refresh Data';
	buttons.appendChild(updateDataButton);
	updateDataButton.addEventListener('click', () => {
		cleanUp();
		fetch(`${berthaRoot}${berthaRepublish}${dataUrlFragment}`)
		.then(response => response.json())
		.then(data => {
			cleanUp = generateData(data);
		});
	});
});

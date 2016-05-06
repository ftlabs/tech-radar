'use strict';
const tracking = require('./tracking');

function makeSelect (items, selected) {
	const input = document.createElement('select');
	input.classList.add('o-forms-select');
	const noSelection = document.createElement('option');
	noSelection.value = '';
	noSelection.textContent = 'Default';
	input.appendChild(noSelection);
	items.forEach(key => {
		const o = document.createElement('option');
		if (key === selected) {
			o.selected = 'selected';
		}
		o.textContent = key;
		o.value = key;
		input.appendChild(o);
	});
	return input;
}

function makeTextarea (placeholder, text) {
	const ta = document.createElement('textarea');
	ta.classList.add('o-forms-textarea');
	ta.style.height = '6em';
	ta.setAttribute('form', 'tech-radar__qp-form');
	ta.placeholder = placeholder;
	ta.textContent = text;
	return ta;
}

const inputs = [];
module.exports = function (schema, visibleColumns, ringLabels, options) {

	const formLocation = document.getElementById('tech-radar__qp-form');

	const tabs = document.createElement('ul');
	tabs.setAttribute('data-o-component', 'o-tabs');
	tabs.setAttribute('class', 'o-tabs o-tabs--buttontabs');
	tabs.setAttribute('role', 'tablist');
	formLocation.appendChild(tabs);

	const queryParams = Object.keys(schema);
	const categoryDom = {};
	for (const qp of queryParams) {
		const group = document.createElement('div');
		const label = document.createElement('label');
		let input = document.createElement('input');
		const small = document.createElement('small');

		const thisSchema = schema[qp];
		const optionKey = thisSchema[0];
		const optionType = thisSchema[1];
		const optionDefault = thisSchema[2];
		const category = thisSchema[4];
		const categoryKey = category.split(' ').map(str => str.toLowerCase()).join('-');
		let desc = thisSchema[3];
		const optionValue = options[optionKey];

		input.type = 'text';

		// show the default value if it is something worth showing
		input.placeholder = optionType.name + (!!String(optionDefault) ? ` (${thisSchema[2]})` : '');
		label.title = desc;

		if (qp === 'id') {
			desc = desc + ` <a href="https://docs.google.com/spreadsheets/d/${optionValue}/" target="_blank">Link to spreadsheet</a>`;
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

		label.textContent = `${qp}`;
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
			const cat = document.createElement('div');
			categoryDom[categoryKey] = cat;
			cat.classList.add('form-tab-contents');
			cat.classList.add('o-tabs__tabpanel');
			cat.id = categoryKey;
			formLocation.appendChild(cat);

			const tab = document.createElement('li');
			tab.setAttribute('role', 'tab');

			const a = document.createElement('a');
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
	const submit = document.createElement('input');
	submit.type = 'submit';
	submit.addEventListener('click', () => {
		validate();
	});
	submit.classList.add('o-buttons');
	submit.classList.add('o-buttons--standout');
	const hiddenSubmit = submit.cloneNode();
	hiddenSubmit.style.display = 'none';
	formLocation.appendChild(hiddenSubmit);
	formLocation.parentNode.appendChild(submit);

	function validate () {
		tracking({
			action: 'Form Used'
		});
		inputs.forEach(el => {
			const shouldDisable = (
				el.value === '' ||
				el.value === 'Default' ||
				(el.type === 'checkbox' && el.checked === el.defaultChecked)
			);
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

	formLocation.addEventListener('submit', function submitCatcher (e) {
		e.preventDefault();
		validate();
		return false;
	});

	window.Origami['o-tabs'].init();
};

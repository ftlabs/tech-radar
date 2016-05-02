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
module.exports = function (schema, dataFormat, options) {

	const formLocation = document.getElementById('tech-radar__qp-form');
	const formWrapper = document.getElementById('tech-radar__form-container');
	const label = formWrapper.querySelector('label');
	formWrapper.addEventListener('click', () => formWrapper.classList.remove('collapsed'));

	const queryParams = Object.keys(schema);
	for (const qp of queryParams) {
		const group = document.createElement('div');
		const label = document.createElement('label');
		let input = document.createElement('input');
		const small = document.createElement('small');

		const thisSchema = schema[qp];
		const optionKey = thisSchema[0];
		const optionType = thisSchema[1];
		const optionDefault = thisSchema[2];
		const desc = thisSchema[3];
		const optionValue = options[optionKey];

		input.type = 'text';
		input.name = qp;

		// show the default value if it is something worth showing
		input.placeholder = optionType.name + (!!String(optionDefault) ? ` (${thisSchema[2]})` : '');
		label.title = desc;
		small.textContent = desc;
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
			input.setAttribute('id', qp);
		}

		if (optionType === Array) {
			input.value = optionValue.join(', ');
			group.style.flexBasis = '60%';
		}

		label.classList.add('o-forms-label');
		input.classList.add('o-forms-text');
		group.classList.add('o-forms-group');
		small.classList.add('o-forms-additional-info');

		if (qp === 'sortcol') {
			input = makeSelect(dataFormat, options.sortCol === optionDefault ? 'Default' : options.sortCol);
		}

		if (qp === 'segment') {
			input = makeSelect(dataFormat, options.segment === optionDefault ? 'Default' : options.segment);
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
		formLocation.appendChild(group);
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
	formWrapper.style.height = formLocation.clientHeight + submit.clientHeight + label.clientHeight + 16 + 'px';

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
};

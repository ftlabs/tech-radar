'use strict';

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

		input.type = 'text';
		input.placeholder = schema[qp][1].name + ` (${schema[qp][2]})`;
		label.title = schema[qp][3];
		small.textContent = schema[qp][3];
		input.value = options[schema[qp][0]] || '';

		if (schema[qp][1] === Boolean) {
			input = makeSelect(
				['true', 'false'],
				String(!!options[schema[qp][0]])
			);
		}

		if (schema[qp][1] === Array) {
			input.value = options[schema[qp][0]].join(', ');
			group.style.flexBasis = '60%';
		}

		label.classList.add('o-forms-label');
		input.classList.add('o-forms-text');
		group.classList.add('o-forms-group');
		small.classList.add('o-forms-additional-info');

		if (qp === 'sortcol') {
			input = makeSelect(dataFormat, options.sortCol);
		}

		if (qp === 'segment') {
			input = makeSelect(dataFormat, options.segment);
		}

		input.name = qp;
		label.textContent = `${qp}`;
		group.appendChild(label);
		group.appendChild(small);
		group.appendChild(input);
		formLocation.appendChild(group);
		inputs.push(input);
	}
	const submit = document.createElement('input');
	submit.type = 'submit';
	submit.addEventListener('click', () => formLocation.submit());
	submit.classList.add('o-buttons');
	submit.classList.add('o-buttons--standout');
	const hiddenSubmit = submit.cloneNode();
	hiddenSubmit.style.display = 'none';
	formLocation.appendChild(hiddenSubmit);
	formLocation.parentNode.appendChild(submit);
	formWrapper.style.height = formLocation.clientHeight + submit.clientHeight + label.clientHeight + 16 + 'px';

	formLocation.addEventListener('submit', function () {
		inputs.forEach(el => el.disabled = !el.value);
		setTimeout(() => inputs.forEach(el => el.disabled = false), 0);
	});
};

/* global d3 */
/**
 * Based on http://bl.ocks.org/MoritzStefaner/1377729
 */

'use strict';

module.exports = function ({
	data,
	size,
	rings,
	options
}) {

	const boilDown = document.getElementById('boil-down');
	const width = (size || 400);
	const height = (size || 400);
	const innerWidth = 0.1;
	const totalRingSize = height;
	const chargeDistance = size/2;
	const segmentLines = [];
	const nodes = data.slice(0);
	const links = [];
	const labelAnchorNodes = [];
	const labelAnchorLinks = [];

	const rootNodeObject = {
		name: 'root',
		fixed: true,
		visible: false,
		rootEl: true,
		charge: 10
	};
	switch(options.quadrant) {
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

	nodes.forEach(n => {
		n.ring = rings[Math.floor(n.datumValue)];
		const positionInRing = (n.datumValue % 1) * n.ring.width;
		const startPositionOfRing = (n.ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth;
		n.pseudoDatumValue = positionInRing + startPositionOfRing;
		n.weight = 0.2;
		n.x = rootNodeObject.x / 2;
		n.y = rootNodeObject.y / 2;

		// Initial boost of repulsion which drives them apart
		n.charge = -100 * (options.nodeRepulsion || 3) * Math.pow((Math.floor(n.datumValue) + 2)/rings.length, 2);
	});
	(function addRootNode () {
		nodes.unshift(rootNodeObject);

		// Attatch all nodes to the rootnode
		nodes.map((n, i) => ({
			target: 0,
			source: i,
			distance:(n.pseudoDatumValue || 0) * totalRingSize,
			linkStrength: 0.1,
			fixed: n.fixed,
			toRoot: true
		}))
		.filter(l => !l.fixed)
		.forEach(l => {
			links.push(l);
		});
	}());

	// Create a label and attatch it to each node
	// this resides in it's own force diagram.
	links.forEach((l, i) => {
		const nodeToAttachTo = nodes[l.source];
		const x = nodeToAttachTo.x - totalRingSize;
		const y = nodeToAttachTo.y;
		const weight = 0.1;
		const text = nodeToAttachTo.name;

		// Has the text
		const label = {
			__coment: 'The text end',
			x,
			y,
			weight,
			text,
			charge: options.tightlyBoundLabels ? -50 : -300,
			id: nodeToAttachTo['hidden-graph-item-id'] + '--graph-label'
		};

		// Pulls the label towards the node
		const anchorToNode = {
			__coment: 'Anchor Node',
			x,
			y,
			fixed: true,
			charge: 10
		};
		labelAnchorNodes.push(label);
		labelAnchorNodes.push(anchorToNode);
		nodeToAttachTo.labelAnchor = anchorToNode;
		labelAnchorLinks.push({
			source: 2*i,
			target: 2*i + 1,
			distance: 3,
			weight,
		});
	});

	// Add invisible nodes to repel the labels at the edges of the quadrant
	(function () {
		let offsetVerticalX;
		let offsetVerticalY;
		let offsetHorizontalX;
		let offsetHorizontalY;
		switch(options.quadrant) {
		case 'bottom right':
			offsetVerticalX = rootNodeObject.x + 100;
			offsetVerticalY = -1;
			offsetHorizontalX = -1;
			offsetHorizontalY = rootNodeObject.y + 100;
			break;
		case 'bottom left':
			offsetVerticalX = rootNodeObject.x - 100;
			offsetVerticalY = -1;
			offsetHorizontalX = 1;
			offsetHorizontalY = rootNodeObject.y + 100;
			break;
		case 'top left':
			offsetVerticalX = rootNodeObject.x - 100;
			offsetVerticalY = 1;
			offsetHorizontalX = 1;
			offsetHorizontalY = rootNodeObject.y;
			break;
		case 'top right':
			offsetVerticalX = rootNodeObject.x + 100;
			offsetVerticalY = 1;
			offsetHorizontalX = -1;
			offsetHorizontalY = rootNodeObject.y;
			break;
		}
		for (const ring of rings) {
			labelAnchorNodes.push({
				__comment: 'ring label repulsion',
				x: offsetVerticalX,
				y: offsetVerticalY * (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize),
				fixed: true,
				charge: -700
			});
			labelAnchorNodes.push({
				__comment: 'ring bottom repulsion',
				x: offsetHorizontalX * (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize),
				y: offsetHorizontalY,
				fixed: true,
				charge: -700
			});
		}
	}());

	(function drawSegmentLabels () {

		// Draw an arc of points to act as the segment labels
		// they also attract the nodes.
		const r = height * 1.05;
		let offset;
		switch(options.quadrant) {
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

		const thetaMin = offset * Math.PI/2;
		const thetaMax = (offset + 1) * Math.PI/2;
		for (let i=0,l=rings[0].segments.length; i<l; i++) {

			const segment = rings[0].segments[i];
			const arcWidth = thetaMax - thetaMin;
			const segmentWidth = arcWidth/l;
			const theta = thetaMin + i*segmentWidth;
			const attractionNode = {
				name: rings[0].segmentBy !== 'hidden-graph-item-source' ? segment || 'null' : '',
				x: rootNodeObject.x + r * Math.cos(theta + segmentWidth/2),
				y: rootNodeObject.y - r * Math.sin(theta + segmentWidth/2),
				fixed: true,
				charge: 0,
				dot: false
			};
			labelAnchorNodes.push({
				name: '',
				x: rootNodeObject.x + r * Math.cos(theta + segmentWidth/2),
				y: rootNodeObject.y - r * Math.sin(theta + segmentWidth/2),
				fixed: true,
				charge: -700
			});
			labelAnchorNodes.push({
				name: '',
				x: rootNodeObject.x + 1.4 * 2 * Math.cos(theta + segmentWidth/2),
				y: rootNodeObject.y - 1.4 * 2 * Math.sin(theta + segmentWidth/2),
				fixed: true,
				charge: -700
			});
			nodes.push(attractionNode);
			segmentLines.push({
				x: r * Math.cos(theta),
				y: r * -Math.sin(theta)
			});
			if (i === l-1) {
				segmentLines.push({
					x: r * Math.cos(theta),
					y: r * -Math.sin(theta)
				});
			}
		}

		// remove first and last line
		segmentLines.pop();
		segmentLines.shift();
	}());

	// Attract the nodes to the segments
	nodes.forEach((n,j) => {
		for(let i=0,l=rings[0].segments.length;i<l;i++) {
			if (
				n[rings[0].segmentBy] !== undefined &&
				n[rings[0].segmentBy] === rings[0].segments[i]
			) {
				const target = nodes.length - l + i;
				n.x = nodes[target].x;
				n.y = nodes[target].y;
				const link = {
					target,
					source: j,
					distance: 0,
					linkStrength: 0.01 * (options.nodeAttraction || 3) * Math.pow(1.2, l)
				};
				links.push(link);
				break;
			}
		}
	});

	const svgNode = document.createElementNS(d3.ns.prefix.svg, 'svg');
	const svg = d3.select(svgNode);
	svg.attr('class', options.quadrant);
	const padding = {
		hSmall: 110,
		hLarge: 300,
		vTop: 30,
		vBottom: 110
	};

	switch(options.quadrant) {
	case 'bottom right':
		svg.attr('width', width + padding.hLarge + padding.hSmall)
		.attr('height', height + padding.vTop + padding.vBottom)
		.attr('viewBox', `${-padding.hLarge} ${ -padding.vTop} ${width + padding.hLarge + padding.hSmall} ${height + padding.vTop + padding.vBottom}`);
		break;
	case 'bottom left':
		svg.attr('width', width + padding.hLarge + padding.hSmall)
		.attr('height', height + padding.vTop + padding.vBottom)
		.attr('viewBox', `${-width - padding.hSmall} ${ -padding.vTop} ${width + padding.hLarge + padding.hSmall} ${height + padding.vTop + padding.vBottom}`);
		break;
	case 'top left':
		svg.attr('width', width + padding.hLarge + padding.hSmall)
		.attr('height', height + padding.vTop + padding.vBottom)
		.attr('viewBox', `${-width - padding.hSmall} ${-height - padding.vBottom} ${width + padding.hLarge + padding.hSmall} ${height + padding.vTop + padding.vBottom}`);
		break;
	case 'top right':
		svg.attr('width', width + padding.hLarge + padding.hSmall)
		.attr('height', height + padding.vTop + padding.vBottom)
		.attr('viewBox', `${-padding.hLarge} ${-height - padding.vBottom} ${width + padding.hLarge + padding.hSmall} ${height + padding.vTop + padding.vBottom}`);
		break;
	}

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.charge(n => n.charge)
		.chargeDistance(chargeDistance)
		.linkStrength(l => l.linkStrength)
		.linkDistance(l => l.distance)
		.gravity(0.01)
		.size([width, height]);

	setTimeout(() => {
		links.filter(l => l.toRoot).forEach(l => l.linkStrength = 0.5);
		force.links(links).start().alpha(0.1);
	}, 1000);
	setTimeout(() => {
		links.filter(l => l.toRoot).forEach(l => l.linkStrength = 10);
		force.links(links).start().alpha(0.1);
	}, 2000);

	const labelForce = d3.layout.force()
		.nodes(labelAnchorNodes)
		.links(labelAnchorLinks)
		.charge(n => n.charge || 0)
		.chargeDistance(totalRingSize)
		.gravity(0.01)
		.linkStrength(options.tightlyBoundLabels ? 10 : 0.5)
		.linkDistance(3)
		.size([width, height]);

	const drag = force.drag()
		.on('dragstart', () => nodes.forEach(n => n.fixed = true ));
	const dragLabel = labelForce.drag()
		.on('dragstart', () => labelAnchorNodes.forEach(n => n.fixed = true ));

	force.on('tick', function () {

		nodes.forEach(function (d) {

			// Attach the label node to this node
			if (d.labelAnchor) {
				d.labelAnchor.px = d.x;
				d.labelAnchor.py = d.y;
				d.labelAnchor.x = d.x;
				d.labelAnchor.y = d.y;
			}
		});
		node.attr('transform', d => `translate(${d.x}, ${d.y})`);
		labelForce.alpha(0.1);
	});

	labelForce.on('tick', function () {
		labelLine
			.attr('x1', function (d) { return d.source.x; })
			.attr('y1', function (d) { return d.source.y; })
			.attr('x2', function (d) { return d.target.x; })
			.attr('y2', function (d) { return d.target.y; });
		labelNode.attr('transform', d => `translate(${d.x}, ${d.y})`);
	});

	const node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('svg:g')
		.attr('class', d => d.rootEl ? 'rootNode' : 'node')
		.attr('id', n => `${n['hidden-graph-item-id']}--graph-point`)
		.call(drag);

	const labelNode = svg.selectAll('.label-node')
		.data(labelAnchorNodes)
		.enter()
		.append('svg:g')
		.call(dragLabel)
		.attr('id', n => `${n.id}`);

	const labelLine = svg.selectAll('.label.link')
		.data(labelAnchorLinks)
		.enter()
		.append('svg:line')
		.style('stroke', options.tightlyBoundLabels ? 'transparent' : 'grey')
		.style('stroke-width', '1px');

	labelNode
		.append('svg:text')
		.attr('class', 'd3-label bg')
		.attr('x', '-10px')
		.attr('y', '5px')
		.each(function (n) {
			if (!n.text) return;
			const strs = options.lineWrapLabels ? n.text.split(' ') : [n.text];
			strs.forEach((str, i) => {
				d3.select(this)
				.append('svg:tspan')
				.text(str)
				.attr('x', 0)
				.attr('y', (i - (strs.length/2)) + 'em');
			});
		});

	labelNode
		.append('svg:text')
		.attr('class', 'd3-label')
		.attr('x', '-10px')
		.attr('y', '5px')
		.each(function (n) {
			if (!n.text) return;
			const strs = options.lineWrapLabels ? n.text.split(' ') : [n.text];
			strs.forEach((str, i) => {
				d3.select(this)
				.append('svg:tspan')
				.text(str)
				.attr('x', 0)
				.attr('y', (i - (strs.length/2)) + 'em');
			});
		});

	node.style('display', d => (d.visible === false && d.rootEl !== true) ? 'none' : 'initial');

	function mouseover (d) {
		const labelSelector = '#' + `${d['hidden-graph-item-id']}--graph-label`;
		renderOnTop.attr('xlink:href', labelSelector);
		document.querySelector(labelSelector).classList.add('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.add('hovering');
	}

	function mouseout (d) {
		const labelSelector = '#' + `${d['hidden-graph-item-id']}--graph-label`;
		renderOnTop.attr('xlink:href', '#');
		document.querySelector(labelSelector).classList.remove('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.remove('hovering');
	}

	function showTable (d, alsoUncollapseTable) {

		if (alsoUncollapseTable && document.querySelector('.filter-table') !== null){
			const row = document.getElementById(d['hidden-graph-item-id']);
			if (!row) return;
			row.classList.toggle('collapsed');
		} else {

			boilDown.innerHTML = '';
			d.longDesc.split('\n').forEach(line => {

				const aspects = line.split(':');

				if (aspects[0] === 'longdesc'){
					return;
				}

				const heading = document.createElement('h3');
				const info = document.createElement('p');

				heading.textContent = aspects[0];
				info.textContent = aspects[1];

				boilDown.appendChild(heading);
				boilDown.appendChild(info);

			});
		}
	}

	node.append('circle')
		.attr('class', n => `node${n.dot === false ? ' segment-label' : ''}`)
		.attr('r', 8)
		.style('fill', n => `hsla(${n['hidden-graph-item-hue']}, 95%, 60%, 1)`)
		.on('mouseover', mouseover)
		.on('mouseout', mouseout)
		.on('mouseover', showTable)
		.on('click', d => showTable(d, true))
		.append('svg:title')
		.text(n => n.longDesc);

	node.append('svg:text')
		.text(n => n.dot === false ? n.name : '')
		.attr('class', n => 'd3-label bg' + `${n.dot === false ? ' segment-label' : ''}`)
		.attr('x', '-10px')
		.attr('y', '5px');

	node.append('svg:text')
		.text(n => n.dot === false ? n.name : '')
		.attr('class', n => 'd3-label' + `${n.dot === false ? ' segment-label' : ''}`)
		.attr('x', '-10px')
		.attr('y', '5px');

	const rootNode = svg.select('.rootNode');

	rings.reverse();
	for (const ring of rings) {
		rootNode.append('svg:circle')
			.attr('class', 'background')
			.attr('r', ((ring.proportionalSizeEnd * (1 - innerWidth)) + innerWidth) * totalRingSize)
			.style('fill', ring.fill);
	}
	rings.reverse();


	// Add rectangles to hide other quadrants of the circle.
	const rectFill = 'rgba(255, 255, 255, 0.5)';
	switch(options.quadrant) {
	case 'bottom right':
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', 0)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize)
			.attr('height', totalRingSize * 2)
			.style('fill', rectFill);
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', 0)
			.attr('width', totalRingSize * 2)
			.attr('height', totalRingSize)
			.style('fill', rectFill);
		break;
	case 'bottom left':
		// Tall Box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize)
			.attr('height', totalRingSize * 2)
			.style('fill', rectFill);

		// Wide box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', 0)
			.attr('width', totalRingSize * 2)
			.attr('height', totalRingSize)
			.style('fill', rectFill);
		break;
	case 'top left':
		// Tall Box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize)
			.attr('height', totalRingSize * 2)
			.style('fill', rectFill);

		// Wide box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize * 2)
			.attr('height', totalRingSize)
			.style('fill', rectFill);
		break;
	case 'top right':
		// Tall Box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', 0)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize)
			.attr('height', totalRingSize * 2)
			.style('fill', rectFill);

		// Wide box
		rootNode.append('svg:rect')
			.attr('class', 'mask')
			.attr('x', -totalRingSize)
			.attr('y', -totalRingSize)
			.attr('width', totalRingSize * 2)
			.attr('height', totalRingSize)
			.style('fill', rectFill);
		break;
	}

	// Draw segment lines
	for (const lineOrigin of segmentLines) {
		rootNode.append('svg:line')
			.attr('x1', lineOrigin.x)
			.attr('y1', lineOrigin.y)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'rgba(255, 255, 255, 1)');
	}

	// Nothing goes in the middle  block it out
	rootNode.append('svg:circle')
		.attr('class', 'background mask')
		.attr('r', totalRingSize * innerWidth)
		.style('fill', 'rgba(255, 255, 255, 1)');


	// Ring labels
	(function () {
		let labelX;
		let labelY;
		switch(options.quadrant) {
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
		for (const ring of rings) {
			rootNode.append('svg:text')
				.text(ring.groupLabel || ring.min)
				.attr('class', 'd3-label ring-label bg')
				.attr('x', labelX)
				.attr('y', 5 + ((((ring.proportionalSizeStart + ring.width/2) * (1 - innerWidth)) + innerWidth) * labelY * totalRingSize) + 'px');
			rootNode.append('svg:text')
				.text(ring.groupLabel || ring.min)
				.attr('class', 'd3-label ring-label')
				.attr('x', labelX)
				.attr('y', 5 + ((((ring.proportionalSizeStart + ring.width/2) * (1 - innerWidth)) + innerWidth) * labelY * totalRingSize) + 'px');
		}

	}());

	force.start().alpha(0.05);
	labelForce.start().alpha(0.05);

	const renderOnTop = svg
	.append('svg:g')
	.append('svg:use');

	return svgNode;
};

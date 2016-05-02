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
	const nodes = data.slice(0);
	const innerWidth = 0.1;
	const totalRingSize = height;
	const chargeDistance = size/2;

	nodes.forEach(n => {
		n.ring = rings[Math.floor(n.datumValue)];
		const positionInRing = (n.datumValue % 1) * n.ring.width;
		const startPositionOfRing = (n.ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth;
		n.pseudoDatumValue = positionInRing + startPositionOfRing;
		n.weight = 0.1;

		// Initial boost of repulsion which drives them apart
		n.charge = -100 * (options.nodeRepulsion || 3) * Math.pow((Math.floor(n.datumValue) + 2)/rings.length, 2);
	});

	nodes.unshift({
		name: 'root',
		x: width,
		y: height,
		fixed: true,
		visible: false,
		rootEl: true,
		charge: 0
	});

	const segmentLines = [];
	// Draw an arc of attractive points with labels
	for (let i=0,l=rings[0].segments.length;i<l;i++) {
		const r = height * 1.05;
		const segment = rings[0].segments[i];
		const thetaMin = 1 * 2 * Math.PI/4; // slightly negative
		const thetaMax = 2 * 2 * Math.PI/4; // same amount from the otherside
		const arcWidth = thetaMax - thetaMin;
		const segmentWidth = arcWidth/(l+1);
		const theta = thetaMin + (1+i)*segmentWidth;
		nodes.push({
			name: rings[0].segmentBy !== 'hidden-graph-item-source' ? segment || 'null' : '',
			x: width + r * Math.cos(theta),
			y: height - r * Math.sin(theta),
			fixed: true,
			charge: 0,
			dot: false
		});
		segmentLines.push({
			x: r * Math.cos(theta - (segmentWidth/2)),
			y: r * -Math.sin(theta - (segmentWidth/2))
		});
		if (i === l-1) {
			segmentLines.push({
				x: r * Math.cos(theta + (segmentWidth/2)),
				y: r * -Math.sin(theta + (segmentWidth/2))
			});
		}
	}

	// remove first and last line
	segmentLines.pop();
	segmentLines.shift();

	const links = nodes.map((n, i) => ({
		target: 0,
		source: i,
		distance:(n.pseudoDatumValue || 0) * totalRingSize,
		linkStrength: 20,
		fixed: n.fixed
	}))
	.filter(l => !l.fixed);

	const labelAnchorNodes = [];
	const labelAnchorLinks = [];
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
			charge: options.tightlyBoundLabels ? -10 : -700,
			id: nodeToAttachTo['hidden-graph-item-id'] + '--graph-label'
		};

		// Pulls the label towards the node
		const anchorToNode = {
			__coment: 'Anchor Node',
			x,
			y,
			fixed: true,
			weight: 0,
			charge: -100
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
	for (const ring of rings) {
		labelAnchorNodes.push({
			__comment: 'ring label repulsion',
			x: totalRingSize + 100,
			y: -1 * (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize),
			fixed: true,
			charge: -700,
		});
	}

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
				links.push({
					target,
					source: j,
					distance: 0,
					linkStrength: 0.01 * (options.nodeAttraction || 3) * Math.pow(1.2, l)
				});
				break;
			}
		}
	});

	/**
	 * constiables
	 */

	const svgNode = document.createElementNS(d3.ns.prefix.svg, 'svg');
	const svg = d3.select(svgNode)
		.attr('width', width + 500 + 130)
		.attr('height', height + 100)
		.attr('viewBox', `-500 -50 ${width + 500 + 130} ${height + 100}`);

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.charge(n => n.charge)
		.chargeDistance(chargeDistance)
		.linkStrength(l => l.linkStrength)
		.linkDistance(l => l.distance)
		.gravity(0)
		.size([width, height]);

	const labelForce = d3.layout.force()
		.nodes(labelAnchorNodes)
		.links(labelAnchorLinks)
		.charge(n => n.charge || 0)
		.gravity(0.1)
		.linkStrength(options.tightlyBoundLabels ? 10 : 1)
		.linkDistance(3)
		.size([width, height]);

	const drag = force.drag()
		.on('dragstart', () => nodes.forEach(n => n.fixed = true ));
	const dragLabel = labelForce.drag()
		.on('dragstart', () => labelAnchorNodes.forEach(n => n.fixed = true ));

	force.on('tick', function () {

		nodes.forEach(function (d) {
			if (d.x > width) [d.x, d.px] = [d.px, d.x];
			if (d.y > height) [d.y, d.py] = [d.py, d.y];

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
		.call(dragLabel)
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

	function showTable (d) {

		if(document.querySelector('.filter-table') !== null){
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
	rootNode.append('svg:rect')
		.attr('class', 'mask')
		.attr('x', 0)
		.attr('y', -totalRingSize)
		.attr('width', totalRingSize)
		.attr('height', totalRingSize * 2)
		.style('fill', 'rgba(255, 255, 255, 1)');
	rootNode.append('svg:rect')
		.attr('class', 'mask')
		.attr('x', -totalRingSize)
		.attr('y', 0)
		.attr('width', totalRingSize * 2)
		.attr('height', totalRingSize)
		.style('fill', 'rgba(255, 255, 255, 1)');

	for (const lineOrigin of segmentLines) {
		rootNode.append('svg:line')
			.attr('x1', lineOrigin.x)
			.attr('y1', lineOrigin.y)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'rgba(255, 255, 255, 1)');
	}

	// Nothing goes in the middle ring
	rootNode.append('svg:circle')
		.attr('class', 'background mask')
		.attr('r', totalRingSize * innerWidth)
		.style('fill', 'rgba(255, 255, 255, 1)');


	for (const ring of rings) {
		rootNode.append('svg:text')
			.text(ring.groupLabel || ring.min)
			.attr('class', 'd3-label ring-label bg')
			.attr('x', '-5')
			.attr('y', -10 + (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize) + 'px');
		rootNode.append('svg:text')
			.text(ring.groupLabel || ring.min)
			.attr('class', 'd3-label ring-label')
			.attr('x', '-5')
			.attr('y', -10 + (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize) + 'px');
	}

	force.start().alpha(0.05);
	labelForce.start().alpha(0.05);

	const renderOnTop = svg
	.append('svg:g')
	.append('svg:use');

	return svgNode;
};

/* global d3 */
/**
 * Based on http://bl.ocks.org/MoritzStefaner/1377729
 */

'use strict';

module.exports = function ({
	data,
	size,
	rings,
	ringColor
}) {

	const width = (size || 400);
	const height = (size || 400);
	const nodes = data.slice(0);
	nodes.forEach(n => {
		n.x = width/2 + (Math.random() * 100) - 50;
		n.y = height/2 + (Math.random() * 100) - 50;
		n.weight = 40;
		n.charge = 0;
	});
	const ringSize = height / (rings.length + 1);

	nodes.unshift({
		name: 'root',
		x: width,
		y: height,
		fixed: true,
		visible: false,
		rootEl: true,
		charge: 0
	});

	const links = nodes.map((n, i) => ({
		target: 0,
		source: i,
		distance: (1 + (n.datumValue || 0)) * ringSize
	}))
	.filter(l => !!l.source);

	/**
	 * constiables
	 */

	const svgNode = document.createElementNS(d3.ns.prefix.svg, 'svg');
	const svg = d3.select(svgNode)
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`);

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.gravity(0.015)
		.charge(-60)
		.linkStrength(30)
		.linkDistance(l => l.distance)
		.size([width, height]);

	force.on('tick', function () {

		// bounce off the walls
		nodes.forEach(function (d) {
			if (d.x > width) [d.x, d.px] = [d.px, d.x];
			if (d.y > height) [d.y, d.py] = [d.py, d.y];
			d.x = d.x % (width * 4);
			d.y = d.y % (height * 4);
		});
		node.attr('transform', d => `translate(${d.x}, ${d.y})`);
	});

	const node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('svg:g')
		.attr('class', d => d.rootEl ? 'rootNode' : 'node');

	node.style('display', d => (d.visible === false && d.rootEl !== true) ? 'none' : 'initial');

	function mouseover (d) {
		this.parentNode.classList.add('hovering');
		const row = document.getElementById(d.name);
		if (!row) return;
		row.classList.add('hovering');
	}

	function mouseout (d) {
		this.parentNode.classList.remove('hovering');
		const row = document.getElementById(d.name);
		if (!row) return;
		row.classList.remove('hovering');
	}

	function click (d) {
		const row = document.getElementById(d.name);
		if (!row) return;
		row.classList.toggle('collapsed');
	}

	node.append('circle')
		.attr('class', 'node')
		.attr('r', 8)
		.attr('id', n => `${n.name}--graph-point`)
		.style('fill', n => `hsla(${n['hidden-graph-item-hue']}, 95%, 60%, 1)`)
		.on('mouseover', mouseover)
		.on('mouseout', mouseout)
		.on('click', click)
		.append('svg:title')
		.text(n => n.longDesc);

	node.append('svg:text')
		.text(d => d.name || '')
		.attr('class', 'd3-label')
		.attr('x', '-10px')
		.attr('y', '5px');

	const gradient = svg.append('svg:defs')
		.append('svg:radialGradient')
		.attr('id', 'radgrad')
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '100%')
		.attr('y2', '100%')
		.attr('spreadMethod', 'pad');

	// Define the gradient colors
	gradient.append('svg:stop')
		.attr('offset', '90%')
		.attr('stop-color', 'rgba(0, 0, 0, 0)')
		.attr('stop-opacity', 1);

	gradient.append('svg:stop')
		.attr('offset', '100%')
		.attr('stop-color', 'rgba(0, 0, 0, 0.3)')
		.attr('stop-opacity', 1);

	const rootNode = svg.select('.rootNode');
	const baseColor = ringColor ||  "#fff1e0";

	const dampener = 1.1;
	for (let i=0; i<rings.length; i++) {
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', (rings[i].max + 1) * ringSize)
			.style('fill', baseColor);
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', (rings[i].max + 1 ) * ringSize)
			.style('fill', `rgba(0,0,0, 0.${ (i * dampener) | 0})`);
	}


	for (let i=0; i<rings.length; i++) {
		rootNode.append('svg:text')
			.text(rings[rings.length - i - 1].groupLabel || i)
			.attr('class', 'd3-label')
			.attr('x', '-16px')
			.attr('y', (-(i + 1) * ringSize) + 'px');
	}

	// Nothing goes in the middle ring
	rootNode.append('circle')
		.attr('class', 'background')
		.attr('r', ringSize)
		.style('fill', 'rgba(255, 255, 255, 1)');

	force.start().alpha(0.05);

	return svgNode;
};

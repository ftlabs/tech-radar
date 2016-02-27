/* global d3 */
/**
 * Based on http://bl.ocks.org/MoritzStefaner/1377729
 */

'use strict';

module.exports = function ({
	data,
	width,
	height
}) {

	width = width || 400;
	height = height || 400;
	const nodes = data.slice(0);
	const ringSize = height / 10;

	const links = nodes.map((n, i) => ({
		target: 0,
		source: i + 1,
		distance: (10 - n['do-able']) * ringSize
	}));

	nodes.unshift({
		name: 'root',
		x: width,
		y: height,
		fixed: true,
		visible: false,
		rootEl: true
	});

	/**
	 * constiables
	 */

	const svgNode = document.createElementNS(d3.ns.prefix.svg, 'svg');
	const svg = d3.select(svgNode)
		.attr('width', width)
		.attr('height', height);

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.gravity(0.1)
		.charge(-100)
		.chargeDistance(150)
		.linkStrength(20)
		.linkDistance(l => l.distance)
		.size([width, height]);

	force.on('tick', function () {
		node.attr('transform', d => `translate(${d.x}, ${d.y})`);
	});

	const node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('svg:g')
		.attr('class', d => d.rootEl ? 'rootNode' : 'node');

	node
		.style('display', d => (d.visible === false && d.rootEl !== true) ? 'none' : 'initial');

	node.append('circle')
		.attr('class', 'node')
		.attr('r', 8)
		.style('fill', 'white')
		.style('stroke-width', '2px')
		.style('stroke', 'black');

	node.append('svg:text')
		.text(d => d.name || '')
		.attr('class', 'd3-label');

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
		.attr('stop-color', 'rgba(255, 255, 255, 0)')
		.attr('stop-opacity', 1);

	gradient.append('svg:stop')
		.attr('offset', '100%')
		.attr('stop-color', '#CCCCFF')
		.attr('stop-opacity', 1);

	const rootNode = svg.select('.rootNode');
	for (let i=0; i<10; i++) {
		rootNode.append('circle')
			.attr('class', 'node')
			.attr('r', (10 - i) * ringSize)
			.style('fill', `url(#radgrad)`);
	}

	force.start().alpha(0.1);

	return svgNode;
};

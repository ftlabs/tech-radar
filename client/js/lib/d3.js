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

	width = (height || 400) * 1.5;
	height = height || 400;
	const nodes = data.slice(0);
	nodes.forEach(n => {
		n.x = width/2 + (Math.random() * 50);
		n.y = height/2 + (Math.random() * 50);
	});
	const ringSize = height / 10;

	nodes.unshift({
		name: 'root',
		x: width,
		y: height,
		fixed: true,
		visible: false,
		rootEl: true
	});

	const links = nodes.map((n, i) => ({
		target: 0,
		source: (!!n['do-able'] ? i : 0),
		distance: (10.5 - n['do-able']) * ringSize
	}))
	.filter(l => !!l.source);

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
		.gravity(0.05)
		.charge(-200)
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
		.attr('r', 8);

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
	for (let i=0; i<10; i++) {
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', (10 - i) * ringSize)
			.style('fill', `hsla(${i * 36}, 100%, 85%, 1)`);
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', (10 - i) * ringSize)
			.style('fill', `url(#radgrad)`);
	}

	force.start().alpha(0.1);

	return svgNode;
};

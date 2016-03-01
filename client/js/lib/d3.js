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

	width = (width || 400);
	height = (width || 400) - 30;
	const nodes = data.slice(0);
	nodes.forEach(n => {
		n.x = width/2 + (Math.random() * 100) - 50;
		n.y = height/2 + (Math.random() * 100) - 50;
		n.weight = 10;
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
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`);

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.gravity(0.01)
		.charge(-60)
		.linkStrength(10)
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

	node.append('circle')
		.attr('class', 'node')
		.attr('r', 8)
		.attr('id', n => `${n.name}--graph-point`)
		.style('fill', n => `hsla(${n['hidden-graph-item-hue']}, 95%, 60%, 1)`)
        .on('mouseover', mouseover)
		.on('mouseout', mouseout);

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

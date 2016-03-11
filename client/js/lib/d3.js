/* global d3 */
/**
 * Based on http://bl.ocks.org/MoritzStefaner/1377729
 */

'use strict';

module.exports = function ({
	data,
	size,
	rings,
}) {

	const width = (size || 400);
	const height = (size || 400);
	const nodes = data.slice(0);
	nodes.forEach(n => {
		n.weight = 30;
		n.charge = -60;
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


	const segmentLines = [];
	// Draw an arc of attractive points with labels
	const r = height;
	for (let i=0,l=rings[0].segments.length;i<l;i++) {
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

	const links = nodes.map((n, i) => ({
		target: 0,
		source: i,
		distance: n.distance || (1 + (n.datumValue || 0)) * ringSize,
		linkStrength: 1,
		fixed: n.fixed
	}))
	.filter(l => !l.fixed);

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
					linkStrength: 0.1
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
		.attr('width', width + 100)
		.attr('height', height + 100)
		.attr('viewBox', `100 100 ${width} ${height}`);

	svg
	.style('margin', '-100px 0 0 -100px');

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.charge(n => n.charge)
		.linkStrength(l => l.linkStrength)
		.linkDistance(l => l.distance)
		.gravity(0)
		.size([width, height]);

	force.on('tick', function () {

		// bounce off the walls
		nodes.forEach(function (d) {
			if (d.x > width) [d.x, d.px] = [d.px, d.x];
			if (d.y > height) [d.y, d.py] = [d.py, d.y];
			d.x = d.x % (width * 4);
			d.y = d.y % (height * 4);
		});
		node
			.attr('transform', d => `translate(${d.x}, ${d.y})`);
			// .select('.d3-label')
			// .attr('transform', d => {
			// 	return `rotate(${90 * ((d.x - (width - height))/height)})`;
			// });
	});

	const node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('svg:g')
		.attr('class', d => d.rootEl ? 'rootNode' : 'node');

	node.style('display', d => (d.visible === false && d.rootEl !== true) ? 'none' : 'initial');

	function mouseover (d) {
		this.parentNode.classList.add('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.add('hovering');
	}

	function mouseout (d) {
		this.parentNode.classList.remove('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.remove('hovering');
	}

	function click (d) {
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.toggle('collapsed');
	}

	node.append('circle')
		.attr('class', n => `node${n.dot === false ? ' no-dot' : ''}`)
		.attr('r', 8)
		.attr('id', n => `${n.name}--graph-point`)
		.style('fill', n => `hsla(${n['hidden-graph-item-hue']}, 95%, 60%, 1)`)
		.on('mouseover', mouseover)
		.on('mouseout', mouseout)
		.on('click', click)
		.append('svg:title')
		.text(n => n.longDesc);

	node.append('svg:text')
		.text(n => n.name || '')
		.attr('class', n => `d3-label${n.dot === false ? ' no-dot' : ''}`)
		.attr('x', n => n.dot !== false ? '-10px' : '0px')
		.attr('y', '5px');

	const rootNode = svg.select('.rootNode');

	for (let i=0; i<rings.length; i++) {
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', (rings[i].max + 1) * ringSize)
			.style('fill', rings[i].fill);
	}

	for (const lineOrigin of segmentLines) {
		rootNode.append('line')
			.attr('x1', lineOrigin.x)
			.attr('y1', lineOrigin.y)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'rgba(255, 255, 255, 1)');
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

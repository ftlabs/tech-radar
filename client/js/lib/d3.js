/* global d3 */
/**
 * Based on http://bl.ocks.org/MoritzStefaner/1377729
 */

'use strict';

module.exports = function ({
	data,
	size,
	rings
}) {

	const boilDown = document.getElementById('boil-down');
	const width = (size || 400);
	const height = (size || 400);
	const nodes = data.slice(0);
	const innerWidth = 0.1;
	const totalRingSize = height;
	const chargeDistance = size/4;

	nodes.forEach(n => {
		n.ring = rings[Math.floor(n.datumValue)];
		const positionInRing = (n.datumValue % 1) * n.ring.width;
		const startPositionOfRing = (n.ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth;
		n.pseudoDatumValue = positionInRing + startPositionOfRing;
		n.weight = 0.1;

		// Initial boost of repulsion which drives them apart
		n.charge = -80;
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
					linkStrength: 0.03 * Math.pow(1.2, l)
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
		.attr('width', width + 500)
		.attr('height', height + 50)
		.attr('viewBox', `-500 -50 ${width + 500} ${height + 50}`);

	const force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.charge(n => n.charge)
		.chargeDistance(chargeDistance)
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
		node.attr('transform', d => `translate(${d.x}, ${d.y})`);
	});

	const node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('svg:g')
		.attr('class', d => d.rootEl ? 'rootNode' : 'node')
		.attr('id', n => `${n['hidden-graph-item-id']}--graph-point`);

	node.style('display', d => (d.visible === false && d.rootEl !== true) ? 'none' : 'initial');

	function mouseover (d) {
		renderOnTop.attr('xlink:href', '#' + `${d['hidden-graph-item-id']}--graph-point`);
		this.parentNode.classList.add('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.add('hovering');
	}

	function mouseout (d) {
		renderOnTop.attr('xlink:href', '#');
		this.parentNode.classList.remove('hovering');
		const row = document.getElementById(d['hidden-graph-item-id']);
		if (!row) return;
		row.classList.remove('hovering');
	}

	function click (d) {

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
		.attr('class', n => `node${n.dot === false ? ' no-dot' : ''}`)
		.attr('r', 8)
		.style('fill', n => `hsla(${n['hidden-graph-item-hue']}, 95%, 60%, 1)`)
		.on('mouseover', mouseover)
		.on('mouseout', mouseout)
		.on('click', click)
		.append('svg:title')
		.text(n => n.longDesc);

	node.append('svg:text')
		.text(n => n.name || '')
		.attr('class', n => `d3-label bg${n.dot === false ? ' no-dot' : ''}`)
		.attr('x', n => n.dot !== false ? '-10px' : '0px')
		.attr('y', '5px');

	node.append('svg:text')
		.text(n => n.name || '')
		.attr('class', n => `d3-label${n.dot === false ? ' no-dot' : ''}`)
		.attr('x', n => n.dot !== false ? '-10px' : '0px')
		.attr('y', '5px');

	const rootNode = svg.select('.rootNode');

	rings.reverse();
	for (const ring of rings) {
		rootNode.append('circle')
			.attr('class', 'background')
			.attr('r', ((ring.proportionalSizeEnd * (1 - innerWidth)) + innerWidth) * totalRingSize)
			.style('fill', ring.fill);
	}
	rings.reverse();

	for (const lineOrigin of segmentLines) {
		rootNode.append('line')
			.attr('x1', lineOrigin.x)
			.attr('y1', lineOrigin.y)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'rgba(255, 255, 255, 1)');
	}


	for (const ring of rings) {
		rootNode.append('svg:text')
			.text(ring.groupLabel || ring.min)
			.attr('class', 'd3-label bg')
			.attr('x', '-16px')
			.attr('y', (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize) + 'px');
		rootNode.append('svg:text')
			.text(ring.groupLabel || ring.min)
			.attr('class', 'd3-label')
			.attr('x', '-16px')
			.attr('y', (((ring.proportionalSizeStart * (1 - innerWidth)) + innerWidth) * -totalRingSize) + 'px');
	}

	// Nothing goes in the middle ring
	rootNode.append('circle')
		.attr('class', 'background')
		.attr('r', totalRingSize * innerWidth)
		.style('fill', 'rgba(255, 255, 255, 1)');

	force.start().alpha(0.05);

	const renderOnTop = svg
	.append('svg:g')
	.append('svg:use');

	return svgNode;
};

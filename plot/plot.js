/* globals d3 */
'use strict';

d3.csv('./all.csv', function(d) {
  return {
    config: d.config,
    name: d.name,
    req_per_sec: +d.req_per_sec,
    byte_per_sec: +d.byte_per_sec / 1024,
  };
}, function(error, data) {
  if (error) throw error;

  draw(d3.select('#hello-plot'), data.filter(d => d.name.indexOf('hello') !== -1));
  draw(d3.select('#view-plot'), data.filter(d => d.name.indexOf('view') !== -1));
  draw(d3.select('#passport-plot'), data.filter(d => d.name.indexOf('passport') !== -1));
  draw(d3.select('#aa-plot'),
    data.filter(d => d.name.indexOf('aa') !== -1)
      .concat(data.filter(d => d.name.indexOf('koa2') !== -1)));
});

function draw(svg, data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  const canvas = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const groupX = d3.scaleBand()
    .rangeRound([ 0, width ])
    .paddingInner(0.2);

  const barX = d3.scaleBand()
    .padding(0.1);

  const y = d3.scaleLinear()
    .rangeRound([ height, 0 ]);

  const z = d3.scaleOrdinal()
    .range([
      '#00bcd4', '#ffc107', '#8bc34a', '#ad8de4', '#f17e7e'
    ]);

  const groupKeys = Array.from(new Set(data.map(d => d.name)));
  const valueKeys = [
    'req_per_sec',
    // 'byte_per_sec'
  ];
  const configKeys = Array.from(new Set(data.map(d => d.config)));
  const barKeys = [];
  for (const v of valueKeys) {
    for (const b of configKeys) {
      barKeys.push(`${v}:${b}`);
    }
  }

  groupX.domain(groupKeys);
  barX.domain(barKeys).rangeRound([ 0, groupX.bandwidth() ]);
  const maxY = d3.max(data, d => d3.max(valueKeys, key => d[key]));
  y.domain([ 0, maxY / 4 * 5 ]).nice();

  const nested = d3.nest().key(d => d.name).entries(data);
  const groups = canvas.append('g')
    .selectAll('g')
    .data(nested)
    .enter()
      .append('g');

  const bars = groups
    .attr('transform', d => `translate(${groupX(d.key)}, 0)`)
    .selectAll('rect')
    .data(function(d) {
      const values = d.values;
      const result = [];
      for (const item of values) {
        for (const v of valueKeys) {
          result.push({
            config: item.config,
            name: item.name,
            key: v,
            value: item[v],
          });
        }
      }
      return result;
    })
    .enter()
      .append('rect');

  bars
    .attr('x', d => barX(`${d.key}:${d.config}`))
    .attr('y', d => y(d.value))
    .attr('width', barX.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('class', d => d.key)
    .attr('fill', d => z(d.config));

  canvas.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(groupX));

  canvas.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(null, 's'))
    .append('text')
      .attr('x', 2)
      .attr('y', y(y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text('req/s');

  const legend = canvas.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(configKeys.slice().reverse())
    .enter()
      .append('g');

  legend
    .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', z);

  legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
}

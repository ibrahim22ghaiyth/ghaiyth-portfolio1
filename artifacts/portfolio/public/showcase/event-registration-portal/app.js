const project = {
  "title": "Event Registration Portal",
  "year": 2022,
  "accent": "#8b5cf6",
  "items": [
    "Discovery",
    "Design",
    "Development",
    "Review",
    "Delivery"
  ]
};

const metricValues = [27, 5, 94];
document.querySelectorAll('[data-count]').forEach((node, index) => {
  let current = 0;
  const target = metricValues[index] || 12;
  const timer = setInterval(() => {
    current += Math.max(1, Math.ceil(target / 24));
    if (current >= target) { current = target; clearInterval(timer); }
    node.textContent = current + (index === 2 ? '%' : '');
  }, 35);
});

const list = document.querySelector('[data-workflow]');
project.items.forEach((item, index) => {
  const row = document.createElement('button');
  row.className = 'workflow-item';
  row.innerHTML = '<span>0' + (index + 1) + '</span><strong>' + item + '</strong><small>' + (index === 4 ? 'Complete' : 'Ready') + '</small>';
  row.addEventListener('click', () => {
    document.querySelector('[data-selected]').textContent = item + ' step selected for ' + project.title;
  });
  list.appendChild(row);
});

document.querySelector('[data-year]').textContent = project.year;
document.querySelector('[data-selected]').textContent = 'Interactive demo ready';

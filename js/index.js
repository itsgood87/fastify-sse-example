import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-luxon'
import { DateTime } from 'luxon';

// Store chart data
let data = [];

// Connect to the SSE endpoint
const eventSource = new EventSource("/sse");

// Create a chart
let chart = new Chart(
  document.getElementById('chart'),
  {
    type: 'line',
    data: {
      labels: data.map(p => p.x),
      datasets: [
        {data:data.map(p => p.y)}
      ]
    },
    options: {
      animation: false,
      scales: {
       y: {
        suggestedMin: 0,
        suggestedMax: 10
       },
       x: {
        type: 'time',
        time: {
          minUnit: 'second'
        }
       } ,
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }
);

// Listen for 'clients' events
eventSource.addEventListener("clients", (e) => {
  document.querySelector("#client_count").innerHTML = e.data;
});

// Listen for 'initial_data' events
eventSource.addEventListener("initial_data", (e) => {
  // Parse the data and store in data array
  console.log(e)
  data = JSON.parse(e.data);

  // Update the chart
  chart.data.labels = data.map(p => p.x);
  chart.data.datasets[0].data = data.map(p => p.y)

  chart.update();
});

// Listen for 'data' events
eventSource.addEventListener("data", (e) => {
  // Parse the data point
  let point = JSON.parse(e.data);

  // Limit data to 50 points
  if(data.length > 50) data.shift();
  data.push(point);

  // Update the chart
  chart.data.labels = data.map(p => p.x);
  chart.data.datasets[0].data = data.map(p => p.y)

  chart.update();

  // Update list
  let list = document.querySelector('#list');
  let item = document.createElement('li');
  item.innerHTML = `Value <span class="font-medium">${point.y}</span> generated on <span class="font-medium">${DateTime.fromMillis(point.x).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}</span>`
  list.prepend(item);

  // Limit list to 10
  if(list.childElementCount > 10) list.removeChild(list.childNodes[list.childElementCount - 1]);
});

eventSource.addEventListener("error", (e) => {
  let status = document.querySelector('#status');
  status.innerHTML = "Not Connected";
  status.classList.remove('text-green-800');
  status.classList.add('text-red-800');
});

eventSource.addEventListener("open", (e) => {
  let status = document.querySelector('#status');
  status.innerHTML = "Connected";
  status.classList.remove('text-red-800');
  status.classList.add('text-green-800');
});
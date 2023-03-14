import { Chart } from 'chart.js/auto';

// Store chart data
const data = [
  {num:1, value: 5.6},
  {num:2, value: 6.6},
  {num:3, value: 8.6},
  {num:4, value: 3.6},
  {num:5, value: 9.6}
]

// Connect to the SSE endpoint
const eventSource = new EventSource("/sse");

let chart = new Chart(
  document.getElementById('chart'),
  {
    type: 'line',
    data: {
      labels: data.map(row => row.num),
      datasets: [
        {data:data.map(row => row.value)}
      ]
    }
  }
);

// Listen for message events
eventSource.addEventListener("message", (e) => {

// Parse the data
  const data = JSON.parse(e.data);

  switch (data.event) {
    case "clients":
      document.querySelector("#client_count").innerHTML = data.value;
      break;
    default:
  }
});
async function historicIndicator(indicatorName) {
    try {
      const response = await fetch(`https://mindicador.cl/api/${indicatorName}`);
      const data = await response.json();
      return data;
    } catch (error) {
        console.error('Fetch Error', error);
    }
  }

async function graphHistoricIndicator(indicatorName){
    const container = document.getElementById('price-evolution');
    container.innerHTML = '';
    let newCanvas = document.createElement('canvas');
    newCanvas.id = 'myChart';
    newCanvas.height = 500;
    document.getElementById('price-evolution').appendChild(newCanvas);
    let historic = await historicIndicator(indicatorName);
    let dates = historic.serie.map((element) => element.fecha);
    let values = historic.serie.map((element) => element.valor);
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => moment(date).format('YYYY-MM-DD')),
            datasets: [{
                label: `Evolución del ${indicatorName}`,
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                    },
                    ticks: {
                        source: 'data',
                        autoSkip: true
                    }
                },
                y: {
                    beginAtZero: false
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
        });
}

document.getElementById('search-button').addEventListener('click', async () => {
    let currencyInput = document.getElementById('currencyInput').value;
    let currencySelect = document.getElementById('currencySelect').value;
    const resultSection = document.getElementById('result-section');
    let template = "";
    if (currencySelect == 'USD') {
        let historic = await historicIndicator('dolar');
        let indicator = historic.serie[0].valor;
        let conversionValue = Math.round(currencyInput / indicator * 10 ** 2) / 10 ** 2;
        template += `<p>USD ${conversionValue}</p>`
        resultSection.innerHTML = template;  
        graphHistoricIndicator('dolar');
    } else if (currencySelect == 'EUR') {
        let historic = await historicIndicator('euro');
        let indicator = historic.serie[0].valor;
        let conversionValue = Math.round(currencyInput / indicator * 10 ** 2) / 10 ** 2;
        template += `<p>EUR ${conversionValue}</p>`
        resultSection.innerHTML = template; 
        graphHistoricIndicator('euro');
    }
});
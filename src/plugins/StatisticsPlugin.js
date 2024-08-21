export function calculateIngagmentRate(statistics) {
  console.log(statistics);
  const totalReactions =
    statistics.positiveReactionCount +
    statistics.neutralReactionCount +
    statistics.negativeReactionCount;
  return totalReactions / statistics.membersCount;
}

export function pieChartConfig(statistics) {
  return {
    labels: ['Позитиные', 'Негативные', 'Нейтральные'],
    datasets: [
      {
        data: [
          statistics.positiveReactionCount,
          statistics.neutralReactionCount,
          statistics.negativeReactionCount
        ],
        backgroundColor: ['#3a33ff', '#ea0e0e', '#4a6e82'],
        hoverBackgroundColor: ['#0800ff', '#b70505', '#1b374f']
      }
    ]
  };
}

export const pieChartOptions = {
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        color: 'black'
      }
    }
  }
};

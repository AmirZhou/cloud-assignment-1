const HeatmapChart = ({ data }) => {
  if (!data || !data.labels || !data.data) {
    return <div className="text-gray-500">No data available</div>;
  }

  const { labels, data: matrix } = data;

  // Helper function to get color based on correlation value
  const getColor = (value) => {
    // Value ranges from -1 to 1
    const normalized = (value + 1) / 2; // Convert to 0-1 range
    const hue = normalized * 240; // Blue (240) to Red (0)
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-center font-semibold mb-2">Nutrient Correlation Heatmap</h3>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100"></th>
              {labels.map((label, i) => (
                <th key={i} className="border p-2 bg-gray-100 text-xs">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th className="border p-2 bg-gray-100 text-xs">{labels[i]}</th>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className="border p-2 text-center text-xs font-semibold"
                    style={{
                      backgroundColor: getColor(value),
                      color: value > 0 ? 'white' : 'black',
                    }}
                  >
                    {value.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-center text-gray-600">
        <span>Low correlation</span>
        <span className="mx-2">←</span>
        <span className="inline-block w-20 h-4 bg-gradient-to-r from-blue-500 to-red-500 align-middle"></span>
        <span className="mx-2">→</span>
        <span>High correlation</span>
      </div>
    </div>
  );
};

export default HeatmapChart;

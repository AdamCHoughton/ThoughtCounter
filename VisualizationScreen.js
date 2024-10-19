import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import Svg, { Rect } from 'react-native-svg';

const timeRangeOptions = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
  { label: '180 Days', value: 180 },
  { label: '365 Days', value: 365 },
  { label: 'All', value: 'all' }
];

const VisualizationScreen = ({ timestamps, loadTestData }) => {
  const [timeRange, setTimeRange] = useState(7);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [timestamps, timeRange]);

  const filteredData = useMemo(() => {
    if (timeRange === 'all') return timestamps;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    return timestamps.filter(item => new Date(item.time) >= cutoffDate);
  }, [timestamps, timeRange]);

  const eventData = useMemo(() => {
    const countByDay = {};
    filteredData.forEach(item => {
      const date = new Date(item.time);
      const dayKey = `${date.getMonth() + 1}/${date.getDate()}`;
      countByDay[dayKey] = (countByDay[dayKey] || 0) + 1;
    });

    const days = Object.keys(countByDay).sort((a, b) => {
      const [monthA, dayA] = a.split('/').map(Number);
      const [monthB, dayB] = b.split('/').map(Number);
      return new Date(2023, monthA - 1, dayA) - new Date(2023, monthB - 1, dayB);
    });

    return {
      labels: days,
      datasets: [{ data: days.map(day => countByDay[day]) }]
    };
  }, [filteredData]);

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
    barPercentage: 0.7,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
    },
  };

  const renderChart = () => {
    const ChartComponent = timeRange > 30 ? LineChart : BarChart;
    return (
      <ChartComponent
        data={eventData}
        width={screenWidth - 20}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        style={styles.chart}
        verticalLabelRotation={45}
        xLabelsOffset={-10}
        segments={5}
        fromZero
        showBarTops={false}
        withInnerLines={true}
        withOuterLines={true}
        withHorizontalLines={true}
        withVerticalLines={false}
        bezier={timeRange > 30}
      />
    );
  };

  return (
    <ScrollView style={styles.container} key={key}>
      <TouchableOpacity style={styles.loadTestDataButton} onPress={loadTestData}>
        <Text style={styles.loadTestDataButtonText}>Load Test Data</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={timeRange}
        onValueChange={(itemValue) => setTimeRange(itemValue)}
        style={styles.picker}
      >
        {timeRangeOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>

      <Text style={styles.title}>Events by Day</Text>
      {filteredData.length > 0 ? renderChart() : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
      
      {/* ... (keep the "Events by Hour" section as it was) */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  loadTestDataButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  loadTestDataButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  picker: {
    marginVertical: 10,
  },
});

export default VisualizationScreen;
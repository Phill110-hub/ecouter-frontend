import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './chart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopicChart = () => {
  const [topicData, setTopicData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchTopicAnalytics = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/topic-analytics`, {
          credentials: 'include',
        });
        const data = await res.json();
        const labels = Object.keys(data);
        const values = Object.values(data);
        setTopicData({ labels, data: values });
      } catch (err) {
        console.error('Failed to fetch topic analytics:', err);
      }
    };

    fetchTopicAnalytics();
  }, []);

  const pieData = {
    labels: topicData.labels,
    datasets: [
      {
        label: 'Transcript Topics',
        data: topicData.data,
        backgroundColor: [
          '#36a2eb',
          '#ff6384',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#2ecc71',
        ],
        borderColor: '#222',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>📊 Topic Analytics</h2>
      {topicData.labels.length ? (
        <Pie data={pieData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopicChart;

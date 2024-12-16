import { useState } from 'react';

const App = () => {
  let gooder = 0
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total ? (good - bad) / total : 0;
  const positivePercentage = total ? (good / total) * 100 : 0;

  const Button = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
  };

  const StatisticsLine = ({ text, value }) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    );
  };

  const Statistics = () => {
    if (total === 0) {
      return <p>No feedback given</p>;
    }

    return (
      <table>
        <tbody>
          <StatisticsLine text="Good" value={good} />
          <StatisticsLine text="Neutral" value={neutral} />
          <StatisticsLine text="Bad" value={bad} />
          <StatisticsLine text="Total" value={total} />
          <StatisticsLine text="Average" value={average.toFixed(2)} />
          <StatisticsLine text="Positive" value={positivePercentage.toFixed(2) + '%'} />
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button onClick={() => setBad(bad + 1)} text="Bad" />
      <h2>Statistics</h2>
      <Statistics />
    </div>
  );
};

export default App;

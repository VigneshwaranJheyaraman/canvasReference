import React from 'react';
import './App.css';
import LineGraph from './components/LineGraph';
import PieChart from './components/PieChart';

function App() {
  return (
    <div className="canvas">
    <PieChart canvasId="linegraph" canvasWidth = {500} canvasHeight={500}/>
      <LineGraph canvasWidth = {500} canvasHeight={500} xAxisDataSet={[1,2,3,4,5,6,7,8]} yAxisDataSet={[63,33,10,22,54,67,83,19]}/>
    </div>
  );
}

export default App;

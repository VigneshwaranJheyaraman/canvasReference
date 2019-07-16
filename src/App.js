import React from 'react';
import './App.css';
import LineGraph from './components/LineGraph';
import PieChart from './components/PieChart';

function App() {
  return (
    <div className="canvas">
    <PieChart canvasId="linegraph" canvasWidth = {500} canvasHeight={500}/>
      <LineGraph canvasWidth = {500} canvasHeight={500} xAxisDataSet={[1,2,3,4,5,6,7,8]}
       yAxisDataSet={{1:[63,33,10,22,54,67,83,19], 2:[34,21,4,54,23,12,43,56], 3:[10,21,32,43,54,65,76,88]}}
        shape="circle" crossHair={true} graphColors={["#81D435","#CCA640","#110CAC"]} graphType="line"/>
    </div>
  );
}

export default App;

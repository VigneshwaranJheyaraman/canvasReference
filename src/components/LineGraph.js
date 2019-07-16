import React, {Component} from 'react';
class LineGraph extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            mouseX:0,
            mouseY:0,
            canvasMargin:50,
            graphBoxSize:40,
            stepSize:10,
            xcoordMargin : 25,
            ycoordMargin: 10,
            toolTipVisibility:"hidden",
            toolTipLeft:0,
            toolTipTop: 0,
            coords: "",
            canvas:null,
            graphAlpha :{},
            hoveredGraph:1
        };
        this.canvasRef = React.createRef();
        this.mousePosition = this.mousePosition.bind(this);
        this.drawYAxis = this.drawYAxis.bind(this);
        this.plotDataSet = this.plotDataSet.bind(this);/* 
        this.equationOfLine = this.equationOfLine.bind(this);
        this.findXBar = this.findXBar.bind(this);
        this.getSummationXY = this.getSummationXY.bind(this);
        this.findSummationXSquare = this.findSummationXSquare.bind(this); */
    }
    
    componentDidMount()
    {
        let graphAlpha ={};
        for(var j in this.props.yAxisDataSet)
        {
            graphAlpha[j] = 0.6;
        }
        this.setState({canvas : this.canvasRef.current, graphAlpha: graphAlpha}, () => {
            this.state.canvas.getContext("2d").clearRect(0,0,this.props.canvasWidth, this.props.canvasHeight);
            this.drawYAxis(this.state.canvas.getContext("2d"));
            this.drawXAxis(this.state.canvas.getContext("2d"));
            this.plotDataSet(this.state.canvas.getContext("2d"));
        });
        //this.equationOfLine();
    }

    getMinimumValue(array)
    {
        return array.sort()[0];
    }

    getMaximiumValue(array)
    {
        return array.sort()[(array.length - 1)];
    }

    drawYAxis(ctx)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        ctx.beginPath();
        var stepSize =0;
        for(var i = lineGraphStartingPoint; i<=(this.state.canvas.height - this.state.canvasMargin); i += this.state.graphBoxSize)
        {
            var yCoordPosition = (stepSize);
            ctx.fillText(`${yCoordPosition}`, (lineGraphStartingPoint -this.state.xcoordMargin), i);
            stepSize += 10; //y axis step size
        }
        ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        ctx.lineTo(lineGraphStartingPoint, (this.state.canvas.height - this.state.canvasMargin));
        ctx.stroke();
        ctx.closePath();
    }

    drawXAxis(ctx)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        var xAxisLinePoint = ((this.state.canvas.height) - this.state.canvasMargin);
        ctx.beginPath();
        var stepSize = 0;
        for(var i = lineGraphStartingPoint; i<=(this.state.canvas.width - this.state.canvasMargin) ;(i += this.state.graphBoxSize))
        {
            var xPointCoord = (stepSize);
            ctx.fillText(`${xPointCoord}`, (i), (xAxisLinePoint + this.state.ycoordMargin));
            stepSize++;
        }
        ctx.moveTo(lineGraphStartingPoint, xAxisLinePoint);
        ctx.lineTo((this.state.canvas.width - this.state.canvasMargin), xAxisLinePoint);
        ctx.stroke();
        ctx.closePath();

    }

    generateRandomColor()
    {
        var color = "#";
        var values = '0123456789ABCDEF';
        for(var i=0;i<6;i++)
        {
            color += values[Math.floor(Math.random() * values.length)];
        }
        return color;
    }

    plotDataSet(ctx, graphType)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        ctx.beginPath();
        ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        for(let j in this.props.yAxisDataSet)
        {
            this.props.yAxisDataSet[j].forEach((v,i) => {
                let plotDotOffsetY = (((lineGraphStartingPoint+ (v -(10* Math.floor(v / 10)))))+(this.state.graphBoxSize* Math.floor(v / 10)));
                let plotDotOffsetX = (lineGraphStartingPoint +(this.state.graphBoxSize * (this.props.xAxisDataSet[i])));
                if(this.props.shape === "square")
                {
                    ctx.fillRect(plotDotOffsetX, plotDotOffsetY, 10,10);
                }
                else
                {
                    ctx.arc(plotDotOffsetX, plotDotOffsetY, 4, 0, Math.PI*2, true);
                }
                ctx.fillStyle= "grey";
                ctx.fill();
                ctx.closePath();
            });
            ctx.beginPath();
            ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        }
        ctx.closePath();
        for(let j in this.props.yAxisDataSet)
        {
            ctx.beginPath();
            ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
            this.props.yAxisDataSet[j].forEach((v,i) => {
                let plotDotOffsetY = (((lineGraphStartingPoint+ (v -(10* Math.floor(v / 10)))))+(this.state.graphBoxSize* Math.floor(v / 10)));
                let plotDotOffsetX = (lineGraphStartingPoint +(this.state.graphBoxSize * (this.props.xAxisDataSet[i])));
                switch(graphType)
                {
                    case "curve":{
                        let b_plotDotOffsetY = (((lineGraphStartingPoint+ (this.props.yAxisDataSet[j][i+1] -(10* Math.floor(this.props.yAxisDataSet[j][i+1] / 10)))))+(this.state.graphBoxSize* Math.floor(this.props.yAxisDataSet[j][i+1] / 10)));
                        let b_plotDotOffsetX = (lineGraphStartingPoint +(this.state.graphBoxSize * (this.props.xAxisDataSet[i+1])));
                        
                        let xc = (plotDotOffsetX + b_plotDotOffsetX)/2;
                        let yc = (plotDotOffsetY + b_plotDotOffsetY)/2;
                        ctx.quadraticCurveTo(plotDotOffsetX, plotDotOffsetY, xc, yc);
                        break;
                    }
                    default:{
                        ctx.lineTo(plotDotOffsetX, plotDotOffsetY);
                        ctx.moveTo(plotDotOffsetX,plotDotOffsetY);
                        break;
                    }
                }
            });
            ctx.strokeStyle=this.hexToRGBA(this.props.graphColors[j-1], this.state.graphAlpha[j]);
            ctx.stroke();
            ctx.closePath();
        }
    }

    mousePosition(e)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        var ctx = this.state.canvas.getContext("2d");
        ctx.clearRect(0,0,this.state.canvas.width, this.state.canvas.height);
        this.drawXAxis(ctx);
        this.drawYAxis(ctx);
        this.plotDataSet(ctx, this.props.graphType);
        var rect = this.state.canvas.getBoundingClientRect();
        ctx.beginPath();
        this.setState({mouseX : e.clientX - rect.left, mouseY: e.clientY - rect.top}, this.checkCoordMatches(lineGraphStartingPoint));
    }

    drawCrossHair(ctx,x,y)
    {
        if(this.props.crossHair)
        {
            ctx.beginPath();
            ctx.moveTo(this.state.mouseX, 0);
            ctx.lineTo(this.state.mouseX, this.state.canvas.height - this.state.canvasMargin);
            ctx.moveTo(0, this.state.mouseY);
            ctx.lineTo(this.state.canvas.width - this.state.canvasMargin, this.state.mouseY);
            if(x !== 0 && y !== 0)
            {
                ctx.font="20px Courier New";
                ctx.fillText(`${x},${y}`, this.state.mouseX +10, this.state.mouseY-10);
                ctx.fill();
            }
            else
            {
                var yCoord = this.state.mouseY === 90 ? 0 : ((this.state.mouseY - (this.state.canvasMargin + this.state.graphBoxSize)) / this.state.graphBoxSize) * 10;
                var xCoord = this.state.mouseX === 90 ? 0 : ((this.state.mouseX - (this.state.canvasMargin + this.state.graphBoxSize)) / this.state.graphBoxSize) * 1;
                ctx.font = "13px sans-serif";
                if(xCoord >=0 && yCoord >= 0)
                {
                    ctx.fillText(`${xCoord.toFixed(2)}, ${yCoord.toFixed(2)}`, this.state.mouseX, this.state.mouseY);
                }
            }
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.closePath();
        }
    }

    checkCoordMatches(startPt)
    {
        var ctx = this.state.canvas.getContext("2d");
        this.setState({toolTipVisibility:"hidden"}, () => {
            for(let j in this.props.yAxisDataSet)
            {
                this.props.yAxisDataSet[j].forEach((v,i) => {
                    let plotDotOffsetY = (((startPt+ (v -(10* Math.floor(v / 10)))))+(this.state.graphBoxSize* Math.floor(v / 10)));
                    let plotDotOffsetX = (startPt +(this.state.graphBoxSize * (this.props.xAxisDataSet[i])));
                    if(Math.floor(Math.abs((this.state.mouseX) - plotDotOffsetX) <= 3) && (Math.abs(Math.floor(this.state.mouseY) - plotDotOffsetY)) <= 3)
                    {
                        this.setState({hoveredGraph:j}, () => {
                            this.setState({coords:this.props.xAxisDataSet[i]+","+v, toolTipVisibility:"visible", 
                            toolTipTop: this.state.mouseY + this.state.canvas.height, 
                            toolTipLeft:this.state.mouseX, graphAlpha:Object.assign({}, this.state.graphAlpha, {[this.state.hoveredGraph]:1})
                            }, () => {this.drawCrossHair(ctx, this.props.xAxisDataSet[i],v);});});
                    }
                    else{
                        this.drawCrossHair(ctx,0,0);
                        this.setState({graphAlpha:Object.assign({}, this.state.graphAlpha, {[this.state.hoveredGraph]:0.6})});
                    }
                });
            }
        });
        ctx.closePath();
    }

    hexToRGBA(hex, alpha)
    {
        let color;
        if(/#([a-fA-F0-9]{3}){1,2}/.test(hex))
        {
            color = hex.substring(1).split("");
            color = "0x"+color.join("");
            return (`rgba(${[(color>>16)&255, (color >> 8)&255, color&255].join(",")},${alpha})`);
        }
        else
        {
            return "rgba(0,0,255,1)";
        }
    }

/* Line equation zone
    equationOfLine()
    {
        let xBar = this.findXBar();
        let xSquareBar = this.findSummationXSquare();
        var slope = {};
        var yBar ={};
        var yIntercept = {};
        let summationXY = {};
        var totalGraphSlopesNr = {};
        var totalGraphSlopeDr ={};
        for(var j in this.props.yAxisDataSet)
        {
            yBar[j] = this.findYBar(this.props.yAxisDataSet[j]);
            summationXY[j] = this.getSummationXY(this.props.yAxisDataSet[j]);
            this.props.yAxisDataSet[j].forEach((v,i) => {
                totalGraphSlopesNr[j] = (((this.props.xAxisDataSet.length) * summationXY[j]) - (xBar * yBar[j]));
                totalGraphSlopeDr[j] = (((this.props.xAxisDataSet.length) * xSquareBar) - (Math.pow(xBar, 2)));
            });
            console.log(`y-axis = ${this.props.yAxisDataSet[j]}\n x-axis = ${this.props.xAxisDataSet}\n EX = ${xBar} EX^2 = ${xSquareBar}\n EY = ${yBar[j]} EXY = ${summationXY[j]}`);
            slope[j] = (totalGraphSlopesNr[j] / totalGraphSlopeDr[j]).toFixed(3);
            yIntercept[j] = (((yBar[j]) - (slope[j] * xBar))/ this.props.xAxisDataSet.length).toFixed(3)
            console.log(`The equation of line ${j} is y = ${slope[j]}x ${yIntercept[j] > 0 ?"+" :""}${yIntercept[j]}`);
        }
    }

    getSummationXY(arr)
    {
        let summationXY =0;
        arr.forEach((v,i) => {
            if(!isNaN(this.props.xAxisDataSet[i]))
            {
                summationXY += (this.props.xAxisDataSet[i]*v);
            }
        });
        return summationXY;
    }

    findYBar(arra)
    {
        let mean = arra.reduce((t,v) => {return t+v;});
        return mean;
    }

    findXBar()
    {
        let mean = this.props.xAxisDataSet.reduce((t,v) => {return t+v;});
        return mean;
    }

    findSummationXSquare()
    {
        let summation =0;
        this.props.xAxisDataSet.forEach((v) => {
            summation += (v*v);
        });
        return summation;
    }

 */    render()
    {
        return (
            <div>
                <canvas id={this.props.canvasId} width = {this.props.canvasWidth} height={this.props.canvasHeight} style={{border:"1px solid",margin:"10px"}} ref={this.canvasRef} onMouseMove={this.mousePosition}/>
                <div className="tooltip" style={{visibility:this.state.toolTipVisibility, top:this.state.toolTipTop, left:this.state.toolTipLeft}}>{this.state.coords}
                </div>
            </div>
        );
    }
};
export default LineGraph;
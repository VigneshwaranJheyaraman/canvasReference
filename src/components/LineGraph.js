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
            canvas:null
        };
        this.canvasRef = React.createRef();
        this.mousePosition = this.mousePosition.bind(this);
        this.drawYAxis = this.drawYAxis.bind(this);
        this.plotDataSet = this.plotDataSet.bind(this);
    }
    
    componentDidMount()
    {
        this.setState({canvas : this.canvasRef.current}, () => {
            this.state.canvas.getContext("2d").clearRect(0,0,this.props.canvasWidth, this.props.canvasHeight);
            this.drawYAxis(this.state.canvas.getContext("2d"));
            this.drawXAxis(this.state.canvas.getContext("2d"));
            this.plotDataSet(this.state.canvas.getContext("2d"));
        });
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
        ctx.beginPath();
        var stepSize = 0;
        for(var i = lineGraphStartingPoint; i<=(this.state.canvas.width - this.state.canvasMargin) ;(i += this.state.graphBoxSize))
        {
            var xPointCoord = (stepSize);
            ctx.fillText(`${xPointCoord}`, (i), (lineGraphStartingPoint - this.state.ycoordMargin));
            stepSize++;
        }
        ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        ctx.lineTo((this.state.canvas.width - this.state.canvasMargin), lineGraphStartingPoint);
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

    plotDataSet(ctx)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        ctx.beginPath();
        ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        for(let j in this.props.yAxisDataSet)
        {
            this.props.yAxisDataSet[j].forEach((v,i) => {
                let plotDotOffsetY = (((lineGraphStartingPoint+ (v -(10* Math.floor(v / 10)))))+(this.state.graphBoxSize* Math.floor(v / 10)));
                let plotDotOffsetX = (lineGraphStartingPoint +(this.state.graphBoxSize * (this.props.xAxisDataSet[i])));
                ctx.arc(plotDotOffsetX, plotDotOffsetY, 4, 0, Math.PI*2, true);
                ctx.fillStyle= this.generateRandomColor();
                ctx.fill();
                ctx.closePath();
            });
            ctx.beginPath();
            ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        }
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
        for(let j in this.props.yAxisDataSet)
        {
            ctx.moveTo(lineGraphStartingPoint, lineGraphStartingPoint);
            this.props.yAxisDataSet[j].forEach((v,i) => {
                let plotDotOffsetY = (((lineGraphStartingPoint+ (v -(10* Math.floor(v / 10)))))+(this.state.graphBoxSize* Math.floor(v / 10)));
                let plotDotOffsetX = (lineGraphStartingPoint +(this.state.graphBoxSize * (this.props.xAxisDataSet[i])));
                ctx.lineTo(plotDotOffsetX, plotDotOffsetY);
                ctx.moveTo(plotDotOffsetX,plotDotOffsetY);
                ctx.stroke();
            });
        }
        ctx.closePath();
    }

    mousePosition(e)
    {
        var lineGraphStartingPoint = (this.state.canvasMargin + this.state.graphBoxSize);
        var ctx = this.state.canvas.getContext("2d");
        var rect = this.state.canvas.getBoundingClientRect();
        ctx.beginPath();
        this.setState({mouseX : e.clientX - rect.left, mouseY: e.clientY - rect.top}, this.checkCoordMatches(lineGraphStartingPoint));
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
                        this.setState({coords:this.props.xAxisDataSet[i]+","+v, toolTipVisibility:"visible", 
                        toolTipTop: this.state.mouseY + this.state.canvas.height, 
                        toolTipLeft:i < this.props.yAxisDataSet[j].length/2?
                         this.state.mouseX + plotDotOffsetX + this.state.canvas.width
                         :this.state.mouseX + this.state.canvas.width + (Math.floor(this.props.yAxisDataSet[j] /10) *  this.state.graphBoxSize) });
                    }
                });
            }
        });
        ctx.closePath();
    }

    render()
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
import React, {Component} from 'react';
class PieChart extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {canvas:null, chartType:false};
        this.canvasRef = React.createRef();
    }
    
    componentDidMount()
    {
        var c = this.canvasRef.current;
        this.setState({canvas : c});
    }

    componentDidUpdate()
    {
            var myVinyls = {
                "Classical music": 10,
                "Alternative rock": 34,
                "Pop": 2,
                "Jazz": 52
            };
            let context = this.state.canvas.getContext("2d");
            context.clearRect(0,0,this.props.canvasWidth, this.props.canvasHeight);
            this.drawPieChart(context, {data:myVinyls, doughnutHoleSize:0.5});
            //this.drawPieSlice(context, 170, this.state.canvas.height - 55, 50, 0, Math.PI*1, "blue");
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

    drawPieChart(ctx, options)
    {
        var total = 0;
        for(var attr in options.data)
        {
            total += options.data[attr];
        }
        var startAngle =0;
        for(let attr in options.data)
        {
            if(!this.state.chartType)
            {
                var sliceAngle = 2 * Math.PI * options.data[attr] / total;
                var labelX = this.state.canvas.width/2 + ( Math.min(this.state.canvas.width /2 ,this.state.canvas.height /2) / 2) * Math.cos(startAngle + sliceAngle/2);
                var labelY = this.state.canvas.height/2 + ( Math.min(this.state.canvas.width /2 ,this.state.canvas.height /2) / 2) * Math.sin(startAngle + sliceAngle/2);
                this.drawPieSlice(
                    ctx, 
                    this.state.canvas.width /2 ,
                    this.state.canvas.height /2,
                    Math.min(this.state.canvas.width /2 ,this.state.canvas.height /2),
                    startAngle,
                    startAngle + sliceAngle,
                    this.generateRandomColor()
                );
                this.drawText(ctx, `${Math.round(100 * options.data[attr] / total)}%`, labelX, labelY);
                startAngle += sliceAngle;
            }
            else
            {
                this.drawPieSlice(
                    ctx,
                    this.state.canvas.width /2,
                    this.state.canvas.height / 2,
                    options.doughnutHoleSize * Math.min(this.state.canvas.width /2,this.state.canvas.height / 2),
                    0,
                    2 * Math.PI,
                    this.generateRandomColor()
                );
            }
        }
    }

    drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color)
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();
        ctx.closePath();
    }

    drawText(ctx, label, lx, ly)
    {
        ctx.fillStyle = "white";
        ctx.font="20px Courier New";
        ctx.fillText(label, lx, ly);
    }

    render()
    {
        return (<div><canvas id={this.props.canvasId} ref={this.canvasRef} width = {this.props.canvasWidth} height={this.props.canvasHeight}  style={{border:"1px solid"}}/>
        <button onClick={(e) => {
            this.setState({chartType:!this.state.chartType}, () => {
                console.log("clicked");
            });
        }}>Doughnut Chart</button></div>);
    }
};
export default PieChart;
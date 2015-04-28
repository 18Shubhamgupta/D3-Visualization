(function($) {
    $.fn.ChartingD3 = function(data,xFieldName,yFieldName) {
		var selectorElement=$(this);
		var svgElement;
		var width;
		var height;
		var margin={"left":10,"right":35,'top':10,"bottom":35,"scale":50,'areaLeft':60};
		var yAxis;
		var xAxis;
		var yScale;
		var xScale;
		var	parseDate = d3.time.format("%Y-%m-%d");
		var formatDate = d3.time.format("%b %d");
		var minYScale;
		var maxYScale;
		var chartData=data;
		var marginSvg=50;
		
		
		
			
		var appendToolTip=function(){
			if(jQuery("#tooltipChart").length==0){
			var tootTipTemplate="<div id='tooltipChart' >"+
									"<div class='arrow'><i class='fa fa-caret-left'></i></div>"+
								
									//"<div  style='clear:both;width:100%;padding:5px'><label id='x-label' style='width:50%;float:left;'>Time</label><div style='width:50%;float:left;' class='xVal'></div></div>"+
									"<div id='textContainer'>"+
									"<div  class='xVal'></div>"+
									"<label id='y-label' style='float:left;'>Value</label><div class='yVal' style='float:left;'></div></div>"+
									"<div id ='add-info' ></div>"+
									"</div>"+
								"</div>";
			}
			$('body').append(tootTipTemplate);
		
		}
		
		var initSvg=function(){
			
			width=$(selectorElement).width()-marginSvg;	
			height=$(selectorElement).height()-marginSvg;
			
			var selectorId=$(selectorElement).attr("id")
			var svgClassName=selectorId+"_svg";
			
			appendToolTip();
			
			
			svgElement=d3.select("#"+selectorId)
					     .append("svg")
						 .attr("width",$(selectorElement).width())
						 .attr("height",$(selectorElement).height()).attr('class',selectorId+"_svg");
						 
			
			xScale = d3.time.scale().range([margin.left, (width-margin.scale)]);
			yScale= d3.scale.linear().range([(height-margin.scale),0]);
			
			minYScale=d3.min(data, function(d) { return d[yFieldName]; });
			maxYScale=d3.max(data, function(d) { return d[yFieldName]; });
			
			
			
			xScale.domain(d3.extent(data, function(d,i) {
				return parseDate.parse(d[xFieldName]);
			}));
			
			maxYScale=maxYScale*1.2;
			yScale.domain([minYScale,maxYScale*1.2]);
			
			xAxis = d3.svg.axis().scale(xScale)
						.orient("bottom").ticks(4).tickSize(5, 0).tickFormat(formatDate);
						
			yAxis = d3.svg.axis().scale(yScale)
						.orient("right").ticks(4).tickSize(5, 0);	
			
			svgElement=svgElement.append("g")			// Add the X Axis
				   .attr("transform", "translate("+margin.left+"," + margin.top + ")");	
				   
			  	
		};
		
		var attachToolTip={
				showToolTip:function(e,yValArg,xValArg,hideXVal,yHeadingName,isAdditionalInfo,xval,yval){
					
					var x=e.pageX;
					var y=e.pageY-$(selectorElement).find('svg').offset().top-10;
					var yVal;
					yVal=yValArg;
					var timeVal;
					timeVal=xValArg;
					
					if(hideXVal){
						$('#tooltipChart').find('.xVal').html("");
					}else{
						$('#tooltipChart').find('.xVal').html(timeVal);
					}
					if(isAdditionalInfo){
						$('#add-info').html(xval+" "+ yval);
					}
					else{
					$('#add-info').html("");
					}
					$('#tooltipChart').find('.yVal').html(yVal);
					$('#tooltipChart').find('#y-label').html("");
					if(yHeadingName === undefined){
						
					}
					else{
					$('#tooltipChart').find('#y-label').html(yHeadingName);
					}
					
					var marginLeft=x+margin.left;
					if($(".ps-scrollbar-x-rail")){
						try{
						marginLeft+=parseInt($(".ps-scrollbar-x-rail").css('left').replace("px",''));
						}catch(err){
						
						}
					}
					
					var tooTipElem=$('body').find("#tooltipChart");
					var toolTipTextContainer=$(tooTipElem).find("#textContainer");
					
					if(($(window).width()-marginLeft) <  $('body').find("#tooltipChart").width()){
						marginLeft=marginLeft-$(tooTipElem).width();
						
						$(tooTipElem).css('-ms-transform','rotate(-180deg) translate(15px)');
						$(tooTipElem).css('-webkit-transform','rotate(-180deg) translate(15px)');
						$(tooTipElem).css('transform', 'rotate(-180deg) translate(15px)');
						
						
						$(toolTipTextContainer).css('-ms-transform',' translateY(10px) rotate(180deg)');
						$(toolTipTextContainer).css('-webkit-transform','translateY(10px)  rotate(180deg)');
						$(toolTipTextContainer).css('transform', 'translateY(10px) rotate(180deg)');
						
					}
					else{
						
						$(tooTipElem).css('-ms-transform','');
						$(tooTipElem).css('-webkit-transform','');
						$(tooTipElem).css('transform', '');
						
						
						$(toolTipTextContainer).css('-ms-transform','');
						$(toolTipTextContainer).css('-webkit-transform','');
						$(toolTipTextContainer).css('transform', '');
						
					}
					
					var marginTop=e.pageY-($(selectorElement).find("#tooltipChart").height()/2);
					$('body').find("#tooltipChart").css("left",marginLeft);
					$('body').find("#tooltipChart").css("top",marginTop-20);
					$('body').find("#tooltipChart").show();
					console.log("show tooltip"+$(selectorElement).find("#tooltipChart").css('display'));
			},
			hideTooTip:function(){
				$('body').find("#tooltipChart").hide();
			}
		
		};
		
		
		drawPieChart={
			
			drawPieChartWithTransition:function(options,isDonut,enableLegends,legendPosition,colorCode,toolTipData,isAdditionalToolTip,additionalData_x,additionalData_y){
				var	options=$.extend({
								
								'data':[]
							}, options);
				
				var dataset;
				
				if(options.data.length == 0 ){
					dataset=chartData;
				}else{
					dataset=options.data;
				}
				var legendsArray=options.legends;
			//	
				localMargin=.9;			//97.5% of the radius to give 2.5% of the margin
				
				var clicked=[],opened=[];
				for(j=0;j<legendsArray.length;j++)
				{
					
				}
				var outerRadius,tempDiameter;
				var graphHeight=height*.8;
				var graphWidth=width*.8;
				
				if(!enableLegends)
				{
					if(height<width)
						outerRadius=height/2;
					else
						outerRadius=width/2;
				}
				else
				{
					if(legendPosition=="top"||legendPosition=="bottom")
					{
						tempDiameter=.8*height;
						if(tempDiameter>width)
							outerRadius=width/2;
						else
							outerRadius=tempDiameter/2;
					}
					else
					{
						tempDiameter=.8*width;
						if(tempDiameter>height)
							outerRadius=height/2;
						else
							outerRadius=tempDiameter/2;
					}
				}
				outerRadius=outerRadius*localMargin;
				
				var innerRadius = 0;
				var radius = 100;		
				var grad = Math.PI / 180;
				
				var legendsLength=[];
				var k;
				for(k=0;k<legendsArray.length;k++)
				{	
					var s=legendsArray[k];
					clicked.push(false);
					opened.push(false);
					//legendsLength[k]=s.visualLength();
				}
				
				var pie = d3.layout.pie().sort(null).startAngle(0*grad).endAngle(360*grad);
				var arc = d3.svg.arc().outerRadius(outerRadius);
				var arcOver = d3.svg.arc().outerRadius(outerRadius + (outerRadius*.1));		

				// Easy colors accessible via a 10-step ordinal scale
				
				var color;
				if(colorCode==undefined)
				{
					if(isDonut==false)
						color=d3.scale.category20b();
					else
						color=d3.scale.category20();
				}
				
				else
				{
					 color = d3.scale.ordinal()
							   .range(colorCode);
				}
				//color=colorCode;
				
				
				var arcPosition=outerRadius;
				// Set up groups
				appendToolTip();
				var arcs = svgElement.selectAll("g.arc")
					.data(pie(dataset))
					.enter()
					.append("g")
					.attr("class", "slice")
					.attr("stroke","white")
					.attr("stroke-width",0)
					.attr("transform",function(d)
					{
						if(enableLegends)
						{
							if(legendPosition=="bottom")
								return "translate(" + (outerRadius+(width-(outerRadius*2))/2) + "," + (outerRadius+(graphHeight-(outerRadius*2))/2) + ")";
							else if(legendPosition=="top")
								return "translate(" + (outerRadius+(width-(outerRadius*2))/2) + "," + (outerRadius+(height*.2)+(graphHeight-(outerRadius*2))/2) + ")";
							else if(legendPosition=="right")
								return "translate(" + (outerRadius+(graphWidth-(outerRadius*2))/2) + "," + (outerRadius+(height-(outerRadius*2))/2) + ")";
							else(legendPosition=="left")
								return "translate(" + (outerRadius+(width*.2)+(graphWidth-(outerRadius*2))/2) + "," + (outerRadius+(height-(outerRadius*2))/2) + ")";
						}
						else
							return "translate(" + (outerRadius+(width-(outerRadius*2))/2) + "," + (outerRadius+(height-(outerRadius*2))/2) + ")";
					})
					
					.on("mouseover", function (d,i) {
						d3.select(this).style("opacity",0.6);
						if(isAdditionalToolTip){
							attachToolTip.showToolTip(d3.event,d.value,legendsArray[i],false,toolTipData,isAdditionalToolTip,additionalData_x,additionalData_y[i]);	
						}
						else{
							attachToolTip.showToolTip(d3.event,d.value,legendsArray[i],false,toolTipData);
						}
						})
					.on("mousemove",function (d,i) {
					d3.select(this).style("opacity",0.6);
					if(isAdditionalToolTip){
						attachToolTip.showToolTip(d3.event,d.value,legendsArray[i],false,toolTipData,isAdditionalToolTip,additionalData_x,additionalData_y[i]);	
					}
					else{
						attachToolTip.showToolTip(d3.event,d.value,legendsArray[i],false,toolTipData);
					}
					})
					.on("mouseout", function () {
					d3.select(this).style("opacity",1);
					
					attachToolTip.hideTooTip();	
				});

			var prevSlice="";
			var prevIndex="";
				// Draw arc paths
			var arcTran=arcs.append("path")
					.attr("fill", function (d, i) {
					return color(i);
				})
					.attr("d", arc)
					
					
					.on("click", function(d,i) {
						if(clicked[i]==true&&opened[i]==true)
							{
								d3.select(this).transition()            
								.attr("d", arc)
								.attr("stroke-width",0);
							    clicked[i]=false;
							    opened[i]=false;
							}
						else
						{		
								if(prevSlice!="")
								{
									d3.select(prevSlice).transition()            
									.attr("d", arc)
									.attr("stroke-width",0);
									opened[prevIndex]=false;
									
								}
								prevSlice=this;
								prevIndex=i;
								d3.select(this)
							   .attr("stroke","white")
							   .transition()
							   .duration(500)
							   .attr("d", arcOver)             
							   .attr("stroke-width",Math.ceil(.05*outerRadius));
							    clicked[i]=true;
								opened[i]=true;
								
						}
						
				})
				/*.on("mouseleave", function(d) {
					d3.select(this).transition()            
					   .attr("d", arc)
						.attr("stroke-width",0);
				})*/.transition()
					.duration(2000)
					.attrTween("d", sweep);
				if(isDonut==true)
				{
					arcTran
					.transition()
					.ease("elastic")
					.delay(function(d, i) { return 2200 + i* 50; })
					.duration(1000)
					.attrTween("d", tweenDonut);
				}
				
			/*	.transition().duration(1500).attrTween("d", sweep);	
*/				
				function tweenPie(b) {
				
				b.innerRadius = 0;
				var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
				return function(t) { return arc(i(t)); };
				}

				function tweenDonut(b) 
				{
					
					b.innerRadius = outerRadius * .4;
					var i = d3.interpolate({innerRadius: 0}, b);
					return function(t) { return arc(i(t)); };
				}
				
				function sweep(a)
				{
					 var i = d3.interpolate({startAngle: -180 * grad, endAngle: -180 * grad}, a);
					return function (t) {
					return arc(i(t));
							};
						}
				
					if(enableLegends)
					 createLegends(svgElement,width,height,graphWidth,graphHeight,color,legendsArray,legendPosition,legendsLength);
					
			
			}
		}
		
	var drawBar={	
		 myBarChart:function(options){
				var	options=$.extend({
								'color': '#8FB258',
								'data':[],
								'hideYAxis':false,
								'widthOfBar':'',
								'formatDate':"%Y-%m",
								'toolTipData':""
							}, options);
				
				var leftMargin=rightMargin=.02*width;
				var topMargin=bottomMargin=.02*height;
				
				width=width-leftMargin-rightMargin;
				height=height-topMargin-bottomMargin;
				
				yAxisWidth=.1*width;
				xAxisHeight=.1*height;
				
				graphWidth=width-yAxisWidth;
				graphHeight=height-xAxisHeight;
				
				var color=options.color;
					
				var data;
				if(options.data.length == 0 ){
					data=chartData;
				}else{
					data=options.data;
				}
				var widthOfEachBar;
				
				if(options.widthOfBar != ''){	
					widthOfEachBar=options.widthOfBar;
				}
				var	parseDate=d3.time.format(options.formatDate).parse;
				
				var format=d3.time.format("%b-%Y");
				var x = d3.scale.ordinal().rangeRoundBands([0, graphWidth], .2);

				var y = d3.scale.linear().range([graphHeight, 0]);

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(5)
					.tickFormat(d3.time.format("%b"));

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.ticks(4).
					tickSize(5, 0).
					tickFormat(d3.format(".2s"));

				jQuery(data).each(function(i,obj){
				obj.date=parseDate(obj.date);
				obj.value=+obj.value;
				});
				
					
				  x.domain(data.map(function(d) { return d.date; }));
				  y.domain([0, d3.max(data, function(d) { return d.value; })]);
					
				
				  svgElement.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate("+(leftMargin+yAxisWidth)+"," + (topMargin+graphHeight) + ")")
					  .call(xAxis)
					.selectAll("text")
					  .style("text-anchor", "middle")
					  //.attr("dx", "-.8em")
					  //.attr("dy", "-.55em")
					  //.attr("transform", "rotate(-90)" );
				if(!options.hideYAxis){
				  svgElement.append("g")
					  .attr("class", "y axis")
					  .attr("transform", "translate("+(leftMargin+yAxisWidth)+","+topMargin+")" )
					  .call(yAxis)
					.append("text")
					  .attr("transform", "rotate(-90)")
					  .attr("y", (-(yAxisWidth/1.3)))			//x and y are reversed due to rotation
					  .attr("x", (-(graphHeight/3)))
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .text("Value ($)");
					 } 
					appendToolTip();
				
					svgElement.append("g")
					.attr("transform","translate("+(leftMargin+yAxisWidth)+","+(topMargin)+")")
				    .selectAll("bar")
					.data(data)
					.enter().append("rect")
					.style("fill", color)
					.attr("x", yAxisWidth)
					.attr("width", x.rangeBand())
					.attr("stroke","white")
					.attr("stroke-width","0")
					.attr("y", function(d) { return y(d.value); })
					.attr("height", "0")
		
					  .on("mouseover",function(d,i){
							d3.select(this).style("opacity",0.6)
							.attr("stroke-width","3");
							attachToolTip.showToolTip(d3.event,d.value,format(d.date),false,options.toolTipData);	
					  })
					  .on("mousemove",function(d,i){
							d3.select(this).style("opacity",0.6)
							.attr("stroke-width","3");
							
							svgElement.append("line")
							.attr("class","tipline")
							.attr("x1",  (x(d.date)+leftMargin+yAxisWidth))
							.attr("y1",  (y(d.value)+topMargin))
							.attr("x2", (x(d.date)+leftMargin+yAxisWidth))
							.attr("y2",	(y(d.value)+topMargin))
							.style("stroke-dasharray", ("3, 3"))
							.attr("stroke-width", 1)
                            .attr("stroke", "#D80000")
							
							.transition()
							.duration(750)
							.attr("x2", (leftMargin+yAxisWidth ))
							.attr("y2", (y(d.value)+topMargin) );
							 
							attachToolTip.showToolTip(d3.event,d.value,format(d.date),false,options.toolTipData);	
					  })
					  .on("mouseout",function(d,i){
							d3.select(this).style("opacity",1)
							.attr("stroke-width","0");
							
							svgElement.selectAll("line.tipline").remove()
							attachToolTip.hideTooTip();
					  })
					  .transition().duration(1000)
					  .delay(function(d,i){
								return i*150;
								})
					  .attr("x", function(d) { return x(d.date); })		
					  .attr("height", function(d) { return ((graphHeight) - y(d.value)); })
					  .ease("linear");
					  
				 
			}
		}	
	
	
	function createLegends(svgElement,width,height,graphWidth,graphHeight,color,legendsArray,legendPosition,legendsLength)
				{
				var xpos=0,ypos=0;
				var	xgap,ygap;
				var recWidth;
				var fontSize;
				var wordGap;
				if(height<width)
				{
					xgap=.04*height;
					ygap=.01*height;
					recWidth=.05*height;
					fontSize=Math.ceil(height*.04);
				}	
				else
				{	
					xgap=.04*width;
					ygap=.01*width;
					recWidth=.05*width
					fontSize=Math.ceil(width*.04);
				}	
				wordGap=fontSize*8;
				//alert(wordGap);
				var legendContainer=svgElement.append("g")
					.attr("class","legendContainer")
					.attr("transform",function()
					{	if(legendPosition=="bottom")
							return "translate(0,"+(graphHeight)+")"
						else if(legendPosition=="right")	
							return "translate("+(graphWidth)+",0)"
						else  if (legendPosition=="top")
							return "translate(0,"+(.2*(height-graphHeight))+")"
						else	
							return "translate("+(.2*(width-graphWidth))+",0)"
					});
				var incLength;	
				var legend = legendContainer.append("g")
					.attr("class", "legend")
				/*	.attr("width", width)
					.attr("height", height)*/
					.selectAll("g")
					.data(color.domain().slice())
					.enter().append("g")
					.attr("transform", function(d, i) { 
					
					if(legendPosition=="bottom"||legendPosition=="top")
					{
							if(i==0)
							return "translate("+ (xpos) + "," + (ypos) + ")"; 
							else
							{	
								if((legendsLength[i-1])>wordGap)
								{
									incLength=wordGap;
								}
								else
								{
									incLength=legendsLength[i-1];
								}
									xpos+=incLength+xgap+recWidth;
									
									if(xpos+incLength>width)
									{
										xpos=0;
										ypos+=recWidth+ygap;
									}	
									return "translate("+ (xpos) + "," + (ypos) + ")";
								
							}
					}		
					else (legendPosition=="left"||legendPosition=="right")
					{
						ypos+=ygap+recWidth;	
						return "translate("+ (xpos) + "," + (ypos) + ")";
					}
					
					});
					
				//appendToolTip();
				legend.append("rect")
					.attr("width", recWidth)
					.attr("height", recWidth)
					.style("fill", color)
					;

				legend.append("text")
					.attr("x", (recWidth+ygap))
					.attr("y",(recWidth*.5) )
					.attr("dy", ".2em")
					.attr("font-family", "sans-serif")
					.attr("font-size", (fontSize+"px"))
					.text(function(d, i) { 
						if(legendsArray[i].length>9)
							return legendsArray[i].substring(0,10)+"..";//"Item: " + (i + 1); 
						else
							return legendsArray[i];
					})
					.on("mouseover", function (d,i) {
						d3.select(this).style("opacity",0.6);
						attachToolTip.showToolTip(d3.event,"","",true,legendsArray[i]);	
				})
					.on("mouseout", function () {
					d3.select(this).style("opacity",1);
					
					attachToolTip.hideTooTip();	
				});
				}
				
				
				
		if(arguments.length == 0){
			width=$(selectorElement).width();	
			height=$(selectorElement).height();
			
			var selectorId=$(selectorElement).attr("id")
			var svgClassName=selectorId+"_svg";
			svgElement=d3.select("#"+selectorId)
					     .append("svg")
						 .attr("width",$(selectorElement).width())
						 .attr("height",$(selectorElement).height());
			
			if(!d3.select("#tooltipChart")){
				appendToolTip();
			}	
			
		}else{
			initSvg();
		}
		
		
		return {
           
			showToolTip:attachToolTip.showToolTip,
			myBarChart:drawBar.myBarChart,
			drawPieChartWithTransition:drawPieChart.drawPieChartWithTransition
			};
    };
})(jQuery);

String.prototype.visualLength = function()
		{
			var ruler = document.getElementById("ruler");
			ruler.innerHTML = this;
			return ruler.offsetWidth;
		}

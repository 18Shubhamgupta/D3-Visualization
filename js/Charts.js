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
		
		var lineChart = {
			drawMyMultipleLineChart:function(options,isAdditionalToolTip,toolTipData,enableLegends,legendPosition,xAxisPos,yAxisPos,enableBrush,colorCode){
					var	options=$.extend({
										'data':[],
										'xFieldName':'',
										'yFieldList':[],
										'xAxisIndicationLabel':'',
										'yAxisIndicationLabel':''
									}, options);
								
					var rawData=options.data;
					var xFieldName=options.xFieldName;
					
					var graphWidth,graphHeight;
					var withAxisWidth=width,
						withAxisHeight=height;
					if(legendPosition=="left"||legendPosition=="right")
					{
						withAxisWidth=.8*width;
					}
					else if (legendPosition=="top"||legendPosition=="bottom")
					{
						withAxisHeight=.8*height;
					}
					/*marginWidth=.2*width;
					marginHeight=.2*height;
					width=width-marginWidth;
					height=height-marginHeight;
					*/	
					var localMargin=.05;
					graphWidth=.90*withAxisWidth;
					graphHeight=.80*withAxisHeight;
					
					graphWidth=.95*graphWidth;
					graphHeight=.95*graphHeight;
					var legendsArray=options.yFieldList;	
					
					var legendsLength=[];
					var k;
					for(k=0;k<legendsArray.length;k++)
					{	
						var s=legendsArray[k];
						legendsLength[k]=s.visualLength();
					}
					var color;
					if(colorCode==undefined)
					{
						color = d3.scale.category10();
					}
					else
					{
						 color = d3.scale.ordinal()
								   .range(colorCode);
					}
					
					var parseDate = d3.time.format("%Y%m%d").parse;
					var format=d3.time.format("%Y-%m-%d");

					var x = d3.time.scale().range([0, graphWidth]),
						x2=d3.time.scale().range([0, graphWidth]),
					y = d3.scale.linear().range([graphHeight, 0]);

					//var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%b"));
					var brush;
					if(enableBrush)
					{
						brush = d3.svg.brush().x(x2).on("brush", brush);
					}
					var xOrientation,yOrientation;
					if(xAxisPos=="top")
						xOrientation="top";
					else
						xOrientation="bottom";
						
					if(yAxisPos=="left")
						yOrientation="left";
					else
						yOrientation="right";	
						
					var xAxis = d3.svg.axis()
					.scale(x)
					.orient(xOrientation);//.tickFormat(d3.time.format("%y-%b-%d"));
					var  yAxis = d3.svg.axis().scale(y).orient(yOrientation)
								.ticks(4).tickSize(5, 0).tickFormat(d3.format(".2s"));
					

					var line = d3.svg.line()
					.x(function (d) {
					return x(d.date);
					})
					.y(function (d) {
					return y(d.value);
					});
						
					/*var svg = d3.select("body").append("svg").attr("class","multiline").attr("width",
					width + margin.left + margin.right).attr("height",
					height + margin.top + margin.bottom);*/
					//svgElement=svgElement.attr("class","multiline");
					
					
						svgElement.append("defs").append("clipPath").attr("id", "clip").append("rect")
						.attr("width", graphWidth).attr("height", graphHeight);
					
					var div = d3.select('body').append("div").attr("class", "tooltip")
					.style("opacity", 0);
					
					//var focus;
					var focus = svgElement.append("g").attr("width",graphWidth);
					var widthTotalTranslate=0,heightTotalTranslate=0;
					if(legendPosition=="left")
						{
							widthTotalTranslate+=width*.2;
							//focus=focus1.attr("transform","translate(" + (width*.2) + "," + (0) + ")");
						}
					
					else if(legendPosition=="top")
						{
							heightTotalTranslate+=height*.2;
							//focus=focus1.attr("transform","translate(" + (0) + "," + (height*.2) + ")");
						}	
					else
						{
							heightTotalTranslate+=.05*height;
							//focus=focus1.attr("transform","translate(" + (0) + "," + (0) + ")");
						}
					
					
					if(xAxisPos=="top")
						{
							heightTotalTranslate+=(withAxisHeight*.2);
						}
					if(yAxisPos=="left")
						{
							widthTotalTranslate+=(withAxisWidth*.1);
						}
						else
						{
							widthTotalTranslate+=(withAxisWidth*.02);
						}
						
						focus.attr("transform","translate(" + (widthTotalTranslate) + "," + (heightTotalTranslate) + ")");
						
						if(enableBrush)
						{
							focus.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", graphHeight + 7);
						}	  
						focus.append("g").attr("class", "x axis").attr("transform",function(d){
								if(xAxisPos=="top")
								{
									return "translate(0,0)";
								}
								else 
								{
									return "translate(0,"+(graphHeight)+")";
								}
							
							})
						
						.call(xAxis);
					
					focus.append("g").attr("class", "y axis").call(yAxis).attr("transform",function(d){
								if(yAxisPos=="left")
								{
									return "translate(0,0)";
								}
								else 
								{
									return "translate("+(graphWidth)+",0)";
								}
							
							});
							
							
					var textPosx,textPosy;
					if(yAxisPos=="right")
						{
							textPosx=widthTotalTranslate+graphWidth+(.085*withAxisWidth);
						}
					else
						{
							textPosx=widthTotalTranslate*.01;
						}
					
						
						textPosy=heightTotalTranslate+(.3*graphHeight);
						
				
					svgElement.append("g")
						.attr("class", "y axis")
						.append("text")
						.attr("transform", "translate("+textPosx+","+textPosy+") rotate(-90) ")
						
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text(options.yAxisIndicationLabel);
						
					
					updateDataOnMultiChart(rawData);	
					
						function updateDataOnMultiChart(date) {
							date.forEach(function (d) {
								d.date = parseDate(d.date);
							});
							color.domain(d3.keys(date[0]).filter(function (key) {
								return key !== "date";
							}));
							var topics = color.domain().map(function (name) {
								return {
									name: name,
									values: date.map(function (d) {
										return {
											date: d.date,
											value: +d[name]
										};
									})
								};
							});

							console.log(topics);

							x.domain(d3.extent(date, function (d) {
								return d.date;
							}));
							/*
							var minValue=d3.min(topics, function (c) {
								return d3.min(c.values, function (v) {
									return v.value;
								});
							});
							
							var maxValue=d3.max(topics, function (c) {
								return d3.max(c.values, function (v) {
									return v.value;
								});
							});
							y.domain([minValue-(.3*minValue) ,
							maxValue+(.2*maxValue)]);
							*/
							y.domain([d3.min(topics, function (c) {
								return d3.min(c.values, function (v) {
									return v.value;
								});
							}) - .01,
							d3.max(topics, function (c) {
								return d3.max(c.values, function (v) {
									return v.value;
								});
							})]);
							x2.domain(x.domain());
							// update axes
							d3.transition(svgElement).select('.y.axis')
								.call(yAxis);

							d3.transition(svgElement).select('.x.axis')
								.call(xAxis);
							var topic = focus.selectAll(".topic").data(topics);
							
							var topicEnter = topic.enter().append("g").attr("class", "topic");
							topicEnter.append("path").attr("class", line)
								.attr("clip-path", "url(#clip)")
								.attr("d", function (d) {
								return line(d.values);
							})
								.style("stroke", function (d) {
								return color(d.name);
							}).on("mouseover",function (d) {d3.select(this).style("stroke","yellow")})
							.on("mouseout",function (d) {d3.select(this).style("stroke",function (d) {
								return color(d.name);
							})});					
							 
							 
							  

							topicEnter.append("g").selectAll(".dot")
								.data(function (d) {
								return d.values
							}).enter().append("circle").attr("clip-path", "url(#clip)")
								.attr("stroke", function (d) {
								return color(this.parentNode.__data__.name)
							})
								.attr("cx", function (d) {
								return x(d.date);
							})
								.attr("cy", function (d) {
								return y(d.value);
							})
								.attr("r", 1)
								.attr("fill", "white").attr("fill-opacity", .5)
								.attr("stroke-width", 2)
								.on("mouseover", function (d,i) {
									
									div.transition().duration(100).style("opacity", .9)
									.style("display","inline");
									d3.select(this).attr('r', 8)
									if(isAdditionalToolTip==false)
										{
											div.html(this.parentNode.__data__.name + ":  " + d.value+"<br/>"+format(d.date)).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px").attr('r', 5);
										}
									else if(isAdditionalToolTip==true)
										{
										var xpos=d3.event.pageX;
										if(d3.event.pageX>(jQuery(window).width()*.85))
										xpos=d3.event.pageX-jQuery(".tooltip").width();
										div.html(this.parentNode.__data__.name + ":  " + d.value+"<br/>"+format(d.date)+"<br/>"+toolTipData[i]).style("left", (xpos) + "px").style("top", (d3.event.pageY - 28) + "px").attr('r', 10);
										}
								
							}).on("mouseout", function (d) {
								div.transition().style("opacity", 0)
								.style("display","none")
								d3.select(this).attr('r', 1);
							});

							// transition by selecting 'topic'...
							topicUpdate = d3.transition(topic);
						   

							// ... and each path within
							topicUpdate.select('path')
								.transition().duration(600)
								.attr("d", function (d) {
								return line(d.values);
							});

							if(enableLegends)
						 createLegends(svgElement,width,height,withAxisWidth,withAxisHeight,color,legendsArray,legendPosition,legendsLength);
						 
						var fontSize=Math.ceil(graphHeight*.05);
						jQuery("#"+selectorId+" .axis text").css("font-size",fontSize+"px");
				}	
				
							function brush() {
						x.domain(brush.empty() ? x2.domain() : brush.extent());
						focus.selectAll("path").attr("class","multilinepath").attr("d", function (d) {
							return d ? line(d.values) : ''
						})
						
						focus.select(".x.axis").call(xAxis);
						focus.select(".y.axis").call(yAxis);
						focus.selectAll("circle").attr("cx", function (dd) {
							return x(dd.date);
						}).attr("cy", function (dd) {
							return y(dd.value);
						});
					}
			}
	}	
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
		
		
	pyramidChart={
			drawPyramidChart:function(percent,textLabelsJson,isInvertPyramid,colorCode,enableLegends,legendPosition){
				//Increase the value for increasing width
				var widthFactor = -20;

				//Moving to left 
				//Note: It will decrease the width also
				var movingLeftFactor = 200;
				
				var legendsLength=[];
				var legendsArray=[];
				var k;
				for(k=0;k<textLabelsJson.length;k++)
				{	
					var s=textLabelsJson[k].accountName;
					legendsArray[k]=s;
					legendsLength[k]=s.visualLength();
				}
				
				width=width-margin.scale;
				height=height-margin.scale;
				//height+=100;
				
				scaleX = d3.scale.linear()
				.domain([widthFactor, movingLeftFactor])
				.range([0, width]),

			scaleY = d3.scale.linear()
				.domain([-50, 80])
				.range([height, 0]);
		
				if(colorCode==undefined)
				{
					color = d3.scale.category10();
				}
				else
				{
					 color = d3.scale.ordinal()
							   .range(colorCode);
				}
		
			var value =  getCoordinatesFromPercent(sortNumber(percent)).arrayOfPolygons;
			var size=percent.length;
			var clicked=[];
			for(j=0;j<size;j++)
			clicked.push(false);
			var groping=svgElement.append("g");
						
			groping.selectAll("polygon").data(value)
				.enter().append("polygon")
				.attr("points", function (d) {
								return d.points.map(function (d) {
									return [scaleX(d.x), scaleY(d.y)].join(",");
									}).join(" ");
					})
				.attr("fill", function (d) {
				return color(d.name)
			}).attr("stroke-width", 0)
			.data(value)
			 .on("mouseover", function (d,i) {
			 console.log("hello");
			 d3.select(this).style("opacity",0.5);
				d3.select("#pyramidTooltip")
					.style("left", d3.event.pageX + "px")
					.style("top", d3.event.pageY + "px")
					.style("opacity", 1)
					.select("#value")
					.text(textLabelsJson[i].accountName + ' : '+textLabelsJson[i].amount);
			})
			.on("mousemove", function (d,i) {
			 console.log("hello");
			 d3.select(this).style("opacity",0.5);
				d3.select("#pyramidTooltip")
					.style("left", d3.event.pageX + "px")
					.style("top", d3.event.pageY + "px")
					.style("opacity", 1)
					.select("#value")
					.text(textLabelsJson[i].accountName + ' : '+textLabelsJson[i].amount);
			})
			.on("click", function (d,i) {
			console.log(clicked[i]);
				if(clicked[i]==false)
				{
				d3.select(this).transition().attr("transform","translate(40,0)").ease("bounce").duration(1000);
				clicked[i]=true;
				}
				else if(clicked[i]==true)
				{
					d3.select(this).transition().attr("transform","translate(0,0)").ease("bounce").duration(1000);
					clicked[i]=false;
				}
				
			 })
			 
			.on("mouseout", function () {
				// Hide the tooltip
				
				d3.select(this).style("opacity",1);
				d3.select("#pyramidTooltip")
					.style("opacity", 0);  
					});
					
				if(isInvertPyramid){
				groping.transition().duration(2000)
					  .attr('transform',"translate(" + (width) + "," + (height) + ") rotate(180) ");
			
				}
				else{
				groping.transition().duration(2000).ease("bounce")
					  .attr('transform',"translate(" + (50) + "," + (margin.scale) + ")")	;
				}
				
				if(enableLegends)
					 createLegends(svgElement,width,height,width*.8,height*.8,color,legendsArray,legendPosition,legendsLength);
					 
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
					  
				 
			},
			stackedBarChart:function(options,colorCode){
				var	options=$.extend({
								'data':[],
								'xFieldName':'',
								'widthOfBar':'',
								'axisColor':'black',
								'hideAxis':false,
								'showAllTicks':false,
								'redrawing':true,
								'columnHeadingArray':[],
								'xAxisIndicationLabel':'',
								'yAxisIndicationLabel':''
							}, options);
				
				
				appendToolTip();
				marginWidth=(.2*width);
				marginHeight=(.2*height);
				width=width-marginWidth;
				height=height-marginHeight;
				
				
				var stackedChartData=options.data;
				xFieldName=options.xFieldName;
				
				var widthOfEachBar;
				var stack = d3.layout.stack();
				
				var dataset  = [];
				var color;
				if(colorCode==undefined)
				{					
					color=d3.scale.category20b();
				}
				else
				{
					 color = d3.scale.ordinal()
							   .range(colorCode);
				}
				
				if(options.widthOfBar == '' ){
					widthOfEachBar=Math.floor((width)/data.length);
				}else{
					widthOfEachBar=options.widthOfBar;
				}
				
				var keysArray=d3.keys(stackedChartData[0]).filter(function(key){
					return (key!=options.xFieldName);
				});
				
				color.domain(keysArray);
				
				var formattedStackedData=stackedChartData;
				//alert("s "+formattedStackedData.length);
				formattedStackedData.forEach(function(d,i){
					var y0=0;
					var countr=0;
					d.groupedData=keysArray.map(function(keyName){
									
									return {x:d[xFieldName],y0:y0,y1:y0+=+d[keyName],name:keyName,'exactYVal':d[keyName]};
								 });
					
					d.total=d.groupedData[d.groupedData.length-1].y1;	
				});
				
				for(var j=0;j<formattedStackedData.length;j++){
					var groupObj=formattedStackedData[j].groupedData;
					/*for(var k=0;k<groupObj.length;k++){
						console.log("k  "+groupObj[k].name +"  n"+groupObj[k].exactYVal);
					}*/
				
				}
				
				maxYScale=d3.max(formattedStackedData, function(d) {
							return d.total;
						});
				minYScale=d3.min(formattedStackedData, function(d) {
							return d.total;
						});
				
				
				maxYScale=maxYScale*1.5;
				//maxYScale=maxYScale*1.1;	
				yScale = d3.scale.linear()
					.domain([0,maxYScale				
						
					])
					.range([height,0]);
				
				svgElement=svgElement.append("g")			// Add the X Axis
				   .attr("transform", "translate("+(marginWidth/4)+"," +(marginHeight/4)+ ")");	
				   
				xScale=d3.scale.ordinal()
						.rangeRoundBands([0, width], .1);	
				xScale.domain(formattedStackedData.map(function(d){
						return d[xFieldName];
				}));
				
				xAxis = d3.svg.axis().scale(xScale).orient("bottom");
				
							
				yAxis = d3.svg.axis().scale(yScale)
							.orient("right").ticks(4).tickSize(5, 0).tickFormat(d3.format(".2s"));
				
				var xAxisElem=svgElement.append("g")			// Add the X Axis
					.attr("class", "x axis")
					.attr("transform", "translate("+0+"," + (height) + ")")
					.attr("stroke",options.axisColor)
					.attr("fill",'none')
					.call(xAxis);
					
					xAxisElem.selectAll("text")
					.attr("transform", "translate('"+10+"',15) rotate(15)");
					
				var yAxisElem=svgElement.append('g')
						  .attr('class','y axis')
						  .attr("transform", "translate("+(width)+"," + 0+ ")")		
					      .attr("stroke",options.axisColor)
						  .attr("fill",'none')
					      .call(yAxis);
						  
						  yAxisElem.selectAll(".tick")
							.each(function(data){
								svgElement
									  .append("line")
									  .attr('class','horizontalGridLine')
									  .attr('x1',0)
									  .attr('x2',(width))	
									  .attr('y1',function(){
											
											return yScale(data);
									  })
									  .attr('y2',function(){
											return yScale(data);
									  }).attr('stroke','#F2F3F3');		
							})
							.style("display",function(){
								if(options.hideAxis){
									return "none";
								}else{
									return "block";
								}
							});
				
				if(options.xAxisIndicationLabel!=""){
						
						var lengthOfLine=40;
						var indicationLineXPos0=width/2-lengthOfLine;
						var indicationLineXPos1=width/2+lengthOfLine;
						
						var indicationLineAndTextGap=20;
						var yLablePos=margin.scale-(indicationLineAndTextGap/3);
						var yLinePos=height+margin.scale-indicationLineAndTextGap;
						
						var textPosition=height+margin.scale+indicationLineAndTextGap;
						
						svgElement.append("path")
						.attr('class',"axis-arrow-trianle")
						.attr("d",d3.svg.symbol().type("triangle-up").size(10))
						.attr("fill","red")
						.style('display','block')
						.attr("transform", function(d) { return "translate(" + indicationLineXPos1 + "," + yLinePos + ") rotate(90)"; });
						
						
						svgElement.append("line")
						.attr("class",'x-axis-indication-line')
						.attr('x1',indicationLineXPos0)
						.attr('y1',(yLinePos))
						.attr('x2',indicationLineXPos1)
						.attr('y2',(yLinePos))
						.attr("stroke",'red');
						
						var textXPosition=(indicationLineXPos0+indicationLineXPos1);
						
						svgElement.append("text")
						.attr('class','x-axis-indication')
						.attr('text-anchor','middle')
						.attr('x',(indicationLineXPos0-40))
						.attr('y',(yLinePos+2))
						.text(options.xAxisIndicationLabel);
						
						
					}
					
					if(options.yAxisIndicationLabel!=""){
						
						var lengthOfIndicatorLine=40;
						var yIndicatorLinePos0=((height)/2-20);
						var yIndicatorLinePos1=yIndicatorLinePos0+lengthOfIndicatorLine;
						
						var xPosition0=width+margin.scale-margin.left+10;
						
						svgElement.append("line")
						.attr("class",'y-axis-indication-line')
						.attr('x1',xPosition0)
						.attr('y1',(yIndicatorLinePos0))
						.attr('x2',xPosition0)
						.attr('y2',(yIndicatorLinePos1))
						.attr("stroke",'red');
						
						
						svgElement.append("path")
						.attr('class',"axis-arrow-trianle")
						.attr("d",d3.svg.symbol().type("triangle-up").size(10))
						.attr("fill","red")
						.style('display','block')
						.attr("transform", function(d) { return "translate(" + xPosition0 + "," + yIndicatorLinePos0 + ")"; });
						
						
						svgElement.
						append("g")
						.attr("transform", "translate(" + (width+marginSvg-margin.left+5) + "," + (yIndicatorLinePos1+30) + ")" )
						.append("text")
						.attr("class",'y-axis-indication')
						.attr('text-anchor','middle')
						.attr("transform", "rotate(90)")
						.text(options.yAxisIndicationLabel)
							
					}
				//alert("dataset "+dataset.length);	
				/* Add a group for each row of data */
				var groups = svgElement.selectAll("g.stack-grouping")
					.data(formattedStackedData)
					.enter()
					.append("g")
					.attr("class",'stack-grouping')
					
				
				
				groups.selectAll("rect")
				.data(function(d) { return d.groupedData; })
				.enter()
				.append("rect")
				.attr("x", function(d, i){
					return (xScale((d["x"]))); 
				})
				.attr("y", function(d){
					return yScale(d.y1); 
				})
				.attr('class',function(d){
					return d['name'] +" "+"bar";
				})
				.attr("width",xScale.rangeBand())
				.attr("height", function(d){
					//alert(d["y0"] + " y1 "+d["y1"]  +"y0 "+yScale(d["y0"]) +" yscale e "+yScale(d.y1) );
					return (yScale(d["y0"]) - yScale(d.y1));
				})
				.style("fill",function(d,i){
					return color(d.name);
				})
				.on("mouseover", function(d) {
						d3.select(this)
						.style('opacity',0.4);
						
						attachToolTip.showToolTip(d3.event,d.exactYVal,d["x"],false,options.columnHeadingArray[d.name]);
						
					})
					.on("mousemove",function (d,i) {
					d3.select(this)
						.style('opacity',0.4);
						attachToolTip.showToolTip(d3.event,d.exactYVal,d["x"],false,options.columnHeadingArray[d.name]);
					//attachToolTip.showToolTip(d3.event,d.value,legendsArray[i],false,'value: ');	
				})
					.on("mouseleave",function(d,i){
						var targetElement=d3.select(this);
						  d3.select(this)	
						  .style('opacity',1);	
						  attachToolTip.hideTooTip();
				   });	
				
				
				var stackChartLegend=svgElement.selectAll(".legend")
				.data(color.domain().slice().reverse())
				.enter()
				.append("g")
				 .attr("transform", function(d, i) { return "translate(0," +(10+ i * 20) + ")"; });
				
				var rectWidth=18;
				var textGap=10;
				var xRectLegend=0;
				var xTextLegend=xRectLegend+rectWidth+textGap;	
				var hideLegendList={}; 
				stackChartLegend.append("rect")
				  .attr("x",xRectLegend)
				  .attr("width", 18)
				  .attr("height", 18)
				  .style("fill", color)
				  .on('click',function(d){
					var isHideElement=false;
					if($("rect"+"."+d).length>1){
						isHideElement=true;
						hideLegendList[d]=d;
						//$("rect"+"."+d).removeClass('visible');
						
						d3.select(this).style("fill","grey");
						d3.select(".legend-text."+d).style("fill","grey");
							
						
					}else{
						isHideElement=false;
						delete hideLegendList[d];
						//$("rect"+"."+d).css('visibility','visible');
						//$("rect"+"."+d).addClass('visible');
						
						d3.select(this).style("fill",color);
						d3.select(".legend-text."+d).style("fill","black");
					}
					
					$(selectorElement).find("rect.bar").remove();
					$(selectorElement).find("g.stack-grouping").remove();
					
					//alert("hide element "+isHideElement +" which elem "+d);
					//redraw scale
					redrawStackChart(d,hideLegendList);
					});
				  
				stackChartLegend.append("text")
				  .attr("x",xTextLegend)
				  .attr("y", 9)
				  .attr("dy", ".35em")
				  .style("text-anchor", "start")
				  .attr("class",function(d){
					return "legend-text "+" "+d;
				  })
				  .text(function(d) { return d; });  
				
				function redrawStackChart(fieldName,hideLegendList){
					
					//alert(color("settledAmount") +"settl  "+" unsettled "+color("unsettledAmount"));
					
					keysArray=d3.keys(stackedChartData[0]).filter(function(key){
						var filteredResult;
						//if(isHideElement){
							filteredResult=(key!=options.xFieldName && hideLegendList[key]== undefined && key!="groupedData"  && key!="total")
						
						return filteredResult;
					});
				
					
					var formattedStackedData1=stackedChartData;
					
					formattedStackedData1.forEach(function(d,i){
						var y0=0;
						d.groupedData=keysArray.map(function(keyName){
										return {x:d[xFieldName],y0:y0,y1:y0+=+d[keyName],name:keyName,'exactYVal':d[keyName]};
									 });
						
						d.total=d.groupedData[d.groupedData.length-1].y1;
							
					});
					
					
					maxYScale=d3.max(formattedStackedData1, function(d) {
								return d.total;
							});
					minYScale=d3.min(formattedStackedData1, function(d) {
								return d.total;
							});
					
					//alert(maxYScale);
					maxYScale=maxYScale*1.5;
					
					
					//maxYScale=maxYScale*1.1;
						
					var yScale1 = d3.scale.linear()
						.domain([0,maxYScale				
							
						]).range([height,0]);
					
					yAxis = d3.svg.axis().scale(yScale1)
							.orient("right").ticks(4).tickSize(5, 0).tickFormat(d3.format(".2s"));
							
					svgElement.select('.y.axis')
						  .call(yAxis)
						  .selectAll(".tick")
							.each(function(data){
								svgElement.selectAll(".horizontalGridLine")
									  .attr('x1',0)
									  .attr('x2',(width))	
									  .attr('y1',function(){
											return yScale1(data);
									  })
									  .attr('y2',function(){
											return yScale1(data);
									  }).attr('stroke','#F2F3F3');		
							})
							.style("display",function(){
								if(options.hideAxis){
									return "none";
								}else{
									return "block";
								}
							});
				
				var groups = svgElement.selectAll("g.stack-grouping")
				.data(formattedStackedData1)
				.enter()
				.append("g")
				.attr("class",'stack-grouping')
					
				
				
				var rects=groups.selectAll("rect")
				.data(function(d) { return d.groupedData; })
				.enter()
				.append("rect")
				.attr("x", function(d, i){
					return (xScale((d["x"]))); 
				})
				.attr("y", function(d){
					return yScale1(d.y1); 
				})
				.attr('class',function(d){
					return d['name'] +" "+"bar";
				})
				.attr("width",xScale.rangeBand())
				.attr("height", function(d){
					
					return 0;
				})
				.style("fill",function(d,i){
					return color(d.name);
				})
				.on("mouseover", function(d) {
						d3.select(this)
						.attr('fill','yellow');
						
						attachToolTip.showToolTip(d3.event,d.exactYVal,d["x"],false,options.columnHeadingArray[d.name]);
						
					})
					.on("mousemove",function (d,i) {
					d3.select(this)
						.style('opacity',0.4);
						attachToolTip.showToolTip(d3.event,d.exactYVal,d["x"],false,options.columnHeadingArray[d.name]);
					
				})
					.on("mouseleave",function(d,i){
						var targetElement=d3.select(this);
						  d3.select(this)	
						  .attr('fill',$(targetElement).parents('g').attr('fill'));	
						  attachToolTip.hideTooTip();
				   });	
				
					rects.transition()
								.duration(2000)
								.attr('height',function(d,i){
									return (yScale1(d.y0) - yScale1(d.y1));
								}).attr("fill",function(d){
									
									return color(d.name);
								});	
				
				}	
			},
			myHorizontalBarChart:function(options){
				var	options=$.extend({
								'color': '#8FB258',
								'data':[],
								'hideYAxis':false,
								'widthOfBar':'',

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
				
				var x = d3.scale.linear().range([0, graphWidth]);

				var y = d3.scale.ordinal().rangeBands([0, graphHeight],.4);

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(5)
					//.tickFormat(d3.time.format("%b"));

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");
				var yAxisLeg=[];									
				x.domain([0, d3.max(data, function(d) { return d.xName; })]);
				y.domain(data.map(function(d) { 
					if (d.yName.length > 14){
						yAxisLeg.push(d.yName.substring(0, 14) + '..');
						return (d.yName.substring(0, 14) + '..');
					} 
				 
				else {
					yAxisLeg.push(d.yName);
					return d.yName;  
					}
					}));
					
					svgElement.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate("+(leftMargin+yAxisWidth)+"," + (topMargin+graphHeight) + ")")
					  .call(xAxis)
					.selectAll("text")
					  .style("text-anchor", "middle")
					  
				if(!options.hideYAxis){
				  svgElement.append("g")
					  .attr("class", "y axis")
					  .attr("transform", "translate("+(leftMargin+yAxisWidth)+","+topMargin+")" )
					  .call(yAxis)
					
					 } 
					appendToolTip();
				
					svgElement.append("g")
					.attr("transform","translate("+(leftMargin+yAxisWidth)+","+(topMargin)+")")
				    .selectAll("rect")
					.data(data)
					.enter().append("rect")
					.style("fill", color)
					.attr("x", "0")
					.attr("width","0")
					.attr("stroke","white")
					.attr("stroke-width","0")
					.attr("y", function(d,i) { return y(yAxisLeg[i]); })
					.attr("height", y.rangeBand())
		
					  .on("mouseover",function(d,i){
							d3.select(this).style("opacity",0.6)
							.attr("stroke-width","3");
							attachToolTip.showToolTip(d3.event,d.xName,d.yName,false,options.toolTipData);	
					  })
					  .on("mousemove",function(d,i){
							d3.select(this).style("opacity",0.6)
							.attr("stroke-width","3");
							
							svgElement.append("line")
							.attr("class","tipline")
							.attr("x1", (leftMargin+yAxisWidth+x(d.xName)) )
							.attr("y1",  (y(yAxisLeg[i])+y.rangeBand()))
							.attr("x2",(leftMargin+yAxisWidth+x(d.xName)))
							.attr("y2",(y(yAxisLeg[i])+y.rangeBand())	)
							.style("stroke-dasharray", ("3, 3"))
							.attr("stroke-width", 1)
                            .attr("stroke", "#D80000")
							
							.transition()
							.duration(750)
							.attr("x2", (leftMargin+yAxisWidth+x(d.xName)))
							.attr("y2", (topMargin+graphHeight) );
							 
							attachToolTip.showToolTip(d3.event,d.xName,d.yName,false,options.toolTipData);
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
					  .attr("width", function(d) { return x(d.xName); })		
					  .attr("y", function(d,i) { return  y(yAxisLeg[i]); })
					  .ease("linear");
					  
				 
			}
			
		}	
	
	function sortNumber(data) {
			var num = data.sort(function (a, b) {
				return parseInt(a) < parseInt(b);
			})
			return num;
		}

		function getX(angle, height, widthX, prevX1) {
			var radians = angle * (Math.PI / 180);
			var x = (height / (Math.tan(radians))) + prevX1;
			return x;
		}

		function getY(angle, height) {
			var radians = angle * (Math.PI / 180);
			var val = (height / (Math.tan(radians)));
			return val;
		}

		function getCoordinatesFromPercent(data) {

			var widthFactorX = 50;
			var heightFactorY = 50;
			var spacingFactor = .25;

			var angle = 60;

			var widthX = (200) / 1.73;
			var heightY = data.length * heightFactorY;

			var currX1 = 0;
			var currX2 = 0;
			var currY1 = 0;
			var currY2 = 0;
			var prevX1 = 0;
			var prevY1 = 0;
			var prevX2 = 0;
			var prevY2 = 0;

			var polygon = {};
			var arrayOfPolygons = [];
			polygon.arrayOfPolygons = arrayOfPolygons;

			for (i = 1; i <= data.length; i++) {

				var x;
				var y;
				var points = {};
				var coordinates = [];
				points.coordinates = coordinates;

				for (j = 0; j < 4; j++) {

					if (j == 0) {
						x = getX(angle, data[i - 1], widthX, prevX1);
						if (i == 1) {
							y = getY(60, data[i - 1]);
						} else {
							y = +prevY1 + getY(angle, data[i - 1]);
						}
						currX1 = x;
						currY1 = y + spacingFactor;

					} else if (j == 1) {

						x = x + (widthX - 2 * x);
						if (i == 1) {
							y = getY(60, data[i - 1]);
						} else {
							y = +prevY2 + getY(angle, data[i - 1]);
						}
						currX2 = x;
						currY2 = y + spacingFactor;

					} else if (j == 2) {
						if (i == 1) {
							x = widthX;
							y = 0;
						} else {
							x = prevX2;
							y = prevY2;
						}

					} else {
						if (i == 1) {
							x = 0;
							y = 0;
						} else {
							x = prevX1;
							y = prevY1;
						}
					}

					var coordinate = {
						"x": x,
							"y": y
					};

					points.coordinates.push(coordinate)
				}

				prevX1 = currX1;
				prevY1 = currY1;
				prevX2 = currX2;
				prevY2 = currY2;

				var coordinateArray = {
					"name": "Polygon-" + i,
					"Percent": data[i - 1],
					"points": points.coordinates
				}
				polygon.arrayOfPolygons.push(coordinateArray);
			}
			return polygon;
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
			drawPyramidChart:pyramidChart.drawPyramidChart,
			myHorizontalBarChart:drawBar.myHorizontalBarChart,
			drawMyMultipleLineChart:lineChart.drawMyMultipleLineChart,
			stackedBarChart:drawBar.stackedBarChart,
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

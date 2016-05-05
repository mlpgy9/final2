// $(document).ready(function() {
//     console.log("Hello world.")
// });





/* ---------------------- */
/* GLOBAL VARIABLES */
/* ---------------------- */



// We use the margins to offset the chartable space inside of the <svg> space.
// A great visual explanation of how this works is here: https://bl.ocks.org/mbostock/3019563
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

// Here, we define the width and height as that of the .chart div minus the margins.
// We do this to make sure our chart is responsive to the browser width/height
var width = $(".chart").width() - margin.left - margin.right;
var height = $(".chart").height() - margin.top - margin.bottom;

// `x` and `y` are scale function. We'll use this to translate values from the data into pixels.
var x = d3.scale.linear()
    .range([0, width]); //Range is an array of two *pixel* values.

var y = d3.scale.linear()
    .range([height, 0]);
    
//var color = d3.scale.category10();

var color = d3.scale.ordinal()
    .domain(['Concrete continuous','Steel continuous','Prestressed concrete*', 'Steel', 'Concrete', 'Prestressed concrete continuous'])
    .range(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]);

// `xAxis` and `yAxis` are functions as well.
// We'll call them later in the code, but for now, we just want to assign them some properties:
// Axis have to abide by their scales: `x` and `y`. So we pass those to the axis functions.
// And we use the orient property to determine where the hashes and number labels show up.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    

// 
// 
// // We define svg as a variable here. It's a variable, so we could call it anything. So don't be confused by it being named the same as the tag.
var svg = d3.select(".chart").append("svg") // Appends the <svg> tag to the .chart div
	.attr("class", "parent-svg") // gives it class
    .attr("width", width + margin.left + margin.right) //gives the <svg> tag a width
    .attr("height", height + margin.top + margin.bottom) //gives the <svg> tag a height
    .append("g") // Appends a <g> (Group) tag to the <svg> tag. This will hold the actual chartspace.
    .attr("class", "chart-g") //assigns the <g> tag a class
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Offsets the .chart-g <g> element by the values left and top margins. Basically the same as a left/right position.

var dropDown = d3.select("#filter").append("select")
                    .attr("name", "MaterialDesign");


// /* END GLOBAL VARIABLES ---------------------- */
// 
// 
// 
// 
// 
// 
// 
// /* ---------------------- */
// /* LOAD THE DATA */
// /* ---------------------- */
// 
// // This is an ajax call. Same as when we load a json file.
d3.csv("data/data.csv", function(error, data) {

if (error) throw error;

  data.forEach(function(d) {
    d.Suffrating = +d.Suffrating;
    d.Built = +d.Built;
  });
  


//console.log(data);
    // Get the highest and lowest `Score` values from the data.
    var minMaxYear = d3.extent(data, function(d) {
        return +d.Built; // We use the `+` sign to parse the value as a number (rather than a string)
    });

    // Get the highest and lowest `Tested` values from the data.
	var minMaxRating = d3.extent(data, function(d) {
        return +d.Suffrating;
    });

    // `minMaxParticipation` is an ARRAY OF TWO VALUES.
    // We'll assign it to the "domain" of the `x` scale. 
    x.domain(minMaxYear);
 	
    // Same for the `x` scale.
    y.domain(minMaxRating).nice();

  var tooltip = d3.select("#tooltip");

//  	// This is where we call the axis functions.
//     // We do so by first giving it someplace to live. In this case, a new <g> tag with the class names `x` and `axis.`
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") //Assigns a left/right position.
        .call(xAxis) // This calls the axis function, which builds the axis inside the <g> tag.
        .append("text") // This and everyhing below just adds a label.
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", -6)
        .style("text-anchor", "middle")
        .text("Year Built");

    // Same as above, but for the y axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sufficiency Rating")
        


	svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) {  return x(d.Built); })
      .attr("cy", function(d) { return y(d.Suffrating); })
      .style("fill", function(d) { return color(d.MaterialDesign); });
// SELECT
      // First we select the elements we're going to create.
      // That may sound a little weird since these elements don't exist yet,
      // but just hang with it.
      var dots = svg.selectAll(".dot")

      // JOIN
      // Now we join our data to those elements. This creates a one-to-one relationship
      // between each data point and element that represents it, in this case a dot!
            .data(data);

      // ENTER
      // This is where d3 is amazing. It knows to check the page, and if there are more data points
      // than elements representing them, it adds them to the page.
      dots.enter()
            .append("circle")
            // Here on out, we're just adding properties to the elements we just created.
            .attr("class", "dot");

      // Update
      dots
        .attr("r", 5)
        .attr("cx",function(d){ return x(d.Built); })
        .attr("cy",function(d){ return y(d.Suffrating); })
        .style("stroke","white")
        .style("stroke-width","1px")
        .style("fill", function(d){
            return color(d.MaterialDesign);
        })
        .on("mouseover",function(d){

            tooltip
                .style("left", (d3.event.pageX + 10 ) + "px")
                .style("top" , (d3.event.pageY - 30 - document.body.scrollTop ) + "px");
            tooltip.classed("hidden",false);

             // tooltip.select("p")
//                 .text(d.Place + " Design Construction:" + d.DesignConstruction);
//                 
            tooltip.html(	"<span class='placeplot'>"+d.Place+"</span><br>"+
 	"<span class='design'>Design Construction: "+d.DesignConstruction+"</span><br>"+
 	"<span class='built'>Year Built: "+d.Built+"</span><br>"+
 	"<span class='length'>Length(m): "+d.Length+"</span><br>");
        })
        
        
        
        .on("mouseout", function(d){
            tooltip.classed("hidden",true);
        });
        
        


        // Add a legend to the chart
        var keys = d3.select("#key-table").selectAll(".key")
            .data(color.domain()) // color.domain() just gives us an array of the color data values
            .enter()
            .append("div") // Appends one div for each color value in the array above.
            .attr("class","key")
            // You can also add straight HTML to an elements if you
            // need to cudgel your way through a problem like these keys!
            // I'm just inlining the html font-awesome circle
            // icon, and adding the color as an inline style attribute.
            // Not the most elegant way, but important to know you can do!
            .html(function(d){
                return "<span class='fa fa-circle' style='background-color:"
                +color(d)+
                ";'></span>"+d;});
                
                
var options = dropDown.selectAll("option")
         .data(data)
         .enter()
         .append("option");
         
var usedMaterial = {};
$("select[name='MaterialDesign'] > option").each(function () {
    if(usedMaterial[this.text]) {
        $(this).remove();
    } else {
        usedMaterial[this.text] = this.value;
    }
});

options.text(function (d) { return d.MaterialDesign; })
         .attr("value", function (d) { return d.MaterialDesign; });
         
		
	dropDown.on("change", function() {
      var selected = this.value;
      displayOthers = this.checked ? "inline" : "none";
      display = this.checked ? "none" : "inline";


      svg.selectAll(".dot")
          .filter(function(d) {return selected != d.MaterialDesign;})
          .attr("display", displayOthers);
          
      svg.selectAll(".dot")
          .filter(function(d) {return selected == d.MaterialDesign;})
          .attr("display", display); 
          });   
          
          var usedMaterial = {};
$("select[name='MaterialDesign'] > option").each(function () {
    if(usedMaterial[this.text]) {
        $(this).remove();
    } else {
        usedMaterial[this.text] = this.value;
    }
});     
});



//TABLE STARTS HERE TABLE STARTS HERE

var months = {
	"01" : "January",
	"02" : "February",
	"03" : "March",
	"04" : "April",
	"05" : "May",
	"06" : "June",
	"07" : "July",
	"08" : "August",
	"09" : "September",
	"10" : "October",
	"11" : "November",
	"12" : "December"
} //DICTIONARY, use value to look up month. 1 is key in which we can access the corresponding value of January.




$(document).ready(function() {

	// 1.
	// When the page is loaded,
	// call the loadData() function.

	loadData();

});




function loadData() {
	
	d3.csv("data/data.csv", function(data) {
		writeTable(data);
	});

	// 2.
	// Write an AJAX call here to load your data.
	// Then PASS the data to writeTable();
}



function writeTable(data) {

		for(i=0; i < data.length; i++) {
		
		var place = data[i]["Place"];
		
		
		var year = data[i]["Built"];
		
		var length = data[i]["Length(m)"];
		
		var rating = data[i]["Suffrating"];
		
		var material = data[i]["MaterialDesign"];
		
		var design = data[i]["DesignConstruction"];
		
		var status = data[i]["Status"];
// 		console.log(relativeToNow);
// 		
		//console.log(months[monthNum]); //monthNum is 'key'
		
		//var verboseDate = moment(longDate).format('MMM. D, YYYY');
		
		//console.log(verboseDate);
		
		
			//if (data[i]["Committee"] === "CITIZENS TO ELECT KURT SCHAEFER ATTORNEY GENERAL") {
				$("table.bridges tbody").append(
					"<tr>"+
						"<td class='place'>"+data[i]["Place"]+"</td>"+
		                "<td class='year'>"+data[i]["Built"]+"</td>"+
		                "<td class='length'>"+data[i]["Length"]+"</td>"+
		                "<td class='rating'>"+data[i]["Suffrating"]+"</td>"+
		                "<td class='material'>"+data[i]["MaterialDesign"]+"</td>"+
		                "<td class='design'>"+data[i]["DesignConstruction"]+"</td>"+
		                "<td class='status'>"+data[i]["Status"]+"</td>"+
	                "</tr>"
				);
			//}

		}



		// $('.donations').DataTable();
		
		    $('.bridges').DataTable( {
        "order": [[ 6, "desc" ]]
    } );

	// 3.
	// Make a list of every donation made to "CITIZENS TO ELECT KURT SCHAEFER ATTORNEY GENERAL"
	// Do this by looping through the data and writing a new table row (<tr></tr>) for every donation.
	// Each row should contain of three columns (<td></td>): 
	// - Contribution Date
	// - Contributon Information
	// - Amount
}
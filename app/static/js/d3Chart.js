//D3 Data
window.data = {
    frontend:[
        {'name':'HTML/CSS', 'skill': 5},
        {'name':'JavaScript', 'skill': 8},
        {'name':'D3.js', 'skill': 9},
        {'name':'Backbone', 'skill': 7},
        {'name':'jQuery', 'skill': 4}
        ],
    backend:[
        {'name':'Node.js', 'skill':7},
        {'name':'Django', 'skill':6},
        {'name':'Python', 'skill':9},
        {'name':'AWS', 'skill':8},
        {'name':'RDBMS', 'skill':7},
        {'name':'NOSQL', 'skill':6}
        ],
    extra:[
        {'name':'Vim', 'skill':9},
        {'name':'Linux', 'skill':6},
        {'name':'Basketball', 'skill':8},
        {'name':'Smash Bros.', 'skill':9},
        ]
}
    
function d3Chart(options){
    /*
     * Builds the skeleton of a D3 barchart.
     * Width is dependent on screen width -- not fully responsive yet.
     *
     * Can take optional parameters, but not currently written to.
     */

    //Builds initially based on screen width. Does not adapt to width change, unfortunately.
    var windowHeight = $(window).height()
    ,   windowWidth = $(window).width()
    ,   height = windowWidth > 500 ? 400 : 200
    ,   width = windowWidth > 772 ? windowWidth - 800 : windowWidth - 30
    ;

    this.margin = {top: 20, right: 0, bottom: 50, left: 0};
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;
    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.color = d3.scale.linear().domain([0, 10]).range([80,180]);

    //PreserveAspect and viewBox make the chart slightly responsive.
    this.svg = d3.select('#d3Chart').append("svg")
        .attr("viewBox", "0 0 " + this.width + " " + (this.height + this.margin.top + this.margin.bottom))
        .attr('style', 'padding-top:2%')
        .attr("preserveAspectRatio", "xMaxYmid meet")
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")


   //Build Axes
    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("right")
        .tickSize(this.width)
        .tickValues([1,2,3,4,5]);
};

d3Chart.prototype.bindData = function(data) {
    /*
     * Binds data to the d3Chart
     * 
     * data = [{name: 'D3', skill:10}, {name: 'JavaScript', skill:9}]
     *
     */
    var self = this;

    this.yMax = d3.max(data, function(d) { return +d.skill; });
    this.x.domain(data.map(function(d) { return d3.values(d)[0]; }))
    this.y.domain([0, this.yMax])

    //X Axis values are rotated to prevent overlap
    this.svg.selectAll('.y.axis').call(this.yAxis);
    this.svg.selectAll('.x.axis').call(this.xAxis)
        .selectAll("text")  
        .style("text-anchor", "middle")
        .attr("transform", function(d) {
            return "rotate(-15)" 
        });

    //Append Tooltip
    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            var stars = Math.floor(d.skill / 2);
            var emptyStars = 10 - d.skill;
            var starString = '';
            for (var i = 0; i < stars; i++) {starString += '<i class="fa fa-star"></i>';}
            if (d.skill % 2 == 1) starString += '<i class="fa fa-star-half-full"></i>';
            for (var i = 1; i < emptyStars; i+=2) {starString += '<i class="fa fa-star-o"></i>';}
            return "<strong><span> " + d.name + "</span></strong><br>" +
            "<span style='color:orange;'> " + starString + " </span>";
        });

    this.svg.call(this.tip);
    //REMOVE ANY BARS THAT EXIST
    this.svg.selectAll('.bar').remove();

    //ADD NEW BAR CONTAINERS
    var bars = this.svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
                .attr("class", "rect bar")
                .attr("transform", function(d) { 
                    return "translate(" + self.x(d3.values(d)[0]) + ",0)"; });

    var rects = bars.append("rect")
            .attr("width", this.x.rangeBand())
            .attr('height', 0)
            .attr("y", this.height)
            .attr("fill", function(d) {
                return "rgb(80, " + Math.round(self.color(d.skill)) + ",0)";})
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide);

    rects.transition()
            .attr("height", function(d) { 
                return self.height - self.y(+d.skill); })
            .attr("y", function(d) { 
                return self.y(+d.skill); })
            .delay(250)
            .duration(750);

};


//Event handling for the dropdown
$("#d3-frontend").click(function(e){
    e.preventDefault();
    window.d3Chart.bindData(window.data.frontend);
    $('#skillName').text('Frontend');
});
$("#d3-backend").click(function(e){
    e.preventDefault();
    window.d3Chart.bindData(window.data.backend);
    $('#skillName').text('Backend');
});
$("#d3-etc").click(function(e){
    e.preventDefault();
    window.d3Chart.bindData(window.data.extra);
    $('#skillName').text('Etc.');
});

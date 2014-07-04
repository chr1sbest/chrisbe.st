$(document).ready(function() {
    mixpanel.track("Page Load");
    submitMessage.init();
    charts.init();
    sleekScroll.init();
});


//Contact message
var submitMessage = {
    init: function() {
        $('#submit-button').click( function(e) {
            e.preventDefault();

            var email = $('#contact-email').val()
            ,   message  = $('#contact-msg').val()
            ;

            if (!email) {alert('Please provide a valid email address'); return;}
            if (!message) {alert('Please input a message'); return;}

            $('#spinner').addClass('fa-spinner fa-spin');

            $.ajax(
                {   url: '/send_message'
                ,   type: 'post'
                ,   async: false
                ,   data: 
                    {   'email': email
                    ,   'message': message
                    }
                ,   dataType: 'html'
                ,   success: function(returnedData){
                        mixpanel.track("Message Success");
                        $('div#boot-alert').load('success #alert-pass');
                    }
                ,   error: function(returnedData){
                        mixpanel.track("Message Failed");
                        $('div#boot-alert').load('success #alert-fail');
                    }
                }
            );

            $('#spinner').removeClass('fa-spinner fa-spin');

        });
    }
};


//D3
var charts = {
    init: function() {
        window.skillChart = new charts.d3Chart();
        charts.events();
    }

,   d3Chart: function(options) {
        /*
         * Builds the skeleton of a D3 barchart.
         * Width is dependent on screen width -- not fully responsive yet.
         *
         * Can take optional parameters, but not currently written to.
         */

        //Builds initially based on screen width. Does not adapt to width change, unfortunately.
        var windowHeight = $(window).height()
        ,   windowWidth = $(window).width()
        ,   height = windowHeight * 0.5
        ,   width = windowWidth > 768 ? windowWidth * 0.40 : windowWidth * 0.7
        ;

        this.margin = {top: 20, right: 0, bottom: 50, left: 0};
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
        this.y = d3.scale.linear().range([this.height, 0]);
        this.color = d3.scale.linear().domain([0, 10]).range([80,180]);
        this.loaded = false;

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
    }

,   events: function() {
        //Load D3Chart when scrolled far enough down
        $(window).on('scroll', function() {
            var yPosition = window.pageYOffset
            ,   pageHeight = $(window).height()
            ,   chartPosition = $('#skills').position()
            ,   loaded = window.skillChart.loaded
            ;

            if(yPosition > chartPosition.top - pageHeight/3 && !loaded) {
                mixpanel.track("Chart Loaded");
                window.skillChart.bindData(charts.data.Frontend);
                window.skillChart.loaded = true;
            }
        });

        //Bind new data to chart
        $(".chart-btn").click(function(e){
            mixpanel.track("Dataset: " + e.target.innerHTML);
            e.preventDefault();
            window.skillChart.bindData(charts.data[e.target.innerHTML]);
            window.skillChart.loaded = true;
        });

        //Rebuild chart if width is resized
        $(window).resize(function(e){
            mixpanel.track("Resize Event");
            e.preventDefault();
            $('#d3Chart').children().remove();
            window.skillChart = new d3Chart();
            window.skillChart.bindData(charts.data.Frontend);
            window.skillChart.loaded = true;
        });
    }
,   data:
        {   Frameworks:
                [   {'name':'Django.py', 'skill':7}
                ,   {'name':'Flask.py', 'skill':9}
                ,   {'name':'Node.js', 'skill':6}
                ,   {'name':'Express.js', 'skill':7}
                ]
        ,   Frontend:
                [   {'name':'HTML/CSS', 'skill': 5}
                ,   {'name':'JavaScript', 'skill': 8}
                ,   {'name':'D3.js', 'skill': 9}
                ,   {'name':'Backbone.js', 'skill': 6}
                ,   {'name':'jQuery', 'skill': 4}
                ]
        ,   Servers:
                [   {'name':'AWS EC2', 'skill':7}
                ,   {'name':'AWS ELB', 'skill':5}
                ,   {'name':'Boto', 'skill':8}
                ,   {'name':'Docker', 'skill':5}
                ,   {'name':'Fabric', 'skill':7}
                ,   {'name':'Linux', 'skill':4}
                ]
        ,   Languages:
                [   {'name':'Python', 'skill':9}
                ,   {'name':'Javascript', 'skill':8}
                ,   {'name':'Scala', 'skill':6}
                ,   {'name':'Java', 'skill':2}
                ,   {'name':'C', 'skill':3}
                ,   {'name':'Scheme', 'skill':5}
                ]
        ,   Data:
                [   {'name':'AWS S3', 'skill':8}
                ,   {'name':'PostgreSQL', 'skill':7}
                ,   {'name':'MySQL', 'skill':7}
                ,   {'name':'SQLAlchemy', 'skill':6}
                ,   {'name':'Redis', 'skill':6}
                ,   {'name':'MongoDB', 'skill':3}
                ]
        ,   Extra:
                [   {'name':'Agile', 'skill':8}
                ,   {'name':'Vim', 'skill':7}
                ,   {'name':'BDD', 'skill':8}
                ,   {'name':'Basketball', 'skill':8}
                ,   {'name':'Smash Bros.', 'skill':9}
                ,   {'name':'LoL', 'skill':9}
                ]
        }
}

charts.d3Chart.prototype.bindData = function(data) {
    /*
     * Binds data to the d3Chart
     * 
     * data = [{name: 'D3', skill:10}, {name: 'JavaScript', skill:9}]
     *
     */
    var self = this
    ,   data = data
    ;

    this.yMax = d3.max(data, function(d) { return +d.skill; });
    this.x.domain(data.map(function(d) { return d3.values(d)[0]; }))
    this.y.domain([0, this.yMax])

    //X Axis values are rotated to prevent overlap
    this.svg.selectAll('.y.axis').call(this.yAxis);
    this.svg.selectAll('.x.axis').call(this.xAxis)
        .selectAll("text")  
        .style("text-anchor", "middle")
        .attr("transform", function(d) {
            return "rotate(-10)" 
        });

    //Append Tooltip
    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            var stars = Math.floor(d.skill / 2)
            ,   emptyStars = 10 - d.skill
            ,   starString = ''
            ;

            //Add appropriate star rating to tooltip
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


//Sleek Scrolling
var sleekScroll = { 
    init: function() {
        var navOffset = $('header .navigation').offset().top
        ,   scrollSpyPause  = false; 

        // Scroll window
        $(window).scroll(function() {
            if ($(window).scrollTop() > 150) {
                $('.scroll-to-top').fadeIn(350);
            } else {
                $('.scroll-to-top').fadeOut(350);
            }
            // Scroll spy
            if (!scrollSpyPause) {
                $('header .navigation a[href^="#"]').each(function() {
                    var offset = $($(this).attr('href')).offset().top;
                    if (Math.abs($(window).scrollTop() - offset) < 500) {
                        $('header .navigation li.active').removeClass('active');
                        $(this).parents('li').addClass('active');
                    }
                });
                $('header:not(.fixed) .navigation li.active').removeClass('active');
            }
        });
        
        // Navigation sections
        $('header .navigation a').click(function() {
            mixpanel.track($(this).attr('href') + ' nav click');
            $('header .navigation li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            scrollSpyPause = true;
            $.scrollTo({top: $($(this).attr('href')).offset().top, left: 0}, 1000, function() { scrollSpyPause = false; });
            return false;
        });
        
        // Scroll link
        $('a.s-scroll').click(function() {
            $.scrollTo({top: $($(this).attr('href')).offset().top, left: 0}, 1000);
            return false;
        });
        
        // Scroll to top button
        $('.scroll-to-top').click(function() {
            mixpanel.track("ScrolltoTop");
            $.scrollTo('header', 1000);
            return false;
        });
        
        // Bootstrap
        $('.s-tooltip').tooltip();
    }
};



var request = d3.json("./meteo.json")
    .then((datas) => {
        drawcharTemp(datas);
        drawcharPluvi(datas);
    }).catch(console.error);

function drawcharTemp(data) {

    //Déclaration des variables et mise en place du style
    var svgWidth = 650, svgHeight = 450;
    var margin = { top: 20, right: 75, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;


    var svg = d3.select(document.getElementById("1")).attr("width", svgWidth).attr("height", svgHeight);
    //élément pour avoir nos axes
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //scales
    //x -> par rapport au temps
    var x = d3.scaleLinear().rangeRound([0, width]);
    //y -> par rapport a une valeur
    var y = d3.scaleLinear().rangeRound([height, 0]);

    //dessin de la ligne
    var line = d3.line().x(function (d) { return x(d.d) }).y(function (d) { return y((d.t) / 100) });
    x.domain(d3.extent(data, function (d) { return d.d }));
    y.domain(d3.extent(data, function (d) { return d.t / 100 }));

    //append l'axis horizontal
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("y", -15)
        .attr("x", width - 18)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Jour");

    //append l'axis vertical
    g.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Température");

    //append la courbe
    g.append("path")
        .datum(data, function (d) { return d.t })
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Température")
        .attr('fill', 'black');

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    //créé un bullet
    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em")
        .attr('fill', 'black');

    //créé un tooltip
    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () { focus.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    //au mouvement de la souris sur la courbe, fais apparaître le tooltip et le bullet
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        x0 = parseInt(x0);
        var d0 = data[x0 - 1],
            d = d0;
        focus.attr("transform", "translate(" + x(d.d) + "," + y((d.t) / 100) + ")");
        focus.select("text").text(function () { return (d.t) / 100; });
        focus.select(".x-hover-line").attr("y2", height - y((d.t) / 100));
        focus.select(".y-hover-line").attr("x2", width + width);
    }
}

function drawcharPluvi(data) {

    //Déclaration des variables et mise en place du style
    var svgWidth = 650, svgHeight = 450;
    var margin = { top: 20, right: 75, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select(document.getElementById("2")).attr("width", svgWidth).attr("height", svgHeight);

    //élément pour avoir nos axes
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //scales
    //x -> par rapport au temps
    var x = d3.scaleLinear().rangeRound([0, width]);
    //y -> par rapport a une valeur
    var y = d3.scaleLinear().rangeRound([height, 0]);

    //dessin de la ligne
    var line = d3.line().x(function (d) { return x(d.d) }).y(function (d) { return y((d.p)) });
    x.domain(d3.extent(data, function (d) { return d.d }));
    y.domain(d3.extent(data, function (d) { return d.p }));

    //append the axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("y", -15)
        .attr("x", width - 18)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Jour");
    // .select(".domain").remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("mm/m²");

    g.append("path")
        .datum(data, function (d) { return d.p })
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Pluviométrie")
        .attr('fill', 'black');

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em")
        .attr('fill', 'black');

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () { focus.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        x0 = parseInt(x0);
        var d0 = data[x0 - 1],
            d = d0;
        focus.attr("transform", "translate(" + x(d.d) + "," + y(d.p) + ")");
        focus.select("text").text(function () { return d.p; });
        focus.select(".x-hover-line").attr("y2", height - y(d.p));
        focus.select(".y-hover-line").attr("x2", width + width);
    }

};

function drawTempStation(data, id, day) {
    var svg2 = d3.select(document.getElementById("station1")).attr("width", svgWidth).attr("height", svgHeight);
    //Déclaration des variables et mise en place du style
    var svgWidth = 650, svgHeight = 450;
    var margin = { top: 20, right: 75, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    data.forEach(dat => {
        if(dat.d == day){
        dat.station.forEach(station =>{
            if(station.n === id)
            {
                data = station.hours;
            }
        })
    }
    });

    var svg = d3.select(document.getElementById("station1")).attr("width", svgWidth).attr("height", svgHeight);
    if(svg.select('g') != null)
   {
        svg.select('g').remove();
   }
    //élément pour avoir nos axes
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //scales
    //x -> par rapport au temps
    var x = d3.scaleLinear().rangeRound([0, width]);
    //y -> par rapport a une valeur
    var y = d3.scaleLinear().rangeRound([height, 0]);

    //dessin de la ligne
    var line = d3.line().x(function (d) { return x(d.h) }).y(function (d) { return y((d.t) / 100) });
    x.domain(d3.extent(data, function (d) { return d.h }));
    y.domain(d3.extent(data, function (d) { return d.t / 100 }));

    //append the axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("y", -15)
        .attr("x", width - 18)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Heures");
    // .select(".domain").remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Température");

    g.append("path")
        .datum(data, function (d) { return d.t })
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Température")
        .attr('fill', 'black');
}

function drawPluviStation(data, id) {
    //Déclaration des variables et mise en place du style
    var svgWidth = 650, svgHeight = 450;
    var margin = { top: 20, right: 75, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    data.forEach(dat => {
        if(dat.d == day){
        dat.station.forEach(station =>{
            if(station.n === id)
            {
                data = station.hours;
            }
        })
    }
    });
    console.log(data);
    var svg = d3.select(document.getElementById("station2")).attr("width", svgWidth).attr("height", svgHeight);
   if(svg.select('g') != null)
   {
        svg.select('g').remove();
   }
    //élément pour avoir nos axes
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //scales
    //x -> par rapport au temps
    var x = d3.scaleLinear().rangeRound([0, width]);
    //y -> par rapport a une valeur
    var y = d3.scaleLinear().rangeRound([height, 0]);

    //dessin de la ligne
    var line = d3.line().x(function (d) { return x(d.h) }).y(function (d) { return y((d.p)) });
    x.domain(d3.extent(data, function (d) { return d.h }));
    y.domain(d3.extent(data, function (d) { return d.p }));

    //append the axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("y", -15)
        .attr("x", width - 18)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Heures");
    // .select(".domain").remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "black")
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("mm/m²");

    g.append("path")
        .datum(data, function (d) { return d.p })
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Pluviométrie")
        .attr('fill', 'black');
}

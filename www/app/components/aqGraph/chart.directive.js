(function(){
  angular.module('app.components')
  .directive('chart', chart);

  function chart(){
    var directive = {
          restrict: 'E',
          replace: true,
          templateUrl: 'app/components/aqGraph/chart.html',
          scope: {
            type: '@'
          },
          link: link,
          controller: 'ChartController',
          controllerAs: 'vm',
          bindToController: true // because the scope is isolated
      };

      return directive;

      function link(scope, el, attr, ctrl) {

        var historyBarChart;
        var canvas = el[0];
        console.log(canvas.id);
        var chartData;   

        scope.$on('chartChanges', function(event, range) {
          if (scope.vm.type == 'barChart') {
            if (range.value==1){
              getAQData(7, 240); 
            }
            else if(range.value==2){
              getAQData(30, 900); 
            }
            else {
              getAQData(360, 7500); 
            }
          }
        });                

        getAQData(7, 240);  

        function getAQData(days, height) { 
          chartData = {
            labels: [],
            data: [],
            backgroundColor: []
          }

          var dateStart = moment().subtract(days, 'days').format('YYYY-MM-DD');          

          scope.getAQm(dateStart).then(function(response) {
            var data = response.data.data;
            data.forEach(function(value){
              chartData.labels.push( moment(value.date).format('DD/MM') );
              chartData.data.push( value.AQI_Value );
              chartData.backgroundColor.push( getColor(value.AQI_Index) );
            });

            if (historyBarChart) {
              historyBarChart.destroy();
            }

            historyBarChart = createAQHistoryChart(chartData, canvas, height); 
          });
        }                  

      }

      function getRandomAQValue(){
        return Math.floor((Math.random()*400) + 50);
      } 

      function getColor(index) {
        switch (index) {
          case 'perfect':
            return "rgb(125, 187, 66)";
          case 'good':
            return "rgb(254, 204, 9)";
          case 'medium':
            return "rgb(246, 142, 31)";
          case 'bad':
            return "rgb(239, 71, 35)";
          default:
            return "rgb(125, 187, 66)";
        }
      }           

      //each bar has its own colour, depending on its value
      function getColours(AQData){
        var barColors = [];
         for (var i=0;i<AQData.length;i++){
          var color="#00a3ac";
          if (AQData[i]<150){
            color="#ac4f4f";
          }
          else if (AQData[i]<250){
            color="#ff6666";
          }
          else if (AQData[i]<350){
            color="#227c81";
          }
          else {
            color="#00a3ac";
          }
          barColors[i] = color;
        }
        return barColors;
      }

      function getDataSourcesData(){
        data = {
          datasets: [{
            data: [45, 39, 16],
            backgroundColor: ['#227c81','#00a3ac','#ff6666']
          }],

          labels: [
            'Open Data',
            'Contributors',
            'Sensors'
          ]
        };
        return data;
      }   

      function createAQHistoryChart(chartData, canvas, height) { 
        if (canvas){
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
          ctx.height = height; 
          ctx.canvas.height=height;           
        }

        console.log(chartData.data);
        console.log(chartData.labels);

        var myChart = new Chart(ctx, {
          responsive: true,
          type: 'horizontalBar',
          data: {
            labels: chartData.labels,
            datasets: [{
                label: '',
                data: chartData.data,
                backgroundColor: chartData.backgroundColor
            }]
          },
          options: {
            legend: {
              display: false,
            },

            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                  fontColor: '#666666',
                },
                gridLines: {
                  color: "rgb(232, 232, 232)",
                  lineWidth: 1
                },
                scaleLabel:{
                    display: true,
                    labelString: 'Date',
                    lineHeight: 2,
                    fontSize: 13,
                    fontStyle: 'normal',
                    padding: 0,
                    fontColor: "#666"
                }                   
              }],
              xAxes:[{
                ticks: {
                  fontColor: '#666666'
                },
                gridLines: {
                  display:false
                },
                scaleLabel:{
                    display: true,
                    labelString: 'hackAIR AQI index',
                    lineHeight: 2,
                    fontSize: 13,
                    fontStyle: 'normal',
                    padding: 0,
                    fontColor: "#666"
                }                
              }]
            },
            tooltips: {
              backgroundColor: '#022b3a'
            }
          }
        });
        return myChart;
      }

  }
})();

import { Component } from '@angular/core';
import * as _Highcharts from 'highcharts';

import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent   {
  highcharts = _Highcharts;
  
  csvRecords: any[] = [];
  header = false;
  public dataArray: Flight[] = [];
  public sortedDays: number[] = [];
  public seriesArray = [];
  public allSeriesArray = [];
 
  public seriesDataByMonth = [];
  public isDataLoaded = false;
  public chartOptions;
  public months =["All","Jan","Feb","March","April","May","June","July","August","September","October","November","December"];
  public selectedMonth = this.months[0];
  constructor(private http: HttpClient) {
    //Read CSV
    this.http.get('assets/flights_2015_sample.csv', {responseType: 'text'})
    .subscribe(
        data => {
            
          let csvToRowArray = data.split("\n");
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            let row = csvToRowArray[index].split(",");
            this.dataArray.push(new Flight(parseInt(row[0]),parseInt(row[2]),row[3]));
          }
          //Parse CSV in data format supported to highcharts visulization
          const uniqueMonths = [...new Set(this.dataArray.map(item => item.month))].sort((d1,d2) => d1 - d2);
          const uniqueDays =  [...new Set(this.dataArray.map(item => item.weekDay))];
          this.sortedDays = uniqueDays.sort((d1,d2) => d1 - d2);
          const uniqueFlights = [...new Set(this.dataArray.map(item => item.airLine))];

          uniqueMonths.forEach(month=>{
            this.seriesArray = [];
            
            uniqueFlights.forEach(flight => {
              var airlineCountByDays=[];
              var allCountByDays =[];
              this.sortedDays.forEach(day =>{
                var occurance = 0
                var allcount = 0
                this.dataArray.filter( el => {  
                if(el.airLine == flight && el.weekDay == day ){
                  allcount++

                  if(el.month == month){
                    occurance++;
                  }
                }
                
              })   
              if(month == 1){
                allCountByDays.push(allcount);
              }
             
             airlineCountByDays.push(occurance);
            });
            var seriesObj = {
              name: flight,
              data: airlineCountByDays
            }
            
            if(month == 1){
              var seriesObjForAll ={
                name: flight,
                data:allCountByDays
              }
              this.allSeriesArray.push(seriesObjForAll);
              
            }
            this.seriesArray.push(seriesObj);
            
          })
            this.seriesDataByMonth.push(this.seriesArray);
           
          }),

    this.isDataLoaded = true;

    this.renderChart();
  });
    
  }
  renderChart (){
   
    var dataArray = []
    
    const selectedMonthIndex = this.months.indexOf(this.selectedMonth);
    if (this.selectedMonth == 'All'){
       dataArray = JSON.parse(JSON.stringify(this.allSeriesArray));

    }else{
      dataArray = JSON.parse(JSON.stringify(this.seriesDataByMonth[selectedMonthIndex-1]));
    }
  
    this.chartOptions = {   
      chart: {
         type: "area"
      },
      title: {
        text: ""
      },
      xAxis:{
        categories: ["Monday","Tuesday","WednesDay","Thursday","Friday","Saturday","Sunday"],
        tickmarkPlacement: 'on',
        title: {
           enabled: false
        }
      },
      yAxis : {
        title: {
           text: 'Number of flights'
        },
      },
      tooltip : {
        shared: false,
        valueSuffix: ' flights'
      },
      credits:{
        enabled: false
      },
      series:dataArray
   };
  }
  selectChangeHandler (value: any) {
    //update the ui
    this.selectedMonth = value;
    this.renderChart();
  }
}

export class Flight{
  weekDay: number;
  airLine: String;
  month: number;

  constructor(month:number,weekDay: number, airLine: String){
    this.weekDay = weekDay;
    this.airLine = airLine;
    this.month = month;
  }
}


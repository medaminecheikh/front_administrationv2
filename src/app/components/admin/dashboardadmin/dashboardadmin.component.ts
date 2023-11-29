import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, elements} from "chart.js";

@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.scss']
})
export class DashboardadminComponent implements OnInit, OnDestroy {
  constructor() {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  title = 'Employer';

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        align: 'start', // Align the labels at the start to stack them vertically
         },
      tooltip:{
        callbacks: {


        },

      },

    },


  };
  public pieChartLabels = [['Admin'], ['Back-Office'], ['Front-Office']];
  public pieChartDatasets = [{
    data: [300, 500, 100]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];
}

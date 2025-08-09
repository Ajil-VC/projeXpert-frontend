import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { CommonModule } from '@angular/common';
import { SummaryCard } from '../../../workspace/pages/dashboard/domain/dashboard.domain';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  constructor(private adminSer: AdminService, private toast: NotificationService) { }

  ngOnInit() {

    this.adminSer.getDashBoardData().subscribe({
      next: (res: { status: boolean, result: { barChartData: Array<number>, summaryCards: SummaryCard[], doughnutChart: { data: Array<number>, labels: Array<string> } } }) => {

        this.summaryCards = res.result.summaryCards;
        this.barChartData[0].data = res.result.barChartData;

        if (this.chart) {
          this.chart.update();
        }

        this.doughnutChartData.labels = res.result.doughnutChart.labels;
        this.doughnutChartData.datasets[0].data = res.result.doughnutChart.data;
        this.doughnutChartData.datasets[0].backgroundColor = this.generateColors(res.result.doughnutChart.data.length);
        this.doughnutChartData = { ...this.doughnutChartData };
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve dash board data.')
      }
    })
  };


  summaryCards: SummaryCard[] = [
    {
      count: 0,
      label: 'Total Companies',
      sublabel: '.......',
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      count: 0,
      label: 'Active Subscriptions',
      sublabel: '......',
      icon: 'fa-pencil-alt',
      color: 'blue'
    },
    {
      count: 0,
      label: 'Monthly Revenue',
      sublabel: '........',
      icon: 'fa-calendar-check',
      color: 'orange'
    }

  ];



  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Subscriptions',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  barChartData: ChartDataset<'bar'>[] = [
    {
      label: 'Subscriptions',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#42A5F5',
    }
  ];

  barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];





  //dougnut graph
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['No data Available'],
    datasets: [
      {
        data: [0],
        backgroundColor: []
      }
    ]
  };

  // Chart options
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Plan Usage',
      }
    }
  };


  generateColors(count: number): string[] {
    const colors = [];

    const colorPalette = [
      '#FF6384', '#4ECDC4', '#FFCE56', '#9966FF',
      '#FF9F40', '#C9CBCF', '#FF6B6B', '#4BC0C0'
    ];

    if (count <= colorPalette.length) {
      return colorPalette.slice(0, count);
    }


    const goldenRatio = 0.618033988749895;
    let hue = Math.random();

    for (let i = 0; i < count; i++) {

      hue = (hue + goldenRatio) % 1;
      const saturation = 0.7 + (i % 2) * 0.2;
      const lightness = 0.5 + (i % 3) * 0.1;

      colors.push(this.hslToHex(hue, saturation, lightness));
    }

    return colors;
  }

  protected hslToHex(h: number, s: number, l: number): string {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h * 6 && h * 6 < 1) {
      r = c; g = x; b = 0;
    } else if (1 <= h * 6 && h * 6 < 2) {
      r = x; g = c; b = 0;
    } else if (2 <= h * 6 && h * 6 < 3) {
      r = 0; g = c; b = x;
    } else if (3 <= h * 6 && h * 6 < 4) {
      r = 0; g = x; b = c;
    } else if (4 <= h * 6 && h * 6 < 5) {
      r = x; g = 0; b = c;
    } else if (5 <= h * 6 && h * 6 < 6) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

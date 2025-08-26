import { Component, ViewChild } from '@angular/core';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ReportFilter } from '../../../../core/domain/entities/UI Interface/headerTypes';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';

@Component({
  selector: 'app-revenue',
  imports: [CommonModule, ContentHeaderComponent, CurrencyPipe, BaseChartDirective],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  headerConfig: HeaderConfig = {

    title: 'Revenue Report',
    icon: '📈',
    subtitle: 'See complete revenue report',
    placeHolder: 'Search...',
    searchQuery: '',
    hideSearchBar: true,
    buttons: [
      {
        type: 'radio',
      }
    ]

  }

  plans: SubscriptionPlan[] = [];
  searchTerm: string = '';
  startDate: Date | undefined = undefined;
  endDate: Date | undefined = undefined;

  handleSearchEvent(event: string) {

    this.searchTerm = event;
    // this.applyFilters();

  }
  handlebuttonClick(btn: ButtonType) {

    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {

      } else if (btn.type === 'filter') {
        if (btn.action && 'statusFilters' in btn.action) {
          // this.toggleStatusFilter(btn.action.statusFilters)
        }
      } else if (btn.type === 'radio') {
        if (btn.action && 'filter' in btn.action) {

          this.filter = btn.action.filter;
          if (btn.action.filter === 'date') {
            this.startDate = btn.action.startDate || undefined;
            this.endDate = btn.action.endDate || undefined;
            this.loadReportData('date', btn.action.startDate, btn.action.endDate);
          } else if (this.filter !== undefined && this.filter !== 'custom') {
            this.startDate = undefined;
            this.endDate = undefined;
            this.loadReportData(this.filter);
          }

        }
      }

    }
  }


  constructor(
    private adminSer: AdminService,
    private toast: NotificationService
  ) { }

  filter: ReportFilter = 'year';
  totalRevenue = 0;
  purchaseCount = 0;

  // Chart Data
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue',
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.3)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  options: SubscriptionPlan[] = [];
  selected: string[] = [];
  toggleOption(option: SubscriptionPlan) {
    if (this.selected.includes(option._id)) {
      this.selected = this.selected.filter(o => o !== option._id);
    } else {
      this.selected.push(option._id);
    }

    if (this.filter === "year" || this.filter === "month" || this.filter === "date" || this.filter === undefined) {
      this.loadReportData(this.filter, this.startDate, this.endDate);
    }
  }

  isSelected(option: string): boolean {
    return this.selected.includes(option);
  }
  ngOnInit() {
    this.loadReportData();
    this.adminSer.getAvailablePlans(1).subscribe({
      next: (res) => {
        this.options = res.result.plans
      },
      error: (err) => {
        this.toast.showError("Couldnt retrieve the plans.");
      }
    })
  }


  loadReportData(filter: "month" | "year" | "date" = 'year', startDate?: Date, endDate?: Date) {

    this.adminSer.getRevenueReport(filter, this.selected, startDate, endDate).subscribe({
      next: (res) => {

        this.purchaseCount = res.result.totalData.totalCount;
        this.totalRevenue = res.result.totalData.totalRevenue

        if (filter === 'year') {
          this.lineChartData.datasets[0].data = res.result.revenueData;
          if (this.chart) {
            this.chart.update();
          }
        } else if (filter === 'month') {
          if (this.chart) {
            this.lineChartData.datasets[0].data = res.result.revenueData.map((data: { date: number, totalAmount: number }) => {
              return data.totalAmount;
            })

            this.lineChartData.labels = res.result.revenueData.map((data: { date: number, totalAmount: number }) => {
              return data.date
            })

            this.chart.update();
          }
        } else if (filter === 'date') {
          if (this.chart) {
            const length = res.result.revenueData.length;
            this.lineChartData.datasets[0].data = res.result.revenueData.map((ele: { date: Date, totalAmount: number }) => ele.totalAmount);
            this.lineChartData.labels = res.result.revenueData.map((ele: { date: Date, totalAmount: number }) => ele.date);
            this.chart.update();
          }
        }
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve revenue report.');
      }
    })
    if (this.filter === 'year') {
      this.totalRevenue = 0;
      this.lineChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.lineChartData.datasets[0].data = Array(12).fill(0);
    }
    if (this.filter === 'month') {

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      this.totalRevenue = 0;
      this.lineChartData.labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
      this.lineChartData.datasets[0].data = Array(daysInMonth).fill(0);

    }
    if (this.filter === 'date') {
      this.totalRevenue = 0;
      this.lineChartData.labels = [];
      this.lineChartData.datasets[0].data = [];
    }
  }

}

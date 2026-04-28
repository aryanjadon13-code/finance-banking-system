import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.html',
  styleUrls: ['./chart.css'],
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartRef!: ElementRef;
  @Input() transactions: any[] = [];

  private chart: any;

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions'] && this.chart) {
      this.updateChartData();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart() {
    if (!this.chartRef) return;
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Expenses', // 👈 MOVED TO FIRST POSITION
            data: [],
            backgroundColor: '#ef4444',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 15, // 👈 FIXED THICKNESS
          },
          {
            label: 'Income',
            data: [],
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: '#9ca3af' } },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
          },
          x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
        },
      },
    });

    if (this.transactions && this.transactions.length > 0) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.chart) return;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const now = new Date();
    const last6Months: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        label: months[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expenses: 0,
      });
    }

    this.transactions.forEach((t) => {
      let tYear: number, tMonth: number;
      try {
        const parts = t.date.split('-');
        tYear = parseInt(parts[0], 10);
        tMonth = parseInt(parts[1], 10) - 1;
      } catch (e) {
        return;
      }

      const amount = Math.abs(Number(t.amount) || 0);
      const type = String(t.type || '')
        .toLowerCase()
        .trim();
      const slot = last6Months.find((s) => s.month === tMonth && s.year === tYear);

      if (slot) {
        if (type === 'credit') slot.income += amount;
        else if (type === 'debit') slot.expenses += amount;
      }
    });

    this.chart.data.labels = last6Months.map((s) => s.label);
    this.chart.data.datasets[0].data = last6Months.map((s) => s.expenses); // Index 0 is now Expenses
    this.chart.data.datasets[1].data = last6Months.map((s) => s.income); // Index 1 is now Income

    this.chart.update();
  }
}

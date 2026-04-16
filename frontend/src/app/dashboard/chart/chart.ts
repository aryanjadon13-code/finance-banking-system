import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.html',
  styleUrls: ['./chart.css']
})
export class ChartComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartRef!: ElementRef;

 ngAfterViewInit() {
  if (!this.chartRef) return;   // 👈 safety

  const ctx = this.chartRef.nativeElement.getContext('2d');

  if (!ctx) return;             // 👈 safety

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
        {
          label: 'Income',
          data: [20000, 30000, 25000, 40000, 35000, 45000],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Expenses',
          data: [15000, 20000, 18000, 22000, 21000, 25000],
          backgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
 }
}
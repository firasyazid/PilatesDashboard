import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill
} from "ng-apexcharts";
import { UserService, MonthPercentage,WeeklyBooking  } from 'src/app/services/userService';

export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart | any;
  dataLabels?: ApexDataLabels | any;
  plotOptions?: ApexPlotOptions | any;
  yaxis?: ApexYAxis | any;
  xaxis?: ApexXAxis | any;
  fill?: ApexFill | any;
  title?: ApexTitleSubtitle | any;
};

@Component({
  selector: 'app-column-data-labels',
  templateUrl: './column-data-labels.component.html',
  styleUrls: ['./column-data-labels.component.css']
})
export class ColumnDataLabelsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  expirationStats: MonthPercentage[] = [];

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val.toString(),
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: [],
        position: "top",
        labels: { offsetY: -18 },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (val: any) => val.toString()
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          opacityFrom: 1,
          opacityTo: 1
        }
      },
     
      title: {
        text: "Réservations Hebdomadaires par Type de Cours",
        offsetY: 330,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
  }

  ngOnInit(): void {
    this.userService.getWeeklyBookings().subscribe(
      (data: WeeklyBooking[]) => {
        this.updateChartOptions(data);
      },
      (error) => {
        console.error('Error fetching weekly bookings', error);
      }
    );
  }

  updateChartOptions(data: WeeklyBooking[]) {
    // Prepare data for chart
    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    
    // Organize data by course type
    const courses = [...new Set(data.map(item => item.courseName))];
    const dayIndices = daysOfWeek.reduce((acc, day, index) => {
      acc[day] = index;
      return acc;
    }, {} as { [key: string]: number });

    const seriesData = courses.map(course => {
      const dataByDay = new Array(7).fill(0); // Array to hold bookings per day
      data.forEach(item => {
        if (item.courseName === course) {
          dataByDay[dayIndices[item.dayOfWeek]] = item.totalBookings;
        }
      });
      return {
        name: course,
        data: dataByDay
      };
    });

    this.chartOptions = {
      ...this.chartOptions,
      series: seriesData,
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: daysOfWeek
      }
    };
  }
}

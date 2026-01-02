import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { Tag } from 'primeng/tag';
import { PrimeNG } from 'primeng/config';

interface StatWidget {
    title: string;
    value: string;
    icon: string;
    trend: string;
    trendUp: boolean;
    iconBg: string;
    iconColor: string;
}

interface Order {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: 'Delivered' | 'Pending' | 'Cancelled' | 'Processing';
    date: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TranslateModule, Card, TableModule, ChartModule, Tag],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
    private primeng = inject(PrimeNG);

    // Statistic widgets data
    stats: StatWidget[] = [
        {
            title: 'DASHBOARD.STATS.USERS',
            value: '24,521',
            icon: 'pi pi-users',
            trend: '+12.5%',
            trendUp: true,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'DASHBOARD.STATS.REVENUE',
            value: '$48,352',
            icon: 'pi pi-dollar',
            trend: '+8.2%',
            trendUp: true,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'DASHBOARD.STATS.ORDERS',
            value: '1,432',
            icon: 'pi pi-shopping-cart',
            trend: '+5.4%',
            trendUp: true,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'DASHBOARD.STATS.GROWTH',
            value: '23.8%',
            icon: 'pi pi-chart-line',
            trend: '-2.1%',
            trendUp: false,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
    ];

    // Line chart data
    lineChartData: any;
    lineChartOptions: any;

    // Doughnut chart data
    doughnutChartData: any;
    doughnutChartOptions: any;

    // Recent orders table data
    orders: Order[] = [
        { id: 'ORD-001', customer: 'John Smith', product: 'MacBook Pro 16"', amount: 2499, status: 'Delivered', date: '2024-12-28' },
        { id: 'ORD-002', customer: 'Sarah Johnson', product: 'iPhone 15 Pro', amount: 1199, status: 'Processing', date: '2024-12-29' },
        { id: 'ORD-003', customer: 'Mike Brown', product: 'AirPods Pro', amount: 249, status: 'Pending', date: '2024-12-29' },
        { id: 'ORD-004', customer: 'Emily Davis', product: 'iPad Air', amount: 799, status: 'Delivered', date: '2024-12-27' },
        { id: 'ORD-005', customer: 'Chris Wilson', product: 'Apple Watch Ultra', amount: 799, status: 'Cancelled', date: '2024-12-26' },
        { id: 'ORD-006', customer: 'Anna Martinez', product: 'MacBook Air M3', amount: 1299, status: 'Processing', date: '2024-12-30' },
        { id: 'ORD-007', customer: 'James Taylor', product: 'Magic Keyboard', amount: 299, status: 'Delivered', date: '2024-12-25' },
        { id: 'ORD-008', customer: 'Lisa Anderson', product: 'Studio Display', amount: 1599, status: 'Pending', date: '2024-12-30' },
    ];

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

        // Line Chart Configuration
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Sales',
                    data: [28000, 35000, 42000, 38000, 52000, 48000, 61000, 55000, 72000, 68000, 85000, 92000],
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: '#6366f1',
                    tension: 0.4,
                },
                {
                    label: 'Expenses',
                    data: [15000, 18000, 22000, 20000, 25000, 23000, 28000, 26000, 32000, 30000, 38000, 42000],
                    fill: true,
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    tension: 0.4,
                },
            ],
        };

        this.lineChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                },
            },
        };

        // Doughnut Chart Configuration
        this.doughnutChartData = {
            labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
            datasets: [
                {
                    data: [540, 325, 280, 190, 125],
                    backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'],
                    hoverBackgroundColor: ['#4f46e5', '#16a34a', '#d97706', '#db2777', '#0891b2'],
                },
            ],
        };

        this.doughnutChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                    position: 'bottom',
                },
            },
        };
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Processing':
                return 'info';
            case 'Pending':
                return 'warn';
            case 'Cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}

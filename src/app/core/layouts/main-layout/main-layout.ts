import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../components/header/header";
import { Sidebar } from "../components/sidebar/sidebar";


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarOpen.set(!collapsed);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
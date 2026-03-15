import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);

  onSidebarToggle(open: boolean) {
    this.sidebarOpen.set(open);
  }

  onCollapseToggle(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebarOverlay() {
    this.sidebarOpen.set(false);
  }
}
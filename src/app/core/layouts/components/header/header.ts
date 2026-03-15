import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { APP_ROUTES } from '@core/constants/app-routes-constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, merge, startWith } from 'rxjs';

const ROUTE_LABEL_KEYS: Record<string, string> = {
  [APP_ROUTES.USERS]: 'users.title',
  [APP_ROUTES.ABOUT_SYSTEM]: 'sidebar.menu.about_system',
  [APP_ROUTES.FORBIDDEN]: 'forbidden.title',
  [APP_ROUTES.NOT_FOUND]: 'not_found.title',
  dashboard: 'dashboard.title',
  settings: 'sidebar.menu.settings',
  general: 'sidebar.menu.general',
  'sms-templates': 'sidebar.menu.sms_templates',
  'change-password': 'sidebar.menu.change_password',
};


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  menuToggle = output<void>();

  currentPageTitle = signal('');

  ngOnInit() {
    merge(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
      this.translate.onLangChange.pipe(map(() => null)),
    )
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateHeaderTitle();
      });
  }

  toggleSidebar() {
    this.menuToggle.emit();
  }

  private updateHeaderTitle() {
    const activeRoute = this.getDeepestActivatedRoute();
    const routeTitle = activeRoute ? this.resolveRouteLabel(activeRoute) : '';
    this.currentPageTitle.set(routeTitle || this.translate.instant('header.home'));
  }

  private getDeepestActivatedRoute(): ActivatedRouteSnapshot | null {
    let deepest: ActivatedRouteSnapshot | null = null;
    let current = this.activatedRoute.snapshot.root;

    while (current.firstChild) {
      current = current.firstChild;
      if (current.routeConfig?.path !== '**') {
        deepest = current;
      }
    }

    return deepest;
  }

  private resolveRouteLabel(route: ActivatedRouteSnapshot): string {
    const dataLabelKey = route.data['breadcrumb'];
    if (typeof dataLabelKey === 'string' && dataLabelKey.length > 0) {
      return this.translate.instant(dataLabelKey);
    }

    const segment = route.url.at(-1)?.path ?? route.routeConfig?.path?.split('/').at(-1) ?? '';
    if (!segment || segment.startsWith(':')) {
      return '';
    }

    const mappedKey = ROUTE_LABEL_KEYS[segment];
    if (mappedKey) {
      return this.translate.instant(mappedKey);
    }

    return segment
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

}

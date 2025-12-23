import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { Timeline } from 'primeng/timeline';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-about-us',
  imports: [Card, TranslateModule, Timeline, Avatar, Button, Divider],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  statistics: Statistic[] = [
    { value: '10+', label: 'ABOUT_US.STATS.YEARS', icon: 'pi pi-calendar' },
    { value: '500+', label: 'ABOUT_US.STATS.PROJECTS', icon: 'pi pi-briefcase' },
    { value: '50+', label: 'ABOUT_US.STATS.TEAM', icon: 'pi pi-users' },
    { value: '100+', label: 'ABOUT_US.STATS.CLIENTS', icon: 'pi pi-heart' },
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'ABOUT_US.TEAM.MEMBER1.NAME',
      role: 'ABOUT_US.TEAM.MEMBER1.ROLE',
      bio: 'ABOUT_US.TEAM.MEMBER1.BIO',
      initials: 'JD',
      color: '#6366f1',
    },
    {
      name: 'ABOUT_US.TEAM.MEMBER2.NAME',
      role: 'ABOUT_US.TEAM.MEMBER2.ROLE',
      bio: 'ABOUT_US.TEAM.MEMBER2.BIO',
      initials: 'SM',
      color: '#8b5cf6',
    },
    {
      name: 'ABOUT_US.TEAM.MEMBER3.NAME',
      role: 'ABOUT_US.TEAM.MEMBER3.ROLE',
      bio: 'ABOUT_US.TEAM.MEMBER3.BIO',
      initials: 'AK',
      color: '#ec4899',
    },
    {
      name: 'ABOUT_US.TEAM.MEMBER4.NAME',
      role: 'ABOUT_US.TEAM.MEMBER4.ROLE',
      bio: 'ABOUT_US.TEAM.MEMBER4.BIO',
      initials: 'MR',
      color: '#14b8a6',
    },
  ];

  timelineEvents: TimelineEvent[] = [
    {
      year: '2014',
      title: 'ABOUT_US.TIMELINE.EVENT1.TITLE',
      description: 'ABOUT_US.TIMELINE.EVENT1.DESCRIPTION',
      icon: 'pi pi-star',
      color: '#6366f1',
    },
    {
      year: '2016',
      title: 'ABOUT_US.TIMELINE.EVENT2.TITLE',
      description: 'ABOUT_US.TIMELINE.EVENT2.DESCRIPTION',
      icon: 'pi pi-users',
      color: '#8b5cf6',
    },
    {
      year: '2019',
      title: 'ABOUT_US.TIMELINE.EVENT3.TITLE',
      description: 'ABOUT_US.TIMELINE.EVENT3.DESCRIPTION',
      icon: 'pi pi-globe',
      color: '#ec4899',
    },
    {
      year: '2023',
      title: 'ABOUT_US.TIMELINE.EVENT4.TITLE',
      description: 'ABOUT_US.TIMELINE.EVENT4.DESCRIPTION',
      icon: 'pi pi-trophy',
      color: '#14b8a6',
    },
  ];
}

import { Routes } from '@angular/router';
import { LuggageCheckinComponent } from './features/luggage-checkin/luggage-checkin.component';
import { ReportLossComponent } from './features/report-loss/report-loss.component';


export const LUGGAGE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'checkin',
        pathMatch: 'full'
      },
      {
        path: 'checkin',
        component: LuggageCheckinComponent
      },
      {
        path: 'report-loss',
        component: ReportLossComponent
      }
    ]
  }
];

export default LUGGAGE_ROUTES;

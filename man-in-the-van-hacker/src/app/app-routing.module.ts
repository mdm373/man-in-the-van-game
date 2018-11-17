import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HackerGameComponent } from './hacker-game/hacker-game.component';

const routes: Routes = [
  {path: 'hacker-game', component: HackerGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

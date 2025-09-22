import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilModule } from '@/_util/util.module';
import { AgendaComponent } from './agenda/agenda.component';
// import { ActualitesComponent } from './actualites.component';

/**
 * Module représentant la section "Actualités".
 *
 * La section Actualités a pour but de :
 * - Rendre accessible ce qui fait pour l'instant partie du blog ACTN, soit par un simple lien,
 *   soit en transférant / copiant tout ou une partie du contenu du blog.
 * - Rendre plus visible et accessible l'agenda des évènements / formations ACTN, pour l'instant un peu trop
 *   caché / perdu dans le blog.
 *
 * La forme définitive de cette section n'est pas encore établie.
 * Ces informations pourraient être rassemblées sur une page "/actualites" tout comme séparées en deux pages "/actualites" et "/agenda".
 */
@NgModule({
  declarations: [/*ActualitesComponent,*/ AgendaComponent],
  imports: [CommonModule, UtilModule],
  exports: [/*ActualitesComponent,*/ AgendaComponent]
})
export class ActualitesModule {}

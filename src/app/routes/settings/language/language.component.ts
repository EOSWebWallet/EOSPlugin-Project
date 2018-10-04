import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IListItem } from '../../../shared/list/list.interface';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

import { StorageUtils } from '../../../core/storage/storage.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent extends AbstractPageComponent {

  items: IListItem[] = [
    { label: 'routes.settings.language.en', value: 'en', icon: 'icon-en' },
    { label: 'routes.settings.language.de', value: 'de', icon: 'icon-de' },
    { label: 'routes.settings.language.fr', value: 'fr', icon: 'icon-fr' },
    { label: 'routes.settings.language.it', value: 'it', icon: 'icon-it' },
    { label: 'routes.settings.language.sp', value: 'sp', icon: 'icon-sp' },
    { label: 'routes.settings.language.ru', value: 'ru', icon: 'icon-ru' },
  ].map(item => ({ ...item, selected: () => this.isSelected(item.value) }));

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private translate: TranslateService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.language.title',
    });
  }

  onSelect(item: IListItem): void {
    this.translate.use(item.value);
    StorageUtils.setLang(item.value);
  }

  private isSelected(language: string): boolean {
    return language === this.translate.currentLang;
  }
}

import { CONTEXT_MENU_OPTIONS, IContextMenuOptions } from './src/contextMenu.options';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './src/contextMenu.component';
import { ContextMenuItemDirective } from './src/contextMenu.item.directive';
import { ContextMenuService } from './src/contextMenu.service';
import { ContextMenuAttachDirective } from './src/contextMenu.attach.directive';

export * from './src/contextMenu.component';
export * from './src/contextMenu.service';

@NgModule({
  declarations: [
    ContextMenuAttachDirective,
    ContextMenuComponent,
    ContextMenuItemDirective,
  ],
  exports: [
    ContextMenuAttachDirective,
    ContextMenuComponent,
    ContextMenuItemDirective,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ContextMenuService,
  ],
})
export class ContextMenuModule {
  public static forRoot(options: IContextMenuOptions): ModuleWithProviders {
    return {
      ngModule: ContextMenuModule,
      providers: [
        {
          provide: CONTEXT_MENU_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
export default ContextMenuModule;

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContextMenuComponent} from './src/contextMenu.component';
import {ContextMenuItemDirective} from './src/contextMenu.item.component';
import {ContextMenuService} from './src/contextMenu.service';

export * from './src/contextMenu.component';
export * from './src/contextMenu.service';

@NgModule({
  declarations: [
    ContextMenuComponent,
    ContextMenuItemDirective,
  ],
  exports: [
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
export class ContextMenuModule {}
export default ContextMenuModule;

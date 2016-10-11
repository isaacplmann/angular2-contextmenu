import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContextMenuComponent} from './src/contextMenu.component';
import {ContextMenuItemDirective} from './src/contextMenu.item.directive';
import {ContextMenuService} from './src/contextMenu.service';
import {ContextMenuAttachDirective} from './src/contextMenu.attach.directive';

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
export class ContextMenuModule {}
export default ContextMenuModule;

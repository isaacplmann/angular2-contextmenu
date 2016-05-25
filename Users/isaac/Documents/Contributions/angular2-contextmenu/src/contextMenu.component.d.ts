import { ContextMenuService } from './contextMenu.service';
export declare class ContextMenuComponent {
    private _contextMenuService;
    links: any[];
    isShown: boolean;
    item: any;
    private mouseLocation;
    constructor(_contextMenuService: ContextMenuService);
    locationCss: any;
    clickedOutside(): void;
    showMenu(event: MouseEvent, actions: any[], item: any): void;
}

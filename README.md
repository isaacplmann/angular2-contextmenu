# angular2-contextmenu

A context menu built with Angular 2 inspired by [ui.bootstrap.contextMenu](https://github.com/Templarian/ui.bootstrap.contextMenu).  Bootstrap classes are included in the markup, but there is no explicit dependency on Bootstrap. [Demo](http://plnkr.co/edit/wpJXpEh4zNZ4uCxTURx2?p=preview)

## Installation

- `npm install angular2-contextmenu`
- import ContextMenuModule into your app module

## Usage

### Declarative vs. Imperative

With version 0.2.0, there is a new declarative syntax that allows for quite a bit more flexibility and keeps html out of configuration objects.
The older syntax is deprecated and will be removed in version 1.x.  (I have no timeline on when I'll release 1.x, but wanted to give everyone advance warning.)

### Template

```html
<ul>
    <li *ngFor="item in items" (contextmenu)="onContextMenu($event, item)">Right Click: {{item.name}}</li>
</ul>
<context-menu>
  <template context-menu-item (execute)="alert('Hi, ' + $event.item.name)">
    Say hi!
  </template>
  <template context-menu-item let-item (execute)="alert('Bye, ' + $event.item.name)">
    Bye, {{item.name}}
  </template>
</context-menu>
```

### Component Code

```js
import { ContextMenuService } from 'angular2-contextmenu';

@Component({
  ...
})
export class MyContextMenuClass {
  public items = [
      { name: 'John', otherProperty: 'Foo' },
      { name: 'Joe', otherProperty: 'Bar' }
  };

  constructor(private contextMenuService: ContextMenuService) {}

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }
}
```

## Context Menu Items

- Each context menu item is a `<template>` element with the `context-menu-item` attribute directive applied.
- If the `item` object is used in the context menu item template, the `let-item` attribute must be applied to the `<template>` element. 
  ** Note: ** Make sure to use the `item?.property` syntax in the template rather than `item.property` as the item will be initially `undefined`.
- Every context menu item emits `execute` events. The `$event` object is of the form `{ event: MouseEvent, item: any }` where `event` is the mouse click event
  that triggered the execution and `item` is the current item.
- The `enabled` input parameter is optional.  Items are enabled by default.
- Within the template, you have access to any components and variables available in the outer context.

```html
<context-menu>
  <template context-menu-item let-item [enabled]="isItemEnabled(item)" (execute)="alert('Hi, ' + $event.item.name); $event.event.preventDefault();">
    Say hi, {{item?.name}}!  <my-component [attribute]="item"></my-component>
    With access to the outside context: {{ outsideValue }}
  </template>
</context-menu>
```
```js
this.outsideValue = "something";
```

## Custom Styles

The html that is generated for the context menu looks like this:

```html
<div class="dropdown angular2-contextmenu">
  <ul class="dropdown-menu">
    <li>
      <a><!-- the template for each context menu item goes here --></a>
    </li>
  </ul>
</div>
```

You can key off of the `angular2-contextmenu` class to create your own styles.  Note that the `ul.dropdown-menu` will have inline styles applied for `position`, `display`, `left` and `top` so that it will be positioned at the cursor when you right-click.

```css
.angular2-contextmenu .dropdown-menu {
  border: solid 1px chartreuse;
  background-color: darkgreen;
  padding: 0;
}
.angular2-contextmenu li {
  display: block;
  border-top: solid 1px chartreuse;
  text-transform: uppercase;
  text-align: center;
}
.angular2-contextmenu li:first-child {
  border-top:none;
}
.angular2-contextmenu a {
  color:chartreuse;
  display: block;
  padding: 0.5em 1em;
}
.angular2-contextmenu a:hover {
  color:darkgreen;
  background-color:chartreuse;
}
```

## Bootstrap 4

If you're using Bootstrap 4, you can add a `useBootstrap4` attribute to the `context-menu` component in order to get the appropriate class names.  Like this:

```html
<context-menu [useBootstrap4]="true"></context-menu>
```

## Close event emitter

There is a `(close)` output EventEmitter that you can subscribe to for notifications when the context menu closes (either by clicking outside or choosing a menu item).

```html
<context-menu (close)="processContextMenuCloseEvent()"></context-menu>
```

## Deprecated syntax

This alternate, deprecated syntax will continue working until version 1.x.

### Template

```html
<ul>
    <li *ngFor="item in items" (contextmenu)="onContextMenu($event, item)">Right Click: {{item.name}}</li>
</ul>
<context-menu></context-menu>
```

### Component Code

```js
import { ContextMenuService } from 'angular2-contextmenu';

@Component({
  ...
})
export class MyContextMenuClass {
  public items = [
      { name: 'John', otherProperty: 'Foo' },
      { name: 'Joe', otherProperty: 'Bar' }
  };

  constructor(private contextMenuService: ContextMenuService) {}

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      actions: [
        {
          html: (item) => `Say hi!`,
          click: (item) => alert('Hi, ' + item.name)
        },
        {
          html: (item) => `Something else`,
          click: (item) => alert('Or not...')
        },
      ],
      event: $event,
      item: item,
    });
    $event.preventDefault();
  }
}
```

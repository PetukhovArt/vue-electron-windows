import { shallowReactive } from "vue";
import { BrowserWindowConstructorOptions } from "electron";
import { ChildWindowInstance } from "./child-window-instance";

type WindowId = string;

class WindowsManagerRenderer {
  private windows = shallowReactive<Record<WindowId, ChildWindowInstance>>({});

  constructor() {}

  get windowIds() {
    return Object.keys(this.windows);
  }

  createTriggersWindow = (id: string) => {
    this.createWindow(id, {
      // alwaysOnTop: true,
      autoHideMenuBar: true,
      // transparent: true,
      frame: true,
      width: 800,
      height: 800,
      minWidth: 800,
      minHeight: 400,
    });
  };

  getWindow(id: string) {
    const childWindow = this.windows[id];
    if (childWindow) {
      return childWindow.getWindow;
    }
    return null;
  }

  getWindowIsOpen(id: string) {
    const childWindow = this.windows[id];
    if (childWindow) {
      return childWindow.getWindow !== null;
    }
    return false;
  }

  collapseWindow = (id: string) => {
    const childWindow = this.windows[id];
    if (childWindow) {
      childWindow.collapse();
    }
  };

  minimizeWindow = (id: string) => {
    const childWindow = this.windows[id];
    if (childWindow) {
      childWindow.minimize();
    }
  };

  closeWindow = (id: string) => {
    const childWindow = this.windows[id];
    if (childWindow) {
      childWindow.close();
      this.removeWindow(id);
    }
  };

  updateWindowOptions(id: string, options: BrowserWindowConstructorOptions) {
    const childWindow = this.windows[id];
    if (childWindow) {
      childWindow.updateOptions(options);
    }
  }

  private removeWindow(id: string) {
    delete this.windows[id];
  }

  private createWindow = (
    id: string,
    options: BrowserWindowConstructorOptions
  ) => {
    this.windows[id] = new ChildWindowInstance(id, options, () =>
      this.removeWindow(id)
    );
  };
}

export const windowsManagerRenderer = new WindowsManagerRenderer();

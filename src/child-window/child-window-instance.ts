import {shallowRef} from "vue";

import {BrowserWindowConstructorOptions} from "electron";

/**
 * класс создает новое окно и вызывает методы ipc шины
 * отвечает за передачу вызовов от renderer к main
 */
export class ChildWindowInstance {
  private window: Window | null = shallowRef(null);
  private closeHandler: (_unknown: unknown, windowId: string) => void;

  constructor(
    public readonly id: string,
    public options: BrowserWindowConstructorOptions,
    private onClosed: () => void // remove window in window-manager-renderer
  ) {
    this.window = open(
      "about:blank",
      "_blank",
      `config=${btoa(JSON.stringify({ options: options, id: id }))}`
    );

    this.closeHandler = (_, windowId: string) => {
      console.log("closehandler ", windowId);
      if (windowId === id) {
        this.close();
      }
    };
    windowApi.onClosed(this.closeHandler);
  }

  get getWindow() {
    return this.window;
  }

  get isOpen(): boolean {
    return !!this.window?.isVisible();
  }

  close(): void {
    this.window?.close();
    this.onClosed(); // remove window in window-manager-renderer
    windowApi.removeClosed(this.closeHandler);
  }

  collapse(): void {
    if (this.window) {
      windowApi.collapse(this.id);
    }
  }

  minimize(): void {
    if (this.window) {
      windowApi.minimize(this.id);
    }
  }

  maximize(): void {
    if (this.window) {
      windowApi.maximize(this.id);
    }
  }

  updateOptions(options: BrowserWindowConstructorOptions) {
    this.options = options;
    windowApi.updateWindowOptions(this.id, options);
  }
}

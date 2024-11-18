import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  shell,
} from "electron";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";
import HandlerDetails = Electron.HandlerDetails;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preload = path.join(__dirname, "../preload/index.mjs");

type WindowOpen =
  | { action: "deny" }
  | {
      action: "allow";
      outlivesOpener?: boolean;
      overrideBrowserWindowOptions?: BrowserWindowConstructorOptions;
    };

class WindowManagerMainProcess {
  private windows = new Map<string, BrowserWindow>();

  public registerListeners() {
    // ipcMain.handle("create-child", (_event, id, options) => {
    //   this.createWindow(id, options);
    // });
    ipcMain.handle("minimize-child", (_event, id) => {
      this.minimizeWindow(id);
    });
    ipcMain.handle("collapse-child", (_event, id) => {
      this.collapseWindow(id);
    });
    ipcMain.handle("maximize-child", (_event, id) => {
      this.maximizeWindow(id);
    });
    ipcMain.handle("close-child", (_event, id) => {
      this.closeWindow(id);
    });
    ipcMain.handle("update-child-options", (...args) => {
      console.log(args);
    });
  }

  public handleWindowOpen(
    details: HandlerDetails,
    parentWindow: BrowserWindow | null
  ): WindowOpen {
    if (details.url === "about:blank") {
      const { electronWindowOptions, windowId } = this.parseWindowFeatures(
        details.features
      );

      app.once("browser-window-created", (_, newWindow) => {
        this.windows.set(windowId, newWindow);

        newWindow.on("closed", () => {
          parentWindow?.webContents.send("window-closed", windowId);
          this.windows.delete(windowId);
        });
      });

      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          ...electronWindowOptions,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload,
          },
        },
      };
    }
    shell.openExternal(details.url);
    return { action: "deny" };
  }

  public createWindow(
    id: string,
    options: Electron.BrowserWindowConstructorOptions
  ) {
    const win = new BrowserWindow(options);
    this.windows.set(id, win);
    return win;
  }

  public minimizeWindow(id: string) {
    const win = this.windows.get(id);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  }

  public maximizeWindow(id: string) {
    const win = this.windows.get(id);
    if (win) {
      win.maximize();
    }
  }

  public closeWindow(id: string) {
    const win = this.windows.get(id);
    if (win) {
      win.close();
    }
  }

  public collapseWindow(id: string) {
    const window = this.getWindow(id);
    if (window) {
      window.minimize();
    } else {
      console.error(`No window found with ID: ${id}`, window);
    }
  }

  public getWindow(id: string): BrowserWindow | null {
    return this.windows.get(id) || null;
  }

  private parseWindowFeatures(features: string) {
    const parsedFeatures = features
      .split(",")
      .map((item) => item.trim().split("="))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const config = JSON.parse(atob(parsedFeatures["config"]));

    try {
      const { id, options } = z
        .object({ id: z.string(), options: z.record(z.any()) })
        .parse(config);
      return { windowId: id, electronWindowOptions: options };
    } catch (e) {
      console.error(e);
    }
  }
}

export const windowManagerMainProcess = new WindowManagerMainProcess();

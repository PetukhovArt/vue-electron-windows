import {ref, shallowReactive, shallowRef, watchEffect} from 'vue'
import {BrowserWindow, BrowserWindowConstructorOptions, ipcRenderer} from 'electron'
import {windowManagerMainProcess} from "../../electron/main/window-manager-main-process";
import {ChildWindowInstance} from "./child-window-instance";

 type WindowId=string
 class WindowsManagerRenderer{
    private windows = shallowReactive<Record<WindowId,ChildWindowInstance>>({})

    constructor() {}

     private removeWindow(id: string) {
         delete this.windows[id]
     }

     private createWindow =  (id:string,options: BrowserWindowConstructorOptions) => {
         this.windows[id] = new ChildWindowInstance(id, options, () => {
             this.removeWindow(id)
         })
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
             minHeight: 400
         })
     }

     get windowIds() {
         return Object.keys(this.windows)
     }
     getWindow(id: string) {
         const childWindow = this.windows[id]
         if (childWindow) {
             return childWindow.getWindow
         }
         return null
     }
     getWindowIsOpen(id: string) {
         const childWindow = this.windows[id]
         if (childWindow) {
             return childWindow.getWindow !== null
         }
         return false
     }

     collapseWindow = (id: string) => {
         const childWindow = this.windows[id]
         if (childWindow) {
             childWindow.collapse()
         }
     }

     minimizeWindow = (id: string) => {
         const childWindow = this.windows[id]
         if (childWindow) {
             childWindow.minimize()
         }
     }

     closeWindow = (id: string) => {
         const childWindow = this.windows[id]
         if (childWindow) {
             childWindow.close()
             this.removeWindow(id)
         }
     }
     updateWindowOptions(id: string, options: BrowserWindowConstructorOptions) {
         const childWindow = this.windows[id]
         if (childWindow) {
             childWindow.updateOptions(options)
         }
     }
}

export const windowsManagerRenderer = new WindowsManagerRenderer()

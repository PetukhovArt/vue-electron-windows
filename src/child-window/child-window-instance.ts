import { ref, onMounted, onBeforeUnmount } from 'vue'
import {BrowserWindowConstructorOptions} from 'electron'

/**
 * класс создает новое окно и вызывает методы ipc шины
 * отвечает за передачу вызовов от renderer к main
 */
export class ChildWindowInstance {
    private window:Window | null= ref(null)
    private closeHandler: (_unknown:unknown, windowId: string) => void

    constructor(
        public readonly id: string,
        public options: BrowserWindowConstructorOptions,
        private onClosed: () => void
    ) {
        this.window = window.open(
            'about:blank',
            '_blank',
            `config=${btoa(JSON.stringify({ options: options, id: id }))}`
        )

        this.closeHandler = (_, windowId: string) => {
            if (windowId === id) {
                this.close()
            }
        }
        //todo проверить глобальный d.ts для window
        window.windowApi.onClosed(this.closeHandler)
    }

    get getWindow() {
        return this.window
    }

    get isOpen(): boolean {
        return !!this.window?.isVisible()
    }

    close(): void {
        this.window?.close()
        this.onClosed()
        window.windowApi.removeClosed(this.closeHandler)
    }

    collapse(): void {
        if (this.window) {
            window.windowApi.collapse(this.id)
        }
    }

    minimize(): void {
        if (this.window) {
            window.windowApi.minimize(this.id)
        }
    }

    maximize(): void {
        if (this.window) {
            window.windowApi.maximize(this.id)
        }
    }

    updateOptions(options: BrowserWindowConstructorOptions) {
        this.options = options
        // window.windowApi.updateWindowOptions(this.id,options)
    }
}

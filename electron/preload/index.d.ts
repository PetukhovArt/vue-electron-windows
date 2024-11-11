import { BrowserWindowConstructorOptions } from 'electron'

declare global {
    interface Window {
        windowApi: {
            create: (id: string, options: BrowserWindowConstructorOptions) => void
            minimize: (id: string) => void
            maximize: (id: string) => void
            collapse: (id: string) => void
            close: (id: string) => void
            onClosed: (onClose: (_: unknown, id: string) => void) => void,
            removeClosed: (onClose: (_: unknown, id: string) => void) => void // ?
            updateOptions: (id: string, options: BrowserWindowConstructorOptions) => void
        }
    }
}

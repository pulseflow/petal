declare module 'jsdom' {
	interface DOMWindow {
		PulseUtilities: typeof import('../../src');
	}
}

'use client';

type ErrorCallback = (error: any) => void;

class ErrorEmitter {
  private listeners: { [channel: string]: ErrorCallback[] } = {};

  emit(channel: string, error: any) {
    if (this.listeners[channel]) {
      this.listeners[channel].forEach((cb) => cb(error));
    }
  }

  on(channel: string, cb: ErrorCallback) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }
    this.listeners[channel].push(cb);
    return () => {
      this.listeners[channel] = this.listeners[channel].filter((l) => l !== cb);
    };
  }
}

export const errorEmitter = new ErrorEmitter();

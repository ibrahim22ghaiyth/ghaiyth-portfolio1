export default function pino() {
  const noop = () => undefined;
  const logger = {
    trace: noop,
    debug: noop,
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    fatal: (...args) => console.error(...args),
    child: () => logger,
  };
  return logger;
}

export { pino };

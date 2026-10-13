export default function pinoHttp() {
  return (_req, _res, next) => {
    if (typeof next === "function") next();
  };
}

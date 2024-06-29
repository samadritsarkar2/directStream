import { networkInterfaces } from "os";

export const getIPV6Address = () => {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv6 and internal (i.e. 127.0.0.1) addresses
      // 'IPv6' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV6Value = typeof net.family === "string" ? "IPv6" : 6;
      if (net.family === familyV6Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
};

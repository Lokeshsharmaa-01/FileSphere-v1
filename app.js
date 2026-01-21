import http from "node:http";
import { open, readdir } from "fs/promises";
import { readFile } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  const files = await readdir("./storage");
  let dynamicHTML = "";
  const html = await readFile("./index.html", "utf-8");
  files.forEach((item) => {
    dynamicHTML += `<a href=${item}>${item}</a><br>`;
  });
  if (req.url === "/") {
    res.end(html.replace("${dynamicHTML}", dynamicHTML));
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        const files = await readdir(`./storage${req.url}`);
        let dynamicHTML = "";
          const html = await readFile("./index.html", "utf-8");

        files.forEach((item) => {
          dynamicHTML += `<a href=${req.url}/${item}>${item}</a><br>`;
        });
        res.end(html.replace('${dynamicHTML}',dynamicHTML))
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (err) {
      console.log(err.message);
      res.end("not found");
    }
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("server is running on port 4000");
});

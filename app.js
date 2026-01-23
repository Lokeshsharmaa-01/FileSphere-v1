import http from "node:http";
import { open, readdir } from "fs/promises";
import { readFile } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  if(req.url === '/favicon.ico') return res.end('no favicon')
  console.log(req.url);
  
  if (req.url === "/") {
    serveDir(req,res);
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        serveDir(req,res);
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

async function serveDir(req,res){
  const files = await readdir(`./storage${req.url}`);
  let dynamicHTML = "";
  const html = await readFile("./index.html", "utf-8");
  files.forEach((item) => {
    dynamicHTML += `${item}<a href="${req.url === '/' ? "": req.url}/${item}?action=open">Open</a> ${item}<a href="${req.url === '/' ? "": req.url}/${item}?action=download">Download</a><br>`;

  })
  res.end(html.replace('${dynamicHTML}',dynamicHTML))

}

server.listen(4000, "0.0.0.0", () => {
  console.log("server is running on port 4000");
});

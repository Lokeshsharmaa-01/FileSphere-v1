import http from "node:http";
import { open, readdir } from "fs/promises";
import { readFile } from "node:fs/promises";
import mime from 'mime-types'

const server = http.createServer(async (req, res) => {
  if(req.url === '/favicon.ico') return res.end('no favicon')
  console.log(req.url);
  
  if (req.url === "/") {
    serveDir(req,res);
  } else {
    try {
        const [url,queryString] = req.url.split('?')
      const queryParams = {}
      queryString.split('&').forEach((pair) =>{
        const [key,value] = pair.split('=')
        queryParams[key] = value;
      })
      
      const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        serveDir(req,res);
      } else {
        const readStream = fileHandle.createReadStream();
        res.setHeader('Content-Type',mime.contentType(url.slice(1)))
        res.setHeader('Content-Length',stats.size)
        if(queryParams.action === 'download'){
          res.setHeader('Content-Disposition',`attachment;filename = "${url.slice(1)}"`)
      }
        readStream.pipe(res);
      }
    } catch (err) {
      console.log(err.message);
      res.end("not found");
    }
  }
});

async function serveDir(req,res){
  const [url,queryString] = req.url.split('?')
  const files = await readdir(`./storage${req.url}`);
  let dynamicHTML = "";
  const html = await readFile("./index.html", "utf-8");
  files.forEach((item) => {
    dynamicHTML += `${item}<a href="${req.url === '/' ? "": req.url}/${item}?action=open">Open</a><a href="${req.url === '/' ? "": req.url}/${item}?action=download">Download</a><br>`;

  })
  res.end(html.replace('${dynamicHTML}',dynamicHTML))

}

server.listen(4000, "0.0.0.0", () => {
  console.log("server is running on port 4000");
});

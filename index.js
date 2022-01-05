const http = require('http');
const util = require('util');

const Formidable = require('formidable');
const cloudinary = require("cloudinary");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

cloudinary.v2.config({
    cloud_name: 'your cloud name',
    api_key: 'your api key',
    api_secret: 'your api secret key'
});

http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        const form = new Formidable();

        form.parse(req, (err, fields, files) => {
            cloudinary.v2.uploader.upload(files.upload.path,{public_id: "your_upload_directory_path",resource_type:'raw'}, (error,result) => {
                console.log(result, error)
                if (result.api_key) {
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.write('received upload:\n\n');
                    res.end(util.inspect({ fields: fields, files: files }));
                }
            }
            );
        });
        return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);

}).listen(3000);

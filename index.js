const http = require('http');
const util = require('util');

// https://github.com/node-formidable/node-formidable
const Formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0


cloudinary.v2.config({
    cloud_name: 'dslulgxns',
    api_key: '158311774626561',
    api_secret: 'GqK3h-f4stYf_4GRXFuDsM_heZE'
});

//Create a server
http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        // parse a file upload
        const form = new Formidable();


        form.parse(req, (err, fields, files) => {

            //https://cloudinary.com/documentation/upload_images
            cloudinary.v2.uploader.upload(files.upload.path,{public_id: "Assets/PDF/razaresume11.pdf",resource_type:'raw'}, (error,result) => {

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

    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);

}).listen(3000);

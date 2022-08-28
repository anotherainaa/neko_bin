const express = require ('express');
const router = express.Router();

const { db } = require('../lib/db-query');
const { findRequests, createRequest } = require('../mongo');

// Crypto for creating a random URL hash
const crypto = require('crypto');

router.get('/', (request, response) => {
  db.any("SELECT * FROM bins")
    .then(bins =>
      response.render('allbins', { bins: bins })
    )
});

router.get('/:binsUrl', (request, response) => {
  const binsUrl = request.params.binsUrl;

  db.any(`SELECT r.*, b.date_created FROM requests r JOIN bins b ON b.id = r.bin_id WHERE b.url = '${binsUrl}'`)
    .then(requests => {
        // for each request, find all the corresponding payload for it 
        const binId = requests[0] ? requests[0].bin_id : null;

        if (binId !== null) {
          findRequests(binId).then(payloads => {
            requests.map((request, index) => {
              request.payload = payloads[index] ? payloads[index].payLoad : null;
              request.headers = JSON.parse(request.headers);
            })
  
            const binCreatedAt = requests[0] ? requests[0].date_created : null
            response.render('singlebin', {created_at: binCreatedAt, requests: requests})
          })
        } else {
          const binCreatedAt = requests[0] ? requests[0].date_created : null
          response.render('singlebin', {created_at: binCreatedAt, requests: requests})
        }
    })
})

// Creates a new bin and redirects to the new bin

router.post('/', (request, response) => {
  const urlHash = crypto.randomBytes(20).toString('hex');

  db.any(`INSERT INTO bins (url, date_created)\
    VALUES ('${urlHash}', now());`)

  response.redirect(`/bins/${urlHash}`);

})


// Capturing webhook requests into the bin

router.post('/:binsUrl', (request, response) => {
  const binsUrl = request.params.binsUrl;
  // console.log('Hello a webhook arrived!');

  const contentType = request.get('content-type');
  const contentLength = request.get('content-length');
  const httpMethod = request.method;
  const ipAddress = request.get('x-forwarded-for');

  // console.log("request body", request.body)
  
  const payload = JSON.stringify(request.body) || JSON.stringify({"body":""});

  db.any(`SELECT id FROM bins WHERE url = '${binsUrl}'`)
    .then(id => {
        const binId = id[0].id;
        db.any(`INSERT INTO requests\
          (bin_id, ip_address, request_method, headers, received_at, content_type, content_length)\
          VALUES\
          (${binId}, '${ipAddress}', '${httpMethod}', '${JSON.stringify(request.headers)}', now(), '${contentType}', ${contentLength});`)
          .then(result => {
            createRequest(binId, payload) // mongo
          });
  })


  response.status(200).end()
})

module.exports = router;
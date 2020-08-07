const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use((req, res, next) => {
		if (process.env.NODE_ENV === 'production') {
				// if (req.headers.host === 'your-app.herokuapp.com')
				//     return res.redirect(301, 'https://www.your-custom-domain.com');
				if (!req.secure) {
					return res.redirect('https://' + req.headers.host + req.url);
				}
		}

		return next();
});

app.get('/privacy', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/privacy.html'))
})

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)

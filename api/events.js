{
  "version": 2,
  "builds": [
    { "src": "public/index.html", "use": "@vercel/static" },
    { "src": "api/events.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/events", "dest": "/api/events.js" },
    { "src": "/(.*)", "dest": "/public/index.html" }
  ]
}

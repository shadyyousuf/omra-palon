import app from './dist/server/server.js'

try {
  console.log('App is:', app)
  app({}, {})
} catch (e) {
  console.error("ERROR:", e.message)
}

// Runs a local Postgres server for development, so you don't need a cloud database
// on your own machine. Data is kept in ./.localdb (git-ignored).
// Usage: npm run db  (leave it running), then in .env:
//   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:54341/cofwo
import EmbeddedPostgres from 'embedded-postgres'
import fs from 'node:fs'
import path from 'node:path'

const dataDir = path.resolve('.localdb')
const port = 54341
const firstRun = !fs.existsSync(path.join(dataDir, 'PG_VERSION'))

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port,
  persistent: true,
  // Windows would otherwise create the database in WIN1252, which can't store all characters.
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  onLog: () => {},
  onError: (e) => console.error(String(e?.message ?? e)),
})

if (firstRun) await pg.initialise()
await pg.start()

const client = pg.getPgClient()
await client.connect()
const { rows } = await client.query("SELECT 1 FROM pg_database WHERE datname = 'cofwo'")
if (rows.length === 0) {
  await client.query("CREATE DATABASE cofwo ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0")
}
await client.end()

console.log(`Local Postgres running: postgres://postgres:postgres@127.0.0.1:${port}/cofwo`)
console.log('Press Ctrl+C to stop.')

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
setInterval(() => {}, 1 << 30)

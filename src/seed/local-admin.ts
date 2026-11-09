/** Creates a local test admin from LOCAL_ADMIN_EMAIL / LOCAL_ADMIN_PASSWORD in .env (development only). */
import config from '@payload-config'
import { getPayload } from 'payload'

const email = process.env.LOCAL_ADMIN_EMAIL
const password = process.env.LOCAL_ADMIN_PASSWORD
if (!email || !password) throw new Error('Set LOCAL_ADMIN_EMAIL and LOCAL_ADMIN_PASSWORD in .env first.')
if (process.env.VERCEL) throw new Error('This script is for local development only.')

const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (existing.docs[0]) {
  await payload.update({ collection: 'users', id: existing.docs[0].id, data: { password } })
  payload.logger.info(`Updated password for ${email}`)
} else {
  await payload.create({ collection: 'users', data: { email, password, name: 'Local Admin', roles: ['admin'] } })
  payload.logger.info(`Created ${email}`)
}
process.exit(0)

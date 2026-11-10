/**
 * Imports the content of the previous static website (in /legacy) into the admin.
 *
 *   npm run seed            only runs on an empty site
 *   npm run seed:reset deletes existing content (not messages, subscribers or users) and imports again
 *
 * Needs DATABASE_URL (and the S3_* bucket settings when importing into the live site).
 */
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'
import { getPayload, type Payload } from 'payload'

const LEGACY = path.resolve(process.cwd(), 'legacy')
const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1'
const ctx = { disableRevalidate: true }
const GATHERING_URL = 'https://thegatheringcof.org/'

const read = (rel: string) => fs.readFileSync(path.join(LEGACY, rel), 'utf8')
const dom = (rel: string) => new JSDOM(read(rel)).window.document

async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const rich = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM }) as never
  const paras = (...p: string[]) => rich(p.map((t) => `<p>${t}</p>`).join(''))

  const existing = await payload.count({ collection: 'posts' })
  if (existing.totalDocs > 0 && !force) {
    payload.logger.info('Content already exists. Run "npm run seed:reset" to replace it.')
    process.exit(0)
  }
  if (force) {
    for (const collection of ['posts', 'categories', 'pages', 'events', 'testimonies', 'albums', 'media'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
    }
    payload.logger.info('Removed existing content.')
  }

  /* ---------- Alt text for every legacy photo, gathered from all old pages ---------- */
  const altFor = new Map<string, string>()
  const htmlFiles = fs
    .readdirSync(LEGACY, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.html'))
  for (const f of htmlFiles) {
    for (const img of Array.from(dom(f).querySelectorAll('img'))) {
      const src = img.getAttribute('src') ?? ''
      const alt = img.getAttribute('alt')?.trim()
      if (src && alt && !altFor.has(src)) altFor.set(src, alt)
    }
  }

  /* ---------- Upload photos once each ---------- */
  const uploaded = new Map<string, number>()
  const media = async (src: string, alt?: string): Promise<number> => {
    const key = src.startsWith('/') ? src : `/${src}`
    if (uploaded.has(key)) return uploaded.get(key)!
    const filePath = path.join(LEGACY, key)
    if (!fs.existsSync(filePath)) throw new Error(`Missing legacy file ${filePath}`)
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt || altFor.get(key) || 'Photo from The Chariot of Fire World Outreach' },
      filePath,
      context: ctx,
    })
    uploaded.set(key, doc.id)
    payload.logger.info(`Uploaded ${key}`)
    return doc.id
  }
  const img = (name: string) => media(`/assets/images/${name}`)

  /* ---------- Categories ---------- */
  const faith = await payload.create({
    collection: 'categories',
    data: { title: 'Faith', slug: 'faith-2', description: 'Teaching on faith, purpose and the victorious Christian life.' },
    context: ctx,
  })

  /* ---------- Blog posts ---------- */
  const postFolders = [
    'understanding-gods-purpose-for-your-life-a-guide-to-divine-direction',
    'faith-vision-and-victory-living-a-victorious-christian-life',
    'its-your-time-to-shine',
  ]
  for (const [i, slug] of postFolders.entries()) {
    const d = dom(`${slug}/index.html`)
    const title = d.querySelector('h1')?.textContent?.trim() ?? slug
    const excerpt = d.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
    const date = d.querySelector('time')?.getAttribute('datetime') ?? '2026-03-28'
    const heroSrc = d.querySelector('.page-hero__bg img')?.getAttribute('src')
    const html = d.querySelector('.prose')?.innerHTML ?? ''
    await payload.create({
      collection: 'posts',
      data: {
        title,
        slug,
        excerpt,
        heroImage: heroSrc ? await media(heroSrc) : undefined,
        content: rich(html),
        categories: [faith.id],
        // Same date on the old site; stagger the time so the order stays stable.
        publishedAt: new Date(`${date}T12:0${i}:00Z`).toISOString(),
        authorName: 'The COFWO Team',
        _status: 'published',
      },
      context: ctx,
    })
    payload.logger.info(`Imported post: ${title}`)
  }

  /* ---------- Privacy policy ---------- */
  {
    const d = dom('privacy-policy/index.html')
    const body = d.querySelector('main .prose')!
    // The new site stores form entries in its own database instead of Web3Forms.
    body.querySelectorAll('li').forEach((li) => {
      if (li.textContent?.includes('Web3Forms')) {
        li.innerHTML =
          '<strong>Our website database</strong> stores contact messages and newsletter signups so our ministry team can respond. Only authorised COFWO staff can see them.'
      }
      if (li.textContent?.toLowerCase().includes('website host')) {
        li.innerHTML =
          'Our <strong>website host (Vercel)</strong> may keep standard server logs (such as IP address, browser type and pages requested) for security and to keep the site running.'
      }
    })
    body.querySelectorAll('p,li').forEach((el) => {
      if (el.innerHTML.includes('Web3Forms')) el.innerHTML = el.innerHTML.replace(/Web3Forms/g, 'our website')
    })
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        intro: d.querySelector('.page-hero p')?.textContent?.trim(),
        content: rich(body.innerHTML),
        showInFooter: true,
        _status: 'published',
      },
      context: ctx,
    })
  }

  /* ---------- Gallery album ---------- */
  const galleryImgs = Array.from(dom('gallery/index.html').querySelectorAll('main img'))
    .map((i) => i.getAttribute('src')!)
    .filter((s) => s?.startsWith('/assets/') && !s.includes('logo'))
  const galleryIds: number[] = []
  for (const src of galleryImgs) galleryIds.push(await media(src))
  await payload.create({
    collection: 'albums',
    data: {
      title: 'Moments of ministry',
      slug: 'moments-of-ministry',
      description: 'Worship, prayer, fellowship and outreach from across the ministry.',
      photos: galleryIds,
      order: 0,
      _status: 'published',
    },
    context: ctx,
  })

  /* ---------- Testimonies (hidden until the ministry confirms them) ---------- */
  const testimonies = [
    {
      type: 'Salvation',
      name: 'Sandra Phillips',
      location: 'Memphis, TN',
      quote:
        'I came to this church at a time when my life had no direction and I was far from God. Through the Word, prayers, and the prophetic messages, my life completely changed. I gave my life to Christ, and today I have peace, purpose, and a new beginning. God truly sets captives free in this place.',
    },
    {
      type: 'Healing',
      name: 'Oliver Brooks',
      location: 'Austin, TX',
      quote:
        'I had been battling severe pain in my body for a long time and nothing seemed to work. During one of the services, prayers were made and I received my healing. The pain disappeared and has never returned. God is truly moving in this church.',
    },
    {
      type: 'Direction and prophecy',
      name: 'Janet Morrison',
      location: 'Seattle, WA',
      quote:
        'I was confused about my next step in life and everything seemed unclear. Through the prophetic ministry in this church, God gave me direction and clarity. I followed the instruction and today I can clearly see God’s hand in my life.',
    },
  ]
  for (const [order, t] of testimonies.entries()) {
    await payload.create({ collection: 'testimonies', data: { ...t, order, show: false }, context: ctx })
  }

  /* ---------- Site settings ---------- */
  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx,
    data: {
      siteName: 'The Chariot of Fire World Outreach',
      shortName: 'COFWO',
      tagline: 'Setting captives free by the Spirit of Prophecy',
      logoLight: await img('cofwo-logo-white.png'),
      logoDark: await img('cofwo-logo.png'),
      email: 'info@thecofwo.org',
      notifyEmail: 'info@thecofwo.org',
      pillarsHeading: 'Our Mission, Goal & Vision',
      pillars: [
        {
          title: 'Our Mission',
          statement: 'Setting captives free by the Spirit of Prophecy.',
          body: 'Our mission is to bring deliverance, healing, and restoration through the power of the Holy Spirit, raising people who hear God clearly and walk in spiritual authority and freedom in Christ.',
        },
        {
          title: 'Our Goal',
          statement: 'To see lives, people, cities and nations touched by the fire of the Holy Spirit.',
          body: 'Our goal is to spread revival and transformation across communities and nations, igniting hearts with passion for God and empowering believers to live a life of purpose, power, and holiness.',
        },
        {
          title: 'Our Vision',
          statement: 'To see the move of the Spirit in all lives and nations of the world.',
          body: 'Our vision is a global revival where the presence and power of God transform individuals, families, cities, and nations, raising burning and shining lights for Christ across the world.',
        },
      ],
      ticker: 'Jesus is Lord',
      announcementOn: false,
      ogImage: await img('Slider.jpg'),
    },
  })

  /* ---------- Menus ---------- */
  await payload.updateGlobal({
    slug: 'navigation',
    context: ctx,
    data: {
      header: [
        { label: 'About Us', url: '/about-us' },
        { label: 'The Gathering 2026', url: GATHERING_URL, newTab: true },
        { label: 'COFWO Blog', url: '/cofwo-blog' },
        { label: 'Gallery', url: '/gallery' },
        { label: 'Contact Us', url: '/contact-us' },
      ],
      headerCta: { label: 'Give', url: '/give' },
      footerGroups: [
        {
          title: 'Explore',
          links: [
            { label: 'About Us', url: '/about-us' },
            { label: 'COFWO Blog', url: '/cofwo-blog' },
            { label: 'Gallery', url: '/gallery' },
            { label: 'Events', url: '/events' },
            { label: 'Give', url: '/give' },
            { label: 'The Gathering', url: GATHERING_URL, newTab: true },
          ],
        },
      ],
    },
  })

  /* ---------- Homepage ---------- */
  const homeGallery = galleryImgs.slice(0, 8)
  await payload.updateGlobal({
    slug: 'home-page',
    context: ctx,
    data: {
      hero: {
        eyebrow: 'Experience the delivering power of the Holy Spirit',
        heading: 'Set free by the Spirit of Prophecy',
        highlight: 'Spirit of Prophecy',
        subheading: 'Encounter the fire of God’s love and power.',
        image: await img('Slider.jpg'),
        primary: { label: 'Discover COFWO', url: '/about-us' },
        slides: [
          {
            image: await img('swi-5787-scaled-1.jpg'),
            heading: 'Igniting hearts, transforming nations',
            highlight: 'transforming nations',
            link: { label: 'Discover COFWO', url: '/about-us' },
          },
          {
            image: await img('gallery/FB_IMG_1774528902691.jpg'),
            heading: 'Encounter the fire of God’s love and power',
            highlight: 'fire',
            subheading: 'Need prayer?',
            link: { label: 'Send a prayer request', url: '/contact-us' },
          },
          { image: await img('slide-2cofwo.jpg') },
        ],
      },
      welcome: {
        heading: 'Igniting hearts, transforming nations',
        body: paras(
          'The Chariot of Fire World Outreach (COFWO) is a dynamic ministry dedicated to carrying the fire of God’s love, power, and salvation to the ends of the earth.',
          'We believe in a present, active, and powerful God whose Spirit is moving mightily in our generation. Our mission is to champion this move, equip the saints, and see lives transformed by the glory of God.',
        ),
        images: [await img('swi-5719-scaled-1.jpg'), await img('swi-5791-scaled-1.jpg')],
        link: { label: 'More about COFWO', url: '/about-us' },
      },
      gathering: {
        eyebrow: 'Our annual event',
        heading: 'The Gathering',
        body: paras(
          'Experience the unforgettable highlights from The Gathering, our annual COFWO event that unites believers from across the nation and beyond. Relive the powerful worship moments, life-changing encounters, and transformational messages that stirred hearts and strengthened faith.',
          'This yearly gathering draws worshippers into a weekend of deep spiritual renewal, fellowship, and divine encounter, an atmosphere where God moves, lives are lifted, and destinies are realigned.',
        ),
        images: [await img('swi-5706-scaled-1.jpg'), await img('swi-5787-scaled-1.jpg'), await img('swi-5750-scaled-1.jpg')],
        link: { label: 'Visit The Gathering', url: GATHERING_URL, newTab: true },
      },
      visit: {
        heading: 'Join us',
        body: 'Come as you are. Whether it is your first time or you have walked with God for years, there is a place for you here.',
        image: await img('gallery/FB_IMG_1774529411035.jpg'),
      },
      connect: {
        heading: 'Need prayer?',
        body: 'Tell us what you are facing. Our prayer team will stand with you in faith and keep your request private.',
        image: await img('gallery/FB_IMG_1774529725322.jpg'),
        link: { label: 'Send a prayer request', url: '/contact-us' },
      },
      sermonsSection: { heading: 'Latest message', show: true },
      testimoniesSection: { eyebrow: 'Testimonies', heading: 'Life-changing testimonies', show: true },
      eventsSection: { heading: 'Upcoming events', show: true },
      blogSection: { heading: 'Insights from God’s Word' },
      gallerySection: { heading: 'Moments of ministry', images: await Promise.all(homeGallery.map((s) => media(s))) },
      closing: {
        heading: 'Our doors are open',
        body: 'Whether you seek prayer, guidance, or simply wish to learn more about our community, our doors and hearts are always open.',
        image: await img('slide-2cofwo.jpg'),
        primary: { label: 'Contact us', url: '/contact-us' },
        secondary: { label: 'Read the blog', url: '/cofwo-blog' },
      },
    },
  })

  /* ---------- About page ---------- */
  const aboutStrip = [
    'FB_IMG_1774528902691.jpg',
    'swi-5706-scaled-1.jpg',
    'swi-5791-scaled-1.jpg',
    'swi-5750-scaled-1.jpg',
    'midcrowd.jpg',
    'FB_IMG_1774529296960.jpg',
    'FB_IMG_1774528913284.jpg',
    'swi-5787-scaled-1.jpg',
  ]
  await payload.updateGlobal({
    slug: 'about-page',
    context: ctx,
    data: {
      banner: {
        title: 'About Us',
        intro: 'A vibrant, Spirit-led Christian ministry committed to spreading the message of Jesus Christ across the world.',
        image: await img('about-second.jpg'),
      },
      story: {
        eyebrow: 'Our story',
        heading: 'Carriers of God’s fire',
        body: paras(
          'Chariot of Fire World Outreach (COFWO) is a vibrant, Spirit-led Christian ministry committed to spreading the message of Jesus Christ across the world, transforming lives through the power of the Holy Spirit, and raising a generation of believers equipped to manifest God’s glory in every area of life.',
          'Born out of a divine mandate to ignite revival and restore destinies, COFWO serves as a vessel of transformation, touching lives, empowering believers, and proclaiming the gospel with passion and purpose. We believe that every individual is called to be a carrier of God’s fire and an instrument of change in their generation.',
        ),
        images: [await img('cofwopst.jpg'), await img('slide-2cofwo.jpg')],
      },
      passion: {
        heading: 'Our passion',
        body: paras(
          'We are consumed with a passion to see the fire of God rekindled in this generation, through fervent prayer, deep worship, the teaching of God’s Word, and the demonstration of His power. Our values burn brightly as the flame that guides our conduct, ministry, and service to humanity.',
        ),
        image: await img('midcrowd.jpg'),
        link: { label: 'Connect with us', url: '/contact-us' },
      },
      gallery: { heading: 'Moments of ministry', images: await Promise.all(aboutStrip.map((n) => img(n))) },
    },
  })

  /* ---------- Give page ---------- */
  await payload.updateGlobal({
    slug: 'give-page',
    context: ctx,
    data: {
      banner: {
        title: 'Give',
        intro: 'Partner with The Chariot of Fire World Outreach as we carry the fire of God’s love, power, and salvation to the ends of the earth.',
        image: await img('swi-5787-scaled-1.jpg'),
      },
      intro: {
        heading: 'Partner with us',
        body: paras('Every gift helps us spread the gospel, care for people and gather believers for worship, prayer and teaching.'),
      },
      methods: [],
      scripture: {
        text: 'Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.',
        reference: '2 Corinthians 9:7 (KJV)',
      },
    },
  })

  /* ---------- Contact page ---------- */
  await payload.updateGlobal({
    slug: 'contact-page',
    context: ctx,
    data: {
      banner: {
        eyebrow: 'Get in touch with us',
        title: 'Contact Us',
        intro: 'Whether you seek prayer, guidance, or simply wish to learn more about our community, our doors and hearts are always open.',
        image: await img('swi-5750-scaled-1.jpg'),
      },
      formHeading: 'Send a message',
      formIntro: 'Fill out the form below and a member of our ministry team will reach out to you within 24 hours.',
      subjects: [
        { label: 'Prayer request' },
        { label: 'Guidance and counselling' },
        { label: 'Giving and partnership' },
        { label: 'The Gathering' },
        { label: 'General question' },
      ],
      cards: [
        {
          title: 'The Gathering 2026',
          body: 'Details of our annual gathering are on its own website.',
          link: { label: 'thegatheringcof.org', url: GATHERING_URL, newTab: true },
        },
        {
          title: 'Prayer and guidance',
          body: 'Need prayer? Send us a message using the form and our ministry team will reach out to you.',
        },
      ],
    },
  })

  payload.logger.info(`Done. Imported ${uploaded.size} photos.`)
  process.exit(0)
}

// `payload run` exits once this module finishes loading, so wait for the import here.
try {
  await main()
} catch (err) {
  console.error(err)
  process.exit(1)
}

export type { Payload }

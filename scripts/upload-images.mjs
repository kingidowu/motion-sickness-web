import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://huumoeilfqfojpcggunh.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dW1vZWlsZnFmb2pwY2dndW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYzMTY5NywiZXhwIjoyMDk0MjA3Njk3fQ.Qhqs1w1jetge9Bfmy8e-GoUA2FlpFEpIhqO81yFDi4k'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Map filename → { product_id, angle, sort_order }
const IMAGE_MAP = {
  'cap-og.png':          { product_id: 'cap-og',          angle: 'front', sort_order: 0 },
  'cap-all-black.png':   { product_id: 'cap-all-black',   angle: 'front', sort_order: 0 },
  'cap-cream-red.png':   { product_id: 'cap-cream-red',   angle: 'front', sort_order: 0 },
  'cap-navy-red.png':    { product_id: 'cap-navy-red',    angle: 'front', sort_order: 0 },
  'cap-olive-black.png': { product_id: 'cap-olive-black', angle: 'front', sort_order: 0 },
  'tee-heritage.png':    { product_id: 'tee-heritage',    angle: 'front', sort_order: 0 },
  'tee-racing.png':      { product_id: 'tee-racing',      angle: 'front', sort_order: 0 },
  'tee-houston.png':     { product_id: 'tee-houston',     angle: 'front', sort_order: 0 },
  'tee-sailing.png':     { product_id: 'tee-sailing',     angle: 'front', sort_order: 0 },
  'tee-property.png':    { product_id: 'tee-property',    angle: 'front', sort_order: 0 },
  'tee-ringer.png':      { product_id: 'tee-ringer',      angle: 'front', sort_order: 0 },
  'jersey-navy.png':     { product_id: 'jersey-navy',     angle: 'front', sort_order: 0 },
  'jersey-black.png':    { product_id: 'jersey-black',    angle: 'front', sort_order: 0 },
  'jersey-cream.png':    { product_id: 'jersey-cream',    angle: 'front', sort_order: 0 },
  'ladies-polo.png':     { product_id: 'ladies-polo',     angle: 'front', sort_order: 0 },
  'ladies-bra.png':      { product_id: 'ladies-bra',      angle: 'front', sort_order: 0 },
  'ladies-leggings.png': { product_id: 'ladies-leggings', angle: 'front', sort_order: 0 },
  'ladies-jacket.png':   { product_id: 'ladies-jacket',   angle: 'front', sort_order: 0 },
  'ladies-shorts.png':   { product_id: 'ladies-shorts',   angle: 'front', sort_order: 0 },
  'ladies-tank.png':     { product_id: 'ladies-tank',     angle: 'front', sort_order: 0 },
  'athletic-set.png':    { product_id: 'athletic-set',    angle: 'front', sort_order: 0 },
  'hero-bg.png':         { product_id: 'hero-bg',         angle: 'front', sort_order: 0 },
}

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const BUCKET = 'product-images'

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.id === BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })
    if (error) { console.error('Failed to create bucket:', error.message); process.exit(1) }
    console.log('✓ Created bucket: product-images\n')
  } else {
    console.log('✓ Bucket exists\n')
  }
}

async function ensureTable() {
  // Create ms_product_images if it doesn't exist yet
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      create table if not exists ms_product_images (
        id uuid default gen_random_uuid() primary key,
        created_at timestamptz default now(),
        product_id text not null,
        angle text not null,
        storage_path text not null,
        url text,
        colorway text,
        sort_order int default 0,
        uploaded_by uuid,
        unique(product_id, angle)
      );
      alter table ms_product_images enable row level security;
      drop policy if exists "public read product image registry" on ms_product_images;
      create policy "public read product image registry" on ms_product_images for select using (true);
    `
  }).catch(() => null)
  // rpc might not exist — fall through, table likely already created from migration
}

async function run() {
  await ensureBucket()

  // Try to ensure table exists (best effort)
  try { await ensureTable() } catch {}

  const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
  console.log(`Found ${files.length} images\n`)

  for (const file of files) {
    const meta = IMAGE_MAP[file]
    if (!meta) {
      console.log(`  SKIP  ${file} (not in image map)`)
      continue
    }

    const filePath = path.join(IMAGES_DIR, file)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `products/${file}`
    const contentType = file.endsWith('.png') ? 'image/png' : file.endsWith('.webp') ? 'image/webp' : 'image/jpeg'

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType, upsert: true })

    if (uploadErr) {
      console.log(`  ERROR uploading ${file}: ${uploadErr.message}`)
      continue
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    // Upsert registry row
    const { error: dbErr } = await supabase.from('ms_product_images').upsert({
      product_id: meta.product_id,
      angle: meta.angle,
      storage_path: storagePath,
      url: publicUrl,
      sort_order: meta.sort_order,
    }, { onConflict: 'product_id,angle' })

    if (dbErr) {
      console.log(`  ERROR registering ${file}: ${dbErr.message}`)
    } else {
      console.log(`  ✓  ${file}  →  ${publicUrl}`)
    }
  }

  console.log('\nDone.')
}

run().catch(console.error)

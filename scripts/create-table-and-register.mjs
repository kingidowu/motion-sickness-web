import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://huumoeilfqfojpcggunh.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dW1vZWlsZnFmb2pwY2dndW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYzMTY5NywiZXhwIjoyMDk0MjA3Njk3fQ.Qhqs1w1jetge9Bfmy8e-GoUA2FlpFEpIhqO81yFDi4k'
const BUCKET = 'product-images'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Create table via REST SQL endpoint
async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  return res
}

// Use pg endpoint directly
async function execSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  return { status: res.status, body: text }
}

const IMAGE_ROWS = [
  { product_id: 'cap-og',          angle: 'front', file: 'cap-og.png' },
  { product_id: 'cap-all-black',   angle: 'front', file: 'cap-all-black.png' },
  { product_id: 'cap-cream-red',   angle: 'front', file: 'cap-cream-red.png' },
  { product_id: 'cap-navy-red',    angle: 'front', file: 'cap-navy-red.png' },
  { product_id: 'cap-olive-black', angle: 'front', file: 'cap-olive-black.png' },
  { product_id: 'tee-heritage',    angle: 'front', file: 'tee-heritage.png' },
  { product_id: 'tee-racing',      angle: 'front', file: 'tee-racing.png' },
  { product_id: 'tee-houston',     angle: 'front', file: 'tee-houston.png' },
  { product_id: 'tee-sailing',     angle: 'front', file: 'tee-sailing.png' },
  { product_id: 'tee-property',    angle: 'front', file: 'tee-property.png' },
  { product_id: 'tee-ringer',      angle: 'front', file: 'tee-ringer.png' },
  { product_id: 'jersey-navy',     angle: 'front', file: 'jersey-navy.png' },
  { product_id: 'jersey-black',    angle: 'front', file: 'jersey-black.png' },
  { product_id: 'jersey-cream',    angle: 'front', file: 'jersey-cream.png' },
  { product_id: 'ladies-polo',     angle: 'front', file: 'ladies-polo.png' },
  { product_id: 'ladies-bra',      angle: 'front', file: 'ladies-bra.png' },
  { product_id: 'ladies-leggings', angle: 'front', file: 'ladies-leggings.png' },
  { product_id: 'ladies-jacket',   angle: 'front', file: 'ladies-jacket.png' },
  { product_id: 'ladies-shorts',   angle: 'front', file: 'ladies-shorts.png' },
  { product_id: 'ladies-tank',     angle: 'front', file: 'ladies-tank.png' },
  { product_id: 'athletic-set',    angle: 'front', file: 'athletic-set.png' },
]

async function run() {
  // Step 1: Create table via SQL
  console.log('Creating ms_product_images table...')
  const createSQL = `
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
      constraint ms_product_images_product_angle unique (product_id, angle)
    );
    alter table ms_product_images enable row level security;
    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'ms_product_images' and policyname = 'public read product image registry'
      ) then
        create policy "public read product image registry" on ms_product_images for select using (true);
      end if;
    end $$;
  `
  const r = await execSQL(createSQL)
  console.log('Table creation response:', r.status, r.body.slice(0, 120))

  // Step 2: Register all uploaded images
  console.log('\nRegistering image rows...')
  for (const row of IMAGE_ROWS) {
    const storagePath = `products/${row.file}`
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    const { error } = await supabase.from('ms_product_images').upsert({
      product_id: row.product_id,
      angle: row.angle,
      storage_path: storagePath,
      url: publicUrl,
      sort_order: 0,
    }, { onConflict: 'product_id,angle' })

    if (error) {
      console.log(`  ERROR ${row.file}: ${error.message}`)
    } else {
      console.log(`  ✓  ${row.product_id} / ${row.angle}  →  ${publicUrl}`)
    }
  }

  console.log('\nAll done.')
}

run().catch(console.error)

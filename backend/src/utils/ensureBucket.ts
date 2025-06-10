import { supabaseAdmin } from '@/services/supabase'

export async function ensureFilesBucket() {
  const { data, error } = await supabaseAdmin.storage.listBuckets()
  if (error) {
    console.error('Failed to list buckets', error)
    return
  }

  const exists = data?.some(b => b.id === 'files')
  if (!exists) {
    const { error: createError } = await supabaseAdmin.storage.createBucket('files', { public: false })
    if (createError) {
      console.error('Failed to create files bucket', createError)
    }
  }
}


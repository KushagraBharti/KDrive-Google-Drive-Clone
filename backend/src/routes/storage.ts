import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '@/services/supabase';

export default async function (app: FastifyInstance) {
  // Create a signed upload URL for the authenticated user
  app.post('/api/storage/signed-upload', async (request, reply) => {
    const user = request.user;
    const { fileName } = (request.body as any) || {};
    if (!fileName || typeof fileName !== 'string') {
      reply.code(400).send({ error: 'fileName is required' });
      return;
    }

    const path = `${user.id}/${Date.now()}-${fileName}`;
    const { data, error } = await supabaseAdmin
      .storage
      .from('files')
      .createSignedUploadUrl(path);

    if (error || !data) {
      reply.code(500).send({ error: 'Failed to create signed upload URL' });
      return;
    }

    // Return path + token to be used with uploadToSignedUrl on the client
    reply.send({ path, token: data.token });
  });
}


import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { VideoConfig } from '../types';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env da pasta raiz do projeto (três níveis acima)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const router = Router();

// Array em memória para armazenar vídeos (MVP)
const videos: VideoConfig[] = [];

// Função para buscar vídeos do Bunny Stream
async function listBunnyVideos() {
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const apiKey = process.env.BUNNY_STREAM_API_KEY;
    if (!libraryId || !apiKey) throw new Error('BUNNY_STREAM_LIBRARY_ID ou BUNNY_STREAM_API_KEY não configurados');
  
    const res = await axios.get(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      { headers: { 'AccessKey': apiKey } }
    );
    return res.data.items || res.data; // depende do formato da resposta
}

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de vídeo são permitidos'));
    }
  }
});

// Função para upload no Bunny Stream
async function uploadToBunnyStream(fileBuffer: Buffer, fileName: string): Promise<{ videoUrl: string; guid: string; }> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  if (!libraryId || !apiKey) throw new Error('BUNNY_STREAM_LIBRARY_ID ou BUNNY_STREAM_API_KEY não configurados');

  // 1. Criar vídeo
  const createRes = await axios.post(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    { title: fileName },
    { headers: { 'AccessKey': apiKey } }
  );
  const guid = createRes.data.guid;

  // 2. Upload do arquivo
  await axios.put(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`,
    fileBuffer,
    {
      headers: {
        'AccessKey': apiKey,
        'Content-Type': 'application/octet-stream'
      }
    }
  );

  // 3. URL pública
  const videoUrl = `https://vz-${guid}.b-cdn.net/${fileName}`;
  return { videoUrl, guid };
}

// Função para deletar vídeo do Bunny Stream
async function deleteFromBunnyStream(videoId: string): Promise<void> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  if (!libraryId || !apiKey) throw new Error('BUNNY_STREAM_LIBRARY_ID ou BUNNY_STREAM_API_KEY não configurados');

  try {
    await axios.delete(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      { headers: { 'AccessKey': apiKey } }
    );
  } catch (error) {
    console.error('Erro ao deletar vídeo do Bunny Stream:', error);
    throw error;
  }
}

// GET /api/videos - Listar todos os vídeos
router.get('/', async (req, res) => {
    try {
        const bunnyVideos = await listBunnyVideos();
        // Adapte o formato se necessário para o frontend
        const videos = bunnyVideos.map((v: any) => ({
          id: v.guid,
          title: v.title,
          videoUrl: v.thumbnailFileName // ou construa a URL do vídeo
            ? `https://vz-d6fcd262-b88.b-cdn.net/${v.thumbnailFileName.replace('.jpg', '.mp4')}`
            : `https://vz-d6fcd262-b88.b-cdn.net/play_720p.mp4`,
          thumbUrl: v.thumbnailFileName
            ? `https://vz-d6fcd262-b88.b-cdn.net/${v.thumbnailFileName}`
            : undefined,
          primaryColor: '#3B82F6',
          autoplay: false,
          muted: true,
          createdAt: v.dateUploaded ? new Date(v.dateUploaded) : new Date(),
          updatedAt: v.dateUploaded ? new Date(v.dateUploaded) : new Date()
        }));
        res.json({ videos, total: videos.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar vídeos do Bunny Stream' });
      }
});

// GET /api/videos/:id - Buscar vídeo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Para o MVP, vamos simular o retorno do vídeo
    // Em produção, isso buscaria no Supabase ou Bunny Stream
    const video = {
      id,
      title: 'Vídeo',
      videoUrl: `https://vz-${id}.b-cdn.net/play_720p.mp4`,
      thumbUrl: undefined,
      primaryColor: '#3B82F6',
      autoplay: false,
      muted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.json(video);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeo' });
  }
});

// POST /api/videos - Upload de novo vídeo
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo de vídeo é obrigatório' });
    }

    const { title, primaryColor, autoplay, muted } = req.body;
    const videoId = uuidv4();
    const fileName = `${videoId}.mp4`;

    // Upload real para Bunny Stream
    const { videoUrl, guid } = await uploadToBunnyStream(req.file.buffer, fileName);

    const video: VideoConfig = {
      id: videoId,
      title: title || 'Vídeo sem título',
      videoUrl,
      thumbUrl: undefined,
      primaryColor: primaryColor || '#3B82F6',
      autoplay: autoplay === 'true',
      muted: muted === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    videos.push(video);
    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer upload do vídeo' });
  }
});

// PUT /api/videos/:id - Atualizar configurações do vídeo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, primaryColor, autoplay, muted, thumbUrl } = req.body;
    
    // Para o MVP, vamos apenas simular a atualização
    // Em produção, isso seria salvo no Supabase
    const updatedVideo = {
      id,
      title: title || 'Vídeo sem título',
      videoUrl: `https://vz-${id}.b-cdn.net/play_720p.mp4`, // URL padrão
      thumbUrl: thumbUrl || undefined,
      primaryColor: primaryColor || '#3B82F6',
      autoplay: autoplay === true || autoplay === 'true',
      muted: muted === true || muted === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json(updatedVideo);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro ao atualizar vídeo' });
  }
});

// DELETE /api/videos/:id - Deletar vídeo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tentar deletar do Bunny Stream primeiro
    try {
      await deleteFromBunnyStream(id);
    } catch (error) {
      console.warn('Erro ao deletar do Bunny Stream, continuando com remoção local:', error);
    }
    
    // Remover do array local (se existir)
    const idx = videos.findIndex(v => v.id === id);
    if (idx !== -1) {
      videos.splice(idx, 1);
    }
    
    res.json({ message: 'Vídeo removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover vídeo:', error);
    res.status(500).json({ error: 'Erro ao remover vídeo' });
  }
});

export { router as videoRoutes }; 
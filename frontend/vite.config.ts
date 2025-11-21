import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { statSync, createReadStream } from 'fs';
import { join, extname } from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import type { ViteDevServer } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const getMimeType = (filePath: string): string => {
  const ext = extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.json': 'application/json'
  };

  return mimeTypes[ext] ?? 'application/octet-stream';
};

export default {
  build: {
    outDir: './public'
  },
  resolve: {
    alias: {
      '@types': resolve(__dirname, 'src/types')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    {
      name: 'serve-assets',
      configureServer(server: ViteDevServer) {
        server.middlewares.use(
          '/assets',
          (req: IncomingMessage, res: ServerResponse, next: () => void) => {
            const assetsPath = resolve(__dirname, 'src/assets');
            const requestUrl = req.url || '/';
            const filePath = join(assetsPath, requestUrl);
    
            // Security check - ensure the file is within the assets directory
            if (!filePath.startsWith(assetsPath)) {
              res.statusCode = 403;
              res.end('Forbidden');
              return;
            }
    
            try {
              const stat = statSync(filePath);
    
              if (stat.isFile()) {
                res.setHeader('Content-Type', getMimeType(filePath));
                const stream = createReadStream(filePath);
                stream.pipe(res);
              } else {
                next();
              }
            } catch {
              next();
            }
          }
        );
      }
    }
  ]
};

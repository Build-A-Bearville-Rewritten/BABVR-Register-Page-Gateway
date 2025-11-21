import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { statSync, createReadStream } from 'fs';
import { join, extname } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const getMimeType = (filePath) => {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.json': 'application/json'
  };
  return mimeTypes[ext] || 'application/octet-stream';
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
      configureServer(server) {
        server.middlewares.use('/assets', (req, res, next) => {
          const assetsPath = resolve(__dirname, 'src/assets');
          const filePath = join(assetsPath, req.url);
          
          // Security check - ensure the file is within assets directory
          if (!filePath.startsWith(assetsPath)) {
            res.statusCode = 403;
            return res.end('Forbidden');
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
          } catch (err) {
            next();
          }
        });
      }
    }
  ]
};

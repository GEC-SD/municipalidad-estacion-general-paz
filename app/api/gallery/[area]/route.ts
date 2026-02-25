import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ALLOWED_AREAS = ['cultura', 'salud', 'obras', 'educacion', 'registro'];
const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png|gif)$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ area: string }> }
) {
  const { area } = await params;

  // Sanitize: only allow known area names
  if (!ALLOWED_AREAS.includes(area)) {
    return NextResponse.json([]);
  }

  const dirPath = path.join(process.cwd(), 'public', area);

  if (!fs.existsSync(dirPath)) {
    return NextResponse.json([]);
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((f) => IMAGE_EXTENSIONS.test(f))
    .sort((a, b) => {
      // Natural sort: Cultura1 before Cultura10
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    })
    .map((f) => {
      const name = f.replace(/\.[^.]+$/, ''); // strip extension
      const title = name
        .replace(/(\d+)$/, ' $1') // "Cultura1" → "Cultura 1"
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // "CulturaLocal" → "Cultura Local"

      return {
        src: `/${area}/${f}`,
        alt: title,
        title,
      };
    });

  return NextResponse.json(files);
}

import { promises as fs } from 'fs';
import path from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';
import type { Locale } from '@/lib/i18n';

const contentRoot = path.join(process.cwd(), 'content');

export async function readContentFile(fileName: string) {
  const filePath = path.join(contentRoot, fileName);
  return fs.readFile(filePath, 'utf8');
}

export async function getMdxContent<TFrontmatter extends Record<string, unknown> = Record<string, unknown>>(
  fileName: string
) {
  const source = await readContentFile(fileName);
  return compileMDX<TFrontmatter>({
    source,
    options: {
      parseFrontmatter: true
    }
  });
}

export async function getJsonContent<TData = unknown>(fileName: string) {
  const source = await readContentFile(fileName);
  return JSON.parse(source) as TData;
}

export function localizedMdxFile(baseName: string, locale: Locale) {
  return `${baseName}.${locale}.mdx`;
}

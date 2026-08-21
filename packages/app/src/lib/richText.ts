import 'server-only';

import {convertMarkdownToLexical} from '@payloadcms/richtext-lexical';
import type {Payload} from 'payload';

export function markdownToLexical(payload: Payload, markdown: string) {
  const editorConfig = (payload.config.editor as any)?.editorConfig;
  if (!editorConfig) {
    throw new Error('Lexical editor config is unavailable.');
  }
  return convertMarkdownToLexical({editorConfig, markdown});
}

import type {Metadata} from 'next';
import {draftMode} from 'next/headers';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {getPostBySlug} from '@/lib/post';
import PostView from '@/view/post/PostView';

type Params = {params: Promise<{locale: Locale; postSlug: string}>};

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, postSlug} = await params;
  const post = await getPostBySlug('hr', decodeSlug(postSlug), {locale});
  return {title: post?.title, description: post?.summary};
}

export default async function HrPostPage({params}: Params) {
  const {locale, postSlug} = await params;
  setRequestLocale(locale);
  const {isEnabled} = await draftMode();
  const post = await getPostBySlug('hr', decodeSlug(postSlug), {
    locale,
    draft: isEnabled,
  });
  if (!post) notFound();
  return <PostView post={post} section="hr" />;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

type EmotionCacheProviderProps = {
  children: React.ReactNode;
};

const EmotionCacheProvider = ({ children }: EmotionCacheProviderProps) => {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) {
      return null;
    }

    let styles = '';
    let dataEmotionAttribute = cache.key;

    const regex = new RegExp(`${cache.key}-([a-zA-Z0-9-_]+)`, 'gm');

    entries.forEach(([key, value]) => {
      if (typeof value === 'string') {
        const matches = value.match(regex);
        if (matches) {
          dataEmotionAttribute += ` ${matches.join(' ').replace(new RegExp(`${cache.key}-`, 'gm'), '')}`;
        }
        styles += value;
      }
    });

    return (
      <style
        key={cache.key}
        data-emotion={dataEmotionAttribute}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;

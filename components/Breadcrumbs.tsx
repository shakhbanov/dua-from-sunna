import React from 'react';
import type { ChapterData, Collection, Language } from '../types';
import { getCollection } from '../data/collections';
import { buildCollectionIndexPath } from '../src/router/routes';
import RouteLink from '../src/router/RouteLink';

interface Props {
  chapter: ChapterData;
  collection: Collection;
  language: Language;
}

/**
 * The reader's position, in the header beside the menu button.
 *
 * The trail is the collection, then the chapter — the two levels the URL
 * actually has. It must stay identical to breadcrumbTrail() in
 * src/seo/updateMetaTags.ts, which emits the BreadcrumbList: the markup is not
 * allowed to describe a path the reader cannot see.
 */
const Breadcrumbs: React.FC<Props> = ({ chapter, collection, language }) => (
  <nav aria-label="breadcrumb" className="min-w-0 flex-1 text-sm">
    <ol className="flex items-center gap-1.5 min-w-0">
      <li className="shrink-0">
        <RouteLink
          href={buildCollectionIndexPath(collection, language)}
          to={
            collection === 'sunna'
              ? { view: 'home' }
              : { view: 'collection-index', collection }
          }
          className="text-neutral-500 dark:text-neutral-400 hover:text-foreground transition-colors"
        >
          {getCollection(collection).shortTitle[language]}
        </RouteLink>
      </li>
      <li aria-hidden="true" className="shrink-0 text-neutral-300 dark:text-neutral-600">
        /
      </li>
      <li className="min-w-0">
        <span className="block truncate text-foreground" aria-current="page">
          {chapter.title[language]}
        </span>
      </li>
    </ol>
  </nav>
);

export default Breadcrumbs;

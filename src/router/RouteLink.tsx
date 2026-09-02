import React, { useCallback } from 'react';
import { useRoute, type NavigateTarget } from './RouterContext';

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** Real, crawlable destination — the same path the router pushes. */
  href: string;
  /** Where the router should go on a plain left click. */
  to: NavigateTarget;
  /** Runs after an in-app navigation, e.g. to close the mobile sidebar. */
  onNavigate?: () => void;
  children: React.ReactNode;
}

/**
 * A crawlable link that navigates in-app.
 *
 * The `href` is a real URL, so crawlers follow it and "open in a new tab" works;
 * a plain left click is taken over by the router instead of reloading the whole
 * document. Modified clicks (⌘/Ctrl/Shift/Alt, middle button) are left to the
 * browser on purpose.
 */
const RouteLink: React.FC<Props> = ({ href, to, onNavigate, children, ...anchorProps }) => {
  const { navigate } = useRoute();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      navigate(to);
      onNavigate?.();
    },
    [navigate, to, onNavigate]
  );

  return (
    <a href={href} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
};

export default RouteLink;

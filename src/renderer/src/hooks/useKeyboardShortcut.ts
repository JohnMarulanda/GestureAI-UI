import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  key: string;
}

export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void
) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === options.key.toLowerCase();
      const matchesCtrl = options.ctrlKey ? event.ctrlKey : true;
      const matchesShift = options.shiftKey ? event.shiftKey : true;
      const matchesAlt = options.altKey ? event.altKey : true;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        event.preventDefault();
        callback();
      }
    },
    [options, callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
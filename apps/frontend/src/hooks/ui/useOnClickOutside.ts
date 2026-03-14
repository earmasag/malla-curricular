import { useEffect, type RefObject } from 'react';

/**
 * Hook to detect clicks outside of a specified element and trigger a callback.
 * 
 * @param ref - React ref object pointing to the element to monitor.
 * @param handler - Function to call when a click outside the element occurs.
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            // Do nothing if clicking ref's element or descendant elements
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener as any);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener as any);
        };
    }, [ref, handler]);
};

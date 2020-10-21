import { useState, useEffect, DependencyList } from 'react';

function useWindowEvent<EventType extends keyof WindowEventMap>(
  eventType: EventType,
  onEvent: (event: WindowEventMap[EventType]) => void,
  deps?: DependencyList,
): void;

function useWindowEvent<EventTypes extends Array<keyof WindowEventMap>>(
  eventType: EventTypes,
  onEvent: (event: WindowEventMap[EventTypes[number]]) => void,
  deps?: DependencyList,
): void;

function useWindowEvent(
  eventType: keyof WindowEventMap | Array<keyof WindowEventMap>,
  onEvent: (event: any) => void,
  deps?: DependencyList,
): void {
  useEffect(() => {
    // Add event listener
    const eventTypes = typeof eventType === 'string' ? [eventType] : eventType;
    eventTypes.forEach((t) => window.addEventListener(t, onEvent));

    // Remove event listener on cleanup
    return () =>
      eventTypes.forEach((t) => window.removeEventListener(t, onEvent));
  }, deps ?? []); // Empty array ensures that effect is only run on mount
}

export default useWindowEvent;

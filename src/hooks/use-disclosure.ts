import * as React from "react";
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = React.useState(initial);
  const open  = React.useCallback(() => setIsOpen(true),  []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle= React.useCallback(() => setIsOpen(v => !v),[]);
  return { isOpen, open, close, toggle, setIsOpen };
}

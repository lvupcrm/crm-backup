import React from 'react';
import type { LabelHTMLAttributes, PropsWithChildren } from 'react';

export const Label = React.forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ children, ...props }, ref) => (
    <label ref={ref} {...props} style={{ fontWeight: 'bold', marginBottom: 4, display: 'block' }}>
      {children}
    </label>
  )
);
Label.displayName = 'Label'; 
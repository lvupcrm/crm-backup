import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

export const Button = React.forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props} style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
      {children}
    </button>
  )
);
Button.displayName = 'Button';

import React from 'react';
import type { InputHTMLAttributes } from 'react';

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} {...props} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
);
Input.displayName = 'Input'; 
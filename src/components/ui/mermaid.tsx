import React, { useEffect, useRef } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mermaid: any;
    let renderId = 'mermaid-diagram-' + Math.random().toString(36).substr(2, 9);
    import('mermaid').then((m) => {
      mermaid = m.default || m;
      mermaid.initialize({ startOnLoad: false });
      if (ref.current) {
        mermaid.render(renderId, chart).then(({ svg }: { svg: string }) => {
          if (ref.current) ref.current.innerHTML = svg;
        });
      }
    });
    // eslint-disable-next-line
  }, [chart]);

  return <div ref={ref} style={{ width: '100%', overflowX: 'auto' }} />;
};

export default Mermaid; 
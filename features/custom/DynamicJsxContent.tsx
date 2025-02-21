import React, { useEffect, useRef } from 'react';

interface DynamicJsxContentProps {
  code: string;
}

const DynamicJsxContent: React.FC<DynamicJsxContentProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        // Preprocess the code
        const processedCode = code
          .replace(/import\s+.*?from\s+.*?;?/g, '') // Remove import statements
          .replace(/export\s+default\s+/g, '') // Remove export default
          .replace(/export\s+/g, ''); // Remove other exports

        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                :root {
                  --background: 0 0% 100%;
                  --foreground: 222.2 84% 4.9%;
                  --primary: 222.2 47.4% 11.2%;
                  --primary-foreground: 210 40% 98%;
                  --secondary: 210 40% 96.1%;
                  --secondary-foreground: 222.2 47.4% 11.2%;
                  --muted: 210 40% 96.1%;
                  --muted-foreground: 215.4 16.3% 46.9%;
                  --accent: 210 40% 96.1%;
                  --accent-foreground: 222.2 47.4% 11.2%;
                  --destructive: 0 84.2% 60.2%;
                  --destructive-foreground: 210 40% 98%;
                  --border: 214.3 31.8% 91.4%;
                  --input: 214.3 31.8% 91.4%;
                  --ring: 222.2 84% 4.9%;
                }
                .dark {
                  --background: 222.2 84% 4.9%;
                  --foreground: 210 40% 98%;
                  --primary: 210 40% 98%;
                  --primary-foreground: 222.2 47.4% 11.2%;
                  --secondary: 217.2 32.6% 17.5%;
                  --secondary-foreground: 210 40% 98%;
                  --muted: 217.2 32.6% 17.5%;
                  --muted-foreground: 215 20.2% 65.1%;
                  --accent: 217.2 32.6% 17.5%;
                  --accent-foreground: 210 40% 98%;
                  --destructive: 0 62.8% 30.6%;
                  --destructive-foreground: 210 40% 98%;
                  --border: 217.2 32.6% 17.5%;
                  --input: 217.2 32.6% 17.5%;
                  --ring: 212.7 26.8% 83.9%;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  ${processedCode}

                  const rootElement = document.getElementById('root');
                  const functionNames = Object.keys(window).filter(key => typeof window[key] === 'function' && /^[A-Z]/.test(key));
                  if (functionNames.length > 0) {
                    ReactDOM.render(React.createElement(window[functionNames[0]]), rootElement);
                  } else {
                    rootElement.innerHTML = '<pre>No suitable component found. Available components: ' + 
                      JSON.stringify(Object.keys(window).filter(key => typeof window[key] === 'function'), null, 2) + '</pre>';
                  }
                } catch (error) {
                  document.body.innerHTML = '<pre style="color: red;">Error: ' + error.message + '\\n\\n' + error.stack + '</pre>';
                }
              </script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '800px', border: 'none' }}
      title="JSX Renderer"
    />
  );
};

export default DynamicJsxContent;

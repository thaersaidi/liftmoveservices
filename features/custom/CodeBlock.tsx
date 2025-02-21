import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ClipboardIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const DynamicHtmlContent = dynamic(() => import('./DynamicHtmlContent'), { ssr: false });
const DynamicJsxContent = dynamic(() => import('./DynamicJsxContent'), { ssr: false });

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  onPushContent?: (content: string) => void;
}

const CodeBlock: React.FC<CodeProps> = ({ node, inline, className, children, onPushContent, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : null;
  const [isRendered, setIsRendered] = useState(language === 'html' || language === 'jsx' || language === 'mermaid' || language === 'markdown');
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (language === 'mermaid' && isRendered && isLoaded) {
      mermaid.initialize({ startOnLoad: false });
      mermaid.contentLoaded();
      mermaid.init(undefined, mermaidRef.current);
    }
  }, [language, isRendered, isLoaded]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(children)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [children]);

  const toggleRender = useCallback(() => {
    setIsRendered((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderContent = () => {
    if (isRendered) {
      switch (language) {
        case 'html':
          return <DynamicHtmlContent htmlContent={String(children).replace(/\n/g, '')} />;
        case 'mermaid':
          return isLoaded ? <div ref={mermaidRef} className="mermaid">{String(children)}</div> : null;
        case 'jsx':
          return isLoaded ? <DynamicJsxContent code={String(children)} /> : null;
        case 'markdown':
          return (
            <div className="markdown-content" style={{ padding: '1em' }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {String(children)}
              </ReactMarkdown>
            </div>
          );
        default:
          return (
            <SyntaxHighlighter style={dracula} language={language} PreTag="div" {...props}
              customStyle={{ margin: '0', borderRadius: '0' }}>
              {String(children)}
            </SyntaxHighlighter>
          );
      }
    } else {
      return (
        <SyntaxHighlighter style={dracula} language={language} PreTag="div" {...props}
          customStyle={{ margin: '0', borderRadius: '0' }}>
          {String(children)}
        </SyntaxHighlighter>
      );
    }
  };

  if (!inline && match) {
    return (
      <div className="thin-scrollbar break-words"
        style={{ 
          position: 'relative', 
          overflow: 'auto', 
          wordBreak: 'break-word',
          zIndex: 1, // Set a low z-index
        }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.5em 1em 0.25em 1em', 
          backgroundColor: '#4b4d57', 
          color: 'white', 
          borderTopLeftRadius: '0.5em', 
          borderTopRightRadius: '0.5em',
          position: 'relative', // Ensure this is positioned
          zIndex: 2, // Slightly higher than the content, but still low
        }}>
          <span>{language}</span>
          <div>
            {['html', 'jsx', 'mermaid', 'markdown'].includes(language) ? (
              <button onClick={toggleRender} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                {isRendered ? <EyeOffIcon className="h-6 w-6 p-1 text-yellow-400" /> : <EyeIcon className="h-6 w-6 text-yellow-400" />}
              </button>
            ) : null}
            <button onClick={handleCopy} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <ClipboardIcon className={`h-6 w-6 p-1 ${isCopied ? 'text-green-500' : 'text-white'}`} />
            </button>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}> {/* Wrap content in a div with low z-index */}
          {renderContent()}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.5em 1em 0.25em 1em', 
          backgroundColor: '#4b4d57', 
          color: 'white', 
          borderBottomLeftRadius: '0.5em', 
          borderBottomRightRadius: '0.5em',
          position: 'relative', // Ensure this is positioned
          zIndex: 2, // Slightly higher than the content, but still low
        }}>
          <span></span>
          <div>
            {['html', 'jsx', 'mermaid', 'markdown'].includes(language) ? (
              <button onClick={toggleRender} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                {isRendered ? <EyeOffIcon className="h-6 w-6 p-1 text-yellow-400" /> : <EyeIcon className="h-6 w-6 text-yellow-400" />}
              </button>
            ) : null}
            <button onClick={handleCopy} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <ClipboardIcon className={`h-6 w-6 p-1 ${isCopied ? 'text-green-500' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for inline code or when no language is matched
  return <code className={className} {...props} style={{ whiteSpace: 'break-spaces', zIndex: 1 }}>{children}</code>;
};

export default CodeBlock;
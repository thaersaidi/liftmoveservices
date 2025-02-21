import React from 'react';
import Markdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Maximize2, Minimize2 } from "lucide-react";

const Editor = ({
  isFullScreen,
  selectedLanguage,
  customLanguage,
  markup,
  languageOptions,
  handleLanguageChange,
  handleCustomLanguageChange,
  handleMarkupChange,
  toggleFullScreen,
  components,
}) => {
  return (
    <div className={`${isFullScreen ? 'overflow-auto fixed inset-0 w-full h-full pb-6 pr-6 p-4 bg-secondary z-50' : 'w-full lg:w-1/2 lg:pl-4'} lg:max-w-full`}>
      <div className={`rounded-lg shadow-md p-4 md:p-6 bg-background ${isFullScreen ? 'h-full flex flex-col' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 sm:mb-0">Editor</h2>
          <div className="flex flex-wrap items-center">
            <div className="relative mr-4 mb-2 sm:mb-0">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="p-2 border rounded text-foreground bg-secondary/40 appearance-none pr-8"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {selectedLanguage === 'custom' && (
              <input
                type="text"
                value={customLanguage}
                onChange={handleCustomLanguageChange}
                placeholder="Enter custom language"
                className="mr-4 mb-2 sm:mb-0 p-2 border rounded text-foreground bg-secondary/40"
              />
            )}
            <button onClick={toggleFullScreen} className="text-gray-500 hover:text-foreground">
              {isFullScreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
          </div>
        </div>
        <div className={`${isFullScreen ? 'flex flex-col md:flex-row flex-grow' : ''}`}>
          <textarea
            className={`p-2 border rounded text-foreground bg-secondary/40 ${isFullScreen ? 'w-full md:w-1/2 flex-grow mb-4 md:mb-0 md:mr-2' : 'w-full mb-4'}`}
            style={{ height: isFullScreen ? 'calc(100vh - 20vh)' : '20vh' }}
            value={markup}
            onChange={handleMarkupChange}
          />
          <div 
            className={`bg-muted border rounded overflow-auto ${isFullScreen ? 'w-full md:w-1/2 flex-grow md:ml-2' : 'max-w-full'}`}
            style={{ height: isFullScreen ? 'calc(100vh - 20vh)' : '60vh' }}
          >
            <Markdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]} 
              components={components}
            >
              {markup}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
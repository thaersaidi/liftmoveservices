import React, { useEffect, useRef } from 'react';

const DynamicHtmlContent = ({ htmlContent }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.innerHTML = htmlContent;

            const scriptElements = container.querySelectorAll('script');
            scriptElements.forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.type = oldScript.type || 'text/javascript';

                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    newScript.async = false; // Maintain script execution order
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                } else {
                    const scriptContent = oldScript.textContent;

                    // Adding detailed logging for the script content
                    console.log('Original script content:', scriptContent);

                    // Sanitize and wrap the script content
                    const sanitizedContent = scriptContent.replace(/<\/script>/g, '<\\/script>');

                    // Execute the sanitized script content
                    try {
                        newScript.textContent = `(function() { ${sanitizedContent} })();`;
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    } catch (error) {
                        console.error('Error executing script:', error);
                        console.log('Sanitized script content:', sanitizedContent);
                    }
                }
            });
        }
    }, [htmlContent]);

    return (
        <div 
            ref={containerRef}
            style={{
                padding: '1em',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '100%',
                wordWrap: 'break-word',
                margin: '0 auto',
            }}
        />
    );
};

export default DynamicHtmlContent;

'use client';
import React, { useState, useRef, useEffect } from 'react';
import OmniAssist from './OmniAssist';
import { ListStart, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const resizerRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newWidth = sidebarRect.right - e.clientX;
      if (newWidth > 60 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const toggleMinimize = () => {
    setSidebarWidth(isMinimized ? 220 : 60);
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const videoElement = document.getElementById('video');
      if (videoElement && videoElement.srcObject === null) {
        const startVideoStream = async () => {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          if (videoDevices.length > 0) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: videoDevices[0].deviceId } } });
            videoElement.srcObject = stream;
          }
        };
        startVideoStream();
      }
    } else {
      const videoElement = document.getElementById('video');
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
      }
    }
  }, [isOpen]);

  const commonStyles = 'h-full z-100 rounded-full rounded-md rounded-r-none fixed inset-y-0 right-0 transform transition-transform duration-300 bg-secondary   dark-scrollbar';

  return (
    <div  style={{ zIndex: '1000' }}>
      {!isOpen && (
        <button onClick={toggleSidebar} 
        className={`fixed  ${isMobile ? 'top-2 right-4' : 'top-4 right-8'} bg-teal-600 shadow rounded-full text-slate-500 h-6 w-6 `}
        style={{ zIndex: '1010' }}>
          <img src="/ai-icon.png" alt="Omni chat" className="h-8 w-8 object-cover rounded-full hover:scale-105 transition-transform duration-300 ease-in-out" />
        </button>
      )}
      {isOpen && (
        <>
          {isMobile ? (
            <>
              <button onClick={toggleSidebar} className={`fixed top-2 ${isMinimized ? '' : ''} right-4 bg-[#b64848] z-100 shadow rounded-full text-slate-500 h-6 w-6`}
               style={{ zIndex: '1010' }}>
                <img src="/ai-icon.png" alt="Omni chat" className="h-8 w-8 object-cover rounded-full hover:scale-105 transition-transform duration-300 ease-in-out" />
              </button>
              <div ref={sidebarRef} style={{
                width: isMinimized ? '16%' : '88%', height: isMinimized ? '70%' : '100%', top: isMinimized ? '5%' : '0%',
                backgroundImage: isMinimized ? '' : `url('ai-icon.png')`, backgroundSize: isMinimized ? '' : 'cover', backgroundPosition: isMinimized ? '' : 'center'
              }}
                className={`${commonStyles} h-full ${isMinimized ? 'overflow-hidden bg-transparent' : 'overflow-auto'}`}>
                <button onClick={toggleMinimize} className="absolute top-4 left-4 text-slate-500 h-6 w-6">
                  <ChevronLeftIcon className={`${isMinimized ? 'block' : 'hidden'} h-6 w-6`} />
                  <ChevronRightIcon className={`${isMinimized ? 'hidden' : 'block'} h-6 w-6 text-teal-600`} />
                </button>
                <OmniAssist />
                {/* {isMinimized ? (
                  <div ref={resizerRef} id="resizerRef" onMouseDown={handleMouseDown}
                    className="absolute top-0 left-0 w-1.5 cursor-col-resize bg-primary"
                    style={{ height: '14vh' }} />
                ) : (
                  <div ref={resizerRef} id="resizerRef" onMouseDown={handleMouseDown}
                    className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize bg-primary" />
                )} */}
              </div>
            </>
          ) : (
            <>
              <button onClick={toggleSidebar} className="fixed top-4 right-8 bg-[#b64848] z-100 shadow rounded-full text-slate-500 h-6 w-6"
              >
                <img src="/ai-icon.png" alt="Omni chat" className="h-8 w-8 object-cover rounded-full hover:scale-105 transition-transform duration-300 ease-in-out" />
              </button>
              <div ref={sidebarRef} style={{
                width: `${sidebarWidth}px`, height: '76%', top: '12%', zIndex: 1000,
                backgroundImage: isMinimized ? '' : `url('ai-icon.png')`, backgroundSize: isMinimized ? '' : 'cover', backgroundPosition: isMinimized ? '' : 'center'
              }}
                className={`${commonStyles} ${isMinimized ? 'overflow-hidden bg-transparent' : 'overflow-auto'}`}>
                <button onClick={toggleMinimize} className="absolute top-2 left-2 text-teal-600 h-6 w-6">
                  <ChevronLeftIcon className={`${isMinimized ? 'block' : 'hidden'} h-6 w-6`} />
                  <ChevronRightIcon className={`${isMinimized ? 'hidden' : 'block'} h-6 w-6`} />
                </button>
                <OmniAssist />
                {isMinimized ? (
                  <div ref={resizerRef} id="resizerRef" onMouseDown={handleMouseDown}
                    className="absolute top-0 left-0 w-1.5 cursor-col-resize bg-primary"
                    style={{ height: '4vh' }} />
                ) : (
                  <div ref={resizerRef} id="resizerRef" onMouseDown={handleMouseDown}
                    className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize bg-primary" />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
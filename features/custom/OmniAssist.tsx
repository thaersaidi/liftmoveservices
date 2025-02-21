import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import { StopCircleIcon, MicIcon, CameraIcon, MessageCircle, CogIcon } from 'lucide-react';
import { getCurrentUser } from '../auth-page/helpers';
import { useSession } from 'next-auth/react';

const OmniAssist = () => {
  const wsUrl = process.env.OMNI_WS_URL || 'wss://live.connectorzzz.com/ws';
  const [isRecording, setIsRecording] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [shareCam, setShareCam] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const [screenshotAvailable, setScreenshotAvailable] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [shareMainChat, setShareMainChat] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting video devices:', error);
      }
    };

    const initializeWebSocket = (userEmail: string) => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const socket = new WebSocket(`${wsUrl}/${userEmail}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = async event => {
        setIsWaiting(false); // Hide the waiting icon when a response is received
        if (typeof event.data === 'string') {
          // Update messages state with new message
          // setMessages(prevMessages => [...prevMessages, event.data]);
          document.getElementById('responseText').innerText = event.data;
          document.getElementById('stopAudioButton').style.display = 'none';
        } else if (event.data instanceof Blob) {
          console.log('Audio Blob received');
          const arrayBuffer = await event.data.arrayBuffer();
          console.log(`ArrayBuffer size: ${arrayBuffer.byteLength}`);
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          try {
            const audioBuffer = await decodeAudioData(arrayBuffer);
            playAudioBuffer(audioBuffer);
          } catch (error) {
            console.error('Error decoding audio data:', error);
          }
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      socket.onerror = error => {
        console.error('WebSocket error:', error);
      };
    };

    getVideoDevices();

    if (status === "authenticated" && session?.user?.email) {
      initializeWebSocket(session.user.email);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [status, session, wsUrl]);

  const handleCameraChange = async (event) => {
    const deviceId = event.target.value;
    setSelectedDeviceId(deviceId);
    if (shareCam) {
      await startVideoStream(deviceId);
    }
  };

  const handleShareCamChange = async (event) => {
    const isChecked = event.target.checked;
    setShareCam(isChecked);
    if (isChecked) {
      await startVideoStream(selectedDeviceId);
    } else {
      stopVideoStream();
    }
  };

  const handleShareMainChat = async (event) => {
    const isChecked = event.target.checked;
    setShareMainChat(isChecked);
  };

  const startVideoStream = async (deviceId) => {
    const waitForVideoElement = async () => {
      return new Promise((resolve) => {
        const checkVideoElement = () => {
          const videoElement = document.getElementById('video') as HTMLVideoElement;
          if (videoElement) {
            resolve(videoElement);
          } else {
            setTimeout(checkVideoElement, 100);
          }
        };
        checkVideoElement();
      });
    };

    const videoElement = await waitForVideoElement();

    try {
      if (deviceId !== 'none') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
        videoElement.srcObject = stream;
        console.log('Video stream started with device ID:', deviceId);
      } else {
        videoElement.srcObject = null;
      }
    } catch (error) {
      console.error('Error starting video stream:', error);
    }
  };

  const stopVideoStream = () => {
    const videoElement = document.getElementById('video') as HTMLVideoElement;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
      console.log('Video stream stopped.');
    }
  };

  const startAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioBase64 = await blobToBase64(audioBlob);

        const snapshotBlob = shareCam ? await captureSnapshot() : null;
        const imageBase64 = snapshotBlob ? await blobToBase64(snapshotBlob) : null;
        const context = shareMainChat ? selectedMessages : null;

        const data = JSON.stringify({ audio: audioBase64, image: imageBase64, context: context });
        socketRef.current?.send(data);

        audioChunksRef.current = [];
        setIsWaiting(true);
      };

      console.log('Audio stream started successfully.');
    } catch (error) {
      console.error('Error starting audio stream:', error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      startAudioStream().then(() => {
        mediaRecorderRef.current?.start();
        setIsRecording(true);
      });
    }
  };

  const captureSnapshot = async () => {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video || !video.srcObject) {
      console.warn('Camera is not active, skipping snapshot capture.');
      return null;
    }
    const snapshotCanvas = document.getElementById('snapshotCanvas') as HTMLCanvasElement;
    if (!snapshotCanvas) {
      console.error('snapshotCanvas element not found');
      return null;
    }
    const context = snapshotCanvas.getContext('2d');
    if (!context) {
      console.error('Could not get context from snapshotCanvas');
      return null;
    }
    context.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    setScreenshotAvailable(true);
    return new Promise<Blob>(resolve => {
      snapshotCanvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const decodeAudioData = (arrayBuffer: ArrayBuffer) => {
    return new Promise<AudioBuffer>((resolve, reject) => {
      audioContextRef.current?.decodeAudioData(arrayBuffer, resolve, reject);
    });
  };

  const playAudioBuffer = (audioBuffer: AudioBuffer) => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    sourceNodeRef.current = audioContextRef.current?.createBufferSource() || null;
    sourceNodeRef.current.buffer = audioBuffer;
    sourceNodeRef.current.connect(audioContextRef.current.destination);
    sourceNodeRef.current.start(0);
    document.getElementById('stopAudioButton').style.display = 'block';
    console.log('Audio played');

    sourceNodeRef.current.onended = () => {
      document.getElementById('stopAudioButton').style.display = 'none';
    };
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      document.getElementById('stopAudioButton').style.display = 'none';
      console.log('Audio stopped');
    }
  };

  const init3DPointCloud = () => {
    const canvas = document.getElementById('pointCloudCanvas') as HTMLCanvasElement;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;

    camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    const particles = 5000;
    const positions = new Float32Array(particles * 3);
    for (let i = 0; i < particles * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const pointCloud = new THREE.Points(geometry, material);
    pointCloudRef.current = pointCloud;

    scene.add(pointCloud);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    if (pointCloudRef.current && rendererRef.current && cameraRef.current && sceneRef.current) {
      pointCloudRef.current.rotation.x += 0.01;
      pointCloudRef.current.rotation.y += 0.01;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const handleSelectChange = (event) => {
    const options = event.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedMessages(selected);
  };

  return (
    <>
      <Head>
        <style>{`
          body, html {
            height: 100%;
          }
          body {
            background-size: cover;
          }
        `}</style>
      </Head>
      <div className="text-xs">
        <div className="container mx-auto pt-4 h-full pr-1" style={{ zIndex: '10000' }}>
          <div className="flex justify-center items-center">
            <button
              id="recordButton"
              onClick={toggleRecording}
              className={`p-2 rounded-full mt-6 ${isRecording ? 'bg-destructive' : 'bg-background/90'}`}
              style={{ zIndex: 1000, position: 'relative' }}
            >
              {isRecording ? (
                <StopCircleIcon className="h-6 w-6" />
              ) : (
                <MicIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="px-1 pt-1 rounded m-2 bg-background/90">
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" id="shareCamCheckbox" checked={shareCam} onChange={handleShareCamChange} className="mr-2" />
                <CameraIcon className="h-4 w-4 " />
                <select className="ml-2 pl-2 pr-2 bg-transparent " onChange={handleCameraChange} value={selectedDeviceId}>
                  {videoDevices.map((device, index) => (
                    <option key={device.deviceId} value={device.deviceId}>{`Camera ${index + 1}`}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" id="shareMainChatCheckbox" checked={shareMainChat} onChange={handleShareMainChat} className="mr-2" />
                <MessageCircle className="h-4 w-4 " />
              </label>
            </div>
          </div>
          <div className="flex flex-col relative">
            {shareCam && (
              <div className="p-2 max-w-96">
                <div className="relative">
                  <video id="video" className="w-full inset-0 rounded-md" width="640" height="480" autoPlay playsInline></video>
                </div>
              </div>
            )}
            <div className={`p-2 ${shareCam ? 'w-full' : 'w-full'}`}>
              <div id="responseContainer" className="p-2 bg-background/90 shadow rounded relative">
                {isWaiting && (
                  <div id="waitingIcon" className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-75">
                    <CogIcon className="loader absolute top-5 ease-linear text-muted-foreground rounded-full border-4 border-t-4 border-accent h-12 w-12" />
                  </div>
                )}

                {shareCam && (
                  <div className="w-full md:w-1/3 p-2 pl-0 relative">
                    <canvas id="snapshotCanvas" className="inset-0" width="80" height="60"
                      style={{ opacity: '0.4', display: screenshotAvailable ? 'block' : 'none' }}>
                    </canvas>
                  </div>
                )}

                <div id="responseText" className="text-wrap break-all"></div>
                <button id="stopAudioButton" onClick={stopAudio} className="absolute top-2 right-2 text-destructive hover:text-destructive/80 hidden" style={{ zIndex: 555 }}>
                  <StopCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OmniAssist;

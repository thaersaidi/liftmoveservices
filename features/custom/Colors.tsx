import React from 'react';

const ColorSwatch = ({ name, variable }) => (
  <div className="flex items-center mb-2">
    <div 
      className="w-8 h-8 mr-2 rounded" 
      style={{ backgroundColor: `hsl(var(${variable}))` }}
    ></div>
    <span>{name}</span>
  </div>
);

const ThemeSwatches = ({ theme }) => (
  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
    <h2 className="text-xl font-bold mb-4">{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</h2>
    <div className={theme}>
      <ColorSwatch name="Background" variable="--background" />
      <ColorSwatch name="Foreground" variable="--foreground" />
      <ColorSwatch name="Primary" variable="--primary" />
      <ColorSwatch name="Primary Foreground" variable="--primary-foreground" />
      <ColorSwatch name="Secondary" variable="--secondary" />
      <ColorSwatch name="Secondary Foreground" variable="--secondary-foreground" />
      <ColorSwatch name="Muted" variable="--muted" />
      <ColorSwatch name="Muted Foreground" variable="--muted-foreground" />
      <ColorSwatch name="Accent" variable="--accent" />
      <ColorSwatch name="Accent Foreground" variable="--accent-foreground" />
      <ColorSwatch name="Destructive" variable="--destructive" />
      <ColorSwatch name="Destructive Foreground" variable="--destructive-foreground" />
      <ColorSwatch name="Border" variable="--border" />
      <ColorSwatch name="Input" variable="--input" />
      <ColorSwatch name="Ring" variable="--ring" />
    </div>
  </div>
);

export default function TailwindColorSwatches() {
  return (
    <div className="flex flex-col space-y-4">
      <ThemeSwatches theme="light" />
      <ThemeSwatches theme="dark" />
    </div>
  );
}
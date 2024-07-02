import React, { useState, useRef } from 'react';
import './index.css';
import logo from './assets/logo.jpg';

const ImageStyleConverter = () => {
  const [image, setImage] = useState(null);
  const [transparency, setTransparency] = useState(50);
  const [color, setColor] = useState('#000000');
  const [convertedImage, setConvertedImage] = useState(null);
  const [addGradient, setAddGradient] = useState(false);
  const [gradientPercentage, setGradientPercentage] = useState(50);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const convertImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Apply color overlay
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = color;
      ctx.globalAlpha = transparency / 100;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply gradient if selected
      if (addGradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, color);
        ctx.globalAlpha = gradientPercentage / 100;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Reset composite operation and alpha
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      setConvertedImage(canvas.toDataURL());
    };
    img.src = image;
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = 'converted-image.png';
    link.click();
  };

  return (
    <div className="container">
      <h1>
        <img src={logo} alt="Logo" />
        Image Style Converter
      </h1>
      <div className="input-group">
        <label htmlFor="image-upload">Upload Image</label>
        <div className="flex items-center">
          <button onClick={() => fileInputRef.current.click()} className="mr-2">
            Choose File
          </button>
          <span className="text-sm text-gray-500">
            {image ? 'Image selected' : 'No file chosen'}
          </span>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      <div className="input-group">
        <label htmlFor="transparency">Transparency: {transparency}%</label>
        <input
          id="transparency"
          type="range"
          min={0}
          max={100}
          value={transparency}
          onChange={(e) => setTransparency(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="input-group">
        <label htmlFor="color">Brand Color</label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-32"
        />
        <span className="text-sm">{color}</span>
      </div>

      <div className="input-group flex-align-left">
        <input
          id="gradient"
          type="checkbox"
          checked={addGradient}
          onChange={(e) => setAddGradient(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="gradient" className="mr-2">Add Gradient</label>
        {addGradient && (
          <>
            <input
              id="gradient-percentage"
              type="range"
              min={0}
              max={100}
              value={gradientPercentage}
              onChange={(e) => setGradientPercentage(e.target.value)}
              className="w-full"
            />
            <span className="text-sm ml-2">{gradientPercentage}%</span>
          </>
        )}
      </div>

      <button onClick={convertImage} disabled={!image} className="w-full mb-4 bg-orange-500 text-white px-4 py-2 rounded convert-image">
        Convert Image
      </button>

      {convertedImage && (
        <button onClick={downloadImage} className="w-full mb-4 bg-black text-white px-4 py-2 rounded">
          Download Image
        </button>
      )}

      {image && (
        <div className="input-group">
          <h2>Original Image</h2>
          <img src={image} alt="Original" />
        </div>
      )}

      {convertedImage && (
        <div className="input-group">
          <h2>Converted Image</h2>
          <img src={convertedImage} alt="Converted" />
        </div>
      )}

      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default ImageStyleConverter;

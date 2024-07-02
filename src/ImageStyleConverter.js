import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Paintbrush, Download } from 'lucide-react';

const ImageStyleConverter = () => {
  const [image, setImage] = useState(null);
  const [transparency, setTransparency] = useState(50);
  const [color, setColor] = useState('#000000');
  const [convertedImage, setConvertedImage] = useState(null);
  const [addGradient, setAddGradient] = useState(false);
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
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, color);
        ctx.globalAlpha = 0.5;
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
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Image Style Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <Label htmlFor="image-upload" className="block mb-2">Upload Image</Label>
                <div className="flex items-center">
                  <Button 
                    onClick={() => fileInputRef.current.click()}
                    className="mr-2"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {image ? 'Image selected' : 'No file chosen'}
                  </span>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="transparency" className="block mb-2">Transparency: {transparency}%</Label>
                <Slider
                  id="transparency"
                  min={0}
                  max={100}
                  value={[transparency]}
                  onValueChange={(value) => setTransparency(value[0])}
                  className="w-full"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="color" className="block mb-2">Brand Color</Label>
                <div className="flex items-center">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 p-1 mr-2"
                  />
                  <span className="text-sm">{color}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="gradient" className="block mb-2">Add Gradient</Label>
                <div className="flex items-center">
                  <Input
                    id="gradient"
                    type="checkbox"
                    checked={addGradient}
                    onChange={(e) => setAddGradient(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Apply gradient overlay</span>
                </div>
              </div>
              
              <Button onClick={convertImage} disabled={!image} className="w-full mb-4">
                <Paintbrush className="mr-2 h-4 w-4" /> Convert Image
              </Button>
              
              {convertedImage && (
                <Button onClick={downloadImage} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>
              )}
            </div>
            
            <div>
              {image && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Original Image</h2>
                  <img src={image} alt="Original" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
              )}
              
              {convertedImage && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Converted Image</h2>
                  <img src={convertedImage} alt="Converted" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </div>
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageStyleConverter;

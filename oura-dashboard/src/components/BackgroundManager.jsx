import { useState, useEffect } from 'react';
import ParticlesBackground from './ParticlesBackground';

export default function BackgroundManager({ mode, onPrev, onNext, imageList, currentIndex }) {
  const [imageUrl, setImageUrl] = useState('');

  // Load image when mode is 'image' and index changes
  useEffect(() => {
    if (mode === 'image' && imageList.length > 0) {
      const base = import.meta.env.BASE_URL || '/';
      const item = imageList[currentIndex % imageList.length];
      // item is an object with 'filename', 'title', etc.
      const filename = item.filename;
      setImageUrl(`${base}data/images/image_gallery/${filename}`);
    }
  }, [mode, currentIndex, imageList]);

  if (mode === 'particles') {
    return <ParticlesBackground />;
  }

  // Image mode
  return (
    <div className="fixed inset-0 z-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageList[currentIndex]?.title || 'Background'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
          <p className="text-white/40">No images available</p>
        </div>
      )}
      {/* Navigation arrows – only show when image mode is active and we have images */}
      {imageList.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={onPrev}
            className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            ◀
          </button>
          <button
            onClick={onNext}
            className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            ▶
          </button>
        </div>
      )}
      {/* Optional: image counter */}
      {imageList.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
          {currentIndex + 1} / {imageList.length}
        </div>
      )}
    </div>
  );
}
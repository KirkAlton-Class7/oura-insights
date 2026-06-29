import { useState, useEffect } from 'react';
import ParticlesBackground from './ParticlesBackground';

export default function BackgroundManager({ 
  mode, 
  onPrev, 
  onNext, 
  imageList, 
  currentIndex,
  isSidebarCollapsed   // new prop
}) {
  const [imageUrl, setImageUrl] = useState('');

  // Load image when mode is 'image' and index changes
  useEffect(() => {
    if (mode === 'image' && imageList.length > 0) {
      const base = import.meta.env.BASE_URL || '/';
      const item = imageList[currentIndex % imageList.length];
      const filename = item.filename;
      setImageUrl(`${base}data/images/image_gallery/${filename}`);
    }
  }, [mode, currentIndex, imageList]);

  if (mode === 'particles') {
    return <ParticlesBackground />;
  }

  // Determine left margin based on sidebar state
  const leftButtonMargin = isSidebarCollapsed ? 'ml-4 xl:ml-20' : 'ml-4 xl:ml-72';

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

      {/* Navigation arrows */}
      {imageList.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
          <button
            onClick={onPrev}
            className={`pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors ${leftButtonMargin}`}
            aria-label="Previous image"
          >
            ◀
          </button>
          <button
            onClick={onNext}
            className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-4"
            aria-label="Next image"
          >
            ▶
          </button>
        </div>
      )}

      {/* Image counter */}
      {imageList.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-20">
          {currentIndex + 1} / {imageList.length}
        </div>
      )}
    </div>
  );
}
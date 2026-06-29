import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, RefreshCw, Bookmark, Copy, BookmarkCheck, Star, X } from 'lucide-react';
import Card from './Card';
import { writeClipboardText } from '../utils/clipboard';
import { QUOTES } from '../data/quotes';

export default function QuoteCard({ onCopyFailure, onCopySuccess }) {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setCurrentQuote(random);
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem('oura_quotes_favorites');
    const favs = stored ? JSON.parse(stored) : [];
    setFavorites(favs);
    if (currentQuote) {
      setSaved(favs.some(q => q.text === currentQuote.text && q.speaker === currentQuote.speaker));
    }
  };

  const refreshQuote = () => {
    setIsRefreshing(true);
    let newQuote;
    do {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    } while (QUOTES.length > 1 && newQuote.text === currentQuote?.text);
    setCurrentQuote(newQuote);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const copyQuote = async () => {
    if (!currentQuote) return;
    const text = `“${currentQuote.text}” — ${currentQuote.speaker || 'Unknown'}`;
    try {
      await writeClipboardText(text);
      onCopySuccess?.('Quote copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy quote:', error);
      onCopyFailure?.(text, 'quote');
    }
  };

  const toggleSave = () => {
    if (!currentQuote) return;
    const newFavs = saved
      ? favorites.filter(q => q.text !== currentQuote.text || q.speaker !== currentQuote.speaker)
      : [...favorites, { text: currentQuote.text, speaker: currentQuote.speaker }];
    setFavorites(newFavs);
    localStorage.setItem('oura_quotes_favorites', JSON.stringify(newFavs));
    setSaved(!saved);
  };

  const removeFavorite = (quote, e) => {
    e.stopPropagation();
    const newFavs = favorites.filter(q => q.text !== quote.text || q.speaker !== quote.speaker);
    setFavorites(newFavs);
    localStorage.setItem('oura_quotes_favorites', JSON.stringify(newFavs));
    if (currentQuote && quote.text === currentQuote.text && quote.speaker === currentQuote.speaker) {
      setSaved(false);
    }
  };

  if (!currentQuote) return null;

  return (
    <>
      <Card
        title="Featured Quote"
        subtitle="Inspiration from the community"
        snapshotText={`“${currentQuote.text}” — ${currentQuote.speaker || 'Unknown'}`}
        snapshotLabel="Quote snapshot"
        onCopyFailure={onCopyFailure}
        onCopySuccess={onCopySuccess}
      >
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          
          <blockquote className="space-y-4 relative z-10">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="flex-shrink-0"
              >
                <Quote className="w-8 h-8 text-purple-400 opacity-50" />
              </motion.div>
              
              <motion.p
                key={currentQuote.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-base lg:text-lg leading-relaxed text-slate-200 flex-1"
              >
                “{currentQuote.text}”
              </motion.p>
            </div>
            
            <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div>
                <p className="text-sm font-medium bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent">
                  — {currentQuote.speaker || 'Unknown'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={copyQuote}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors relative group"
                  title="Copy quote"
                >
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                </motion.button>
                
                <motion.button
                  onClick={refreshQuote}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Refresh quote"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? 'animate-spin' : 'hover:text-slate-200'}`} />
                </motion.button>
                
                <motion.button
                  onClick={toggleSave}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title={saved ? 'Remove from saved' : 'Save quote'}
                >
                  {saved ? (
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShowFavorites(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="View favorites"
                >
                  <Star className="w-4 h-4 text-slate-400 hover:text-yellow-400" />
                </motion.button>
              </div>
            </footer>
          </blockquote>
        </div>
      </Card>

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowFavorites(false)}>
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-slate-100">⭐ Favorite Quotes</h2>
              <button onClick={() => setShowFavorites(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favorites.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No favorites yet. Click the bookmark button to save quotes!</p>
              ) : (
                favorites.map((fav, idx) => (
                  <div key={idx} className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/10">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">“{fav.text.substring(0, 100)}...”</p>
                        <p className="text-xs text-slate-400 mt-1">— {fav.speaker || 'Unknown'}</p>
                      </div>
                      <button onClick={(e) => removeFavorite(fav, e)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all" title="Remove">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(10);
  const [isDark, setIsDark] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sync state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const textParam = params.get('text');
    if (textParam) {
      setText(textParam);
    }
    const sizeParam = params.get('size');
    if (sizeParam && !isNaN(Number(sizeParam))) {
      setFontSize(Number(sizeParam));
    }
    const darkParam = params.get('dark');
    if (darkParam === 'true') {
      setIsDark(true);
    }
  }, []);

  // Sync state to URL on change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (text) {
      params.set('text', text);
    } else {
      params.delete('text');
    }
    if (fontSize !== 10) {
      params.set('size', fontSize.toString());
    } else {
      params.delete('size');
    }
    if (isDark) {
      params.set('dark', 'true');
    } else {
      params.delete('dark');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [text, fontSize, isDark]);

  // Sync document title
  useEffect(() => {
    if (text) {
      document.title = `cc: ${text}`;
    } else {
      document.title = 'CueCard';
    }
  }, [text]);

  const handleFullscreen = () => {
    if (previewRef.current) {
      const elem = previewRef.current as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // iOS / Safari
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11 / Edge
      }
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans transition-colors duration-200 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Settings & Input Area */}
      <header className={`p-4 md:p-6 shadow-sm flex flex-col gap-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            CueCard
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full transition-colors">
              <span className="text-gray-600 dark:text-gray-300">文字サイズ</span>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-24 accent-blue-600"
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full transition-colors">
              <input
                type="checkbox"
                checked={isDark}
                onChange={(e) => setIsDark(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span className="text-gray-600 dark:text-gray-300">ダークモード</span>
            </label>

            <button
              onClick={handleFullscreen}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all sm:w-auto w-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95"
            >
              全画面表示
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここにテキストを入力すると下に大きくプレビューされます..."
          className={`w-full p-4 border rounded-xl resize-y h-32 md:h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg ${isDark ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 shadow-inner' : 'bg-gray-50 border-gray-300 text-black placeholder-gray-400 shadow-inner'
            }`}
        />
      </header>

      {/* Fullscreen Preview Area */}
      <main
        ref={previewRef}
        className={`flex-1 p-6 md:p-12 flex items-center justify-center overflow-auto selection:bg-blue-300 selection:text-blue-900 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
      >
        <div
          className="w-full text-center whitespace-pre-wrap break-words min-h-[40vh] flex items-center justify-center font-bold"
          style={{ fontSize: `${fontSize}rem`, lineHeight: '1.2' }}
        >
          {text || <span className="opacity-20 select-none font-normal">CueCard</span>}
        </div>
      </main>
    </div>
  );
}

export default App;

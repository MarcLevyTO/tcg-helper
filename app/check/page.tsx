'use client';

import { useState, useMemo } from 'react';

type GradientType = 'linear' | 'radial';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export default function Check() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#3b82f6', position: 0 },
    { id: '2', color: '#ef4444', position: 100 },
  ]);

  const gradientString = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (type === 'radial') {
      return `radial-gradient(circle, ${stopString})`;
    }
    return `linear-gradient(${angle}deg, ${stopString})`;
  }, [type, angle, stops]);

  const addStop = () => {
    const newStop: GradientStop = {
      id: Math.random().toString(36).substr(2, 9),
      color: '#22c55e',
      position: 50,
    };
    setStops([...stops, newStop]);
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(
      stops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop))
    );
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradientString};`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Gradient Generator
          </h1>
          <p className="text-gray-400">Create beautiful CSS gradients instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="space-y-4">
            <div
              className="aspect-square w-full rounded-3xl shadow-2xl border border-gray-800 transition-all duration-300"
              style={{ background: gradientString }}
            />
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
              <div className="relative bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between">
                <code className="text-sm text-blue-300 font-mono truncate mr-4">
                  background: {gradientString};
                </code>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800 space-y-8">
            {/* Type & Angle */}
            <div className="space-y-4">
              <div className="flex gap-4 p-1 bg-gray-900 rounded-xl border border-gray-800">
                {(['linear', 'radial'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${type === t
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {type === 'linear' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Angle</span>
                    <span className="text-white font-mono">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                </div>
              )}
            </div>

            {/* Stops */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Stops</span>
                <button
                  onClick={addStop}
                  className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors font-medium border border-blue-500/20"
                >
                  + Add Stop
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="group bg-gray-900 rounded-xl p-3 border border-gray-800 hover:border-gray-700 transition-colors flex items-center gap-3"
                  >
                    <div className="relative">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
                      />
                      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 pointer-events-none" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Position</span>
                        <span className="text-gray-300 font-mono">{stop.position}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          updateStop(stop.id, { position: Number(e.target.value) })
                        }
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                      />
                    </div>

                    <button
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length <= 2}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent"
                      title="Remove stop"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useSpeech } from '@/hooks/useSpeech';

const SPEED_OPTIONS = [
  { label: 'Slow', value: 0.9 },
  { label: 'Normal', value: 1.0 },
  { label: 'Brisk', value: 1.1 },
  { label: 'Fast', value: 1.2 },
  { label: 'Faster', value: 1.3 },
  { label: 'Fastest', value: 1.4 },
];

function groupVoices(voices: SpeechSynthesisVoice[]) {
  const groups: Record<string, SpeechSynthesisVoice[]> = {};
  for (const v of voices) {
    if (!groups[v.lang]) groups[v.lang] = [];
    groups[v.lang].push(v);
  }
  return groups;
}

export default function TTSControls({ text }: { text: string }) {
  const { speak, pause, resume, stop, speaking, paused, rate, setRate, voice, voices, setVoice } = useSpeech();
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  const voiceGroups = groupVoices(englishVoices);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {!speaking ? (
          <button
            onClick={() => speak(text)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-teal-bg rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Read Aloud
          </button>
        ) : (
          <>
            {paused ? (
              <button onClick={resume} className="flex items-center gap-2 px-4 py-2 bg-white text-teal-bg rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume
              </button>
            ) : (
              <button onClick={pause} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pause
              </button>
            )}
            <button onClick={stop} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
              Stop
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-[11px] text-white/40">Speed</span>
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="text-xs bg-teal-hover border border-teal-border/40 rounded-md px-2 py-1 text-white"
          >
            {SPEED_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label} ({value}x)</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
          </svg>
          <span className="text-[11px] text-white/40">Voice</span>
          <select
            value={voice || ''}
            onChange={(e) => setVoice(e.target.value)}
            className="text-xs bg-teal-hover border border-teal-border/40 rounded-md px-2 py-1 max-w-[180px] truncate text-white"
          >
            {!voice && <option value="">Loading...</option>}
            {Object.entries(voiceGroups).map(([lang, list]) => (
              <optgroup key={lang} label={lang}>
                {list.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

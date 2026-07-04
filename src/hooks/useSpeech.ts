'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

function findBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const ms = voices.filter((v) => v.name.includes('Microsoft') && v.name.includes('Online'));
  const msEn = ms.find((v) => v.lang === 'en-US' || v.lang === 'en-GB');
  if (msEn) return msEn;
  const preferred = ['Daniel', 'Alex', 'Fred', 'Tom', 'David', 'Mark', 'Samantha', 'Karen', 'Moira', 'Zira'];
  for (const name of preferred) {
    const found = voices.find((v) => v.name.includes(name));
    if (found) return found;
  }
  const english = voices.find((v) => v.lang.startsWith('en'));
  return english || voices[0] || null;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRateState] = useState(0.8);
  const [voice, setVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rateRef = useRef(0.8);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const init = () => {
      const all = window.speechSynthesis.getVoices();
      setAvailableVoices(all);
      const best = findBestVoice(all);
      setVoiceState(best);
      voiceRef.current = best;
    };
    if (window.speechSynthesis.getVoices().length) init();
    window.speechSynthesis.addEventListener('voiceschanged', init);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', init);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rateRef.current;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    if (voiceRef.current) utterance.voice = voiceRef.current;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    utterance.onpause = () => setPaused(true);
    utterance.onresume = () => setPaused(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  const pause = useCallback(() => {
    if (speaking && !paused) window.speechSynthesis.pause();
  }, [speaking, paused]);

  const resume = useCallback(() => {
    if (paused) window.speechSynthesis.resume();
  }, [paused]);

  const setRate = useCallback((newRate: number) => {
    rateRef.current = newRate;
    setRateState(newRate);
    if (utteranceRef.current) utteranceRef.current.rate = newRate;
  }, []);

  const setVoice = useCallback((voiceName: string) => {
    const found = availableVoices.find((v) => v.name === voiceName) || null;
    voiceRef.current = found;
    setVoiceState(found);
    if (utteranceRef.current && found) {
      utteranceRef.current.voice = found;
    }
  }, [availableVoices]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return {
    speak, pause, resume, stop, speaking, paused,
    rate, setRate,
    voice: voice?.name || null,
    voices: availableVoices,
    setVoice,
  };
}

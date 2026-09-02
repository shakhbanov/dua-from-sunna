import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Owns the hidden <audio> element for one dua.
 *
 * A dua's recitation can span several files — a Quranic dua covering 20:25-28
 * resolves one recitation per ayah — so the hook walks `segments` in order and
 * keeps playing across the seam.
 *
 * There is no reset path: the owner mounts this under a key that changes with
 * the dua, so a new dua gets a fresh player rather than a cleared one.
 */
export function useAudioPlayer(segments: string[], onFinished: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  // Set when the next segment should start playing by itself, i.e. the previous
  // one ended rather than the listener picking a different dua.
  const resumeOnSegmentChange = useRef(false);
  // Latest speed/volume for the load effect, which restores them on a fresh
  // <audio> src but must not re-run every time the listener nudges a slider.
  const speedRef = useRef(playbackSpeed);
  const volumeRef = useRef(volume);

  // Load the current segment. Runs again when auto-advancing within a dua,
  // in which case playback continues seamlessly into the next file.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const src = segments[segmentIndex];
    if (!src) {
      audio.pause();
      audio.removeAttribute('src');
      return;
    }

    audio.src = src;
    audio.load();
    // Restore volume/speed after load
    audio.playbackRate = speedRef.current;
    audio.volume = volumeRef.current;

    if (resumeOnSegmentChange.current) {
      resumeOnSegmentChange.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [segments, segmentIndex]);

  const handleEnded = useCallback(() => {
    // Still inside the same dua — roll on to its next ayah.
    if (segmentIndex < segments.length - 1) {
      resumeOnSegmentChange.current = true;
      setSegmentIndex((i) => i + 1);
      setCurrentTime(0);
      return;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    onFinished();
  }, [segmentIndex, segments.length, onFinished]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleEnded]);

  useEffect(() => {
    speedRef.current = playbackSpeed;
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || segments.length === 0) return;
    audio.play().then(() => setIsPlaying(true)).catch(console.error);
  }, [segments.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || segments.length === 0) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(console.error);
    setIsPlaying(!isPlaying);
  }, [isPlaying, segments.length]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  return {
    audioRef,
    segmentIndex,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    volume,
    setPlaybackSpeed,
    setVolume,
    play,
    togglePlay,
    seek,
    skip,
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import Header from './components/layout/Header';
import SidebarLeft from './components/layout/SidebarLeft';
import SidebarRight from './components/layout/SidebarRight';
import CanvasArea from './components/canvas/CanvasArea';
import GuideModal from './components/GuideModal';
import Timeline from './components/layout/Timeline';
import { useAppStore } from './store/useAppStore';

export default function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        useAppStore.getState().setIsPlaying(!useAppStore.getState().isPlaying);
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        const selectedId = useAppStore.getState().selectedLayerId;
        if (selectedId) useAppStore.getState().removeLayer(selectedId);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        useAppStore.temporal.getState().undo();
      } else if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault();
        useAppStore.temporal.getState().redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        <main className="flex-1 relative bg-zinc-900 overflow-hidden flex flex-col">
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <CanvasArea />
          </div>
          <Timeline />
        </main>
        <SidebarRight />
      </div>
      <GuideModal />
    </div>
  );
}



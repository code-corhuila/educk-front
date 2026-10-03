import React, { Suspense } from 'react';

// Shell using Module Federation to load remotes
export default function App() {
  return (
    <div className="shell-layout">
      <h1>EduTrack Shell</h1>
      <Suspense fallback={<div>Loading Portal...</div>}>
         {/* Here remote portals will be loaded via Module Federation instead of Iframes */}
      </Suspense>
    </div>
  );
}

# classroom feature

**Status:** implemented — see `backend/src/modules/lessons` for the corresponding API and `backend/src/services/socket.service.ts` for the `lesson:<bookingId>` real-time rooms.

**Video:** mock provider only (`services/videoProvider.ts`) — the local participant's camera/microphone/screen-share use the real browser `getUserMedia`/`getDisplayMedia` APIs (that tile is genuinely your own camera), but there is no real peer connection between the two participants' browsers. The remote tile is an avatar whose mic/camera icons are kept accurate via a real-time relay of the other person's actual toggle state, never a fake video stream. A real WebRTC/video provider would implement `VideoProviderAdapter` and swap in for `MockVideoProvider` without touching any component.

**Whiteboard:** a real `<canvas>` (`WhiteboardCanvas.tsx`) — pen/highlighter/eraser/rectangle/ellipse/text, undo/redo/clear, PNG export, persisted server-side as a replayable stroke log (`GET/PUT /lessons/:id/whiteboard`) and synced live between both participants over the socket.

**Chat/notes/resources:** real, backed by `backend/src/modules/lessons`, not mock data.

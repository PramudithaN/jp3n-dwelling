---
title: "Battery Telemetry Utility"
tagline: "Minimal, zero-overhead browser utility for real-time hardware battery telemetry."
category: "opensource"
liveUrl: "https://battery.nipun.is-a.dev/"
status: "production"
techStack: ["Navigator.getBattery()", "Vanilla JS", "Zero External Dependencies"]
metrics:
  bundleSize: "1.2KB unminified"
  runtimeMemory: "< 2MB"
  networkCalls: "0"
featuredOrder: 1
---

## Structural Overview
Battery Telemetry is a lean browser utility created to observe charging states, thermal health, and discharge rates directly through the browser’s native Battery Status API.

### Engineering Intent
Most hardware utility sites bundle megabytes of tracking pixels, analytics beacons, and bloated UI frameworks just to render three numbers. This project strips away all intermediate layers:
- Single HTML payload with zero runtime framework weight.
- Immediate paint on low-end hardware.
- Real-time reactive updates without polling loops or memory leaks.

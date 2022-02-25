import * as Stats from "stats.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export function initStats() {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  return stats;
}

export function initTrackballControls(camera, renderer) {
  return new TrackballControls(camera, renderer.domElement);
}

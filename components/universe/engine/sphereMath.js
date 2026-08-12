/** Spherical → Cartesian on globe radius */
export function spherePoint(theta, phi, radius = 1) {
  const sinPhi = Math.sin(phi);
  return {
    x: radius * sinPhi * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * sinPhi * Math.sin(theta),
  };
}

export function fibonacciPoints(count, radius = 1) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({
      x: radius * Math.cos(theta) * r,
      y: radius * y,
      z: radius * Math.sin(theta) * r,
    });
  }
  return points;
}

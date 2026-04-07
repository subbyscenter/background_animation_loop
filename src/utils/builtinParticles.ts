export const builtinParticlesGlob = import.meta.glob('/src/assets/particles/*.png', { eager: true, query: '?url', import: 'default' });

export const builtinParticles = Object.entries(builtinParticlesGlob).map(([path, url]) => {
  const name = path.split('/').pop() || 'Unknown';
  return { id: path, name, url: url as string, isBuiltin: true };
});

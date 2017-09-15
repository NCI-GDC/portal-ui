export const overlaps = (a, b) => {
  const first = a.start < b.start ? a : b;
  const last = first.start === a.start ? b : a;
  return first.end > last.start;
};

const separateOverlapping = data => {
  return data.reduce((acc, d) => {
    const index = acc.findIndex(level => level.every(l => !overlaps(l, d)));

    if (index > -1) acc[index].push(d);
    else acc.push([d]);

    return acc;
  }, []);
};

export default separateOverlapping;

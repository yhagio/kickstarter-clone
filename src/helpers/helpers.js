export const getDayTilEnd = (endDate) => {
  let timeDiff = Math.abs(new Date(endDate).getTime() - new Date().getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

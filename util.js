// converts from milimeters to pixels
function mm2px(mm, ppi) {
  return Math.ceil((mm / 25.4 * ppi));
}


// map function
Math.map = function (value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


// returns the distance between two points (x1, y1) & (x2, y2)
Math.dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}


// returns the intersection point {x,y} between two lines or null
Math.intersect = function (x1, y1, x2, y2, x3, y3, x4, y4) {
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // Lines are parallel
  if (denominator === 0) {
    return null;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  // Return an object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);
  return [x, y];
}

Math.angleRadians = function (x1, y1, x2, y2) {
  return Math.atan2(y2-y1, x2-x1);
}


// returns TimeStamp for file naming
function getTimeStamp() {
  let date = new Date();
  let formatted_date = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + "-" + date.getHours() + "." + date.getMinutes() + "." + date.getSeconds();
  return formatted_date;
}
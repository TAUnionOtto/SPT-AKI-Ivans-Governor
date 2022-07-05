const ndRandom = (min, max, skew) => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let result = Math.sqrt(-2.0 * Math.log(u)) * Math.cos( 2.0 * Math.PI * v );

  result = result / 10.0 + 0.5; // Translate to 0 -> 1
  if (result > 1 || result < 0) result = ndRandom(min, max, skew); // resample between 0 and 1 if out of range
  result = Math.pow(result, skew); // Skew
  result *= max - min; // Stretch to fill range
  result += min; // offset to min
  return result;
}

const resultCountMap = {};
let loop = 100000;
while (loop > 0) {
  const result = Math.floor(ndRandom(45, 315, 1.95));
  resultCountMap[result] = (resultCountMap[result] + 1) || 1;
  loop--;
}

console.log(resultCountMap);
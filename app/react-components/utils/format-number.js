export default number =>
  `${number}`
    .split('')
    .reverse()
    .reduce((num, digit, i) => `${digit}${!i || i % 3 ? '' : ','}${num}`, '');

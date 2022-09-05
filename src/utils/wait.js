const wait = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 3000);
  });
};

export default wait;

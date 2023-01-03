module.exports = async () => {
  return {
    foo: "This is a dynamic title: " + Math.random(),
  };
};

// module.exports = {
//   foo: "This is a dynamic title",
// };

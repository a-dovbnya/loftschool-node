module.exports.validation = (productName, productPrice, name, size) => {
  if (name === "" || size === 0) {
    return { status: "Не загружена картинка!", err: true };
  }
  if (!productName) {
    return { status: "Не указано описание картинки!", err: true };
  }
  if (!productPrice) {
    return { status: "Не указана цена!", err: true };
  }
  return { status: "Ok", err: false };
};

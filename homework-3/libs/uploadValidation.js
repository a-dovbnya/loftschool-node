module.exports.validate = (fields, files) => {
  if (files.photo.name === "" || files.photo.size === 0) {
    return { status: "Не загружена картинка!", err: true };
  }
  if (!fields.name) {
    return { status: "Не указано описание картинки!", err: true };
  }
  if (!fields.price) {
    return { status: "Не указана цена!", err: true };
  }
  return { status: "Ok", err: false };
};

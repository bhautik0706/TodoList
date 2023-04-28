exports.sendCreateResponce = (res, message, data) => {
  res.status(201).json({ error: false, message: "success", data });
};

exports.sendEmptyResponce = (res) => {
  res.status(404).json({ error: true, message: "Content can not be empty" });
};

exports.sendSuccessResponce = (
  res,
  message,
  data,
  totalPages,
  currentPage,
  totalRecord
) => {
  res.status(200).json({
    error: false,
    message,
    data,
    totalPages,
    currentPage,
    totalRecord,
  });
};

exports.sendUnauthorized = (res, message) => {
  res.status(401).json({ error: true, message});
};

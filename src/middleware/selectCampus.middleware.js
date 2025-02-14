module.exports = (req, res, next) => {
  const { campusId } = req.headers;
  if (!campusId) {
    return res
      .status(400)
      .json({ success: false, message: "Sede no seleccionada" });
  }
  req.campusId = campusId;
  next();
};

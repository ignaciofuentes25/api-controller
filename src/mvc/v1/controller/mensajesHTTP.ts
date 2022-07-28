module.exports.read200 = (res: any, data: any) => {
  res.status(200);
  res.json({
    status: 1,
    message: "Data found successfully",
    Data: data,
  });
  return res;
};

module.exports.error = (res: any, result: any, data?: any) => {
  res.status(400);
  res.json({
    status: 0,
    message: "[ORCL] Database Error: " + result,
    row_length: 0,
    Data: data !== undefined ? data : [],
  });
  return res;
};

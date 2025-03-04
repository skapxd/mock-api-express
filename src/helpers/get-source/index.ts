export const getSource = (inValue: string, req) => {
  switch (inValue) {
    case "body":
      return req.body;
    case "query":
      return req.query;
    case "param":
      return req.params;
    default:
      return {};
  }
};

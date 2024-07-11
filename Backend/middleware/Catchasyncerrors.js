const asyncHandler = (fn) => {
    return async (req, res, next) => {
      try {
        const result = await fn(req, res, next);
        if (result) { 
          res.status(200).json(result);
        }
      } catch (error) {
     
        // console.error(error.stack); ?
        console.error(error.message); 
        next(error);
      }
    };
  };
  
  module.exports = asyncHandler;
  
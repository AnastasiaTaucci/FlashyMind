import { Request, Response, NextFunction } from 'express';


const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  req.pagination = {
    page,
    limit,
  };

  next();
};

export default paginationMiddleware;
import { Router, Request, Response, NextFunction } from 'express';

export class DefaultRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async testRunning(req: Request, res: Response, next: NextFunction) {
    res.render('default', { title: 'node Web API Running' });
  }

  init() {
    this.router.get('/', this.testRunning);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const defaultRouter = new DefaultRouter().router;

export default defaultRouter;

import { Router, Request, Response, NextFunction } from 'express';
import { CoreMenuItem, BasicUser, DashboardModel } from '@ngscaffolding/models';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';
import { checkUser } from '../../auth/checkUser';
import { forkJoin } from 'rxjs';

const winston = require('../../config/winston');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class MenuItemRouter {
  router: Router;
  private dataAccess: IDataAccessLayer;

  constructor() {
    this.router = Router();
    this.init();

    this.dataAccess = DataSourceSwitch.default as IDataAccessLayer;
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      var userDetails = req['userDetails'] as BasicUser;
      var dataAccess = DataSourceSwitch.default.dataSource;

      forkJoin([dataAccess.getMenuItems(), dataAccess.getAllWidgets()]).subscribe(
        resultsCol => {
          let allMenuItems = resultsCol[0];

          var userMenuItems = allMenuItems.filter(menu => checkUser(userDetails, menu));

          userMenuItems
            .filter(menu => menu.type && menu.type === 'dashboard')
            .forEach(menu => {
              let dashboard = menu.menuDetails as DashboardModel;
              dashboard.widgets.forEach(widget => {
                widget.widget = resultsCol[1].find(searchWidget => searchWidget.name === widget.widgetName);
              });
            });

          // Treeisize The flat list
          var treeMenuItems: CoreMenuItem[] = [];

          // First Root elements
          userMenuItems
            .filter(menu => !menu.parent)
            .forEach(menu => {
              treeMenuItems.push(menu);
            });

          // Now non-root
          userMenuItems
            .filter(menu => menu.parent)
            .forEach(menu => {
              let parentMenu = treeMenuItems.find(loopmenu => loopmenu.name === menu.parent);
              if (parentMenu) {
                if (!parentMenu.items) {
                  parentMenu.items = [];
                }
                let parentItems = parentMenu.items as CoreMenuItem[];

                parentItems.push(menu as CoreMenuItem);
              }
            });

          //Clear down items collections
          treeMenuItems.forEach(menuItem => {
            MenuItemRouter.nullItemsCollection(menuItem);
          });

          res.json(treeMenuItems);
        },
        err => {
          winston.error(err);
          res.status(404);
          res.send('Error');
        }
      );
    } catch (err) {
      winston.error(err);
      res.status(404);
      res.send('Error');
    }
  }

  public static nullItemsCollection(menuItem: CoreMenuItem) {
    if (menuItem.items && menuItem.items.length > 0) {
      let menuItems: CoreMenuItem[] = menuItem.items as CoreMenuItem[];

      menuItems.forEach(loopMenuItem => {
        this.nullItemsCollection(loopMenuItem);
      });
    } else {
      menuItem.items = undefined;
    }
  }

  public async deleteMenuItem(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as BasicUser;
    var dataAccess = DataSourceSwitch.default.dataSource;

    const name = req.params.name;
    if (name.startsWith(userDetails.userId)) {
      dataAccess.deleteMenuItem(name).subscribe(
        () => {
          res.json('Deleted');
        },
        err => {
          winston.error(err);
          res.status(404);
          res.send('Error');
        }
      );
    } else {
      res.status(401);
      res.send('Unauthorised to delete Menu');
    }
  }

  public async getMenuItem(req: Request, res: Response, next: NextFunction) {
    const name = req.query.name;
    const MenuItem = await this.dataAccess.getMenuItem(name);
    res.json(MenuItem);
  }

  public async addMenuItem(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as BasicUser;
    var dataAccess = DataSourceSwitch.default.dataSource;

    var MenuItem = req.body as CoreMenuItem;

    dataAccess.saveMenuItem(MenuItem as CoreMenuItem).subscribe(newMenuItem => {
      res.json(newMenuItem);
    });
  }

  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:name', this.getMenuItem);
    this.router.delete('/:name', this.deleteMenuItem);
    this.router.post('/', this.addMenuItem);
  }
}

const menuItemRouter = new MenuItemRouter().router;

export default menuItemRouter;

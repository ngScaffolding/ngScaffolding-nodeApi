import * as fs from 'fs';
import { join } from 'path';
import { ConnectionOptions } from 'mongoose';

import { ApplicationLogModel, IApplicationLog } from './models/applicationLog.model';
import { UserPreferenceDefinitionModel, IUserPreferenceDefinition } from './models/userPreferenceDefinition.model';
import { MenuItemModel, IMenuItem } from './models/menuItem.model';
import { ReferenceValueModel, IReferenceValue } from './models/referenceValue.model';
import { ReferenceValue, ErrorModel, UserPreferenceValue, AppSettingsValue, Role } from '@ngscaffolding/models';
import { DataSourceModel, IDataSource } from './models/dataSource.model';
import { ErrorLogModel, IError } from './models/error.model';
import { IDataAccessLayer } from '../dataAccessLayer';
import { UserPreferenceValueModel } from './models/userPreferenceValue.model';
import { WidgetModel, IWidget } from './models/widget.model';
import { AppSettingModel } from './models/appSetting.model';
import { RoleModel } from './models/role.model';

require('dotenv').config();

var winston = require('../../config/winston');

const mongoose = require('mongoose');

export class Database {
  private static _database: Database;

  private constructor() {
    mongoose.Promise = global.Promise;

    let options: ConnectionOptions = <ConnectionOptions>{
      promiseLibrary: global.Promise
    };

    //TODO: Need to stop this connection
    if (process.env.DB_HOST) {
      mongoose.connect(process.env.DB_HOST, options).catch((err: Error) => {
        winston.error(err, `Error connecting to Mongodb`);
      });
    }

    // When successfully connected
    mongoose.connection.on('connected', () => {
      winston.info('Mongoose default connection open to ', process.env.DB_HOST);
    });

    // If the connection throws an error
    mongoose.connection.on('error', err => {
      winston.error(err, 'Mongoose default connection error: ');
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      winston.error('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        winston.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });
  }

  static get instance() {
    if (!Database._database) {
      Database._database = new Database();
    }
    return Database._database;
  }

  initialise(): boolean {
    winston.info('Connecting to Database');
    return typeof Database.instance != 'undefined';
  }

  public async addApplicationLog(appLog: IApplicationLog): Promise<IApplicationLog> {
    const newUser = await ApplicationLogModel.create(appLog);
    return newUser;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Roles Section
  //
  // //////////////////////////////////////////////////////////////////
  public async getRoles(): Promise<Role[]> {
    const roles = await RoleModel.find({});
    return roles;
  }
  public async deleteRole(name: string): Promise<null> {
    return await RoleModel.findOneAndRemove({name: name});
  }

  public async addRole(role: Role): Promise<null> {
    return await RoleModel.add(role);
  }

  public async updateRole(role: Role): Promise<null> {
    return await RoleModel.findOneAndUpdate({name: name}, role);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Data Source Section
  //
  // //////////////////////////////////////////////////////////////////

  public async getDataSource(name: string): Promise<IDataSource> {
    const menuItem = await DataSourceModel.findOne({ name: name });
    return menuItem;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Menu Items Section
  //
  // //////////////////////////////////////////////////////////////////

  public async getMenuItems(): Promise<Array<IMenuItem>> {
    const menuItems = await MenuItemModel.find({});
    return menuItems;
  }

  public async getMenuItem(name: string): Promise<IMenuItem> {
    const menuItem = await MenuItemModel.findOne({ name: name });
    return menuItem;
  }

  public async addMenuItem(MenuItem: IMenuItem): Promise<IMenuItem> {
    const newMenuItem = await MenuItemModel(MenuItem).save();
    return newMenuItem;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values Section
  //
  // //////////////////////////////////////////////////////////////////

  public async getReferenceValuesByName(name: string): Promise<ReferenceValue[]> {
    const menuItem = await ReferenceValueModel.findOne({ name: name });
    return menuItem;
  }

  public async getReferenceValuesForGroup(group: string): Promise<ReferenceValue[]> {
    const menuItem = await ReferenceValueModel.find({ groupName: group });
    return menuItem;
  }

  public async addReferenceValue(referenceValue: IReferenceValue) {
    const newItem = await ReferenceValueModel(referenceValue).save();
    return newItem;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Error Section
  //
  // //////////////////////////////////////////////////////////////////

  public async addError(error: IError) {
    const newError = await ErrorLogModel(error).save();
    return newError;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // UserPreferenceDefinitions Section
  //
  // //////////////////////////////////////////////////////////////////

  public async getUserPreferenceDefinitions() {
    const prefs = await UserPreferenceDefinitionModel.find({});
    return prefs;
  }

  public async getUserPreferenceValues(userId: string) {
    const prefs = await UserPreferenceValueModel.find({ userId: userId });
    return prefs;
  }

  //////////////////////////////////////////////////////////////////
  //
  // AppSettings Section
  //
  // //////////////////////////////////////////////////////////////////
  public async getAppSettings(): Promise<AppSettingsValue[]> {
    const appSettings = await AppSettingModel.find({});
    return appSettings;
  }

  //////////////////////////////////////////////////////////////////
  //
  // Widget Section
  //
  // //////////////////////////////////////////////////////////////////
  public async getWidget(name: string): Promise<IWidget> {
    const widget = await WidgetModel.findOne({ name: name });
    return widget;
  }
  public async getAllWidgets() {
    const widgets = await WidgetModel.find({});
    return widgets;
  }

  // addUser(user: User): Promise<User> {
  //   if (!user) {
  //     winston.warn(`No user provided to save!`)
  //     return Promise.reject(`User cannot be null for adding them to the database`)
  //   }
  //   return new UserModel(user).save()
  // }

  // getUserById(id: string): Promise<User> {
  //   if (!id) {
  //     return Promise.reject(`No ID provided to find user with`)
  //   }

  //   return UserModel
  //     .findById(id)
  //     .then((user) => {
  //       if (!user) {
  //         return Promise.resolve(null)
  //       }
  //       return Promise.resolve(user)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong finding a user with id: ${id}`)
  //       return Promise.reject(new NoUserFoundError(`No User found with ID: ${id}`))
  //     })
  // }

  // getUserByEmail(email: string): Promise<User> {
  //   if (!email) {
  //     return Promise.reject(`No Email provided to find user with`)
  //   }
  //   return UserModel
  //     .findOne({email})
  //     .then((user) => {
  //       if (!user) {
  //         return Promise.resolve(null)
  //       }
  //       return Promise.resolve(user)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong finding a user with email: ${email}`)
  //       return Promise.reject(new NoUserFoundError(`No User found with email: ${email}`))
  //     })
  // }

  // updatePasswordForUser(id: string, password: string): Promise<User> {
  //   if (!id) {
  //     return Promise.reject(`No ID provided to set password for`)
  //   }

  //   if (!password) {
  //     return Promise.reject(`No Password provided to set user: ${id} for`)
  //   }

  //   return UserModel
  //     .findOneAndUpdate(id, {
  //       '$set': {password},
  //     })
  //     .then((user: User) => {
  //       if (!user) {
  //         return Promise.resolve(null)
  //       }
  //       return Promise.resolve(user)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong updating user password for ID: ${id}`)
  //       return Promise.reject(new NoUserFoundError(`Failed to update user password for ${id}`))
  //     })
  // }

  // updateUser(user: User): Promise<User> {
  //   if (!user) {
  //     return Promise.reject(`No User provided to update`)
  //   }

  //   return new UserModel(user)
  //     .save()
  //     .then((user) => {
  //       if (!user) {
  //         return Promise.resolve(null)
  //       }
  //       return Promise.resolve(user)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong updating user with ID: ${user.id}`)
  //       return Promise.reject(new NoUserFoundError(`Failed to update user: ${user.id}`))
  //     })
  // }

  // disableUser(id: string): Promise<User> {
  //   if (!id) {
  //     return Promise.reject(`No User ID provided to disable`)
  //   }

  //   return UserModel
  //     .findOneAndUpdate({_id: id}, {'$set': {enabled: false}})
  //     .then((user) => {
  //       if (!user) {
  //         return Promise.reject(new NoUserFoundError(`Failed to delete User ID: ${id}`))
  //       }
  //       return Promise.resolve(user)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong disabling user with id: ${id}`)
  //       return Promise.reject(new NoUserFoundError(`Failed to delete User ID: ${id}`))
  //     })
  // }

  // searchUsers(filter: UserSearchFilter): Promise<SearchResult> {

  //   const query: any = {}

  //   if (typeof filter.enabled !== 'undefined') {
  //     query.enabled = filter.enabled
  //   }
  //   if (filter.email) {
  //     query.email = {$regex: filter.email}
  //   }
  //   if (filter.role) {
  //     query.role = filter.role
  //   }
  //   if (filter.text) {
  //     query.searchKey = {$regex: filter.text}
  //   }

  //   winston.info(`Search Request: ${JSON.stringify(query)}`)

  //   return UserModel.count(query)
  //     .then((total: number) => {
  //       winston.debug(`Found ${total} results`)
  //       if (total == 0) {
  //         return Promise.resolve(new SearchResult())
  //       }

  //       const skip: number = (filter.page - 1) * filter.limit
  //       if (total < skip) {
  //         winston.debug(`There are ${total} results in the collection, but the skip count (${skip}) is higher`)
  //         return Promise.resolve(new SearchResult(0, total))
  //       }

  //       return UserModel
  //         .find(query)
  //         .limit(filter.limit)
  //         .skip(skip)
  //         .then((users: User[]) => {
  //           const results = new SearchResult(users.length, total, users)
  //           return Promise.resolve(results)
  //         })
  //         .catch((err: Error) => {
  //           winston.error(err, `Unable to find users with filter: ${filter.toJSON()}`)
  //           return Promise.reject(err)
  //         })
  //     })

  // }

  // createPasswordResetRequest(prr: PasswordResetRequest): Promise<PasswordResetRequest> {
  //   if (!prr) {
  //     return Promise.reject(`No Password Reset Request provided to add`)
  //   }
  //   return new PasswordResetRequestModel(prr)
  //     .save()
  // }

  // getPasswordResetRequestById(id: string): Promise<PasswordResetRequest> {
  //   if (!id) {
  //     return Promise.reject(`No ID provided to find Password Reset Request with`)
  //   }

  //   return PasswordResetRequestModel
  //     .findById(id)
  //     .then((prr: PasswordResetRequest) => {
  //       if (!prr) {
  //         return Promise.reject(new NoRequestFoundError(`No Password Reset Request found`))
  //       }
  //       return Promise.resolve(prr)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong finding a Password Reset Request with id: ${id}`)
  //       return Promise.reject(new NoUserFoundError(`No User found with ID: ${id}`))
  //     })
  // }

  // getPasswordResetRequestByEmail(email: string, enabled: boolean = true): Promise<PasswordResetRequest> {
  //   if (!email) {
  //     return Promise.reject(`No Email provided to find Password Reset Request with`)
  //   }

  //   return PasswordResetRequestModel
  //     .findOne({email, enabled})
  //     .then((prr: PasswordResetRequest) => {
  //       if (!prr) {
  //         winston.warn(`No Password Reset Request found for email: ${email}`)
  //         return Promise.resolve(null)
  //       }
  //       return Promise.resolve(prr)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Exception during PRR retrieval for email: ${email}`)
  //       return Promise.reject(new NoRequestFoundError(`No Password Reset Request found with Email: ${email}`))
  //     })
  // }

  // disablePasswordResetRequest(id: string): Promise<boolean> {
  //   if (!id) {
  //     return Promise.reject(`No User ID provided to disable`)
  //   }

  //   return PasswordResetRequestModel
  //     .findOneAndUpdate({_id: id}, {'$set': {enabled: false}}, {new: true})
  //     .then((prr: PasswordResetRequest) => {
  //       // no prr or it's disabled, job done :)
  //       if (!prr || !prr.enabled) {
  //         return Promise.resolve(true)
  //       }
  //       return Promise.resolve(false)
  //     })
  //     .catch((err: Error) => {
  //       winston.error(err, `Something went wrong disabling password reset with id: ${id}`)
  //       return Promise.reject(new NoUserFoundError(`Failed to delete Password Reset Request ID: ${id}`))
  //     })
  // }
}

export const DB = Database.instance;

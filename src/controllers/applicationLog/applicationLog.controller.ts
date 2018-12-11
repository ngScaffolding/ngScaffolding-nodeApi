export class ApplicationLogController {

  constructor() {
    
  }

  public newApplicationLog = null;

//   public populateUserFromRequest = (req: object, user?: User): User => {
//     let u = typeof user === 'undefined' ? <User>{} : user
//     Object.keys(req).forEach((key) => {
//       if (Object.hasOwnProperty.call(req, key)) {
//         u = Object.assign(u, { [key]: req[key] })
//       }
//     })
//     return u
//   }

//   public search = (filter?: UserSearchFilter): Promise<SearchResult> => {
//     this.logger.debug(`Searching for users with filter: ${filter.toJSON()}`)

//     return DB
//       .searchUsers(filter)
//   }

//   public updatePasswordForUser = (userId: string, password: string): Promise<User> => {
//     this.logger.debug(`Updating password for user: ${userId}`)
//     if (!userId) {
//       this.logger.warn(`No User provided to update`)
//       return Promise.reject(new NoUserFoundError(`No User provided to update`))
//     }
//     if (!password) {
//       this.logger.warn(`No Password provided to update`)
//       return Promise.reject(new MissingParameterError(`No Password provided`))
//     }

//     return DB.updatePasswordForUser(userId, password)
//   }

//   public updateUser = (user: User): Promise<User> => {
//     this.logger.debug(`Updating user: ${user.email} (${user.id}) `)
//     if (!user.id) {
//       this.logger.warn(`No User provided to update`)
//       return Promise.reject(new NoUserFoundError(`No User provided to update`))
//     }
//     return DB.updateUser(user)
//   }

//   public getUserById = (userId: string): Promise<User> => {
//     this.logger.debug(`Finding user by id: ${userId}`)
//     if (!userId) {
//       this.logger.warn(`No User provided to find`)
//       return Promise.reject(new NoUserFoundError(`No User provided to find`))
//     }
//     return DB.getUserById(userId)
//       .then((user: User) => {
//         if (!user) {
//           return Promise.reject(new NoUserFoundError(`No User found with ID: ${userId}`))
//         }
//         return Promise.resolve(user)
//       })
//   }

//   public getUserByEmail = (email: string): Promise<User> => {
//     this.logger.debug(`Finding user by email: ${email}`)
//     if (!email) {
//       this.logger.warn(`No email provided to find user for`)
//       return Promise.reject(new NoUserFoundError(`No email provided to find user for`))
//     }
//     return DB.getUserByEmail(email)
//       .then((user: User) => {
//         if (!user) {
//           return Promise.reject(new NoUserFoundError(`No User found with email: ${email}`))
//         }
//         return Promise.resolve(user)
//       })
//   }

//   public disableUser = (user: User): Promise<User> => {
//     this.logger.debug(`Disabling user: ${user.email} (${user.id}) `)
//     if (!user.id) {
//       this.logger.warn(`No User provided to disable`)
//       return Promise.reject(new NoUserFoundError(`No User provided to disable`))
//     }
//     return DB.disableUser(user.id)
//   }
}


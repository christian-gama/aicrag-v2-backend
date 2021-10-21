import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateString: any;
  EmailAddress: any;
  JWT: any;
  UUID: any;
};

export type ActivateAccount = {
  __typename?: 'ActivateAccount';
  accessToken: Scalars['JWT'];
  refreshToken: Scalars['JWT'];
  user: PublicUser;
};

export type ActivateAccountInput = {
  activationCode: Scalars['String'];
  email: Scalars['EmailAddress'];
};

export type ActiveAccount = {
  __typename?: 'ActiveAccount';
  accessToken: Scalars['JWT'];
  refreshToken: Scalars['JWT'];
  user: PublicUser;
};

export type CreateTask = {
  __typename?: 'CreateTask';
  task: Task;
};

export type CreateTaskInput = {
  commentary?: Maybe<Scalars['String']>;
  date: Scalars['DateString'];
  duration: Scalars['Float'];
  status: TaskStatus;
  taskId?: Maybe<Scalars['String']>;
  type: TaskType;
};

export type DeleteTask = {
  __typename?: 'DeleteTask';
  status?: Maybe<Scalars['Boolean']>;
};

export type DeleteTaskParam = {
  id: Scalars['UUID'];
};

export type FindAllTasks = {
  __typename?: 'FindAllTasks';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<Task>;
  page: Scalars['String'];
};

export type FindAllTasksQuery = {
  limit?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
};

export type FindOneTask = {
  __typename?: 'FindOneTask';
  task: Task;
};

export type FindOneTaskParam = {
  id: Scalars['UUID'];
};

export type FullUser = {
  __typename?: 'FullUser';
  logs: UserLogs;
  personal: UserPersonal;
  settings: UserSettings;
  temporary: UserTemporary;
  tokenVersion: Scalars['Int'];
};

export type InactiveAccount = {
  __typename?: 'InactiveAccount';
  accessToken: Scalars['JWT'];
  message: Scalars['String'];
};

export type Login = ActiveAccount | InactiveAccount;

export type LoginInput = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
};

export type Logout = {
  __typename?: 'Logout';
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateAccount?: Maybe<ActivateAccount>;
  createTask: CreateTask;
  deleteTask: DeleteTask;
  empty?: Maybe<Scalars['String']>;
  login?: Maybe<Login>;
  logout: Logout;
  signUp: SignUp;
  updateTask: UpdateTask;
};


export type MutationActivateAccountArgs = {
  input: ActivateAccountInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteTaskArgs = {
  param: FindOneTaskParam;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
  param: UpdateTaskParam;
};

export type PublicUser = {
  __typename?: 'PublicUser';
  personal: PublicUserPersonal;
  settings: PublicUserSettings;
};

export type PublicUserPersonal = {
  __typename?: 'PublicUserPersonal';
  email: Scalars['EmailAddress'];
  id: Scalars['UUID'];
  name: Scalars['String'];
};

export type PublicUserSettings = {
  __typename?: 'PublicUserSettings';
  currency: UserCurrency;
};

export type Query = {
  __typename?: 'Query';
  empty?: Maybe<Scalars['String']>;
  findAllTasks: FindAllTasks;
  findOneTask: FindOneTask;
};


export type QueryFindAllTasksArgs = {
  query: FindAllTasksQuery;
};


export type QueryFindOneTaskArgs = {
  param: FindOneTaskParam;
};

export type SignUp = {
  __typename?: 'SignUp';
  user: PublicUser;
};

export type SignUpInput = {
  email: Scalars['EmailAddress'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  commentary: Scalars['String'];
  date: TaskDate;
  duration: Scalars['Float'];
  id: Scalars['UUID'];
  logs: TaskLogs;
  status: TaskStatus;
  taskId: Scalars['String'];
  type: Scalars['String'];
  usd: Scalars['Float'];
  userId: Scalars['UUID'];
};

export type TaskDate = {
  __typename?: 'TaskDate';
  day: Scalars['Int'];
  full: Scalars['DateString'];
  hours: Scalars['String'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type TaskLogs = {
  __typename?: 'TaskLogs';
  createdAt: Scalars['DateString'];
  updatedAt?: Maybe<Scalars['DateString']>;
};

export enum TaskStatus {
  Completed = 'completed',
  InProgress = 'in_progress'
}

export enum TaskType {
  Qa = 'QA',
  Tx = 'TX'
}

export type UpdateTask = {
  __typename?: 'UpdateTask';
  task: Task;
};

export type UpdateTaskInput = {
  commentary?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateString']>;
  duration?: Maybe<Scalars['Float']>;
  status?: Maybe<TaskStatus>;
  taskId?: Maybe<Scalars['String']>;
  type?: Maybe<TaskType>;
};

export type UpdateTaskParam = {
  id: Scalars['UUID'];
};

export enum UserCurrency {
  Brl = 'BRL',
  Usd = 'USD'
}

export type UserLogs = {
  __typename?: 'UserLogs';
  createdAt: Scalars['DateString'];
  lastLoginAt?: Maybe<Scalars['DateString']>;
  lastSeenAt?: Maybe<Scalars['DateString']>;
  updatedAt?: Maybe<Scalars['DateString']>;
};

export type UserPersonal = {
  __typename?: 'UserPersonal';
  email: Scalars['EmailAddress'];
  id: Scalars['UUID'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type UserSettings = {
  __typename?: 'UserSettings';
  accountActivated: Scalars['Boolean'];
  currency: UserCurrency;
  handicap: Scalars['Int'];
};

export type UserTemporary = {
  __typename?: 'UserTemporary';
  activationCode?: Maybe<Scalars['String']>;
  activationCodeExpiration?: Maybe<Scalars['DateString']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  tempEmail?: Maybe<Scalars['String']>;
  tempEmailCode?: Maybe<Scalars['String']>;
  tempEmailCodeExpiration?: Maybe<Scalars['DateString']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActivateAccount: ResolverTypeWrapper<ActivateAccount>;
  ActivateAccountInput: ActivateAccountInput;
  ActiveAccount: ResolverTypeWrapper<ActiveAccount>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateTask: ResolverTypeWrapper<CreateTask>;
  CreateTaskInput: CreateTaskInput;
  DateString: ResolverTypeWrapper<Scalars['DateString']>;
  DeleteTask: ResolverTypeWrapper<DeleteTask>;
  DeleteTaskParam: DeleteTaskParam;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  FindAllTasks: ResolverTypeWrapper<FindAllTasks>;
  FindAllTasksQuery: FindAllTasksQuery;
  FindOneTask: ResolverTypeWrapper<FindOneTask>;
  FindOneTaskParam: FindOneTaskParam;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FullUser: ResolverTypeWrapper<FullUser>;
  InactiveAccount: ResolverTypeWrapper<InactiveAccount>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JWT: ResolverTypeWrapper<Scalars['JWT']>;
  Login: ResolversTypes['ActiveAccount'] | ResolversTypes['InactiveAccount'];
  LoginInput: LoginInput;
  Logout: ResolverTypeWrapper<Logout>;
  Mutation: ResolverTypeWrapper<{}>;
  PublicUser: ResolverTypeWrapper<PublicUser>;
  PublicUserPersonal: ResolverTypeWrapper<PublicUserPersonal>;
  PublicUserSettings: ResolverTypeWrapper<PublicUserSettings>;
  Query: ResolverTypeWrapper<{}>;
  SignUp: ResolverTypeWrapper<SignUp>;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Task: ResolverTypeWrapper<Task>;
  TaskDate: ResolverTypeWrapper<TaskDate>;
  TaskLogs: ResolverTypeWrapper<TaskLogs>;
  TaskStatus: TaskStatus;
  TaskType: TaskType;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateTask: ResolverTypeWrapper<UpdateTask>;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskParam: UpdateTaskParam;
  UserCurrency: UserCurrency;
  UserLogs: ResolverTypeWrapper<UserLogs>;
  UserPersonal: ResolverTypeWrapper<UserPersonal>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserTemporary: ResolverTypeWrapper<UserTemporary>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActivateAccount: ActivateAccount;
  ActivateAccountInput: ActivateAccountInput;
  ActiveAccount: ActiveAccount;
  Boolean: Scalars['Boolean'];
  CreateTask: CreateTask;
  CreateTaskInput: CreateTaskInput;
  DateString: Scalars['DateString'];
  DeleteTask: DeleteTask;
  DeleteTaskParam: DeleteTaskParam;
  EmailAddress: Scalars['EmailAddress'];
  FindAllTasks: FindAllTasks;
  FindAllTasksQuery: FindAllTasksQuery;
  FindOneTask: FindOneTask;
  FindOneTaskParam: FindOneTaskParam;
  Float: Scalars['Float'];
  FullUser: FullUser;
  InactiveAccount: InactiveAccount;
  Int: Scalars['Int'];
  JWT: Scalars['JWT'];
  Login: ResolversParentTypes['ActiveAccount'] | ResolversParentTypes['InactiveAccount'];
  LoginInput: LoginInput;
  Logout: Logout;
  Mutation: {};
  PublicUser: PublicUser;
  PublicUserPersonal: PublicUserPersonal;
  PublicUserSettings: PublicUserSettings;
  Query: {};
  SignUp: SignUp;
  SignUpInput: SignUpInput;
  String: Scalars['String'];
  Task: Task;
  TaskDate: TaskDate;
  TaskLogs: TaskLogs;
  UUID: Scalars['UUID'];
  UpdateTask: UpdateTask;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskParam: UpdateTaskParam;
  UserLogs: UserLogs;
  UserPersonal: UserPersonal;
  UserSettings: UserSettings;
  UserTemporary: UserTemporary;
};

export type ActivateAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivateAccount'] = ResolversParentTypes['ActivateAccount']> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActiveAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActiveAccount'] = ResolversParentTypes['ActiveAccount']> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTask'] = ResolversParentTypes['CreateTask']> = {
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateString'], any> {
  name: 'DateString';
}

export type DeleteTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteTask'] = ResolversParentTypes['DeleteTask']> = {
  status?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type FindAllTasksResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindAllTasks'] = ResolversParentTypes['FindAllTasks']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displaying?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FindOneTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindOneTask'] = ResolversParentTypes['FindOneTask']> = {
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FullUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullUser'] = ResolversParentTypes['FullUser']> = {
  logs?: Resolver<ResolversTypes['UserLogs'], ParentType, ContextType>;
  personal?: Resolver<ResolversTypes['UserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  temporary?: Resolver<ResolversTypes['UserTemporary'], ParentType, ContextType>;
  tokenVersion?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InactiveAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['InactiveAccount'] = ResolversParentTypes['InactiveAccount']> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT';
}

export type LoginResolvers<ContextType = any, ParentType extends ResolversParentTypes['Login'] = ResolversParentTypes['Login']> = {
  __resolveType: TypeResolveFn<'ActiveAccount' | 'InactiveAccount', ParentType, ContextType>;
};

export type LogoutResolvers<ContextType = any, ParentType extends ResolversParentTypes['Logout'] = ResolversParentTypes['Logout']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  activateAccount?: Resolver<Maybe<ResolversTypes['ActivateAccount']>, ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['CreateTask'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'input'>>;
  deleteTask?: Resolver<ResolversTypes['DeleteTask'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'param'>>;
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  login?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Logout'], ParentType, ContextType>;
  signUp?: Resolver<ResolversTypes['SignUp'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateTask?: Resolver<ResolversTypes['UpdateTask'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input' | 'param'>>;
};

export type PublicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUser'] = ResolversParentTypes['PublicUser']> = {
  personal?: Resolver<ResolversTypes['PublicUserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['PublicUserSettings'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserPersonalResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserPersonal'] = ResolversParentTypes['PublicUserPersonal']> = {
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserSettings'] = ResolversParentTypes['PublicUserSettings']> = {
  currency?: Resolver<ResolversTypes['UserCurrency'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  findAllTasks?: Resolver<ResolversTypes['FindAllTasks'], ParentType, ContextType, RequireFields<QueryFindAllTasksArgs, 'query'>>;
  findOneTask?: Resolver<ResolversTypes['FindOneTask'], ParentType, ContextType, RequireFields<QueryFindOneTaskArgs, 'param'>>;
};

export type SignUpResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUp'] = ResolversParentTypes['SignUp']> = {
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  commentary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['TaskDate'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  logs?: Resolver<ResolversTypes['TaskLogs'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usd?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskDateResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskDate'] = ResolversParentTypes['TaskDate']> = {
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  full?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  hours?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskLogsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskLogs'] = ResolversParentTypes['TaskLogs']> = {
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UpdateTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTask'] = ResolversParentTypes['UpdateTask']> = {
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLogsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLogs'] = ResolversParentTypes['UserLogs']> = {
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  lastLoginAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  lastSeenAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPersonalResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPersonal'] = ResolversParentTypes['UserPersonal']> = {
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = {
  accountActivated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['UserCurrency'], ParentType, ContextType>;
  handicap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTemporaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTemporary'] = ResolversParentTypes['UserTemporary']> = {
  activationCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activationCodeExpiration?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  resetPasswordToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailCodeExpiration?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActivateAccount?: ActivateAccountResolvers<ContextType>;
  ActiveAccount?: ActiveAccountResolvers<ContextType>;
  CreateTask?: CreateTaskResolvers<ContextType>;
  DateString?: GraphQLScalarType;
  DeleteTask?: DeleteTaskResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  FindAllTasks?: FindAllTasksResolvers<ContextType>;
  FindOneTask?: FindOneTaskResolvers<ContextType>;
  FullUser?: FullUserResolvers<ContextType>;
  InactiveAccount?: InactiveAccountResolvers<ContextType>;
  JWT?: GraphQLScalarType;
  Login?: LoginResolvers<ContextType>;
  Logout?: LogoutResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  PublicUserPersonal?: PublicUserPersonalResolvers<ContextType>;
  PublicUserSettings?: PublicUserSettingsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUp?: SignUpResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskDate?: TaskDateResolvers<ContextType>;
  TaskLogs?: TaskLogsResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateTask?: UpdateTaskResolvers<ContextType>;
  UserLogs?: UserLogsResolvers<ContextType>;
  UserPersonal?: UserPersonalResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserTemporary?: UserTemporaryResolvers<ContextType>;
};


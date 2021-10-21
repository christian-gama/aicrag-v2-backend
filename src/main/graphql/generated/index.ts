import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AccountData = ActiveAccount | InactiveAccount;

export type ActivateAccount = HttpResponse & {
  __typename?: 'ActivateAccount';
  data: ActivateAccountData;
  status: Scalars['Boolean'];
  statusCode: Scalars['Int'];
};

export type ActivateAccountData = {
  __typename?: 'ActivateAccountData';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: PublicUser;
};

export type ActivateAccountInput = {
  activationCode: Scalars['String'];
  email: Scalars['String'];
};

export type ActiveAccount = {
  __typename?: 'ActiveAccount';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: PublicUser;
};

export type CreateTask = HttpResponse & {
  __typename?: 'CreateTask';
  data: Task;
  status: Scalars['Boolean'];
  statusCode: Scalars['Int'];
};

export type FullUser = {
  __typename?: 'FullUser';
  logs: UserLogs;
  personal: UserPersonal;
  settings: UserSettings;
  temporary: UserTemporary;
  tokenVersion: Scalars['Int'];
};

export type HttpResponse = {
  status: Scalars['Boolean'];
  statusCode: Scalars['Int'];
};

export type InactiveAccount = {
  __typename?: 'InactiveAccount';
  accessToken: Scalars['String'];
  message: Scalars['String'];
};

export type Login = HttpResponse & {
  __typename?: 'Login';
  data: AccountData;
  status: Scalars['Boolean'];
  statusCode: Scalars['Int'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateAccount?: Maybe<ActivateAccount>;
  createTask?: Maybe<CreateTask>;
  empty?: Maybe<Scalars['String']>;
  login?: Maybe<Login>;
  signUp?: Maybe<SignUp>;
};


export type MutationActivateAccountArgs = {
  input: ActivateAccountInput;
};


export type MutationCreateTaskArgs = {
  input: TaskInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type PublicUser = {
  __typename?: 'PublicUser';
  personal: PublicUserPersonal;
  settings: PublicUserSettings;
};

export type PublicUserPersonal = {
  __typename?: 'PublicUserPersonal';
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PublicUserSettings = {
  __typename?: 'PublicUserSettings';
  currency: UserCurrency;
};

export type Query = {
  __typename?: 'Query';
  empty?: Maybe<Scalars['String']>;
};

export type SignUp = HttpResponse & {
  __typename?: 'SignUp';
  data: PublicUser;
  status: Scalars['Boolean'];
  statusCode: Scalars['Int'];
};

export type SignUpInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  task: TaskProps;
};

export type TaskDate = {
  __typename?: 'TaskDate';
  day: Scalars['Int'];
  full: Scalars['Date'];
  hours: Scalars['String'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type TaskInput = {
  commentary?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['Date']>;
  duration: Scalars['Int'];
  status: TaskStatus;
  taskId?: Maybe<Scalars['String']>;
  type: TaskType;
};

export type TaskLogs = {
  __typename?: 'TaskLogs';
  createdAt: Scalars['Date'];
  updatedAt?: Maybe<Scalars['Date']>;
};

export type TaskProps = {
  __typename?: 'TaskProps';
  commentary?: Maybe<Scalars['String']>;
  date: TaskDate;
  duration: Scalars['Float'];
  id: Scalars['ID'];
  logs: TaskLogs;
  status: TaskStatus;
  taskId?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  usd: Scalars['Float'];
  userId: Scalars['String'];
};

export enum TaskStatus {
  Completed = 'completed',
  InProgress = 'in_progress'
}

export enum TaskType {
  Qa = 'QA',
  Tx = 'TX'
}

export enum UserCurrency {
  Brl = 'BRL',
  Usd = 'USD'
}

export type UserLogs = {
  __typename?: 'UserLogs';
  createdAt: Scalars['Date'];
  lastLoginAt?: Maybe<Scalars['Date']>;
  lastSeenAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type UserPersonal = {
  __typename?: 'UserPersonal';
  email: Scalars['String'];
  id: Scalars['String'];
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
  activationCodeExpiration?: Maybe<Scalars['Date']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  tempEmail?: Maybe<Scalars['String']>;
  tempEmailCode?: Maybe<Scalars['String']>;
  tempEmailCodeExpiration?: Maybe<Scalars['Date']>;
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
  AccountData: ResolversTypes['ActiveAccount'] | ResolversTypes['InactiveAccount'];
  ActivateAccount: ResolverTypeWrapper<ActivateAccount>;
  ActivateAccountData: ResolverTypeWrapper<ActivateAccountData>;
  ActivateAccountInput: ActivateAccountInput;
  ActiveAccount: ResolverTypeWrapper<ActiveAccount>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateTask: ResolverTypeWrapper<CreateTask>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FullUser: ResolverTypeWrapper<FullUser>;
  HttpResponse: ResolversTypes['ActivateAccount'] | ResolversTypes['CreateTask'] | ResolversTypes['Login'] | ResolversTypes['SignUp'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  InactiveAccount: ResolverTypeWrapper<InactiveAccount>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Login: ResolverTypeWrapper<Omit<Login, 'data'> & { data: ResolversTypes['AccountData'] }>;
  LoginInput: LoginInput;
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
  TaskInput: TaskInput;
  TaskLogs: ResolverTypeWrapper<TaskLogs>;
  TaskProps: ResolverTypeWrapper<TaskProps>;
  TaskStatus: TaskStatus;
  TaskType: TaskType;
  UserCurrency: UserCurrency;
  UserLogs: ResolverTypeWrapper<UserLogs>;
  UserPersonal: ResolverTypeWrapper<UserPersonal>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserTemporary: ResolverTypeWrapper<UserTemporary>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountData: ResolversParentTypes['ActiveAccount'] | ResolversParentTypes['InactiveAccount'];
  ActivateAccount: ActivateAccount;
  ActivateAccountData: ActivateAccountData;
  ActivateAccountInput: ActivateAccountInput;
  ActiveAccount: ActiveAccount;
  Boolean: Scalars['Boolean'];
  CreateTask: CreateTask;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  FullUser: FullUser;
  HttpResponse: ResolversParentTypes['ActivateAccount'] | ResolversParentTypes['CreateTask'] | ResolversParentTypes['Login'] | ResolversParentTypes['SignUp'];
  ID: Scalars['ID'];
  InactiveAccount: InactiveAccount;
  Int: Scalars['Int'];
  Login: Omit<Login, 'data'> & { data: ResolversParentTypes['AccountData'] };
  LoginInput: LoginInput;
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
  TaskInput: TaskInput;
  TaskLogs: TaskLogs;
  TaskProps: TaskProps;
  UserLogs: UserLogs;
  UserPersonal: UserPersonal;
  UserSettings: UserSettings;
  UserTemporary: UserTemporary;
};

export type AccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountData'] = ResolversParentTypes['AccountData']> = {
  __resolveType: TypeResolveFn<'ActiveAccount' | 'InactiveAccount', ParentType, ContextType>;
};

export type ActivateAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivateAccount'] = ResolversParentTypes['ActivateAccount']> = {
  data?: Resolver<ResolversTypes['ActivateAccountData'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivateAccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivateAccountData'] = ResolversParentTypes['ActivateAccountData']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActiveAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActiveAccount'] = ResolversParentTypes['ActiveAccount']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTask'] = ResolversParentTypes['CreateTask']> = {
  data?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FullUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullUser'] = ResolversParentTypes['FullUser']> = {
  logs?: Resolver<ResolversTypes['UserLogs'], ParentType, ContextType>;
  personal?: Resolver<ResolversTypes['UserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  temporary?: Resolver<ResolversTypes['UserTemporary'], ParentType, ContextType>;
  tokenVersion?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HttpResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['HttpResponse'] = ResolversParentTypes['HttpResponse']> = {
  __resolveType: TypeResolveFn<'ActivateAccount' | 'CreateTask' | 'Login' | 'SignUp', ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type InactiveAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['InactiveAccount'] = ResolversParentTypes['InactiveAccount']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResolvers<ContextType = any, ParentType extends ResolversParentTypes['Login'] = ResolversParentTypes['Login']> = {
  data?: Resolver<ResolversTypes['AccountData'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  activateAccount?: Resolver<Maybe<ResolversTypes['ActivateAccount']>, ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'input'>>;
  createTask?: Resolver<Maybe<ResolversTypes['CreateTask']>, ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'input'>>;
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  login?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  signUp?: Resolver<Maybe<ResolversTypes['SignUp']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
};

export type PublicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUser'] = ResolversParentTypes['PublicUser']> = {
  personal?: Resolver<ResolversTypes['PublicUserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['PublicUserSettings'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserPersonalResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserPersonal'] = ResolversParentTypes['PublicUserPersonal']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserSettings'] = ResolversParentTypes['PublicUserSettings']> = {
  currency?: Resolver<ResolversTypes['UserCurrency'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type SignUpResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUp'] = ResolversParentTypes['SignUp']> = {
  data?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  task?: Resolver<ResolversTypes['TaskProps'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskDateResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskDate'] = ResolversParentTypes['TaskDate']> = {
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  full?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  hours?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskLogsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskLogs'] = ResolversParentTypes['TaskLogs']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskPropsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskProps'] = ResolversParentTypes['TaskProps']> = {
  commentary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['TaskDate'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logs?: Resolver<ResolversTypes['TaskLogs'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  taskId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usd?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLogsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLogs'] = ResolversParentTypes['UserLogs']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  lastLoginAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  lastSeenAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPersonalResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPersonal'] = ResolversParentTypes['UserPersonal']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  activationCodeExpiration?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  resetPasswordToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailCodeExpiration?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccountData?: AccountDataResolvers<ContextType>;
  ActivateAccount?: ActivateAccountResolvers<ContextType>;
  ActivateAccountData?: ActivateAccountDataResolvers<ContextType>;
  ActiveAccount?: ActiveAccountResolvers<ContextType>;
  CreateTask?: CreateTaskResolvers<ContextType>;
  Date?: GraphQLScalarType;
  FullUser?: FullUserResolvers<ContextType>;
  HttpResponse?: HttpResponseResolvers<ContextType>;
  InactiveAccount?: InactiveAccountResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  PublicUserPersonal?: PublicUserPersonalResolvers<ContextType>;
  PublicUserSettings?: PublicUserSettingsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUp?: SignUpResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskDate?: TaskDateResolvers<ContextType>;
  TaskLogs?: TaskLogsResolvers<ContextType>;
  TaskProps?: TaskPropsResolvers<ContextType>;
  UserLogs?: UserLogsResolvers<ContextType>;
  UserPersonal?: UserPersonalResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserTemporary?: UserTemporaryResolvers<ContextType>;
};


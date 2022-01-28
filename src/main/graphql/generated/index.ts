import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  activationPin: Scalars['String'];
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
  commentary?: InputMaybe<Scalars['String']>;
  date: Scalars['DateString'];
  duration: Scalars['Float'];
  status: TaskStatus;
  taskId?: InputMaybe<Scalars['String']>;
  type: TaskType;
};

export type DeleteTask = {
  __typename?: 'DeleteTask';
  message: Scalars['String'];
};

export type DeleteTaskParam = {
  id: Scalars['UUID'];
};

export type DeleteUser = {
  __typename?: 'DeleteUser';
  message: Scalars['String'];
};

export type DeleteUserParam = {
  id: Scalars['UUID'];
};

export type DetailedInvoice = {
  __typename?: 'DetailedInvoice';
  date: GetAllInvoicesDate;
  tasks: Scalars['Int'];
  totalUsd: Scalars['Float'];
};

export type FindAllTasks = {
  __typename?: 'FindAllTasks';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<Task>;
  page: Scalars['String'];
};

export type FindAllTasksQueries = {
  limit?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type FindAllUserTasks = {
  __typename?: 'FindAllUserTasks';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<Task>;
  page: Scalars['String'];
};

export type FindAllUserTasksParam = {
  userId: Scalars['UUID'];
};

export type FindAllUserTasksQueries = {
  limit?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type FindAllUsers = {
  __typename?: 'FindAllUsers';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<FullUser>;
  page: Scalars['String'];
};

export type FindAllUsersQueries = {
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type FindOneTask = {
  __typename?: 'FindOneTask';
  task: Task;
};

export type FindOneTaskParam = {
  id: Scalars['UUID'];
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  user: PublicUser;
};

export type ForgotPasswordInput = {
  email: Scalars['EmailAddress'];
};

export type FullUser = {
  __typename?: 'FullUser';
  logs: UserLogs;
  personal: UserPersonal;
  settings: UserSettings;
  temporary: UserTemporary;
  tokenVersion: Scalars['Int'];
};

export type GetAllInvoices = {
  __typename?: 'GetAllInvoices';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<DetailedInvoice>;
  page: Scalars['String'];
};

export type GetAllInvoicesDate = {
  __typename?: 'GetAllInvoicesDate';
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type GetAllInvoicesQueries = {
  limit?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  type: GetAllInvoicesType;
};

export enum GetAllInvoicesType {
  Qa = 'QA',
  Tx = 'TX',
  Both = 'both'
}

export type GetInvoiceByMonth = {
  __typename?: 'GetInvoiceByMonth';
  count: Scalars['Int'];
  displaying: Scalars['Int'];
  documents: Array<Task>;
  page: Scalars['String'];
};

export enum GetInvoiceByMonthOperator {
  Eq = 'eq',
  Gte = 'gte',
  Lte = 'lte'
}

export enum GetInvoiceByMonthPeriod {
  Past_3Days = 'past_3_days',
  Past_7Days = 'past_7_days',
  Past_15Days = 'past_15_days',
  Today = 'today'
}

export type GetInvoiceByMonthQueries = {
  duration?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['String']>;
  month: Scalars['String'];
  operator?: InputMaybe<GetInvoiceByMonthOperator>;
  page?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<GetInvoiceByMonthPeriod>;
  sort?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
  type: GetInvoiceByMonthType;
  year: Scalars['String'];
};

export enum GetInvoiceByMonthType {
  Qa = 'QA',
  Tx = 'TX',
  Both = 'both'
}

export type GetMe = {
  __typename?: 'GetMe';
  accessToken?: Maybe<Scalars['JWT']>;
  refreshToken?: Maybe<Scalars['JWT']>;
  user: PublicUser;
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
  deleteUser: DeleteUser;
  empty?: Maybe<Scalars['String']>;
  forgotPassword: ForgotPassword;
  login?: Maybe<Login>;
  logout: Logout;
  resetPassword: ResetPassword;
  sendEmailPin: SendEmailPin;
  sendRecoverPasswordEmail: SendRecoverPasswordEmail;
  sendWelcomeEmail: SendWelcomeEmail;
  signUp: SignUp;
  updateEmailByPin: UpdateEmailByCode;
  updateMe: UpdateMe;
  updatePassword: UpdatePassword;
  updateTask: UpdateTask;
  updateUser: UpdateUser;
  updateUserTask: UpdateTask;
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


export type MutationDeleteUserArgs = {
  param: DeleteUserParam;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSendEmailPinArgs = {
  input: SendEmailPinInput;
};


export type MutationSendRecoverPasswordEmailArgs = {
  input: SendRecoverPasswordEmailInput;
};


export type MutationSendWelcomeEmailArgs = {
  input: SendWelcomeEmailInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateEmailByPinArgs = {
  input: UpdateEmailByCodeInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
  param: UpdateTaskParam;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  param: UpdateUserParam;
};


export type MutationUpdateUserTaskArgs = {
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
  findAllUserTasks: FindAllUserTasks;
  findAllUsers: FindAllUsers;
  findOneTask: FindOneTask;
  getAllInvoices: GetAllInvoices;
  getInvoiceByMonth: GetInvoiceByMonth;
  getMe: GetMe;
  verifyResetPasswordToken: VerifyResetPasswordToken;
};


export type QueryFindAllTasksArgs = {
  query: FindAllTasksQueries;
};


export type QueryFindAllUserTasksArgs = {
  param: FindAllUserTasksParam;
  query: FindAllUserTasksQueries;
};


export type QueryFindAllUsersArgs = {
  query: FindAllUsersQueries;
};


export type QueryFindOneTaskArgs = {
  param: FindOneTaskParam;
};


export type QueryGetAllInvoicesArgs = {
  query: GetAllInvoicesQueries;
};


export type QueryGetInvoiceByMonthArgs = {
  query: GetInvoiceByMonthQueries;
};


export type QueryVerifyResetPasswordTokenArgs = {
  param: VerifyResetPasswordTokenInput;
};

export type ResetPassword = {
  __typename?: 'ResetPassword';
  refreshToken: Scalars['JWT'];
  user: PublicUser;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type SendEmailPin = {
  __typename?: 'SendEmailPin';
  message: Scalars['String'];
};

export type SendEmailPinInput = {
  email: Scalars['EmailAddress'];
};

export type SendRecoverPasswordEmail = {
  __typename?: 'SendRecoverPasswordEmail';
  message: Scalars['String'];
};

export type SendRecoverPasswordEmailInput = {
  email: Scalars['EmailAddress'];
};

export type SendWelcomeEmail = {
  __typename?: 'SendWelcomeEmail';
  message: Scalars['String'];
};

export type SendWelcomeEmailInput = {
  email: Scalars['EmailAddress'];
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
  user: PublicUser;
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

export type UpdateEmailByCode = {
  __typename?: 'UpdateEmailByCode';
  user: PublicUser;
};

export type UpdateEmailByCodeInput = {
  emailPin: Scalars['String'];
};

export type UpdateMe = UpdateMeHasChanges | UpdateMeNoChanges;

export type UpdateMeHasChanges = {
  __typename?: 'UpdateMeHasChanges';
  user: PublicUser;
};

export type UpdateMeInput = {
  currency?: InputMaybe<UserCurrency>;
  email?: InputMaybe<Scalars['EmailAddress']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateMeNoChanges = {
  __typename?: 'UpdateMeNoChanges';
  message: Scalars['String'];
};

export type UpdatePassword = {
  __typename?: 'UpdatePassword';
  user: PublicUser;
};

export type UpdatePasswordInput = {
  currentPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type UpdateTask = UpdateTaskHasChanges | UpdateTaskNoChanges;

export type UpdateTaskHasChanges = {
  __typename?: 'UpdateTaskHasChanges';
  task: Task;
};

export type UpdateTaskInput = {
  commentary?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateString']>;
  duration?: InputMaybe<Scalars['Float']>;
  status?: InputMaybe<TaskStatus>;
  taskId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TaskType>;
};

export type UpdateTaskNoChanges = {
  __typename?: 'UpdateTaskNoChanges';
  message: Scalars['String'];
};

export type UpdateTaskParam = {
  id: Scalars['UUID'];
};

export type UpdateUser = UpdateUserHasChanges | UpdateUserNoChanges;

export type UpdateUserHasChanges = {
  __typename?: 'UpdateUserHasChanges';
  user: FullUser;
};

export type UpdateUserInput = {
  accountStatus?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  handicap?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  tokenVersion?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserNoChanges = {
  __typename?: 'UpdateUserNoChanges';
  message: Scalars['String'];
};

export type UpdateUserParam = {
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
  role: Scalars['Int'];
};

export type UserTemporary = {
  __typename?: 'UserTemporary';
  activationPin?: Maybe<Scalars['String']>;
  activationPinExpiration?: Maybe<Scalars['DateString']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  tempEmail?: Maybe<Scalars['String']>;
  tempEmailPin?: Maybe<Scalars['String']>;
  tempEmailPinExpiration?: Maybe<Scalars['DateString']>;
};

export type VerifyResetPasswordToken = {
  __typename?: 'VerifyResetPasswordToken';
  accessToken: Scalars['JWT'];
};

export type VerifyResetPasswordTokenInput = {
  token: Scalars['JWT'];
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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  DeleteUser: ResolverTypeWrapper<DeleteUser>;
  DeleteUserParam: DeleteUserParam;
  DetailedInvoice: ResolverTypeWrapper<DetailedInvoice>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  FindAllTasks: ResolverTypeWrapper<FindAllTasks>;
  FindAllTasksQueries: FindAllTasksQueries;
  FindAllUserTasks: ResolverTypeWrapper<FindAllUserTasks>;
  FindAllUserTasksParam: FindAllUserTasksParam;
  FindAllUserTasksQueries: FindAllUserTasksQueries;
  FindAllUsers: ResolverTypeWrapper<FindAllUsers>;
  FindAllUsersQueries: FindAllUsersQueries;
  FindOneTask: ResolverTypeWrapper<FindOneTask>;
  FindOneTaskParam: FindOneTaskParam;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ForgotPassword: ResolverTypeWrapper<ForgotPassword>;
  ForgotPasswordInput: ForgotPasswordInput;
  FullUser: ResolverTypeWrapper<FullUser>;
  GetAllInvoices: ResolverTypeWrapper<GetAllInvoices>;
  GetAllInvoicesDate: ResolverTypeWrapper<GetAllInvoicesDate>;
  GetAllInvoicesQueries: GetAllInvoicesQueries;
  GetAllInvoicesType: GetAllInvoicesType;
  GetInvoiceByMonth: ResolverTypeWrapper<GetInvoiceByMonth>;
  GetInvoiceByMonthOperator: GetInvoiceByMonthOperator;
  GetInvoiceByMonthPeriod: GetInvoiceByMonthPeriod;
  GetInvoiceByMonthQueries: GetInvoiceByMonthQueries;
  GetInvoiceByMonthType: GetInvoiceByMonthType;
  GetMe: ResolverTypeWrapper<GetMe>;
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
  ResetPassword: ResolverTypeWrapper<ResetPassword>;
  ResetPasswordInput: ResetPasswordInput;
  SendEmailPin: ResolverTypeWrapper<SendEmailPin>;
  SendEmailPinInput: SendEmailPinInput;
  SendRecoverPasswordEmail: ResolverTypeWrapper<SendRecoverPasswordEmail>;
  SendRecoverPasswordEmailInput: SendRecoverPasswordEmailInput;
  SendWelcomeEmail: ResolverTypeWrapper<SendWelcomeEmail>;
  SendWelcomeEmailInput: SendWelcomeEmailInput;
  SignUp: ResolverTypeWrapper<SignUp>;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Task: ResolverTypeWrapper<Task>;
  TaskDate: ResolverTypeWrapper<TaskDate>;
  TaskLogs: ResolverTypeWrapper<TaskLogs>;
  TaskStatus: TaskStatus;
  TaskType: TaskType;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateEmailByCode: ResolverTypeWrapper<UpdateEmailByCode>;
  UpdateEmailByCodeInput: UpdateEmailByCodeInput;
  UpdateMe: ResolversTypes['UpdateMeHasChanges'] | ResolversTypes['UpdateMeNoChanges'];
  UpdateMeHasChanges: ResolverTypeWrapper<UpdateMeHasChanges>;
  UpdateMeInput: UpdateMeInput;
  UpdateMeNoChanges: ResolverTypeWrapper<UpdateMeNoChanges>;
  UpdatePassword: ResolverTypeWrapper<UpdatePassword>;
  UpdatePasswordInput: UpdatePasswordInput;
  UpdateTask: ResolversTypes['UpdateTaskHasChanges'] | ResolversTypes['UpdateTaskNoChanges'];
  UpdateTaskHasChanges: ResolverTypeWrapper<UpdateTaskHasChanges>;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskNoChanges: ResolverTypeWrapper<UpdateTaskNoChanges>;
  UpdateTaskParam: UpdateTaskParam;
  UpdateUser: ResolversTypes['UpdateUserHasChanges'] | ResolversTypes['UpdateUserNoChanges'];
  UpdateUserHasChanges: ResolverTypeWrapper<UpdateUserHasChanges>;
  UpdateUserInput: UpdateUserInput;
  UpdateUserNoChanges: ResolverTypeWrapper<UpdateUserNoChanges>;
  UpdateUserParam: UpdateUserParam;
  UserCurrency: UserCurrency;
  UserLogs: ResolverTypeWrapper<UserLogs>;
  UserPersonal: ResolverTypeWrapper<UserPersonal>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserTemporary: ResolverTypeWrapper<UserTemporary>;
  VerifyResetPasswordToken: ResolverTypeWrapper<VerifyResetPasswordToken>;
  VerifyResetPasswordTokenInput: VerifyResetPasswordTokenInput;
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
  DeleteUser: DeleteUser;
  DeleteUserParam: DeleteUserParam;
  DetailedInvoice: DetailedInvoice;
  EmailAddress: Scalars['EmailAddress'];
  FindAllTasks: FindAllTasks;
  FindAllTasksQueries: FindAllTasksQueries;
  FindAllUserTasks: FindAllUserTasks;
  FindAllUserTasksParam: FindAllUserTasksParam;
  FindAllUserTasksQueries: FindAllUserTasksQueries;
  FindAllUsers: FindAllUsers;
  FindAllUsersQueries: FindAllUsersQueries;
  FindOneTask: FindOneTask;
  FindOneTaskParam: FindOneTaskParam;
  Float: Scalars['Float'];
  ForgotPassword: ForgotPassword;
  ForgotPasswordInput: ForgotPasswordInput;
  FullUser: FullUser;
  GetAllInvoices: GetAllInvoices;
  GetAllInvoicesDate: GetAllInvoicesDate;
  GetAllInvoicesQueries: GetAllInvoicesQueries;
  GetInvoiceByMonth: GetInvoiceByMonth;
  GetInvoiceByMonthQueries: GetInvoiceByMonthQueries;
  GetMe: GetMe;
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
  ResetPassword: ResetPassword;
  ResetPasswordInput: ResetPasswordInput;
  SendEmailPin: SendEmailPin;
  SendEmailPinInput: SendEmailPinInput;
  SendRecoverPasswordEmail: SendRecoverPasswordEmail;
  SendRecoverPasswordEmailInput: SendRecoverPasswordEmailInput;
  SendWelcomeEmail: SendWelcomeEmail;
  SendWelcomeEmailInput: SendWelcomeEmailInput;
  SignUp: SignUp;
  SignUpInput: SignUpInput;
  String: Scalars['String'];
  Task: Task;
  TaskDate: TaskDate;
  TaskLogs: TaskLogs;
  UUID: Scalars['UUID'];
  UpdateEmailByCode: UpdateEmailByCode;
  UpdateEmailByCodeInput: UpdateEmailByCodeInput;
  UpdateMe: ResolversParentTypes['UpdateMeHasChanges'] | ResolversParentTypes['UpdateMeNoChanges'];
  UpdateMeHasChanges: UpdateMeHasChanges;
  UpdateMeInput: UpdateMeInput;
  UpdateMeNoChanges: UpdateMeNoChanges;
  UpdatePassword: UpdatePassword;
  UpdatePasswordInput: UpdatePasswordInput;
  UpdateTask: ResolversParentTypes['UpdateTaskHasChanges'] | ResolversParentTypes['UpdateTaskNoChanges'];
  UpdateTaskHasChanges: UpdateTaskHasChanges;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskNoChanges: UpdateTaskNoChanges;
  UpdateTaskParam: UpdateTaskParam;
  UpdateUser: ResolversParentTypes['UpdateUserHasChanges'] | ResolversParentTypes['UpdateUserNoChanges'];
  UpdateUserHasChanges: UpdateUserHasChanges;
  UpdateUserInput: UpdateUserInput;
  UpdateUserNoChanges: UpdateUserNoChanges;
  UpdateUserParam: UpdateUserParam;
  UserLogs: UserLogs;
  UserPersonal: UserPersonal;
  UserSettings: UserSettings;
  UserTemporary: UserTemporary;
  VerifyResetPasswordToken: VerifyResetPasswordToken;
  VerifyResetPasswordTokenInput: VerifyResetPasswordTokenInput;
};

export type AdministratorDirectiveArgs = { };

export type AdministratorDirectiveResolver<Result, Parent, ContextType = any, Args = AdministratorDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GuestDirectiveArgs = { };

export type GuestDirectiveResolver<Result, Parent, ContextType = any, Args = GuestDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ModeratorDirectiveArgs = { };

export type ModeratorDirectiveResolver<Result, Parent, ContextType = any, Args = ModeratorDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type PartialProtectedDirectiveArgs = { };

export type PartialProtectedDirectiveResolver<Result, Parent, ContextType = any, Args = PartialProtectedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ProtectedDirectiveArgs = { };

export type ProtectedDirectiveResolver<Result, Parent, ContextType = any, Args = ProtectedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UserDirectiveArgs = { };

export type UserDirectiveResolver<Result, Parent, ContextType = any, Args = UserDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

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
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteUser'] = ResolversParentTypes['DeleteUser']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DetailedInvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['DetailedInvoice'] = ResolversParentTypes['DetailedInvoice']> = {
  date?: Resolver<ResolversTypes['GetAllInvoicesDate'], ParentType, ContextType>;
  tasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalUsd?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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

export type FindAllUserTasksResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindAllUserTasks'] = ResolversParentTypes['FindAllUserTasks']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displaying?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FindAllUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindAllUsers'] = ResolversParentTypes['FindAllUsers']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displaying?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['FullUser']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FindOneTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindOneTask'] = ResolversParentTypes['FindOneTask']> = {
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForgotPasswordResolvers<ContextType = any, ParentType extends ResolversParentTypes['ForgotPassword'] = ResolversParentTypes['ForgotPassword']> = {
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
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

export type GetAllInvoicesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetAllInvoices'] = ResolversParentTypes['GetAllInvoices']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displaying?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['DetailedInvoice']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetAllInvoicesDateResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetAllInvoicesDate'] = ResolversParentTypes['GetAllInvoicesDate']> = {
  month?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetInvoiceByMonthResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetInvoiceByMonth'] = ResolversParentTypes['GetInvoiceByMonth']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displaying?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetMeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetMe'] = ResolversParentTypes['GetMe']> = {
  accessToken?: Resolver<Maybe<ResolversTypes['JWT']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['JWT']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
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
  deleteUser?: Resolver<ResolversTypes['DeleteUser'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'param'>>;
  empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  forgotPassword?: Resolver<ResolversTypes['ForgotPassword'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  login?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Logout'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['ResetPassword'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  sendEmailPin?: Resolver<ResolversTypes['SendEmailPin'], ParentType, ContextType, RequireFields<MutationSendEmailPinArgs, 'input'>>;
  sendRecoverPasswordEmail?: Resolver<ResolversTypes['SendRecoverPasswordEmail'], ParentType, ContextType, RequireFields<MutationSendRecoverPasswordEmailArgs, 'input'>>;
  sendWelcomeEmail?: Resolver<ResolversTypes['SendWelcomeEmail'], ParentType, ContextType, RequireFields<MutationSendWelcomeEmailArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['SignUp'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateEmailByPin?: Resolver<ResolversTypes['UpdateEmailByCode'], ParentType, ContextType, RequireFields<MutationUpdateEmailByPinArgs, 'input'>>;
  updateMe?: Resolver<ResolversTypes['UpdateMe'], ParentType, ContextType, RequireFields<MutationUpdateMeArgs, 'input'>>;
  updatePassword?: Resolver<ResolversTypes['UpdatePassword'], ParentType, ContextType, RequireFields<MutationUpdatePasswordArgs, 'input'>>;
  updateTask?: Resolver<ResolversTypes['UpdateTask'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input' | 'param'>>;
  updateUser?: Resolver<ResolversTypes['UpdateUser'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input' | 'param'>>;
  updateUserTask?: Resolver<ResolversTypes['UpdateTask'], ParentType, ContextType, RequireFields<MutationUpdateUserTaskArgs, 'input' | 'param'>>;
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
  findAllUserTasks?: Resolver<ResolversTypes['FindAllUserTasks'], ParentType, ContextType, RequireFields<QueryFindAllUserTasksArgs, 'param' | 'query'>>;
  findAllUsers?: Resolver<ResolversTypes['FindAllUsers'], ParentType, ContextType, RequireFields<QueryFindAllUsersArgs, 'query'>>;
  findOneTask?: Resolver<ResolversTypes['FindOneTask'], ParentType, ContextType, RequireFields<QueryFindOneTaskArgs, 'param'>>;
  getAllInvoices?: Resolver<ResolversTypes['GetAllInvoices'], ParentType, ContextType, RequireFields<QueryGetAllInvoicesArgs, 'query'>>;
  getInvoiceByMonth?: Resolver<ResolversTypes['GetInvoiceByMonth'], ParentType, ContextType, RequireFields<QueryGetInvoiceByMonthArgs, 'query'>>;
  getMe?: Resolver<ResolversTypes['GetMe'], ParentType, ContextType>;
  verifyResetPasswordToken?: Resolver<ResolversTypes['VerifyResetPasswordToken'], ParentType, ContextType, RequireFields<QueryVerifyResetPasswordTokenArgs, 'param'>>;
};

export type ResetPasswordResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResetPassword'] = ResolversParentTypes['ResetPassword']> = {
  refreshToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendEmailPinResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendEmailPin'] = ResolversParentTypes['SendEmailPin']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendRecoverPasswordEmailResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendRecoverPasswordEmail'] = ResolversParentTypes['SendRecoverPasswordEmail']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendWelcomeEmailResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendWelcomeEmail'] = ResolversParentTypes['SendWelcomeEmail']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
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

export type UpdateEmailByCodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateEmailByCode'] = ResolversParentTypes['UpdateEmailByCode']> = {
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateMeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMe'] = ResolversParentTypes['UpdateMe']> = {
  __resolveType: TypeResolveFn<'UpdateMeHasChanges' | 'UpdateMeNoChanges', ParentType, ContextType>;
};

export type UpdateMeHasChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMeHasChanges'] = ResolversParentTypes['UpdateMeHasChanges']> = {
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateMeNoChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMeNoChanges'] = ResolversParentTypes['UpdateMeNoChanges']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatePasswordResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePassword'] = ResolversParentTypes['UpdatePassword']> = {
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTask'] = ResolversParentTypes['UpdateTask']> = {
  __resolveType: TypeResolveFn<'UpdateTaskHasChanges' | 'UpdateTaskNoChanges', ParentType, ContextType>;
};

export type UpdateTaskHasChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTaskHasChanges'] = ResolversParentTypes['UpdateTaskHasChanges']> = {
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTaskNoChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTaskNoChanges'] = ResolversParentTypes['UpdateTaskNoChanges']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUser'] = ResolversParentTypes['UpdateUser']> = {
  __resolveType: TypeResolveFn<'UpdateUserHasChanges' | 'UpdateUserNoChanges', ParentType, ContextType>;
};

export type UpdateUserHasChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserHasChanges'] = ResolversParentTypes['UpdateUserHasChanges']> = {
  user?: Resolver<ResolversTypes['FullUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserNoChangesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserNoChanges'] = ResolversParentTypes['UpdateUserNoChanges']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  role?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTemporaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTemporary'] = ResolversParentTypes['UserTemporary']> = {
  activationPin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activationPinExpiration?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  resetPasswordToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailPin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempEmailPinExpiration?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifyResetPasswordTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyResetPasswordToken'] = ResolversParentTypes['VerifyResetPasswordToken']> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActivateAccount?: ActivateAccountResolvers<ContextType>;
  ActiveAccount?: ActiveAccountResolvers<ContextType>;
  CreateTask?: CreateTaskResolvers<ContextType>;
  DateString?: GraphQLScalarType;
  DeleteTask?: DeleteTaskResolvers<ContextType>;
  DeleteUser?: DeleteUserResolvers<ContextType>;
  DetailedInvoice?: DetailedInvoiceResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  FindAllTasks?: FindAllTasksResolvers<ContextType>;
  FindAllUserTasks?: FindAllUserTasksResolvers<ContextType>;
  FindAllUsers?: FindAllUsersResolvers<ContextType>;
  FindOneTask?: FindOneTaskResolvers<ContextType>;
  ForgotPassword?: ForgotPasswordResolvers<ContextType>;
  FullUser?: FullUserResolvers<ContextType>;
  GetAllInvoices?: GetAllInvoicesResolvers<ContextType>;
  GetAllInvoicesDate?: GetAllInvoicesDateResolvers<ContextType>;
  GetInvoiceByMonth?: GetInvoiceByMonthResolvers<ContextType>;
  GetMe?: GetMeResolvers<ContextType>;
  InactiveAccount?: InactiveAccountResolvers<ContextType>;
  JWT?: GraphQLScalarType;
  Login?: LoginResolvers<ContextType>;
  Logout?: LogoutResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  PublicUserPersonal?: PublicUserPersonalResolvers<ContextType>;
  PublicUserSettings?: PublicUserSettingsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ResetPassword?: ResetPasswordResolvers<ContextType>;
  SendEmailPin?: SendEmailPinResolvers<ContextType>;
  SendRecoverPasswordEmail?: SendRecoverPasswordEmailResolvers<ContextType>;
  SendWelcomeEmail?: SendWelcomeEmailResolvers<ContextType>;
  SignUp?: SignUpResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskDate?: TaskDateResolvers<ContextType>;
  TaskLogs?: TaskLogsResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateEmailByCode?: UpdateEmailByCodeResolvers<ContextType>;
  UpdateMe?: UpdateMeResolvers<ContextType>;
  UpdateMeHasChanges?: UpdateMeHasChangesResolvers<ContextType>;
  UpdateMeNoChanges?: UpdateMeNoChangesResolvers<ContextType>;
  UpdatePassword?: UpdatePasswordResolvers<ContextType>;
  UpdateTask?: UpdateTaskResolvers<ContextType>;
  UpdateTaskHasChanges?: UpdateTaskHasChangesResolvers<ContextType>;
  UpdateTaskNoChanges?: UpdateTaskNoChangesResolvers<ContextType>;
  UpdateUser?: UpdateUserResolvers<ContextType>;
  UpdateUserHasChanges?: UpdateUserHasChangesResolvers<ContextType>;
  UpdateUserNoChanges?: UpdateUserNoChangesResolvers<ContextType>;
  UserLogs?: UserLogsResolvers<ContextType>;
  UserPersonal?: UserPersonalResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserTemporary?: UserTemporaryResolvers<ContextType>;
  VerifyResetPasswordToken?: VerifyResetPasswordTokenResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  administrator?: AdministratorDirectiveResolver<any, any, ContextType>;
  guest?: GuestDirectiveResolver<any, any, ContextType>;
  moderator?: ModeratorDirectiveResolver<any, any, ContextType>;
  partialProtected?: PartialProtectedDirectiveResolver<any, any, ContextType>;
  protected?: ProtectedDirectiveResolver<any, any, ContextType>;
  user?: UserDirectiveResolver<any, any, ContextType>;
};

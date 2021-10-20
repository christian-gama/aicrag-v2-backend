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

export type ActiveAccount = {
  __typename?: 'ActiveAccount';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: PublicUser;
};

export type FullUser = {
  __typename?: 'FullUser';
  user: FullUserProps;
};

export type FullUserProps = {
  __typename?: 'FullUserProps';
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
  login?: Maybe<Login>;
  signUp?: Maybe<SignUp>;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type PublicUser = {
  __typename?: 'PublicUser';
  user: PublicUserProps;
};

export type PublicUserPersonal = {
  __typename?: 'PublicUserPersonal';
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PublicUserProps = {
  __typename?: 'PublicUserProps';
  personal: PublicUserPersonal;
  settings: PublicUserSettings;
};

export type PublicUserSettings = {
  __typename?: 'PublicUserSettings';
  currency: UserCurrency;
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
  ActiveAccount: ResolverTypeWrapper<ActiveAccount>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  FullUser: ResolverTypeWrapper<FullUser>;
  FullUserProps: ResolverTypeWrapper<FullUserProps>;
  HttpResponse: ResolversTypes['Login'] | ResolversTypes['SignUp'];
  InactiveAccount: ResolverTypeWrapper<InactiveAccount>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Login: ResolverTypeWrapper<Omit<Login, 'data'> & { data: ResolversTypes['AccountData'] }>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  PublicUser: ResolverTypeWrapper<PublicUser>;
  PublicUserPersonal: ResolverTypeWrapper<PublicUserPersonal>;
  PublicUserProps: ResolverTypeWrapper<PublicUserProps>;
  PublicUserSettings: ResolverTypeWrapper<PublicUserSettings>;
  SignUp: ResolverTypeWrapper<SignUp>;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UserCurrency: UserCurrency;
  UserLogs: ResolverTypeWrapper<UserLogs>;
  UserPersonal: ResolverTypeWrapper<UserPersonal>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserTemporary: ResolverTypeWrapper<UserTemporary>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountData: ResolversParentTypes['ActiveAccount'] | ResolversParentTypes['InactiveAccount'];
  ActiveAccount: ActiveAccount;
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  FullUser: FullUser;
  FullUserProps: FullUserProps;
  HttpResponse: ResolversParentTypes['Login'] | ResolversParentTypes['SignUp'];
  InactiveAccount: InactiveAccount;
  Int: Scalars['Int'];
  Login: Omit<Login, 'data'> & { data: ResolversParentTypes['AccountData'] };
  LoginInput: LoginInput;
  Mutation: {};
  PublicUser: PublicUser;
  PublicUserPersonal: PublicUserPersonal;
  PublicUserProps: PublicUserProps;
  PublicUserSettings: PublicUserSettings;
  SignUp: SignUp;
  SignUpInput: SignUpInput;
  String: Scalars['String'];
  UserLogs: UserLogs;
  UserPersonal: UserPersonal;
  UserSettings: UserSettings;
  UserTemporary: UserTemporary;
};

export type AccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountData'] = ResolversParentTypes['AccountData']> = {
  __resolveType: TypeResolveFn<'ActiveAccount' | 'InactiveAccount', ParentType, ContextType>;
};

export type ActiveAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActiveAccount'] = ResolversParentTypes['ActiveAccount']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FullUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullUser'] = ResolversParentTypes['FullUser']> = {
  user?: Resolver<ResolversTypes['FullUserProps'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FullUserPropsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullUserProps'] = ResolversParentTypes['FullUserProps']> = {
  logs?: Resolver<ResolversTypes['UserLogs'], ParentType, ContextType>;
  personal?: Resolver<ResolversTypes['UserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  temporary?: Resolver<ResolversTypes['UserTemporary'], ParentType, ContextType>;
  tokenVersion?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HttpResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['HttpResponse'] = ResolversParentTypes['HttpResponse']> = {
  __resolveType: TypeResolveFn<'Login' | 'SignUp', ParentType, ContextType>;
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
  login?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  signUp?: Resolver<Maybe<ResolversTypes['SignUp']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
};

export type PublicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUser'] = ResolversParentTypes['PublicUser']> = {
  user?: Resolver<ResolversTypes['PublicUserProps'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserPersonalResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserPersonal'] = ResolversParentTypes['PublicUserPersonal']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserPropsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserProps'] = ResolversParentTypes['PublicUserProps']> = {
  personal?: Resolver<ResolversTypes['PublicUserPersonal'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['PublicUserSettings'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicUserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUserSettings'] = ResolversParentTypes['PublicUserSettings']> = {
  currency?: Resolver<ResolversTypes['UserCurrency'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignUpResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUp'] = ResolversParentTypes['SignUp']> = {
  data?: Resolver<ResolversTypes['PublicUser'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  ActiveAccount?: ActiveAccountResolvers<ContextType>;
  Date?: GraphQLScalarType;
  FullUser?: FullUserResolvers<ContextType>;
  FullUserProps?: FullUserPropsResolvers<ContextType>;
  HttpResponse?: HttpResponseResolvers<ContextType>;
  InactiveAccount?: InactiveAccountResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  PublicUserPersonal?: PublicUserPersonalResolvers<ContextType>;
  PublicUserProps?: PublicUserPropsResolvers<ContextType>;
  PublicUserSettings?: PublicUserSettingsResolvers<ContextType>;
  SignUp?: SignUpResolvers<ContextType>;
  UserLogs?: UserLogsResolvers<ContextType>;
  UserPersonal?: UserPersonalResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserTemporary?: UserTemporaryResolvers<ContextType>;
};


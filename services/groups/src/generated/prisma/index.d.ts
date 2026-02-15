
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Group
 * 
 */
export type Group = $Result.DefaultSelection<Prisma.$GroupPayload>
/**
 * Model Membership
 * 
 */
export type Membership = $Result.DefaultSelection<Prisma.$MembershipPayload>
/**
 * Model JoinRequest
 * 
 */
export type JoinRequest = $Result.DefaultSelection<Prisma.$JoinRequestPayload>
/**
 * Model GroupInvite
 * 
 */
export type GroupInvite = $Result.DefaultSelection<Prisma.$GroupInvitePayload>
/**
 * Model GroupBookOfMonthSelection
 * 
 */
export type GroupBookOfMonthSelection = $Result.DefaultSelection<Prisma.$GroupBookOfMonthSelectionPayload>
/**
 * Model ClubBook
 * 
 */
export type ClubBook = $Result.DefaultSelection<Prisma.$ClubBookPayload>
/**
 * Model ClubBookMessage
 * 
 */
export type ClubBookMessage = $Result.DefaultSelection<Prisma.$ClubBookMessagePayload>
/**
 * Model ClubBookArtifact
 * 
 */
export type ClubBookArtifact = $Result.DefaultSelection<Prisma.$ClubBookArtifactPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Groups
 * const groups = await prisma.group.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Groups
   * const groups = await prisma.group.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.group`: Exposes CRUD operations for the **Group** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Groups
    * const groups = await prisma.group.findMany()
    * ```
    */
  get group(): Prisma.GroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.membership`: Exposes CRUD operations for the **Membership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Memberships
    * const memberships = await prisma.membership.findMany()
    * ```
    */
  get membership(): Prisma.MembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.joinRequest`: Exposes CRUD operations for the **JoinRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JoinRequests
    * const joinRequests = await prisma.joinRequest.findMany()
    * ```
    */
  get joinRequest(): Prisma.JoinRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groupInvite`: Exposes CRUD operations for the **GroupInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupInvites
    * const groupInvites = await prisma.groupInvite.findMany()
    * ```
    */
  get groupInvite(): Prisma.GroupInviteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groupBookOfMonthSelection`: Exposes CRUD operations for the **GroupBookOfMonthSelection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupBookOfMonthSelections
    * const groupBookOfMonthSelections = await prisma.groupBookOfMonthSelection.findMany()
    * ```
    */
  get groupBookOfMonthSelection(): Prisma.GroupBookOfMonthSelectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubBook`: Exposes CRUD operations for the **ClubBook** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClubBooks
    * const clubBooks = await prisma.clubBook.findMany()
    * ```
    */
  get clubBook(): Prisma.ClubBookDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubBookMessage`: Exposes CRUD operations for the **ClubBookMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClubBookMessages
    * const clubBookMessages = await prisma.clubBookMessage.findMany()
    * ```
    */
  get clubBookMessage(): Prisma.ClubBookMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubBookArtifact`: Exposes CRUD operations for the **ClubBookArtifact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClubBookArtifacts
    * const clubBookArtifacts = await prisma.clubBookArtifact.findMany()
    * ```
    */
  get clubBookArtifact(): Prisma.ClubBookArtifactDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Group: 'Group',
    Membership: 'Membership',
    JoinRequest: 'JoinRequest',
    GroupInvite: 'GroupInvite',
    GroupBookOfMonthSelection: 'GroupBookOfMonthSelection',
    ClubBook: 'ClubBook',
    ClubBookMessage: 'ClubBookMessage',
    ClubBookArtifact: 'ClubBookArtifact'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "group" | "membership" | "joinRequest" | "groupInvite" | "groupBookOfMonthSelection" | "clubBook" | "clubBookMessage" | "clubBookArtifact"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Group: {
        payload: Prisma.$GroupPayload<ExtArgs>
        fields: Prisma.GroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          findFirst: {
            args: Prisma.GroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          findMany: {
            args: Prisma.GroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>[]
          }
          create: {
            args: Prisma.GroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          createMany: {
            args: Prisma.GroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>[]
          }
          delete: {
            args: Prisma.GroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          update: {
            args: Prisma.GroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          deleteMany: {
            args: Prisma.GroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>[]
          }
          upsert: {
            args: Prisma.GroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupPayload>
          }
          aggregate: {
            args: Prisma.GroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroup>
          }
          groupBy: {
            args: Prisma.GroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupCountArgs<ExtArgs>
            result: $Utils.Optional<GroupCountAggregateOutputType> | number
          }
        }
      }
      Membership: {
        payload: Prisma.$MembershipPayload<ExtArgs>
        fields: Prisma.MembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findFirst: {
            args: Prisma.MembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findMany: {
            args: Prisma.MembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          create: {
            args: Prisma.MembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          createMany: {
            args: Prisma.MembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          delete: {
            args: Prisma.MembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          update: {
            args: Prisma.MembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          deleteMany: {
            args: Prisma.MembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          upsert: {
            args: Prisma.MembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          aggregate: {
            args: Prisma.MembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMembership>
          }
          groupBy: {
            args: Prisma.MembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<MembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.MembershipCountArgs<ExtArgs>
            result: $Utils.Optional<MembershipCountAggregateOutputType> | number
          }
        }
      }
      JoinRequest: {
        payload: Prisma.$JoinRequestPayload<ExtArgs>
        fields: Prisma.JoinRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JoinRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JoinRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          findFirst: {
            args: Prisma.JoinRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JoinRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          findMany: {
            args: Prisma.JoinRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>[]
          }
          create: {
            args: Prisma.JoinRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          createMany: {
            args: Prisma.JoinRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JoinRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>[]
          }
          delete: {
            args: Prisma.JoinRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          update: {
            args: Prisma.JoinRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          deleteMany: {
            args: Prisma.JoinRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JoinRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JoinRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>[]
          }
          upsert: {
            args: Prisma.JoinRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinRequestPayload>
          }
          aggregate: {
            args: Prisma.JoinRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJoinRequest>
          }
          groupBy: {
            args: Prisma.JoinRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<JoinRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.JoinRequestCountArgs<ExtArgs>
            result: $Utils.Optional<JoinRequestCountAggregateOutputType> | number
          }
        }
      }
      GroupInvite: {
        payload: Prisma.$GroupInvitePayload<ExtArgs>
        fields: Prisma.GroupInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          findFirst: {
            args: Prisma.GroupInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          findMany: {
            args: Prisma.GroupInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>[]
          }
          create: {
            args: Prisma.GroupInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          createMany: {
            args: Prisma.GroupInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>[]
          }
          delete: {
            args: Prisma.GroupInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          update: {
            args: Prisma.GroupInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          deleteMany: {
            args: Prisma.GroupInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroupInviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>[]
          }
          upsert: {
            args: Prisma.GroupInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupInvitePayload>
          }
          aggregate: {
            args: Prisma.GroupInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupInvite>
          }
          groupBy: {
            args: Prisma.GroupInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupInviteCountArgs<ExtArgs>
            result: $Utils.Optional<GroupInviteCountAggregateOutputType> | number
          }
        }
      }
      GroupBookOfMonthSelection: {
        payload: Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>
        fields: Prisma.GroupBookOfMonthSelectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupBookOfMonthSelectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupBookOfMonthSelectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          findFirst: {
            args: Prisma.GroupBookOfMonthSelectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupBookOfMonthSelectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          findMany: {
            args: Prisma.GroupBookOfMonthSelectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>[]
          }
          create: {
            args: Prisma.GroupBookOfMonthSelectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          createMany: {
            args: Prisma.GroupBookOfMonthSelectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupBookOfMonthSelectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>[]
          }
          delete: {
            args: Prisma.GroupBookOfMonthSelectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          update: {
            args: Prisma.GroupBookOfMonthSelectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          deleteMany: {
            args: Prisma.GroupBookOfMonthSelectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupBookOfMonthSelectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroupBookOfMonthSelectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>[]
          }
          upsert: {
            args: Prisma.GroupBookOfMonthSelectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupBookOfMonthSelectionPayload>
          }
          aggregate: {
            args: Prisma.GroupBookOfMonthSelectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupBookOfMonthSelection>
          }
          groupBy: {
            args: Prisma.GroupBookOfMonthSelectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupBookOfMonthSelectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupBookOfMonthSelectionCountArgs<ExtArgs>
            result: $Utils.Optional<GroupBookOfMonthSelectionCountAggregateOutputType> | number
          }
        }
      }
      ClubBook: {
        payload: Prisma.$ClubBookPayload<ExtArgs>
        fields: Prisma.ClubBookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClubBookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClubBookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          findFirst: {
            args: Prisma.ClubBookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClubBookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          findMany: {
            args: Prisma.ClubBookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>[]
          }
          create: {
            args: Prisma.ClubBookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          createMany: {
            args: Prisma.ClubBookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClubBookCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>[]
          }
          delete: {
            args: Prisma.ClubBookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          update: {
            args: Prisma.ClubBookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          deleteMany: {
            args: Prisma.ClubBookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClubBookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClubBookUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>[]
          }
          upsert: {
            args: Prisma.ClubBookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookPayload>
          }
          aggregate: {
            args: Prisma.ClubBookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClubBook>
          }
          groupBy: {
            args: Prisma.ClubBookGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClubBookGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClubBookCountArgs<ExtArgs>
            result: $Utils.Optional<ClubBookCountAggregateOutputType> | number
          }
        }
      }
      ClubBookMessage: {
        payload: Prisma.$ClubBookMessagePayload<ExtArgs>
        fields: Prisma.ClubBookMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClubBookMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClubBookMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          findFirst: {
            args: Prisma.ClubBookMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClubBookMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          findMany: {
            args: Prisma.ClubBookMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>[]
          }
          create: {
            args: Prisma.ClubBookMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          createMany: {
            args: Prisma.ClubBookMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClubBookMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>[]
          }
          delete: {
            args: Prisma.ClubBookMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          update: {
            args: Prisma.ClubBookMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          deleteMany: {
            args: Prisma.ClubBookMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClubBookMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClubBookMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>[]
          }
          upsert: {
            args: Prisma.ClubBookMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookMessagePayload>
          }
          aggregate: {
            args: Prisma.ClubBookMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClubBookMessage>
          }
          groupBy: {
            args: Prisma.ClubBookMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClubBookMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClubBookMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ClubBookMessageCountAggregateOutputType> | number
          }
        }
      }
      ClubBookArtifact: {
        payload: Prisma.$ClubBookArtifactPayload<ExtArgs>
        fields: Prisma.ClubBookArtifactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClubBookArtifactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClubBookArtifactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          findFirst: {
            args: Prisma.ClubBookArtifactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClubBookArtifactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          findMany: {
            args: Prisma.ClubBookArtifactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>[]
          }
          create: {
            args: Prisma.ClubBookArtifactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          createMany: {
            args: Prisma.ClubBookArtifactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClubBookArtifactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>[]
          }
          delete: {
            args: Prisma.ClubBookArtifactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          update: {
            args: Prisma.ClubBookArtifactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          deleteMany: {
            args: Prisma.ClubBookArtifactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClubBookArtifactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClubBookArtifactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>[]
          }
          upsert: {
            args: Prisma.ClubBookArtifactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClubBookArtifactPayload>
          }
          aggregate: {
            args: Prisma.ClubBookArtifactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClubBookArtifact>
          }
          groupBy: {
            args: Prisma.ClubBookArtifactGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClubBookArtifactGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClubBookArtifactCountArgs<ExtArgs>
            result: $Utils.Optional<ClubBookArtifactCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    group?: GroupOmit
    membership?: MembershipOmit
    joinRequest?: JoinRequestOmit
    groupInvite?: GroupInviteOmit
    groupBookOfMonthSelection?: GroupBookOfMonthSelectionOmit
    clubBook?: ClubBookOmit
    clubBookMessage?: ClubBookMessageOmit
    clubBookArtifact?: ClubBookArtifactOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type GroupCountOutputType
   */

  export type GroupCountOutputType = {
    memberships: number
    requests: number
    invites: number
    bookOfMonthSelections: number
  }

  export type GroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | GroupCountOutputTypeCountMembershipsArgs
    requests?: boolean | GroupCountOutputTypeCountRequestsArgs
    invites?: boolean | GroupCountOutputTypeCountInvitesArgs
    bookOfMonthSelections?: boolean | GroupCountOutputTypeCountBookOfMonthSelectionsArgs
  }

  // Custom InputTypes
  /**
   * GroupCountOutputType without action
   */
  export type GroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupCountOutputType
     */
    select?: GroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GroupCountOutputType without action
   */
  export type GroupCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
  }

  /**
   * GroupCountOutputType without action
   */
  export type GroupCountOutputTypeCountRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JoinRequestWhereInput
  }

  /**
   * GroupCountOutputType without action
   */
  export type GroupCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupInviteWhereInput
  }

  /**
   * GroupCountOutputType without action
   */
  export type GroupCountOutputTypeCountBookOfMonthSelectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupBookOfMonthSelectionWhereInput
  }


  /**
   * Count Type ClubBookCountOutputType
   */

  export type ClubBookCountOutputType = {
    messages: number
    artifacts: number
  }

  export type ClubBookCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ClubBookCountOutputTypeCountMessagesArgs
    artifacts?: boolean | ClubBookCountOutputTypeCountArtifactsArgs
  }

  // Custom InputTypes
  /**
   * ClubBookCountOutputType without action
   */
  export type ClubBookCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookCountOutputType
     */
    select?: ClubBookCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClubBookCountOutputType without action
   */
  export type ClubBookCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClubBookMessageWhereInput
  }

  /**
   * ClubBookCountOutputType without action
   */
  export type ClubBookCountOutputTypeCountArtifactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClubBookArtifactWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Group
   */

  export type AggregateGroup = {
    _count: GroupCountAggregateOutputType | null
    _min: GroupMinAggregateOutputType | null
    _max: GroupMaxAggregateOutputType | null
  }

  export type GroupMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type GroupMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type GroupCountAggregateOutputType = {
    id: number
    name: number
    description: number
    ownerId: number
    createdAt: number
    _all: number
  }


  export type GroupMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    createdAt?: true
  }

  export type GroupMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    createdAt?: true
  }

  export type GroupCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    createdAt?: true
    _all?: true
  }

  export type GroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Group to aggregate.
     */
    where?: GroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groups to fetch.
     */
    orderBy?: GroupOrderByWithRelationInput | GroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Groups
    **/
    _count?: true | GroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupMaxAggregateInputType
  }

  export type GetGroupAggregateType<T extends GroupAggregateArgs> = {
        [P in keyof T & keyof AggregateGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroup[P]>
      : GetScalarType<T[P], AggregateGroup[P]>
  }




  export type GroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupWhereInput
    orderBy?: GroupOrderByWithAggregationInput | GroupOrderByWithAggregationInput[]
    by: GroupScalarFieldEnum[] | GroupScalarFieldEnum
    having?: GroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupCountAggregateInputType | true
    _min?: GroupMinAggregateInputType
    _max?: GroupMaxAggregateInputType
  }

  export type GroupGroupByOutputType = {
    id: string
    name: string
    description: string
    ownerId: string
    createdAt: Date
    _count: GroupCountAggregateOutputType | null
    _min: GroupMinAggregateOutputType | null
    _max: GroupMaxAggregateOutputType | null
  }

  type GetGroupGroupByPayload<T extends GroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupGroupByOutputType[P]>
            : GetScalarType<T[P], GroupGroupByOutputType[P]>
        }
      >
    >


  export type GroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    createdAt?: boolean
    memberships?: boolean | Group$membershipsArgs<ExtArgs>
    requests?: boolean | Group$requestsArgs<ExtArgs>
    invites?: boolean | Group$invitesArgs<ExtArgs>
    bookOfMonthSelections?: boolean | Group$bookOfMonthSelectionsArgs<ExtArgs>
    _count?: boolean | GroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["group"]>

  export type GroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["group"]>

  export type GroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["group"]>

  export type GroupSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }

  export type GroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "ownerId" | "createdAt", ExtArgs["result"]["group"]>
  export type GroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | Group$membershipsArgs<ExtArgs>
    requests?: boolean | Group$requestsArgs<ExtArgs>
    invites?: boolean | Group$invitesArgs<ExtArgs>
    bookOfMonthSelections?: boolean | Group$bookOfMonthSelectionsArgs<ExtArgs>
    _count?: boolean | GroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Group"
    objects: {
      memberships: Prisma.$MembershipPayload<ExtArgs>[]
      requests: Prisma.$JoinRequestPayload<ExtArgs>[]
      invites: Prisma.$GroupInvitePayload<ExtArgs>[]
      bookOfMonthSelections: Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      ownerId: string
      createdAt: Date
    }, ExtArgs["result"]["group"]>
    composites: {}
  }

  type GroupGetPayload<S extends boolean | null | undefined | GroupDefaultArgs> = $Result.GetResult<Prisma.$GroupPayload, S>

  type GroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroupCountAggregateInputType | true
    }

  export interface GroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Group'], meta: { name: 'Group' } }
    /**
     * Find zero or one Group that matches the filter.
     * @param {GroupFindUniqueArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupFindUniqueArgs>(args: SelectSubset<T, GroupFindUniqueArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Group that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroupFindUniqueOrThrowArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Group that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindFirstArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupFindFirstArgs>(args?: SelectSubset<T, GroupFindFirstArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Group that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindFirstOrThrowArgs} args - Arguments to find a Group
     * @example
     * // Get one Group
     * const group = await prisma.group.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Groups
     * const groups = await prisma.group.findMany()
     * 
     * // Get first 10 Groups
     * const groups = await prisma.group.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupWithIdOnly = await prisma.group.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupFindManyArgs>(args?: SelectSubset<T, GroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Group.
     * @param {GroupCreateArgs} args - Arguments to create a Group.
     * @example
     * // Create one Group
     * const Group = await prisma.group.create({
     *   data: {
     *     // ... data to create a Group
     *   }
     * })
     * 
     */
    create<T extends GroupCreateArgs>(args: SelectSubset<T, GroupCreateArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Groups.
     * @param {GroupCreateManyArgs} args - Arguments to create many Groups.
     * @example
     * // Create many Groups
     * const group = await prisma.group.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupCreateManyArgs>(args?: SelectSubset<T, GroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Groups and returns the data saved in the database.
     * @param {GroupCreateManyAndReturnArgs} args - Arguments to create many Groups.
     * @example
     * // Create many Groups
     * const group = await prisma.group.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Groups and only return the `id`
     * const groupWithIdOnly = await prisma.group.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Group.
     * @param {GroupDeleteArgs} args - Arguments to delete one Group.
     * @example
     * // Delete one Group
     * const Group = await prisma.group.delete({
     *   where: {
     *     // ... filter to delete one Group
     *   }
     * })
     * 
     */
    delete<T extends GroupDeleteArgs>(args: SelectSubset<T, GroupDeleteArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Group.
     * @param {GroupUpdateArgs} args - Arguments to update one Group.
     * @example
     * // Update one Group
     * const group = await prisma.group.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupUpdateArgs>(args: SelectSubset<T, GroupUpdateArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Groups.
     * @param {GroupDeleteManyArgs} args - Arguments to filter Groups to delete.
     * @example
     * // Delete a few Groups
     * const { count } = await prisma.group.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupDeleteManyArgs>(args?: SelectSubset<T, GroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Groups
     * const group = await prisma.group.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupUpdateManyArgs>(args: SelectSubset<T, GroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groups and returns the data updated in the database.
     * @param {GroupUpdateManyAndReturnArgs} args - Arguments to update many Groups.
     * @example
     * // Update many Groups
     * const group = await prisma.group.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Groups and only return the `id`
     * const groupWithIdOnly = await prisma.group.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GroupUpdateManyAndReturnArgs>(args: SelectSubset<T, GroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Group.
     * @param {GroupUpsertArgs} args - Arguments to update or create a Group.
     * @example
     * // Update or create a Group
     * const group = await prisma.group.upsert({
     *   create: {
     *     // ... data to create a Group
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Group we want to update
     *   }
     * })
     */
    upsert<T extends GroupUpsertArgs>(args: SelectSubset<T, GroupUpsertArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupCountArgs} args - Arguments to filter Groups to count.
     * @example
     * // Count the number of Groups
     * const count = await prisma.group.count({
     *   where: {
     *     // ... the filter for the Groups we want to count
     *   }
     * })
    **/
    count<T extends GroupCountArgs>(
      args?: Subset<T, GroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Group.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroupAggregateArgs>(args: Subset<T, GroupAggregateArgs>): Prisma.PrismaPromise<GetGroupAggregateType<T>>

    /**
     * Group by Group.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupGroupByArgs['orderBy'] }
        : { orderBy?: GroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Group model
   */
  readonly fields: GroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Group.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends Group$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, Group$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requests<T extends Group$requestsArgs<ExtArgs> = {}>(args?: Subset<T, Group$requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invites<T extends Group$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Group$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookOfMonthSelections<T extends Group$bookOfMonthSelectionsArgs<ExtArgs> = {}>(args?: Subset<T, Group$bookOfMonthSelectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Group model
   */
  interface GroupFieldRefs {
    readonly id: FieldRef<"Group", 'String'>
    readonly name: FieldRef<"Group", 'String'>
    readonly description: FieldRef<"Group", 'String'>
    readonly ownerId: FieldRef<"Group", 'String'>
    readonly createdAt: FieldRef<"Group", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Group findUnique
   */
  export type GroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter, which Group to fetch.
     */
    where: GroupWhereUniqueInput
  }

  /**
   * Group findUniqueOrThrow
   */
  export type GroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter, which Group to fetch.
     */
    where: GroupWhereUniqueInput
  }

  /**
   * Group findFirst
   */
  export type GroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter, which Group to fetch.
     */
    where?: GroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groups to fetch.
     */
    orderBy?: GroupOrderByWithRelationInput | GroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Groups.
     */
    cursor?: GroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Groups.
     */
    distinct?: GroupScalarFieldEnum | GroupScalarFieldEnum[]
  }

  /**
   * Group findFirstOrThrow
   */
  export type GroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter, which Group to fetch.
     */
    where?: GroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groups to fetch.
     */
    orderBy?: GroupOrderByWithRelationInput | GroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Groups.
     */
    cursor?: GroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Groups.
     */
    distinct?: GroupScalarFieldEnum | GroupScalarFieldEnum[]
  }

  /**
   * Group findMany
   */
  export type GroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter, which Groups to fetch.
     */
    where?: GroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Groups to fetch.
     */
    orderBy?: GroupOrderByWithRelationInput | GroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Groups.
     */
    cursor?: GroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Groups.
     */
    skip?: number
    distinct?: GroupScalarFieldEnum | GroupScalarFieldEnum[]
  }

  /**
   * Group create
   */
  export type GroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * The data needed to create a Group.
     */
    data: XOR<GroupCreateInput, GroupUncheckedCreateInput>
  }

  /**
   * Group createMany
   */
  export type GroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Groups.
     */
    data: GroupCreateManyInput | GroupCreateManyInput[]
  }

  /**
   * Group createManyAndReturn
   */
  export type GroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * The data used to create many Groups.
     */
    data: GroupCreateManyInput | GroupCreateManyInput[]
  }

  /**
   * Group update
   */
  export type GroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * The data needed to update a Group.
     */
    data: XOR<GroupUpdateInput, GroupUncheckedUpdateInput>
    /**
     * Choose, which Group to update.
     */
    where: GroupWhereUniqueInput
  }

  /**
   * Group updateMany
   */
  export type GroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Groups.
     */
    data: XOR<GroupUpdateManyMutationInput, GroupUncheckedUpdateManyInput>
    /**
     * Filter which Groups to update
     */
    where?: GroupWhereInput
    /**
     * Limit how many Groups to update.
     */
    limit?: number
  }

  /**
   * Group updateManyAndReturn
   */
  export type GroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * The data used to update Groups.
     */
    data: XOR<GroupUpdateManyMutationInput, GroupUncheckedUpdateManyInput>
    /**
     * Filter which Groups to update
     */
    where?: GroupWhereInput
    /**
     * Limit how many Groups to update.
     */
    limit?: number
  }

  /**
   * Group upsert
   */
  export type GroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * The filter to search for the Group to update in case it exists.
     */
    where: GroupWhereUniqueInput
    /**
     * In case the Group found by the `where` argument doesn't exist, create a new Group with this data.
     */
    create: XOR<GroupCreateInput, GroupUncheckedCreateInput>
    /**
     * In case the Group was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupUpdateInput, GroupUncheckedUpdateInput>
  }

  /**
   * Group delete
   */
  export type GroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
    /**
     * Filter which Group to delete.
     */
    where: GroupWhereUniqueInput
  }

  /**
   * Group deleteMany
   */
  export type GroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Groups to delete
     */
    where?: GroupWhereInput
    /**
     * Limit how many Groups to delete.
     */
    limit?: number
  }

  /**
   * Group.memberships
   */
  export type Group$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    cursor?: MembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Group.requests
   */
  export type Group$requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    where?: JoinRequestWhereInput
    orderBy?: JoinRequestOrderByWithRelationInput | JoinRequestOrderByWithRelationInput[]
    cursor?: JoinRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JoinRequestScalarFieldEnum | JoinRequestScalarFieldEnum[]
  }

  /**
   * Group.invites
   */
  export type Group$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    where?: GroupInviteWhereInput
    orderBy?: GroupInviteOrderByWithRelationInput | GroupInviteOrderByWithRelationInput[]
    cursor?: GroupInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroupInviteScalarFieldEnum | GroupInviteScalarFieldEnum[]
  }

  /**
   * Group.bookOfMonthSelections
   */
  export type Group$bookOfMonthSelectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    where?: GroupBookOfMonthSelectionWhereInput
    orderBy?: GroupBookOfMonthSelectionOrderByWithRelationInput | GroupBookOfMonthSelectionOrderByWithRelationInput[]
    cursor?: GroupBookOfMonthSelectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroupBookOfMonthSelectionScalarFieldEnum | GroupBookOfMonthSelectionScalarFieldEnum[]
  }

  /**
   * Group without action
   */
  export type GroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Group
     */
    select?: GroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Group
     */
    omit?: GroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInclude<ExtArgs> | null
  }


  /**
   * Model Membership
   */

  export type AggregateMembership = {
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  export type MembershipMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    role: string | null
  }

  export type MembershipMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    role: string | null
  }

  export type MembershipCountAggregateOutputType = {
    id: number
    groupId: number
    userId: number
    role: number
    _all: number
  }


  export type MembershipMinAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    role?: true
  }

  export type MembershipMaxAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    role?: true
  }

  export type MembershipCountAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    role?: true
    _all?: true
  }

  export type MembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Membership to aggregate.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Memberships
    **/
    _count?: true | MembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MembershipMaxAggregateInputType
  }

  export type GetMembershipAggregateType<T extends MembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMembership[P]>
      : GetScalarType<T[P], AggregateMembership[P]>
  }




  export type MembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithAggregationInput | MembershipOrderByWithAggregationInput[]
    by: MembershipScalarFieldEnum[] | MembershipScalarFieldEnum
    having?: MembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MembershipCountAggregateInputType | true
    _min?: MembershipMinAggregateInputType
    _max?: MembershipMaxAggregateInputType
  }

  export type MembershipGroupByOutputType = {
    id: string
    groupId: string
    userId: string
    role: string
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  type GetMembershipGroupByPayload<T extends MembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MembershipGroupByOutputType[P]>
            : GetScalarType<T[P], MembershipGroupByOutputType[P]>
        }
      >
    >


  export type MembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    role?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    role?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    role?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectScalar = {
    id?: boolean
    groupId?: boolean
    userId?: boolean
    role?: boolean
  }

  export type MembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "userId" | "role", ExtArgs["result"]["membership"]>
  export type MembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type MembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type MembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }

  export type $MembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Membership"
    objects: {
      group: Prisma.$GroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      userId: string
      role: string
    }, ExtArgs["result"]["membership"]>
    composites: {}
  }

  type MembershipGetPayload<S extends boolean | null | undefined | MembershipDefaultArgs> = $Result.GetResult<Prisma.$MembershipPayload, S>

  type MembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MembershipCountAggregateInputType | true
    }

  export interface MembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Membership'], meta: { name: 'Membership' } }
    /**
     * Find zero or one Membership that matches the filter.
     * @param {MembershipFindUniqueArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MembershipFindUniqueArgs>(args: SelectSubset<T, MembershipFindUniqueArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Membership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MembershipFindUniqueOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, MembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Membership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MembershipFindFirstArgs>(args?: SelectSubset<T, MembershipFindFirstArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Membership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, MembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Memberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Memberships
     * const memberships = await prisma.membership.findMany()
     * 
     * // Get first 10 Memberships
     * const memberships = await prisma.membership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const membershipWithIdOnly = await prisma.membership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MembershipFindManyArgs>(args?: SelectSubset<T, MembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Membership.
     * @param {MembershipCreateArgs} args - Arguments to create a Membership.
     * @example
     * // Create one Membership
     * const Membership = await prisma.membership.create({
     *   data: {
     *     // ... data to create a Membership
     *   }
     * })
     * 
     */
    create<T extends MembershipCreateArgs>(args: SelectSubset<T, MembershipCreateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Memberships.
     * @param {MembershipCreateManyArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MembershipCreateManyArgs>(args?: SelectSubset<T, MembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Memberships and returns the data saved in the database.
     * @param {MembershipCreateManyAndReturnArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Memberships and only return the `id`
     * const membershipWithIdOnly = await prisma.membership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, MembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Membership.
     * @param {MembershipDeleteArgs} args - Arguments to delete one Membership.
     * @example
     * // Delete one Membership
     * const Membership = await prisma.membership.delete({
     *   where: {
     *     // ... filter to delete one Membership
     *   }
     * })
     * 
     */
    delete<T extends MembershipDeleteArgs>(args: SelectSubset<T, MembershipDeleteArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Membership.
     * @param {MembershipUpdateArgs} args - Arguments to update one Membership.
     * @example
     * // Update one Membership
     * const membership = await prisma.membership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MembershipUpdateArgs>(args: SelectSubset<T, MembershipUpdateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Memberships.
     * @param {MembershipDeleteManyArgs} args - Arguments to filter Memberships to delete.
     * @example
     * // Delete a few Memberships
     * const { count } = await prisma.membership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MembershipDeleteManyArgs>(args?: SelectSubset<T, MembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Memberships
     * const membership = await prisma.membership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MembershipUpdateManyArgs>(args: SelectSubset<T, MembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Memberships and returns the data updated in the database.
     * @param {MembershipUpdateManyAndReturnArgs} args - Arguments to update many Memberships.
     * @example
     * // Update many Memberships
     * const membership = await prisma.membership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Memberships and only return the `id`
     * const membershipWithIdOnly = await prisma.membership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, MembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Membership.
     * @param {MembershipUpsertArgs} args - Arguments to update or create a Membership.
     * @example
     * // Update or create a Membership
     * const membership = await prisma.membership.upsert({
     *   create: {
     *     // ... data to create a Membership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Membership we want to update
     *   }
     * })
     */
    upsert<T extends MembershipUpsertArgs>(args: SelectSubset<T, MembershipUpsertArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipCountArgs} args - Arguments to filter Memberships to count.
     * @example
     * // Count the number of Memberships
     * const count = await prisma.membership.count({
     *   where: {
     *     // ... the filter for the Memberships we want to count
     *   }
     * })
    **/
    count<T extends MembershipCountArgs>(
      args?: Subset<T, MembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MembershipAggregateArgs>(args: Subset<T, MembershipAggregateArgs>): Prisma.PrismaPromise<GetMembershipAggregateType<T>>

    /**
     * Group by Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MembershipGroupByArgs['orderBy'] }
        : { orderBy?: MembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Membership model
   */
  readonly fields: MembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Membership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends GroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroupDefaultArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Membership model
   */
  interface MembershipFieldRefs {
    readonly id: FieldRef<"Membership", 'String'>
    readonly groupId: FieldRef<"Membership", 'String'>
    readonly userId: FieldRef<"Membership", 'String'>
    readonly role: FieldRef<"Membership", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Membership findUnique
   */
  export type MembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findUniqueOrThrow
   */
  export type MembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findFirst
   */
  export type MembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findFirstOrThrow
   */
  export type MembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findMany
   */
  export type MembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Memberships to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership create
   */
  export type MembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a Membership.
     */
    data: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
  }

  /**
   * Membership createMany
   */
  export type MembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
  }

  /**
   * Membership createManyAndReturn
   */
  export type MembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Membership update
   */
  export type MembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a Membership.
     */
    data: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
    /**
     * Choose, which Membership to update.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership updateMany
   */
  export type MembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Memberships.
     */
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyInput>
    /**
     * Filter which Memberships to update
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to update.
     */
    limit?: number
  }

  /**
   * Membership updateManyAndReturn
   */
  export type MembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * The data used to update Memberships.
     */
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyInput>
    /**
     * Filter which Memberships to update
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Membership upsert
   */
  export type MembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the Membership to update in case it exists.
     */
    where: MembershipWhereUniqueInput
    /**
     * In case the Membership found by the `where` argument doesn't exist, create a new Membership with this data.
     */
    create: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
    /**
     * In case the Membership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
  }

  /**
   * Membership delete
   */
  export type MembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter which Membership to delete.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership deleteMany
   */
  export type MembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Memberships to delete
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to delete.
     */
    limit?: number
  }

  /**
   * Membership without action
   */
  export type MembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
  }


  /**
   * Model JoinRequest
   */

  export type AggregateJoinRequest = {
    _count: JoinRequestCountAggregateOutputType | null
    _min: JoinRequestMinAggregateOutputType | null
    _max: JoinRequestMaxAggregateOutputType | null
  }

  export type JoinRequestMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type JoinRequestMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type JoinRequestCountAggregateOutputType = {
    id: number
    groupId: number
    userId: number
    status: number
    createdAt: number
    _all: number
  }


  export type JoinRequestMinAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    status?: true
    createdAt?: true
  }

  export type JoinRequestMaxAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    status?: true
    createdAt?: true
  }

  export type JoinRequestCountAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type JoinRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JoinRequest to aggregate.
     */
    where?: JoinRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinRequests to fetch.
     */
    orderBy?: JoinRequestOrderByWithRelationInput | JoinRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JoinRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JoinRequests
    **/
    _count?: true | JoinRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JoinRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JoinRequestMaxAggregateInputType
  }

  export type GetJoinRequestAggregateType<T extends JoinRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateJoinRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJoinRequest[P]>
      : GetScalarType<T[P], AggregateJoinRequest[P]>
  }




  export type JoinRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JoinRequestWhereInput
    orderBy?: JoinRequestOrderByWithAggregationInput | JoinRequestOrderByWithAggregationInput[]
    by: JoinRequestScalarFieldEnum[] | JoinRequestScalarFieldEnum
    having?: JoinRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JoinRequestCountAggregateInputType | true
    _min?: JoinRequestMinAggregateInputType
    _max?: JoinRequestMaxAggregateInputType
  }

  export type JoinRequestGroupByOutputType = {
    id: string
    groupId: string
    userId: string
    status: string
    createdAt: Date
    _count: JoinRequestCountAggregateOutputType | null
    _min: JoinRequestMinAggregateOutputType | null
    _max: JoinRequestMaxAggregateOutputType | null
  }

  type GetJoinRequestGroupByPayload<T extends JoinRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JoinRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JoinRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JoinRequestGroupByOutputType[P]>
            : GetScalarType<T[P], JoinRequestGroupByOutputType[P]>
        }
      >
    >


  export type JoinRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinRequest"]>

  export type JoinRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinRequest"]>

  export type JoinRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinRequest"]>

  export type JoinRequestSelectScalar = {
    id?: boolean
    groupId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type JoinRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "userId" | "status" | "createdAt", ExtArgs["result"]["joinRequest"]>
  export type JoinRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type JoinRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type JoinRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }

  export type $JoinRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JoinRequest"
    objects: {
      group: Prisma.$GroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      userId: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["joinRequest"]>
    composites: {}
  }

  type JoinRequestGetPayload<S extends boolean | null | undefined | JoinRequestDefaultArgs> = $Result.GetResult<Prisma.$JoinRequestPayload, S>

  type JoinRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JoinRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JoinRequestCountAggregateInputType | true
    }

  export interface JoinRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JoinRequest'], meta: { name: 'JoinRequest' } }
    /**
     * Find zero or one JoinRequest that matches the filter.
     * @param {JoinRequestFindUniqueArgs} args - Arguments to find a JoinRequest
     * @example
     * // Get one JoinRequest
     * const joinRequest = await prisma.joinRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JoinRequestFindUniqueArgs>(args: SelectSubset<T, JoinRequestFindUniqueArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JoinRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JoinRequestFindUniqueOrThrowArgs} args - Arguments to find a JoinRequest
     * @example
     * // Get one JoinRequest
     * const joinRequest = await prisma.joinRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JoinRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, JoinRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JoinRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestFindFirstArgs} args - Arguments to find a JoinRequest
     * @example
     * // Get one JoinRequest
     * const joinRequest = await prisma.joinRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JoinRequestFindFirstArgs>(args?: SelectSubset<T, JoinRequestFindFirstArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JoinRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestFindFirstOrThrowArgs} args - Arguments to find a JoinRequest
     * @example
     * // Get one JoinRequest
     * const joinRequest = await prisma.joinRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JoinRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, JoinRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JoinRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JoinRequests
     * const joinRequests = await prisma.joinRequest.findMany()
     * 
     * // Get first 10 JoinRequests
     * const joinRequests = await prisma.joinRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const joinRequestWithIdOnly = await prisma.joinRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JoinRequestFindManyArgs>(args?: SelectSubset<T, JoinRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JoinRequest.
     * @param {JoinRequestCreateArgs} args - Arguments to create a JoinRequest.
     * @example
     * // Create one JoinRequest
     * const JoinRequest = await prisma.joinRequest.create({
     *   data: {
     *     // ... data to create a JoinRequest
     *   }
     * })
     * 
     */
    create<T extends JoinRequestCreateArgs>(args: SelectSubset<T, JoinRequestCreateArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JoinRequests.
     * @param {JoinRequestCreateManyArgs} args - Arguments to create many JoinRequests.
     * @example
     * // Create many JoinRequests
     * const joinRequest = await prisma.joinRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JoinRequestCreateManyArgs>(args?: SelectSubset<T, JoinRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JoinRequests and returns the data saved in the database.
     * @param {JoinRequestCreateManyAndReturnArgs} args - Arguments to create many JoinRequests.
     * @example
     * // Create many JoinRequests
     * const joinRequest = await prisma.joinRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JoinRequests and only return the `id`
     * const joinRequestWithIdOnly = await prisma.joinRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JoinRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, JoinRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JoinRequest.
     * @param {JoinRequestDeleteArgs} args - Arguments to delete one JoinRequest.
     * @example
     * // Delete one JoinRequest
     * const JoinRequest = await prisma.joinRequest.delete({
     *   where: {
     *     // ... filter to delete one JoinRequest
     *   }
     * })
     * 
     */
    delete<T extends JoinRequestDeleteArgs>(args: SelectSubset<T, JoinRequestDeleteArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JoinRequest.
     * @param {JoinRequestUpdateArgs} args - Arguments to update one JoinRequest.
     * @example
     * // Update one JoinRequest
     * const joinRequest = await prisma.joinRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JoinRequestUpdateArgs>(args: SelectSubset<T, JoinRequestUpdateArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JoinRequests.
     * @param {JoinRequestDeleteManyArgs} args - Arguments to filter JoinRequests to delete.
     * @example
     * // Delete a few JoinRequests
     * const { count } = await prisma.joinRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JoinRequestDeleteManyArgs>(args?: SelectSubset<T, JoinRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JoinRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JoinRequests
     * const joinRequest = await prisma.joinRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JoinRequestUpdateManyArgs>(args: SelectSubset<T, JoinRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JoinRequests and returns the data updated in the database.
     * @param {JoinRequestUpdateManyAndReturnArgs} args - Arguments to update many JoinRequests.
     * @example
     * // Update many JoinRequests
     * const joinRequest = await prisma.joinRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JoinRequests and only return the `id`
     * const joinRequestWithIdOnly = await prisma.joinRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JoinRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, JoinRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JoinRequest.
     * @param {JoinRequestUpsertArgs} args - Arguments to update or create a JoinRequest.
     * @example
     * // Update or create a JoinRequest
     * const joinRequest = await prisma.joinRequest.upsert({
     *   create: {
     *     // ... data to create a JoinRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JoinRequest we want to update
     *   }
     * })
     */
    upsert<T extends JoinRequestUpsertArgs>(args: SelectSubset<T, JoinRequestUpsertArgs<ExtArgs>>): Prisma__JoinRequestClient<$Result.GetResult<Prisma.$JoinRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JoinRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestCountArgs} args - Arguments to filter JoinRequests to count.
     * @example
     * // Count the number of JoinRequests
     * const count = await prisma.joinRequest.count({
     *   where: {
     *     // ... the filter for the JoinRequests we want to count
     *   }
     * })
    **/
    count<T extends JoinRequestCountArgs>(
      args?: Subset<T, JoinRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JoinRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JoinRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JoinRequestAggregateArgs>(args: Subset<T, JoinRequestAggregateArgs>): Prisma.PrismaPromise<GetJoinRequestAggregateType<T>>

    /**
     * Group by JoinRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JoinRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JoinRequestGroupByArgs['orderBy'] }
        : { orderBy?: JoinRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JoinRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJoinRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JoinRequest model
   */
  readonly fields: JoinRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JoinRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JoinRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends GroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroupDefaultArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JoinRequest model
   */
  interface JoinRequestFieldRefs {
    readonly id: FieldRef<"JoinRequest", 'String'>
    readonly groupId: FieldRef<"JoinRequest", 'String'>
    readonly userId: FieldRef<"JoinRequest", 'String'>
    readonly status: FieldRef<"JoinRequest", 'String'>
    readonly createdAt: FieldRef<"JoinRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JoinRequest findUnique
   */
  export type JoinRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter, which JoinRequest to fetch.
     */
    where: JoinRequestWhereUniqueInput
  }

  /**
   * JoinRequest findUniqueOrThrow
   */
  export type JoinRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter, which JoinRequest to fetch.
     */
    where: JoinRequestWhereUniqueInput
  }

  /**
   * JoinRequest findFirst
   */
  export type JoinRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter, which JoinRequest to fetch.
     */
    where?: JoinRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinRequests to fetch.
     */
    orderBy?: JoinRequestOrderByWithRelationInput | JoinRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JoinRequests.
     */
    cursor?: JoinRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JoinRequests.
     */
    distinct?: JoinRequestScalarFieldEnum | JoinRequestScalarFieldEnum[]
  }

  /**
   * JoinRequest findFirstOrThrow
   */
  export type JoinRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter, which JoinRequest to fetch.
     */
    where?: JoinRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinRequests to fetch.
     */
    orderBy?: JoinRequestOrderByWithRelationInput | JoinRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JoinRequests.
     */
    cursor?: JoinRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JoinRequests.
     */
    distinct?: JoinRequestScalarFieldEnum | JoinRequestScalarFieldEnum[]
  }

  /**
   * JoinRequest findMany
   */
  export type JoinRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter, which JoinRequests to fetch.
     */
    where?: JoinRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinRequests to fetch.
     */
    orderBy?: JoinRequestOrderByWithRelationInput | JoinRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JoinRequests.
     */
    cursor?: JoinRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinRequests.
     */
    skip?: number
    distinct?: JoinRequestScalarFieldEnum | JoinRequestScalarFieldEnum[]
  }

  /**
   * JoinRequest create
   */
  export type JoinRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a JoinRequest.
     */
    data: XOR<JoinRequestCreateInput, JoinRequestUncheckedCreateInput>
  }

  /**
   * JoinRequest createMany
   */
  export type JoinRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JoinRequests.
     */
    data: JoinRequestCreateManyInput | JoinRequestCreateManyInput[]
  }

  /**
   * JoinRequest createManyAndReturn
   */
  export type JoinRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * The data used to create many JoinRequests.
     */
    data: JoinRequestCreateManyInput | JoinRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JoinRequest update
   */
  export type JoinRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a JoinRequest.
     */
    data: XOR<JoinRequestUpdateInput, JoinRequestUncheckedUpdateInput>
    /**
     * Choose, which JoinRequest to update.
     */
    where: JoinRequestWhereUniqueInput
  }

  /**
   * JoinRequest updateMany
   */
  export type JoinRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JoinRequests.
     */
    data: XOR<JoinRequestUpdateManyMutationInput, JoinRequestUncheckedUpdateManyInput>
    /**
     * Filter which JoinRequests to update
     */
    where?: JoinRequestWhereInput
    /**
     * Limit how many JoinRequests to update.
     */
    limit?: number
  }

  /**
   * JoinRequest updateManyAndReturn
   */
  export type JoinRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * The data used to update JoinRequests.
     */
    data: XOR<JoinRequestUpdateManyMutationInput, JoinRequestUncheckedUpdateManyInput>
    /**
     * Filter which JoinRequests to update
     */
    where?: JoinRequestWhereInput
    /**
     * Limit how many JoinRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JoinRequest upsert
   */
  export type JoinRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the JoinRequest to update in case it exists.
     */
    where: JoinRequestWhereUniqueInput
    /**
     * In case the JoinRequest found by the `where` argument doesn't exist, create a new JoinRequest with this data.
     */
    create: XOR<JoinRequestCreateInput, JoinRequestUncheckedCreateInput>
    /**
     * In case the JoinRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JoinRequestUpdateInput, JoinRequestUncheckedUpdateInput>
  }

  /**
   * JoinRequest delete
   */
  export type JoinRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
    /**
     * Filter which JoinRequest to delete.
     */
    where: JoinRequestWhereUniqueInput
  }

  /**
   * JoinRequest deleteMany
   */
  export type JoinRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JoinRequests to delete
     */
    where?: JoinRequestWhereInput
    /**
     * Limit how many JoinRequests to delete.
     */
    limit?: number
  }

  /**
   * JoinRequest without action
   */
  export type JoinRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinRequest
     */
    select?: JoinRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinRequest
     */
    omit?: JoinRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinRequestInclude<ExtArgs> | null
  }


  /**
   * Model GroupInvite
   */

  export type AggregateGroupInvite = {
    _count: GroupInviteCountAggregateOutputType | null
    _min: GroupInviteMinAggregateOutputType | null
    _max: GroupInviteMaxAggregateOutputType | null
  }

  export type GroupInviteMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    createdByUserId: string | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type GroupInviteMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    createdByUserId: string | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type GroupInviteCountAggregateOutputType = {
    id: number
    groupId: number
    createdByUserId: number
    createdAt: number
    revokedAt: number
    _all: number
  }


  export type GroupInviteMinAggregateInputType = {
    id?: true
    groupId?: true
    createdByUserId?: true
    createdAt?: true
    revokedAt?: true
  }

  export type GroupInviteMaxAggregateInputType = {
    id?: true
    groupId?: true
    createdByUserId?: true
    createdAt?: true
    revokedAt?: true
  }

  export type GroupInviteCountAggregateInputType = {
    id?: true
    groupId?: true
    createdByUserId?: true
    createdAt?: true
    revokedAt?: true
    _all?: true
  }

  export type GroupInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupInvite to aggregate.
     */
    where?: GroupInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupInvites to fetch.
     */
    orderBy?: GroupInviteOrderByWithRelationInput | GroupInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupInvites
    **/
    _count?: true | GroupInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupInviteMaxAggregateInputType
  }

  export type GetGroupInviteAggregateType<T extends GroupInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupInvite[P]>
      : GetScalarType<T[P], AggregateGroupInvite[P]>
  }




  export type GroupInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupInviteWhereInput
    orderBy?: GroupInviteOrderByWithAggregationInput | GroupInviteOrderByWithAggregationInput[]
    by: GroupInviteScalarFieldEnum[] | GroupInviteScalarFieldEnum
    having?: GroupInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupInviteCountAggregateInputType | true
    _min?: GroupInviteMinAggregateInputType
    _max?: GroupInviteMaxAggregateInputType
  }

  export type GroupInviteGroupByOutputType = {
    id: string
    groupId: string
    createdByUserId: string
    createdAt: Date
    revokedAt: Date | null
    _count: GroupInviteCountAggregateOutputType | null
    _min: GroupInviteMinAggregateOutputType | null
    _max: GroupInviteMaxAggregateOutputType | null
  }

  type GetGroupInviteGroupByPayload<T extends GroupInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupInviteGroupByOutputType[P]>
            : GetScalarType<T[P], GroupInviteGroupByOutputType[P]>
        }
      >
    >


  export type GroupInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupInvite"]>

  export type GroupInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupInvite"]>

  export type GroupInviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupInvite"]>

  export type GroupInviteSelectScalar = {
    id?: boolean
    groupId?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    revokedAt?: boolean
  }

  export type GroupInviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "createdByUserId" | "createdAt" | "revokedAt", ExtArgs["result"]["groupInvite"]>
  export type GroupInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type GroupInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type GroupInviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }

  export type $GroupInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupInvite"
    objects: {
      group: Prisma.$GroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      createdByUserId: string
      createdAt: Date
      revokedAt: Date | null
    }, ExtArgs["result"]["groupInvite"]>
    composites: {}
  }

  type GroupInviteGetPayload<S extends boolean | null | undefined | GroupInviteDefaultArgs> = $Result.GetResult<Prisma.$GroupInvitePayload, S>

  type GroupInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroupInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroupInviteCountAggregateInputType | true
    }

  export interface GroupInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupInvite'], meta: { name: 'GroupInvite' } }
    /**
     * Find zero or one GroupInvite that matches the filter.
     * @param {GroupInviteFindUniqueArgs} args - Arguments to find a GroupInvite
     * @example
     * // Get one GroupInvite
     * const groupInvite = await prisma.groupInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupInviteFindUniqueArgs>(args: SelectSubset<T, GroupInviteFindUniqueArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroupInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroupInviteFindUniqueOrThrowArgs} args - Arguments to find a GroupInvite
     * @example
     * // Get one GroupInvite
     * const groupInvite = await prisma.groupInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteFindFirstArgs} args - Arguments to find a GroupInvite
     * @example
     * // Get one GroupInvite
     * const groupInvite = await prisma.groupInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupInviteFindFirstArgs>(args?: SelectSubset<T, GroupInviteFindFirstArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteFindFirstOrThrowArgs} args - Arguments to find a GroupInvite
     * @example
     * // Get one GroupInvite
     * const groupInvite = await prisma.groupInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroupInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupInvites
     * const groupInvites = await prisma.groupInvite.findMany()
     * 
     * // Get first 10 GroupInvites
     * const groupInvites = await prisma.groupInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupInviteWithIdOnly = await prisma.groupInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupInviteFindManyArgs>(args?: SelectSubset<T, GroupInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroupInvite.
     * @param {GroupInviteCreateArgs} args - Arguments to create a GroupInvite.
     * @example
     * // Create one GroupInvite
     * const GroupInvite = await prisma.groupInvite.create({
     *   data: {
     *     // ... data to create a GroupInvite
     *   }
     * })
     * 
     */
    create<T extends GroupInviteCreateArgs>(args: SelectSubset<T, GroupInviteCreateArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroupInvites.
     * @param {GroupInviteCreateManyArgs} args - Arguments to create many GroupInvites.
     * @example
     * // Create many GroupInvites
     * const groupInvite = await prisma.groupInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupInviteCreateManyArgs>(args?: SelectSubset<T, GroupInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupInvites and returns the data saved in the database.
     * @param {GroupInviteCreateManyAndReturnArgs} args - Arguments to create many GroupInvites.
     * @example
     * // Create many GroupInvites
     * const groupInvite = await prisma.groupInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupInvites and only return the `id`
     * const groupInviteWithIdOnly = await prisma.groupInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroupInvite.
     * @param {GroupInviteDeleteArgs} args - Arguments to delete one GroupInvite.
     * @example
     * // Delete one GroupInvite
     * const GroupInvite = await prisma.groupInvite.delete({
     *   where: {
     *     // ... filter to delete one GroupInvite
     *   }
     * })
     * 
     */
    delete<T extends GroupInviteDeleteArgs>(args: SelectSubset<T, GroupInviteDeleteArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroupInvite.
     * @param {GroupInviteUpdateArgs} args - Arguments to update one GroupInvite.
     * @example
     * // Update one GroupInvite
     * const groupInvite = await prisma.groupInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupInviteUpdateArgs>(args: SelectSubset<T, GroupInviteUpdateArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroupInvites.
     * @param {GroupInviteDeleteManyArgs} args - Arguments to filter GroupInvites to delete.
     * @example
     * // Delete a few GroupInvites
     * const { count } = await prisma.groupInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupInviteDeleteManyArgs>(args?: SelectSubset<T, GroupInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupInvites
     * const groupInvite = await prisma.groupInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupInviteUpdateManyArgs>(args: SelectSubset<T, GroupInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupInvites and returns the data updated in the database.
     * @param {GroupInviteUpdateManyAndReturnArgs} args - Arguments to update many GroupInvites.
     * @example
     * // Update many GroupInvites
     * const groupInvite = await prisma.groupInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroupInvites and only return the `id`
     * const groupInviteWithIdOnly = await prisma.groupInvite.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GroupInviteUpdateManyAndReturnArgs>(args: SelectSubset<T, GroupInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroupInvite.
     * @param {GroupInviteUpsertArgs} args - Arguments to update or create a GroupInvite.
     * @example
     * // Update or create a GroupInvite
     * const groupInvite = await prisma.groupInvite.upsert({
     *   create: {
     *     // ... data to create a GroupInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupInvite we want to update
     *   }
     * })
     */
    upsert<T extends GroupInviteUpsertArgs>(args: SelectSubset<T, GroupInviteUpsertArgs<ExtArgs>>): Prisma__GroupInviteClient<$Result.GetResult<Prisma.$GroupInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroupInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteCountArgs} args - Arguments to filter GroupInvites to count.
     * @example
     * // Count the number of GroupInvites
     * const count = await prisma.groupInvite.count({
     *   where: {
     *     // ... the filter for the GroupInvites we want to count
     *   }
     * })
    **/
    count<T extends GroupInviteCountArgs>(
      args?: Subset<T, GroupInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroupInviteAggregateArgs>(args: Subset<T, GroupInviteAggregateArgs>): Prisma.PrismaPromise<GetGroupInviteAggregateType<T>>

    /**
     * Group by GroupInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupInviteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GroupInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupInviteGroupByArgs['orderBy'] }
        : { orderBy?: GroupInviteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GroupInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupInvite model
   */
  readonly fields: GroupInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends GroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroupDefaultArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GroupInvite model
   */
  interface GroupInviteFieldRefs {
    readonly id: FieldRef<"GroupInvite", 'String'>
    readonly groupId: FieldRef<"GroupInvite", 'String'>
    readonly createdByUserId: FieldRef<"GroupInvite", 'String'>
    readonly createdAt: FieldRef<"GroupInvite", 'DateTime'>
    readonly revokedAt: FieldRef<"GroupInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupInvite findUnique
   */
  export type GroupInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter, which GroupInvite to fetch.
     */
    where: GroupInviteWhereUniqueInput
  }

  /**
   * GroupInvite findUniqueOrThrow
   */
  export type GroupInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter, which GroupInvite to fetch.
     */
    where: GroupInviteWhereUniqueInput
  }

  /**
   * GroupInvite findFirst
   */
  export type GroupInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter, which GroupInvite to fetch.
     */
    where?: GroupInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupInvites to fetch.
     */
    orderBy?: GroupInviteOrderByWithRelationInput | GroupInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupInvites.
     */
    cursor?: GroupInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupInvites.
     */
    distinct?: GroupInviteScalarFieldEnum | GroupInviteScalarFieldEnum[]
  }

  /**
   * GroupInvite findFirstOrThrow
   */
  export type GroupInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter, which GroupInvite to fetch.
     */
    where?: GroupInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupInvites to fetch.
     */
    orderBy?: GroupInviteOrderByWithRelationInput | GroupInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupInvites.
     */
    cursor?: GroupInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupInvites.
     */
    distinct?: GroupInviteScalarFieldEnum | GroupInviteScalarFieldEnum[]
  }

  /**
   * GroupInvite findMany
   */
  export type GroupInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter, which GroupInvites to fetch.
     */
    where?: GroupInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupInvites to fetch.
     */
    orderBy?: GroupInviteOrderByWithRelationInput | GroupInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupInvites.
     */
    cursor?: GroupInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupInvites.
     */
    skip?: number
    distinct?: GroupInviteScalarFieldEnum | GroupInviteScalarFieldEnum[]
  }

  /**
   * GroupInvite create
   */
  export type GroupInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupInvite.
     */
    data: XOR<GroupInviteCreateInput, GroupInviteUncheckedCreateInput>
  }

  /**
   * GroupInvite createMany
   */
  export type GroupInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupInvites.
     */
    data: GroupInviteCreateManyInput | GroupInviteCreateManyInput[]
  }

  /**
   * GroupInvite createManyAndReturn
   */
  export type GroupInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * The data used to create many GroupInvites.
     */
    data: GroupInviteCreateManyInput | GroupInviteCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupInvite update
   */
  export type GroupInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupInvite.
     */
    data: XOR<GroupInviteUpdateInput, GroupInviteUncheckedUpdateInput>
    /**
     * Choose, which GroupInvite to update.
     */
    where: GroupInviteWhereUniqueInput
  }

  /**
   * GroupInvite updateMany
   */
  export type GroupInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupInvites.
     */
    data: XOR<GroupInviteUpdateManyMutationInput, GroupInviteUncheckedUpdateManyInput>
    /**
     * Filter which GroupInvites to update
     */
    where?: GroupInviteWhereInput
    /**
     * Limit how many GroupInvites to update.
     */
    limit?: number
  }

  /**
   * GroupInvite updateManyAndReturn
   */
  export type GroupInviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * The data used to update GroupInvites.
     */
    data: XOR<GroupInviteUpdateManyMutationInput, GroupInviteUncheckedUpdateManyInput>
    /**
     * Filter which GroupInvites to update
     */
    where?: GroupInviteWhereInput
    /**
     * Limit how many GroupInvites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupInvite upsert
   */
  export type GroupInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupInvite to update in case it exists.
     */
    where: GroupInviteWhereUniqueInput
    /**
     * In case the GroupInvite found by the `where` argument doesn't exist, create a new GroupInvite with this data.
     */
    create: XOR<GroupInviteCreateInput, GroupInviteUncheckedCreateInput>
    /**
     * In case the GroupInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupInviteUpdateInput, GroupInviteUncheckedUpdateInput>
  }

  /**
   * GroupInvite delete
   */
  export type GroupInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
    /**
     * Filter which GroupInvite to delete.
     */
    where: GroupInviteWhereUniqueInput
  }

  /**
   * GroupInvite deleteMany
   */
  export type GroupInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupInvites to delete
     */
    where?: GroupInviteWhereInput
    /**
     * Limit how many GroupInvites to delete.
     */
    limit?: number
  }

  /**
   * GroupInvite without action
   */
  export type GroupInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupInvite
     */
    select?: GroupInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupInvite
     */
    omit?: GroupInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupInviteInclude<ExtArgs> | null
  }


  /**
   * Model GroupBookOfMonthSelection
   */

  export type AggregateGroupBookOfMonthSelection = {
    _count: GroupBookOfMonthSelectionCountAggregateOutputType | null
    _min: GroupBookOfMonthSelectionMinAggregateOutputType | null
    _max: GroupBookOfMonthSelectionMaxAggregateOutputType | null
  }

  export type GroupBookOfMonthSelectionMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    bookId: string | null
    setByUserId: string | null
    setAt: Date | null
  }

  export type GroupBookOfMonthSelectionMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    bookId: string | null
    setByUserId: string | null
    setAt: Date | null
  }

  export type GroupBookOfMonthSelectionCountAggregateOutputType = {
    id: number
    groupId: number
    bookId: number
    setByUserId: number
    setAt: number
    _all: number
  }


  export type GroupBookOfMonthSelectionMinAggregateInputType = {
    id?: true
    groupId?: true
    bookId?: true
    setByUserId?: true
    setAt?: true
  }

  export type GroupBookOfMonthSelectionMaxAggregateInputType = {
    id?: true
    groupId?: true
    bookId?: true
    setByUserId?: true
    setAt?: true
  }

  export type GroupBookOfMonthSelectionCountAggregateInputType = {
    id?: true
    groupId?: true
    bookId?: true
    setByUserId?: true
    setAt?: true
    _all?: true
  }

  export type GroupBookOfMonthSelectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupBookOfMonthSelection to aggregate.
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupBookOfMonthSelections to fetch.
     */
    orderBy?: GroupBookOfMonthSelectionOrderByWithRelationInput | GroupBookOfMonthSelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupBookOfMonthSelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupBookOfMonthSelections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupBookOfMonthSelections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupBookOfMonthSelections
    **/
    _count?: true | GroupBookOfMonthSelectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupBookOfMonthSelectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupBookOfMonthSelectionMaxAggregateInputType
  }

  export type GetGroupBookOfMonthSelectionAggregateType<T extends GroupBookOfMonthSelectionAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupBookOfMonthSelection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupBookOfMonthSelection[P]>
      : GetScalarType<T[P], AggregateGroupBookOfMonthSelection[P]>
  }




  export type GroupBookOfMonthSelectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupBookOfMonthSelectionWhereInput
    orderBy?: GroupBookOfMonthSelectionOrderByWithAggregationInput | GroupBookOfMonthSelectionOrderByWithAggregationInput[]
    by: GroupBookOfMonthSelectionScalarFieldEnum[] | GroupBookOfMonthSelectionScalarFieldEnum
    having?: GroupBookOfMonthSelectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupBookOfMonthSelectionCountAggregateInputType | true
    _min?: GroupBookOfMonthSelectionMinAggregateInputType
    _max?: GroupBookOfMonthSelectionMaxAggregateInputType
  }

  export type GroupBookOfMonthSelectionGroupByOutputType = {
    id: string
    groupId: string
    bookId: string
    setByUserId: string
    setAt: Date
    _count: GroupBookOfMonthSelectionCountAggregateOutputType | null
    _min: GroupBookOfMonthSelectionMinAggregateOutputType | null
    _max: GroupBookOfMonthSelectionMaxAggregateOutputType | null
  }

  type GetGroupBookOfMonthSelectionGroupByPayload<T extends GroupBookOfMonthSelectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupBookOfMonthSelectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupBookOfMonthSelectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupBookOfMonthSelectionGroupByOutputType[P]>
            : GetScalarType<T[P], GroupBookOfMonthSelectionGroupByOutputType[P]>
        }
      >
    >


  export type GroupBookOfMonthSelectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    bookId?: boolean
    setByUserId?: boolean
    setAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupBookOfMonthSelection"]>

  export type GroupBookOfMonthSelectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    bookId?: boolean
    setByUserId?: boolean
    setAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupBookOfMonthSelection"]>

  export type GroupBookOfMonthSelectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    bookId?: boolean
    setByUserId?: boolean
    setAt?: boolean
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupBookOfMonthSelection"]>

  export type GroupBookOfMonthSelectionSelectScalar = {
    id?: boolean
    groupId?: boolean
    bookId?: boolean
    setByUserId?: boolean
    setAt?: boolean
  }

  export type GroupBookOfMonthSelectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "bookId" | "setByUserId" | "setAt", ExtArgs["result"]["groupBookOfMonthSelection"]>
  export type GroupBookOfMonthSelectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type GroupBookOfMonthSelectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }
  export type GroupBookOfMonthSelectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | GroupDefaultArgs<ExtArgs>
  }

  export type $GroupBookOfMonthSelectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupBookOfMonthSelection"
    objects: {
      group: Prisma.$GroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      bookId: string
      setByUserId: string
      setAt: Date
    }, ExtArgs["result"]["groupBookOfMonthSelection"]>
    composites: {}
  }

  type GroupBookOfMonthSelectionGetPayload<S extends boolean | null | undefined | GroupBookOfMonthSelectionDefaultArgs> = $Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload, S>

  type GroupBookOfMonthSelectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroupBookOfMonthSelectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroupBookOfMonthSelectionCountAggregateInputType | true
    }

  export interface GroupBookOfMonthSelectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupBookOfMonthSelection'], meta: { name: 'GroupBookOfMonthSelection' } }
    /**
     * Find zero or one GroupBookOfMonthSelection that matches the filter.
     * @param {GroupBookOfMonthSelectionFindUniqueArgs} args - Arguments to find a GroupBookOfMonthSelection
     * @example
     * // Get one GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupBookOfMonthSelectionFindUniqueArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionFindUniqueArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroupBookOfMonthSelection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroupBookOfMonthSelectionFindUniqueOrThrowArgs} args - Arguments to find a GroupBookOfMonthSelection
     * @example
     * // Get one GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupBookOfMonthSelectionFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupBookOfMonthSelection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionFindFirstArgs} args - Arguments to find a GroupBookOfMonthSelection
     * @example
     * // Get one GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupBookOfMonthSelectionFindFirstArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionFindFirstArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupBookOfMonthSelection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionFindFirstOrThrowArgs} args - Arguments to find a GroupBookOfMonthSelection
     * @example
     * // Get one GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupBookOfMonthSelectionFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroupBookOfMonthSelections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupBookOfMonthSelections
     * const groupBookOfMonthSelections = await prisma.groupBookOfMonthSelection.findMany()
     * 
     * // Get first 10 GroupBookOfMonthSelections
     * const groupBookOfMonthSelections = await prisma.groupBookOfMonthSelection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupBookOfMonthSelectionWithIdOnly = await prisma.groupBookOfMonthSelection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupBookOfMonthSelectionFindManyArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroupBookOfMonthSelection.
     * @param {GroupBookOfMonthSelectionCreateArgs} args - Arguments to create a GroupBookOfMonthSelection.
     * @example
     * // Create one GroupBookOfMonthSelection
     * const GroupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.create({
     *   data: {
     *     // ... data to create a GroupBookOfMonthSelection
     *   }
     * })
     * 
     */
    create<T extends GroupBookOfMonthSelectionCreateArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionCreateArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroupBookOfMonthSelections.
     * @param {GroupBookOfMonthSelectionCreateManyArgs} args - Arguments to create many GroupBookOfMonthSelections.
     * @example
     * // Create many GroupBookOfMonthSelections
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupBookOfMonthSelectionCreateManyArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupBookOfMonthSelections and returns the data saved in the database.
     * @param {GroupBookOfMonthSelectionCreateManyAndReturnArgs} args - Arguments to create many GroupBookOfMonthSelections.
     * @example
     * // Create many GroupBookOfMonthSelections
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupBookOfMonthSelections and only return the `id`
     * const groupBookOfMonthSelectionWithIdOnly = await prisma.groupBookOfMonthSelection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupBookOfMonthSelectionCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroupBookOfMonthSelection.
     * @param {GroupBookOfMonthSelectionDeleteArgs} args - Arguments to delete one GroupBookOfMonthSelection.
     * @example
     * // Delete one GroupBookOfMonthSelection
     * const GroupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.delete({
     *   where: {
     *     // ... filter to delete one GroupBookOfMonthSelection
     *   }
     * })
     * 
     */
    delete<T extends GroupBookOfMonthSelectionDeleteArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionDeleteArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroupBookOfMonthSelection.
     * @param {GroupBookOfMonthSelectionUpdateArgs} args - Arguments to update one GroupBookOfMonthSelection.
     * @example
     * // Update one GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupBookOfMonthSelectionUpdateArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionUpdateArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroupBookOfMonthSelections.
     * @param {GroupBookOfMonthSelectionDeleteManyArgs} args - Arguments to filter GroupBookOfMonthSelections to delete.
     * @example
     * // Delete a few GroupBookOfMonthSelections
     * const { count } = await prisma.groupBookOfMonthSelection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupBookOfMonthSelectionDeleteManyArgs>(args?: SelectSubset<T, GroupBookOfMonthSelectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupBookOfMonthSelections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupBookOfMonthSelections
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupBookOfMonthSelectionUpdateManyArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupBookOfMonthSelections and returns the data updated in the database.
     * @param {GroupBookOfMonthSelectionUpdateManyAndReturnArgs} args - Arguments to update many GroupBookOfMonthSelections.
     * @example
     * // Update many GroupBookOfMonthSelections
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroupBookOfMonthSelections and only return the `id`
     * const groupBookOfMonthSelectionWithIdOnly = await prisma.groupBookOfMonthSelection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GroupBookOfMonthSelectionUpdateManyAndReturnArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroupBookOfMonthSelection.
     * @param {GroupBookOfMonthSelectionUpsertArgs} args - Arguments to update or create a GroupBookOfMonthSelection.
     * @example
     * // Update or create a GroupBookOfMonthSelection
     * const groupBookOfMonthSelection = await prisma.groupBookOfMonthSelection.upsert({
     *   create: {
     *     // ... data to create a GroupBookOfMonthSelection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupBookOfMonthSelection we want to update
     *   }
     * })
     */
    upsert<T extends GroupBookOfMonthSelectionUpsertArgs>(args: SelectSubset<T, GroupBookOfMonthSelectionUpsertArgs<ExtArgs>>): Prisma__GroupBookOfMonthSelectionClient<$Result.GetResult<Prisma.$GroupBookOfMonthSelectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroupBookOfMonthSelections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionCountArgs} args - Arguments to filter GroupBookOfMonthSelections to count.
     * @example
     * // Count the number of GroupBookOfMonthSelections
     * const count = await prisma.groupBookOfMonthSelection.count({
     *   where: {
     *     // ... the filter for the GroupBookOfMonthSelections we want to count
     *   }
     * })
    **/
    count<T extends GroupBookOfMonthSelectionCountArgs>(
      args?: Subset<T, GroupBookOfMonthSelectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupBookOfMonthSelectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupBookOfMonthSelection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroupBookOfMonthSelectionAggregateArgs>(args: Subset<T, GroupBookOfMonthSelectionAggregateArgs>): Prisma.PrismaPromise<GetGroupBookOfMonthSelectionAggregateType<T>>

    /**
     * Group by GroupBookOfMonthSelection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupBookOfMonthSelectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GroupBookOfMonthSelectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupBookOfMonthSelectionGroupByArgs['orderBy'] }
        : { orderBy?: GroupBookOfMonthSelectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GroupBookOfMonthSelectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupBookOfMonthSelectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupBookOfMonthSelection model
   */
  readonly fields: GroupBookOfMonthSelectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupBookOfMonthSelection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupBookOfMonthSelectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends GroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroupDefaultArgs<ExtArgs>>): Prisma__GroupClient<$Result.GetResult<Prisma.$GroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GroupBookOfMonthSelection model
   */
  interface GroupBookOfMonthSelectionFieldRefs {
    readonly id: FieldRef<"GroupBookOfMonthSelection", 'String'>
    readonly groupId: FieldRef<"GroupBookOfMonthSelection", 'String'>
    readonly bookId: FieldRef<"GroupBookOfMonthSelection", 'String'>
    readonly setByUserId: FieldRef<"GroupBookOfMonthSelection", 'String'>
    readonly setAt: FieldRef<"GroupBookOfMonthSelection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupBookOfMonthSelection findUnique
   */
  export type GroupBookOfMonthSelectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter, which GroupBookOfMonthSelection to fetch.
     */
    where: GroupBookOfMonthSelectionWhereUniqueInput
  }

  /**
   * GroupBookOfMonthSelection findUniqueOrThrow
   */
  export type GroupBookOfMonthSelectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter, which GroupBookOfMonthSelection to fetch.
     */
    where: GroupBookOfMonthSelectionWhereUniqueInput
  }

  /**
   * GroupBookOfMonthSelection findFirst
   */
  export type GroupBookOfMonthSelectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter, which GroupBookOfMonthSelection to fetch.
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupBookOfMonthSelections to fetch.
     */
    orderBy?: GroupBookOfMonthSelectionOrderByWithRelationInput | GroupBookOfMonthSelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupBookOfMonthSelections.
     */
    cursor?: GroupBookOfMonthSelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupBookOfMonthSelections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupBookOfMonthSelections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupBookOfMonthSelections.
     */
    distinct?: GroupBookOfMonthSelectionScalarFieldEnum | GroupBookOfMonthSelectionScalarFieldEnum[]
  }

  /**
   * GroupBookOfMonthSelection findFirstOrThrow
   */
  export type GroupBookOfMonthSelectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter, which GroupBookOfMonthSelection to fetch.
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupBookOfMonthSelections to fetch.
     */
    orderBy?: GroupBookOfMonthSelectionOrderByWithRelationInput | GroupBookOfMonthSelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupBookOfMonthSelections.
     */
    cursor?: GroupBookOfMonthSelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupBookOfMonthSelections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupBookOfMonthSelections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupBookOfMonthSelections.
     */
    distinct?: GroupBookOfMonthSelectionScalarFieldEnum | GroupBookOfMonthSelectionScalarFieldEnum[]
  }

  /**
   * GroupBookOfMonthSelection findMany
   */
  export type GroupBookOfMonthSelectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter, which GroupBookOfMonthSelections to fetch.
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupBookOfMonthSelections to fetch.
     */
    orderBy?: GroupBookOfMonthSelectionOrderByWithRelationInput | GroupBookOfMonthSelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupBookOfMonthSelections.
     */
    cursor?: GroupBookOfMonthSelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupBookOfMonthSelections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupBookOfMonthSelections.
     */
    skip?: number
    distinct?: GroupBookOfMonthSelectionScalarFieldEnum | GroupBookOfMonthSelectionScalarFieldEnum[]
  }

  /**
   * GroupBookOfMonthSelection create
   */
  export type GroupBookOfMonthSelectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupBookOfMonthSelection.
     */
    data: XOR<GroupBookOfMonthSelectionCreateInput, GroupBookOfMonthSelectionUncheckedCreateInput>
  }

  /**
   * GroupBookOfMonthSelection createMany
   */
  export type GroupBookOfMonthSelectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupBookOfMonthSelections.
     */
    data: GroupBookOfMonthSelectionCreateManyInput | GroupBookOfMonthSelectionCreateManyInput[]
  }

  /**
   * GroupBookOfMonthSelection createManyAndReturn
   */
  export type GroupBookOfMonthSelectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * The data used to create many GroupBookOfMonthSelections.
     */
    data: GroupBookOfMonthSelectionCreateManyInput | GroupBookOfMonthSelectionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupBookOfMonthSelection update
   */
  export type GroupBookOfMonthSelectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupBookOfMonthSelection.
     */
    data: XOR<GroupBookOfMonthSelectionUpdateInput, GroupBookOfMonthSelectionUncheckedUpdateInput>
    /**
     * Choose, which GroupBookOfMonthSelection to update.
     */
    where: GroupBookOfMonthSelectionWhereUniqueInput
  }

  /**
   * GroupBookOfMonthSelection updateMany
   */
  export type GroupBookOfMonthSelectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupBookOfMonthSelections.
     */
    data: XOR<GroupBookOfMonthSelectionUpdateManyMutationInput, GroupBookOfMonthSelectionUncheckedUpdateManyInput>
    /**
     * Filter which GroupBookOfMonthSelections to update
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * Limit how many GroupBookOfMonthSelections to update.
     */
    limit?: number
  }

  /**
   * GroupBookOfMonthSelection updateManyAndReturn
   */
  export type GroupBookOfMonthSelectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * The data used to update GroupBookOfMonthSelections.
     */
    data: XOR<GroupBookOfMonthSelectionUpdateManyMutationInput, GroupBookOfMonthSelectionUncheckedUpdateManyInput>
    /**
     * Filter which GroupBookOfMonthSelections to update
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * Limit how many GroupBookOfMonthSelections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupBookOfMonthSelection upsert
   */
  export type GroupBookOfMonthSelectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupBookOfMonthSelection to update in case it exists.
     */
    where: GroupBookOfMonthSelectionWhereUniqueInput
    /**
     * In case the GroupBookOfMonthSelection found by the `where` argument doesn't exist, create a new GroupBookOfMonthSelection with this data.
     */
    create: XOR<GroupBookOfMonthSelectionCreateInput, GroupBookOfMonthSelectionUncheckedCreateInput>
    /**
     * In case the GroupBookOfMonthSelection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupBookOfMonthSelectionUpdateInput, GroupBookOfMonthSelectionUncheckedUpdateInput>
  }

  /**
   * GroupBookOfMonthSelection delete
   */
  export type GroupBookOfMonthSelectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
    /**
     * Filter which GroupBookOfMonthSelection to delete.
     */
    where: GroupBookOfMonthSelectionWhereUniqueInput
  }

  /**
   * GroupBookOfMonthSelection deleteMany
   */
  export type GroupBookOfMonthSelectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupBookOfMonthSelections to delete
     */
    where?: GroupBookOfMonthSelectionWhereInput
    /**
     * Limit how many GroupBookOfMonthSelections to delete.
     */
    limit?: number
  }

  /**
   * GroupBookOfMonthSelection without action
   */
  export type GroupBookOfMonthSelectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupBookOfMonthSelection
     */
    select?: GroupBookOfMonthSelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupBookOfMonthSelection
     */
    omit?: GroupBookOfMonthSelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupBookOfMonthSelectionInclude<ExtArgs> | null
  }


  /**
   * Model ClubBook
   */

  export type AggregateClubBook = {
    _count: ClubBookCountAggregateOutputType | null
    _min: ClubBookMinAggregateOutputType | null
    _max: ClubBookMaxAggregateOutputType | null
  }

  export type ClubBookMinAggregateOutputType = {
    id: string | null
    bookId: string | null
    title: string | null
    author: string | null
    colorKey: string | null
    isActive: boolean | null
    createdByUserId: string | null
    createdAt: Date | null
    activatedAt: Date | null
  }

  export type ClubBookMaxAggregateOutputType = {
    id: string | null
    bookId: string | null
    title: string | null
    author: string | null
    colorKey: string | null
    isActive: boolean | null
    createdByUserId: string | null
    createdAt: Date | null
    activatedAt: Date | null
  }

  export type ClubBookCountAggregateOutputType = {
    id: number
    bookId: number
    title: number
    author: number
    colorKey: number
    isActive: number
    createdByUserId: number
    createdAt: number
    activatedAt: number
    _all: number
  }


  export type ClubBookMinAggregateInputType = {
    id?: true
    bookId?: true
    title?: true
    author?: true
    colorKey?: true
    isActive?: true
    createdByUserId?: true
    createdAt?: true
    activatedAt?: true
  }

  export type ClubBookMaxAggregateInputType = {
    id?: true
    bookId?: true
    title?: true
    author?: true
    colorKey?: true
    isActive?: true
    createdByUserId?: true
    createdAt?: true
    activatedAt?: true
  }

  export type ClubBookCountAggregateInputType = {
    id?: true
    bookId?: true
    title?: true
    author?: true
    colorKey?: true
    isActive?: true
    createdByUserId?: true
    createdAt?: true
    activatedAt?: true
    _all?: true
  }

  export type ClubBookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBook to aggregate.
     */
    where?: ClubBookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBooks to fetch.
     */
    orderBy?: ClubBookOrderByWithRelationInput | ClubBookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClubBookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClubBooks
    **/
    _count?: true | ClubBookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClubBookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClubBookMaxAggregateInputType
  }

  export type GetClubBookAggregateType<T extends ClubBookAggregateArgs> = {
        [P in keyof T & keyof AggregateClubBook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubBook[P]>
      : GetScalarType<T[P], AggregateClubBook[P]>
  }




  export type ClubBookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClubBookWhereInput
    orderBy?: ClubBookOrderByWithAggregationInput | ClubBookOrderByWithAggregationInput[]
    by: ClubBookScalarFieldEnum[] | ClubBookScalarFieldEnum
    having?: ClubBookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClubBookCountAggregateInputType | true
    _min?: ClubBookMinAggregateInputType
    _max?: ClubBookMaxAggregateInputType
  }

  export type ClubBookGroupByOutputType = {
    id: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive: boolean
    createdByUserId: string
    createdAt: Date
    activatedAt: Date | null
    _count: ClubBookCountAggregateOutputType | null
    _min: ClubBookMinAggregateOutputType | null
    _max: ClubBookMaxAggregateOutputType | null
  }

  type GetClubBookGroupByPayload<T extends ClubBookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubBookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClubBookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubBookGroupByOutputType[P]>
            : GetScalarType<T[P], ClubBookGroupByOutputType[P]>
        }
      >
    >


  export type ClubBookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    title?: boolean
    author?: boolean
    colorKey?: boolean
    isActive?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    activatedAt?: boolean
    messages?: boolean | ClubBook$messagesArgs<ExtArgs>
    artifacts?: boolean | ClubBook$artifactsArgs<ExtArgs>
    _count?: boolean | ClubBookCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBook"]>

  export type ClubBookSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    title?: boolean
    author?: boolean
    colorKey?: boolean
    isActive?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    activatedAt?: boolean
  }, ExtArgs["result"]["clubBook"]>

  export type ClubBookSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    title?: boolean
    author?: boolean
    colorKey?: boolean
    isActive?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    activatedAt?: boolean
  }, ExtArgs["result"]["clubBook"]>

  export type ClubBookSelectScalar = {
    id?: boolean
    bookId?: boolean
    title?: boolean
    author?: boolean
    colorKey?: boolean
    isActive?: boolean
    createdByUserId?: boolean
    createdAt?: boolean
    activatedAt?: boolean
  }

  export type ClubBookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookId" | "title" | "author" | "colorKey" | "isActive" | "createdByUserId" | "createdAt" | "activatedAt", ExtArgs["result"]["clubBook"]>
  export type ClubBookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ClubBook$messagesArgs<ExtArgs>
    artifacts?: boolean | ClubBook$artifactsArgs<ExtArgs>
    _count?: boolean | ClubBookCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClubBookIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ClubBookIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClubBookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClubBook"
    objects: {
      messages: Prisma.$ClubBookMessagePayload<ExtArgs>[]
      artifacts: Prisma.$ClubBookArtifactPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookId: string
      title: string
      author: string
      colorKey: string
      isActive: boolean
      createdByUserId: string
      createdAt: Date
      activatedAt: Date | null
    }, ExtArgs["result"]["clubBook"]>
    composites: {}
  }

  type ClubBookGetPayload<S extends boolean | null | undefined | ClubBookDefaultArgs> = $Result.GetResult<Prisma.$ClubBookPayload, S>

  type ClubBookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClubBookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClubBookCountAggregateInputType | true
    }

  export interface ClubBookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClubBook'], meta: { name: 'ClubBook' } }
    /**
     * Find zero or one ClubBook that matches the filter.
     * @param {ClubBookFindUniqueArgs} args - Arguments to find a ClubBook
     * @example
     * // Get one ClubBook
     * const clubBook = await prisma.clubBook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClubBookFindUniqueArgs>(args: SelectSubset<T, ClubBookFindUniqueArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClubBook that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClubBookFindUniqueOrThrowArgs} args - Arguments to find a ClubBook
     * @example
     * // Get one ClubBook
     * const clubBook = await prisma.clubBook.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClubBookFindUniqueOrThrowArgs>(args: SelectSubset<T, ClubBookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookFindFirstArgs} args - Arguments to find a ClubBook
     * @example
     * // Get one ClubBook
     * const clubBook = await prisma.clubBook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClubBookFindFirstArgs>(args?: SelectSubset<T, ClubBookFindFirstArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBook that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookFindFirstOrThrowArgs} args - Arguments to find a ClubBook
     * @example
     * // Get one ClubBook
     * const clubBook = await prisma.clubBook.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClubBookFindFirstOrThrowArgs>(args?: SelectSubset<T, ClubBookFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClubBooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClubBooks
     * const clubBooks = await prisma.clubBook.findMany()
     * 
     * // Get first 10 ClubBooks
     * const clubBooks = await prisma.clubBook.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clubBookWithIdOnly = await prisma.clubBook.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClubBookFindManyArgs>(args?: SelectSubset<T, ClubBookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClubBook.
     * @param {ClubBookCreateArgs} args - Arguments to create a ClubBook.
     * @example
     * // Create one ClubBook
     * const ClubBook = await prisma.clubBook.create({
     *   data: {
     *     // ... data to create a ClubBook
     *   }
     * })
     * 
     */
    create<T extends ClubBookCreateArgs>(args: SelectSubset<T, ClubBookCreateArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClubBooks.
     * @param {ClubBookCreateManyArgs} args - Arguments to create many ClubBooks.
     * @example
     * // Create many ClubBooks
     * const clubBook = await prisma.clubBook.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClubBookCreateManyArgs>(args?: SelectSubset<T, ClubBookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClubBooks and returns the data saved in the database.
     * @param {ClubBookCreateManyAndReturnArgs} args - Arguments to create many ClubBooks.
     * @example
     * // Create many ClubBooks
     * const clubBook = await prisma.clubBook.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClubBooks and only return the `id`
     * const clubBookWithIdOnly = await prisma.clubBook.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClubBookCreateManyAndReturnArgs>(args?: SelectSubset<T, ClubBookCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClubBook.
     * @param {ClubBookDeleteArgs} args - Arguments to delete one ClubBook.
     * @example
     * // Delete one ClubBook
     * const ClubBook = await prisma.clubBook.delete({
     *   where: {
     *     // ... filter to delete one ClubBook
     *   }
     * })
     * 
     */
    delete<T extends ClubBookDeleteArgs>(args: SelectSubset<T, ClubBookDeleteArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClubBook.
     * @param {ClubBookUpdateArgs} args - Arguments to update one ClubBook.
     * @example
     * // Update one ClubBook
     * const clubBook = await prisma.clubBook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClubBookUpdateArgs>(args: SelectSubset<T, ClubBookUpdateArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClubBooks.
     * @param {ClubBookDeleteManyArgs} args - Arguments to filter ClubBooks to delete.
     * @example
     * // Delete a few ClubBooks
     * const { count } = await prisma.clubBook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClubBookDeleteManyArgs>(args?: SelectSubset<T, ClubBookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClubBooks
     * const clubBook = await prisma.clubBook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClubBookUpdateManyArgs>(args: SelectSubset<T, ClubBookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBooks and returns the data updated in the database.
     * @param {ClubBookUpdateManyAndReturnArgs} args - Arguments to update many ClubBooks.
     * @example
     * // Update many ClubBooks
     * const clubBook = await prisma.clubBook.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClubBooks and only return the `id`
     * const clubBookWithIdOnly = await prisma.clubBook.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClubBookUpdateManyAndReturnArgs>(args: SelectSubset<T, ClubBookUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClubBook.
     * @param {ClubBookUpsertArgs} args - Arguments to update or create a ClubBook.
     * @example
     * // Update or create a ClubBook
     * const clubBook = await prisma.clubBook.upsert({
     *   create: {
     *     // ... data to create a ClubBook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClubBook we want to update
     *   }
     * })
     */
    upsert<T extends ClubBookUpsertArgs>(args: SelectSubset<T, ClubBookUpsertArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClubBooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookCountArgs} args - Arguments to filter ClubBooks to count.
     * @example
     * // Count the number of ClubBooks
     * const count = await prisma.clubBook.count({
     *   where: {
     *     // ... the filter for the ClubBooks we want to count
     *   }
     * })
    **/
    count<T extends ClubBookCountArgs>(
      args?: Subset<T, ClubBookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubBookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClubBook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClubBookAggregateArgs>(args: Subset<T, ClubBookAggregateArgs>): Prisma.PrismaPromise<GetClubBookAggregateType<T>>

    /**
     * Group by ClubBook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClubBookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClubBookGroupByArgs['orderBy'] }
        : { orderBy?: ClubBookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClubBookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubBookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClubBook model
   */
  readonly fields: ClubBookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClubBook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClubBookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends ClubBook$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ClubBook$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    artifacts<T extends ClubBook$artifactsArgs<ExtArgs> = {}>(args?: Subset<T, ClubBook$artifactsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClubBook model
   */
  interface ClubBookFieldRefs {
    readonly id: FieldRef<"ClubBook", 'String'>
    readonly bookId: FieldRef<"ClubBook", 'String'>
    readonly title: FieldRef<"ClubBook", 'String'>
    readonly author: FieldRef<"ClubBook", 'String'>
    readonly colorKey: FieldRef<"ClubBook", 'String'>
    readonly isActive: FieldRef<"ClubBook", 'Boolean'>
    readonly createdByUserId: FieldRef<"ClubBook", 'String'>
    readonly createdAt: FieldRef<"ClubBook", 'DateTime'>
    readonly activatedAt: FieldRef<"ClubBook", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClubBook findUnique
   */
  export type ClubBookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter, which ClubBook to fetch.
     */
    where: ClubBookWhereUniqueInput
  }

  /**
   * ClubBook findUniqueOrThrow
   */
  export type ClubBookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter, which ClubBook to fetch.
     */
    where: ClubBookWhereUniqueInput
  }

  /**
   * ClubBook findFirst
   */
  export type ClubBookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter, which ClubBook to fetch.
     */
    where?: ClubBookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBooks to fetch.
     */
    orderBy?: ClubBookOrderByWithRelationInput | ClubBookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBooks.
     */
    cursor?: ClubBookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBooks.
     */
    distinct?: ClubBookScalarFieldEnum | ClubBookScalarFieldEnum[]
  }

  /**
   * ClubBook findFirstOrThrow
   */
  export type ClubBookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter, which ClubBook to fetch.
     */
    where?: ClubBookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBooks to fetch.
     */
    orderBy?: ClubBookOrderByWithRelationInput | ClubBookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBooks.
     */
    cursor?: ClubBookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBooks.
     */
    distinct?: ClubBookScalarFieldEnum | ClubBookScalarFieldEnum[]
  }

  /**
   * ClubBook findMany
   */
  export type ClubBookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter, which ClubBooks to fetch.
     */
    where?: ClubBookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBooks to fetch.
     */
    orderBy?: ClubBookOrderByWithRelationInput | ClubBookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClubBooks.
     */
    cursor?: ClubBookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBooks.
     */
    skip?: number
    distinct?: ClubBookScalarFieldEnum | ClubBookScalarFieldEnum[]
  }

  /**
   * ClubBook create
   */
  export type ClubBookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * The data needed to create a ClubBook.
     */
    data: XOR<ClubBookCreateInput, ClubBookUncheckedCreateInput>
  }

  /**
   * ClubBook createMany
   */
  export type ClubBookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClubBooks.
     */
    data: ClubBookCreateManyInput | ClubBookCreateManyInput[]
  }

  /**
   * ClubBook createManyAndReturn
   */
  export type ClubBookCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * The data used to create many ClubBooks.
     */
    data: ClubBookCreateManyInput | ClubBookCreateManyInput[]
  }

  /**
   * ClubBook update
   */
  export type ClubBookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * The data needed to update a ClubBook.
     */
    data: XOR<ClubBookUpdateInput, ClubBookUncheckedUpdateInput>
    /**
     * Choose, which ClubBook to update.
     */
    where: ClubBookWhereUniqueInput
  }

  /**
   * ClubBook updateMany
   */
  export type ClubBookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClubBooks.
     */
    data: XOR<ClubBookUpdateManyMutationInput, ClubBookUncheckedUpdateManyInput>
    /**
     * Filter which ClubBooks to update
     */
    where?: ClubBookWhereInput
    /**
     * Limit how many ClubBooks to update.
     */
    limit?: number
  }

  /**
   * ClubBook updateManyAndReturn
   */
  export type ClubBookUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * The data used to update ClubBooks.
     */
    data: XOR<ClubBookUpdateManyMutationInput, ClubBookUncheckedUpdateManyInput>
    /**
     * Filter which ClubBooks to update
     */
    where?: ClubBookWhereInput
    /**
     * Limit how many ClubBooks to update.
     */
    limit?: number
  }

  /**
   * ClubBook upsert
   */
  export type ClubBookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * The filter to search for the ClubBook to update in case it exists.
     */
    where: ClubBookWhereUniqueInput
    /**
     * In case the ClubBook found by the `where` argument doesn't exist, create a new ClubBook with this data.
     */
    create: XOR<ClubBookCreateInput, ClubBookUncheckedCreateInput>
    /**
     * In case the ClubBook was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClubBookUpdateInput, ClubBookUncheckedUpdateInput>
  }

  /**
   * ClubBook delete
   */
  export type ClubBookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
    /**
     * Filter which ClubBook to delete.
     */
    where: ClubBookWhereUniqueInput
  }

  /**
   * ClubBook deleteMany
   */
  export type ClubBookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBooks to delete
     */
    where?: ClubBookWhereInput
    /**
     * Limit how many ClubBooks to delete.
     */
    limit?: number
  }

  /**
   * ClubBook.messages
   */
  export type ClubBook$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    where?: ClubBookMessageWhereInput
    orderBy?: ClubBookMessageOrderByWithRelationInput | ClubBookMessageOrderByWithRelationInput[]
    cursor?: ClubBookMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClubBookMessageScalarFieldEnum | ClubBookMessageScalarFieldEnum[]
  }

  /**
   * ClubBook.artifacts
   */
  export type ClubBook$artifactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    where?: ClubBookArtifactWhereInput
    orderBy?: ClubBookArtifactOrderByWithRelationInput | ClubBookArtifactOrderByWithRelationInput[]
    cursor?: ClubBookArtifactWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClubBookArtifactScalarFieldEnum | ClubBookArtifactScalarFieldEnum[]
  }

  /**
   * ClubBook without action
   */
  export type ClubBookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBook
     */
    select?: ClubBookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBook
     */
    omit?: ClubBookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookInclude<ExtArgs> | null
  }


  /**
   * Model ClubBookMessage
   */

  export type AggregateClubBookMessage = {
    _count: ClubBookMessageCountAggregateOutputType | null
    _min: ClubBookMessageMinAggregateOutputType | null
    _max: ClubBookMessageMaxAggregateOutputType | null
  }

  export type ClubBookMessageMinAggregateOutputType = {
    id: string | null
    clubBookId: string | null
    userId: string | null
    text: string | null
    createdAt: Date | null
  }

  export type ClubBookMessageMaxAggregateOutputType = {
    id: string | null
    clubBookId: string | null
    userId: string | null
    text: string | null
    createdAt: Date | null
  }

  export type ClubBookMessageCountAggregateOutputType = {
    id: number
    clubBookId: number
    userId: number
    text: number
    createdAt: number
    _all: number
  }


  export type ClubBookMessageMinAggregateInputType = {
    id?: true
    clubBookId?: true
    userId?: true
    text?: true
    createdAt?: true
  }

  export type ClubBookMessageMaxAggregateInputType = {
    id?: true
    clubBookId?: true
    userId?: true
    text?: true
    createdAt?: true
  }

  export type ClubBookMessageCountAggregateInputType = {
    id?: true
    clubBookId?: true
    userId?: true
    text?: true
    createdAt?: true
    _all?: true
  }

  export type ClubBookMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBookMessage to aggregate.
     */
    where?: ClubBookMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookMessages to fetch.
     */
    orderBy?: ClubBookMessageOrderByWithRelationInput | ClubBookMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClubBookMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClubBookMessages
    **/
    _count?: true | ClubBookMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClubBookMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClubBookMessageMaxAggregateInputType
  }

  export type GetClubBookMessageAggregateType<T extends ClubBookMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateClubBookMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubBookMessage[P]>
      : GetScalarType<T[P], AggregateClubBookMessage[P]>
  }




  export type ClubBookMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClubBookMessageWhereInput
    orderBy?: ClubBookMessageOrderByWithAggregationInput | ClubBookMessageOrderByWithAggregationInput[]
    by: ClubBookMessageScalarFieldEnum[] | ClubBookMessageScalarFieldEnum
    having?: ClubBookMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClubBookMessageCountAggregateInputType | true
    _min?: ClubBookMessageMinAggregateInputType
    _max?: ClubBookMessageMaxAggregateInputType
  }

  export type ClubBookMessageGroupByOutputType = {
    id: string
    clubBookId: string
    userId: string
    text: string
    createdAt: Date
    _count: ClubBookMessageCountAggregateOutputType | null
    _min: ClubBookMessageMinAggregateOutputType | null
    _max: ClubBookMessageMaxAggregateOutputType | null
  }

  type GetClubBookMessageGroupByPayload<T extends ClubBookMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubBookMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClubBookMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubBookMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ClubBookMessageGroupByOutputType[P]>
        }
      >
    >


  export type ClubBookMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    userId?: boolean
    text?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookMessage"]>

  export type ClubBookMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    userId?: boolean
    text?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookMessage"]>

  export type ClubBookMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    userId?: boolean
    text?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookMessage"]>

  export type ClubBookMessageSelectScalar = {
    id?: boolean
    clubBookId?: boolean
    userId?: boolean
    text?: boolean
    createdAt?: boolean
  }

  export type ClubBookMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clubBookId" | "userId" | "text" | "createdAt", ExtArgs["result"]["clubBookMessage"]>
  export type ClubBookMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }
  export type ClubBookMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }
  export type ClubBookMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }

  export type $ClubBookMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClubBookMessage"
    objects: {
      clubBook: Prisma.$ClubBookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clubBookId: string
      userId: string
      text: string
      createdAt: Date
    }, ExtArgs["result"]["clubBookMessage"]>
    composites: {}
  }

  type ClubBookMessageGetPayload<S extends boolean | null | undefined | ClubBookMessageDefaultArgs> = $Result.GetResult<Prisma.$ClubBookMessagePayload, S>

  type ClubBookMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClubBookMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClubBookMessageCountAggregateInputType | true
    }

  export interface ClubBookMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClubBookMessage'], meta: { name: 'ClubBookMessage' } }
    /**
     * Find zero or one ClubBookMessage that matches the filter.
     * @param {ClubBookMessageFindUniqueArgs} args - Arguments to find a ClubBookMessage
     * @example
     * // Get one ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClubBookMessageFindUniqueArgs>(args: SelectSubset<T, ClubBookMessageFindUniqueArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClubBookMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClubBookMessageFindUniqueOrThrowArgs} args - Arguments to find a ClubBookMessage
     * @example
     * // Get one ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClubBookMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ClubBookMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBookMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageFindFirstArgs} args - Arguments to find a ClubBookMessage
     * @example
     * // Get one ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClubBookMessageFindFirstArgs>(args?: SelectSubset<T, ClubBookMessageFindFirstArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBookMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageFindFirstOrThrowArgs} args - Arguments to find a ClubBookMessage
     * @example
     * // Get one ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClubBookMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ClubBookMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClubBookMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClubBookMessages
     * const clubBookMessages = await prisma.clubBookMessage.findMany()
     * 
     * // Get first 10 ClubBookMessages
     * const clubBookMessages = await prisma.clubBookMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clubBookMessageWithIdOnly = await prisma.clubBookMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClubBookMessageFindManyArgs>(args?: SelectSubset<T, ClubBookMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClubBookMessage.
     * @param {ClubBookMessageCreateArgs} args - Arguments to create a ClubBookMessage.
     * @example
     * // Create one ClubBookMessage
     * const ClubBookMessage = await prisma.clubBookMessage.create({
     *   data: {
     *     // ... data to create a ClubBookMessage
     *   }
     * })
     * 
     */
    create<T extends ClubBookMessageCreateArgs>(args: SelectSubset<T, ClubBookMessageCreateArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClubBookMessages.
     * @param {ClubBookMessageCreateManyArgs} args - Arguments to create many ClubBookMessages.
     * @example
     * // Create many ClubBookMessages
     * const clubBookMessage = await prisma.clubBookMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClubBookMessageCreateManyArgs>(args?: SelectSubset<T, ClubBookMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClubBookMessages and returns the data saved in the database.
     * @param {ClubBookMessageCreateManyAndReturnArgs} args - Arguments to create many ClubBookMessages.
     * @example
     * // Create many ClubBookMessages
     * const clubBookMessage = await prisma.clubBookMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClubBookMessages and only return the `id`
     * const clubBookMessageWithIdOnly = await prisma.clubBookMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClubBookMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ClubBookMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClubBookMessage.
     * @param {ClubBookMessageDeleteArgs} args - Arguments to delete one ClubBookMessage.
     * @example
     * // Delete one ClubBookMessage
     * const ClubBookMessage = await prisma.clubBookMessage.delete({
     *   where: {
     *     // ... filter to delete one ClubBookMessage
     *   }
     * })
     * 
     */
    delete<T extends ClubBookMessageDeleteArgs>(args: SelectSubset<T, ClubBookMessageDeleteArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClubBookMessage.
     * @param {ClubBookMessageUpdateArgs} args - Arguments to update one ClubBookMessage.
     * @example
     * // Update one ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClubBookMessageUpdateArgs>(args: SelectSubset<T, ClubBookMessageUpdateArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClubBookMessages.
     * @param {ClubBookMessageDeleteManyArgs} args - Arguments to filter ClubBookMessages to delete.
     * @example
     * // Delete a few ClubBookMessages
     * const { count } = await prisma.clubBookMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClubBookMessageDeleteManyArgs>(args?: SelectSubset<T, ClubBookMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBookMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClubBookMessages
     * const clubBookMessage = await prisma.clubBookMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClubBookMessageUpdateManyArgs>(args: SelectSubset<T, ClubBookMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBookMessages and returns the data updated in the database.
     * @param {ClubBookMessageUpdateManyAndReturnArgs} args - Arguments to update many ClubBookMessages.
     * @example
     * // Update many ClubBookMessages
     * const clubBookMessage = await prisma.clubBookMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClubBookMessages and only return the `id`
     * const clubBookMessageWithIdOnly = await prisma.clubBookMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClubBookMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ClubBookMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClubBookMessage.
     * @param {ClubBookMessageUpsertArgs} args - Arguments to update or create a ClubBookMessage.
     * @example
     * // Update or create a ClubBookMessage
     * const clubBookMessage = await prisma.clubBookMessage.upsert({
     *   create: {
     *     // ... data to create a ClubBookMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClubBookMessage we want to update
     *   }
     * })
     */
    upsert<T extends ClubBookMessageUpsertArgs>(args: SelectSubset<T, ClubBookMessageUpsertArgs<ExtArgs>>): Prisma__ClubBookMessageClient<$Result.GetResult<Prisma.$ClubBookMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClubBookMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageCountArgs} args - Arguments to filter ClubBookMessages to count.
     * @example
     * // Count the number of ClubBookMessages
     * const count = await prisma.clubBookMessage.count({
     *   where: {
     *     // ... the filter for the ClubBookMessages we want to count
     *   }
     * })
    **/
    count<T extends ClubBookMessageCountArgs>(
      args?: Subset<T, ClubBookMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubBookMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClubBookMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClubBookMessageAggregateArgs>(args: Subset<T, ClubBookMessageAggregateArgs>): Prisma.PrismaPromise<GetClubBookMessageAggregateType<T>>

    /**
     * Group by ClubBookMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClubBookMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClubBookMessageGroupByArgs['orderBy'] }
        : { orderBy?: ClubBookMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClubBookMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubBookMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClubBookMessage model
   */
  readonly fields: ClubBookMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClubBookMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClubBookMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clubBook<T extends ClubBookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClubBookDefaultArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClubBookMessage model
   */
  interface ClubBookMessageFieldRefs {
    readonly id: FieldRef<"ClubBookMessage", 'String'>
    readonly clubBookId: FieldRef<"ClubBookMessage", 'String'>
    readonly userId: FieldRef<"ClubBookMessage", 'String'>
    readonly text: FieldRef<"ClubBookMessage", 'String'>
    readonly createdAt: FieldRef<"ClubBookMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClubBookMessage findUnique
   */
  export type ClubBookMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookMessage to fetch.
     */
    where: ClubBookMessageWhereUniqueInput
  }

  /**
   * ClubBookMessage findUniqueOrThrow
   */
  export type ClubBookMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookMessage to fetch.
     */
    where: ClubBookMessageWhereUniqueInput
  }

  /**
   * ClubBookMessage findFirst
   */
  export type ClubBookMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookMessage to fetch.
     */
    where?: ClubBookMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookMessages to fetch.
     */
    orderBy?: ClubBookMessageOrderByWithRelationInput | ClubBookMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBookMessages.
     */
    cursor?: ClubBookMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBookMessages.
     */
    distinct?: ClubBookMessageScalarFieldEnum | ClubBookMessageScalarFieldEnum[]
  }

  /**
   * ClubBookMessage findFirstOrThrow
   */
  export type ClubBookMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookMessage to fetch.
     */
    where?: ClubBookMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookMessages to fetch.
     */
    orderBy?: ClubBookMessageOrderByWithRelationInput | ClubBookMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBookMessages.
     */
    cursor?: ClubBookMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBookMessages.
     */
    distinct?: ClubBookMessageScalarFieldEnum | ClubBookMessageScalarFieldEnum[]
  }

  /**
   * ClubBookMessage findMany
   */
  export type ClubBookMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookMessages to fetch.
     */
    where?: ClubBookMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookMessages to fetch.
     */
    orderBy?: ClubBookMessageOrderByWithRelationInput | ClubBookMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClubBookMessages.
     */
    cursor?: ClubBookMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookMessages.
     */
    skip?: number
    distinct?: ClubBookMessageScalarFieldEnum | ClubBookMessageScalarFieldEnum[]
  }

  /**
   * ClubBookMessage create
   */
  export type ClubBookMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ClubBookMessage.
     */
    data: XOR<ClubBookMessageCreateInput, ClubBookMessageUncheckedCreateInput>
  }

  /**
   * ClubBookMessage createMany
   */
  export type ClubBookMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClubBookMessages.
     */
    data: ClubBookMessageCreateManyInput | ClubBookMessageCreateManyInput[]
  }

  /**
   * ClubBookMessage createManyAndReturn
   */
  export type ClubBookMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ClubBookMessages.
     */
    data: ClubBookMessageCreateManyInput | ClubBookMessageCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClubBookMessage update
   */
  export type ClubBookMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ClubBookMessage.
     */
    data: XOR<ClubBookMessageUpdateInput, ClubBookMessageUncheckedUpdateInput>
    /**
     * Choose, which ClubBookMessage to update.
     */
    where: ClubBookMessageWhereUniqueInput
  }

  /**
   * ClubBookMessage updateMany
   */
  export type ClubBookMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClubBookMessages.
     */
    data: XOR<ClubBookMessageUpdateManyMutationInput, ClubBookMessageUncheckedUpdateManyInput>
    /**
     * Filter which ClubBookMessages to update
     */
    where?: ClubBookMessageWhereInput
    /**
     * Limit how many ClubBookMessages to update.
     */
    limit?: number
  }

  /**
   * ClubBookMessage updateManyAndReturn
   */
  export type ClubBookMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * The data used to update ClubBookMessages.
     */
    data: XOR<ClubBookMessageUpdateManyMutationInput, ClubBookMessageUncheckedUpdateManyInput>
    /**
     * Filter which ClubBookMessages to update
     */
    where?: ClubBookMessageWhereInput
    /**
     * Limit how many ClubBookMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClubBookMessage upsert
   */
  export type ClubBookMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ClubBookMessage to update in case it exists.
     */
    where: ClubBookMessageWhereUniqueInput
    /**
     * In case the ClubBookMessage found by the `where` argument doesn't exist, create a new ClubBookMessage with this data.
     */
    create: XOR<ClubBookMessageCreateInput, ClubBookMessageUncheckedCreateInput>
    /**
     * In case the ClubBookMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClubBookMessageUpdateInput, ClubBookMessageUncheckedUpdateInput>
  }

  /**
   * ClubBookMessage delete
   */
  export type ClubBookMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
    /**
     * Filter which ClubBookMessage to delete.
     */
    where: ClubBookMessageWhereUniqueInput
  }

  /**
   * ClubBookMessage deleteMany
   */
  export type ClubBookMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBookMessages to delete
     */
    where?: ClubBookMessageWhereInput
    /**
     * Limit how many ClubBookMessages to delete.
     */
    limit?: number
  }

  /**
   * ClubBookMessage without action
   */
  export type ClubBookMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookMessage
     */
    select?: ClubBookMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookMessage
     */
    omit?: ClubBookMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookMessageInclude<ExtArgs> | null
  }


  /**
   * Model ClubBookArtifact
   */

  export type AggregateClubBookArtifact = {
    _count: ClubBookArtifactCountAggregateOutputType | null
    _avg: ClubBookArtifactAvgAggregateOutputType | null
    _sum: ClubBookArtifactSumAggregateOutputType | null
    _min: ClubBookArtifactMinAggregateOutputType | null
    _max: ClubBookArtifactMaxAggregateOutputType | null
  }

  export type ClubBookArtifactAvgAggregateOutputType = {
    size: number | null
  }

  export type ClubBookArtifactSumAggregateOutputType = {
    size: number | null
  }

  export type ClubBookArtifactMinAggregateOutputType = {
    id: string | null
    clubBookId: string | null
    uploadedByUserId: string | null
    fileName: string | null
    mimeType: string | null
    size: number | null
    url: string | null
    createdAt: Date | null
  }

  export type ClubBookArtifactMaxAggregateOutputType = {
    id: string | null
    clubBookId: string | null
    uploadedByUserId: string | null
    fileName: string | null
    mimeType: string | null
    size: number | null
    url: string | null
    createdAt: Date | null
  }

  export type ClubBookArtifactCountAggregateOutputType = {
    id: number
    clubBookId: number
    uploadedByUserId: number
    fileName: number
    mimeType: number
    size: number
    url: number
    createdAt: number
    _all: number
  }


  export type ClubBookArtifactAvgAggregateInputType = {
    size?: true
  }

  export type ClubBookArtifactSumAggregateInputType = {
    size?: true
  }

  export type ClubBookArtifactMinAggregateInputType = {
    id?: true
    clubBookId?: true
    uploadedByUserId?: true
    fileName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
  }

  export type ClubBookArtifactMaxAggregateInputType = {
    id?: true
    clubBookId?: true
    uploadedByUserId?: true
    fileName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
  }

  export type ClubBookArtifactCountAggregateInputType = {
    id?: true
    clubBookId?: true
    uploadedByUserId?: true
    fileName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
    _all?: true
  }

  export type ClubBookArtifactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBookArtifact to aggregate.
     */
    where?: ClubBookArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookArtifacts to fetch.
     */
    orderBy?: ClubBookArtifactOrderByWithRelationInput | ClubBookArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClubBookArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClubBookArtifacts
    **/
    _count?: true | ClubBookArtifactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClubBookArtifactAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClubBookArtifactSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClubBookArtifactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClubBookArtifactMaxAggregateInputType
  }

  export type GetClubBookArtifactAggregateType<T extends ClubBookArtifactAggregateArgs> = {
        [P in keyof T & keyof AggregateClubBookArtifact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubBookArtifact[P]>
      : GetScalarType<T[P], AggregateClubBookArtifact[P]>
  }




  export type ClubBookArtifactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClubBookArtifactWhereInput
    orderBy?: ClubBookArtifactOrderByWithAggregationInput | ClubBookArtifactOrderByWithAggregationInput[]
    by: ClubBookArtifactScalarFieldEnum[] | ClubBookArtifactScalarFieldEnum
    having?: ClubBookArtifactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClubBookArtifactCountAggregateInputType | true
    _avg?: ClubBookArtifactAvgAggregateInputType
    _sum?: ClubBookArtifactSumAggregateInputType
    _min?: ClubBookArtifactMinAggregateInputType
    _max?: ClubBookArtifactMaxAggregateInputType
  }

  export type ClubBookArtifactGroupByOutputType = {
    id: string
    clubBookId: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt: Date
    _count: ClubBookArtifactCountAggregateOutputType | null
    _avg: ClubBookArtifactAvgAggregateOutputType | null
    _sum: ClubBookArtifactSumAggregateOutputType | null
    _min: ClubBookArtifactMinAggregateOutputType | null
    _max: ClubBookArtifactMaxAggregateOutputType | null
  }

  type GetClubBookArtifactGroupByPayload<T extends ClubBookArtifactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubBookArtifactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClubBookArtifactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubBookArtifactGroupByOutputType[P]>
            : GetScalarType<T[P], ClubBookArtifactGroupByOutputType[P]>
        }
      >
    >


  export type ClubBookArtifactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    uploadedByUserId?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookArtifact"]>

  export type ClubBookArtifactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    uploadedByUserId?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookArtifact"]>

  export type ClubBookArtifactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clubBookId?: boolean
    uploadedByUserId?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubBookArtifact"]>

  export type ClubBookArtifactSelectScalar = {
    id?: boolean
    clubBookId?: boolean
    uploadedByUserId?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
  }

  export type ClubBookArtifactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clubBookId" | "uploadedByUserId" | "fileName" | "mimeType" | "size" | "url" | "createdAt", ExtArgs["result"]["clubBookArtifact"]>
  export type ClubBookArtifactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }
  export type ClubBookArtifactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }
  export type ClubBookArtifactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clubBook?: boolean | ClubBookDefaultArgs<ExtArgs>
  }

  export type $ClubBookArtifactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClubBookArtifact"
    objects: {
      clubBook: Prisma.$ClubBookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clubBookId: string
      uploadedByUserId: string
      fileName: string
      mimeType: string
      size: number
      url: string
      createdAt: Date
    }, ExtArgs["result"]["clubBookArtifact"]>
    composites: {}
  }

  type ClubBookArtifactGetPayload<S extends boolean | null | undefined | ClubBookArtifactDefaultArgs> = $Result.GetResult<Prisma.$ClubBookArtifactPayload, S>

  type ClubBookArtifactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClubBookArtifactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClubBookArtifactCountAggregateInputType | true
    }

  export interface ClubBookArtifactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClubBookArtifact'], meta: { name: 'ClubBookArtifact' } }
    /**
     * Find zero or one ClubBookArtifact that matches the filter.
     * @param {ClubBookArtifactFindUniqueArgs} args - Arguments to find a ClubBookArtifact
     * @example
     * // Get one ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClubBookArtifactFindUniqueArgs>(args: SelectSubset<T, ClubBookArtifactFindUniqueArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClubBookArtifact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClubBookArtifactFindUniqueOrThrowArgs} args - Arguments to find a ClubBookArtifact
     * @example
     * // Get one ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClubBookArtifactFindUniqueOrThrowArgs>(args: SelectSubset<T, ClubBookArtifactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBookArtifact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactFindFirstArgs} args - Arguments to find a ClubBookArtifact
     * @example
     * // Get one ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClubBookArtifactFindFirstArgs>(args?: SelectSubset<T, ClubBookArtifactFindFirstArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubBookArtifact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactFindFirstOrThrowArgs} args - Arguments to find a ClubBookArtifact
     * @example
     * // Get one ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClubBookArtifactFindFirstOrThrowArgs>(args?: SelectSubset<T, ClubBookArtifactFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClubBookArtifacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClubBookArtifacts
     * const clubBookArtifacts = await prisma.clubBookArtifact.findMany()
     * 
     * // Get first 10 ClubBookArtifacts
     * const clubBookArtifacts = await prisma.clubBookArtifact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clubBookArtifactWithIdOnly = await prisma.clubBookArtifact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClubBookArtifactFindManyArgs>(args?: SelectSubset<T, ClubBookArtifactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClubBookArtifact.
     * @param {ClubBookArtifactCreateArgs} args - Arguments to create a ClubBookArtifact.
     * @example
     * // Create one ClubBookArtifact
     * const ClubBookArtifact = await prisma.clubBookArtifact.create({
     *   data: {
     *     // ... data to create a ClubBookArtifact
     *   }
     * })
     * 
     */
    create<T extends ClubBookArtifactCreateArgs>(args: SelectSubset<T, ClubBookArtifactCreateArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClubBookArtifacts.
     * @param {ClubBookArtifactCreateManyArgs} args - Arguments to create many ClubBookArtifacts.
     * @example
     * // Create many ClubBookArtifacts
     * const clubBookArtifact = await prisma.clubBookArtifact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClubBookArtifactCreateManyArgs>(args?: SelectSubset<T, ClubBookArtifactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClubBookArtifacts and returns the data saved in the database.
     * @param {ClubBookArtifactCreateManyAndReturnArgs} args - Arguments to create many ClubBookArtifacts.
     * @example
     * // Create many ClubBookArtifacts
     * const clubBookArtifact = await prisma.clubBookArtifact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClubBookArtifacts and only return the `id`
     * const clubBookArtifactWithIdOnly = await prisma.clubBookArtifact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClubBookArtifactCreateManyAndReturnArgs>(args?: SelectSubset<T, ClubBookArtifactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClubBookArtifact.
     * @param {ClubBookArtifactDeleteArgs} args - Arguments to delete one ClubBookArtifact.
     * @example
     * // Delete one ClubBookArtifact
     * const ClubBookArtifact = await prisma.clubBookArtifact.delete({
     *   where: {
     *     // ... filter to delete one ClubBookArtifact
     *   }
     * })
     * 
     */
    delete<T extends ClubBookArtifactDeleteArgs>(args: SelectSubset<T, ClubBookArtifactDeleteArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClubBookArtifact.
     * @param {ClubBookArtifactUpdateArgs} args - Arguments to update one ClubBookArtifact.
     * @example
     * // Update one ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClubBookArtifactUpdateArgs>(args: SelectSubset<T, ClubBookArtifactUpdateArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClubBookArtifacts.
     * @param {ClubBookArtifactDeleteManyArgs} args - Arguments to filter ClubBookArtifacts to delete.
     * @example
     * // Delete a few ClubBookArtifacts
     * const { count } = await prisma.clubBookArtifact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClubBookArtifactDeleteManyArgs>(args?: SelectSubset<T, ClubBookArtifactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBookArtifacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClubBookArtifacts
     * const clubBookArtifact = await prisma.clubBookArtifact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClubBookArtifactUpdateManyArgs>(args: SelectSubset<T, ClubBookArtifactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubBookArtifacts and returns the data updated in the database.
     * @param {ClubBookArtifactUpdateManyAndReturnArgs} args - Arguments to update many ClubBookArtifacts.
     * @example
     * // Update many ClubBookArtifacts
     * const clubBookArtifact = await prisma.clubBookArtifact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClubBookArtifacts and only return the `id`
     * const clubBookArtifactWithIdOnly = await prisma.clubBookArtifact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClubBookArtifactUpdateManyAndReturnArgs>(args: SelectSubset<T, ClubBookArtifactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClubBookArtifact.
     * @param {ClubBookArtifactUpsertArgs} args - Arguments to update or create a ClubBookArtifact.
     * @example
     * // Update or create a ClubBookArtifact
     * const clubBookArtifact = await prisma.clubBookArtifact.upsert({
     *   create: {
     *     // ... data to create a ClubBookArtifact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClubBookArtifact we want to update
     *   }
     * })
     */
    upsert<T extends ClubBookArtifactUpsertArgs>(args: SelectSubset<T, ClubBookArtifactUpsertArgs<ExtArgs>>): Prisma__ClubBookArtifactClient<$Result.GetResult<Prisma.$ClubBookArtifactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClubBookArtifacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactCountArgs} args - Arguments to filter ClubBookArtifacts to count.
     * @example
     * // Count the number of ClubBookArtifacts
     * const count = await prisma.clubBookArtifact.count({
     *   where: {
     *     // ... the filter for the ClubBookArtifacts we want to count
     *   }
     * })
    **/
    count<T extends ClubBookArtifactCountArgs>(
      args?: Subset<T, ClubBookArtifactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubBookArtifactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClubBookArtifact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClubBookArtifactAggregateArgs>(args: Subset<T, ClubBookArtifactAggregateArgs>): Prisma.PrismaPromise<GetClubBookArtifactAggregateType<T>>

    /**
     * Group by ClubBookArtifact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubBookArtifactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClubBookArtifactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClubBookArtifactGroupByArgs['orderBy'] }
        : { orderBy?: ClubBookArtifactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClubBookArtifactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubBookArtifactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClubBookArtifact model
   */
  readonly fields: ClubBookArtifactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClubBookArtifact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClubBookArtifactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clubBook<T extends ClubBookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClubBookDefaultArgs<ExtArgs>>): Prisma__ClubBookClient<$Result.GetResult<Prisma.$ClubBookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClubBookArtifact model
   */
  interface ClubBookArtifactFieldRefs {
    readonly id: FieldRef<"ClubBookArtifact", 'String'>
    readonly clubBookId: FieldRef<"ClubBookArtifact", 'String'>
    readonly uploadedByUserId: FieldRef<"ClubBookArtifact", 'String'>
    readonly fileName: FieldRef<"ClubBookArtifact", 'String'>
    readonly mimeType: FieldRef<"ClubBookArtifact", 'String'>
    readonly size: FieldRef<"ClubBookArtifact", 'Int'>
    readonly url: FieldRef<"ClubBookArtifact", 'String'>
    readonly createdAt: FieldRef<"ClubBookArtifact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClubBookArtifact findUnique
   */
  export type ClubBookArtifactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookArtifact to fetch.
     */
    where: ClubBookArtifactWhereUniqueInput
  }

  /**
   * ClubBookArtifact findUniqueOrThrow
   */
  export type ClubBookArtifactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookArtifact to fetch.
     */
    where: ClubBookArtifactWhereUniqueInput
  }

  /**
   * ClubBookArtifact findFirst
   */
  export type ClubBookArtifactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookArtifact to fetch.
     */
    where?: ClubBookArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookArtifacts to fetch.
     */
    orderBy?: ClubBookArtifactOrderByWithRelationInput | ClubBookArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBookArtifacts.
     */
    cursor?: ClubBookArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBookArtifacts.
     */
    distinct?: ClubBookArtifactScalarFieldEnum | ClubBookArtifactScalarFieldEnum[]
  }

  /**
   * ClubBookArtifact findFirstOrThrow
   */
  export type ClubBookArtifactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookArtifact to fetch.
     */
    where?: ClubBookArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookArtifacts to fetch.
     */
    orderBy?: ClubBookArtifactOrderByWithRelationInput | ClubBookArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClubBookArtifacts.
     */
    cursor?: ClubBookArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClubBookArtifacts.
     */
    distinct?: ClubBookArtifactScalarFieldEnum | ClubBookArtifactScalarFieldEnum[]
  }

  /**
   * ClubBookArtifact findMany
   */
  export type ClubBookArtifactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter, which ClubBookArtifacts to fetch.
     */
    where?: ClubBookArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClubBookArtifacts to fetch.
     */
    orderBy?: ClubBookArtifactOrderByWithRelationInput | ClubBookArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClubBookArtifacts.
     */
    cursor?: ClubBookArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClubBookArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClubBookArtifacts.
     */
    skip?: number
    distinct?: ClubBookArtifactScalarFieldEnum | ClubBookArtifactScalarFieldEnum[]
  }

  /**
   * ClubBookArtifact create
   */
  export type ClubBookArtifactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * The data needed to create a ClubBookArtifact.
     */
    data: XOR<ClubBookArtifactCreateInput, ClubBookArtifactUncheckedCreateInput>
  }

  /**
   * ClubBookArtifact createMany
   */
  export type ClubBookArtifactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClubBookArtifacts.
     */
    data: ClubBookArtifactCreateManyInput | ClubBookArtifactCreateManyInput[]
  }

  /**
   * ClubBookArtifact createManyAndReturn
   */
  export type ClubBookArtifactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * The data used to create many ClubBookArtifacts.
     */
    data: ClubBookArtifactCreateManyInput | ClubBookArtifactCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClubBookArtifact update
   */
  export type ClubBookArtifactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * The data needed to update a ClubBookArtifact.
     */
    data: XOR<ClubBookArtifactUpdateInput, ClubBookArtifactUncheckedUpdateInput>
    /**
     * Choose, which ClubBookArtifact to update.
     */
    where: ClubBookArtifactWhereUniqueInput
  }

  /**
   * ClubBookArtifact updateMany
   */
  export type ClubBookArtifactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClubBookArtifacts.
     */
    data: XOR<ClubBookArtifactUpdateManyMutationInput, ClubBookArtifactUncheckedUpdateManyInput>
    /**
     * Filter which ClubBookArtifacts to update
     */
    where?: ClubBookArtifactWhereInput
    /**
     * Limit how many ClubBookArtifacts to update.
     */
    limit?: number
  }

  /**
   * ClubBookArtifact updateManyAndReturn
   */
  export type ClubBookArtifactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * The data used to update ClubBookArtifacts.
     */
    data: XOR<ClubBookArtifactUpdateManyMutationInput, ClubBookArtifactUncheckedUpdateManyInput>
    /**
     * Filter which ClubBookArtifacts to update
     */
    where?: ClubBookArtifactWhereInput
    /**
     * Limit how many ClubBookArtifacts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClubBookArtifact upsert
   */
  export type ClubBookArtifactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * The filter to search for the ClubBookArtifact to update in case it exists.
     */
    where: ClubBookArtifactWhereUniqueInput
    /**
     * In case the ClubBookArtifact found by the `where` argument doesn't exist, create a new ClubBookArtifact with this data.
     */
    create: XOR<ClubBookArtifactCreateInput, ClubBookArtifactUncheckedCreateInput>
    /**
     * In case the ClubBookArtifact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClubBookArtifactUpdateInput, ClubBookArtifactUncheckedUpdateInput>
  }

  /**
   * ClubBookArtifact delete
   */
  export type ClubBookArtifactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
    /**
     * Filter which ClubBookArtifact to delete.
     */
    where: ClubBookArtifactWhereUniqueInput
  }

  /**
   * ClubBookArtifact deleteMany
   */
  export type ClubBookArtifactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClubBookArtifacts to delete
     */
    where?: ClubBookArtifactWhereInput
    /**
     * Limit how many ClubBookArtifacts to delete.
     */
    limit?: number
  }

  /**
   * ClubBookArtifact without action
   */
  export type ClubBookArtifactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubBookArtifact
     */
    select?: ClubBookArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClubBookArtifact
     */
    omit?: ClubBookArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClubBookArtifactInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GroupScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    ownerId: 'ownerId',
    createdAt: 'createdAt'
  };

  export type GroupScalarFieldEnum = (typeof GroupScalarFieldEnum)[keyof typeof GroupScalarFieldEnum]


  export const MembershipScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    userId: 'userId',
    role: 'role'
  };

  export type MembershipScalarFieldEnum = (typeof MembershipScalarFieldEnum)[keyof typeof MembershipScalarFieldEnum]


  export const JoinRequestScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    userId: 'userId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type JoinRequestScalarFieldEnum = (typeof JoinRequestScalarFieldEnum)[keyof typeof JoinRequestScalarFieldEnum]


  export const GroupInviteScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    createdByUserId: 'createdByUserId',
    createdAt: 'createdAt',
    revokedAt: 'revokedAt'
  };

  export type GroupInviteScalarFieldEnum = (typeof GroupInviteScalarFieldEnum)[keyof typeof GroupInviteScalarFieldEnum]


  export const GroupBookOfMonthSelectionScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    bookId: 'bookId',
    setByUserId: 'setByUserId',
    setAt: 'setAt'
  };

  export type GroupBookOfMonthSelectionScalarFieldEnum = (typeof GroupBookOfMonthSelectionScalarFieldEnum)[keyof typeof GroupBookOfMonthSelectionScalarFieldEnum]


  export const ClubBookScalarFieldEnum: {
    id: 'id',
    bookId: 'bookId',
    title: 'title',
    author: 'author',
    colorKey: 'colorKey',
    isActive: 'isActive',
    createdByUserId: 'createdByUserId',
    createdAt: 'createdAt',
    activatedAt: 'activatedAt'
  };

  export type ClubBookScalarFieldEnum = (typeof ClubBookScalarFieldEnum)[keyof typeof ClubBookScalarFieldEnum]


  export const ClubBookMessageScalarFieldEnum: {
    id: 'id',
    clubBookId: 'clubBookId',
    userId: 'userId',
    text: 'text',
    createdAt: 'createdAt'
  };

  export type ClubBookMessageScalarFieldEnum = (typeof ClubBookMessageScalarFieldEnum)[keyof typeof ClubBookMessageScalarFieldEnum]


  export const ClubBookArtifactScalarFieldEnum: {
    id: 'id',
    clubBookId: 'clubBookId',
    uploadedByUserId: 'uploadedByUserId',
    fileName: 'fileName',
    mimeType: 'mimeType',
    size: 'size',
    url: 'url',
    createdAt: 'createdAt'
  };

  export type ClubBookArtifactScalarFieldEnum = (typeof ClubBookArtifactScalarFieldEnum)[keyof typeof ClubBookArtifactScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type GroupWhereInput = {
    AND?: GroupWhereInput | GroupWhereInput[]
    OR?: GroupWhereInput[]
    NOT?: GroupWhereInput | GroupWhereInput[]
    id?: StringFilter<"Group"> | string
    name?: StringFilter<"Group"> | string
    description?: StringFilter<"Group"> | string
    ownerId?: StringFilter<"Group"> | string
    createdAt?: DateTimeFilter<"Group"> | Date | string
    memberships?: MembershipListRelationFilter
    requests?: JoinRequestListRelationFilter
    invites?: GroupInviteListRelationFilter
    bookOfMonthSelections?: GroupBookOfMonthSelectionListRelationFilter
  }

  export type GroupOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    memberships?: MembershipOrderByRelationAggregateInput
    requests?: JoinRequestOrderByRelationAggregateInput
    invites?: GroupInviteOrderByRelationAggregateInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionOrderByRelationAggregateInput
  }

  export type GroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroupWhereInput | GroupWhereInput[]
    OR?: GroupWhereInput[]
    NOT?: GroupWhereInput | GroupWhereInput[]
    name?: StringFilter<"Group"> | string
    description?: StringFilter<"Group"> | string
    ownerId?: StringFilter<"Group"> | string
    createdAt?: DateTimeFilter<"Group"> | Date | string
    memberships?: MembershipListRelationFilter
    requests?: JoinRequestListRelationFilter
    invites?: GroupInviteListRelationFilter
    bookOfMonthSelections?: GroupBookOfMonthSelectionListRelationFilter
  }, "id">

  export type GroupOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    _count?: GroupCountOrderByAggregateInput
    _max?: GroupMaxOrderByAggregateInput
    _min?: GroupMinOrderByAggregateInput
  }

  export type GroupScalarWhereWithAggregatesInput = {
    AND?: GroupScalarWhereWithAggregatesInput | GroupScalarWhereWithAggregatesInput[]
    OR?: GroupScalarWhereWithAggregatesInput[]
    NOT?: GroupScalarWhereWithAggregatesInput | GroupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Group"> | string
    name?: StringWithAggregatesFilter<"Group"> | string
    description?: StringWithAggregatesFilter<"Group"> | string
    ownerId?: StringWithAggregatesFilter<"Group"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Group"> | Date | string
  }

  export type MembershipWhereInput = {
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    id?: StringFilter<"Membership"> | string
    groupId?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }

  export type MembershipOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    group?: GroupOrderByWithRelationInput
  }

  export type MembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    groupId_userId?: MembershipGroupIdUserIdCompoundUniqueInput
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    groupId?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }, "id" | "groupId_userId">

  export type MembershipOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    _count?: MembershipCountOrderByAggregateInput
    _max?: MembershipMaxOrderByAggregateInput
    _min?: MembershipMinOrderByAggregateInput
  }

  export type MembershipScalarWhereWithAggregatesInput = {
    AND?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    OR?: MembershipScalarWhereWithAggregatesInput[]
    NOT?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Membership"> | string
    groupId?: StringWithAggregatesFilter<"Membership"> | string
    userId?: StringWithAggregatesFilter<"Membership"> | string
    role?: StringWithAggregatesFilter<"Membership"> | string
  }

  export type JoinRequestWhereInput = {
    AND?: JoinRequestWhereInput | JoinRequestWhereInput[]
    OR?: JoinRequestWhereInput[]
    NOT?: JoinRequestWhereInput | JoinRequestWhereInput[]
    id?: StringFilter<"JoinRequest"> | string
    groupId?: StringFilter<"JoinRequest"> | string
    userId?: StringFilter<"JoinRequest"> | string
    status?: StringFilter<"JoinRequest"> | string
    createdAt?: DateTimeFilter<"JoinRequest"> | Date | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }

  export type JoinRequestOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    group?: GroupOrderByWithRelationInput
  }

  export type JoinRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    groupId_userId_status?: JoinRequestGroupIdUserIdStatusCompoundUniqueInput
    AND?: JoinRequestWhereInput | JoinRequestWhereInput[]
    OR?: JoinRequestWhereInput[]
    NOT?: JoinRequestWhereInput | JoinRequestWhereInput[]
    groupId?: StringFilter<"JoinRequest"> | string
    userId?: StringFilter<"JoinRequest"> | string
    status?: StringFilter<"JoinRequest"> | string
    createdAt?: DateTimeFilter<"JoinRequest"> | Date | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }, "id" | "groupId_userId_status">

  export type JoinRequestOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: JoinRequestCountOrderByAggregateInput
    _max?: JoinRequestMaxOrderByAggregateInput
    _min?: JoinRequestMinOrderByAggregateInput
  }

  export type JoinRequestScalarWhereWithAggregatesInput = {
    AND?: JoinRequestScalarWhereWithAggregatesInput | JoinRequestScalarWhereWithAggregatesInput[]
    OR?: JoinRequestScalarWhereWithAggregatesInput[]
    NOT?: JoinRequestScalarWhereWithAggregatesInput | JoinRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JoinRequest"> | string
    groupId?: StringWithAggregatesFilter<"JoinRequest"> | string
    userId?: StringWithAggregatesFilter<"JoinRequest"> | string
    status?: StringWithAggregatesFilter<"JoinRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"JoinRequest"> | Date | string
  }

  export type GroupInviteWhereInput = {
    AND?: GroupInviteWhereInput | GroupInviteWhereInput[]
    OR?: GroupInviteWhereInput[]
    NOT?: GroupInviteWhereInput | GroupInviteWhereInput[]
    id?: StringFilter<"GroupInvite"> | string
    groupId?: StringFilter<"GroupInvite"> | string
    createdByUserId?: StringFilter<"GroupInvite"> | string
    createdAt?: DateTimeFilter<"GroupInvite"> | Date | string
    revokedAt?: DateTimeNullableFilter<"GroupInvite"> | Date | string | null
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }

  export type GroupInviteOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    group?: GroupOrderByWithRelationInput
  }

  export type GroupInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroupInviteWhereInput | GroupInviteWhereInput[]
    OR?: GroupInviteWhereInput[]
    NOT?: GroupInviteWhereInput | GroupInviteWhereInput[]
    groupId?: StringFilter<"GroupInvite"> | string
    createdByUserId?: StringFilter<"GroupInvite"> | string
    createdAt?: DateTimeFilter<"GroupInvite"> | Date | string
    revokedAt?: DateTimeNullableFilter<"GroupInvite"> | Date | string | null
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }, "id">

  export type GroupInviteOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    _count?: GroupInviteCountOrderByAggregateInput
    _max?: GroupInviteMaxOrderByAggregateInput
    _min?: GroupInviteMinOrderByAggregateInput
  }

  export type GroupInviteScalarWhereWithAggregatesInput = {
    AND?: GroupInviteScalarWhereWithAggregatesInput | GroupInviteScalarWhereWithAggregatesInput[]
    OR?: GroupInviteScalarWhereWithAggregatesInput[]
    NOT?: GroupInviteScalarWhereWithAggregatesInput | GroupInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupInvite"> | string
    groupId?: StringWithAggregatesFilter<"GroupInvite"> | string
    createdByUserId?: StringWithAggregatesFilter<"GroupInvite"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GroupInvite"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"GroupInvite"> | Date | string | null
  }

  export type GroupBookOfMonthSelectionWhereInput = {
    AND?: GroupBookOfMonthSelectionWhereInput | GroupBookOfMonthSelectionWhereInput[]
    OR?: GroupBookOfMonthSelectionWhereInput[]
    NOT?: GroupBookOfMonthSelectionWhereInput | GroupBookOfMonthSelectionWhereInput[]
    id?: StringFilter<"GroupBookOfMonthSelection"> | string
    groupId?: StringFilter<"GroupBookOfMonthSelection"> | string
    bookId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setByUserId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setAt?: DateTimeFilter<"GroupBookOfMonthSelection"> | Date | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }

  export type GroupBookOfMonthSelectionOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    bookId?: SortOrder
    setByUserId?: SortOrder
    setAt?: SortOrder
    group?: GroupOrderByWithRelationInput
  }

  export type GroupBookOfMonthSelectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroupBookOfMonthSelectionWhereInput | GroupBookOfMonthSelectionWhereInput[]
    OR?: GroupBookOfMonthSelectionWhereInput[]
    NOT?: GroupBookOfMonthSelectionWhereInput | GroupBookOfMonthSelectionWhereInput[]
    groupId?: StringFilter<"GroupBookOfMonthSelection"> | string
    bookId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setByUserId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setAt?: DateTimeFilter<"GroupBookOfMonthSelection"> | Date | string
    group?: XOR<GroupScalarRelationFilter, GroupWhereInput>
  }, "id">

  export type GroupBookOfMonthSelectionOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    bookId?: SortOrder
    setByUserId?: SortOrder
    setAt?: SortOrder
    _count?: GroupBookOfMonthSelectionCountOrderByAggregateInput
    _max?: GroupBookOfMonthSelectionMaxOrderByAggregateInput
    _min?: GroupBookOfMonthSelectionMinOrderByAggregateInput
  }

  export type GroupBookOfMonthSelectionScalarWhereWithAggregatesInput = {
    AND?: GroupBookOfMonthSelectionScalarWhereWithAggregatesInput | GroupBookOfMonthSelectionScalarWhereWithAggregatesInput[]
    OR?: GroupBookOfMonthSelectionScalarWhereWithAggregatesInput[]
    NOT?: GroupBookOfMonthSelectionScalarWhereWithAggregatesInput | GroupBookOfMonthSelectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupBookOfMonthSelection"> | string
    groupId?: StringWithAggregatesFilter<"GroupBookOfMonthSelection"> | string
    bookId?: StringWithAggregatesFilter<"GroupBookOfMonthSelection"> | string
    setByUserId?: StringWithAggregatesFilter<"GroupBookOfMonthSelection"> | string
    setAt?: DateTimeWithAggregatesFilter<"GroupBookOfMonthSelection"> | Date | string
  }

  export type ClubBookWhereInput = {
    AND?: ClubBookWhereInput | ClubBookWhereInput[]
    OR?: ClubBookWhereInput[]
    NOT?: ClubBookWhereInput | ClubBookWhereInput[]
    id?: StringFilter<"ClubBook"> | string
    bookId?: StringFilter<"ClubBook"> | string
    title?: StringFilter<"ClubBook"> | string
    author?: StringFilter<"ClubBook"> | string
    colorKey?: StringFilter<"ClubBook"> | string
    isActive?: BoolFilter<"ClubBook"> | boolean
    createdByUserId?: StringFilter<"ClubBook"> | string
    createdAt?: DateTimeFilter<"ClubBook"> | Date | string
    activatedAt?: DateTimeNullableFilter<"ClubBook"> | Date | string | null
    messages?: ClubBookMessageListRelationFilter
    artifacts?: ClubBookArtifactListRelationFilter
  }

  export type ClubBookOrderByWithRelationInput = {
    id?: SortOrder
    bookId?: SortOrder
    title?: SortOrder
    author?: SortOrder
    colorKey?: SortOrder
    isActive?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    messages?: ClubBookMessageOrderByRelationAggregateInput
    artifacts?: ClubBookArtifactOrderByRelationAggregateInput
  }

  export type ClubBookWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClubBookWhereInput | ClubBookWhereInput[]
    OR?: ClubBookWhereInput[]
    NOT?: ClubBookWhereInput | ClubBookWhereInput[]
    bookId?: StringFilter<"ClubBook"> | string
    title?: StringFilter<"ClubBook"> | string
    author?: StringFilter<"ClubBook"> | string
    colorKey?: StringFilter<"ClubBook"> | string
    isActive?: BoolFilter<"ClubBook"> | boolean
    createdByUserId?: StringFilter<"ClubBook"> | string
    createdAt?: DateTimeFilter<"ClubBook"> | Date | string
    activatedAt?: DateTimeNullableFilter<"ClubBook"> | Date | string | null
    messages?: ClubBookMessageListRelationFilter
    artifacts?: ClubBookArtifactListRelationFilter
  }, "id">

  export type ClubBookOrderByWithAggregationInput = {
    id?: SortOrder
    bookId?: SortOrder
    title?: SortOrder
    author?: SortOrder
    colorKey?: SortOrder
    isActive?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    _count?: ClubBookCountOrderByAggregateInput
    _max?: ClubBookMaxOrderByAggregateInput
    _min?: ClubBookMinOrderByAggregateInput
  }

  export type ClubBookScalarWhereWithAggregatesInput = {
    AND?: ClubBookScalarWhereWithAggregatesInput | ClubBookScalarWhereWithAggregatesInput[]
    OR?: ClubBookScalarWhereWithAggregatesInput[]
    NOT?: ClubBookScalarWhereWithAggregatesInput | ClubBookScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClubBook"> | string
    bookId?: StringWithAggregatesFilter<"ClubBook"> | string
    title?: StringWithAggregatesFilter<"ClubBook"> | string
    author?: StringWithAggregatesFilter<"ClubBook"> | string
    colorKey?: StringWithAggregatesFilter<"ClubBook"> | string
    isActive?: BoolWithAggregatesFilter<"ClubBook"> | boolean
    createdByUserId?: StringWithAggregatesFilter<"ClubBook"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClubBook"> | Date | string
    activatedAt?: DateTimeNullableWithAggregatesFilter<"ClubBook"> | Date | string | null
  }

  export type ClubBookMessageWhereInput = {
    AND?: ClubBookMessageWhereInput | ClubBookMessageWhereInput[]
    OR?: ClubBookMessageWhereInput[]
    NOT?: ClubBookMessageWhereInput | ClubBookMessageWhereInput[]
    id?: StringFilter<"ClubBookMessage"> | string
    clubBookId?: StringFilter<"ClubBookMessage"> | string
    userId?: StringFilter<"ClubBookMessage"> | string
    text?: StringFilter<"ClubBookMessage"> | string
    createdAt?: DateTimeFilter<"ClubBookMessage"> | Date | string
    clubBook?: XOR<ClubBookScalarRelationFilter, ClubBookWhereInput>
  }

  export type ClubBookMessageOrderByWithRelationInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    clubBook?: ClubBookOrderByWithRelationInput
  }

  export type ClubBookMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClubBookMessageWhereInput | ClubBookMessageWhereInput[]
    OR?: ClubBookMessageWhereInput[]
    NOT?: ClubBookMessageWhereInput | ClubBookMessageWhereInput[]
    clubBookId?: StringFilter<"ClubBookMessage"> | string
    userId?: StringFilter<"ClubBookMessage"> | string
    text?: StringFilter<"ClubBookMessage"> | string
    createdAt?: DateTimeFilter<"ClubBookMessage"> | Date | string
    clubBook?: XOR<ClubBookScalarRelationFilter, ClubBookWhereInput>
  }, "id">

  export type ClubBookMessageOrderByWithAggregationInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    _count?: ClubBookMessageCountOrderByAggregateInput
    _max?: ClubBookMessageMaxOrderByAggregateInput
    _min?: ClubBookMessageMinOrderByAggregateInput
  }

  export type ClubBookMessageScalarWhereWithAggregatesInput = {
    AND?: ClubBookMessageScalarWhereWithAggregatesInput | ClubBookMessageScalarWhereWithAggregatesInput[]
    OR?: ClubBookMessageScalarWhereWithAggregatesInput[]
    NOT?: ClubBookMessageScalarWhereWithAggregatesInput | ClubBookMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClubBookMessage"> | string
    clubBookId?: StringWithAggregatesFilter<"ClubBookMessage"> | string
    userId?: StringWithAggregatesFilter<"ClubBookMessage"> | string
    text?: StringWithAggregatesFilter<"ClubBookMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClubBookMessage"> | Date | string
  }

  export type ClubBookArtifactWhereInput = {
    AND?: ClubBookArtifactWhereInput | ClubBookArtifactWhereInput[]
    OR?: ClubBookArtifactWhereInput[]
    NOT?: ClubBookArtifactWhereInput | ClubBookArtifactWhereInput[]
    id?: StringFilter<"ClubBookArtifact"> | string
    clubBookId?: StringFilter<"ClubBookArtifact"> | string
    uploadedByUserId?: StringFilter<"ClubBookArtifact"> | string
    fileName?: StringFilter<"ClubBookArtifact"> | string
    mimeType?: StringFilter<"ClubBookArtifact"> | string
    size?: IntFilter<"ClubBookArtifact"> | number
    url?: StringFilter<"ClubBookArtifact"> | string
    createdAt?: DateTimeFilter<"ClubBookArtifact"> | Date | string
    clubBook?: XOR<ClubBookScalarRelationFilter, ClubBookWhereInput>
  }

  export type ClubBookArtifactOrderByWithRelationInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    uploadedByUserId?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    clubBook?: ClubBookOrderByWithRelationInput
  }

  export type ClubBookArtifactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClubBookArtifactWhereInput | ClubBookArtifactWhereInput[]
    OR?: ClubBookArtifactWhereInput[]
    NOT?: ClubBookArtifactWhereInput | ClubBookArtifactWhereInput[]
    clubBookId?: StringFilter<"ClubBookArtifact"> | string
    uploadedByUserId?: StringFilter<"ClubBookArtifact"> | string
    fileName?: StringFilter<"ClubBookArtifact"> | string
    mimeType?: StringFilter<"ClubBookArtifact"> | string
    size?: IntFilter<"ClubBookArtifact"> | number
    url?: StringFilter<"ClubBookArtifact"> | string
    createdAt?: DateTimeFilter<"ClubBookArtifact"> | Date | string
    clubBook?: XOR<ClubBookScalarRelationFilter, ClubBookWhereInput>
  }, "id">

  export type ClubBookArtifactOrderByWithAggregationInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    uploadedByUserId?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    _count?: ClubBookArtifactCountOrderByAggregateInput
    _avg?: ClubBookArtifactAvgOrderByAggregateInput
    _max?: ClubBookArtifactMaxOrderByAggregateInput
    _min?: ClubBookArtifactMinOrderByAggregateInput
    _sum?: ClubBookArtifactSumOrderByAggregateInput
  }

  export type ClubBookArtifactScalarWhereWithAggregatesInput = {
    AND?: ClubBookArtifactScalarWhereWithAggregatesInput | ClubBookArtifactScalarWhereWithAggregatesInput[]
    OR?: ClubBookArtifactScalarWhereWithAggregatesInput[]
    NOT?: ClubBookArtifactScalarWhereWithAggregatesInput | ClubBookArtifactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    clubBookId?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    uploadedByUserId?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    fileName?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    mimeType?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    size?: IntWithAggregatesFilter<"ClubBookArtifact"> | number
    url?: StringWithAggregatesFilter<"ClubBookArtifact"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClubBookArtifact"> | Date | string
  }

  export type GroupCreateInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutGroupInput
    requests?: JoinRequestCreateNestedManyWithoutGroupInput
    invites?: GroupInviteCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionCreateNestedManyWithoutGroupInput
  }

  export type GroupUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutGroupInput
    requests?: JoinRequestUncheckedCreateNestedManyWithoutGroupInput
    invites?: GroupInviteUncheckedCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type GroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUpdateManyWithoutGroupNestedInput
  }

  export type GroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUncheckedUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUncheckedUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type GroupCreateManyInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
  }

  export type GroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateInput = {
    id?: string
    userId: string
    role: string
    group: GroupCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateInput = {
    id?: string
    groupId: string
    userId: string
    role: string
  }

  export type MembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    group?: GroupUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type MembershipCreateManyInput = {
    id?: string
    groupId: string
    userId: string
    role: string
  }

  export type MembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type MembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type JoinRequestCreateInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
    group: GroupCreateNestedOneWithoutRequestsInput
  }

  export type JoinRequestUncheckedCreateInput = {
    id?: string
    groupId: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type JoinRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    group?: GroupUpdateOneRequiredWithoutRequestsNestedInput
  }

  export type JoinRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinRequestCreateManyInput = {
    id?: string
    groupId: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type JoinRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupInviteCreateInput = {
    id?: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
    group: GroupCreateNestedOneWithoutInvitesInput
  }

  export type GroupInviteUncheckedCreateInput = {
    id?: string
    groupId: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type GroupInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    group?: GroupUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type GroupInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupInviteCreateManyInput = {
    id?: string
    groupId: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type GroupInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupBookOfMonthSelectionCreateInput = {
    id?: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
    group: GroupCreateNestedOneWithoutBookOfMonthSelectionsInput
  }

  export type GroupBookOfMonthSelectionUncheckedCreateInput = {
    id?: string
    groupId: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
  }

  export type GroupBookOfMonthSelectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
    group?: GroupUpdateOneRequiredWithoutBookOfMonthSelectionsNestedInput
  }

  export type GroupBookOfMonthSelectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupBookOfMonthSelectionCreateManyInput = {
    id?: string
    groupId: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
  }

  export type GroupBookOfMonthSelectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupBookOfMonthSelectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookCreateInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    messages?: ClubBookMessageCreateNestedManyWithoutClubBookInput
    artifacts?: ClubBookArtifactCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookUncheckedCreateInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    messages?: ClubBookMessageUncheckedCreateNestedManyWithoutClubBookInput
    artifacts?: ClubBookArtifactUncheckedCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: ClubBookMessageUpdateManyWithoutClubBookNestedInput
    artifacts?: ClubBookArtifactUpdateManyWithoutClubBookNestedInput
  }

  export type ClubBookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: ClubBookMessageUncheckedUpdateManyWithoutClubBookNestedInput
    artifacts?: ClubBookArtifactUncheckedUpdateManyWithoutClubBookNestedInput
  }

  export type ClubBookCreateManyInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
  }

  export type ClubBookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClubBookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClubBookMessageCreateInput = {
    id?: string
    userId: string
    text: string
    createdAt?: Date | string
    clubBook: ClubBookCreateNestedOneWithoutMessagesInput
  }

  export type ClubBookMessageUncheckedCreateInput = {
    id?: string
    clubBookId: string
    userId: string
    text: string
    createdAt?: Date | string
  }

  export type ClubBookMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clubBook?: ClubBookUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ClubBookMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clubBookId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookMessageCreateManyInput = {
    id?: string
    clubBookId: string
    userId: string
    text: string
    createdAt?: Date | string
  }

  export type ClubBookMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clubBookId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactCreateInput = {
    id?: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
    clubBook: ClubBookCreateNestedOneWithoutArtifactsInput
  }

  export type ClubBookArtifactUncheckedCreateInput = {
    id?: string
    clubBookId: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ClubBookArtifactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clubBook?: ClubBookUpdateOneRequiredWithoutArtifactsNestedInput
  }

  export type ClubBookArtifactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clubBookId?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactCreateManyInput = {
    id?: string
    clubBookId: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ClubBookArtifactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clubBookId?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MembershipListRelationFilter = {
    every?: MembershipWhereInput
    some?: MembershipWhereInput
    none?: MembershipWhereInput
  }

  export type JoinRequestListRelationFilter = {
    every?: JoinRequestWhereInput
    some?: JoinRequestWhereInput
    none?: JoinRequestWhereInput
  }

  export type GroupInviteListRelationFilter = {
    every?: GroupInviteWhereInput
    some?: GroupInviteWhereInput
    none?: GroupInviteWhereInput
  }

  export type GroupBookOfMonthSelectionListRelationFilter = {
    every?: GroupBookOfMonthSelectionWhereInput
    some?: GroupBookOfMonthSelectionWhereInput
    none?: GroupBookOfMonthSelectionWhereInput
  }

  export type MembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JoinRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GroupInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GroupBookOfMonthSelectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GroupCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type GroupMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type GroupMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type GroupScalarRelationFilter = {
    is?: GroupWhereInput
    isNot?: GroupWhereInput
  }

  export type MembershipGroupIdUserIdCompoundUniqueInput = {
    groupId: string
    userId: string
  }

  export type MembershipCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type MembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type MembershipMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type JoinRequestGroupIdUserIdStatusCompoundUniqueInput = {
    groupId: string
    userId: string
    status: string
  }

  export type JoinRequestCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type JoinRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type JoinRequestMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GroupInviteCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type GroupInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type GroupInviteMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type GroupBookOfMonthSelectionCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    bookId?: SortOrder
    setByUserId?: SortOrder
    setAt?: SortOrder
  }

  export type GroupBookOfMonthSelectionMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    bookId?: SortOrder
    setByUserId?: SortOrder
    setAt?: SortOrder
  }

  export type GroupBookOfMonthSelectionMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    bookId?: SortOrder
    setByUserId?: SortOrder
    setAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ClubBookMessageListRelationFilter = {
    every?: ClubBookMessageWhereInput
    some?: ClubBookMessageWhereInput
    none?: ClubBookMessageWhereInput
  }

  export type ClubBookArtifactListRelationFilter = {
    every?: ClubBookArtifactWhereInput
    some?: ClubBookArtifactWhereInput
    none?: ClubBookArtifactWhereInput
  }

  export type ClubBookMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClubBookArtifactOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClubBookCountOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    title?: SortOrder
    author?: SortOrder
    colorKey?: SortOrder
    isActive?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    activatedAt?: SortOrder
  }

  export type ClubBookMaxOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    title?: SortOrder
    author?: SortOrder
    colorKey?: SortOrder
    isActive?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    activatedAt?: SortOrder
  }

  export type ClubBookMinOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    title?: SortOrder
    author?: SortOrder
    colorKey?: SortOrder
    isActive?: SortOrder
    createdByUserId?: SortOrder
    createdAt?: SortOrder
    activatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ClubBookScalarRelationFilter = {
    is?: ClubBookWhereInput
    isNot?: ClubBookWhereInput
  }

  export type ClubBookMessageCountOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type ClubBookMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type ClubBookMessageMinOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ClubBookArtifactCountOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    uploadedByUserId?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ClubBookArtifactAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ClubBookArtifactMaxOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    uploadedByUserId?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ClubBookArtifactMinOrderByAggregateInput = {
    id?: SortOrder
    clubBookId?: SortOrder
    uploadedByUserId?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ClubBookArtifactSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type MembershipCreateNestedManyWithoutGroupInput = {
    create?: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput> | MembershipCreateWithoutGroupInput[] | MembershipUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutGroupInput | MembershipCreateOrConnectWithoutGroupInput[]
    createMany?: MembershipCreateManyGroupInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type JoinRequestCreateNestedManyWithoutGroupInput = {
    create?: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput> | JoinRequestCreateWithoutGroupInput[] | JoinRequestUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: JoinRequestCreateOrConnectWithoutGroupInput | JoinRequestCreateOrConnectWithoutGroupInput[]
    createMany?: JoinRequestCreateManyGroupInputEnvelope
    connect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
  }

  export type GroupInviteCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput> | GroupInviteCreateWithoutGroupInput[] | GroupInviteUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupInviteCreateOrConnectWithoutGroupInput | GroupInviteCreateOrConnectWithoutGroupInput[]
    createMany?: GroupInviteCreateManyGroupInputEnvelope
    connect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
  }

  export type GroupBookOfMonthSelectionCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput> | GroupBookOfMonthSelectionCreateWithoutGroupInput[] | GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput | GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput[]
    createMany?: GroupBookOfMonthSelectionCreateManyGroupInputEnvelope
    connect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
  }

  export type MembershipUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput> | MembershipCreateWithoutGroupInput[] | MembershipUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutGroupInput | MembershipCreateOrConnectWithoutGroupInput[]
    createMany?: MembershipCreateManyGroupInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type JoinRequestUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput> | JoinRequestCreateWithoutGroupInput[] | JoinRequestUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: JoinRequestCreateOrConnectWithoutGroupInput | JoinRequestCreateOrConnectWithoutGroupInput[]
    createMany?: JoinRequestCreateManyGroupInputEnvelope
    connect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
  }

  export type GroupInviteUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput> | GroupInviteCreateWithoutGroupInput[] | GroupInviteUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupInviteCreateOrConnectWithoutGroupInput | GroupInviteCreateOrConnectWithoutGroupInput[]
    createMany?: GroupInviteCreateManyGroupInputEnvelope
    connect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
  }

  export type GroupBookOfMonthSelectionUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput> | GroupBookOfMonthSelectionCreateWithoutGroupInput[] | GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput | GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput[]
    createMany?: GroupBookOfMonthSelectionCreateManyGroupInputEnvelope
    connect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MembershipUpdateManyWithoutGroupNestedInput = {
    create?: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput> | MembershipCreateWithoutGroupInput[] | MembershipUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutGroupInput | MembershipCreateOrConnectWithoutGroupInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutGroupInput | MembershipUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: MembershipCreateManyGroupInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutGroupInput | MembershipUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutGroupInput | MembershipUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type JoinRequestUpdateManyWithoutGroupNestedInput = {
    create?: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput> | JoinRequestCreateWithoutGroupInput[] | JoinRequestUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: JoinRequestCreateOrConnectWithoutGroupInput | JoinRequestCreateOrConnectWithoutGroupInput[]
    upsert?: JoinRequestUpsertWithWhereUniqueWithoutGroupInput | JoinRequestUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: JoinRequestCreateManyGroupInputEnvelope
    set?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    disconnect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    delete?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    connect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    update?: JoinRequestUpdateWithWhereUniqueWithoutGroupInput | JoinRequestUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: JoinRequestUpdateManyWithWhereWithoutGroupInput | JoinRequestUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: JoinRequestScalarWhereInput | JoinRequestScalarWhereInput[]
  }

  export type GroupInviteUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput> | GroupInviteCreateWithoutGroupInput[] | GroupInviteUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupInviteCreateOrConnectWithoutGroupInput | GroupInviteCreateOrConnectWithoutGroupInput[]
    upsert?: GroupInviteUpsertWithWhereUniqueWithoutGroupInput | GroupInviteUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupInviteCreateManyGroupInputEnvelope
    set?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    disconnect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    delete?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    connect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    update?: GroupInviteUpdateWithWhereUniqueWithoutGroupInput | GroupInviteUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupInviteUpdateManyWithWhereWithoutGroupInput | GroupInviteUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupInviteScalarWhereInput | GroupInviteScalarWhereInput[]
  }

  export type GroupBookOfMonthSelectionUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput> | GroupBookOfMonthSelectionCreateWithoutGroupInput[] | GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput | GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput[]
    upsert?: GroupBookOfMonthSelectionUpsertWithWhereUniqueWithoutGroupInput | GroupBookOfMonthSelectionUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupBookOfMonthSelectionCreateManyGroupInputEnvelope
    set?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    disconnect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    delete?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    connect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    update?: GroupBookOfMonthSelectionUpdateWithWhereUniqueWithoutGroupInput | GroupBookOfMonthSelectionUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupBookOfMonthSelectionUpdateManyWithWhereWithoutGroupInput | GroupBookOfMonthSelectionUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupBookOfMonthSelectionScalarWhereInput | GroupBookOfMonthSelectionScalarWhereInput[]
  }

  export type MembershipUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput> | MembershipCreateWithoutGroupInput[] | MembershipUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutGroupInput | MembershipCreateOrConnectWithoutGroupInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutGroupInput | MembershipUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: MembershipCreateManyGroupInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutGroupInput | MembershipUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutGroupInput | MembershipUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type JoinRequestUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput> | JoinRequestCreateWithoutGroupInput[] | JoinRequestUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: JoinRequestCreateOrConnectWithoutGroupInput | JoinRequestCreateOrConnectWithoutGroupInput[]
    upsert?: JoinRequestUpsertWithWhereUniqueWithoutGroupInput | JoinRequestUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: JoinRequestCreateManyGroupInputEnvelope
    set?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    disconnect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    delete?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    connect?: JoinRequestWhereUniqueInput | JoinRequestWhereUniqueInput[]
    update?: JoinRequestUpdateWithWhereUniqueWithoutGroupInput | JoinRequestUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: JoinRequestUpdateManyWithWhereWithoutGroupInput | JoinRequestUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: JoinRequestScalarWhereInput | JoinRequestScalarWhereInput[]
  }

  export type GroupInviteUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput> | GroupInviteCreateWithoutGroupInput[] | GroupInviteUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupInviteCreateOrConnectWithoutGroupInput | GroupInviteCreateOrConnectWithoutGroupInput[]
    upsert?: GroupInviteUpsertWithWhereUniqueWithoutGroupInput | GroupInviteUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupInviteCreateManyGroupInputEnvelope
    set?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    disconnect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    delete?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    connect?: GroupInviteWhereUniqueInput | GroupInviteWhereUniqueInput[]
    update?: GroupInviteUpdateWithWhereUniqueWithoutGroupInput | GroupInviteUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupInviteUpdateManyWithWhereWithoutGroupInput | GroupInviteUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupInviteScalarWhereInput | GroupInviteScalarWhereInput[]
  }

  export type GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput> | GroupBookOfMonthSelectionCreateWithoutGroupInput[] | GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput | GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput[]
    upsert?: GroupBookOfMonthSelectionUpsertWithWhereUniqueWithoutGroupInput | GroupBookOfMonthSelectionUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupBookOfMonthSelectionCreateManyGroupInputEnvelope
    set?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    disconnect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    delete?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    connect?: GroupBookOfMonthSelectionWhereUniqueInput | GroupBookOfMonthSelectionWhereUniqueInput[]
    update?: GroupBookOfMonthSelectionUpdateWithWhereUniqueWithoutGroupInput | GroupBookOfMonthSelectionUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupBookOfMonthSelectionUpdateManyWithWhereWithoutGroupInput | GroupBookOfMonthSelectionUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupBookOfMonthSelectionScalarWhereInput | GroupBookOfMonthSelectionScalarWhereInput[]
  }

  export type GroupCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<GroupCreateWithoutMembershipsInput, GroupUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutMembershipsInput
    connect?: GroupWhereUniqueInput
  }

  export type GroupUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<GroupCreateWithoutMembershipsInput, GroupUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutMembershipsInput
    upsert?: GroupUpsertWithoutMembershipsInput
    connect?: GroupWhereUniqueInput
    update?: XOR<XOR<GroupUpdateToOneWithWhereWithoutMembershipsInput, GroupUpdateWithoutMembershipsInput>, GroupUncheckedUpdateWithoutMembershipsInput>
  }

  export type GroupCreateNestedOneWithoutRequestsInput = {
    create?: XOR<GroupCreateWithoutRequestsInput, GroupUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutRequestsInput
    connect?: GroupWhereUniqueInput
  }

  export type GroupUpdateOneRequiredWithoutRequestsNestedInput = {
    create?: XOR<GroupCreateWithoutRequestsInput, GroupUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutRequestsInput
    upsert?: GroupUpsertWithoutRequestsInput
    connect?: GroupWhereUniqueInput
    update?: XOR<XOR<GroupUpdateToOneWithWhereWithoutRequestsInput, GroupUpdateWithoutRequestsInput>, GroupUncheckedUpdateWithoutRequestsInput>
  }

  export type GroupCreateNestedOneWithoutInvitesInput = {
    create?: XOR<GroupCreateWithoutInvitesInput, GroupUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: GroupCreateOrConnectWithoutInvitesInput
    connect?: GroupWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type GroupUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<GroupCreateWithoutInvitesInput, GroupUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: GroupCreateOrConnectWithoutInvitesInput
    upsert?: GroupUpsertWithoutInvitesInput
    connect?: GroupWhereUniqueInput
    update?: XOR<XOR<GroupUpdateToOneWithWhereWithoutInvitesInput, GroupUpdateWithoutInvitesInput>, GroupUncheckedUpdateWithoutInvitesInput>
  }

  export type GroupCreateNestedOneWithoutBookOfMonthSelectionsInput = {
    create?: XOR<GroupCreateWithoutBookOfMonthSelectionsInput, GroupUncheckedCreateWithoutBookOfMonthSelectionsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutBookOfMonthSelectionsInput
    connect?: GroupWhereUniqueInput
  }

  export type GroupUpdateOneRequiredWithoutBookOfMonthSelectionsNestedInput = {
    create?: XOR<GroupCreateWithoutBookOfMonthSelectionsInput, GroupUncheckedCreateWithoutBookOfMonthSelectionsInput>
    connectOrCreate?: GroupCreateOrConnectWithoutBookOfMonthSelectionsInput
    upsert?: GroupUpsertWithoutBookOfMonthSelectionsInput
    connect?: GroupWhereUniqueInput
    update?: XOR<XOR<GroupUpdateToOneWithWhereWithoutBookOfMonthSelectionsInput, GroupUpdateWithoutBookOfMonthSelectionsInput>, GroupUncheckedUpdateWithoutBookOfMonthSelectionsInput>
  }

  export type ClubBookMessageCreateNestedManyWithoutClubBookInput = {
    create?: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput> | ClubBookMessageCreateWithoutClubBookInput[] | ClubBookMessageUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookMessageCreateOrConnectWithoutClubBookInput | ClubBookMessageCreateOrConnectWithoutClubBookInput[]
    createMany?: ClubBookMessageCreateManyClubBookInputEnvelope
    connect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
  }

  export type ClubBookArtifactCreateNestedManyWithoutClubBookInput = {
    create?: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput> | ClubBookArtifactCreateWithoutClubBookInput[] | ClubBookArtifactUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookArtifactCreateOrConnectWithoutClubBookInput | ClubBookArtifactCreateOrConnectWithoutClubBookInput[]
    createMany?: ClubBookArtifactCreateManyClubBookInputEnvelope
    connect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
  }

  export type ClubBookMessageUncheckedCreateNestedManyWithoutClubBookInput = {
    create?: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput> | ClubBookMessageCreateWithoutClubBookInput[] | ClubBookMessageUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookMessageCreateOrConnectWithoutClubBookInput | ClubBookMessageCreateOrConnectWithoutClubBookInput[]
    createMany?: ClubBookMessageCreateManyClubBookInputEnvelope
    connect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
  }

  export type ClubBookArtifactUncheckedCreateNestedManyWithoutClubBookInput = {
    create?: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput> | ClubBookArtifactCreateWithoutClubBookInput[] | ClubBookArtifactUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookArtifactCreateOrConnectWithoutClubBookInput | ClubBookArtifactCreateOrConnectWithoutClubBookInput[]
    createMany?: ClubBookArtifactCreateManyClubBookInputEnvelope
    connect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ClubBookMessageUpdateManyWithoutClubBookNestedInput = {
    create?: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput> | ClubBookMessageCreateWithoutClubBookInput[] | ClubBookMessageUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookMessageCreateOrConnectWithoutClubBookInput | ClubBookMessageCreateOrConnectWithoutClubBookInput[]
    upsert?: ClubBookMessageUpsertWithWhereUniqueWithoutClubBookInput | ClubBookMessageUpsertWithWhereUniqueWithoutClubBookInput[]
    createMany?: ClubBookMessageCreateManyClubBookInputEnvelope
    set?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    disconnect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    delete?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    connect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    update?: ClubBookMessageUpdateWithWhereUniqueWithoutClubBookInput | ClubBookMessageUpdateWithWhereUniqueWithoutClubBookInput[]
    updateMany?: ClubBookMessageUpdateManyWithWhereWithoutClubBookInput | ClubBookMessageUpdateManyWithWhereWithoutClubBookInput[]
    deleteMany?: ClubBookMessageScalarWhereInput | ClubBookMessageScalarWhereInput[]
  }

  export type ClubBookArtifactUpdateManyWithoutClubBookNestedInput = {
    create?: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput> | ClubBookArtifactCreateWithoutClubBookInput[] | ClubBookArtifactUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookArtifactCreateOrConnectWithoutClubBookInput | ClubBookArtifactCreateOrConnectWithoutClubBookInput[]
    upsert?: ClubBookArtifactUpsertWithWhereUniqueWithoutClubBookInput | ClubBookArtifactUpsertWithWhereUniqueWithoutClubBookInput[]
    createMany?: ClubBookArtifactCreateManyClubBookInputEnvelope
    set?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    disconnect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    delete?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    connect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    update?: ClubBookArtifactUpdateWithWhereUniqueWithoutClubBookInput | ClubBookArtifactUpdateWithWhereUniqueWithoutClubBookInput[]
    updateMany?: ClubBookArtifactUpdateManyWithWhereWithoutClubBookInput | ClubBookArtifactUpdateManyWithWhereWithoutClubBookInput[]
    deleteMany?: ClubBookArtifactScalarWhereInput | ClubBookArtifactScalarWhereInput[]
  }

  export type ClubBookMessageUncheckedUpdateManyWithoutClubBookNestedInput = {
    create?: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput> | ClubBookMessageCreateWithoutClubBookInput[] | ClubBookMessageUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookMessageCreateOrConnectWithoutClubBookInput | ClubBookMessageCreateOrConnectWithoutClubBookInput[]
    upsert?: ClubBookMessageUpsertWithWhereUniqueWithoutClubBookInput | ClubBookMessageUpsertWithWhereUniqueWithoutClubBookInput[]
    createMany?: ClubBookMessageCreateManyClubBookInputEnvelope
    set?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    disconnect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    delete?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    connect?: ClubBookMessageWhereUniqueInput | ClubBookMessageWhereUniqueInput[]
    update?: ClubBookMessageUpdateWithWhereUniqueWithoutClubBookInput | ClubBookMessageUpdateWithWhereUniqueWithoutClubBookInput[]
    updateMany?: ClubBookMessageUpdateManyWithWhereWithoutClubBookInput | ClubBookMessageUpdateManyWithWhereWithoutClubBookInput[]
    deleteMany?: ClubBookMessageScalarWhereInput | ClubBookMessageScalarWhereInput[]
  }

  export type ClubBookArtifactUncheckedUpdateManyWithoutClubBookNestedInput = {
    create?: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput> | ClubBookArtifactCreateWithoutClubBookInput[] | ClubBookArtifactUncheckedCreateWithoutClubBookInput[]
    connectOrCreate?: ClubBookArtifactCreateOrConnectWithoutClubBookInput | ClubBookArtifactCreateOrConnectWithoutClubBookInput[]
    upsert?: ClubBookArtifactUpsertWithWhereUniqueWithoutClubBookInput | ClubBookArtifactUpsertWithWhereUniqueWithoutClubBookInput[]
    createMany?: ClubBookArtifactCreateManyClubBookInputEnvelope
    set?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    disconnect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    delete?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    connect?: ClubBookArtifactWhereUniqueInput | ClubBookArtifactWhereUniqueInput[]
    update?: ClubBookArtifactUpdateWithWhereUniqueWithoutClubBookInput | ClubBookArtifactUpdateWithWhereUniqueWithoutClubBookInput[]
    updateMany?: ClubBookArtifactUpdateManyWithWhereWithoutClubBookInput | ClubBookArtifactUpdateManyWithWhereWithoutClubBookInput[]
    deleteMany?: ClubBookArtifactScalarWhereInput | ClubBookArtifactScalarWhereInput[]
  }

  export type ClubBookCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ClubBookCreateWithoutMessagesInput, ClubBookUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ClubBookCreateOrConnectWithoutMessagesInput
    connect?: ClubBookWhereUniqueInput
  }

  export type ClubBookUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ClubBookCreateWithoutMessagesInput, ClubBookUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ClubBookCreateOrConnectWithoutMessagesInput
    upsert?: ClubBookUpsertWithoutMessagesInput
    connect?: ClubBookWhereUniqueInput
    update?: XOR<XOR<ClubBookUpdateToOneWithWhereWithoutMessagesInput, ClubBookUpdateWithoutMessagesInput>, ClubBookUncheckedUpdateWithoutMessagesInput>
  }

  export type ClubBookCreateNestedOneWithoutArtifactsInput = {
    create?: XOR<ClubBookCreateWithoutArtifactsInput, ClubBookUncheckedCreateWithoutArtifactsInput>
    connectOrCreate?: ClubBookCreateOrConnectWithoutArtifactsInput
    connect?: ClubBookWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ClubBookUpdateOneRequiredWithoutArtifactsNestedInput = {
    create?: XOR<ClubBookCreateWithoutArtifactsInput, ClubBookUncheckedCreateWithoutArtifactsInput>
    connectOrCreate?: ClubBookCreateOrConnectWithoutArtifactsInput
    upsert?: ClubBookUpsertWithoutArtifactsInput
    connect?: ClubBookWhereUniqueInput
    update?: XOR<XOR<ClubBookUpdateToOneWithWhereWithoutArtifactsInput, ClubBookUpdateWithoutArtifactsInput>, ClubBookUncheckedUpdateWithoutArtifactsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MembershipCreateWithoutGroupInput = {
    id?: string
    userId: string
    role: string
  }

  export type MembershipUncheckedCreateWithoutGroupInput = {
    id?: string
    userId: string
    role: string
  }

  export type MembershipCreateOrConnectWithoutGroupInput = {
    where: MembershipWhereUniqueInput
    create: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput>
  }

  export type MembershipCreateManyGroupInputEnvelope = {
    data: MembershipCreateManyGroupInput | MembershipCreateManyGroupInput[]
  }

  export type JoinRequestCreateWithoutGroupInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type JoinRequestUncheckedCreateWithoutGroupInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type JoinRequestCreateOrConnectWithoutGroupInput = {
    where: JoinRequestWhereUniqueInput
    create: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput>
  }

  export type JoinRequestCreateManyGroupInputEnvelope = {
    data: JoinRequestCreateManyGroupInput | JoinRequestCreateManyGroupInput[]
  }

  export type GroupInviteCreateWithoutGroupInput = {
    id?: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type GroupInviteUncheckedCreateWithoutGroupInput = {
    id?: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type GroupInviteCreateOrConnectWithoutGroupInput = {
    where: GroupInviteWhereUniqueInput
    create: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput>
  }

  export type GroupInviteCreateManyGroupInputEnvelope = {
    data: GroupInviteCreateManyGroupInput | GroupInviteCreateManyGroupInput[]
  }

  export type GroupBookOfMonthSelectionCreateWithoutGroupInput = {
    id?: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
  }

  export type GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput = {
    id?: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
  }

  export type GroupBookOfMonthSelectionCreateOrConnectWithoutGroupInput = {
    where: GroupBookOfMonthSelectionWhereUniqueInput
    create: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput>
  }

  export type GroupBookOfMonthSelectionCreateManyGroupInputEnvelope = {
    data: GroupBookOfMonthSelectionCreateManyGroupInput | GroupBookOfMonthSelectionCreateManyGroupInput[]
  }

  export type MembershipUpsertWithWhereUniqueWithoutGroupInput = {
    where: MembershipWhereUniqueInput
    update: XOR<MembershipUpdateWithoutGroupInput, MembershipUncheckedUpdateWithoutGroupInput>
    create: XOR<MembershipCreateWithoutGroupInput, MembershipUncheckedCreateWithoutGroupInput>
  }

  export type MembershipUpdateWithWhereUniqueWithoutGroupInput = {
    where: MembershipWhereUniqueInput
    data: XOR<MembershipUpdateWithoutGroupInput, MembershipUncheckedUpdateWithoutGroupInput>
  }

  export type MembershipUpdateManyWithWhereWithoutGroupInput = {
    where: MembershipScalarWhereInput
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyWithoutGroupInput>
  }

  export type MembershipScalarWhereInput = {
    AND?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    OR?: MembershipScalarWhereInput[]
    NOT?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    id?: StringFilter<"Membership"> | string
    groupId?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
  }

  export type JoinRequestUpsertWithWhereUniqueWithoutGroupInput = {
    where: JoinRequestWhereUniqueInput
    update: XOR<JoinRequestUpdateWithoutGroupInput, JoinRequestUncheckedUpdateWithoutGroupInput>
    create: XOR<JoinRequestCreateWithoutGroupInput, JoinRequestUncheckedCreateWithoutGroupInput>
  }

  export type JoinRequestUpdateWithWhereUniqueWithoutGroupInput = {
    where: JoinRequestWhereUniqueInput
    data: XOR<JoinRequestUpdateWithoutGroupInput, JoinRequestUncheckedUpdateWithoutGroupInput>
  }

  export type JoinRequestUpdateManyWithWhereWithoutGroupInput = {
    where: JoinRequestScalarWhereInput
    data: XOR<JoinRequestUpdateManyMutationInput, JoinRequestUncheckedUpdateManyWithoutGroupInput>
  }

  export type JoinRequestScalarWhereInput = {
    AND?: JoinRequestScalarWhereInput | JoinRequestScalarWhereInput[]
    OR?: JoinRequestScalarWhereInput[]
    NOT?: JoinRequestScalarWhereInput | JoinRequestScalarWhereInput[]
    id?: StringFilter<"JoinRequest"> | string
    groupId?: StringFilter<"JoinRequest"> | string
    userId?: StringFilter<"JoinRequest"> | string
    status?: StringFilter<"JoinRequest"> | string
    createdAt?: DateTimeFilter<"JoinRequest"> | Date | string
  }

  export type GroupInviteUpsertWithWhereUniqueWithoutGroupInput = {
    where: GroupInviteWhereUniqueInput
    update: XOR<GroupInviteUpdateWithoutGroupInput, GroupInviteUncheckedUpdateWithoutGroupInput>
    create: XOR<GroupInviteCreateWithoutGroupInput, GroupInviteUncheckedCreateWithoutGroupInput>
  }

  export type GroupInviteUpdateWithWhereUniqueWithoutGroupInput = {
    where: GroupInviteWhereUniqueInput
    data: XOR<GroupInviteUpdateWithoutGroupInput, GroupInviteUncheckedUpdateWithoutGroupInput>
  }

  export type GroupInviteUpdateManyWithWhereWithoutGroupInput = {
    where: GroupInviteScalarWhereInput
    data: XOR<GroupInviteUpdateManyMutationInput, GroupInviteUncheckedUpdateManyWithoutGroupInput>
  }

  export type GroupInviteScalarWhereInput = {
    AND?: GroupInviteScalarWhereInput | GroupInviteScalarWhereInput[]
    OR?: GroupInviteScalarWhereInput[]
    NOT?: GroupInviteScalarWhereInput | GroupInviteScalarWhereInput[]
    id?: StringFilter<"GroupInvite"> | string
    groupId?: StringFilter<"GroupInvite"> | string
    createdByUserId?: StringFilter<"GroupInvite"> | string
    createdAt?: DateTimeFilter<"GroupInvite"> | Date | string
    revokedAt?: DateTimeNullableFilter<"GroupInvite"> | Date | string | null
  }

  export type GroupBookOfMonthSelectionUpsertWithWhereUniqueWithoutGroupInput = {
    where: GroupBookOfMonthSelectionWhereUniqueInput
    update: XOR<GroupBookOfMonthSelectionUpdateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedUpdateWithoutGroupInput>
    create: XOR<GroupBookOfMonthSelectionCreateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedCreateWithoutGroupInput>
  }

  export type GroupBookOfMonthSelectionUpdateWithWhereUniqueWithoutGroupInput = {
    where: GroupBookOfMonthSelectionWhereUniqueInput
    data: XOR<GroupBookOfMonthSelectionUpdateWithoutGroupInput, GroupBookOfMonthSelectionUncheckedUpdateWithoutGroupInput>
  }

  export type GroupBookOfMonthSelectionUpdateManyWithWhereWithoutGroupInput = {
    where: GroupBookOfMonthSelectionScalarWhereInput
    data: XOR<GroupBookOfMonthSelectionUpdateManyMutationInput, GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupInput>
  }

  export type GroupBookOfMonthSelectionScalarWhereInput = {
    AND?: GroupBookOfMonthSelectionScalarWhereInput | GroupBookOfMonthSelectionScalarWhereInput[]
    OR?: GroupBookOfMonthSelectionScalarWhereInput[]
    NOT?: GroupBookOfMonthSelectionScalarWhereInput | GroupBookOfMonthSelectionScalarWhereInput[]
    id?: StringFilter<"GroupBookOfMonthSelection"> | string
    groupId?: StringFilter<"GroupBookOfMonthSelection"> | string
    bookId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setByUserId?: StringFilter<"GroupBookOfMonthSelection"> | string
    setAt?: DateTimeFilter<"GroupBookOfMonthSelection"> | Date | string
  }

  export type GroupCreateWithoutMembershipsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    requests?: JoinRequestCreateNestedManyWithoutGroupInput
    invites?: GroupInviteCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionCreateNestedManyWithoutGroupInput
  }

  export type GroupUncheckedCreateWithoutMembershipsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    requests?: JoinRequestUncheckedCreateNestedManyWithoutGroupInput
    invites?: GroupInviteUncheckedCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type GroupCreateOrConnectWithoutMembershipsInput = {
    where: GroupWhereUniqueInput
    create: XOR<GroupCreateWithoutMembershipsInput, GroupUncheckedCreateWithoutMembershipsInput>
  }

  export type GroupUpsertWithoutMembershipsInput = {
    update: XOR<GroupUpdateWithoutMembershipsInput, GroupUncheckedUpdateWithoutMembershipsInput>
    create: XOR<GroupCreateWithoutMembershipsInput, GroupUncheckedCreateWithoutMembershipsInput>
    where?: GroupWhereInput
  }

  export type GroupUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: GroupWhereInput
    data: XOR<GroupUpdateWithoutMembershipsInput, GroupUncheckedUpdateWithoutMembershipsInput>
  }

  export type GroupUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: JoinRequestUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUpdateManyWithoutGroupNestedInput
  }

  export type GroupUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: JoinRequestUncheckedUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUncheckedUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type GroupCreateWithoutRequestsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutGroupInput
    invites?: GroupInviteCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionCreateNestedManyWithoutGroupInput
  }

  export type GroupUncheckedCreateWithoutRequestsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutGroupInput
    invites?: GroupInviteUncheckedCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type GroupCreateOrConnectWithoutRequestsInput = {
    where: GroupWhereUniqueInput
    create: XOR<GroupCreateWithoutRequestsInput, GroupUncheckedCreateWithoutRequestsInput>
  }

  export type GroupUpsertWithoutRequestsInput = {
    update: XOR<GroupUpdateWithoutRequestsInput, GroupUncheckedUpdateWithoutRequestsInput>
    create: XOR<GroupCreateWithoutRequestsInput, GroupUncheckedCreateWithoutRequestsInput>
    where?: GroupWhereInput
  }

  export type GroupUpdateToOneWithWhereWithoutRequestsInput = {
    where?: GroupWhereInput
    data: XOR<GroupUpdateWithoutRequestsInput, GroupUncheckedUpdateWithoutRequestsInput>
  }

  export type GroupUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUpdateManyWithoutGroupNestedInput
  }

  export type GroupUncheckedUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUncheckedUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type GroupCreateWithoutInvitesInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutGroupInput
    requests?: JoinRequestCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionCreateNestedManyWithoutGroupInput
  }

  export type GroupUncheckedCreateWithoutInvitesInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutGroupInput
    requests?: JoinRequestUncheckedCreateNestedManyWithoutGroupInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type GroupCreateOrConnectWithoutInvitesInput = {
    where: GroupWhereUniqueInput
    create: XOR<GroupCreateWithoutInvitesInput, GroupUncheckedCreateWithoutInvitesInput>
  }

  export type GroupUpsertWithoutInvitesInput = {
    update: XOR<GroupUpdateWithoutInvitesInput, GroupUncheckedUpdateWithoutInvitesInput>
    create: XOR<GroupCreateWithoutInvitesInput, GroupUncheckedCreateWithoutInvitesInput>
    where?: GroupWhereInput
  }

  export type GroupUpdateToOneWithWhereWithoutInvitesInput = {
    where?: GroupWhereInput
    data: XOR<GroupUpdateWithoutInvitesInput, GroupUncheckedUpdateWithoutInvitesInput>
  }

  export type GroupUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUpdateManyWithoutGroupNestedInput
  }

  export type GroupUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUncheckedUpdateManyWithoutGroupNestedInput
    bookOfMonthSelections?: GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type GroupCreateWithoutBookOfMonthSelectionsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutGroupInput
    requests?: JoinRequestCreateNestedManyWithoutGroupInput
    invites?: GroupInviteCreateNestedManyWithoutGroupInput
  }

  export type GroupUncheckedCreateWithoutBookOfMonthSelectionsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    createdAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutGroupInput
    requests?: JoinRequestUncheckedCreateNestedManyWithoutGroupInput
    invites?: GroupInviteUncheckedCreateNestedManyWithoutGroupInput
  }

  export type GroupCreateOrConnectWithoutBookOfMonthSelectionsInput = {
    where: GroupWhereUniqueInput
    create: XOR<GroupCreateWithoutBookOfMonthSelectionsInput, GroupUncheckedCreateWithoutBookOfMonthSelectionsInput>
  }

  export type GroupUpsertWithoutBookOfMonthSelectionsInput = {
    update: XOR<GroupUpdateWithoutBookOfMonthSelectionsInput, GroupUncheckedUpdateWithoutBookOfMonthSelectionsInput>
    create: XOR<GroupCreateWithoutBookOfMonthSelectionsInput, GroupUncheckedCreateWithoutBookOfMonthSelectionsInput>
    where?: GroupWhereInput
  }

  export type GroupUpdateToOneWithWhereWithoutBookOfMonthSelectionsInput = {
    where?: GroupWhereInput
    data: XOR<GroupUpdateWithoutBookOfMonthSelectionsInput, GroupUncheckedUpdateWithoutBookOfMonthSelectionsInput>
  }

  export type GroupUpdateWithoutBookOfMonthSelectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUpdateManyWithoutGroupNestedInput
  }

  export type GroupUncheckedUpdateWithoutBookOfMonthSelectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutGroupNestedInput
    requests?: JoinRequestUncheckedUpdateManyWithoutGroupNestedInput
    invites?: GroupInviteUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type ClubBookMessageCreateWithoutClubBookInput = {
    id?: string
    userId: string
    text: string
    createdAt?: Date | string
  }

  export type ClubBookMessageUncheckedCreateWithoutClubBookInput = {
    id?: string
    userId: string
    text: string
    createdAt?: Date | string
  }

  export type ClubBookMessageCreateOrConnectWithoutClubBookInput = {
    where: ClubBookMessageWhereUniqueInput
    create: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput>
  }

  export type ClubBookMessageCreateManyClubBookInputEnvelope = {
    data: ClubBookMessageCreateManyClubBookInput | ClubBookMessageCreateManyClubBookInput[]
  }

  export type ClubBookArtifactCreateWithoutClubBookInput = {
    id?: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ClubBookArtifactUncheckedCreateWithoutClubBookInput = {
    id?: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ClubBookArtifactCreateOrConnectWithoutClubBookInput = {
    where: ClubBookArtifactWhereUniqueInput
    create: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput>
  }

  export type ClubBookArtifactCreateManyClubBookInputEnvelope = {
    data: ClubBookArtifactCreateManyClubBookInput | ClubBookArtifactCreateManyClubBookInput[]
  }

  export type ClubBookMessageUpsertWithWhereUniqueWithoutClubBookInput = {
    where: ClubBookMessageWhereUniqueInput
    update: XOR<ClubBookMessageUpdateWithoutClubBookInput, ClubBookMessageUncheckedUpdateWithoutClubBookInput>
    create: XOR<ClubBookMessageCreateWithoutClubBookInput, ClubBookMessageUncheckedCreateWithoutClubBookInput>
  }

  export type ClubBookMessageUpdateWithWhereUniqueWithoutClubBookInput = {
    where: ClubBookMessageWhereUniqueInput
    data: XOR<ClubBookMessageUpdateWithoutClubBookInput, ClubBookMessageUncheckedUpdateWithoutClubBookInput>
  }

  export type ClubBookMessageUpdateManyWithWhereWithoutClubBookInput = {
    where: ClubBookMessageScalarWhereInput
    data: XOR<ClubBookMessageUpdateManyMutationInput, ClubBookMessageUncheckedUpdateManyWithoutClubBookInput>
  }

  export type ClubBookMessageScalarWhereInput = {
    AND?: ClubBookMessageScalarWhereInput | ClubBookMessageScalarWhereInput[]
    OR?: ClubBookMessageScalarWhereInput[]
    NOT?: ClubBookMessageScalarWhereInput | ClubBookMessageScalarWhereInput[]
    id?: StringFilter<"ClubBookMessage"> | string
    clubBookId?: StringFilter<"ClubBookMessage"> | string
    userId?: StringFilter<"ClubBookMessage"> | string
    text?: StringFilter<"ClubBookMessage"> | string
    createdAt?: DateTimeFilter<"ClubBookMessage"> | Date | string
  }

  export type ClubBookArtifactUpsertWithWhereUniqueWithoutClubBookInput = {
    where: ClubBookArtifactWhereUniqueInput
    update: XOR<ClubBookArtifactUpdateWithoutClubBookInput, ClubBookArtifactUncheckedUpdateWithoutClubBookInput>
    create: XOR<ClubBookArtifactCreateWithoutClubBookInput, ClubBookArtifactUncheckedCreateWithoutClubBookInput>
  }

  export type ClubBookArtifactUpdateWithWhereUniqueWithoutClubBookInput = {
    where: ClubBookArtifactWhereUniqueInput
    data: XOR<ClubBookArtifactUpdateWithoutClubBookInput, ClubBookArtifactUncheckedUpdateWithoutClubBookInput>
  }

  export type ClubBookArtifactUpdateManyWithWhereWithoutClubBookInput = {
    where: ClubBookArtifactScalarWhereInput
    data: XOR<ClubBookArtifactUpdateManyMutationInput, ClubBookArtifactUncheckedUpdateManyWithoutClubBookInput>
  }

  export type ClubBookArtifactScalarWhereInput = {
    AND?: ClubBookArtifactScalarWhereInput | ClubBookArtifactScalarWhereInput[]
    OR?: ClubBookArtifactScalarWhereInput[]
    NOT?: ClubBookArtifactScalarWhereInput | ClubBookArtifactScalarWhereInput[]
    id?: StringFilter<"ClubBookArtifact"> | string
    clubBookId?: StringFilter<"ClubBookArtifact"> | string
    uploadedByUserId?: StringFilter<"ClubBookArtifact"> | string
    fileName?: StringFilter<"ClubBookArtifact"> | string
    mimeType?: StringFilter<"ClubBookArtifact"> | string
    size?: IntFilter<"ClubBookArtifact"> | number
    url?: StringFilter<"ClubBookArtifact"> | string
    createdAt?: DateTimeFilter<"ClubBookArtifact"> | Date | string
  }

  export type ClubBookCreateWithoutMessagesInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    artifacts?: ClubBookArtifactCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookUncheckedCreateWithoutMessagesInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    artifacts?: ClubBookArtifactUncheckedCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookCreateOrConnectWithoutMessagesInput = {
    where: ClubBookWhereUniqueInput
    create: XOR<ClubBookCreateWithoutMessagesInput, ClubBookUncheckedCreateWithoutMessagesInput>
  }

  export type ClubBookUpsertWithoutMessagesInput = {
    update: XOR<ClubBookUpdateWithoutMessagesInput, ClubBookUncheckedUpdateWithoutMessagesInput>
    create: XOR<ClubBookCreateWithoutMessagesInput, ClubBookUncheckedCreateWithoutMessagesInput>
    where?: ClubBookWhereInput
  }

  export type ClubBookUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ClubBookWhereInput
    data: XOR<ClubBookUpdateWithoutMessagesInput, ClubBookUncheckedUpdateWithoutMessagesInput>
  }

  export type ClubBookUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    artifacts?: ClubBookArtifactUpdateManyWithoutClubBookNestedInput
  }

  export type ClubBookUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    artifacts?: ClubBookArtifactUncheckedUpdateManyWithoutClubBookNestedInput
  }

  export type ClubBookCreateWithoutArtifactsInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    messages?: ClubBookMessageCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookUncheckedCreateWithoutArtifactsInput = {
    id?: string
    bookId: string
    title: string
    author: string
    colorKey: string
    isActive?: boolean
    createdByUserId: string
    createdAt?: Date | string
    activatedAt?: Date | string | null
    messages?: ClubBookMessageUncheckedCreateNestedManyWithoutClubBookInput
  }

  export type ClubBookCreateOrConnectWithoutArtifactsInput = {
    where: ClubBookWhereUniqueInput
    create: XOR<ClubBookCreateWithoutArtifactsInput, ClubBookUncheckedCreateWithoutArtifactsInput>
  }

  export type ClubBookUpsertWithoutArtifactsInput = {
    update: XOR<ClubBookUpdateWithoutArtifactsInput, ClubBookUncheckedUpdateWithoutArtifactsInput>
    create: XOR<ClubBookCreateWithoutArtifactsInput, ClubBookUncheckedCreateWithoutArtifactsInput>
    where?: ClubBookWhereInput
  }

  export type ClubBookUpdateToOneWithWhereWithoutArtifactsInput = {
    where?: ClubBookWhereInput
    data: XOR<ClubBookUpdateWithoutArtifactsInput, ClubBookUncheckedUpdateWithoutArtifactsInput>
  }

  export type ClubBookUpdateWithoutArtifactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: ClubBookMessageUpdateManyWithoutClubBookNestedInput
  }

  export type ClubBookUncheckedUpdateWithoutArtifactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    colorKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: ClubBookMessageUncheckedUpdateManyWithoutClubBookNestedInput
  }

  export type MembershipCreateManyGroupInput = {
    id?: string
    userId: string
    role: string
  }

  export type JoinRequestCreateManyGroupInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type GroupInviteCreateManyGroupInput = {
    id?: string
    createdByUserId: string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type GroupBookOfMonthSelectionCreateManyGroupInput = {
    id?: string
    bookId: string
    setByUserId: string
    setAt?: Date | string
  }

  export type MembershipUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type MembershipUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type MembershipUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type JoinRequestUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinRequestUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinRequestUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupInviteUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupInviteUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupInviteUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroupBookOfMonthSelectionUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupBookOfMonthSelectionUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupBookOfMonthSelectionUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    setByUserId?: StringFieldUpdateOperationsInput | string
    setAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookMessageCreateManyClubBookInput = {
    id?: string
    userId: string
    text: string
    createdAt?: Date | string
  }

  export type ClubBookArtifactCreateManyClubBookInput = {
    id?: string
    uploadedByUserId: string
    fileName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ClubBookMessageUpdateWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookMessageUncheckedUpdateWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookMessageUncheckedUpdateManyWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactUpdateWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactUncheckedUpdateWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClubBookArtifactUncheckedUpdateManyWithoutClubBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    uploadedByUserId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
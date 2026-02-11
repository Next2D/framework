/**
 * @description コンストラクタ型
 *              Constructor type
 */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

/**
 * @description パッケージリストの型定義
 *              Type definition for package list
 */
export type IPackages = [string, Constructor][];
import type { Constructor, IPackages } from "../../interface/IPackages";

/**
 * @type {Map<string, Constructor>}
 * @protected
 */
export let packages: Map<string, Constructor> = new Map();

/**
 * @param  {IPackages} package_list
 * @return {void}
 * @method
 * @protected
 */
export const $setPackages = (package_list: IPackages): void =>
{
    packages = new Map(package_list);
};
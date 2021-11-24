/**
 * @type {object}
 */
export const Util = {
    /**
     * @return {string}
     * @static
     * @method
     */
    "uniqid": () =>
    {
        const sec = Date.now() * 1000 + Math.random() * 1000;
        const id  = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
        return `${id}-${Math.trunc(Math.random() * 10000)}-${Math.trunc(Math.random() * 10000)}`;
    }
};
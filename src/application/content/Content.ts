/**
 * @description NoCode Toolで作成したアニメーションの動的生成の補完を行うクラス。
 *              A class that completes the dynamic generation of animations created by NoCode Tool.
 *
 * @class
 * @extends {next2d.display.MovieClip}
 */
// @ts-ignore
export class Content extends next2d.display.MovieClip
{

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        // @ts-ignore
        const loaderInfo: Map<string, any> = next2d.fw.loaderInfo;

        // @ts-ignore
        if (loaderInfo.has(this.namespace)) {

            // Set the target LoaderInfo class
            // @ts-ignore
            this._$loaderInfo = loaderInfo.get(this.namespace);

            // Symbol linkage with NoCode Tool
            // @ts-ignore
            this._$sync();

            // Generate the initial children of the container
            // @ts-ignore
            this._$getChildren();

        }

        // initial processing
        this.initialize();
    }

    /**
     * @description constructorが起動した後にコールされます。
     *              Called after the constructor is invoked.
     *
     * @return {void}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize (): void {}
}

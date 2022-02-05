import { MovieClip } from "../model/common/MovieClip";

/**
 * @description NoCode Toolで作成したアニメーションの動的生成の補完を行うクラス。
 *              A class that completes the dynamic generation of animations created by NoCode Tool.
 *
 * @class
 * @extends {MovieClip}
 */
export class Content extends MovieClip
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        const loaderInfo = next2d.fw.loaderInfo;
        if (loaderInfo.has(this.namespace)) {

            // Set the target LoaderInfo class
            this._$loaderInfo = loaderInfo.get(this.namespace);

            // Symbol linkage with NoCode Tool
            this._$sync();

            // Generate the initial children of the container
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
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}
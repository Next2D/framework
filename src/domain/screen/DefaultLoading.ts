/**
 * @class
 */
export class DefaultLoading
{
    private readonly _$elementId: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @private
         */
        this._$elementId = "__next2d__framework_loading";
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    start (): void
    {
        const element: HTMLElement|null = document.getElementById(this._$elementId);
        if (!element) {

            // @ts-ignore
            const root: any = next2d.fw.context.root;

            // @ts-ignore
            const player: any = root.stage.player;

            const parent: HTMLElement|null = document
                .getElementById(player.contentElementId);

            if (!parent) {
                return ;
            }

            const loader: HTMLDivElement = document.createElement("div");

            loader.id = this._$elementId;

            loader.innerHTML = `<div></div><div></div><div></div>
<style>
@keyframes ${this._$elementId} {
  0% {
    transform: scale(1);
    opacity: 1; 
  }
  45% {
    transform: scale(0.1);
    opacity: 0.7; 
  }
  80% {
    transform: scale(1);
    opacity: 1; 
  } 
}
    
#${this._$elementId} > div:nth-child(1) {
  animation: ${this._$elementId} 0.75s -0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#${this._$elementId} > div:nth-child(2) {
  animation: ${this._$elementId} 0.75s -0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#${this._$elementId} > div:nth-child(3) {
  animation: ${this._$elementId} 0.75s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#${this._$elementId} {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px 0 0 -30px;
  width: 60px;
  height: 20px;
  z-index: 9999;
  opacity: 0.5;
  pointer-events: none;
}

#${this._$elementId} > div {
  background-color: #fff;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  animation-fill-mode: both;
  display: inline-block; 
}
</style>`;

            parent.insertBefore(loader, parent.children[0]);

        } else {

            element.setAttribute("style", "");

        }

    }

    /**
     * @return {void}
     * @method
     * @public
     */
    end (): void
    {
        const element: HTMLElement|null = document
            .getElementById(this._$elementId);

        if (element) {
            element.setAttribute("style", "display:none;");
        }
    }
}

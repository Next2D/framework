import { Config } from "../../Config";

/**
 * @class
 * @extends {next2d.fw.Model}
 */
export class Loading extends next2d.fw.Model
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }

    /**
     * @return {void}
     * @public
     */
    start ()
    {
        const elementId = `${Config.$PREFIX}_loading`;

        const element = document.getElementById(elementId);
        if (!element) {

            const root   = this.context.root;
            const player = root.stage.player;
            const parent = document.getElementById(player.contentElementId);

            const loader = document.createElement("div");

            loader.id = elementId;

            loader.innerHTML = `<div></div><div></div><div></div><style>
@keyframes __next2d__framework_loading {
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
    
#__next2d__framework_loading > div:nth-child(1) {
  animation: __next2d__framework_loading 0.75s -0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading > div:nth-child(2) {
  animation: __next2d__framework_loading 0.75s -0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading > div:nth-child(3) {
  animation: __next2d__framework_loading 0.75s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -24px 0 0 -24px;
  width: 57px;
  height: 19px;
  z-index: 9999;
  opacity: 0.5;
  pointer-events: none;
}

#__next2d__framework_loading > div {
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

            element.style.display = "";

        }

    }

    /**
     * @return {void}
     * @public
     */
    end ()
    {
        const element = document
            .getElementById(`${Config.$PREFIX}_loading`);

        if (element) {
            element.style.display = "none";
        }
    }
}
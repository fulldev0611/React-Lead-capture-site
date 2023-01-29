import logo from '../assets/images/logo.svg'
import React, { useEffect } from "react";

export const StartButton = (): JSX.Element => {

    var currentToolbarPositionX: number;
    /**
     * The handler remove mousemove and mouseup handlers
     * @param evt 
     */
    const mouseUpHandler = (evt: MouseEvent) => {
        var toolbar = document.getElementById("toolbar");
        if(toolbar) {
            toolbar.removeEventListener('mousemove', mouseMoveHandler);
            toolbar.removeEventListener('mousedown', mouseUpHandler);
        }
    }

    /**
     * The handler will change the position of the toolbar along the horizontal axis
     * @param evt 
     */
    const mouseMoveHandler = (evt: MouseEvent) => {
        var toolbar = document.getElementById("toolbar");
        if(toolbar) {
            // 1. Prevent default to stop editor selecting text
            evt.preventDefault();
            // calculate the new cursor position:
            var newToolbarPositionX = currentToolbarPositionX - evt.clientX;
            currentToolbarPositionX = evt.clientX;

            // set the toolbar's new position:
            toolbar.style.left = (toolbar.offsetLeft - newToolbarPositionX) + "px";
        }
    }

   
    const mouseDownHandler = (evt: MouseEvent) => {
        // 1. Populate pointer at the toolbar 
        var toolbar = document.getElementById("toolbar");
        if(toolbar) {
            // 2. Store current x position.
            currentToolbarPositionX = evt.clientX;
            // 2. Attach the mousemove and mouseup handlers
            toolbar.addEventListener('mousemove', mouseMoveHandler);
            toolbar.addEventListener('mouseup', mouseUpHandler);
        }
    }

    useEffect(() => {
        var toolbar = document.getElementById("toolbar");
        if(toolbar) {
            toolbar.addEventListener('mousedown', mouseDownHandler);
        }
        // Remove event listeners on cleanup
        return () => {
            var toolbar = document.getElementById("toolbar");
            document.removeEventListener('mousedown', mouseDownHandler);
            if(toolbar) {
                toolbar.removeEventListener('mousemove', mouseMoveHandler);
                toolbar.removeEventListener('mousedown', mouseUpHandler);
            }
        };
    }, []);

    return (
          <img className="toolbar_logo" src={logo}/>
    );
}


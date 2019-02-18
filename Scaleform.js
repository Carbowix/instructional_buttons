class BasicScaleform {
    constructor(scaleformName) {
        this.handle = mp.game.graphics.requestScaleformMovie(scaleformName);
        while (!mp.game.graphics.hasScaleformMovieLoaded(this.handle)) mp.game.wait(0);
    }

    // thanks kemperrr

    callFunction(functionName, ...args) {
        mp.game.graphics.pushScaleformMovieFunction(this.handle, functionName);
        args.forEach(arg => {
            switch (typeof arg) {
                case "string":
                    {
                            mp.game.graphics.pushScaleformMovieFunctionParameterString(arg);
                        break;
                    }

                case "boolean":
                    {
                        mp.game.graphics.pushScaleformMovieFunctionParameterBool(arg);
                        break;
                    }

                case "number":
                    {
                        if (Number(arg) === arg && arg % 1 !== 0) {
                            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(arg);
                        } else {
                            mp.game.graphics.pushScaleformMovieFunctionParameterInt(arg);
                        }
                    }
            }
        });

        mp.game.graphics.popScaleformMovieFunctionVoid();
    }

    drawScaleform(x, y, width, height, red, green, blue, alpha, p9) {
        mp.game.graphics.drawScaleformMovie(this.handle, x, y, width, height, red, green, blue, alpha, p9);
    }

    renderFullscreen() {
        mp.game.graphics.drawScaleformMovieFullscreen(this.handle, 255, 255, 255, 255, false);
    }

    dispose() {
        mp.game.graphics.setScaleformMovieAsNoLongerNeeded(this.handle);
    }
}

exports = BasicScaleform;
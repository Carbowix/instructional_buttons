const scaleform = require('./instructional_buttons/Scaleform');
const validStyles = [-1, 1];

class hudManager {
    constructor(style, bgColor) { // bgColor accepts HEX and RGBA
        this.style = null;
        this.counter = 0;
        this.hud = new scaleform('instructional_buttons');
        this.render = null;
        this.buttons = {};
        this.availableSlots = [];
        if (style) this.changeStyle(style);
        if (bgColor) this.setBackgroundColor(bgColor);
        this.resetBar();
    }

    changeStyle(style) {
        if (!validStyles.includes(style)) return mp.gui.chat.push('!{red}[ERROR] !{white}Invalid style. Please use styles (-1 or 1).');
        if (this.style === style) return mp.gui.chat.push('!{red}[ERROR] !{white}You\'re already using that style.');
        this.style = style;
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    changeButtonTitle (index, title) {
        switch (typeof index) {
            case 'string':
                {
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].title === index || this.buttons[button].control === index) {
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), this.buttons[button].control, title);
                        }
                    });
                    break;
                }
            case 'number':
                {
                    index = getControl(index);
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].control === index) {
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), this.buttons[button].control, title);
                        }
                    });
                }
        }

        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    changeButtonControl (index, control) {
        switch (typeof index) {
            case 'string':
                {
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].title === index || this.buttons[button].control === index) {
                            index = getControl(control);
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), index, this.buttons[button].title);
                        }
                    });
                    break;
                }
            case 'number':
                {
                    index = getControl(index);
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].control === index) {
                            control = getControl(control);
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), control, this.buttons[button].title);
                        }
                    });
                }
        }
        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    setBackgroundColor(bgColor) {
        if (bgColor) {
            if (Array.isArray(bgColor)) {
                this.hud.callFunction("SET_BACKGROUND_COLOUR", bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
            } else if (bgColor.match(/#[0-9A-Fa-f]{6}/)) {
                let color = hexToRGB(bgColor.replace('#', ''));
                this.hud.callFunction("SET_BACKGROUND_COLOUR", color[0], color[1], color[2], 180);
            } else {
                mp.gui.chat.push('!{orange}[WARNING] !{white}Invalid color given. Make sure it suits as specified in resource\'s description');
            }
        }
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    addButton(title, controlID) {
        let slot, cnt;
        if (this.availableSlots.length > 0) {
            slot = this.availableSlots[0];
            let index = this.availableSlots.indexOf(slot);
            if (index > -1) {
                this.availableSlots.splice(index, 1);
            }
        } else {
            slot = this.counter++;
        };

        if (controlID) cnt = verifyControl(controlID);

        this.hud.callFunction("SET_DATA_SLOT", slot, cnt, title);
        this.buttons[slot] = {
            title: title ? title : "",
            control: cnt ? cnt : ""
        };
        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    };

    addButtons(buttons) {
        if (typeof buttons === 'object') {
            Object.keys(buttons).forEach(btn => {
                let title = btn,
                    cnt, slot = this.availableSlots.length > 0 ? this.availableSlots[0] : this.counter++;
                if (buttons[btn]) cnt = verifyControl(buttons[btn]);

                this.hud.callFunction("SET_DATA_SLOT", slot, cnt, title);
                this.buttons[slot] = {
                    title: title ? title : "",
                    control: cnt ? cnt : ""
                };

                let index = this.availableSlots.indexOf(slot);
                if (index > -1) {
                    this.availableSlots.splice(index, 1);
                }
            });

            if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
        } else {
            return mp.gui.chat.push('!{red}[ERROR] !{white}Invalid arguement form, please use object form that is instructed on the resource\'s description.');
        }
    }

    removeButton(btn) {
        switch (typeof btn) {
            case 'string':
                {
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].title === btn) {
                            this.availableSlots.push(button);
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), "", "");
                            delete this.buttons[button];
                        }
                    });
                    break;
                }
            case 'number':
                {
                    Object.keys(this.buttons).forEach(button => {
                        if (this.buttons[button].control === btn) {
                            this.availableSlots.push(button);
                            this.hud.callFunction("SET_DATA_SLOT", parseInt(button), "", "");
                            delete this.buttons[button];
                        }
                    });
                }
        }
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    removeButtons() {
        this.counter = 0;
        this.buttons = {};
        this.resetBar();
    }

    toggleHud(state) {
        if (state) {
            this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
            if (this.render === null) {
                this.render = new mp.Event('render', () => {
                    this.hud.renderFullscreen();
                });
            } else {
                this.render.enable();
            }
        } else {
            if (this.render !== null) this.render.destroy();
            else return false
        }
    }

    resetBar () {
        this.hud.callFunction("CLEAR_ALL");
        this.hud.callFunction("TOGGLE_MOUSE_BUTTONS", 0);
        this.hud.callFunction("CREATE_CONTAINER");
        this.hud.callFunction("SET_CLEAR_SPACE", 100);
    }
};

function verifyControl (btn) {
    let control;
    switch (typeof btn) {
        case 'number': {
            control = getControl(btn);
            break;
        }

        case 'string': {
            if (btn.length > 1) {
                control = `t_${btn.toString()}`;
            }
        };
    }
    mp.gui.chat.push(`Verifying: ${control}`)
    return control;
}

function getControl (id) {
    if (id > -1 && id < 357) {
        return mp.game.controls.getControlActionName(2, id, true);
    } else {
        mp.gui.chat.push('!{orange}[WARNING] !{white}Invalid controlID, make sure its between (0, 356).');
        return false;
    }
}

function hexToRGB(hex) { // Thanks to root and lovely stackoverflow
    let bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

exports = hudManager;
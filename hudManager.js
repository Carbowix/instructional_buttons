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

        if (controlID > -1 && controlID < 357) {
            cnt = mp.game.controls.getControlActionName(2, controlID, true);
            this.hud.callFunction("SET_DATA_SLOT", slot, cnt, title);
        } else {
            mp.gui.chat.push('!{orange}[WARNING] !{white}Invalid controlID, make sure its between (0, 356).');
            this.hud.callFunction("SET_DATA_SLOT", slot, "", title);
        }
        this.buttons[slot] = {
            title: title ? title : "",
            control: cnt ? cnt : ""
        };

        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    };

    addButtons(buttons) {
        if (typeof buttons === 'object') {
            Object.keys(buttons).forEach(btn => {
                let title = btn,
                    cnt, slot;
                if (this.availableSlots.length > 0) {
                    slot = this.availableSlots[0];
                } else {
                    slot = this.counter++;
                };
                if (buttons[btn])
                    cnt = mp.game.controls.getControlActionName(2, buttons[btn], true);
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
            this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
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

function hexToRGB(hex) { // Thanks to root and lovely stackoverflow
    let bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

exports = hudManager;
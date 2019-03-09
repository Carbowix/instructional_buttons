# instructional_buttons
Instructional buttons manager for ragemp

# API

* Initalizing the hud class 

```js
let hudClassInstance = new hud(style, color)
/*
 * style: -1 for horizontal view, 1 for vertical view
 * color: HEX or RGBA [255, 255, 255, 255]
*/
```

* Hud functions

```js
hudClassInstance.addButton(title, controlID);
/*
 * title: any text
 * controlID: you can find a list of controlID on wiki
*/

hudClassInstance.addButtons({
	anyName: controlID1,
  	anyName2: controlID2
});

/*
 * Bulk support for adding buttons
*/

hudClassInstance.removeButton(titleOrControlID);

/*
 * titleOrControlID: remove button by its title or controlID
*/

hudClassInstance.removeButton(titleOrControlID);

/*
 * removes all buttons
*/

hudClassInstance.toggleHud(state);
/*
 * state: Boolean toggling visibility
*/

hudClassInstance.changeStyle(style);
/*
 * style: -1 for horizontal and 1 for vertical
*/

hudClassInstance.setBackgroundColor(color);
/*
 * color: HEX string or RGBA Array
*/

hudClassInstance.changeButtonTitle(index, newTitle);
/*
 * index: controlID or currentButton title. (if custom button you can type its name t_buttonName)
 * newTitle: string
*/

hudClassInstance.changeButtonControl(index, newControl);
/*
 * index: controlID or currentButton title. (if custom button you can type its name t_buttonName)
 * newControl: controlID or custom control (t_buttonName)
*/
```

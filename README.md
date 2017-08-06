# Drag iframe element out onto parent
<i>This jQuery plugin can help you to easily drag element from an iframe to parent html document</i>

<b>How initialize plugin</b><br>
```
$('#iframe').dragOutFromIframe({
            target:'.image'
 });
```
<b>Settings</b><br>
```target:``` target inside iframe to drag <br>
```document:```, element to append cloned target default value is $('body')<br>
```draggable:```, jQuery draggable options

<b> Default values </b>
```
document:$('body'), //element to append cloned target
target:'', //target inside iframe to drag
draggable: {
   cancel: "a.ui-icon", // clicking an icon won't initiate dragging
   containment: "document",
   cursor: "move",
   helper: "clone",
   iframeFix: true,
   revert: true,
   cursorAt: {top: 122 / 2, left: 122 / 2},
   drag: function (e, ui) {
         ui.helper.show();
   },
   stop: function(){
         settings.clone.remove();
   }
}
 ```

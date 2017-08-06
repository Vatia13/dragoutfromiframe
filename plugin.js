$.fn.dragOutFromIframe = function(options){

	var settings = $.extend({
		document:$('body'), //element to append cloned target
		target:'', //target inside iframe to drag
		clone:'', //cloned target in main document
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
	},options);

    // Then bind listeners for events, and trigger them on parent document

    $(this)[0].onload = function(e){
        var clicked = false;

        var innerDoc = e.target.contentDocument || e.target.contentWindow.document;

        $(innerDoc).on({
            mousemove: function(e){
                $(document).trigger(e);
            },
            mousedown: function (e) {
                $(document).trigger(e);
            },
            mouseup: function (e) {
                $(document).trigger(e);
            }
		});

        $(innerDoc).find(settings.target).on('mouseup',function(){
            $(this).removeClass('mouse-down');
        });

        /**
		 * Cloning target element on mousedown event
         */

        $(innerDoc).find(settings.target).on('mousedown',function(e){
            settings.target = $(this);
        	if(!clicked){
                e.preventDefault();
                e.stopPropagation();

                clicked = true;

                settings.target.addClass('mouse-down');

                if ($(e.target).data('drag')){
                    clicked = false;
                    return false;
                }

                settings.clone = settings.target.clone();
                settings.document.prepend(settings.clone);
                settings.clone.hide();
                settings.clone.draggable(settings.draggable);

                setTimeout(function () {
                    if(settings.target.hasClass('mouse-down')){
                        settings.clone.simulate('mousedown');
                    }
                    clicked = false;
                }, 100);
                return false;
            }
        });
    }
};
/*!
 * Author: Vati Child
 * Date: 6 august, 2017
 * E-mail: vatia0@gmail.com
 */

$.ui.draggable.prototype._generatePosition = function( event, constrainPosition ) {
    var containment, co, top, left,
        o = this.options,
        scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
        pageX = event.pageX,
        pageY = event.pageY;

    // Cache the scroll
    if ( !scrollIsRootNode || !this.offset.scroll ) {
        this.offset.scroll = {
            top: this.scrollParent.scrollTop(),
            left: this.scrollParent.scrollLeft()
        };
    }

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    // If we are not dragging yet, we won't check for options
    if ( constrainPosition ) {
        if ( this.containment ) {
            if ( this.relativeContainer ) {
                co = this.relativeContainer.offset();
                containment = [
                    this.containment[ 0 ] + co.left,
                    this.containment[ 1 ] + co.top,
                    this.containment[ 2 ] + co.left,
                    this.containment[ 3 ] + co.top
                ];
            } else {
                containment = this.containment;
            }

            if ( event.pageX - this.offset.click.left < containment[ 0 ] ) {
                pageX = containment[ 0 ] + this.offset.click.left;
            }
            if ( event.pageY - this.offset.click.top < containment[ 1 ] ) {
                pageY = containment[ 1 ] + this.offset.click.top;
            }
            if ( event.pageX - this.offset.click.left > containment[ 2 ] ) {
                pageX = containment[ 2 ] + this.offset.click.left;
            }
            if ( event.pageY - this.offset.click.top > containment[ 3 ] ) {
                pageY = containment[ 3 ] + this.offset.click.top;
            }
        }

        if ( o.grid ) {

            //Check for grid elements set to 0 to prevent divide by 0 error causing invalid
            // argument errors in IE (see ticket #6950)
            top = o.grid[ 1 ] ? this.originalPageY + Math.round( ( pageY -
                    this.originalPageY ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalPageY;
            pageY = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
            top - this.offset.click.top > containment[ 3 ] ) ?
                top :
                ( ( top - this.offset.click.top >= containment[ 1 ] ) ?
                    top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

            left = o.grid[ 0 ] ? this.originalPageX +
                Math.round( ( pageX - this.originalPageX ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
                this.originalPageX;
            pageX = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
            left - this.offset.click.left > containment[ 2 ] ) ?
                left :
                ( ( left - this.offset.click.left >= containment[ 0 ] ) ?
                    left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
        }

        if ( o.axis === "y" ) {
            pageX = this.originalPageX;
        }

        if ( o.axis === "x" ) {
            pageY = this.originalPageY;
        }
    }



    var positionTop =     (        // The absolute mouse position
        pageY -

        // Click offset (relative to the element)
        this.offset.click.top -

        // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.top -

        // The offsetParent's offset without borders (offset + border)
        this.offset.parent.top +
        ( this.cssPosition === "fixed" ?
            -this.offset.scroll.top :
            ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ));
    var positionLeft =   (
        // The absolute mouse position
        pageX -

        // Click offset (relative to the element)
        this.offset.click.left -

        // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.left -

        // The offsetParent's offset without borders (offset + border)
        this.offset.parent.left +
        ( this.cssPosition === "fixed" ?
            -this.offset.scroll.left :
            ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ));

    if(o.iframeFix){
        positionLeft = event.pageX + o.iframe.offset().left - 15;
        positionTop = event.pageY + o.iframe.offset().top - 15;
    }

    return {
        top: positionTop,
        left: positionLeft
    };
};

    $.fn.dragOutFromIframe = function(options){

	var settings = $.extend({
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
	},options);


    $(this)[0].onload = function(e){

        var _this = $(this);

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


                settings.draggable.iframe = _this;
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
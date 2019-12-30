Ext.define('vyl.ux.timeline.js.Timeline', {
    extend: 'Ext.Component',
    alias: 'widget.uxTimeline',
    xtype: 'uxtimeline',

    divId: '',
    data: [{}],
    eventsMinDistance: 60,
    eventsMaxDistance: 200,
    translate: 0,
    lineLength: 0,   

    listeners: {
        render: {
            fn: function(cmp, eOpts) {
				window.HorizontalTimeline = this.HorizontalTimeline;

				var horizontalTimeline = document.getElementsByClassName('js-cd-h-timeline'),
					horizontalTimelineTimelineArray = [];
				
				if(horizontalTimeline.length > 0) {
					for(var i = 0; i < horizontalTimeline.length; i++) {
						horizontalTimelineTimelineArray.push(new HorizontalTimeline(horizontalTimeline[i])); 
					}
					// navigate the timeline when inside the viewport using the keyboard
					document.addEventListener('keydown', function(event){
						if( (event.keyCode && event.keyCode == 39) || ( event.key && event.key.toLowerCase() == 'arrowright') ) {
							me.updateHorizontalTimeline('next'); // move to next event
						} else if((event.keyCode && event.keyCode == 37) || ( event.key && event.key.toLowerCase() == 'arrowleft')) {
							me.updateHorizontalTimeline('prev'); // move to prev event
						}
					});
				};
            }
        }
    },

	HorizontalTimeline: function(element) {
		var me = this;

		me.initTimeline = function(timeline) {
			// set dates left position
			var me = this,
				left = 0;
			
			for (var i = 0; i < timeline.dateValues.length; i++) { 
				var j = (i == 0) ? 0 : i - 1;
				var distance = me.daydiff(timeline.dateValues[j], timeline.dateValues[i]),
					distanceNorm = (Math.round(distance/timeline.minLapse) + 2)*timeline.eventsMinDistance;
	
				if(distanceNorm < timeline.eventsMinDistance) {
					distanceNorm = timeline.eventsMinDistance;
				} else if(distanceNorm > timeline.eventsMaxDistance) {
					distanceNorm = timeline.eventsMaxDistance;
				}
				left = left + distanceNorm;
				timeline.date[i].setAttribute('style', 'left:' + left+'px');
			}
			
			// set line/filling line dimensions
			timeline.line.style.width = (left + timeline.eventsMinDistance)+'px';
			timeline.lineLength = left + timeline.eventsMinDistance;
			// reveal timeline
			Util.addClass(timeline.element, 'cd-h-timeline--loaded');
			me.selectNewDate(timeline, timeline.selectedDate);
			me.resetTimelinePosition(timeline, 'next');
		}
		
		me.updateFilling = function(timeline) { // update fillingLine scale value
			var dateStyle = window.getComputedStyle(timeline.selectedDate, null),
				left = dateStyle.getPropertyValue("left"),
				width = dateStyle.getPropertyValue("width");
			
			left = Number(left.replace('px', '')) + Number(width.replace('px', ''))/2;
			timeline.fillingLine.style.transform = 'scaleX('+(left/timeline.lineLength)+')';
		}
	
		me.translateTimeline = function(timeline, direction) { // translate timeline (and date elements)
			var containerWidth = timeline.datesContainer.offsetWidth;
			if(direction) {
				timeline.translate = (direction == 'next') ? timeline.translate - containerWidth + timeline.eventsMinDistance : timeline.translate + containerWidth - timeline.eventsMinDistance;
			}
			if( 0 - timeline.translate > timeline.lineLength - containerWidth ) timeline.translate = containerWidth - timeline.lineLength;
			if( timeline.translate > 0 ) timeline.translate = 0;
	
			timeline.line.style.transform = 'translateX('+timeline.translate+'px)';
			// update the navigation items status (toggle inactive class)
			(timeline.translate == 0 ) ? Util.addClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive') : Util.removeClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive');
			(timeline.translate == containerWidth - timeline.lineLength ) ? Util.addClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive') : Util.removeClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive');
		}
	
		me.selectNewDate = function(timeline, target) { // ned date has been selected -> update timeline
			var me = this;
	
			timeline.newDateIndex = Util.getIndexInArray(timeline.date, target);
			timeline.oldDateIndex = Util.getIndexInArray(timeline.date, timeline.selectedDate);
			Util.removeClass(timeline.selectedDate, 'cd-h-timeline__date--selected');
			Util.addClass(timeline.date[timeline.newDateIndex], 'cd-h-timeline__date--selected');
			timeline.selectedDate = timeline.date[timeline.newDateIndex];
			me.updateOlderEvents(timeline);
			// me.updateVisibleContent(timeline);
			me.updateFilling(timeline);
		}
	
		me.updateOlderEvents = function(timeline) { // update older events style
			for(var i = 0; i < timeline.date.length; i++) {
				(i < timeline.newDateIndex) ? Util.addClass(timeline.date[i], 'cd-h-timeline__date--older-event') : Util.removeClass(timeline.date[i], 'cd-h-timeline__date--older-event');
			}
		}
	
		me.updateVisibleContent = function(timeline) { // show content of new selected date
			if (timeline.newDateIndex > timeline.oldDateIndex) {
				var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-right',
					classLeaving = 'cd-h-timeline__event--leave-left';
			} else if(timeline.newDateIndex < timeline.oldDateIndex) {
				var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-left',
					classLeaving = 'cd-h-timeline__event--leave-right';
			} else {
				var classEntering = 'cd-h-timeline__event--selected',
					classLeaving = '';
			}
	
			Util.addClass(timeline.content[timeline.newDateIndex], classEntering);
			if (timeline.newDateIndex != timeline.oldDateIndex) {
				Util.removeClass(timeline.content[timeline.oldDateIndex], 'cd-h-timeline__event--selected');
				Util.addClass(timeline.content[timeline.oldDateIndex], classLeaving);
				timeline.contentWrapper.style.height = timeline.content[timeline.newDateIndex].offsetHeight + 'px';
			}
		}
	
		me.resetAnimation = function(timeline) { // reset content classes when entering animation is over
			timeline.contentWrapper.style.height = null;
			// Util.removeClass(timeline.content[timeline.newDateIndex], 'cd-h-timeline__event--enter-right cd-h-timeline__event--enter-left');
			// Util.removeClass(timeline.content[timeline.oldDateIndex], 'cd-h-timeline__event--leave-right cd-h-timeline__event--leave-left');
		}
	
		me.keyNavigateTimeline = function(timeline, direction) { // navigate the timeline using the keyboard
			var me = this,
				newIndex = (direction == 'next') ? timeline.newDateIndex + 1 : timeline.newDateIndex - 1;
			if(newIndex < 0 || newIndex >= timeline.date.length) return;
			me.selectNewDate(timeline, timeline.date[newIndex]);
			me.resetTimelinePosition(timeline, direction);
		}
	
		me.resetTimelinePosition = function(timeline, direction) { //translate timeline according to new selected event position
			var me = this,
				eventStyle = window.getComputedStyle(timeline.selectedDate, null),
				eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', '')),
				timelineWidth = timeline.datesContainer.offsetWidth;
	
			if ((direction == 'next' && eventLeft >= timelineWidth - timeline.translate) || (direction == 'prev' && eventLeft <= - timeline.translate) ) {
				timeline.translate = timelineWidth/2 - eventLeft;
				me.translateTimeline(timeline, false);
			}
		}
	
		me.parseDate = function(timeline) { // get timestamp value for each date      
			var me = this,
				dateArrays = [];
				
			// if (me.data) {
			// 	me.data.forEach(function(reg){
			// 		if (reg.FECHA) {
			// 			dateArrays.push(reg.FECHA);
			// 		}
			// 	});
			// }
	
			for(var i = 0; i < timeline.date.length; i++) {
				var singleDate = timeline.date[i].getAttribute('data-date'),
					dateComp = singleDate.split('T');
				
				if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
					var dayComp = dateComp[0].split('/'),
						timeComp = dateComp[1].split(':');
				} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
					var dayComp = ["2000", "0", "0"],
						timeComp = dateComp[0].split(':');
				} else { //only DD/MM/YEAR
					var dayComp = dateComp[0].split('/'),
						timeComp = ["0", "0"];
				}
				var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
				dateArrays.push(newDate);
			}
			return dateArrays;
		}
	
		me.calcMinLapse = function(timeline) { // determine the minimum distance among events
			var me = this,
				dateDistances = [];
	
			for(var i = 1; i < timeline.dateValues.length; i++) { 
				var distance = me.daydiff(timeline.dateValues[i-1], timeline.dateValues[i]);
				if(distance > 0) dateDistances.push(distance);
			}
	
			return (dateDistances.length > 0 ) ? Math.min.apply(null, dateDistances) : 86400000;
		}
	
		me.daydiff = function(first, second) { // time distance between events
			return Math.round((second-first));
		}
	
		me.updateHorizontalTimeline = function(direction) {
			var me = this;
	
			for(var i = 0; i < horizontalTimelineTimelineArray.length; i++) {
				if(me.elementInViewport(horizontalTimeline[i])) me.keyNavigateTimeline(horizontalTimelineTimelineArray[i], direction);
			}
		}
		
		me.elementInViewport = function(el) {
			// How to tell if a DOM element is visible in the current viewport?
			// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;
	
			while(el.offsetParent) {
				el = el.offsetParent;
				top += el.offsetTop;
				left += el.offsetLeft;
			}
	
			return (
				top < (window.pageYOffset + window.innerHeight) &&
				left < (window.pageXOffset + window.innerWidth) &&
				(top + height) > window.pageYOffset &&
				(left + width) > window.pageXOffset
			);
		}

		if (element) {
			me.element = element;
			me.datesContainer = element.getElementsByClassName('cd-h-timeline__dates')[0];
			me.line = me.datesContainer.getElementsByClassName('cd-h-timeline__line')[0]; // grey line in the top timeline section
			me.fillingLine = me.datesContainer.getElementsByClassName('cd-h-timeline__filling-line')[0]; // green filling line in the top timeline section  
			me.date = me.line.getElementsByClassName('cd-h-timeline__date');
			me.selectedDate = me.line.getElementsByClassName('cd-h-timeline__date--selected')[0];
			me.dateValues = me.parseDate(this);
			me.minLapse = me.calcMinLapse(this);
			me.navigation = element.getElementsByClassName('cd-h-timeline__navigation');
			// me.contentWrapper = element.getElementsByClassName('cd-h-timeline__events')[0];
			// me.content = me.contentWrapper.getElementsByClassName('cd-h-timeline__event');

			// store index of selected and previous selected dates
			me.oldDateIndex = Util.getIndexInArray(me.date, me.selectedDate);
			me.newDateIndex = me.oldDateIndex;

			me.initTimeline(this);
		} else {
			console.error('[HorizontalTimeline] No se encontro el html div id='+ me.divId, this);
		}
	},

    initComponent: function() {
        var me = this,
            tagListItems = '';

        me.callParent(arguments);

        if (me.divId) {
			// if (me.data) {
			// 	me.data.forEach(function(reg, idx){
			// 		if (idx == data.lenght - 1) {
			// 			// Marca como seleccionado el ultimo de manera de ir del ultimo al primero
			// 			tagListItems += '<li><a href="#0" data-date="' + reg.FECHA + '" class="cd-h-timeline__date cd-h-timeline__date--selected">' + reg.FECHA_DESC + '</a></li>';
			// 		} else {
			// 			tagListItems += '<li><a href="#0" data-date="' + reg.FECHA + '" class="cd-h-timeline__date">' + reg.FECHA_DESC + '</a></li>';
			// 		}
			// 	});
			// }

            me.setHtml(
				'<section class="cd-h-timeline js-cd-h-timeline margin-bottom-md">' +
					'<div id="' + me.divId + '" class="cd-h-timeline__container container">' +
						'<div class="cd-h-timeline__dates">' + 
							'<div class="cd-h-timeline__line">' +
								'<ol>' + //tagListItems + 
									'<li><a href="#0" data-date="16/01/2014" class="cd-h-timeline__date cd-h-timeline__date--selected">16 Jan</a></li>' +
									'<li><a href="#0" data-date="28/02/2014" class="cd-h-timeline__date">28 Feb</a></li>' +
									'<li><a href="#0" data-date="20/04/2014" class="cd-h-timeline__date">20 Mar</a></li>' +
									'<li><a href="#0" data-date="20/05/2014" class="cd-h-timeline__date">20 May</a></li>' +
									'<li><a href="#0" data-date="09/07/2014" class="cd-h-timeline__date">09 Jul</a></li>' +
									'<li><a href="#0" data-date="30/08/2014" class="cd-h-timeline__date">30 Aug</a></li>' +
									'<li><a href="#0" data-date="15/09/2014" class="cd-h-timeline__date">15 Sep</a></li>' +
									'<li><a href="#0" data-date="01/11/2014" class="cd-h-timeline__date">01 Nov</a></li>' +
									'<li><a href="#0" data-date="10/12/2014" class="cd-h-timeline__date">10 Dec</a></li>' +
									'<li><a href="#0" data-date="19/01/2015" class="cd-h-timeline__date">29 Jan</a></li>' +
									'<li><a href="#0" data-date="03/03/2015" class="cd-h-timeline__date">3 Mar</a></li>' +
								'</ol>' +
								
								'<span class="cd-h-timeline__filling-line" aria-hidden="true"></span>' +
							'</div>' + 
						'</div>' + 
					
						'<ul>' + 
							'<li><a href="#0" class="text-replace cd-h-timeline__navigation cd-h-timeline__navigation--prev cd-h-timeline__navigation--inactive">Prev</a></li>' + 
							'<li><a href="#0" class="text-replace cd-h-timeline__navigation cd-h-timeline__navigation--next">Next</a></li>' + 
						'</ul>' +
					'</div>' +
				'</section>'
			);
        } else {
            console.error('[initComponent] No se puede crear el objeto sin divId');    
        }
    }
});
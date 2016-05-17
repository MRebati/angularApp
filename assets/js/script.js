$(document).ready(function() {
  'use strict';
  $('.button-collapse').sideNav();
  $('.slider>div').owlCarousel({
    loop: true,
    margin: 0,
    rtl: true,
    dot: true,
    items:1,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true
  });

  $('.owl-stage-outer').addClass('z-depth-1');

});

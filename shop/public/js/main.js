$(document).ready(function() {
    // Toggle sidebar on click of the menu icon
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });
    // Optionally close sidebar if clicked outside
    $('.js-hide-sidebar').on('click', function() {
        $('.js-sidebar').removeClass('active');
        $('.js-sidebar-content').removeClass('active');
    });

    $('#fashionTabs a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
});

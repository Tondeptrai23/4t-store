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

    // Activate the default tab
    $('#fashionTabs a[href="#men"]').tab('show');
    $('#fashionTabs a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.menu-list li').on('click', function() {
        alert('You clicked: ' + $(this).text());
        // replace this with actual navigation logic
    });

    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });
});

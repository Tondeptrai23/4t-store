$(document).ready(function () {
    // Toggle sidebar on click of the menu icon
    $('.js-show-sidebar').on('click', function () {
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click', function () {
        $('.js-sidebar').removeClass('show-sidebar');
    });
    // Optionally close sidebar if clicked outside
    $('.js-hide-sidebar').on('click', function () {
        $('.js-sidebar').removeClass('active');
        $('.js-sidebar-content').removeClass('active');
    });

    // Activate the default tab
    $('#fashionTabs a[href="#men"]').tab('show');
    $('#fashionTabs a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.menu-list li').on('click', function () {
        alert('You clicked: ' + $(this).text());
        // replace this with actual navigation logic
    });

    $('.js-show-cart').on('click', function () {
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click', function () {
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click', function () {
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click', function () {
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $(document).off('click', '.btn-num-product-down');
    $(document).off('click', '.btn-num-product-up');
    
    $(document).on('click', '.btn-num-product-down', function () {
        var numProduct = Number($(this).next().val());
        if (numProduct > 1) $(this).next().val(numProduct - 1).trigger('change');
    });
    
    $(document).on('click', '.btn-num-product-up', function () {
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1).trigger('change');
    });

    $('.main-menu li a').on('click', function () {
        $('.main-menu li').removeClass('active-menu');
        $(this).parent().addClass('active-menu');
    });

    $('.nav-link').click(function(event) {
        event.preventDefault(); 

        $('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('show active');

        // Thêm lớp active vào tab được nhấn
        $(this).addClass('active');

        var target = $(this).attr('href');
        $(target).addClass('show active');
    });

    $('.js-addcart-detail').each(function(){
        //var nameProduct = $(this).parent().parent().parent().parent().find('.js-name-detail').html();
        var nameProduct = "Product";
        $(this).on('click', function(){
            swal(nameProduct, "is added to cart !", "success");
        });
    });

});


// (function () {
//     "use strict";

//     // filter items on button click
//     var filterButtons = document.querySelectorAll('.filter-tope-group button');
//     var itemsContainer = document.querySelector('.isotope-grid');
//     var items = itemsContainer.querySelectorAll('.isotope-item');

//     filterButtons.forEach(function (button) {
//         button.addEventListener('click', function () {
//             var filterValue = this.getAttribute('data-filter');

//             filterButtons.forEach(function (btn) {
//                 btn.classList.remove('how-active1');
//             });
//             this.classList.add('how-active1');

//             items.forEach(function (item) {
//                 if (filterValue === "*" || item.classList.contains(filterValue.substring(1))) {
//                     item.style.display = "block"; 
//                 } else {
//                     item.style.display = "none"; 
//                 }
//             });
//         });
//     });


//     var isotopeButtons = document.querySelectorAll('.filter-tope-group button');

//     isotopeButtons.forEach(function(button) {
//         button.addEventListener('click', function() {

//             isotopeButtons.forEach(function(btn) {
//                 btn.classList.remove('how-active1');
//             });
//             this.classList.add('how-active1');
//         });
//     });

// })();


(function ($) {
    "use strict";


    /*==================================================================
  [ Filter / Search product ]*/
    $('.js-show-filter').on('click', function () {
        // Chuyển đổi lớp 'show-filter' và hiển thị/ẩn panel
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        // Đảm bảo rằng icon được thay đổi khi nhấn vào Filter
        var $filterIcon = $(this).find('.fa-filter');
        var $closeIcon = $(this).find('.fa-xmark');
        $filterIcon.toggleClass('dis-none');
        $closeIcon.toggleClass('dis-none');

        // Nếu panel-search đang hiển thị, ẩn nó
        if ($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);

            // Đảm bảo icon Search chuyển về ban đầu khi ẩn panel search
            var $searchIcon = $('.js-show-search').find('.fa-magnifying-glass');
            var $closeSearchIcon = $('.js-show-search').find('.fa-xmark');
            $searchIcon.toggleClass('dis-none');
            $closeSearchIcon.toggleClass('dis-none');
        }
    });

    $('.js-show-search').on('click', function () {
        // Chuyển đổi lớp 'show-search' và hiển thị/ẩn panel
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        // Đảm bảo rằng icon được thay đổi khi nhấn vào Search
        var $searchIcon = $(this).find('.fa-magnifying-glass');
        var $closeSearchIcon = $(this).find('.fa-xmark');
        $searchIcon.toggleClass('dis-none');
        $closeSearchIcon.toggleClass('dis-none');

        // Nếu panel-filter đang hiển thị, ẩn nó
        if ($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);

            // Đảm bảo icon Filter chuyển về ban đầu khi ẩn panel filter
            var $filterIcon = $('.js-show-filter').find('.fa-filter');
            var $closeFilterIcon = $('.js-show-filter').find('.fa-xmark');
            $filterIcon.toggleClass('dis-none');
            $closeFilterIcon.toggleClass('dis-none');
        }
    });

})(jQuery);




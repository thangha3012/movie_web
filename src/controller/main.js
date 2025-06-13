
$(document).ready(function () {
    // Show/hide register/login forms
    $('#showRegisterForm').on('click', function (e) {
        e.preventDefault();
        $('#loginForm').addClass('d-none');
        $('#registerForm').removeClass('d-none');
    });

    $('#showLoginForm').on('click', function (e) {
        e.preventDefault();
        $('#registerForm').addClass('d-none');
        $('#loginForm').removeClass('d-none');
    });

    // Language toggle dropdown
    const languageToggle = $("#languageToggle");
    $(languageToggle).click(function (e) {
        e.preventDefault();
        $("#languageDropdown").slideToggle();
    });

    // Scroll to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $(".toTop").show();
        } else {
            $(".toTop").hide();
        }
    });
    $(".toTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 50, 'linear');
    });

    // Language switching logic
    function loadLanguage(lang) { 
        $.ajax({
            url: `src/languages/${lang}.json`,
            dataType: 'json',
            success: function (data) {
                $('[data-i18n]').each(function () {
                    const key = $(this).data('i18n');
                    if (data[key]) {
                        $(this).text(data[key]);
                    }
                });
                $('[data-i18n-placeholder]').each(function () {
                    const key = $(this).data('i18n-placeholder');
                    if (data[key]) {
                        $(this).attr('placeholder', data[key]);
                    }
                });
                // Update HTML lang attribute
                $('html').attr('lang', lang); // Sử dụng 'lang' ở đây
                // Optionally save preference to localStorage
                localStorage.setItem('selectedLang', lang); // Sử dụng 'lang' ở đây
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error loading language file:", textStatus, errorThrown);
            }
        });
    }

    // Load saved language
    const savedLang = localStorage.getItem('selectedLang') || 'vi';
    loadLanguage(savedLang);

    // Event listener for language selection
    $('.lang-select').on('click', function (e) {
        e.preventDefault();
        const newLang = $(this).data('lang');
        loadLanguage(newLang);
        $("#languageDropdown").hide(); // Hide dropdown after selection
    });

    $('#searchInput').on('input', function () {
        const searchText = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường

        $('.movie-card').each(function () { // Duyệt qua tất cả các thẻ phim
            const movieTitle = $(this).find('.movie-title').text().toLowerCase(); // Lấy tiêu đề phim và chuyển thành chữ thường

            if (movieTitle.includes(searchText)) { // Kiểm tra xem tiêu đề có chứa từ khóa không
                $(this).show(); // Hiển thị thẻ phim
            } else {
                $(this).hide(); // Ẩn thẻ phim
            }
        });
    });
});




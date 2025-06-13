$(function () {
    const $slides = $('#slideshow .list-img > div');
    const $dots = $('#slideshow .index-item');
    let current = 0;
    let timer = null;
    let autoEnabled = true;
    const total = $slides.length;
    let autoPaused = false;

    function showSlide(idx) {
        $slides.hide().eq(idx).fadeIn(400);
        $dots.removeClass('active').eq(idx).addClass('active');
        current = idx;
    }

    function nextSlide() {
        let idx = (current + 1) % total;
        showSlide(idx);
    }

    function prevSlide() {
        let idx = (current - 1 + total) % total;
        showSlide(idx);
    }

    function startAuto() {
        if (!autoEnabled) return;
        clearInterval(timer);
        timer = setInterval(function () {
            nextSlide();
        }, 4000);
    }

    function stopAuto() {
        clearInterval(timer);
    }

    function pauseAutoAndResume() {
        stopAuto();
        autoEnabled = false;
        autoPaused = true;
        setTimeout(function () {
            autoEnabled = true;
            autoPaused = false;
            startAuto();
        }, 5000);
    }

    // Init
    $slides.hide().eq(0).show();
    $dots.eq(0).addClass('active');
    startAuto();

    $('#slideNext').on('click', function () {
        nextSlide();
        pauseAutoAndResume();
    });

    $('#slidePrev').on('click', function () {
        prevSlide();
        pauseAutoAndResume();
    });

    $dots.on('click', function () {
        let idx = $(this).index();
        showSlide(idx);
        pauseAutoAndResume();
    });

    // Optional: pause on hover
    $('#slideshow').hover(stopAuto, function () {
        if (autoEnabled && !autoPaused) startAuto();
    });
});

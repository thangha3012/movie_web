  $(document).ready(function() {

    // $sliderElement: Đối tượng jQuery của container slider (ví dụ: $("#hotMoviesSlider"))
    // $prevButtonElement: Đối tượng jQuery của nút "previous"
    // $nextButtonElement: Đối tượng jQuery của nút "next"
    // visibleCount: Số lượng thẻ phim hiển thị trong khung nhìn (mặc định 5)
    // scrollStep: Số lượng thẻ phim trượt mỗi lần (mặc định 2)
    function initializeSlider($sliderElement, $prevButtonElement, $nextButtonElement, visibleCount = 5, scrollStep = 2) {
      const $slider = $sliderElement;
      const $nextBtn = $nextButtonElement;
      const $prevBtn = $prevButtonElement;

      let $movieCards = $slider.children(".movie-card");
      const totalCards = $movieCards.length;

      // Nếu không có thẻ phim nào trong slider này, thoát khỏi hàm
      if (totalCards === 0) {
        console.warn(`[Slider] Không tìm thấy thẻ phim nào trong slider: ${$sliderElement.attr('id')}. Bỏ qua khởi tạo.`);
        return;
      }

      // Clone các thẻ để tạo hiệu ứng vòng lặp vô hạn.
      // Clone đủ số thẻ bằng visibleCount ở cả hai phía để tránh khoảng trống khi trượt.
      // Thêm class 'is-clone' để dễ debug và có thể style riêng nếu cần
      $slider.prepend($movieCards.slice(-visibleCount).clone(true).addClass('is-clone'));
      $slider.append($movieCards.slice(0, visibleCount).clone(true).addClass('is-clone'));

      // Cập nhật lại $movieCards sau khi đã clone, bao gồm cả các thẻ clone mới
      $movieCards = $slider.children(".movie-card");

      let cardWidth;
      let currentIndex = 0; // Index của thẻ đầu tiên đang hiển thị trong bộ thẻ ban đầu (không tính clone)
      let isAnimating = false; // Cờ để ngăn chặn animation chồng chéo

      // Hàm thiết lập kích thước thẻ phim và vị trí ban đầu
      function setCardDimensions() {
        // Đảm bảo $slider.width() không phải 0 để tránh lỗi chia cho 0
        if ($slider.width() === 0) {
          // Nếu chiều rộng bằng 0, thử lại sau một chút (có thể do DOM chưa render xong)
          setTimeout(setCardDimensions, 50);
          return;
        }
        cardWidth = $slider.width() / visibleCount;

        // Áp dụng kích thước cho tất cả movie-card (bao gồm cả clone)
        $movieCards.css({
          "min-width": cardWidth + "px",
          "max-width": cardWidth + "px",
          flex: `0 0 ${cardWidth}px`, // Sử dụng flex-basis để kiểm soát kích thước flex item
        });

        // Cập nhật vị trí slider ngay lập tức (không animation) sau khi thay đổi kích thước
        updatePosition(false);
      }

      // Cập nhật vị trí slider (dịch chuyển translateX)
      function updatePosition(animate = true) {
        // Offset ban đầu cần tính đến các thẻ clone ở phía trước.
        // currentIndex là index trong tập hợp thẻ gốc.
        // Để hiển thị đúng thẻ đầu tiên trong tập hợp gốc, ta cần dịch chuyển
        // qua số lượng thẻ clone ở phía trước (visibleCount).
        let offset = -cardWidth * (currentIndex + visibleCount);

        // Đặt thuộc tính transition tùy thuộc vào việc có muốn animation hay không
        if (animate) {
          $slider.css("transition", "transform 0.5s ease");
        } else {
          $slider.css("transition", "none");
        }
        // Áp dụng phép biến đổi translateX
        $slider.css("transform", `translateX(${offset}px)`);
      }

      // Chức năng đi tới slide tiếp theo
      function goToNext() {
        if (isAnimating) return; // Nếu đang animation, bỏ qua click
        isAnimating = true;

        currentIndex += scrollStep; // Tăng index theo số bước trượt
        updatePosition(true); // Cập nhật vị trí với animation

        // Lắng nghe sự kiện transitionend để xử lý vòng lặp vô hạn
        $slider.one("transitionend", () => {
          // Nếu đã trượt qua tất cả các thẻ gốc (và đang hiển thị thẻ clone ở cuối)
          if (currentIndex >= totalCards) {
            currentIndex -= totalCards; // Reset currentIndex về đầu tập hợp gốc
            updatePosition(false); // Nhảy không animation về vị trí tương ứng ở đầu
          }
          isAnimating = false; // Kết thúc animation
        });
      }

      // Chức năng đi tới slide trước
      function goToPrev() {
        if (isAnimating) return; // Nếu đang animation, bỏ qua click
        isAnimating = true;

        currentIndex -= scrollStep; // Giảm index theo số bước trượt
        updatePosition(true); // Cập nhật vị trí với animation

        // Lắng nghe sự kiện transitionend để xử lý vòng lặp vô hạn
        $slider.one("transitionend", () => {
          // Nếu đã trượt về trước quá giới hạn đầu của bộ thẻ gốc (và đang hiển thị thẻ clone ở đầu)
          if (currentIndex < 0) {
            currentIndex += totalCards; // Reset currentIndex về cuối tập hợp gốc
            updatePosition(false); // Nhảy không animation về vị trí tương ứng ở cuối
          }
          isAnimating = false; // Kết thúc animation
        });
      }

      // --- Khởi tạo ban đầu cho slider cụ thể này ---
      setCardDimensions(); // Thiết lập kích thước thẻ và vị trí ban đầu (không animation)

      // Gắn sự kiện click cho nút Next và Prev của slider này
      $nextBtn.on("click", goToNext);
      $prevBtn.on("click", goToPrev);

      // Xử lý khi thay đổi kích thước cửa sổ
      // setCardDimensions() sẽ gọi updatePosition(false) bên trong
      $(window).on("resize", setCardDimensions);

    }

    // --- Gọi hàm initializeSlider cho từng slider ---

    initializeSlider(
      $("#hotMoviesSlider"),     // Đối tượng jQuery của slider chính
      $("#hotMoviesPrevBtn"),    // Đối tượng jQuery của nút prev
      $("#hotMoviesNextBtn")     // Đối tượng jQuery của nút next
    );

    initializeSlider(
      $("#cinemaMoviesSlider"),  // Đối tượng jQuery của slider chính
      $("#cinemaMoviesPrevBtn"), // Đối tượng jQuery của nút prev
      $("#cinemaMoviesNextBtn") // Đối tượng jQuery của nút next

    );
    initializeSlider(
      $("#chinaMoviesSlider"),  // Đối tượng jQuery của slider chính
      $("#chinaMoviesPrevBtn"), // Đối tượng jQuery của nút prev
      $("#chinaMoviesNextBtn") // Đối tượng jQuery của nút next

    );
    initializeSlider(
      $("#vietnamMoviesSlider"),  // Đối tượng jQuery của slider chính
      $("#vietnamMoviesPrevBtn"), // Đối tượng jQuery của nút prev
      $("#vietnamMoviesNextBtn") // Đối tượng jQuery của nút next
    );

  });

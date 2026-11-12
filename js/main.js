/* 大美成都 - 通用脚本 */
(function () {
  'use strict';

  // 轮播
  var carousel = document.getElementById('carousel');
  if (carousel) {
    var list = carousel.querySelector('.carousel-list');
    var slides = list.getElementsByTagName('li');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      index = (index + slides.length) % slides.length;
      activeIndex = index;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }
      slides[index].classList.add('active');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(function () { showSlide(activeIndex + 1); }, 3500);
    }

    function stopAuto() { clearInterval(timer); }

    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(activeIndex - 1); stopAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(activeIndex + 1); startAuto(); });
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    showSlide(0);
    startAuto();

    // 图片点击放大
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImg');
    var modalClose = document.getElementById('modalClose');
    var imgs = list ? list.getElementsByTagName('img') : [];
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].addEventListener('click', function () {
        if (modal) {
          modalImg.src = this.src;
          modalImg.alt = this.alt;
          modal.classList.add('open');
        }
      });
    }
    if (modalClose) modalClose.addEventListener('click', function () { modal.classList.remove('open'); });
    if (modal) { modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); }); }
    if (window) window.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('open'); });
  }

  // 锚点平滑滚动（美食页/景点页卡片）
  var anchors = document.querySelectorAll('.food-card, .scenic-card');
  for (var j = 0; j < anchors.length; j++) {
    anchors[j].addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
})();
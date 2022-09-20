function validateEmail(mail) {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
    return true;
  }

  return false;
}

function get_cookie(name) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}

$(document).ready(function () {
  var lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;

    if (st <= 100) {
      $('body').removeClass('scrolled');
    } else {
      $('body').addClass('scrolled');
    }

    if (st > lastScrollTop && st > 75) {
      $('header').addClass('hidden');
    } else {
      $('header').removeClass('hidden');
    }

    lastScrollTop = st;
  }, false);
  var mobileMenuOpen = false;
  $('.nav-mobile .burger').click(function (e) {
    e.preventDefault();

    if (!mobileMenuOpen) {
      $('body').addClass('overflow-hidden');
      $('header').addClass('mobile-nav-open');
      $('.nav-mobile').addClass('open');
      $('.mobile-menu-open').addClass('open');
      mobileMenuOpen = true;
    } else {
      $('body').removeClass('overflow-hidden');
      $('header').removeClass('mobile-nav-open');
      $('.nav-mobile').removeClass('open');
      $('.mobile-menu-open').removeClass('open');
      mobileMenuOpen = false;
    }
  });
  $('.mobile-footer-item .head').click(function (e) {
    e.preventDefault();
    $(this).closest('.mobile-footer-item').toggleClass('open');
  });
  $('.mobile-menu-open a.sub').click(function (e) {
    e.preventDefault();
    var id = $(this).attr('data-target');
    $('.mobile-mega-menu-' + id).addClass("show");
  });
  $('.close-mobile-mega-menu').click(function (e) {
    e.preventDefault();
    $(this).closest('.mobile-mega-menu').removeClass('show');
  });
  $('.js-close-person-popup').click(function () {
    $('.people-listing-popup-wrapper').removeClass('show');
  });
  $('body').on('click', '.js-load-in-popup', function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
      url: url,
      cache: false,
      method: 'GET',
      dataType: 'html',
      success: function (result) {
        $('.people-listing-popup-wrapper').find('.content').html(result);
        $('.people-listing-popup-wrapper').addClass('show');
      }
    });
  });
  $('.social-icon.link').click(function () {
    navigator.clipboard.writeText(window.location.href);
  });
  $('.social-icon.mail').click(function () {
    window.location.href = 'mailto:?subject=' + document.title + '&body=' + window.location.href;
  });
  $('.social-icon.facebook').click(function () {
    var url = encodeURI(window.location.href);
    window.open('https://www.facebook.com/share.php?u=' + url);
  });
  $('.social-icon.linkedin').click(function () {
    var url = encodeURI(window.location.href);
    window.open('https://www.linkedin.com/cws/share?url=' + url);
  });
  $('.social-icon.twitter').click(function () {
    var url = encodeURI(window.location.href);
    window.open('https://twitter.com/intent/tweet?text=' + url);
  });
  $('.js-faq-item').click(function () {
    $(this).toggleClass('toggled');
  });
  $('.js-news-filters a').click(function (e) {
    e.preventDefault();
    var filter = $(this).attr('data-filter');
    $('.js-news-filters a').removeClass('active');
    $(this).addClass('active'); // show all, no filters

    if (filter == "all") {
      $('.filtered-news-container-all a').removeClass('hidden');
    } else {
      $('.filtered-news-container-all').removeClass('hidden');
      $('.filtered-news-container-all a').addClass('hidden');
      $('.filtered-news-container-all a[data-category="' + filter + '"]').removeClass('hidden');
    }
  });
  $('.video-container').click(function () {
    var video = $(this).find('video').get(0);

    if (!video.paused) {
      video.pause();
      $(this).removeClass("playing");
    } else {
      video.play();
      $(this).addClass("playing");
    }
  });
  $('.js-show-chapter a').click(function (e) {
    console.log('hello');
    e.stopPropagation();
  });
  $('.js-show-chapter').click(function (e) {
    e.preventDefault();
    $('.js-show-chapter').removeClass('active');
    $('.chapter-row').removeClass('show');
    $(this).addClass('active');
    var target = $(this).attr('data-target');
    $('.chapter-row-' + target).addClass('show');
  });
  $('.js-show-megamenu').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('data-target');
    $('.mega-menu').addClass("hidden");
    $('.mega-menu-' + target).removeClass("hidden");

    if ($(this).hasClass('active')) {
      $('.js-main-nav').removeClass('active');
      $('header').removeClass('open'); //$('header').addClass('black');
      //$('header').removeClass('white');
    } else {
      $('.js-main-nav').removeClass('active');
      $(this).addClass('active');
      $('header').addClass('open'); //$('header').removeClass('black');
      //$('header').addClass('white');
    }
  });
  $('input').focus(function () {
    $(this).removeClass('error');
  });
  var newsletter_submitting = false;
  $('.js-newsletter-signup button').click(function (e) {
    e.preventDefault();

    if (newsletter_submitting) {
      return;
    }

    var $this = $(this);
    var input = $(this).parent().find('input');
    var email = $(input).val();
    var portalId = $(this).attr('data-portalid');
    var formId = $(this).attr('data-formid');
    console.log(email);

    if (!validateEmail(email)) {
      console.log('could not validate email');
      $(input).addClass('error');
      return;
    }

    var data = [{
      name: "email",
      value: email
    }];
    var payload = {
      "submittedAt": Date.now(),
      "fields": data,
      "context": {
        "hutk": get_cookie('hubspotutk'),
        "pageUri": window.location.href,
        "pageName": window.title
      }
    };
    var url = 'https://api.hsforms.com/submissions/v3/integration/submit/' + portalId + '/' + formId;
    newsletter_submitting = true;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr);
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        $this.parent().find('.success').html(json.inlineMessage).show();
        $this.parent().find('input').addClass('disabled').val(" ");
        $this.addClass('disabled');
      } else if (xhr.readyState == 4 && xhr.status == 400) {
        console.log('An error occured');
        newsletter_submitting = false;
      } else if (xhr.readyState == 4 && xhr.status == 403) {
        console.log('An error occured');
        newsletter_submitting = false;
      } else if (xhr.readyState == 4 && xhr.status == 404) {
        console.log('An error occured');
        newsletter_submitting = false;
      }
    };

    xhr.send(JSON.stringify(payload));
  });
  $('form.js-hubspot-form input, form.js-hubspot-form textarea, form.js-hubspot-form select').focus(function () {
    $(this).closest('form').removeClass('error');
    $(this).removeClass('error');
  });
  $('form.js-hubspot-form').each(function (index, el) {
    var form = el;
    var submitting = false;
    $(form).find("button").click(function (event) {
      event.preventDefault();

      if (submitting) {
        return;
      }

      var portalId = $(form).attr('data-portalid');
      var formId = $(form).attr('data-formid'); // var formData = $(form).serialize();

      var data = [];
      var error = false;
      $(form).find('input, textarea, select').each(function (index, el) {
        var name = $(el).attr('name');
        var value = $(el).val();

        if (value == "") {
          $(el).addClass('error');
          error = true;
          return;
        }

        if ($(el).hasClass('email-validation')) {
          console.log('have email validation');

          if (!validateEmail(value)) {
            console.log('could not validate email');
            $(el).addClass('error');
            error = true;
            return;
          }
        }

        data.push({
          name: name,
          value: value
        });
      });

      if (error) {
        $(form).addClass('error');
        console.log('validation error');
        return;
      }

      submitting = true;
      var payload = {
        "submittedAt": Date.now(),
        "fields": data,
        "context": {
          "hutk": get_cookie('hubspotutk'),
          "pageUri": window.location.href,
          "pageName": window.title
        }
      };
      var url = 'https://api.hsforms.com/submissions/v3/integration/submit/' + portalId + '/' + formId;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          $(form).addClass('success');
        } else if (xhr.readyState == 4 && xhr.status == 400) {
          console.log('An error occured');
          submitting = false;
        } else if (xhr.readyState == 4 && xhr.status == 403) {
          console.log('An error occured');
          submitting = false;
        } else if (xhr.readyState == 4 && xhr.status == 404) {
          console.log('An error occured');
          submitting = false;
        }
      };

      xhr.send(JSON.stringify(payload));
    });
  });
});

function initCarousel(selector, getNumCardsPerScreen) {
  var $carousel = $(selector);
  var $carouselInner = $(selector).find('.swipe-carousel-inner');
  var cardsPerScreen = getNumCardsPerScreen();
  var lastCardsPerScreen = cardsPerScreen;
  var curPos = 0;
  var numCards = $carousel.find('.swipe-carousel-item').length;
  console.log('swipe carousel', selector, ' cards per screen: ', cardsPerScreen);

  if (numCards == cardsPerScreen) {
    $carousel.find('.prev').addClass('disabled');
    $carousel.find('.next').addClass('disabled');
  }

  $(window).resize(function () {
    var n = getNumCardsPerScreen();

    if (n != lastCardsPerScreen) {
      cardsPerScreen = lastCardsPerScreen = getNumCardsPerScreen();
      console.log('swipe carousel', selector, ' cards per screen: ', cardsPerScreen);
      resetCarousel();
    } else {
      updateCarousel();
    }

    if (numCards == cardsPerScreen) {
      $carousel.find('.prev').addClass('disabled');
      $carousel.find('.next').addClass('disabled');
    }
  });
  $carousel.find('.prev').click(function (e) {
    e.preventDefault();

    if (curPos == 0) {
      return;
    }

    curPos--;
    updateCarousel();
  });
  $carousel.find('.next').click(function (e) {
    e.preventDefault();

    if (curPos == numCards - cardsPerScreen) {
      return;
    }

    curPos++;
    updateCarousel();
  });
  $carousel.find('.swipe-carousel-inner').on('swiperight', function (e) {
    console.log('swipe right');
    e.preventDefault();

    if (curPos == 0) {
      return;
    }

    curPos--;
    updateCarousel();
  });
  $carousel.find('.swipe-carousel-inner').on('swipeleft', function (e) {
    console.log('swipe left');
    e.preventDefault();

    if (curPos == numCards - cardsPerScreen) {
      return;
    }

    curPos++;
    updateCarousel();
  });

  function updateCarousel() {
    var step = $carouselInner.find('.swipe-carousel-item').outerWidth();
    var translateX = -(step * curPos) | 0;
    $carouselInner.css('transform', 'translateX(' + translateX + 'px)');

    if (curPos == 0) {
      $carousel.find('.prev').addClass('disabled');
    } else {
      $carousel.find('.prev').removeClass('disabled');
    }

    if (curPos == numCards - cardsPerScreen) {
      $carousel.find('.next').addClass('disabled');
    } else {
      $carousel.find('.next').removeClass('disabled');
    }
  }

  function resetCarousel() {
    curPos = 0;
    updateCarousel();
  }
}
var i = 0;

$('.back').on('click', function () {
    window.history.back();
})

function makeMovieCall(filter = 'none', page = '1') {
    var data = {};
    data.filter = filter;
    data.page = page;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/movie/default',
        success: function (res) {
            window.location.href = "#";
            $('footer').removeClass('d-none');
            $('.pagi').removeClass('d-none');
            $('.gala').html(res);
        }
    });
}

function func(e) {
    var year = $(e).find($('.year')).html(),
        title = $(e).find($('.movie-title')).html();
    var data = {};
    data.title = title;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/movie/info',
        success: function (res) {
            $('.box').css({
                'background-image': 'url("https://image.tmdb.org/t/p/w1280' + res.backdrop_path + '")'
            })

            $('.movie-desc').css({
                'display': 'block',
            });

            $('#search_form').css({
                'display': 'none',
            });

            $('.head').css({
                'height': '100%'
            });

            if (window.matchMedia('(max-width: 500px)').matches) {
                $('.movie-desc').css({
                    'width': '95%',
                    'height': '500px'
                });
            } else {
                $('.movie-desc').css({
                    'width': '70vw',
                    'height': 'auto'
                });
            }

            $('.overview').html(res.overview);

            $('.vid_desc').find('h1').html(res.title);
            var url = 'title=' + res.title +
                '&poster=' + res.backdrop_path +
                '&mdbID=' + res.id +
                '&desc=' + res.overview +
                '&year=' + res.release_date.substring(0, 4);
            var newUrl = Base64.encode(url);

            $('.movie_link').attr('href', '/video?info=' + newUrl);
        }
    });
}

function disable() {
    $(window).on('wheel.impair', function () {
        return false;
    });
}

function enable() {
    $(window).off('wheel.impair');
}

$(document).ajaxStart(function () {
    $('.loader').css({
        'display': 'block'
    })
    disable();
}).ajaxStop(function () {
    $('.loader').css({
        'display': 'none'
    })
    enable();
});


$('document').ready(function () {
    var page = 1;

    $('.page-item').on('click', function () {
        if ($(this).attr('value') == "prev" && page > 1) {
            page -= 1;
            makeMovieCall('none', '' + page);
        } else if ($(this).attr('value') == "next") {
            page += 1;
            makeMovieCall('none', '' + page);
        }
    })

    $('.dropdown-item').on('click', function () {
        makeMovieCall('' + $(this).attr('value'), '' + page);
    })

    setInterval(function () {
        $('.alert').fadeOut();
    }, 2000);

    makeMovieCall();

    $('#search_btn').on('click', function () {
        if (i == 0) {
            $('#search_form').css({
                'display': 'block',
            });
            $('.head').css({
                'height': '124px',
            });
            $('.btn-group').css({
                'padding-top': '109px',
                'transition': 'none'
            })
            $('.btn-group>.btn:first-child').css({
                'display': 'none',
            })
            i = 1;
        } else {
            $('#search_form').css({
                'display': 'none',
            });
            $('.head').css({
                'height': '0px',
            });
            $('.btn-group').css({
                'padding-top': '80px',
                'transition': 'none'
            })
            $('.btn-group>.btn:first-child').css({
                'display': 'block',
            })
            i = 0;
        }
    });

    $('#search_form').css({
        'display': 'none',
        'transition': '600ms',
    });

    $('.head').css({
        'height': '0px',
    });

    $('#cancel').on('click', function () {
        $('.movie-desc').css({
            'display': 'none',
        });
        $('.head').css({
            'height': '0px',
        });
        $('.movie-desc').css({
            'width': '0',
            'height': '0'
        });
        $('.btn-group').css({
            'padding-top': '80px',
            'transition': 'none'
        });
        $('.btn-group>.btn:first-child').css({
            'display': 'block',
        });
        i = 0;
    })

    document.getElementById("search").addEventListener("input", function () {
        if ($('#search').val() === '') {
            makeMovieCall();
        } else {
            var data = {};
            data.search = $('#search').val();
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/movie/search',
                success: function (res) {
                    $('.gala').html(res);
                }
            });
        }
    });
});
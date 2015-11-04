(function ($) {
	new WOW().init();
	jQuery(window).load(function() { 
		jQuery("#preloader").delay(100).fadeOut("slow");
		jQuery("#load").delay(100).fadeOut("slow");
	});

	//jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 50) {
			$(".navbar-fixed-top").addClass("top-nav-collapse");
		} else {
			$(".navbar-fixed-top").removeClass("top-nav-collapse");
		}
	});

	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$('.navbar-nav li a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
		$('.page-scroll a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
        
        // set email mechanism for contact us
        var is_email_mechanism_triggered = false;
        $('#contact_form').submit(function(event){
            event.preventDefault();
            var sender_name = $('#sender_name').val().trim();
            var sender_email = $('#sender_email').val().trim();
            var email_subject = $('#email_subject').val().trim();
            var email_message = $('#email_message').val().trim();
            
            if( !is_email_mechanism_triggered &&
                sender_name !== '' &&
                sender_email !== '' &&
                email_subject !== '' && email_subject !== 'na' &&
                email_message !== ''){
                
                // disable the mechanism of triggering email sender
                is_email_mechanism_triggered = true;
                
                // popup cover
                jQuery("#preloader").delay(50).fadeIn("slow");
                
                $.ajax({ // create an AJAX call...
                    data: {
                        sender_name : sender_name,
                        sender_email : sender_email,
                        email_subject : email_subject,
                        email_message : email_message,
                    },
                    type: 'POST', // GET or POST
                    url: '/services/send_email', // the file to call
                    success: function(res) { // on success..
                        console.log(res);
                        if(res.email_status === 'successful'){
                            $('#sender_name').val('');
                            $('#sender_email').val('');
                            $('#email_message').val('');
                            $('#email_subject').prop('selectedIndex',0);
                            alert(res.msg);
                        }else{
                            console.log(res.msg);
                        };
                        is_email_mechanism_triggered = false;
                        jQuery("#preloader").delay(100).fadeOut("slow");
                    }
                });
            }else{
                alert("Please send your message again.");
                return false;
            };
        });
	});
    
})(jQuery);

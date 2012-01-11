/*
*  @Name     jQuery Rating Plugin
*  @Version  0.1.2-beta
*  @Author   Irfan Durmus
*/

(function($){
  $.fn.rating = function(uo, callback){
      
        callback = callback || function(){};

      if (typeof uo === 'function') {
          callback = uo;
      }
      
        uo = uo || {};

    uo.callback = callback;
        
    // each for all item
    this.each(function(i, v){
      
      var options = $.extend({}, defaults, uo);

      $(v).data('rating', options)
        .unbind('init.rating')
        .bind('init.rating', $.fn.rating.init)
        .trigger('init.rating');        
    });
  };
  
  $.extend($.fn.rating, {
    init: function(e){
      
      var el = $(this),
        list = '',
        isChecked = null,
        childs = el.children();
      
      for (var i=0; i < childs.length; i++) {
        list = list + '<a class="star" title="' + $(childs[i]).val() + '" />';
        if ($(childs[i]).is(':checked')) {
          isChecked = $(childs[i]).val();
        };
      };
      
      childs.hide();
      
      el
        .append('<div class="stars">' + list + '</div>')
        .unbind('set.rating')
        .bind('set.rating', $.fn.rating.set)
        .trigger('set.rating', isChecked)
        .addClass('rated');
      
      if (!($.fn.rating.displayOnly(el))) {
        $('a', el).live('click', function(e){
          
          $(this)
            .unbind('click.rating')
            .bind('click.rating', $.fn.rating.click)
            .trigger('click.rating');
        });
      }      
    },
    set: function(e, val) {
      //console.log(e, val)
      var el = $(this);
      
      if (val) {
        el.find('a').removeClass('fullStar');
        
        var input = $('a', el).filter(function(i){
          if ($(this).attr('title') == val)
            return $(this);
          else
            return false;
        });
        
        input
          .addClass('fullStar')
          .prevAll()
          .addClass('fullStar');
      }

      if (!($.fn.rating.displayOnly(el))) {
        el
          .unbind('hover.rating')
          .bind('hover.rating', $.fn.rating.hover)
          .trigger('hover.rating', val);
      }
      return;
    },
    hover: function(e, i){
    
      //console.log(e, i, this);
      var el = $(this),
        stars = $('a', el);
      
      stars.live('mouseenter', function(e){
        // add tmp class when mouse enter
        $(this)
          .addClass('tmp_fs')
          .prevAll()
          .addClass('tmp_fs');
        
        $(this).nextAll()
          .addClass('tmp_es');
      });
      
      stars.live('mouseleave', function(e){
        // remove all tmp class when mouse leave
        $(this)
          .removeClass('tmp_fs')
          .prevAll()
          .removeClass('tmp_fs');
        
        $(this).nextAll()
          .removeClass('tmp_es');
      });
    },
    click: function(e){
      e.preventDefault();
      var el = $(e.target),
        inputs = $(e.target).parent().parent().children('input'),
                rate = el.attr('title');
        
        matchInput = inputs.filter(function(i){
          if ($(this).val() == el.attr('title'))
            return true;
          else
            return false;
        });
      
      matchInput.attr('checked', true);
      
      el.parent().parent()
        .trigger('set.rating', matchInput.val())
        .data('rating').callback(rate, e);
    },
    displayOnly: function(el) { 
      return $(el).data('rating').displayOnly === true
    }
  });
  
  defaults = {};
  
})(jQuery);

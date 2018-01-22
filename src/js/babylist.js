$( document ).ready(function() {
  var userName        = '',
      $nameInput      = $('#bl-user-name__input'),
      $itemsContainer = $('.bl-items'),
      currentUserName = '';

  $('body').removeClass('bl-body--js-disabled');

  initName();
  initItems();
  initAnchors();
  addCheckbox();
  bindEvents();
  
  function initName() {
    if(userName !== '') {
      $('.bl-user-name').addClass('bl-user-name--filled');
      $nameInput.val(userName);
      currentUserName = userName;
    }
  }

  function initItems() {
    var keys = [];
    for (var key in itemsData) {
      if (itemsData.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();

    for (i = 0; i < keys.length; i++) {
      var key = keys[i];
      var $itemsWrapper = $(
        '<div class="bl-items__wrapper">' +
          '<h2 class="bl-items__category">' + key + '</h2>' +
          '<ul class="bl-items__list">' +
          '</ul>' +
        '</div>'
      );
      $itemsContainer.append($itemsWrapper);
      
      itemsData[key].sort(SortByName);
      for(var j = 0; j < itemsData[key].length; j++) {
        var item = itemsData[key][j];
        var $item = $(
          '<li class="bl-items__item ' + (item.user_id !== null ? 'bl-items__item--taken' : '') + ' ' + (item.user_id === userId ? ' bl-items__item--own' : '') + '">' +
            '<label for="' + item.id + '" class="bl-items__item-name">' + item.name + '</label>' +
            '<input id="' + item.id + '" class="bl-items__item-checkbox" type="checkbox" value="' + item.user_id + '"' + (item.user_id === userId ? ' checked' : '') + '>' +
          '</li>'
        );
        $itemsWrapper.find('.bl-items__list').append($item);
      }
    }
  }

  function SortByName(a, b){
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase(); 
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  }

  function initAnchors() {
    var $topAnchor    = $('<a id="bl-anchor--top" class="bl-anchor bl-anchor--top icon-caret-down" href="#bl-anchor--bottom"></a>'),
        $botAnchor = $('<div class="bl-items__wrapper"><h2 class="bl-items__category"><a id="bl-anchor--bottom" class="bl-anchor bl-anchor--bottom icon-caret-up" href="#"></a></h2></div>');
    $('.bl-items__category').first().append($topAnchor);
    $itemsContainer.append($botAnchor);
  }

  function bindEvents() {
    $('.bl-items__item-checkbox').change(function() {
      var $input    = $(this),
          $checkbox = $input.closest('.bl-items__item').find('.checkbox-svg');
      if(this.checked) {
        var itemData = {
          id: $(this).attr('id'),
          user_id: userId
        }
        $input.closest('.bl-items__item ').addClass('bl-items__item--taken');
        $input.closest('.bl-items__item ').addClass('bl-items__item--own');
      } else {
        var itemData = {
          id: $(this).attr('id'),
          user_id: null
        }
        $input.closest('.bl-items__item ').removeClass('bl-items__item--taken');
        $input.closest('.bl-items__item ').removeClass('bl-items__item--own');
      }
      updateData(JSON.stringify(itemData), 'item');

      $checkbox.find('.hide').removeClass('hide');
      animateCheck($checkbox, $input.is(':checked') ? true : false );
    });

    $nameInput.keypress(function(e){
      if(e.which == 13){
        updateName('enter', $(this).val());
        this.blur();
      }
    });
    $nameInput.focusout(function() {
      updateName('focusout', $(this).val()); 
    });

    $('.checkbox-svg').on('click', function(e){
      e.preventDefault();
      var $this   = $(this),
          $input  = $this.closest('.bl-items__item').find('.bl-items__item-checkbox');
      $input.trigger('click');      
      //$this.find('.hide').removeClass('hide');
      //animateCheck($this, $input.is(':checked') ? true : false );
    });
  }

  function animateCheck($checkbox, direction) {
    var $paths  = $checkbox.find('path:not(defs path)'),
        $circle = $checkbox.find('#cirle');

    $paths.each(function(i, e) {
        e.style.strokeDasharray = e.style.strokeDashoffset = e.getTotalLength();
    });
    var tl = new TimelineMax();
    if(direction){
      tl.add([
        TweenLite.set($paths.eq(1), {stroke: '#5FE533'}),
        TweenLite.set($paths.eq(0), {stroke: '#5FE533'}),
        TweenLite.to($paths.eq(0), .1, {strokeDashoffset: 0, delay: .0}),
        TweenLite.to($paths.eq(1), .2, {strokeDashoffset: 0, delay: .2}),
        TweenLite.fromTo($circle, 0.6,
          {
            attr:{
              r:20
            }
          },{
            attr:{
              r:46.43
            }
          },'-=1'
        )
      ]);
    } else {
      tl.add([
        TweenLite.set($paths.eq(1), {stroke: '#DC3522'}),
        TweenLite.set($paths.eq(0), {stroke: '#DC3522'}),
        TweenLite.from($paths.eq(1), .2, {strokeDashoffset: 0, delay: .0}),
        TweenLite.from($paths.eq(0), .1, {strokeDashoffset: 0, delay: .1}),
        TweenLite.fromTo($circle, 0.5,
          {
            attr:{
              stroke:'#DC3522'
            }
          },{
            attr:{
              stroke:'#fff'
            }
          },'-=1'
        ),
      ]);
    }
  } 

  function updateName(event, value) {
    if(currentUserName !== value) {
      currentUserName = value;
      var nameData = {
        user_id: userId,
        name: value
      }
      updateData(JSON.stringify(nameData), 'name');
    }
    if(value !== ''){
      $('.bl-user-name').addClass('bl-user-name--filled');
    } else {
      $('.bl-user-name').removeClass('bl-user-name--filled');
    }
  }

  function updateData(jsonData, type) {
    $.post("static/scripts/data_update.php",
    {
      type: type,
      data: jsonData
    },
    function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
  }

  function addCheckbox() {
    var index = 0;
    $('.bl-items__item-checkbox').each(function(){
      var $item = $(this).closest('.bl-items__item'),
          $checkbox = $('' +
            '<svg class="checkbox-svg" xmlns="http://www.w3.org/2000/svg" width="130.88px" height="110.61px" viewBox="0 0 130.88 110.61">' +
              '<g class="checkbox-layer"> ' +
                '<circle id="cirle" fill="none" stroke="#FFFFFF" stroke-width="14.9235" stroke-miterlimit="10" cx="53.89" cy="56.72" r="46.43"/>' +
                '<defs>' +
                  '<clipPath id="stroke-up-clip-' + index + '">' +
                    '<path class="stroke-up ' + ($item.hasClass('bl-items__item--own') ? '' : 'hide') + '" d="M53.89,54.89c2.67-7.08,12-22.63,26.33-33.67C99.41,6.46,126.89-2.37,130.56,0.56c3.18,2.53-17.7,4.81-44.66,32.7C58.14,61.97,72.6,89.8,54.73,84.12C45.89,81.31,51.22,61.97,53.89,54.89z"/>' +
                  '</clipPath>' +
                '</defs>' +
                '<defs>' +
                  '<clipPath id="stroke-down-clip-' + index + '">' +
                    '<path class="stroke-down ' + ($item.hasClass('bl-items__item--own') ? '' : 'hide') + '" d="M59.31,66.77c3.08,9.17,3.27,17.7,0.22,18.1c-1.27,0.17-2.84-0.11-4.8-0.75c-12.59-4.14-5.59-3.14-16.8-25.89c-6.34-12.87-16.04-22.33-13.7-24.67c4.5-4.5,14.24,3.38,23.02,13.36C54.89,55.6,56.1,57.25,59.31,66.77z"/>' +
                  '</clipPath>' +
                '</defs>' +
              '</g>' +
              '<g class="mask-layer" fill="none" stroke="#5FE533" stroke-width="18" stroke-linecap="round" stroke-miterlimit="10">' +
                '<path clip-path="url(#stroke-down-clip-' + index + ')" id="stroke-down-mask" d="M15.641,23.699c29,23.5,34.719,39.462,39.25,55.625"/>' +
                '<path clip-path="url(#stroke-up-clip-' + index + ')" id="stroke-up-mask" d="M55.578,91.574c-1-43,32.063-75.75,67.813-89"/>' +
              '</g>' +
            '</svg>' +
          '');
      if(!$item.hasClass('bl-items__item--taken') || ($item.hasClass('bl-items__item--taken') && $item.hasClass('bl-items__item--own'))) {
        $(this).hide().after($checkbox);
      }

      index++;
    });
  }
});
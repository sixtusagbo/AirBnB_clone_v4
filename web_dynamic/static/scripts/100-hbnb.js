$(function () {
  const amenitiesChecked = {}, statesChecked = {}, citiesChecked = {};
  const apiUrl = 'http://127.0.0.1:5001/api/v1';

  $('.amenities input:checkbox').change(function (event) {
    if ($(this).is(':checked')) {
      // store the Amenity ID in the list
      amenitiesChecked[$(this).data('id')] = $(this).data('name');
      updateCheckedAmenitiesInterface();
    } else {
      // remove the Amenity ID from the list
      delete amenitiesChecked[$(this).data('id')];
      updateCheckedAmenitiesInterface();
    }
  });

  // update the h4 tag inside div Amenities with list of Amenities checked
  const updateCheckedAmenitiesInterface = () => {
    const length = Object.keys(amenitiesChecked).length;
    let content = ''; let i = 0;

    for (const amenity of Object.values(amenitiesChecked)) {
      const last = i === length - 1;
      content += amenity;
      if (!last) {
        content += ', ';
      }
      i++;
    }

    $('.amenities h4').text(content);
  };

  $.get(`${apiUrl}/status`,
    function (data, textStatus, jqXHR) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  );

  $.ajax({
    url: `${apiUrl}/places_search`,
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({}),
    success: function (data, textStatus, jqXHR) {
      displayPlaces(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });

  const displayPlaces = (places) => {
    $('section.places').html('');

    for (const place of places) {
      $('section.places').append(
        `
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
          </div>
          <div class="user">
            <b></b>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
        `
      );
    }
  };

  $('button').click(event => {
    const amenities = Object.keys(amenitiesChecked);
    const states = Object.keys(statesChecked);
    const cities = Object.keys(citiesChecked);

    $.ajax({
      url: `${apiUrl}/places_search`,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ amenities, states, cities }),
      success: function (data, textStatus, jqXHR) {
        displayPlaces(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });

  $('.locations ul:nth-of-type(1) input:checkbox').change(function (event) {
    if ($(this).is(':checked')) {
      // store the State ID in the list
      statesChecked[$(this).data('id')] = $(this).data('name');
      updateCheckedLocationsInterface();
    } else {
      // remove the State ID from the list
      delete statesChecked[$(this).data('id')];
      updateCheckedLocationsInterface();
    }
  });

  $('.locations ul:nth-of-type(2) input:checkbox').change(function (event) {
    if ($(this).is(':checked')) {
      // store the City ID in the list
      citiesChecked[$(this).data('id')] = $(this).data('name');
      updateCheckedLocationsInterface();
    } else {
      // remove the City ID from the list
      delete citiesChecked[$(this).data('id')];
      updateCheckedLocationsInterface();
    }
  });

  // update the h4 tag inside div locations with list of checked items
  const updateCheckedLocationsInterface = () => {
    const length = Object.keys(citiesChecked).length + Object.keys(statesChecked).length;
    let content = ''; let i = 0;

    for (const location of [...Object.values(citiesChecked), ...Object.values(statesChecked)]) {
      const last = i === length - 1;
      content += location;
      if (!last) {
        content += ', ';
      }
      i++;
    }

    $('.locations h4').text(content);
  };
});

const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
require(['jquery', 'ramda'], ($, { compose, curry, map, prop }) => {
  const Impure = {
    trace: curry((tag, x) => { console.log(tag, x); return x; }), // eslint-disable-line no-console
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html)),
  };

  const host = 'api.flickr.com';
  const path = '/services/feeds/photos_public.gne';
  const query = t => `?tags=${t}&format=json&jsoncallback=?`;
  const url = t => `https://${host}${path}${query(t)}`;
  const img = src => $('<img />', { src });

  // map's composition law
  /*
  compose(map(f), map(g)) === map(compose(f, g));
  compose(map(img), map(mediaUrl)) === map(compose(img, mediaUrl));
  */

  // Unoptimized
  /*
  const mediaUrls = compose(map(mediaUrl), prop('items'));
  const images = compose(map(img), mediaUrls);
  */

  const mediaUrl = compose(prop('m'), prop('media'));
  const mediaToImg = compose(img, mediaUrl);
  const images = compose(map(mediaToImg), prop('items'));

  const render = compose(Impure.setHtml('#js-main'), images);
  const app = compose(Impure.getJSON(render), url);

  app('cats');
});

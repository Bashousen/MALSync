import { PageInterface } from '../../pageInterface';

export const Anitube: PageInterface = {
  name: 'Anitube',
  domain: 'https://anitube.vip',
  languages: ['Portuguese'],
  type: 'anime',
  urls: {
    match: ['*://*.anitube.vip/*'],
  },
  search: 'https://www.anitube.vip/busca?s={searchtermPlus}',
  sync: {
    isSyncPage($c) {
      return $c.url().urlPart(3).equals('video').run();
    },
    getTitle($c) {
      const regex = ' ?-? ((?<!: )ep|(\\d.+)?(final|especial)$|dublado|parte|- ova|(?<!movie )\\d+$)[^\\r\\n]*';
      return $c.querySelector('[itemprop="name"]')
        .getAttribute('content')
        .replaceRegex(regex, '')
        .trim()
        .run();
    },
    getIdentifier($c) {
      return $c.querySelector('.listaEP').parent().getAttribute('href').urlPart(2).run();
    },
    getOverviewUrl($c) {
      return $c.querySelector('.listaEP').parent().get('href').run();
    },
    getEpisode($c) {
      return $c.querySelector('[itemprop="name"]')
        .getAttribute('content')
        .trim()
        .regex('(\\d+)(( -)? [a-z]+)?$', 1)
        .ifNotReturn($c.number(1).run())
        .number()
        .run(); 
    },
    nextEpUrl($c) {
      return $c.querySelector('.spr.ProxEP').parent().get('href').run();
    },
  },
  overview: {
    isOverviewPage($c) {
      return $c.url().urlPart(3).matches('anime(s-dublados)?').run();
    },
    getTitle($c) {
      $c.title().log().run();
      return $c.title().replaceRegex('\\s-\\s(anitube|dublado)', '').run();
    },
    getIdentifier($c) {
      return $c.url().urlPart(4).run();
    },
    uiInjection($c) {
      return $c.querySelector('.anime_container_titulo').uiAppend().run();
    },
  },
  list: {
    elementsSelector($c) {
      return $c.querySelectorAll('.animepag_episodios_item a').run();
    },
    elementUrl($c) {
      return $c.get('href').run();
    },
    elementEp($c) {
      return $c.find('.animepag_episodios_item_views').text().trim().split(' ').last().number().run();
    },
  },
  lifecycle: {
    setup($c) {
      return $c.addStyle(require('./style.less?raw').toString()).run();
    },
    ready($c) {
      return $c
        .title()
        .contains('Error 404')
        .ifThen($c => $c.string('404').log().return().run())
        .domReady()
        .trigger()
        .run();
    },
  },
};
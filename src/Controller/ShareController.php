<?php

namespace Drupal\kifisome\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Database\Connection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ShareController extends ControllerBase {
  protected $db;

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('database')
    );
  }

  public function __construct(Connection $database) {
    $this->db = $database;
  }

  public function share(Request $request) {
    $service = $request->query->get('s');
    $url = $request->query->get('u');
    $domain = parse_url($url, PHP_URL_HOST);
    $values = [$url, $domain, $service, time()];

    if ($request->isMethod('POST')) {
      $sql = '
        INSERT INTO {kifisome_shares} (url, domain, service, timestamp)
        VALUES (?, ?, ?, ?)
      ';
      $this->db->query($sql, $values);
    }

    return new Response("Share to {$service}; url: {$url}");
  }

  public function admin() {
    $latest = $this->db->query('SELECT url, service, timestamp FROM {kifisome_shares} ORDER BY timestamp DESC LIMIT 10')->fetchAll(\PDO::FETCH_ASSOC);

    $total = $this->db->query('SELECT domain, COUNT(*) FROM {kifisome_shares} GROUP BY domain ORDER BY domain')->fetchAll(\PDO::FETCH_ASSOC);

    $popular = $this->db->query('SELECT url, COUNT(*) total FROM {kifisome_shares} GROUP BY url ORDER BY total DESC LIMIT 5')->fetchAll(\PDO::FETCH_ASSOC);

    $dates = \Drupal::service('date.formatter');

    foreach ($latest as $i => $row) {
      $latest[$i]['timestamp'] = $dates->format($row['timestamp']);
    }

    return [
      'latest' => [
        '#type' => 'table',
        '#caption' => $this->t('Recent shares'),
        '#header' => [$this->t('Content'), $this->t('Shared to'), $this->t('Time')],
        '#rows' => $latest
      ],
      'popular' => [
        '#type' => 'table',
        '#caption' => $this->t('Popular content'),
        '#header' => [$this->t('Content'), $this->t('Shares')],
        '#rows' => $popular,
      ],
      'total' => [
        '#type' => 'table',
        '#caption' => $this->t('Shares per website'),
        '#header' => [$this->t('Website'), $this->t('Shares')],
        '#rows' => $total
      ],
    ];
  }
}

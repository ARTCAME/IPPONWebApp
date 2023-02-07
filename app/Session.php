<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Session extends Model {
    protected $connection = 'mongodb';
    protected $collection = 'sessions';

    protected $fillable = [
        'user_id',
        'last_ip',
    ];
}

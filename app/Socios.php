<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Socios extends Model {
    protected $connection = 'mongodb';
    protected $collection = 'customers';

    protected $fillable = [
        'active',
        '_id',
        'sign',
        'image',
        'name',
        'address',
        'dni',
        'dateofbirth',
        'gender',
        'tutor',
        'phones',
        'emails',
        'contacts',
        'payments',
        'paymentdata',
        'belts',
        'notes',
        'rightsProtect',
        'rightsImage',
        'rightsUnderage',
    ];
}

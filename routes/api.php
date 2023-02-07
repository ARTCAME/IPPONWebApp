<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('auth')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    /* Except the login page, all the rest of auth actions are under jwt authorization */
    Route::middleware([/* 'jwt.verify', */ 'jwt'/* , 'jwt.refresh' */])->group(function () {
        Route::post('refresh', 'AuthController@refresh');
        Route::get('user', 'AuthController@user');
        Route::get('me', 'AuthController@me');
        Route::post('logout', 'AuthController@logout');
    });
});
Route::namespace('Auth')->group(function() {
    Route::group(['middleware' => [/* 'jwt.verify', */ 'jwt'/* , 'jwt.refresh' */]], function () {
        Route::post('updatePassword', 'UpdatePasswordController@updatePassword');
    });
});
Route::namespace('Api')->group(function() {
    /* All the regular actions are under token authorization */
    // Route::middleware([/* 'jwt.verify', */ 'session'])->group(function () {
    Route::group(['middleware' => [/* 'jwt.verify', */ 'jwt'/* , 'jwt.refresh' */]], function () {
        /* Belts */
        Route::post('autoBelts', 'BeltsController@autoBelts');
        Route::post('deleteBelts', 'BeltsController@deleteBelts');
        Route::post('updateBelts', 'BeltsController@updateBelts');
        /* Customers */
        Route::get('customers', 'CustomersController@index');
        Route::get('customer/{id}', 'CustomersController@show');
        Route::get('customer/{id}/images', 'CustomersController@getImages');
        Route::put('customer/{id}/edit', 'CustomersController@edit');
        Route::post('newCustomer', 'CustomersController@newCustomer');
        Route::post('updatePaymentData', 'CustomersController@updatePaymentData');
        /* Payments */
        Route::post('deletePayments', 'PaymentsController@deletePayments');
        Route::post('monthlyPayments', 'PaymentsController@monthlyPayments');
        Route::post('newPayment', 'PaymentsController@newPayment');
        Route::post('updatePayments', 'PaymentsController@updatePayments');
        Route::post('editPaymentsManual', 'PaymentsController@editPaymentsManual')->middleware('isRoot');
        /* Users */
        Route::post('register', 'UsersController@register')->middleware('isRoot');
        Route::post('usersearch', 'UsersController@search');
        Route::get('getUsers', 'UsersController@index')->middleware('isRoot');
        Route::get('showNews', 'UsersController@showNews');
        Route::post('unwantNews', 'UsersController@unwantNews');
        Route::post('wantNews', 'UsersController@wantNews')->middleware('isRoot');
        Route::post('update', 'UsersController@update')->middleware('isRoot');
        /* Session */
        Route::post('updateSession', 'SessionController@updateSession');
        Route::get('getSessions', 'SessionController@getSessions')->middleware('isRoot');
        /* Tests */
        Route::get('getAllTests', 'TestsController@getAllTests')->middleware('isRoot');
        Route::get('getTests', 'TestsController@getTests');
        Route::post('saveTests', 'TestsController@saveTests');
    });
});

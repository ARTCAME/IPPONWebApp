<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Socios;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer\SMTP;
use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\PHPMailer;
use App\Http\Controllers\Controller;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

class PaymentsController extends Controller {
    /**
     * Function to delete individual payments
     */
    public function deletePayments(Request $request) {
        try {
            $item = $request->item;
            $customer = Socios::find($item['_id']);
            $payment = array_values(array_filter($customer->payments, function($payment) use($item){
                return $payment['payment_id'] == $item['payment_id'];
            }));
            if (sizeof($payment) == 1) {
                $customer->pull('payments', $payment);
                return [
                    'status' => 'success',
                    'message' => 'El pago se ha borrado',
                    'data' => $customer,
                ];
            } else {
                /* This options are less than impossible but... verbosity is my friend */
                if (sizeof($payment) > 1) {
                    throw new Exception('El id de pago está duplicado, comunícalo al administrador: id socio: ' . $item['_id'] . 'id pago: ' . $item['payment_id']);
                } else if (sizeof($payment) < 1) {
                    throw new Exception('No existe ningún pago con los datos aportados: id socio: ' . $item['_id'] . 'id pago: ' . $item['payment_id']);
                }
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al borrar el pago. Código de error: BePaCo@DePa',
                'status' => 'danger',
                'title' => 'Registro de nuevo pago',
                'trace' => 'Error al borrar el pago. Código de error: BePaCo@DePa. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Function to custom mongo queries, is not used on the app, its only for admin purposes
     */
    public function editPaymentsManual() {
        $customers = Socios::all();
        $arr = [];
        $nullKeys = ['sign', 'image', 'tutor', 'paymentData.iban', 'paymentData.ibanownername', 'paymentData.ibanownerdni'];
        $arrKeys = ['phones', 'emails', 'contacts', 'payments', 'notes'];
        foreach ($customers as $customer) {
            $wasUpdated = false;
            // // DELETE THE BELTS OF THE NO KARATE CUSTOMERS
            // if (isset($customer['belts']) && !preg_match('/karate/i', $customer['paymentData.rate'])) {
            //     $customer->unset('belts');
            //     $wasUpdated = true;
            // }
            // // DELETE THE NULL KEYS THAT ARE NO LONGER NECESSARY TO EXISTS AS NULL
            // foreach ($nullKeys as $key) {
            //     if ($customer[$key] == null) {
            //         $customer->unset($key);
            //         $wasUpdated = true;
            //     }
            // }
            // // DELETE THE EMPTY ARRAYS
            // foreach ($arrKeys as $key) {
            //     if (isset($customer[$key]) && sizeof($customer[$key]) == 0) {
            //         $customer->unset($key);
            //         $wasUpdated = true;
            //     }
            // }
            // // DELETE TUTOR NULLS, EMTPY ARRAYS AND SET THE NOTES IF EXISTS
            // if (isset($customer['tutor'])) {
            //     foreach (['tutor._id', 'tutor.customerNumber', 'tutor.notes'] as $key) {
            //         if ($customer[$key] == null) {
            //             $customer->unset($key);
            //             $wasUpdated = true;
            //         }
            //     }
            //     foreach (['phones', 'emails'] as $key) {
            //         if (isset($customer[$key]) && sizeof($customer[$key]) == 0) {
            //             $customer->unset($key);
            //             $wasUpdated = true;
            //         }
            //     }
            //     if ($customer['tutor.notes'] != null) {
            //         $arrNotes = [$customer['tutor.notes']];
            //         $customer['tutor.notes'] = $arrNotes;
            //         $wasUpdated = true;
            //     }
            // }
            // SET THE PAYMENT TYPE AND PAYMENT_ID
            // foreach ($customer['payments'] as $idx => $payment) {
            //     $wasUpdated = false;
            //     if (!isset($payment['type'])) {
            //         $payment['type'] = 'periodic'; /* Assign the new value on the referenced and no linked array with the payment data */
            //         $wasUpdated = true;
            //     }
            //     if (!isset($payment['payment_id'])) {
            //         $payment['payment_id'] = $customer['_id'] . '_' . $payment['dategenerated'] . '_' . new \MongoDB\BSON\ObjectID();;
            //         $wasUpdated = true;
            //     }
            //     $customer['payments.'.$idx] = $payment; /* Assign to the customer the new data */
            // }

            if ($wasUpdated == true) {
                array_push($arr, $customer);
                // $customer->save(); /* Save the customer */
            }
        }
        return response()->json([ $arr ]);
    }
    /**
     * Function that register all the payments of the socios via monthly schedule
     */
    public static function monthlyPayments() {
        /* Get the active customers */
        $customers = DB::collection('customers')->where('active', true)->get(); /* The db active only customers */
        $date = new \MongoDB\BSON\UTCDateTime(new \DateTime('now')); /* Current date */
        $filename = date('Y_m_d_H-i-s') . '_Remesa_.csv'; /* Csv filename */
        $csvoutput = fopen($filename, 'w'); /* Csv file pointer */
        $csvData = []; /* The csv data of the bank payments to add to the csv file */

        /* Function to generate the csv data for the bank payments */
        $generateCsvData = function($payment) use(&$csvData) {
            /* Search the payment iban on the csv data array to combine or not the data with a previous same iban payment */
            $searchIban = array_search($payment['iban'], array_column($csvData, 'iban'));
            /* If don't find the iban on the current csv data, push the payment data to the csv data, note the rate is a composed value */
            if ($searchIban === false) {
                array_push($csvData, ['name' => $payment['ibanownername'], 'dni' => $payment['ibanownerdni'], 'iban' => $payment['iban'], 'amount' => $payment['amount'], 'interval' => $payment['interval'], 'rate' => $payment['customerName'] . ' - ' . $payment['rate'] . ' - ' . $payment['amount']]);
            /* If the iban exists on the current csv data combine the existing and the new data. The new data to combine is from the payment that can be an existing pending payment or a new payment generated. Note that the app presumes the ibanownername is the same on payments with the same iban, if the user chooses different owners only remains the first on the csvData */
            } else {
                /* Sum the amounts */
                (float)$csvData[array_search($payment['iban'], array_column($csvData, 'iban'))]['amount'] += (float)$payment['amount'];
                /* Combine the rate column */
                $csvData[array_search($payment['iban'], array_column($csvData, 'iban'))]['rate'] .= ', ' . $payment['customerName'] . ' - ' . $payment['rate'] . ' - ' . $payment['amount'];
                /* Combine the interval column */
                $existingInterval = $csvData[array_search($payment['iban'], array_column($csvData, 'iban'))]['interval'];
                if ($existingInterval == $payment['interval']) {
                    $existingInterval = 'Múltiples intervalos';
                }
            }
        };
        /* Iterate over all the active customers */
        foreach ($customers as $customer) {
            $newPayment = []; /* Will store the new payment data for the customer */
            $auxPaymentData = $customer['paymentData'];
            /* Iterate over the customer payments to check if has a payment for the current period. On the periodic payments the period will be the interval, on the manual payments the period can be the interval and the dategenerated or if it the interval is null only use the dategenerated */
            $alreadyGenerated = false; /* Flag to avoid generate a new payment if a periodic was previosly generated for this customer*/
            /* If the customer has payments, if not the payment will be created directly */
            if (isset($customer['payments'])) {
                foreach ($customer['payments'] as $payment) {
                    if ((($payment['type'] === 'periodic' && $payment['interval'] === date('Y-m')) || ($payment['type'] === 'manual' && (((!isset($payment['interval']) || $payment['interval'] === date('Y-m')) && $payment['dategenerated']->toDateTime()->format('Y-m') === date('Y-m')))))) {
                        /* If the payment is periodic, activate the flag to avoid creating a new payment for this customer. Just in case, the manuals doesn't count */
                        if ($payment['type'] === 'periodic') {
                            $alreadyGenerated = true;
                        }
                        /* If the payment exists and the status is pending and the payment mode is via bank add it to the csvData of the bank payments */
                        if ($payment['status'] === 'Pendiente' && $payment['paymenttype'] === 'Domiciliación') {
                            $auxPayment = $payment;
                            $auxPayment['customerName'] = $customer['name']; /* Assign the name of the customer to add it to the csv row */
                            $generateCsvData($auxPayment);
                        }
                    }
                }
            }
            /* If doesn't exists a payment registered for this month we create and save it on the customer based on the last payments attributes, here we create all the non manual created monthly payments, later treat the inbank payments to generate the csv bank data */
            if (!$alreadyGenerated) {
                $newPayment['payment_id'] = $customer['_id'] . '_' . $date . '_' . new \MongoDB\BSON\ObjectID();
                $newPayment['type'] = 'periodic';
                $newPayment['rate'] = $auxPaymentData['rate'];
                $newPayment['amount'] = $auxPaymentData['amount'];
                $newPayment['paymenttype'] = $auxPaymentData['paymenttype'];
                /* The bank data keys are only added if a value exists */
                if ($auxPaymentData['paymenttype'] == 'Domiciliación') {
                    $newPayment['iban'] = $auxPaymentData['iban'];
                    $newPayment['ibanownername'] = $auxPaymentData['ibanownername'];
                    $newPayment['ibanownerdni'] = $auxPaymentData['ibanownerdni'];
                }
                $newPayment['interval'] = date('Y-m');
                $newPayment['status'] = 'Pendiente';
                $newPayment['dategenerated'] = $date;
                $newPayment['dateconfirmed'] = null;
                $auxCustomer = Socios::find($customer['_id']);
                $auxCustomer->push('payments', $newPayment);
                $auxCustomer->save();
                /* Manage utf8 characters */
                fprintf($csvoutput, chr(0xEF).chr(0xBB).chr(0xBF));
                /* If the new payment is via bank add it to the csvData */
                if ($newPayment['paymenttype'] === 'Domiciliación') {
                    $newPayment['customerName'] = $customer['name']; /* Assign the name of the customer to add it to the csv row */
                    $generateCsvData($newPayment);
                }
            }
        }
        /* Add the array data to the csv file */
        if (sizeof($csvData) > 0) {
            /* Put the customer/payment data into the csv file */
            fputcsv($csvoutput, ['Titular', 'Dni del titular', 'Iban', 'Importe', 'Periodo', 'Detalle tarifas y socios para el iban'], ";");
            foreach ($csvData as $data) {
                fputcsv($csvoutput, $data, ";");
            }
        }
        /* Send email with the file generated */
        $mail = new PHPMailer();
        $mail->CharSet = 'UTF-8';
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host     = env('MAIL_HOST');
        $mail->SMTPAuth   = true;
        $mail->Username   = env('MAIL_USERNAME', '');
        /* Using Google app password */
        $mail->Password   = env('MAIL_PASSWORD', '');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = env('MAIL_PORT', '');
        $mail->setFrom('ippongymzaragoza@gmail.com', 'IPPONGYM ZARAGOZA');
        $mail->addAddress('arzzz@hotmail.es', 'Arturo Casas');
        $mail->addAddress('ippongymzaragoza@gmail.com', 'IPPONGYM ZARAGOZA');
        $mail->addAttachment($filename);
        $mail->isHTML(true);
        $mail->Subject = 'Remesa mensual';
        $mail->Body    = filesize($filename) == 0 ? 'No hay remesas para este mes' : 'Adjunto a este correo tienes los datos de los pagos domiciliados para enviar a la entidad bancaria.';
        $mail->AltBody = filesize($filename) == 0 ? 'No hay remesas para este mes' : 'Adjunto a este correo tienes los datos de los pagos domiciliados para enviar a la entidad bancaria.';
        $mail->send();
        /* Close and delete the file generated */
        fclose($csvoutput);
        unlink($filename);
    }
    /**
     * Function called when a new payment is registered. The new payment can have totally different compared with the default customer profile data, here we save the data provided by the new payment save process and ignore the default customer payment data
     *
     * @param Request { item } -> the new payment data
     */
    public static function newPayment(Request $request) {
        try {
            $item = $request->item; /* Store new payment data from the front end */
            $newDate = new \MongoDB\BSON\UTCDateTime(new \DateTime('now')); /* Store the date generated for the payment */
            $newPayment = []; /* Initialize the storer for the new payment data */
            $customer = Socios::find($item['_id']); /* Get the customer */
            $manual = $item['type'] == 'manual'; /* Provide a flag to determine if a payment is or not periodic */
            /* If the new payment is not manual check if exists on the payments array of the customer */
            $existsPeriodicPayment = false;
            if (!$manual && isset($customer->payments)) {
                foreach ($customer->payments as $payment) {
                    /* Check on the periodic payments if the new periodic payment exists by interval and its confirmed */
                    if ($payment['type'] == 'periodic' && $payment['interval'] == $item['interval'] && $payment['status'] == 'Confirmado') {
                        $existsPeriodicPayment = true;
                    }
                }
            }
            /* If the periodic payment doesn't exists or is a manual payment */
            if ((!$manual && !$existsPeriodicPayment) || $manual) {
                $newPayment['payment_id'] = $customer['_id'] . '_' . $newDate . '_' . new \MongoDB\BSON\ObjectID();
                $newPayment['type'] = $item['type'];
                $newPayment['rate'] = $item['rate'];
                $newPayment['amount'] = $item['amount'];
                $newPayment['paymenttype'] = $item['paymenttype'];
                if ($item['interval'] != null) {
                    $newPayment['interval'] = $item['interval'];
                }
                /* The bank data keys are only added if a value exists */
                if ($item['paymenttype'] == 'Domiciliación') {
                    $newPayment['iban'] = $item['iban'];
                    $newPayment['ibanownerdni'] = $item['ibanownerdni'];
                    $newPayment['ibanownername'] = $item['ibanownername'];
                }
                $newPayment['dategenerated'] = $newDate;
                $newPayment['status'] = $item['status'];
                $newPayment['dateconfirmed'] = $newPayment['status'] != 'Pendiente' ? new \MongoDB\BSON\UTCDateTime(new \DateTime($item['dateconfirmed'])) : null;
                $customer->push('payments', $newPayment);
                return $newPayment;
            } else if (!$manual && $existsPeriodicPayment) {
                return response()->json([
                    'message' => 'Ya existe un pago registrado para este mes.',
                    'socio' => $customer, /* Necessary ? */
                    'status' => 'warning',
                    'title' => 'Registro de pago',
                    'trace' => 'No se ha registrado el pago. Ya existe uno para el mismo periodo de pago',
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al generar el nuevo pago. Código de error: BePaCo@NePa',
                'status' => 'danger',
                'title' => 'Registro de nuevo pago',
                'trace' => 'Error al generar el nuevo pago. Código de error: BePaCo@NePa. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Function to update the data of registered payments. Can be called individually (from payments or newPayments to confirm states) or massive from payments
     *
     * @param Request { data, date, action } data: the current payment data to apply, date (optional): the new date value, action: the action required
     */
    public function updatePayments(Request $request) {
        $arr_updated = [];
        $interval_err = [];
        // if ($request->action == 'updating') {
        //     /* If the date is provided transforms it to the mongo format */
        //     $newDateConfirmed = $request->date == null ? $request->date : new \MongoDB\BSON\UTCDateTime(new \DateTime($request->date));
        // } else if ($request->action == 'confirmado' || $request->action == 'devuelto') {
        //     $newDateConfirmed = new \MongoDB\BSON\UTCDateTime(new \DateTime('now'));
        // }
        try {
            foreach($request->data as $el) {
                $customer = Socios::find($el['_id']);
                /* If a update of a individual payment was requested */
                if ($request->action == 'updating') {
                    $newDateConfirmed = ($el['dateconfirmed'] == '' || $el['dateconfirmed'] == null) ? '' : new \MongoDB\BSON\UTCDateTime(new \DateTime($el['dateconfirmed']));
                    foreach($customer['payments'] as $idx => $payment) {
                        if ($payment['payment_id'] == $el['payment_id']) {
                            /* Only the bank payments can be 'Devueltos', throw an error if a no bank payment will be updated with this state */
                            if ($el['status'] == 'Devuelto' && $el['paymenttype'] != 'Domiciliación') {
                                throw new Exception('Un pago no domiciliado no puede guardarse como devuelto');
                            /* The confirmed periodic payments are unique by they interval, cannot be two for the same interval/customer, if is attempting to do this throw an error */
                            } else if ($el['type'] == 'periodic' && $el['status'] != 'Pendiente' && sizeof(array_filter($customer['payments'], function($payment) use($el) { return $payment['interval'] == $el['interval'] && $payment['payment_id'] !== $el['payment_id'] && $payment['status'] != 'Pendiente';})) > 0) {
                                throw new Exception('No puede haber dos pagos periódicos para el mismo intervalo');
                            } else {
                                $payment['type'] = $el['type'];
                                $payment['interval'] = $el['interval'];
                                $payment['rate'] = $el['rate'];
                                $payment['amount'] = (float) $el['amount'];
                                $payment['status'] = $el['status'];
                                $payment['paymenttype'] = $el['paymenttype'];
                                if ($el['paymenttype'] == 'Domiciliación') {
                                    $payment['iban'] = $el['iban'];
                                    $payment['ibanownername'] = $el['ibanownername'];
                                    $payment['ibanownerdni'] = $el['ibanownerdni'];
                                } else {
                                    if (isset($payment['iban'])) unset($payment['iban']);
                                    if (isset($payment['ibanownername'])) unset($payment['ibanownername']);
                                    if (isset($payment['ibanownerdni'])) unset($payment['ibanownerdni']);
                                }
                                // $payment['dateconfirmed'] = $newDateConfirmed; /* Can be null when the status is 'Pendiente' or a date when the new status is 'Confirmado' or 'Devuelto' */
                                $payment['dateconfirmed'] = $el['status'] == 'Pendiente' ? '' : $newDateConfirmed; /* Can be null when the status is 'Pendiente' or a date when the new status is 'Confirmado' or 'Devuelto' */
                                $customer['payments.' . $idx] = $payment;
                                $customer->save();
                                /* Add the id of the customer for the front end process */
                                $payment['_id'] = $customer['_id'];
                                array_push($arr_updated, $payment);
                                return [
                                    'message' => 'Se ha actualizado el pago.',
                                    'status' => 'success',
                                    'updated' => $arr_updated,
                                    // 'updated' => $payment,
                                ];
                            }
                        }
                    }
                    return [
                        'message' => 'No se ha actualizado ningún pago.',
                        'status' => 'danger',
                    ];
                /* If a confirmation of state of a payment was requested, these actions are called massively on some payments */
                } else if ($request->action == 'confirmado' || $request->action == 'devuelto') {
                    $newDateConfirmed = ($el['dateconfirmed'] == '' || $el['dateconfirmed'] == null) ? new \MongoDB\BSON\UTCDateTime(new \DateTime('now')) : new \MongoDB\BSON\UTCDateTime(new \DateTime($el['dateconfirmed']));
                    foreach($customer['payments'] as $idx => $payment) {
                        /* Update the payments search by payment_id */
                        if ($payment['payment_id'] == $el['payment_id']) {
                            /* The confirmed periodic payments are unique by they interval, cannot be two for the same interval/customer, if is attempting to do this store does not store it at the db */
                            if ($payment['type'] == 'periodic' && sizeof(array_filter($customer['payments'], function($inpayment) use($payment) { return $inpayment['interval'] == $payment['interval'] && $inpayment['payment_id'] !== $payment['payment_id'] && $inpayment['status'] != 'Pendiente' && $inpayment['type'] == 'periodic';})) > 0) {
                                /* Add the id of the customer for the front end process */
                                $payment['_id'] = $customer['_id'];
                                array_push($interval_err, $payment);
                            } else {
                                $payment['status'] = ucFirst($request->action);
                                $payment['dateconfirmed'] = $newDateConfirmed;
                                $customer['payments.' . $idx] = $payment;
                                $customer->save();
                                /* Add the id of the customer for the front end process */
                                $payment['_id'] = $customer['_id'];
                                array_push($arr_updated, $payment);
                            }
                        }
                    }
                }
            }
            return [
                'message' => sizeof($arr_updated) == 0 ? 'No se ha actualizado ningún pago.' : (sizeof($arr_updated) == 1 ? 'Se ha actualizado el estado del pago.' : 'Se ha actualizado el estado de los pagos.'),
                'number' => sizeof($arr_updated),
                'status' => 'success',
                'title' => 'Actualización de pagos',
                'updated' => $arr_updated,
                'interval_err' => $interval_err,
            ];
        } catch (Exception $e) {
            return response()->json([
                'status' => 'danger',
                'message' => 'Algo no ha ido bien. Vuelve a intentarlo. Código de error: BePaCo@UpPa',
                'title' => 'Actualización de pagos',
                'trace' => 'Error al registrar los cambios. Código de error: BePaCo@UpPa. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Socios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


class CustomersController extends Controller {
    /**
     * Stores the update of a customer, auto discard the changes on _id and customerNumber (never will be modified), creation and update dates or payments that are modified in other way. The function wil add the new keys and remove the unexisting
     *
     * @param String $id: the id of the customer to update
     * @param Request $request: the form with the data to update
     *
     * @return Response|Array If an error ocurs return a response with the error data. If everything is correct return a regular array.
     */
    public function edit($id, Request $request) {
        $valid = $this->validData($request);
        $updated = false;
        /* If the validations has been passed */
        if ($valid === true) {
            try {
                $customer = Socios::find($id);
                /* Assign the new values */
                foreach ($request->all() as $req_field => $req_value) {
                    /* Only treat the updatable fields */
                    if ($req_field != 'updated_at' && $req_field != 'created_at' && $req_field != '_id' && $req_field != 'customerNumber' && $req_field != 'payments') {
                        /* If the field comes with a different value than the customer or the field doen't exists on the customer store it */
                        if (!isset($customer->$req_field) || $customer->$req_field != $req_value) {
                            $customer->$req_field = $req_value;
                            $updated = true;
                        }
                    }
                }
                /* Delete on the customer the deleted fields on the view */
                foreach ($customer->getAttributes() as $customer_field => $customer_value) {
                    if ($customer_field != 'updated_at' && $customer_field != 'created_at' && $customer_field != '_id' && $customer_field != 'customerNumber' && $customer_field != 'payments' && !array_key_exists($customer_field, $request->all())) {
                        $customer->unset($customer_field);
                        $updated = true;
                    }
                }
                if (!$updated) {
                    return [
                        'message' => 'No había ningún cambio.',
                        'status' => 'warning',
                        'title' => 'Edición de socio',
                        'no_changes' => true,
                        'editedCustomer' => $customer,
                    ];
                } else {
                    $customer->save();
                    return [
                        'editedCustomer' => $customer,
                        'message' => 'Socio actualizado correctamente.',
                        'status' => 'success',
                        'title' => 'Edición de socio',
                    ];
                }
            } catch (Exception $e) {
                return response()->json([
                    'message' => 'Error al guardar los datos. Código de error: BeCuCo@Ed',
                    'status' => 'danger',
                    'title' => 'Edición de socio',
                    'trace' => 'Error al guardar los datos editados del socio. Código de error: BeCuCo@Ed. Detalle del servidor: ' . $e->getMessage(),
                ], 500);
            }
        } else {
            return $valid;
        }
    }
    /**
     * Gets all the customers from the database
     *
     * @return Response If the customers was retrieved returns it, if not returns a error message
     */
    public function index() {
        try {
            return DB::collection('customers')
                        ->project(['sign' => false, 'image' => false]) /* On the mass customers download, doesn't require the images */
                        ->get();
            // return DB::collection('customers')->get();
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los socios de la base de datos. Código de error BeCuCo@In',
                'status' => 'danger',
                'title' => 'Obtener socios',
                'trace' => 'Error al obtener los datos de la base de datos. Código de error: BeCuCo@In. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Stores a new customer
     *
     * @param Request $request: the form data to store
     *
     * @return Response|Array If an error ocurs return a response with the error data. If everything is correct return a regular array.
     */
    public function newCustomer(Request $request) {
        /* Validate the data */
        $valid = $this->validData($request);
        if ($valid === true) {
            $newCustomer = new Socios;
            try {
                /* Stores all the fields received except the _id that is generated by mongo */
                foreach ($request->all() as $field => $value) {
                    if ($field != '_id') {
                        $newCustomer->$field = $value;
                    }
                }
                /* Determine the last customer number assigned to assign correctly to the current save */
                $lastCustomerNumber = 0;
                foreach ($this->index() as $customer) {
                    $lastCustomerNumber = $customer['customerNumber'] > $lastCustomerNumber ? $customer['customerNumber'] : $lastCustomerNumber;
                }
                $newCustomer->customerNumber = ++$lastCustomerNumber;
                $newCustomer->save();
                return [
                    'newCustomer' => $newCustomer,
                    'message' => 'Socio creado correctamente.',
                    'status' => 'success',
                    'title' => 'Creación de socio',
                ];
            } catch (Exception $e) {
                return response()->json([
                    'message' => 'Error al registrar al nuevo socio. Código de error: BeCuCo@NeCu',
                    'status' => 'danger',
                    'title' => 'Creación de socio',
                    'trace' => 'Error al guardar los datos del nuevo socio. Código de error: BeCuCo@NeCu. Detalle del servidor: ' . $e->getMessage(),
                ], 500);
            }
        } else {
            return $valid;
        }
    }
    /**
     * Returns the customer images requested, can be the image avatar or the signature or both
     *
     * @param String $id: The id of the customer to search
     * @param Boolean sign: Flag to determine if is requested
     * @param Boolean image: Flag to determine if is requested
     *
     * @return Object with the requested data
     */
    public function getImages($id, Request $request) {
        $fields = [];
        if ($request->sign == true) {
            array_push($fields, 'sign');
        }
        if ($request->image == true) {
            array_push($fields, 'image');
        }
        $customerImages = Socios::select($fields)->find($id);
        /* If the customer is not founded return 404 */
        if ($customerImages == null) {
            return '404';
        }
        return $customerImages;
    }
    /**
     * Find a customer by id
     *
     * @param String $id: The id of the customer to search
     *
     * @return Socio|Null when everything was correct return the customer data, if not, returns a flag to navigate to a 404 page
     */
    public function show($id) {
        $customer = Socios::find($id);
        if ($customer == null) {
            return '404';
        }
        return $customer;
    }
    /**
     * Validates the customer form on saves or updates
     *
     * @param Request $request: the form data to check
     *
     * @return Response|Boolean If the validation fails returns a response to vue with the errors. If the validation pass returns true to the caller function
     */
    private function validData(Request $request) {
        $data = $request->all();
        $rules = [
            'name' => 'required',
            'dni' => 'required',
            // 'sign' => 'required', // the sign is no required for now to pevent fails
            'dateofbirth' => 'required|date',
            'paymentData.rate' => 'required',
            'paymentData.paymenttype' => 'required',
            'paymentData.amount' => 'required',
            'rightsProtect.RPaccept' => 'required',
            'rightsImage.RIaccept' => 'required',
        ];
        if ($request->paymentData['paymenttype'] == 'Domiciliación') {
            $rules += ['paymentData.iban' => 'required'];
            $rules += ['paymentData.ibanownername' => 'required'];
            $rules += ['paymentData.ibanownerdni' => 'required'];
        }
        if ($request->dateofbirth != null && date_diff(date_create(date('Y-m-d')), date_create($request->dateofbirth))->y < 18) {
            /* If the customer is underage his dni is not required */
            unset($rules['dni']);
            /* If a tutor is added and it doesn't comes with _id (in this case we only store the _id as a reference of the customer selected), validate that we have the required fields */
            if (!isset($data['tutor']['_id'])) {
                $rules += [
                    'tutor.name' => 'required',
                    'tutor.address' => 'required',
                ];
                /* If the dni of the customer is empty the tutor's dni must be required */
                if ($request->dni == '' || $request->dni == null) {
                    $rules += [ 'tutor.dni' => 'required' ];
                }
            }
        }
        /* Build the error message */
        $messages = [
            'name.required' => 'El nombre es obligatorio',
            'dni.required' => 'El dni es obligatorio',
            'dateofbirth.required'  => 'La fecha de nacimiento es obligatoria',
            // 'sign.required'  => 'La firma del socio es obligatoria',
            'tutor.name.required' => 'El nombre del tutor es obligatorio',
            'tutor.dni.required' => 'El dni del tutor es obligatorio',
            'tutor.address.required' => 'La dirección del tutor es obligatoria',
            'paymentData.rate.required' => 'Tienes que escoger una tarifa',
            'paymentData.paymenttype.required' => 'Tienes que escoger una forma de pago',
            'paymentData.amount.required' => 'Tienes que indicar un importe para la cuota',
            'paymentData.iban.required' => 'Tienes que añadir el iban para el pago domiciliado',
            'paymentData.ibanownername.required' => 'El nombre del titular del iban son necesarios',
            'paymentData.ibanownerdni.required' => 'El dni del titular del iban son necesarios',
            'rightsProtect.RPaccept.required' => 'Indica si acepta el consentimiento expreso',
            'rightsImage.RIaccept.required' => 'Indica si acepta la cesión de imagen',

        ];
        /* Validate the form */
        $v = Validator::make($data, $rules, $messages);
        /* Return the errors if exists */
        if ($v->fails()) {
            return response()->json([
                'message' => 'Se han producido los siguientes errores:',
                'status' => 'danger',
                'title' => 'Error al validar los datos',
                'trace' => 'Error al validar los datos del nuevo socio, no se han guardado. Código de error: BeCuCo@VaDa. Detalle del servidor: ' . $v->errors(),
                'validationErrors' => $v->errors(),
            ], 422);
        }
        return true;
    }
}

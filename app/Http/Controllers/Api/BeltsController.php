<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Socios;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BeltsController extends Controller {
    /**
     * Function to massive add grades to customers. Receives the rows from a table with the data to store on the database, treat it and return the modifications
     *
     * @param Request { date, socios }: the date to set and the customers to update
     *
     * @return Array of Objects updated
     */
    public function autoBelts(Request $request) {
        try {
            $result = [];
            foreach($request->customers as $passed_customer) {
                $customer = Socios::find($passed_customer['_id']);
                foreach ($customer['belts'] as $idx => $belt) {
                    if (strcmp($belt['grade'], $passed_customer['nextGrade']) == 0 && $belt['date'] == null) {
                        $customer['belts.' . $idx . '.date'] = $request->date;
                        $customer->save();
                        array_push($result, [
                            'message' => 'Se ha añadido el nuevo grado.',
                            'nextGrade' => $belt['grade'],
                            'customer' => $customer,
                            'status' => 'success',
                        ]);
                    } else if (strcmp($belt['grade'], $passed_customer['nextGrade']) == 0 && $belt['date'] != null) {
                        array_push($result, [
                            'message' => 'No se ha actualizado el grado ya que, el socio ya lo tiene.',
                            'customer' => $customer,
                            'status' => 'error',
                        ]);
                    }
                }
            }
            return $result;
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al gestionar los cinturones. Código de error BeBeCo@AuBe',
                'status' => 'danger',
                'title' => 'Actualizar cinturones',
                'trace' => 'Error al gestionar los cinturones. Código de error BeBeCo@AuBe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Function to delete cinturones
     *
     * @param Request { id, cinturones }: id of the customer to modify and grades to delete
     *
     * @return Array of grades with the modifications requestes applied
     */
    public function deleteBelts(Request $request) {
        try {
            $customer = Socios::find($request->id);
            foreach ($request->belts as $passed_belt) {
                foreach ($customer->belts as $idx => $belt) {
                    if ($passed_belt['grade'] == $belt['grade']) {
                        $customer['belts.' . $idx . '.date'] = null;
                        $customer->save();
                    }
                }
            }
            return [
                'status' => 'success',
                'deletedBelts' => $customer['belts'],
            ];
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al registrar los cambios. Código de error BeBeCo@DeBe',
                'status' => 'danger',
                'title' => 'Actualizar cinturones',
                'trace' => 'Error al registrar los cambios. Código de error BeBeCo@DeBe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Function that 'undo' previous massive changes made on the database on where being recovered via cookies. The data to recover is copied from the request literally to the database
     *
     * @param Request { socios }: selected customers
     *
     * @return Array of Objects updated
     */
    public function deshacerAutoCinturones(Request $request) {
        try {
            $result_data = [];
            foreach($request->socios as $socio) {
                $db_socio = Socios::find($socio['id']);
                $db_socio->belts = $socio['belts'];
                $db_socio->save();
                array_push($result_data, $socio);
            }
            return $result_data;
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar los datos. Código de error BeBeCo@DeAuCi',
                'status' => 'danger',
                'title' => 'Deshaciendo cambios',
                'trace' => 'Error al actualizar los datos. Código de error BeBeCo@DeAuCi. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Function to add the grades on customers individually
     *
     * @param Request { id, grade, fecha }: the id of the customer, the new grade to push on it and the date for this new grade
     *
     * @return Array with custom data to show it on the view, if everything goes fine returns the modified data
     */
    public function updateBelts(Request $request) {
        try {
            $customer = Socios::find($request->id);
            foreach ($request->belts as $passed_belt) {
                foreach ($customer->belts as $idx => $belt) {
                    if ($passed_belt['grade'] == $belt['grade']) {
                        $customer['belts.' . $idx . '.date'] = $request->date;
                        $customer->save();
                    }
                }
            }
            return [
                'status' => 'success',
                'message' => 'Se han modificado los grados correctamente.',
                'title' => 'Actualización de grados',
                'updatedBelts' => $customer->belts,
            ];
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar los datos. Código de error BeBeCo@UpBe',
                'status' => 'danger',
                'title' => 'Obtener grados',
                'trace' => 'Error al actualizar los datos. Código de error BeBeCo@UpBe. Detalle del servidor: ' . $e->getMessage(),
            ], 500);
        }
    }
}

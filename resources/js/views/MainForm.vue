<template>
    <div>
        <!-- <b-form @submit.prevent="$route.name == 'customers.edit' ? submitEdit() : $route.name == 'customers.new' ? submit() : null"> -->
        <b-form @submit.prevent="submit">
            <b-skeleton-wrapper
                :loading="loadingCustomer">
                <!-- Loading skeleton -->
                <template
                    #loading>
                    <b-card no-body>
                        <b-card-body>
                            <b-form-group>
                                <b-skeleton height="calc(40px + (70 - 40) * ((100vw - 300px) / (1600 - 300)))"></b-skeleton>
                                <b-skeleton width="200px"></b-skeleton>
                            </b-form-group>
                            <b-container class="col-sm" fluid>
                                <b-row>
                                    <b-col xl="3">
                                        <b-skeleton class="m-auto" height="200px" type="avatar" width="200px"></b-skeleton>
                                    </b-col>
                                    <b-col class="px-0 px-xl-1" xl="9">
                                        <b-row class="mb-2 mt-3 mt-xl-0">
                                            <b-col>
                                                <b-skeleton width="100px"></b-skeleton>
                                                <b-skeleton height="32px" type="input" width="100%"></b-skeleton>
                                            </b-col>
                                            <b-col>
                                                <b-skeleton width="100px"></b-skeleton>
                                                <b-skeleton height="32px" type="input" width="100%"></b-skeleton>
                                            </b-col>
                                        </b-row>
                                        <b-form-group>
                                            <b-skeleton width="100px"></b-skeleton>
                                            <b-skeleton type="input"></b-skeleton>
                                        </b-form-group>
                                        <b-form-group>
                                            <b-skeleton width="100px"></b-skeleton>
                                            <b-skeleton type="input"></b-skeleton>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-container>
                            <b-form-group>
                                <b-row>
                                    <b-col>
                                        <b-skeleton width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col>
                                        <b-skeleton width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group>
                                <b-skeleton width="100px"></b-skeleton>
                                <b-skeleton type="input"></b-skeleton>
                            </b-form-group>
                            <b-form-group>
                                <b-row>
                                    <b-col cols="12" sm="6" lg="auto">
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col cols="12" sm="6" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col cols="12" sm="6" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col cols="12" sm="6" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group>
                                <b-skeleton height="calc(40px + (70 - 40) * ((100vw - 300px) / (1600 - 300)))"></b-skeleton>
                                <b-row class="mt-3">
                                    <b-col cols="12" sm="4" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col cols="12" sm="4" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                    <b-col cols="12" sm="4" lg>
                                        <b-skeleton class="mt-2 mt-lg-0" width="100px"></b-skeleton>
                                        <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group>
                                <b-skeleton-img height="200px" no-aspect width="342px"></b-skeleton-img>
                            </b-form-group>
                            <b-form-group>
                                <b-skeleton width="100px"></b-skeleton>
                                <b-skeleton type="input"></b-skeleton>
                            </b-form-group>
                            <b-form-group>
                                <b-skeleton width="100px"></b-skeleton>
                                <b-skeleton type="input"></b-skeleton>
                            </b-form-group>
                        </b-card-body>
                    </b-card>
                </template>
                <b-card no-body>
                    <b-card-body>
                        <b-form-group>
                            <b-row no-gutters>
                                <h5 md="4" class="subtitle">Datos principales</h5>
                                <b-col
                                    cols="12"
                                    v-if="$route.name != 'customers.new'">
                                    <b-row
                                        no-gutters>
                                        <b-col
                                            class="col-11 ml-auto mt-2"
                                            v-if="$route.name != 'customers.new'">
                                            <small class="customer-dates mr-2 text-muted">
                                                Fecha de alta: {{ form.created_at }}
                                            </small>
                                            <small class="customer-dates mr-2 text-muted">
                                                Última actualización: {{ form.updated_at }}
                                            </small>
                                        </b-col>
                                        <b-col class="col-1 mr-auto text-right">
                                            <span
                                                class="d-inline-block"
                                                v-b-tooltip.hover.left.noninteractive
                                                :title="active ? 'Socio activo' : 'Socio inactivo'">
                                                <b-form-checkbox
                                                    class="ml-2 mt-2"
                                                    switch
                                                    v-model="active"
                                                    :disabled="isDisabled || $route.name == 'customers.new'"></b-form-checkbox>
                                            </span>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <b-container fluid class="col-sm">
                            <b-row>
                                <b-col
                                    xl="3"
                                    :class="'px-0' + ($route.name == 'customers.new' ? ' mb-3' : '')">
                                    <WebCam
                                        ref="webcamcomponent"
                                        :isDisabled="isDisabled"></WebCam>
                                </b-col>
    <!-- Id y número de socio -->
                                <!-- Shown on customers.profile and customers.edit pages -->
                                <b-col class="px-0" xl="9">
                                    <b-alert
                                        class="py-1"
                                        variant="info"
                                        :show="isTutor(form._id).length > 0">
                                        Este socio es tutor de
                                        <b-link
                                            class="unformated-link"
                                            target="_blank"
                                            title="Consulta la ficha del socio en una ventana nueva"
                                            v-b-tooltip.top.hover.noninteractive
                                            v-for="(child, index) in isTutor(form._id)"
                                            :key="child._id"
                                            :to="{ name: 'customers.profile', params: { id: child._id } }">
                                            {{ child.name + (index == isTutor(form._id).length - 1 ? '' : ', ') }}
                                        </b-link>
                                    </b-alert>
                                    <b-form-row
                                        v-if="this.$route.params.id"
                                        :class="{ 'mb-4' : $route.name != 'customers.new' }">
                                        <b-col cols="6">
                                            <small class="text-muted">
                                                Número de socio:
                                            </small>
                                            <b-form-input
                                                class="ig-background"
                                                disabled
                                                size="sm"
                                                v-model="form.customerNumber"></b-form-input>
                                        </b-col>
                                        <b-col cols="6">
                                            <small class="text-muted">
                                                Identificador del socio:
                                            </small>
                                            <b-form-input
                                                class="ig-background"
                                                disabled
                                                size="sm"
                                                v-model="form._id"></b-form-input>
                                        </b-col>
                                    </b-form-row>
    <!-- Nombre y apellidos -->
                                    <b-form-group
                                        class="badged-group"
                                        label="Nombre y apellidos"
                                        label-for="nombre">
                                        <b-form-input
                                            autocomplete="off"
                                            debounce="500"
                                            foundable="true"
                                            id="nombre"
                                            name="nombre"
                                            trim
                                            type="text"
                                            v-if="form != null"
                                            v-model="name"
                                            v-validate="'required|alpha_dash'"
                                            :class="{ 'is-invalid' : errors.has('nombre') }"
                                            :disabled="isDisabled"
                                            @drop.prevent
                                            @keypress="$isAlphaDash($event)"
                                            @paste="name = $isAlphaDash($event)"></b-form-input>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-for="error in errors.collect('nombre')"
                                                :key="error">
                                                {{ error }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                        <SearchBadge
                                            field="nombre"
                                            id="sb-customer-name"
                                            searchField="name"
                                            v-if="!isDisabled"
                                            :customer="true"
                                            :searchValue="name"></SearchBadge>
                                    </b-form-group>
    <!-- Dirección principal -->
                                    <b-form-group label="Dirección principal" label-class="m-0" label-for="direccion">
                                        <span class="text-muted">
                                            <small>La dirección debe tener la calle, el número, población y código postal, por ejemplo: Calle Leopoldo Romeo 9, 50002 Zaragoza</small>
                                        </span>
                                        <b-form-input
                                            autocomplete="off"
                                            debounce="500"
                                            id="direccion"
                                            name="direccion"
                                            type="text"
                                            v-if="form != null"
                                            v-model="address"
                                            v-validate="'required'"
                                            :class="{ 'is-invalid' : errors.has('direccion') }"
                                            :disabled="isDisabled"></b-form-input>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-for="error in errors.collect('direccion')"
                                                :key="error">
                                                {{ error }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-container>
    <!-- Teléfono -->
                        <PhoneBase
                            class="mt-2"
                            ref="telefono"
                            target="customer"
                            :inPhones="form.phones"
                            :isDisabled="isDisabled"
                            @input="updateFormData({ field: 'phones', arrayIndex: $event.arrayIndex, newVal: $event.newVal, _id: form._id })"></PhoneBase>
    <!-- Email -->
                        <EmailBase
                            class="mt-2"
                            ref="email"
                            target="customer"
                            :inEmails="form.emails"
                            :isDisabled="isDisabled"
                            @input="updateFormData({ field: 'emails', arrayIndex: $event.emailIndex, newVal: $event.email, _id: form._id })"></EmailBase>
    <!-- Sexo -->
                        <b-form-row no-gutters>
                            <b-form-group
                                class="col col-12 col-sm-6 col-lg-auto"
                                id="sexo-group"
                                label="Sexo"
                                :disabled="isDisabled">
                                <b-form-radio-group
                                    buttons
                                    button-variant="outline-secondary"
                                    class="radio-selector w-100"
                                    id="sexo"
                                    name="sexo"
                                    v-validate="'required'"
                                    :checked="gender"
                                    :class="{ 'is-invalid' : errors.has('sexo') && !isDisabled }"
                                    :options="genders"
                                    :state="errors.has('sexo')"
                                    @change="gender = $event"></b-form-radio-group>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-if="errors.has('sexo')">
                                        {{ errors.first('sexo') }}
                                    </b-form-invalid-feedback>
                                </transition>
                            </b-form-group>
    <!-- Fecha nacimiento -->
                            <b-form-group class="col col-12 col-sm-6 col-lg" label="Fecha de nacimiento" label-for="fechanac">
                                <!-- v-if="form != null" -->
                                <b-form-input
                                    debounce="500"
                                    id="fechanac"
                                    name="fechanac"
                                    type="date"
                                    v-model="dateofbirth"
                                    v-validate="'date_custom_rule|required'"
                                    :class="'mr-1' + (errors.has('fechanac') ? ' is-invalid' : '')"
                                    :max="$moment().set('year', $moment().year() - 1).format('YYYY-MM-DD')"
                                    :min="$moment().set('year', $moment().year() - 129).format('YYYY-MM-DD')"
                                    :disabled="isDisabled"></b-form-input>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-for="error in errors.collect('fechanac')"
                                        :key="error">
                                        {{ error }}
                                    </b-form-invalid-feedback>
                                </transition>
                            </b-form-group>
    <!-- Es menor? -->
                            <b-form-group class="col col-12 col-sm-6 col-lg" label="¿Es menor?" label-for="esmenor">
                                <!-- v-if="form != null" -->
                                <b-form-input
                                    autocomplete="off"
                                    class="col-lg"
                                    disabled
                                    id="esmenor"
                                    type="text"
                                    :value="underage == null ? 'Fecha de nacimiento inválida' : underage == true ? 'Sí' : 'No'"></b-form-input>
                            </b-form-group>
    <!-- Dni -->
                            <b-form-group class="col col-12 col-sm-6 col-lg">
                                <label label-for="dni">
                                    Dni
                                    <transition appear name="slide-fade">
                                        <span
                                            title="Al ser menor puedes dejar este campo vacío e incluir solo el del tutor en los datos del tutor o poner aquí también el del tutor"
                                            v-b-tooltip.hover.noninteractive
                                            v-if="underage == true && !isDisabled">
                                            <fa-icon class="ml-2 text-success" icon="info-circle"></fa-icon>
                                        </span>
                                    </transition>
                                </label>
                                <!-- The validation is discarted on the customers.profile because it makes a search unnecessary -->
                                <b-form-input
                                    autocomplete="off"
                                    debounce="500"
                                    id="dni"
                                    name="dni"
                                    type="text"
                                    v-model="dni"
                                    v-validate="(underage != true ? 'required' : '') + '|dnie|lengthDnie' + ($route.name != 'customers.profile' ? '|dniFounded:' + ($route.name != 'customers.new' ? getCustomerByField('dni', dni).filter(el => el._id != form._id).length : getCustomerByField('dni', dni).length) : '')"
                                    :class="{ 'is-invalid' : errors.has('dni') }"
                                    :disabled="isDisabled"
                                    @drop.prevent
                                    @keypress="$isAlphaNum($event)"
                                    @paste="dni = $isAlphaNum($event)"></b-form-input>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-for="error in errors.collect('dni')"
                                        :key="error">
                                        {{ error }}
                                    </b-form-invalid-feedback>
                                </transition>
                                <!-- Shown on customer edit -->
                                <SearchBadge
                                    field="dni"
                                    id="sb-customer-dni"
                                    searchField="dni"
                                    v-if="!isDisabled"
                                    :customer="true"
                                    :searchValue="dni"></SearchBadge>
                            </b-form-group>
                        </b-form-row>
    <!-- Tutor -->
                        <!-- Shown when the customer is underage or if the tutor exists -->
                        <TransitionExpand>
                            <div
                                v-if="underage == true || form.tutor">
                                <Tutor
                                    ref="tutor"
                                    :isDisabled="isDisabled"
                                    :underage="underage"></Tutor>
                            </div>
                        </TransitionExpand>
    <!-- Contacto -->
                        <TransitionExpand>
                            <div
                                class="mt-2"
                                v-if="form.contacts && form.contacts.length > 0">
                                <TransitionExpand group>
                                    <Contact
                                        ref="contact"
                                        v-for="(contact, index) in form.contacts"
                                        :isDisabled="isDisabled"
                                        :key="'contact_' + index"
                                        :index="index"></Contact>
                                </TransitionExpand>
                            </div>
                        </TransitionExpand>
                        <!-- Shown on customer edit -->
                        <b-row
                            class="my-3"
                            no-gutters
                            v-if="!isDisabled">
                            <ButtonIcon
                                icon="plus"
                                id="add-contacto"
                                variant="ig-gradient-reverse"
                                @click="addNewElement({ _id: form._id, element: 'contacts', entity: 'customer' })">
                                <span class="ml-1">
                                    Añadir persona de contacto
                                </span>
                            </ButtonIcon>
                        </b-row>
    <!-- Gestión de pagos -->
                        <b-form-group class="my-4">
                            <h5 class="subtitle" md="4">Datos de pago</h5>
                            <!-- v-if="form != null" -->
                            <b-form-row>
                                <b-col >
                                    <b-form-group
                                        class="p-0"
                                        id="tarifas-group"
                                        label="Tarifa"
                                        :disabled="isDisabled">
                                        <b-form-radio-group
                                            buttons
                                            button-variant="outline-secondary"
                                            class="flex-wrap radio-selector radiocheckgroup-spaced w-100"
                                            id="tarifa"
                                            name="tarifa"
                                            v-model="rate"
                                            v-validate="'required'"
                                            :class="{ 'is-invalid' : errors.has('tarifa') }"
                                            @change="selectAmount($event)">
                                            <b-form-radio
                                                v-b-tooltip.hover.noninteractive
                                                v-for="(v, k) in rates"
                                                :key="k"
                                                :title="!isDisabled ? (v != '' ? v + '€' : '') : ''"
                                                :value="k">
                                                {{ k }}
                                            </b-form-radio>
                                        </b-form-radio-group>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-if="errors.has('tarifa')">
                                                {{ errors.first('tarifa') }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" sm="2">
                                    <b-form-group label="Importe">
                                        <b-form-input
                                            min="0"
                                            name="importe"
                                            type="number"
                                            step="0.01"
                                            v-model="amount"
                                            v-validate="'required|decimal|between:0.1,9999.99'"
                                            :class="{ 'is-invalid' : errors.has('importe') }"
                                            :disabled="isDisabled || !rate.startsWith('Personalizada')"
                                            @drop.prevent
                                            @keypress="$isNumberDecimal($event)"></b-form-input>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                id="amout-payment-data"
                                                v-for="error in errors.collect('importe')"
                                                :key="error">
                                                {{ error }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                            <b-form-row>
                                <b-col cols="12" md>
                                    <b-form-group
                                        class="p-0"
                                        id="formas-pago-group"
                                        label="Formas de pago"
                                        :disabled="isDisabled">
                                        <b-form-radio-group
                                            buttons
                                            button-variant="outline-secondary"
                                            class="radio-selector w-100"
                                            id="tipoPago"
                                            name="tipoPago"
                                            v-validate="'required'"
                                            :checked="paymenttype"
                                            :class="{ 'is-invalid' : errors.has('tipoPago') }"
                                            :options="paymentTypes"
                                            @change="paymenttype = $event"></b-form-radio-group>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-if="errors.has('tipoPago')">
                                                {{ errors.first('tipoPago') }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                            <TransitionExpand>
                                <div
                                    v-if="paymenttype == 'Domiciliación'">
                                    <b-form-row>
                                        <b-col cols="12" md>
                                            <b-form-group
                                                label="IBAN"
                                                label-for="iban">
                                                <b-form-input
                                                    debounce="500"
                                                    id="iban"
                                                    name="iban"
                                                    placeholder="ES00 0000 0000 0000 0000"
                                                    v-model="iban"
                                                    v-validate="'required|iban'"
                                                    :class="{ 'is-invalid' : errors.has('iban') }"
                                                    :disabled="isDisabled || paymenttype != 'Domiciliación'"></b-form-input>
                                                <transition mode="out-in" name="liveFeedbacks">
                                                    <b-form-invalid-feedback
                                                        v-for="error in errors.collect('iban')"
                                                        :key="error">
                                                        {{ error }}
                                                    </b-form-invalid-feedback>
                                                </transition>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="12" md>
                                            <b-form-group
                                                label="Dni del titular"
                                                label-for="ibanownerdni">
                                                <!-- V-validate deshabilitado para pruebas  |dnie|lengthDnie' -->
                                                <b-form-input
                                                    debounce="500"
                                                    id="ibanownerdni"
                                                    name="ibanownerdni"
                                                    v-model="ibanownerdni"
                                                    v-validate="'required'"
                                                    :class="{ 'is-invalid' : errors.has('ibanownerdni') }"
                                                    :disabled="isDisabled || paymenttype != 'Domiciliación'"
                                                    @drop.prevent
                                                    @keypress="$isAlphaNum($event)"
                                                    @paste="ibanownerdni = $isAlphaNum($event)"></b-form-input>
                                                <transition mode="out-in" name="liveFeedbacks">
                                                    <b-form-invalid-feedback
                                                        v-for="error in errors.collect('ibanownerdni')"
                                                        :key="error">
                                                        {{ error }}
                                                    </b-form-invalid-feedback>
                                                </transition>
                                            </b-form-group>
                                        </b-col>
                                        <b-col cols="12" lg="6">
                                            <b-form-group
                                                label="Titular de la cuenta"
                                                label-for="ibanownername">
                                                <b-form-input
                                                    debounce="500"
                                                    id="ibanownername"
                                                    name="ibanownername"
                                                    v-model="ibanownername"
                                                    v-validate="'required|alpha_dash'"
                                                    :class="{ 'is-invalid' : errors.has('ibanownername') }"
                                                    :disabled="isDisabled || paymenttype != 'Domiciliación'"
                                                    @drop.prevent
                                                    @keypress="$isAlphaDash($event)"
                                                    @paste="ibanownername = $isAlphaDash($event)"></b-form-input>
                                                <transition mode="out-in" name="liveFeedbacks">
                                                    <b-form-invalid-feedback
                                                        v-for="error in errors.collect('ibanownername')"
                                                        :key="error">
                                                        {{ error }}
                                                    </b-form-invalid-feedback>
                                                </transition>
                                            </b-form-group>
                                        </b-col>
                                        <b-col
                                            cols="auto"
                                            v-if="!isDisabled">
                                            <span
                                                class="d-block"
                                                v-b-tooltip.hover.bottom.noninteractive
                                                :title="dni == '' || name == '' ? 'Debes rellenar el nombre y dni del socio' : ''">
                                                <b-button
                                                    class="align-unlabeled-lg"
                                                    variant="ig-outline-green"
                                                    :disabled="dni == '' || name == ''"
                                                    @click="fillIbanData()">Usar dni y nombre del socio</b-button>
                                            </span>
                                        </b-col>
                                    </b-form-row>
                                </div>
                            </TransitionExpand>
                        </b-form-group>
    <!-- Pagos -->
                        <!-- When the customer doesn't have payments show an alert -->
                        <b-form-group
                            :class="hasPayments ? 'mb-0' : 'mb-3'">
                            <h5 md="4" class="subtitle">Gestión de pagos</h5>
                            <b-row
                                class="mb-2"
                                no-gutters
                                v-if="$route.name == 'customers.profile'">
                                <ButtonIcon
                                    class="ml-auto"
                                    icon="euro-sign"
                                    variant="ig-gradient"
                                    @click="newPaymentTrigger()">
                                    Añadir nuevo pago
                                </ButtonIcon>
                            </b-row>
                            <b-alert
                                class="py-1"
                                show
                                variant="info"
                                v-if="hasPayments && $route.name == 'customers.edit' && !isDisabled">
                                Los cambios que hagas en los pagos se guardan al aplicarlos.
                            </b-alert>
                            <Payments
                                v-if="hasPayments"
                                :parentId="form._id"
                                :filters="['status', 'interval', 'type', 'paymenttype', 'creationdate', 'confirmationdate']"
                                :isDisabled="isDisabled"
                                :tableFields="paymentsTableFields"
                                :itemsPerPage="10"></Payments>
                            <span
                                v-else-if="!hasPayments">
                                <b-alert class="py-1" show variant="secondary">
                                    El socio aún no tiene pagos, en cuanto se generen los verás aquí.
                                </b-alert>
                            </span>
                        </b-form-group>
    <!-- Cinturones -->
                        <TransitionExpand>
                            <!-- Shown if the customer has a grade acquired or if the rate includes karate -->
                            <div
                                v-if="rate.includes('Karate') || form.belts">
                                <b-form-group
                                    class="mb-4"
                                    id="main-edit-cinturones">
                                    <h5 md="4" class="subtitle">Histórico de grados</h5>
                                    <BeltsRow
                                        :customer="form"
                                        :isDisabled="isDisabled"></BeltsRow>
                                </b-form-group>
                            </div>
                        </TransitionExpand>
    <!-- Firma y documentos -->
                        <b-form-group>
                            <h5 md="4" class="subtitle">Firma y documentos</h5>
                            <b-alert
                                class="mt-2"
                                show
                                variant="danger"
                                v-if="$route.name == 'customers.new'">
                                La firma del socio es imprescindible para recibos y documentos, <u>inclúyela siempre</u>
                                <span
                                    v-if="underage">
                                    <br><br>
                                    <u>Atención: El socio es menor y debe firmar su tutor, recuerda rellenar correctamente el nombre, apellidos y dni del TUTOR</u>
                                </span>
                                <span
                                    v-else>
                                    <br><br>
                                    <u>Atención: Recuerda rellenar correctamente el nombre, apellidos y dni del socio relacionados con la firma</u>
                                </span>
                            </b-alert>
                            <b-alert
                                dismissible
                                show
                                variant="warning"
                                v-if="$route.name != 'customers.new' && form.tutor && wasUnderage && !underage">
                                <u>Importante: El socio se dio de alta como menor por lo que está vinculado a un tutor, a día de hoy ya no es menor pero existe un tutor y la firma puede estar vinculada a él. Recuerda que debes actualizar la firma si estuviera vinculada al tutor y borrar los datos del tutor si ya no fueran necesarios</u>
                            </b-alert>
                            <b-row>
                                <b-col class="col-12 col-md-6 mb-4 mb-md-0">
                                    <WacomSign
                                        ref="wacomsign"
                                        :isDisabled="isDisabled"
                                        :form="form"
                                        :underage="underage"></WacomSign>
                                </b-col>
                                <b-col class="my-auto">
                                    <b-row>
                                        <b-col class="text-right" cols="7">
                                            <label>
                                                Acepta consentimiento expreso
                                            </label>
                                        </b-col>
                                        <b-col class="p-0">
                                            <b-form-group
                                                class="d-inline mr-3"
                                                :disabled="isDisabled">
                                                <b-form-radio-group
                                                    buttons
                                                    button-variant="outline-secondary"
                                                    class="radio-selector tiny-radio-selector"
                                                    id="rightsProtect"
                                                    name="rightsProtect"
                                                    size="sm"
                                                    v-validate="'required'"
                                                    :checked="RPaccept"
                                                    :class="{ 'is-invalid' : errors.has('rightsProtect') && !isDisabled }"
                                                    :options="yesno"
                                                    :state="errors.has('rightsProtect')"
                                                    @change="RPaccept = $event"></b-form-radio-group>
                                                <transition mode="out-in" name="liveFeedbacks">
                                                    <b-form-invalid-feedback
                                                        v-if="errors.has('rightsProtect')">
                                                        {{ errors.first('rightsProtect') }}
                                                    </b-form-invalid-feedback>
                                                </transition>
                                            </b-form-group>
                                            <b-form-group
                                                class="d-inline-block"
                                                v-b-tooltip.hover.noninteractive
                                                :title="RPaccept == false ? 'No hay nada que imprimir: el socio no ha dado su consentimiento' : RPaccept == null ? 'El socio no ha confirmado esta opción' : printRightsProtect == true ? 'Descargando...' : 'Descargar consentimiento expreso'">
                                                <b-button
                                                    class="btn-fa-tiny"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    v-if="$route.name != 'customers.new'"
                                                    :disabled="printRightsProtect || (RPaccept == false || RPaccept == null)"
                                                    @click="printFile('RP')">
                                                    <b-spinner
                                                        small
                                                        type="grow"
                                                        v-if="printRightsProtect == true"></b-spinner>
                                                    <fa-icon
                                                        icon="file-download"
                                                        v-else></fa-icon>
                                                </b-button>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col class="text-right" cols="7">
                                            <label>
                                                Acepta la cesión de imagen
                                            </label>
                                        </b-col>
                                        <b-col class="p-0">
                                            <b-form-group
                                                class="d-inline mr-3"
                                                :disabled="isDisabled">
                                                <b-form-radio-group
                                                    buttons
                                                    button-variant="outline-secondary"
                                                    class="radio-selector tiny-radio-selector"
                                                    id="rightsImage"
                                                    name="rightsImage"
                                                    size="sm"
                                                    v-validate="'required'"
                                                    :checked="RIaccept"
                                                    :class="{ 'is-invalid' : errors.has('rightsImage') && !isDisabled }"
                                                    :options="yesno"
                                                    :state="errors.has('rightsImage')"
                                                    @change="RIaccept = $event"></b-form-radio-group>
                                                <transition mode="out-in" name="liveFeedbacks">
                                                    <b-form-invalid-feedback
                                                        v-if="errors.has('rightsImage')">
                                                        {{ errors.first('rightsImage') }}
                                                    </b-form-invalid-feedback>
                                                </transition>
                                            </b-form-group>
                                            <b-form-group
                                                class="d-inline-block"
                                                v-b-tooltip.hover.noninteractive
                                                :title="RIaccept == false ? 'No hay nada que imprimir: el socio no ha dado su consentimiento' : RIaccept == null ? 'El socio no ha confirmado esta opción' : printRightsImage == true ? 'Descargando...' : 'Descargar cesión de imagen'">
                                                <b-button
                                                    class="btn-fa-tiny"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    v-if="$route.name != 'customers.new'"
                                                    :disabled="printRightsImage || (RIaccept == false || RIaccept == null)"
                                                    @click="printFile('RI')">
                                                    <b-spinner
                                                        small
                                                        type="grow"
                                                        v-if="printRightsImage == true"></b-spinner>
                                                    <fa-icon
                                                        icon="file-download"
                                                        v-else></fa-icon>
                                                </b-button>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <NotesBase
                            target="customer"
                            :_id="form._id"
                            :inNotes="form.notes"
                            :isDisabled="isDisabled"></NotesBase>
                        <!-- Hided printable docs -->
                        <div
                            class="printable-wrp">
                            <div class="pr-1 printable-ctn" ref="printableMFRP">
                                <RightsProtect
                                    :customer="getCustomerById($route.params.id)"></RightsProtect>
                            </div>
                            <div class="pr-1 printable-ctn" ref="printableMFRI">
                                <RightsImage
                                    :customer="getCustomerById($route.params.id)"></RightsImage>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </b-skeleton-wrapper>
            <b-row
                class="py-3"
                no-gutters
                v-if="!loadingCustomer">
                <!-- <b-col cols="auto">
                    <b-button
                        v-if="$route.name != 'customers.profile'"
                        @click="validateForm()">
                        <fa-icon class="d-inline-block mr-2" icon="check"></fa-icon>
                        Validar
                    </b-button>
                </b-col> -->
                <b-col cols="auto">
                    <b-button
                        variant="outline-secondary"
                        v-if="$route.name == 'customers.new'"
                        @click="clearForm('form'); $changeText('empty-form-btn-text', '¡Vaciado!', 2500)">
                        <fa-icon class="d-inline-block mr-2" icon="eraser"></fa-icon>
                        <span id="empty-form-btn-text">
                            Vaciar formulario
                        </span>
                    </b-button>
                </b-col>
                <b-col>
                    <b-row align-h="end" no-gutters>
                        <b-button
                            key="mf-btn-submit"
                            type="submit"
                            variant="ig-solid-green"
                            v-if="$route.name == 'customers.edit' || $route.name == 'customers.new'">
                            <b-spinner
                                small
                                type="grow"
                                v-if="submitting == true"></b-spinner>
                            <fa-icon
                                icon="save"
                                v-else></fa-icon>
                            <span class="d-inline-block ml-2">
                                Guardar
                            </span>
                        </b-button>
                        <b-button
                            class="ml-2"
                            key="mf-btn-edit"
                            v-if="$route.name == 'customers.edit' || $route.name == 'customers.profile'"
                            :disabled="submitting"
                            :variant="$route.name == 'customers.edit' ? 'warning' : 'primary'"
                            @click="manageEditBtn()">
                            <fa-icon
                                :icon="$route.name == 'customers.edit' ? 'sync-alt' : 'edit'"></fa-icon>
                            <span class="d-inline-block ml-2">
                                {{ $route.name == 'customers.edit' ? 'Cancelar la edición': 'Editar al socio' }}
                            </span>
                        </b-button>
                    </b-row>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>
<script>
    import { http } from '../utils/http';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import constants from '../utils/constants';
    import NProgress from 'nprogress';

    /**
     * Map the keys passed to mount their vuex getters and setters
     *
     * @param {Array} keys: strings to make their getters and setters
     *
     * @returns the object composed by the getters and setters
     */
    function computeBaseFields(keys) {
        let result = {};
        keys.forEach(key => {
            result[key] = {
                get() {
                    return this.form[key];
                },
                set(value) {
                    /* Uppercase the texts values */
                    if (['address', 'dni', 'name'].includes(key)) {
                        value = value.toUpperCase();
                    }
                    /* The id will be null on customers.new page, this is managed at vuex */
                    this.updateFormData({ _id: this.form._id, field: key, newVal: value });
                    /* A customer has be at minium 2 years old */
                    if (key == 'dateofbirth') {
                        /* If the customer is underage and no tutor has been added to the form, add it */
                        this.underage === true && !this.form.tutor && this.addNewElement({ _id: this.form._id, element: 'tutor', entity: 'customer' });
                        /* If the customer is not underage and the form has a tutor delete it if the tutor has no data */
                        this.underage === false && this.form.tutor && JSON.stringify(this.getDefaultState('tutor')) === JSON.stringify(this.form.tutor) && this.delFormObjElement({ state: this.form, target: 'tutor' });
                        /* If the dateofbirth is not correct (under 2 years) delete de tutor if exists and if has no data */
                        this.underage === null && this.form.tutor && JSON.stringify(this.getDefaultState('tutor')) === JSON.stringify(this.form.tutor) && this.delFormObjElement({ state: this.form, target: 'tutor' });
                    }
                }
            }
        });
        return result;
    };
    /**
     * Map the keys on the object passeds to mount their vuex getters and setters
     *
     * @param {Array} keys: strings to make their getters and setters
     * @param {String} object: the name of the parent object of the keys
     *
     * @returns the object composed by the getters and setters of the parent passed
     */
    function computeObjectFields(keys, object) {
        let result = {};
        keys.forEach(key => {
            result[key] = {
                get() {
                    return this.form[object][key];
                },
                set(value) {
                    /* Uppercase the texts values */
                    if (['ibanownername', 'ibanownerdni'].includes(key)) {
                        value = value.toUpperCase();
                    }
                    /* The id will be null on customers.new page, this is managed at vuex */
                    this.updateFormData({ _id: this.form._id, objectKey: object, field: key, newVal: value });
                    /* The legal accepts or declines needs to add the current date */
                    (object == 'rightsImage' || object == 'rightsProtect' || object == 'rightsUnderage') && this.updateFormData({ _id: this.form._id, objectKey: object, field: 'date', newVal: this.$moment().format('DD-MM-YYYY HH:mm:ss') });
                    /* If the rate includes karate the form must have the belts if not has it already */
                    key == 'rate' && value.includes('Karate') && !this.form.belts && this.addNewElement({ _id: this.form._id, element: 'belts', entity: 'customer' });
                    /* If the rate doesn't include karate and the belts are added but remains in its pristine status delete it */
                    key == 'rate' && !value.includes('Karate') && this.form.belts && (JSON.stringify(this.getDefaultState('belts')) === JSON.stringify(this.form.belts)) && this.delFormObjElement({ state: this.form, target: 'belts' });
                }
            }
        });
        return result;
    };
    export default {
        data() {
            return {
                beltsNewDate: '', /* v-model to the new belts ndate */
                genders: [
                    { text: 'Mujer', value: 'mujer' },
                    { text: 'Hombre', value: 'hombre' },
                ], /* Options to gender selector */
                isDisabled: false, /* Flag to determine the disable state of the editable fields, on edit always is loaded as true */
                loadingCustomer: true, /* Flag to activate/deactivate the form skeleton */
                newNote: null, /* V-model for a new note */
                paymentsTableFields: [
                    { key: 'rate', label: 'Tarifa', sortable: true, },
                    { key: 'amount', label: 'Importe', sortable: true, },
                    { key: 'paymenttype', label: 'Forma de pago', sortable: true, },
                    { key: 'interval', label: 'Periodo', sortable: true, },
                    { key: 'status', label: 'Estado', sortable: true, },
                    { key: 'actions', label: 'Acciones', class: 'text-center'},
                ], /* Payment table fields */
                paymentTypes: [ 'Domiciliación', 'Tarjeta', 'Efectivo' ], /* Options to the checkbox of the payment types */
                printRightsImage: false, /* Flag to improve userx on print */
                printRightsProtect: false, /* Flag to improve userx on print */
                printRightsUnderage: false, /* Flag to improve userx on print */
                selectedBelts: [], /* Grades selected to delete */
                submitting: false, /* Flag to avoid alert the customer at the page leave */
                yesno: [
                    { value: true, text: 'Sí' },
                    { value: false, text: 'No' }
                ], /* Options for select element */
            }
        },
        beforeRouteEnter(to, from, next) {
            /* If we are on a customer edit */
            if (to.name == 'customers.edit') {
                next(vm => {
                    /* Change the submit flag */
                    vm.submitting = false;
                    /* Set the skeleton flag */
                    vm.loadingCustomer = true;
                    /* Enable the editable fields of the form */
                    vm.isDisabled = false;
                    /* Pause the validations before load the new customer to prevent validation errors at assign the validation again to the reusable components */
                    vm.$validator.pause();
                    /* To reload the data between customers is mandatory clean before */
                    if (from.name == 'customers.profile' || from.name == 'customers.edit') {
                        vm.clearForm('editform');
                    }
                    /* Load the customer */
                    vm.initEditForm(vm.$route.params.id)
                        .then(() => {
                            /* Start vee-validate stopped */
                            vm.$validator.resume();
                            /* Reset all the previous validations */
                            vm.$validator.reset();
                            /* Set the skeleton flag */
                            vm.loadingCustomer = false;
                        });
                });
            /* If we are seeing a existing customer */
            } else if (to.name == 'customers.profile') {
                next(vm => {
                    /* Change the submit flag */
                    vm.submitting = false;
                    /* Set the skeleton flag */
                    vm.loadingCustomer = true;
                    /* Disable all the editable fields of the form */
                    vm.isDisabled = true;
                    /* Pause the validations before load the new customer to prevent validation errors at assign the validation again to the reusable components */
                    vm.$validator.pause();
                    /* To reload the data between customers is mandatory clean before */
                    if (from.name == 'customers.profile' || from.name == 'customers.edit') {
                        vm.clearForm('editform');
                    }
                    /* Load the customer */
                    vm.initEditForm(vm.$route.params.id)
                        .then(() => {
                            /* Start vee-validate stopped @beforeRouteLeave */
                            vm.$validator.resume();
                            /* Reset all the previous validations */
                            vm.$validator.reset();
                            /* Set the skeleton flag */
                            vm.loadingCustomer = false;
                        });
                });
            /* If are creating a new customer */
            } else if (to.name == 'customers.new') {
                next(vm => {
                    /* Change the submit flag */
                    vm.submitting = false;
                    /* Pause the validations before load the new customer to prevent validation errors at assign the validation again to the reusable components */
                    vm.$validator.pause();
                    /* Start vee-validate stopped @beforeRouteLeave */
                    vm.$validator.resume();
                    /* Reset all the previous validations */
                    vm.$validator.reset();
                    /* Enable the fields of the form */
                    vm.isDisabled = false;
                    /* Set the skeleton flag */
                    vm.loadingCustomer = false;
                });
            }
        },
        beforeRouteLeave(to, from, next) {
            /* The confirm must not be shown on 404 redirections */
            if (to.name == '404') {
                next();
            } else {
                /* Stops the webcam and sign components */
                this.$refs.webcamcomponent && this.$refs.webcamcomponent.cancel();
                // this.$refs.wacomsign.disconnect();
                /* Confirm the left with the user */
                let answer = true;
                if (!this.submitting && from.name != 'customers.profile') {
                    answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                    if (!answer) {
                        next(false);
                    }
                }
                if (answer) {
                    /* Pause the validations before leave the page to prevent errors at assign the validation again to the reusable components */
                    this.$validator.pause();
                    next();
                }
            }
        },
        beforeRouteUpdate (to, from, next) {
            /* Set the skeleton flag */
            this.loadingCustomer = true;
            /* Stops the webcam and sign components */
            this.$refs.webcamcomponent.cancel();
            // this.$refs.wacomsign.disconnect();
            /* Stops the validation to avoid false errors */
            this.$validator.pause();
            let result = true;
            if (!this.submitting && from.name != 'customers.profile') {
                result = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
            }
            if (result) {
                if (to.name == 'customers.profile' || to.name == 'customers.edit') {
                    /* To reload the data between customers is mandatory clean before */
                    if (from.name == 'customers.profile' || from.name == 'customers.edit') {
                        this.clearForm('editform');
                    }
                    if (to.name == 'customers.profile'){
                        /* Disable all the editable fields of the form */
                        this.isDisabled = true;
                    }
                    /* Load the editform state */
                    this.initEditForm(to.params.id)
                        .then((response) => {
                            next();
                            /* Set the skeleton flag */
                            this.loadingCustomer = false;
                            this.$validator.resume();
                        });
                }
                if (to.name == 'customers.new') {
                    /* Load the new customer form */
                    this.initForm(to.params.id)
                        .then((response) => {
                            console.log('setting form form on route update')
                            next();
                            /* Set the skeleton flag */
                            this.loadingCustomer = false;
                            this.$validator.resume();
                        });
                }
            }
        },
        created() {
            /* Prevents leave the page when changes has been made */
            window.addEventListener('beforeunload', this.beforeUnload);
            /* Listen to the resize and load changes */
            window.addEventListener('resize', this.stackRadios);
            window.addEventListener('load', this.stackRadios);
        },
        computed: {
            /* Mount the vuex getters and setters to the local form fields (the childrens has its computations too) */
            ...computeBaseFields(['active', 'address', 'dateofbirth', 'dni', 'gender', 'name', /* 'notes' */]),
            /* The paymentData unused is necessary? */
            ...computeObjectFields(['rate', 'amount', 'paymenttype', 'iban', 'ibanownername', 'ibanownerdni',], 'paymentData'),
            ...computeObjectFields(['RIaccept', 'date'], 'rightsImage'),
            ...computeObjectFields(['RPaccept', 'date'], 'rightsProtect'),
            ...computeObjectFields(['RUaccept', 'date'], 'rightsUnderage'),
            /* Mapping vuex */
            ...mapGetters(['getCustomerByField', 'getCustomerById', 'getDefaultState', 'isTutor']),
            ...mapState({
                newCustomerForm: state => state.form,
                editCustomerForm: state => state.editform,
            }),
            /**
             * Defines the current form state (edit or new customer)
             *
             * @return {Object} The object with the form data from the customers state
             */
            form() {
                return this.$route.name == 'customers.new' ? this.newCustomerForm : this.editCustomerForm;
            },
            /**
             * Determine if the current form state has belts setted
             *
             * @returns {Boolean} Boolean that indicates if the current customer has or not any belt reached
             */
            hasBelts() {
                return this.form.belts && this.form.belts.some(belt => belt.date != null);
            },
            /**
             * Determine if the current form state has payments registered
             *
             * @returns {Boolean} Boolean that indicates if the current customer has or not any payment registered
             */
            hasPayments() {
                return this.form.payments && this.form.payments.length > 0;
            },
            /**
             * Initizalize locally the constant imported for the rates
             */
            rates() {
                return constants.RATES;
            },
            /**
             * Determines if the current dateofbirth selected is between 3 and 18
             *
             * @return {Boolean|Null} If the age is under 2 years returns null, if the age is between 2 and 18 returns true, if is 18 or more returns false
             */
            underage() {
                if (this.$moment(this.dateofbirth, 'YYYY-MM-DD', true).isValid() && 2 <= this.$moment().diff(this.$moment(this.dateofbirth, 'YYYY-MM-DD', true), 'years')) {
                    return this.$moment().diff(this.$moment(this.dateofbirth, 'YYYY-MM-DD'), 'years') < 18;
                }
                return null;
            },
            /**
             * Determine if a customer was underage on the signup date
             *
             * @return {Boolean} If the customer was underage on the signup date returns true
             */
            wasUnderage() {
                return this.$moment(this.form.created_at, 'YYYY-MM-DD').diff(this.$moment(this.dateofbirth, 'YYYY-MM-DD')) < 18;
            }
        },
        destroyed() {
            /* Destroy de listeners */
            window.removeEventListener('beforeunload', this.beforeUnload);
            window.removeEventListener('resize', this.stackRadios);
            window.removeEventListener('load', this.stackRadios);
        },
        methods: {
            /* Mapping vuex */
            ...mapActions(['addNewElement', 'clearForm', 'cleanFormOnSubmit', 'delFormObjElement', 'initEditForm', 'initForm', 'submitFormAddCustomer', 'submitFormEditCustomer', 'updateFormData']),
            /**
             * Prevent leave the page with changes unsaved
             *
             * @param {Event} ev: the event fired
             */
            beforeUnload(ev) {
                let answer = true;
                /* From Chrome 60 onward, the beforeunload dialog will only appear if the frame attempting to display it has received a user gesture or user interaction (or if any embedded frame has received such a gesture). */
                if (!this.submitting && this.$route.name != 'customers.profile') {
                    answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                    if (!answer) {
                        ev.preventDefault();
                        /* Chromium requires returnValue to stop the default propagation */
                        ev.returnValue = '';
                    }
                }
            },
            /**
             * Fill the iban owner data with the customer data
             */
            fillIbanData() {
                this.ibanownername = this.name; /* Maybe is not uppercase */
                this.ibanownerdni = this.dni;
                if (this.iban == '' || this.iban == null) {
                    this.$validator.validate('iban');
                }
            },
            /**
             * Launch the front end validation
             */
            async formValidation() {
                /* First of all validate de form (at the backend it will be validated too) */
                await this.$validator.validateAll();
                let errors = this.errors.all().length;
                // **NO VALIDATE THE SIGN FOR NOW
                // const signErrors = await this.$refs.wacomsign.validate();
                // errors += signErrors;
                /* Validate the tutor errors */
                if (this.form.tutor) {
                    const tutorErrors = await this.$refs['tutor'].validate();
                    errors += tutorErrors.length;
                }
                /* Validate the contact(s) errors */
                if (this.form.contacts && this.form.contacts.length > 0) {
                    let contactErrors;
                    await Promise.all(this.form.contacts.map(async (contact, index) => {
                            contactErrors = await this.$refs.contact[index].validate();
                        })
                    );
                    if (contactErrors) {
                        errors += contactErrors.length;
                    }
                }
                if (errors > 0) {
                    /* Change the submit flag */
                    this.submitting = false;
                    await this.$bvModal.msgBoxOk('Se han encontrado ' + errors + ' errores en el formulario. Revisa los campos marcados.', {
                        buttonSize: 'sm',
                        centered: true,
                        okTitle: 'Aceptar',
                        size: 'sm',
                        title: 'Hay campos incorrectos',
                    })
                    return false;
                }
                return true;
            },
            /**
             * Prompt to the user a confirm message when the edition of the customer wants to be cancelled
             *
             * @return {Promise} A promise with the new route to navigate
             */
            manageEditBtn() {
                if (this.$route.name == 'customers.edit') {
                    return this.$router.push({ name: 'customers.profile', params: { id: this.form._id } });
                } else {
                    return this.$router.push({ name: 'customers.edit', params: { id: this.form._id } });
                }
            },
            /**
             * Triggers the new payment form for the current customer
             */
            newPaymentTrigger() {
                this.$bvModal.show('payments-nav-modal')
                this.$nextTick(() => {
                    this.$root.$emit('newPaymentFromCustomer', this.form);
                })
            },
            /**
             * Download the documentation
             *
             * @param {String} file: informs the file to download
             *
             * @return {Promise}
             */
            printFile(file) {
                return new Promise((resolve, reject) => {
                    const filename = this.form.name.replace(/\s/g, '') + '__' + (file == 'RI' ? 'derechosdeimagen' : 'proteccióndedatos') + '__' + this.$moment().format('YYYY-MM-DD_HH_mm') + '.pdf';
                    const variable = file == 'RI' ? 'printRightsImage' : 'printRightsProtect';
                    /* Active the flag to userx and disallow multiple downloads */
                    this[variable] = true;
                    this.$showToast('success', 'En breve se iniciará la descarga del fichero', 'Descarga de fichero solicitada');
                    this.$printDoc(filename, this.$refs['printableMF' + file])
                        .then(() => {
                            /* Restore the flag to userx and disallow multiple downloads */
                            setTimeout(() => {
                                this[variable] = false;
                            }, 300);
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            /**
             * Sets the value of the amount field based on the rate selected, the custome rates (personalizadas) let the amount field editable
             */
            selectAmount(ev) {
                this.amount = this.rates[ev];
            },
            /**
             * Manages the stacking of the radio selectors
             */
            stackRadios() {
                if (!this.loadingCustomer) {
                    if (window.innerWidth < 470) {
                        document.getElementById('tipoPago').classList.add('btn-group-vertical');
                        document.getElementById('tipoPago').classList.remove('btn-group');
                    } else if (window.innerWidth >= 470 && (document.getElementById('tarifa').classList.contains('btn-group-vertical') || document.getElementById('tipoPago').classList.contains('btn-group-vertical'))) {
                        document.getElementById('tipoPago').classList.remove('btn-group-vertical');
                        document.getElementById('tipoPago').classList.add('btn-group');
                    }
                }
            },
            /**
             * Submits the form with the new customer data
             */
            async submit() {
                /* Change the submit flag */
                this.submitting = true;
                /* Check if the font validations was passed before call the api (the api will do its own validation) */
                const isValid = await this.formValidation();
                if (isValid === true) {
                    try {
                        this.loadingCustomer = true;
                        /* Call to apply the changes to a existing customer or create one depending on the current route */
                        if (this.$route.name == 'customers.edit') {
                            this.submitFormEditCustomer();
                        } else if (this.$route.name == 'customers.new') {
                            this.submitFormAddCustomer();
                        }
                    } catch(error) {
                        this.submitting = false;
                        this.loadingCustomer = false;
                        if (error.response) {
                            let message = error.response.data.message;
                            /* Check if a validation errors occurs on the backend */
                            if (error.response.status == 422) {
                                let errors = error.response.data.validationErrors;
                                for (let error in errors) {
                                    message += '<br><span class="text-danger">- ' + errors[error][0]; + '</span>'
                                };
                                const errorMessage = this.$createElement('div',
                                {
                                    domProps: { innerHTML: message }
                                })
                                /* If a validation error on the backend occurs, show the info on a modal */
                                this.$bvModal.msgBoxOk(errorMessage, {
                                    buttonSize: 'sm',
                                    centered: true,
                                    okTitle: 'Aceptar',
                                    size: 'sm',
                                    title: error.response.data.title,
                                })
                                NProgress.done();
                            }
                            console.error(error.response.data.trace);
                        } else {
                            this.$showToast('danger', 'No se han podido guardar los datos correctamente. Código de error: FESoFo@Su', 'Ha ocurrido un error');
                            console.error(error);
                        }
                    }
                }
            },
        },
        /**
         * Provide the same $validator to the childs
         */
        provide() {
            return {
                $validator: this.$validator,
            }
        },
    }
</script>
<style>
    .ig-add-button {
        overflow: hidden;
        max-width: 40px;
        transition: max-width 1s ease;
        white-space: nowrap;
    }
    .ig-add-button.expanded,
    .ig-add-button:hover {
        max-width: 600px;
    }
    #tarifas-group label.btn {
        padding: 0.375rem 0.5rem!important
    }
</style>
<style scoped>
    .card-body {
        overflow: hidden;
    }
    .customer-dates {
        white-space: nowrap;
    }
    /* Normalize the height of the inline buttons-radios */
    .tiny-radio-selector {
        height: 32.3px!important;
    }
    .tiny-radio-selector .btn.btn-sm {
        line-height: 1;
    }
    #tarifa {
        white-space: nowrap;
    }
</style>

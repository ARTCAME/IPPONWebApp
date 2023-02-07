<template>
    <b-modal
        centered
        hide-footer
        hide-header
        id="payment-edit-modal"
        scrollable
        size="xl"
        @hidden="$manageScrollBar(false)"
        @show="$manageScrollBar(false)">
        <template #default>
            <PaymentForm
                :toEditItem="editingItem"
                @cancel="$bvModal.hide('payment-edit-modal')"
                @delete="$bvModal.hide('payment-edit-modal')"
                @successSaved="$bvModal.hide('payment-edit-modal'); successSaved(...arguments)">
            </PaymentForm>
        </template>
    </b-modal>
</template>

<script>
    export default {
        methods: {
            /**
             * Emit to the parent the update of a payment
             */
            successSaved(payment) {
                /* The parent needs to know the new data to evaluate the state of the payment updated on the posible actived procedures */
                this.$emit('successEdit', payment.payment_id)
            }
        },
        props: [
            'editingItem',
        ],
    }
</script>
<style>
    #payment-edit-modal .modal-dialog {
        min-width: 600px!important
    }
</style>
